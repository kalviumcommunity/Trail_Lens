import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DOCUMENTS, RECENT_QUESTIONS, PRESET_ANSWERS, INITIAL_SAVED_ANSWERS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Documents state with localStorage fallback
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('triallens_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  // Saved answers
  const [savedAnswers, setSavedAnswers] = useState(() => {
    const saved = localStorage.getItem('triallens_saved_answers');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_ANSWERS;
  });

  // Recent questions
  const [recentQuestions, setRecentQuestions] = useState(() => {
    const saved = localStorage.getItem('triallens_recent_questions');
    return saved ? JSON.parse(saved) : RECENT_QUESTIONS;
  });

  // Current question in Ask page
  const [currentQuery, setCurrentQuery] = useState(
    "What were the most common adverse events reported during the Phase 3 trial of Drug X?"
  );
  const [currentAnswer, setCurrentAnswer] = useState(PRESET_ANSWERS["adverse-events"]);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  // Document Viewer state
  const [activeViewerDoc, setActiveViewerDoc] = useState(PRESET_ANSWERS["adverse-events"].viewerDoc);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

  // Upload queue
  const [uploadQueue, setUploadQueue] = useState([]);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('triallens_user_profile');
    return saved ? JSON.parse(saved) : {
      name: "Jager Jackson",
      role: "Researcher",
      email: "jager.jackson@bioresearch.org",
      initials: "JJ",
      institution: "Aura Clinical Research Institute",
      department: "Oncology Phase 3 Development",
      memberSince: "Jan 2025"
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

  // Notification items for Topbar
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "New Safety Bulletin parsed",
      description: "Safety_Bulletin_2023.pdf finished indexing with 12 citations.",
      time: "10m ago",
      read: false,
      type: "success"
    },
    {
      id: "n-2",
      title: "Query verified by 3 sources",
      description: "Adverse events for Drug X mapped to Study ABC Phase 3.",
      time: "1h ago",
      read: false,
      type: "info"
    },
    {
      id: "n-3",
      title: "System update v1.0.0",
      description: "High-precision OCR indexing enabled for clinical tables.",
      time: "1d ago",
      read: true,
      type: "system"
    }
  ]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('triallens_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('triallens_saved_answers', JSON.stringify(savedAnswers));
  }, [savedAnswers]);

  useEffect(() => {
    localStorage.setItem('triallens_recent_questions', JSON.stringify(recentQuestions));
  }, [recentQuestions]);

  useEffect(() => {
    localStorage.setItem('triallens_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('triallens_settings', JSON.stringify(settings));
    // Apply dark class
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

  // Toast dispatch helper
  const addToast = ({ title, message, type = 'info', duration = 3800 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Document actions
  const addDocument = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    addToast({
      title: "Document Added",
      message: `${newDoc.name} is now indexed in clinical library.`,
      type: "success"
    });
  };

  const deleteDocument = (id) => {
    const docToDelete = documents.find(d => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast({
      title: "Document Deleted",
      message: `${docToDelete?.name || 'Document'} has been removed from library.`,
      type: "info"
    });
  };

  // Open Document Viewer
  const openDocumentViewer = (docOrName, page = 42) => {
    let docDetails = null;
    if (typeof docOrName === 'string') {
      const found = documents.find(d => d.name === docOrName);
      if (found) {
        docDetails = {
          name: found.name,
          currentPage: page,
          totalPages: found.pages || 245,
          sectionTitle: "6.3 Adverse Events & Safety Findings",
          highlightText: "The most common adverse events in the Phase 3 trial were nausea (12.4%), headache (10.1%), fatigue (8.7%), diarrhea (6.3%) and upper respiratory tract infection (5.9%).",
          tableTitle: `Table 12. ${found.drugProduct} Clinical Data Matrix`,
          tableRows: [
            { event: "Nausea", incidence: "12.4%" },
            { event: "Headache", incidence: "10.1%" },
            { event: "Fatigue", incidence: "8.7%" },
            { event: "Diarrhea", incidence: "6.3%" },
            { event: "Upper respiratory tract infection", incidence: "5.9%" }
          ],
          footerText: `${found.name} — Verified Clinical Documentation`,
          pagesThumbnails: [Math.max(1, page - 1), page, page + 1]
        };
      }
    } else if (docOrName) {
      docDetails = docOrName;
    }

    if (!docDetails) {
      docDetails = PRESET_ANSWERS["adverse-events"].viewerDoc;
    }

    setActiveViewerDoc(docDetails);
    setIsViewerModalOpen(true);
  };

  const closeDocumentViewer = () => {
    setIsViewerModalOpen(false);
  };

  // Ask Question / Execute AI synthesis
  const executeAskQuestion = (questionText) => {
    if (!questionText || !questionText.trim()) return;
    const cleanText = questionText.trim();
    setCurrentQuery(cleanText);
    setIsGeneratingAnswer(true);

    // Dynamic matching to pre-set answers or rich generated answer
    const lower = cleanText.toLowerCase();
    let selectedAnswer = null;

    if (lower.includes("efficacy") || lower.includes("phase 3 efficacy") || lower.includes("results in phase 3")) {
      selectedAnswer = PRESET_ANSWERS["efficacy-phase3"];
    } else if (lower.includes("compare") || (lower.includes("drug x") && lower.includes("drug y"))) {
      selectedAnswer = PRESET_ANSWERS["compare-drugs"];
    } else if (lower.includes("safety update") || lower.includes("safety bulletin") || lower.includes("updates")) {
      selectedAnswer = PRESET_ANSWERS["safety-updates"];
    } else if (lower.includes("adverse") || lower.includes("common") || lower.includes("headache") || lower.includes("nausea")) {
      selectedAnswer = PRESET_ANSWERS["adverse-events"];
    } else {
      // Dynamic generated response anchored to documents
      selectedAnswer = {
        question: cleanText,
        timestamp: "Just now",
        sourceCount: 2,
        leadText: `Synthesized clinical evidence for: "${cleanText}" across current document repository:`,
        bullets: [
          { name: "Verified Finding", stat: "Statistically consistent with Protocol ABC-04 (p < 0.02)" },
          { name: "Population Sample", stat: "N = 840 subjects across multi-center Phase 3 cohort" },
          { name: "Clinical Safety Index", stat: "Within anticipated therapeutic window; zero Grade 4 toxicities" },
          { name: "Regulatory Status", stat: "Cross-referenced in CTD Section 2.5 Clinical Overview" }
        ],
        summary: `Evidence parsed across Study_ABC_Phase3.pdf and DrugX_Label.pdf confirms relevant data points for this inquiry. All results maintain strict source verification.`,
        warning: "This answer is generated only from the provided documents. Please verify the information using the cited sources.",
        sources: [
          {
            id: "src-dyn-1",
            docId: "doc-1",
            name: "Study_ABC_Phase3.pdf",
            section: "Summary of Clinical Evidence",
            page: 42,
            isPrimary: true,
            tag: "Primary Source",
            quote: "Clinical observations align with prospective criteria established in the primary statistical plan."
          },
          {
            id: "src-dyn-2",
            docId: "doc-2",
            name: "DrugX_Label.pdf",
            section: "Special Populations",
            page: 18,
            isPrimary: false,
            quote: "Prescribing parameters and outcome metrics correspond with controlled investigation archives."
          }
        ],
        viewerDoc: PRESET_ANSWERS["adverse-events"].viewerDoc,
        followUps: [
          `Are there further safety exclusions regarding ${cleanText.slice(0, 30)}?`,
          "What were the primary endpoints in this cohort?",
          "How was patient compliance verified during the study period?"
        ]
      };
    }

    // Step sequence animation
    const steps = [
      "Searching 120 clinical documents...",
      "Extracting statistical tables & study endpoints...",
      "Cross-referencing citations with Study_ABC_Phase3.pdf...",
      "Finalizing evidence-grounded answer..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setGenerationStep(step);
      }, idx * 300);
    });

    setTimeout(() => {
      setCurrentAnswer({
        ...selectedAnswer,
        question: cleanText,
        timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      });
      if (selectedAnswer.viewerDoc) {
        setActiveViewerDoc(selectedAnswer.viewerDoc);
      }
      setIsGeneratingAnswer(false);
      setGenerationStep("");

      // Add to recent questions if not already present
      setRecentQuestions((prev) => {
        const filtered = prev.filter(q => q.question.toLowerCase() !== cleanText.toLowerCase());
        return [
          {
            id: `q-${Date.now()}`,
            question: cleanText,
            timestamp: "Just now",
            status: "Answered",
            drug: "Drug X",
            sourceCount: selectedAnswer.sourceCount || 3
          },
          ...filtered
        ].slice(0, 10);
      });

      // Auto-save if setting enabled
      if (settings.autoSaveAnswers) {
        const isAlreadySaved = savedAnswers.some(s => s.question.toLowerCase() === cleanText.toLowerCase());
        if (!isAlreadySaved) {
          const newSave = {
            id: `saved-${Date.now()}`,
            question: cleanText,
            snippet: selectedAnswer.leadText + " " + selectedAnswer.bullets.map(b => `${b.name} (${b.stat})`).join(", "),
            drugProduct: "Drug X",
            sourceCount: selectedAnswer.sourceCount || 3,
            savedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            phase: "Phase 3",
            key: "adverse-events"
          };
          setSavedAnswers(prev => [newSave, ...prev]);
        }
      }

      addToast({
        title: "Answer Generated",
        message: `Verified against ${selectedAnswer.sourceCount} clinical sources.`,
        type: "success"
      });
    }, 1300);
  };

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
        snippet: currentAnswer.leadText + " " + (currentAnswer.bullets || []).map(b => `${b.name} (${b.stat})`).join(", "),
        drugProduct: "Drug X",
        sourceCount: currentAnswer.sources ? currentAnswer.sources.length : 3,
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

  // Simulated File Upload Handling
  const addUploadFiles = (fileList, category = "Clinical Trial Report", drugProduct = "Drug X", phase = "Phase 3") => {
    const newItems = Array.from(fileList).map((file, idx) => ({
      id: `up-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: category,
      drugProduct: drugProduct || "Drug X",
      phase: phase || "Phase 3",
      progress: 5,
      status: "Uploading",
      fileType: file.name.endsWith('.docx') ? 'docx' : 'pdf',
      pages: Math.floor(Math.random() * 180) + 20
    }));

    setUploadQueue(prev => [...newItems, ...prev]);
    addToast({
      title: "Upload Started",
      message: `Uploading ${newItems.length} clinical document${newItems.length > 1 ? 's' : ''}...`,
      type: "info"
    });

    // Simulate progressive progress
    newItems.forEach((item) => {
      let currentProgress = 5;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 15;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploadQueue(prev =>
            prev.map(q => q.id === item.id ? { ...q, progress: 100, status: "Processing" } : q)
          );

          // Transition from Processing to Completed
          setTimeout(() => {
            setUploadQueue(prev =>
              prev.map(q => q.id === item.id ? { ...q, status: "Completed" } : q)
            );

            // Automatically add to documents repository!
            const newDoc = {
              id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: item.name,
              type: item.type,
              drugProduct: item.drugProduct,
              phase: item.phase,
              year: "2026",
              pages: item.pages,
              uploadedOn: "Just now",
              size: item.size,
              status: "Verified",
              fileType: item.fileType,
              abstract: `Uploaded clinical document for ${item.drugProduct} (${item.type}). Indexed into RAG vector repository with complete table parsing.`
            };
            addDocument(newDoc);
          }, 1200);
        } else {
          setUploadQueue(prev =>
            prev.map(q => q.id === item.id ? { ...q, progress: currentProgress } : q)
          );
        }
      }, 400);
    });
  };

  const clearUploadQueue = () => {
    setUploadQueue([]);
    addToast({
      title: "Upload Queue Cleared",
      message: "Upload history was reset.",
      type: "info"
    });
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        setDocuments,
        addDocument,
        deleteDocument,
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
