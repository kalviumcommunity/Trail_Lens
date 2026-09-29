export const STATS_DATA = {
  totalDocuments: 120,
  totalDocumentsChange: "+12 this month",
  studies: 45,
  studiesChange: "+3 this month",
  drugProducts: 12,
  drugProductsChange: "+2 this month",
  safetyBulletins: 8,
  safetyBulletinsChange: "+1 this month",
};

export const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    name: "Study_ABC_Phase3.pdf",
    type: "Clinical Trial Report",
    drugProduct: "Drug X",
    phase: "Phase 3",
    year: "2022",
    pages: 245,
    uploadedOn: "12 Sep 2026",
    size: "14.8 MB",
    status: "Verified",
    isPrimary: true,
    fileType: "pdf",
    abstract: "A randomized, double-blind, multicenter Phase 3 study evaluating the safety, tolerability, and clinical efficacy of Drug X in adult patients with moderate-to-severe disease progression."
  },
  {
    id: "doc-2",
    name: "DrugX_Label.pdf",
    type: "Drug Label",
    drugProduct: "Drug X",
    phase: "—",
    year: "2023",
    pages: 56,
    uploadedOn: "10 Sep 2026",
    size: "4.2 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Official prescribing information and drug label for Drug X (active component: Compound XL-402), including dosing, adverse reactions, contraindications, and clinical pharmacology."
  },
  {
    id: "doc-3",
    name: "Safety_Bulletin_2023.pdf",
    type: "Safety Bulletin",
    drugProduct: "Drug X",
    phase: "—",
    year: "2023",
    pages: 12,
    uploadedOn: "8 Sep 2026",
    size: "1.1 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Annual post-marketing surveillance and pharmacovigilance safety update regarding incidence rates of hepatic enzymes and mild gastrointestinal events in prolonged exposure cohorts."
  },
  {
    id: "doc-4",
    name: "Study_DEF_Phase2.pdf",
    type: "Clinical Trial Report",
    drugProduct: "Drug Y",
    phase: "Phase 2",
    year: "2021",
    pages: 189,
    uploadedOn: "5 Sep 2026",
    size: "11.5 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Dose-escalation Phase 2 trial investigating biomarker response and preliminary efficacy endpoints for Drug Y compared against standard-of-care baseline."
  },
  {
    id: "doc-5",
    name: "Investigator_Brochure.pdf",
    type: "Investigator Brochure",
    drugProduct: "Drug Y",
    phase: "—",
    year: "2020",
    pages: 78,
    uploadedOn: "1 Sep 2026",
    size: "6.3 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Comprehensive investigator brochure detailing non-clinical pharmacology, pharmacokinetics, toxicology, and initial human subject safety guidelines."
  },
  {
    id: "doc-6",
    name: "Study_GHI_Phase1.pdf",
    type: "Clinical Trial Report",
    drugProduct: "Drug Z",
    phase: "Phase 1",
    year: "2019",
    pages: 132,
    uploadedOn: "28 Aug 2026",
    size: "9.1 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "First-in-human single ascending dose (SAD) and multiple ascending dose (MAD) trial examining bioavailability and maximum tolerated dose in healthy volunteers."
  },
  {
    id: "doc-7",
    name: "DrugZ_Label.pdf",
    type: "Drug Label",
    drugProduct: "Drug Z",
    phase: "—",
    year: "2021",
    pages: 60,
    uploadedOn: "25 Aug 2026",
    size: "5.0 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Prescribing formulation summary, packaging specs, pediatric usage limitations, and drug interaction guidelines for Drug Z oral administration."
  },
  {
    id: "doc-8",
    name: "Safety_Update_2022.pdf",
    type: "Safety Bulletin",
    drugProduct: "Drug Z",
    phase: "—",
    year: "2022",
    pages: 18,
    uploadedOn: "20 Aug 2026",
    size: "1.9 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Pharmacovigilance bulletin analyzing cardiovascular tolerability and monitoring requirements during concomitant therapeutic regimens."
  },
  {
    id: "doc-9",
    name: "Study_JKL_Phase3.pdf",
    type: "Clinical Trial Report",
    drugProduct: "Drug A",
    phase: "Phase 3",
    year: "2021",
    pages: 310,
    uploadedOn: "15 Aug 2026",
    size: "22.4 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Pivotal randomized Phase 3 non-inferiority trial evaluating survival metrics and progression-free intervals across a global cohort of 1,420 subjects."
  },
  {
    id: "doc-10",
    name: "Regulatory_Submission.pdf",
    type: "Regulatory Document",
    drugProduct: "Drug A",
    phase: "—",
    year: "2021",
    pages: 95,
    uploadedOn: "12 Aug 2026",
    size: "8.7 MB",
    status: "Verified",
    fileType: "docx",
    abstract: "Common Technical Document (CTD) Module 2.5 Clinical Overview and regulatory compliance documentation submitted to FDA and EMA authorities."
  },
  {
    id: "doc-11",
    name: "Study_MNO_Phase4.pdf",
    type: "Clinical Trial Report",
    drugProduct: "Drug B",
    phase: "Phase 4",
    year: "2023",
    pages: 164,
    uploadedOn: "05 Aug 2026",
    size: "12.0 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Post-approval real-world evidence registry tracking 3-year outcomes, patient quality of life scores, and health economics utilization."
  },
  {
    id: "doc-12",
    name: "DrugB_Package_Insert.pdf",
    type: "Drug Label",
    drugProduct: "Drug B",
    phase: "—",
    year: "2022",
    pages: 42,
    uploadedOn: "28 Jul 2026",
    size: "3.5 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Standard package insert and patient medication guide detailing reconstitution steps, storage requirements, and allergic reaction signs."
  },
  {
    id: "doc-13",
    name: "Study_PQR_Phase2.pdf",
    type: "Clinical Trial Report",
    drugProduct: "Drug X",
    phase: "Phase 2",
    year: "2020",
    pages: 175,
    uploadedOn: "14 Jul 2026",
    size: "13.2 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Phase 2 proof-of-concept trial determining dose-response curve and secondary endpoint reduction for Drug X."
  },
  {
    id: "doc-14",
    name: "Safety_Summary_Q2.pdf",
    type: "Safety Bulletin",
    drugProduct: "Drug Y",
    phase: "—",
    year: "2023",
    pages: 24,
    uploadedOn: "02 Jul 2026",
    size: "2.3 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Quarterly expedited safety analysis focusing on mild renal clearance variations and geriatric patient subgroups."
  },
  {
    id: "doc-15",
    name: "Investigator_Protocol_Amendment.pdf",
    type: "Investigator Brochure",
    drugProduct: "Drug Z",
    phase: "—",
    year: "2022",
    pages: 88,
    uploadedOn: "19 Jun 2026",
    size: "7.1 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Protocol modification document adjusting inclusion criteria, visit schedules, and remote monitoring provisions for ongoing clinical sites."
  },
  {
    id: "doc-16",
    name: "Regulatory_Correspondence_EMA.pdf",
    type: "Regulatory Document",
    drugProduct: "Drug X",
    phase: "—",
    year: "2023",
    pages: 48,
    uploadedOn: "01 Jun 2026",
    size: "3.9 MB",
    status: "Verified",
    fileType: "pdf",
    abstract: "Day 120 list of questions response document resolving scientific advisory committee inquiries regarding assay validation."
  }
];

export const FILTER_COUNTS = {
  drugProducts: [
    { name: "Drug X", count: 38 },
    { name: "Drug Y", count: 24 },
    { name: "Drug Z", count: 18 },
    { name: "Drug A", count: 16 },
    { name: "Drug B", count: 12 },
    { name: "Drug C", count: 8 },
    { name: "Drug D", count: 4 },
  ],
  documentTypes: [
    { name: "Clinical Trial Report", count: 52 },
    { name: "Drug Label", count: 20 },
    { name: "Safety Bulletin", count: 18 },
    { name: "Investigator Brochure", count: 12 },
    { name: "Regulatory Document", count: 10 },
    { name: "Scientific Manuscript", count: 8 },
  ],
  studyPhases: [
    { name: "Phase 1", count: 14 },
    { name: "Phase 2", count: 26 },
    { name: "Phase 3", count: 36 },
    { name: "Phase 4", count: 6 },
    { name: "Pre-clinical", count: 8 },
  ],
  years: ["All Years", "2023", "2022", "2021", "2020", "2019", "2018"]
};

export const RECENT_QUESTIONS = [
  {
    id: "q-1",
    question: "What were the most common adverse events in the Phase 3 trial of Drug X?",
    timestamp: "22 Sep 2026, 11:24 AM",
    status: "Answered",
    drug: "Drug X",
    sourceCount: 3,
  },
  {
    id: "q-2",
    question: "Show efficacy results for Drug Y in Phase 2.",
    timestamp: "21 Sep 2026, 4:10 PM",
    status: "Answered",
    drug: "Drug Y",
    sourceCount: 2,
  },
  {
    id: "q-3",
    question: "Compare safety profile of Drug X and Drug Y.",
    timestamp: "20 Sep 2026, 2:18 PM",
    status: "Answered",
    drug: "Drug X & Y",
    sourceCount: 4,
  },
  {
    id: "q-4",
    question: "What is the recommended dosage for Drug X?",
    timestamp: "19 Sep 2026, 10:03 AM",
    status: "Insufficient Evidence",
    drug: "Drug X",
    sourceCount: 1,
  },
  {
    id: "q-5",
    question: "Show latest safety updates for Drug X.",
    timestamp: "18 Sep 2026, 6:45 PM",
    status: "Answered",
    drug: "Drug X",
    sourceCount: 3,
  },
];

export const PRESET_ANSWERS = {
  "adverse-events": {
    question: "What were the most common adverse events reported during the Phase 3 trial of Drug X?",
    timestamp: "22 Sep 2026, 11:24 AM",
    sourceCount: 3,
    leadText: "In the Phase 3 trial of Drug X, the most common adverse events reported were:",
    bullets: [
      { name: "Nausea", stat: "12.4%" },
      { name: "Headache", stat: "10.1%" },
      { name: "Fatigue", stat: "8.7%" },
      { name: "Diarrhea", stat: "6.3%" },
      { name: "Upper respiratory tract infection", stat: "5.9%" },
    ],
    summary: "These results are reported in the Safety Results section of Study ABC (Phase 3). Overall treatment-emergent adverse events (TEAEs) were primarily mild to moderate (Grade 1-2) with discontinuation incidence remaining under 2.1%.",
    warning: "This answer is generated only from the provided documents. Please verify the information using the cited sources.",
    sources: [
      {
        id: "src-1",
        docId: "doc-1",
        name: "Study_ABC_Phase3.pdf",
        section: "Safety Results",
        page: 42,
        isPrimary: true,
        tag: "Primary Source",
        quote: "The most common adverse events in the Phase 3 trial were nausea (12.4%), headache (10.1%), fatigue (8.7%), diarrhea (6.3%) and upper respiratory tract infection (5.9%)."
      },
      {
        id: "src-2",
        docId: "doc-2",
        name: "DrugX_Label.pdf",
        section: "Adverse Reactions",
        page: 12,
        isPrimary: false,
        quote: "In clinical trials (N=1,248), adverse reactions occurring at ≥5% frequency in subjects receiving Drug X included nausea, headache, fatigue, and diarrhea."
      },
      {
        id: "src-3",
        docId: "doc-3",
        name: "Safety_Bulletin_2023.pdf",
        section: "Safety Update",
        page: 8,
        isPrimary: false,
        quote: "Post-trial safety surveillance confirms adverse event profile remains fully aligned with pivotal Phase 3 Study ABC disclosures."
      }
    ],
    viewerDoc: {
      name: "Study_ABC_Phase3.pdf",
      currentPage: 42,
      totalPages: 245,
      sectionTitle: "6.3 Adverse Events",
      highlightText: "The most common adverse events in the Phase 3 trial were nausea (12.4%), headache (10.1%), fatigue (8.7%), diarrhea (6.3%) and upper respiratory tract infection (5.9%).",
      tableTitle: "Table 12. Summary of Adverse Events",
      tableRows: [
        { event: "Nausea", incidence: "12.4%" },
        { event: "Headache", incidence: "10.1%" },
        { event: "Fatigue", incidence: "8.7%" },
        { event: "Diarrhea", incidence: "6.3%" },
        { event: "Upper respiratory tract infection", incidence: "5.9%" }
      ],
      footerText: "Study ABC — Phase 3 Clinical Trial Report",
      pagesThumbnails: [41, 42, 43]
    },
    followUps: [
      "What were the serious adverse events in this trial?",
      "How did the safety profile of Drug X compare to placebo?",
      "Were there any study discontinuations due to adverse events?",
      "What was the most common adverse event in Phase 2?"
    ]
  },
  "efficacy-phase3": {
    question: "Efficacy results in Phase 3",
    timestamp: "22 Sep 2026, 10:15 AM",
    sourceCount: 2,
    leadText: "The Phase 3 pivotal trial demonstrated statistically significant clinical improvement across primary and secondary endpoints:",
    bullets: [
      { name: "Primary Endpoint (ORR)", stat: "68.4% vs 34.2% placebo (p < 0.001)" },
      { name: "Progression-Free Survival (PFS)", stat: "14.8 months median vs 7.2 months" },
      { name: "Overall Survival (OS) at 12 mo", stat: "82.5% vs 64.1% standard of care" },
      { name: "Complete Response Rate (CR)", stat: "24.1% confirmed" },
    ],
    summary: "Statistically superior clinical benefit was observed uniformly across all predefined biomarker subgroups, confirming sustained therapeutic response.",
    warning: "This answer is generated only from the provided documents. Please verify the information using the cited sources.",
    sources: [
      {
        id: "src-1",
        docId: "doc-1",
        name: "Study_ABC_Phase3.pdf",
        section: "Clinical Efficacy Outcomes",
        page: 68,
        isPrimary: true,
        tag: "Primary Source",
        quote: "Overall response rate reached 68.4% in the active arm compared to 34.2% in control, demonstrating robust therapeutic separation."
      },
      {
        id: "src-2",
        docId: "doc-2",
        name: "DrugX_Label.pdf",
        section: "Clinical Studies",
        page: 24,
        isPrimary: false,
        quote: "Trial ABC confirmed median progression-free survival extension of 7.6 months over comparative regimens."
      }
    ],
    viewerDoc: {
      name: "Study_ABC_Phase3.pdf",
      currentPage: 68,
      totalPages: 245,
      sectionTitle: "8.1 Primary Efficacy Outcomes",
      highlightText: "Primary endpoint analysis demonstrated an objective response rate of 68.4% in the Drug X treatment arm compared to 34.2% in the placebo group (Hazard Ratio 0.48, 95% CI 0.36-0.64; p < 0.001).",
      tableTitle: "Table 19. Primary & Secondary Efficacy Endpoints",
      tableRows: [
        { event: "Objective Response Rate (ORR)", incidence: "68.4% vs 34.2%" },
        { event: "Median PFS (Months)", incidence: "14.8 vs 7.2" },
        { event: "Complete Response (CR)", incidence: "24.1%" },
        { event: "Disease Control Rate (DCR)", incidence: "89.2%" }
      ],
      footerText: "Study ABC — Phase 3 Clinical Trial Report",
      pagesThumbnails: [67, 68, 69]
    },
    followUps: [
      "How did subgroup analysis differ between age cohorts?",
      "What were the secondary biomarker correlations?",
      "What was the median duration of response (DoR)?"
    ]
  },
  "compare-drugs": {
    question: "Compare Drug X and Drug Y",
    timestamp: "21 Sep 2026, 3:45 PM",
    sourceCount: 3,
    leadText: "Comparative synthesis between Drug X (Study ABC Phase 3) and Drug Y (Study DEF Phase 2) reveals key therapeutic distinctions:",
    bullets: [
      { name: "Response Rate", stat: "Drug X: 68.4% vs Drug Y: 54.1%" },
      { name: "Primary AE Frequency", stat: "Drug X: Nausea (12.4%) vs Drug Y: Diarrhea (18.6%)" },
      { name: "Discontinuation Rate", stat: "Drug X: 2.1% vs Drug Y: 4.8%" },
      { name: "Dosing Convenience", stat: "Drug X: Once Daily Oral vs Drug Y: Twice Daily" }
    ],
    summary: "Drug X exhibited higher overall response rates and a lower rate of Grade 3 gastrointestinal toxicities compared to Drug Y in cross-study meta-synthesis.",
    warning: "Cross-study comparisons should be interpreted with caution due to differing baseline population demographics and trial protocols.",
    sources: [
      {
        id: "src-1",
        docId: "doc-1",
        name: "Study_ABC_Phase3.pdf",
        section: "Safety & Efficacy Synthesis",
        page: 42,
        isPrimary: true,
        tag: "Primary Source",
        quote: "Discontinuation due to drug-related adverse events occurred in only 2.1% of patients receiving Drug X."
      },
      {
        id: "src-2",
        docId: "doc-4",
        name: "Study_DEF_Phase2.pdf",
        section: "Comparative Analysis",
        page: 55,
        isPrimary: false,
        quote: "Drug Y Phase 2 cohort recorded Grade 3 diarrhea in 18.6% of participants, leading to 4.8% study exits."
      }
    ],
    viewerDoc: {
      name: "Study_DEF_Phase2.pdf",
      currentPage: 55,
      totalPages: 189,
      sectionTitle: "5.4 Safety Tolerability & Discontinuations",
      highlightText: "Gastrointestinal events comprised the primary dose-limiting toxicity for Drug Y, with diarrhea observed in 18.6% and treatment withdrawal in 4.8% of patients.",
      tableTitle: "Table 8. Drug Y Toxicity Profile by Grade",
      tableRows: [
        { event: "Diarrhea (All Grades)", incidence: "18.6%" },
        { event: "Nausea", incidence: "9.2%" },
        { event: "Fatigue", incidence: "11.4%" },
        { event: "Discontinuations", incidence: "4.8%" }
      ],
      footerText: "Study DEF — Phase 2 Clinical Trial Report",
      pagesThumbnails: [54, 55, 56]
    },
    followUps: [
      "Were patient inclusion criteria identical between Study ABC and DEF?",
      "What was the drug-drug interaction profile for Drug Y?",
      "Can Drug X and Drug Y be combined in therapeutic trials?"
    ]
  },
  "safety-updates": {
    question: "Show safety updates",
    timestamp: "20 Sep 2026, 1:12 PM",
    sourceCount: 2,
    leadText: "Recent post-marketing bulletins and clinical review summaries document the following safety updates for Drug X and Drug Z:",
    bullets: [
      { name: "Hepatic Monitoring", stat: "Routine ALT/AST check recommended at week 4 and 12" },
      { name: "Pediatric Advisory", stat: "Not indicated for individuals under 18 years" },
      { name: "Drug Interaction Alert", stat: "Caution advised with strong CYP3A4 inhibitors" },
      { name: "Surveillance Finding", stat: "No new unexpected safety signals in 24,000 patient-years" }
    ],
    summary: "Safety profile remains consistent with pivotal labeling. Recommended lab monitoring protocol reduces Grade 2+ transaminase spikes by 74%.",
    warning: "This answer is generated only from the provided documents. Please verify the information using the cited sources.",
    sources: [
      {
        id: "src-1",
        docId: "doc-3",
        name: "Safety_Bulletin_2023.pdf",
        section: "Pharmacovigilance Digest",
        page: 8,
        isPrimary: true,
        tag: "Primary Source",
        quote: "Annual safety audit detected no emergent oncological or cardiac signals across 24,000 patient-years of clinical exposure."
      },
      {
        id: "src-2",
        docId: "doc-8",
        name: "Safety_Update_2022.pdf",
        section: "Cardiovascular & Hepatic Notes",
        page: 18,
        isPrimary: false,
        quote: "Mild elevation of serum transaminases resolved spontaneously upon dose titration or temporary holiday."
      }
    ],
    viewerDoc: {
      name: "Safety_Bulletin_2023.pdf",
      currentPage: 8,
      totalPages: 12,
      sectionTitle: "3.0 Periodic Benefit-Risk Evaluation Report (PBRER)",
      highlightText: "Annual post-market surveillance confirms that the benefit-risk balance of Drug X remains strongly favorable across all therapeutic indications with zero unexpected toxicities.",
      tableTitle: "Table 4. Pharmacovigilance Risk Metrics",
      tableRows: [
        { event: "Total Patient-Years Exposure", incidence: "24,180" },
        { event: "Reported Serious Adverse Events", incidence: "0.04%" },
        { event: "Resolved Post-Discontinuation", incidence: "99.2%" },
        { event: "Hepatic Warning Status", incidence: "Standard Routine" }
      ],
      footerText: "Annual Safety Bulletin 2023 — Global Pharmacovigilance",
      pagesThumbnails: [7, 8, 9]
    },
    followUps: [
      "What are the specific CYP3A4 inhibitors to avoid?",
      "Are there renal dose adjustments needed for elderly patients?",
      "What is the recommended protocol if ALT exceeds 3x ULN?"
    ]
  }
};

export const INITIAL_SAVED_ANSWERS = [
  {
    id: "saved-1",
    question: "What were the most common adverse events reported during the Phase 3 trial of Drug X?",
    snippet: "In the Phase 3 trial of Drug X, the most common adverse events reported were Nausea (12.4%), Headache (10.1%), Fatigue (8.7%), Diarrhea (6.3%), and Upper respiratory tract infection (5.9%). Discontinuations remained under 2.1%.",
    drugProduct: "Drug X",
    sourceCount: 3,
    savedDate: "22 Sep 2026",
    phase: "Phase 3",
    key: "adverse-events"
  },
  {
    id: "saved-2",
    question: "Show efficacy results for Drug Y in Phase 2.",
    snippet: "Objective response rate reached 68.4% in the active arm compared to 34.2% in control (p < 0.001). Median PFS extended to 14.8 months vs 7.2 months.",
    drugProduct: "Drug Y",
    sourceCount: 2,
    savedDate: "21 Sep 2026",
    phase: "Phase 2",
    key: "efficacy-phase3"
  },
  {
    id: "saved-3",
    question: "Compare safety profile of Drug X and Drug Y.",
    snippet: "Drug X exhibited higher overall response rates and a lower rate of Grade 3 gastrointestinal toxicities (Nausea 12.4% vs Diarrhea 18.6% in Drug Y). Discontinuation rate was 2.1% vs 4.8%.",
    drugProduct: "Drug X & Y",
    sourceCount: 4,
    savedDate: "20 Sep 2026",
    phase: "Comparative",
    key: "compare-drugs"
  }
];

export const TRUSTED_COMPANIES = [
  { name: "Pfizer", style: "tracking-wider font-bold text-xl text-blue-400" },
  { name: "NOVARTIS", style: "tracking-widest font-semibold text-lg text-amber-500" },
  { name: "Roche", style: "tracking-wide font-extrabold text-xl text-blue-300" },
  { name: "Johnson & Johnson", style: "tracking-tight italic font-bold text-lg text-rose-500" },
  { name: "MERCK", style: "tracking-widest font-bold text-lg text-emerald-400" },
  { name: "AstraZeneca", style: "tracking-wide font-semibold text-xl text-purple-400" },
];

export const FAQS = [
  {
    category: "Getting Started",
    question: "What is TrialLens and how does it verify clinical evidence?",
    answer: "TrialLens is an evidence-first clinical research assistant built on advanced Retrieval-Augmented Generation (RAG). Every answer generated is strictly anchored to uploaded clinical study reports, drug labels, and safety bulletins. The system displays direct citations, page numbers, and exact text highlights, completely preventing AI hallucinations."
  },
  {
    category: "Getting Started",
    question: "What document formats are supported for upload?",
    answer: "TrialLens supports PDF (.pdf) and Microsoft Word documents (.docx) up to 250MB per file. Documents are parsed with optical character recognition (OCR) and high-fidelity layout analysis to preserve tables, clinical figures, and appendix sections."
  },
  {
    category: "AI & Citations",
    question: "How does TrialLens calculate source attribution and confidence?",
    answer: "Our pipeline uses dense semantic embeddings and hierarchical chunking. For every claim in the generated answer, TrialLens cross-references the token source against the document index. Citations are ranked by relevance, designating primary study source documents and supporting regulatory disclosures."
  },
  {
    category: "AI & Citations",
    question: "What happens if there is insufficient evidence in the document repository?",
    answer: "Unlike general-purpose conversational LLMs, TrialLens will never invent clinical data. If the answer cannot be verified with high statistical confidence in your uploaded materials, the query is flagged with an 'Insufficient Evidence' badge and an alert explaining which specific data points are missing."
  },
  {
    category: "Privacy & Compliance",
    question: "Is TrialLens compliant with HIPAA, GxP, and 21 CFR Part 11?",
    answer: "Yes. TrialLens is designed for enterprise biopharma compliance. All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). No proprietary clinical trial data is used to train foundation models. Audit logs track every query, answer export, and document access."
  },
  {
    category: "Export & Sharing",
    question: "Can I export answers and citations into clinical study reports?",
    answer: "Yes. You can copy formatted markdown summaries, export structured JSON or CSV data, or generate PDF citation summaries with one-click from the Answer card or the Saved Answers library."
  }
];

export const USE_CASES = [
  {
    title: "Clinical Trial Analysis",
    description: "Instantly parse 300+ page CSRs to extract primary endpoints, adverse event frequencies, subgroup variances, and patient disposition.",
    icon: "FileText",
    badge: "Trial Operations"
  },
  {
    title: "Drug Safety & Pharmacovigilance",
    description: "Monitor safety signals, cross-reference adverse reaction tables, and generate expedited safety reporting summaries for regulatory authorities.",
    icon: "ShieldAlert",
    badge: "Safety Surveillance"
  },
  {
    title: "Regulatory Research & Submissions",
    description: "Accelerate IND and NDA dossiers by tracing labeling statements directly back to pivotal Phase 3 and investigator brochure references.",
    icon: "Building2",
    badge: "Regulatory Affairs"
  },
  {
    title: "Competitive Landscape & Literature Review",
    description: "Compare competitor compounds, efficacy response rates, and tolerability benchmarks across published investigator brochures.",
    icon: "TrendingUp",
    badge: "Medical Affairs"
  },
  {
    title: "Pharmacovigilance Signal Detection",
    description: "Aggregate adverse reaction logs across global cohorts, detecting rare incidence trends before annual safety updates.",
    icon: "Activity",
    badge: "Post-Marketing"
  },
  {
    title: "Medical Writing & Protocol Design",
    description: "Draft protocol synopses and investigator brochures with automatic source citations, saving clinical writers up to 15 hours per report.",
    icon: "Sparkles",
    badge: "Biostatistics"
  }
];
