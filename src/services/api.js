/**
 * TrialLens API Service
 * All communication with the FastAPI backend (http://localhost:8000)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ─── Health & Status ──────────────────────────────────────────────────────────

/** Check backend health and Gemini/MongoDB status */
export async function getStatus() {
  return request('/api/status');
}

export async function getHealth() {
  return request('/api/health');
}

// ─── Documents ────────────────────────────────────────────────────────────────

/**
 * List all indexed documents from MongoDB (real-time).
 * @returns {{ total_documents: number, documents: Array }}
 */
export async function listDocuments() {
  return request('/api/documents');
}

/**
 * Upload a clinical document (PDF, TXT, MD) to the backend.
 * @param {File} file
 * @param {{ studyId?: string, documentType?: string, title?: string }} meta
 * @returns {Promise<DocumentUploadResponse>}
 */
export async function uploadDocument(file, { studyId = 'STUDY-001', documentType = 'clinical_trial_report', title } = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('study_id', studyId);
  formData.append('document_type', documentType);
  if (title) formData.append('title', title);

  const response = await fetch(`${API_BASE}/api/documents/upload`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type header — browser sets it with boundary for multipart
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Upload failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete a document by ID.
 * @param {string} documentId
 */
export async function deleteDocument(documentId) {
  return request(`/api/documents/${documentId}`, { method: 'DELETE' });
}

/**
 * Get document detail + chunks.
 * @param {string} documentId
 */
export async function getDocumentDetail(documentId) {
  return request(`/api/documents/${documentId}`);
}

// ─── RAG / Ask ────────────────────────────────────────────────────────────────

/**
 * Ask a clinical research question (RAG with Google Gemini).
 * @param {string} question
 * @param {{ topK?: number, temperature?: number, filters?: object }} options
 * @returns {Promise<QueryResponse>}
 */
export async function askQuestion(question, { topK = 4, temperature = 0.0, filters = null } = {}) {
  return request('/api/query', {
    method: 'POST',
    body: JSON.stringify({
      question,
      top_k: topK,
      temperature,
      filters,
    }),
  });
}

/**
 * Semantic search (raw retrieval without Gemini synthesis).
 * @param {string} query
 * @param {{ topK?: number, filters?: object }} options
 */
export async function semanticSearch(query, { topK = 4, filters = null } = {}) {
  return request('/api/search', {
    method: 'POST',
    body: JSON.stringify({ query, top_k: topK, filters }),
  });
}

/**
 * Fetch recent query history from MongoDB.
 * @param {number} limit
 */
export async function getQueryHistory(limit = 20) {
  return request(`/api/history?limit=${limit}`);
}

// ─── Studies ─────────────────────────────────────────────────────────────────

export async function getStudies() {
  return request('/api/studies');
}

export async function getStats() {
  return request('/api/stats');
}
