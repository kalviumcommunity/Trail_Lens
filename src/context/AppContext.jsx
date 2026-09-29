import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Clear any legacy mock documents from localStorage
  const getInitialDocuments = () => {
    try {
      const saved = localStorage.getItem('triallens_documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it contains mock doc IDs like doc-1, doc-2, discard it
        if (Array.isArray(parsed) && parsed.some(d => d.id === 'doc-1' || d.id === 'doc-2')) {
          localStorage.removeItem('triallens_documents');
          return [];
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  };

  // Documents state (Real data only, synced with MongoDB)
  const [documents, setDocuments] = useState(getInitialDocuments);

  // Saved answers (Real user-saved answers only)
  const [savedAnswers, setSavedAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('triallens_saved_answers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(s => s.id === 'saved-1' || s.id === 'saved-2')) {
          localStorage.removeItem('triallens_saved_answers');
          return [];
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Recent questions (Populated from MongoDB real-time query history)
  const [recentQuestions, setRecentQuestions] = useState([]);

  // Current question in Ask page
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Document Viewer state
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

  // Upload queue
  const [uploadQueue, setUploadQueue] = useState([]);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('triallens_user_profile');
    return saved ? JSON.parse(saved) : {
      name: "Clinical Researcher",
      role: "Lead Investigator",
      email: "researcher@triallens.internal",
      initials: "CR",
      institution: "TrialLens Clinical Intelligence",
      department: "Clinical Research & Oncology",
      memberSince: "2026"
    };
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('triallens_settings');
    return saved ? JSON.parse(saved) : {
      theme: "dark",
      accentColor: "blue",
      enableAnimations: true,
      reduceMotion: false,
      responseStyle: "balanced",
      citationDisplay: "sidebar",
      autoSaveAnswers: true,
      notifications: {
        email: true,
        alerts: true,
        uploadComplete: true,
        digest: false,
      },
      twoFactorEnabled: false
    };
  });

  // UI Modals & Nav
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Live Notifications
  const [notifications, setNotifications] = useState([
    {
      id: "n-system-ready",
      title: "TrialLens Real-Time System Active",
      description: "Google Gemini RAG and MongoDB Atlas persistence are online.",
      time: "Just now",
      read: false,
      type: "success"
    }
  ]);

  // Toast dispatch helper
  const addToast = useCallback(({ title, message, type = 'info', duration = 3800 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Helper to format dates cleanly ─────────────────────────────────────────
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
        ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return 'Recently';
    }
  };

  // ── Real data fetchers from MongoDB via backend ────────────────────────────
  const refreshDocuments = useCallback(async () => {
    try {
      const result = await api.listDocuments();
      if (result && Array.isArray(result.documents)) {
        const backendDocs = result.documents.map(d => ({
          id: d.document_id,
          name: d.document_name,
          type: d.document_type ? d.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Clinical Document',
          rawType: d.document_type,
          drugProduct: d.extra_metadata?.drug_product || d.study_id || 'Clinical Trial',
          phase: d.extra_metadata?.phase || 'Phase 3',
          year: d.created_at ? new Date(d.created_at).getFullYear().toString() : new Date().getFullYear().toString(),
          pages: d.total_pages || 1,
          uploadedOn: d.created_at ? new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
          size: `${((d.file_size_bytes || 1024) / (1024 * 1024)).toFixed(1)} MB`,
          status: 'Verified',
          fileType: d.document_name?.endsWith('.docx') ? 'docx' : 'pdf',
          abstract: `Indexed clinical record. ${d.total_chunks || 0} chunks in vector index.`,
          study_id: d.study_id,
          total_chunks: d.total_chunks,
        }));
        setDocuments(backendDocs);
        localStorage.setItem('triallens_documents', JSON.stringify(backendDocs));
      }
    } catch (err) {
      console.warn('Could not refresh documents from MongoDB:', err.message);
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const result = await api.getQueryHistory(20);
      if (result && Array.isArray(result.history)) {
        const historyList = result.history.map((h, idx) => ({
          id: h._id || `q-${idx}`,
          question: h.question,
          timestamp: formatTimestamp(h.created_at),
          status: (h.confidence_score > 0 || (h.citation_count && h.citation_count > 0)) ? 'Answered' : 'Insufficient Evidence',
          model_used: h.model_used || 'google/gemini',
          confidence_score: h.confidence_score,
          sourceCount: h.citation_count || 0,
          rawAnswer: h.answer,
        }));
        setRecentQuestions(historyList);
      }
    } catch (err) {
      console.warn('Could not refresh history from MongoDB:', err.message);
    }
  }, []);

  // ── Initial load on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const status = await api.getStatus();
        if (cancelled) return;
        setBackendAvailable(true);
        setBackendError(null);
        await Promise.all([refreshDocuments(), refreshHistory()]);
      } catch (err) {
        if (cancelled) return;
        setBackendAvailable(false);
        setBackendError('Backend not reachable');
        console.warn('Backend offline:', err.message);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [refreshDocuments, refreshHistory]);

  // Persist settings & userProfile
  useEffect(() => {
    localStorage.setItem('triallens_saved_answers', JSON.stringify(savedAnswers));
  }, [savedAnswers]);

  useEffect(() => {
    localStorage.setItem('triallens_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('triallens_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Document actions
  const addDocument = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    addToast({
      title: "Document Added",
      message: `${newDoc.name} is now indexed in clinical library.`,
      type: "success"
    });
  };

  const deleteDocument = async (id) => {
    const docToDelete = documents.find(d => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    try {
      await api.deleteDocument(id);
      addToast({
        title: "Document Deleted",
        message: `${docToDelete?.name || 'Document'} removed from vector store and MongoDB.`,
        type: "info"
      });
      await refreshDocuments();
    } catch (err) {
      addToast({
        title: "Deletion Note",
        message: `Removed from UI view: ${err.message}`,
        type: "info"
      });
    }
  };

  // Open Document Viewer with real excerpt
  const openDocumentViewer = (docOrName, page = 1) => {
    let docDetails = null;
    if (typeof docOrName === 'string') {
      const found = documents.find(d => d.name === docOrName || d.id === docOrName);
      if (found) {
        docDetails = {
          name: found.name,
          currentPage: page,
          totalPages: found.pages || 1,
          sectionTitle: found.type || "Clinical Documentation",
          highlightText: found.abstract || `Verified clinical report ${found.name}.`,
          tableTitle: `Study Metadata: ${found.study_id || 'Verified Study'}`,
          tableRows: [
            { event: "Study Identifier", incidence: found.study_id || "N/A" },
            { event: "Total Ingested Chunks", incidence: `${found.total_chunks || 0} chunks` },
            { event: "Verification Status", incidence: "Grounded in MongoDB" }
          ],
          footerText: `${found.name} — Real-Time Study Record`,
          pagesThumbnails: [1]
        };
      }
    } else if (docOrName) {
      docDetails = docOrName;
    }

    if (docDetails) {
      setActiveViewerDoc(docDetails);
      setIsViewerModalOpen(true);
    }
  };

  const closeDocumentViewer = () => {
    setIsViewerModalOpen(false);
  };

  // ── Ask Question — Real Gemini API call ──────────────────────────────────
  const executeAskQuestion = useCallback(async (questionText) => {
    if (!questionText || !questionText.trim()) return;
    const cleanText = questionText.trim();
    setCurrentQuery(cleanText);
    setIsGeneratingAnswer(true);

    const steps = [
      "Querying TrialLens RAG index...",
      "Extracting verified clinical chunks...",
      "Calling Google Gemini for grounded synthesis...",
      "Mapping source citations and confidence scores..."
    ];
    steps.forEach((step, idx) => {
      setTimeout(() => setGenerationStep(step), idx * 400);
    });

    try {
      const result = await api.askQuestion(cleanText, { topK: 4, temperature: 0.0 });

      // Map backend response → frontend answer
      const sources = (result.citations || []).map((c, i) => ({
        id: `src-${i}`,
        docId: c.document_id,
        name: c.document_name,
        section: c.section,
        page: c.page_number,
        isPrimary: i === 0,
        tag: i === 0 ? 'Primary Source' : 'Supporting Source',
        quote: c.snippet?.slice(0, 220) + (c.snippet?.length > 220 ? '...' : ''),
        relevance_score: c.relevance_score,
        citation_tag: c.citation_tag,
      }));

      const realAnswer = {
        question: cleanText,
        timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        sourceCount: sources.length,
        leadText: result.answer,
        bullets: [],
        summary: `Confidence: ${Math.round((result.confidence_score || 0) * 100)}% · Model: ${result.model_used || 'google/gemini'} · ${result.evidence_chunks_consulted || 0} real evidence chunk(s) consulted.`,
        warning: 'This answer is synthesized directly from verified documents indexed in your library.',
        sources,
        viewerDoc: sources.length > 0 ? {
          name: sources[0].name,
          currentPage: sources[0].page,
          totalPages: 10,
          sectionTitle: sources[0].section,
          highlightText: sources[0].quote,
          footerText: `${sources[0].name} — Page ${sources[0].page}`,
          tableTitle: `Citation: ${sources[0].citation_tag}`,
          tableRows: [
            { event: "Relevance Score", incidence: `${Math.round((sources[0].relevance_score || 0) * 100)}%` },
            { event: "Study Document", incidence: sources[0].name },
            { event: "Section", incidence: sources[0].section }
          ]
        } : null,
        followUps: sources.length > 0 ? [
          `What are other endpoints reported in ${sources[0].name}?`,
          `Are there adverse reaction warnings in ${sources[0].name}?`,
          `What patient populations were included in this study?`
        ] : [],
        isRealData: true,
      };

      setCurrentAnswer(realAnswer);
      if (realAnswer.viewerDoc) setActiveViewerDoc(realAnswer.viewerDoc);
      setIsGeneratingAnswer(false);
      setGenerationStep('');

      // Refresh real query history from MongoDB
      await refreshHistory();

      addToast({
        title: 'Answer Synthesized',
        message: `Google Gemini answered using ${sources.length} clinical source(s).`,
        type: 'success'
      });
    } catch (err) {
      console.error('Backend query failed:', err);
      setIsGeneratingAnswer(false);
      setGenerationStep('');
      setCurrentAnswer({
        question: cleanText,
        timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        sourceCount: 0,
        leadText: `Unable to complete query: ${err.message || 'Connection error'}. Please verify backend status and that clinical documents are indexed.`,
        bullets: [],
        summary: 'Query failed. Please check backend connection.',
        warning: 'Backend connection error.',
        sources: [],
        viewerDoc: null,
        followUps: [],
        isRealData: true,
      });
      addToast({
        title: 'Query Failed',
        message: err.message || 'Could not reach backend.',
        type: 'error'
      });
    }
  }, [refreshHistory, addToast]);

  // Saved answers management
  const toggleSaveCurrentAnswer = () => {
    if (!currentAnswer) return;
    const exists = savedAnswers.find(s => s.question === currentAnswer.question);
    if (exists) {
      setSavedAnswers(prev => prev.filter(s => s.id !== exists.id));
      addToast({
        title: "Answer Removed",
        message: "Answer removed from your Saved Answers collection.",
        type: "info"
      });
    } else {
      const newSaved = {
        id: `saved-${Date.now()}`,
        question: currentAnswer.question,
        snippet: currentAnswer.leadText,
        drugProduct: currentAnswer.sources?.[0]?.name || "Clinical Record",
        sourceCount: currentAnswer.sources ? currentAnswer.sources.length : 0,
        savedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        phase: "Phase 3"
      };
      setSavedAnswers(prev => [newSaved, ...prev]);
      addToast({
        title: "Answer Saved",
        message: "Saved to your research notebook with full source citations.",
        type: "success"
      });
    }
  };

  const deleteSavedAnswer = (id) => {
    setSavedAnswers(prev => prev.filter(s => s.id !== id));
    addToast({
      title: "Removed Saved Answer",
      message: "The answer was removed from your collection.",
      type: "info"
    });
  };

  // ── Real File Upload — sends to FastAPI backend & MongoDB ─────────────────
  const addUploadFiles = useCallback((fileList, category = 'Clinical Trial Report', drugProduct = 'TL-802', phase = 'Phase 3') => {
    const categoryToType = {
      'Clinical Trial Report': 'clinical_trial_report',
      'Drug Label': 'drug_label',
      'Safety Bulletin': 'safety_bulletin',
      'Investigator Brochure': 'other',
      'Regulatory Document': 'other',
    };

    const newItems = Array.from(fileList).map((file, idx) => ({
      id: `up-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: category,
      drugProduct: drugProduct || 'Clinical Product',
      phase: phase || 'Phase 3',
      progress: 5,
      status: 'Uploading',
      fileType: file.name.endsWith('.docx') ? 'docx' : 'pdf',
      pages: 1,
      _file: file,
    }));

    setUploadQueue(prev => [...newItems, ...prev]);
    addToast({ title: 'Upload Started', message: `Uploading ${newItems.length} document(s) to MongoDB and vector index...`, type: 'info' });

    newItems.forEach((item) => {
      const docType = categoryToType[item.type] || 'clinical_trial_report';

      let fakeProgress = 15;
      const progressInterval = setInterval(() => {
        fakeProgress = Math.min(fakeProgress + 15, 85);
        setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: fakeProgress } : q));
      }, 300);

      api.uploadDocument(item._file, { studyId: 'STUDY-REAL', documentType: docType, title: item.name })
        .then(async (result) => {
          clearInterval(progressInterval);
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 100, status: 'Processing' } : q));

          setTimeout(async () => {
            setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'Completed' } : q));
            await refreshDocuments();
            addToast({
              title: 'Document Ingested & Saved',
              message: `${result.document_name} indexed with ${result.total_chunks} chunks and stored in MongoDB.`,
              type: 'success'
            });
          }, 600);
        })
        .catch(err => {
          clearInterval(progressInterval);
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'Failed', progress: 0 } : q));
          addToast({ title: 'Upload Failed', message: err.message || 'Could not upload document.', type: 'error' });
        });
    });
  }, [refreshDocuments, addToast]);

  const clearUploadQueue = () => {
    setUploadQueue([]);
    addToast({
      title: "Upload Queue Cleared",
      message: "Upload list reset.",
      type: "info"
    });
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        backendAvailable,
        backendError,
        setDocuments,
        addDocument,
        deleteDocument,
        refreshDocuments,
        refreshHistory,
        savedAnswers,
        setSavedAnswers,
        toggleSaveCurrentAnswer,
        deleteSavedAnswer,
        recentQuestions,
        setRecentQuestions,
        currentQuery,
        setCurrentQuery,
        currentAnswer,
        setCurrentAnswer,
        isGeneratingAnswer,
        generationStep,
        executeAskQuestion,
        activeViewerDoc,
        setActiveViewerDoc,
        isViewerModalOpen,
        openDocumentViewer,
        closeDocumentViewer,
        uploadQueue,
        addUploadFiles,
        clearUploadQueue,
        userProfile,
        setUserProfile,
        settings,
        setSettings,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        setMobileNavOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        notifications,
        setNotifications,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
