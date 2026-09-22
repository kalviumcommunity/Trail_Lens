import re
import io
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import pypdf


class ParsedSection(BaseModel):
    section_name: str
    page_number: int
    content: str


class ParsedDocument(BaseModel):
    title: str
    total_pages: int
    sections: List[ParsedSection]
    raw_text: str


# Clinical section header patterns
CLINICAL_SECTION_REGEX = re.compile(
    r"^(?:"
    r"#{1,4}\s+(.+)$|"  # Markdown headings # Section
    r"(\d+[\.\)]\s+[A-Z0-9\s,\-\/\(\)]{3,80})$|"  # 1. INDICATIONS AND USAGE
    r"([A-Z\s]{4,60}:?$)|"  # ALL CAPS HEADINGS
    r"((?:INDICATIONS|DOSAGE|CONTRAINDICATIONS|WARNINGS|PRECAUTIONS|ADVERSE REACTIONS|"
    r"ADVERSE EVENTS|DRUG INTERACTIONS|CLINICAL STUDIES|CLINICAL PHARMACOLOGY|"
    r"PRIMARY ENDPOINTS|SECONDARY ENDPOINTS|STUDY DESIGN|METHODOLOGY|SAFETY BULLETIN|"
    r"BOXED WARNING|EFFICACY RESULTS|PATIENT POPULATION|EXCLUSION CRITERIA|INCLUSION CRITERIA)"
    r"[\s\w\-\,\.\(\)]*)$"
    r")",
    re.IGNORECASE | re.MULTILINE
)


class DocumentParser:
    """Parses PDF and plain text documents into page- and section-aware units."""

    @staticmethod
    def parse_pdf(file_bytes: bytes, filename: str) -> ParsedDocument:
        """Extracts text page-by-page from PDF bytes and maps clinical sections."""
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        total_pages = len(reader.pages)
        sections: List[ParsedSection] = []
        full_text_parts = []

        current_section = "Introduction / Overview"
        
        for page_idx, page in enumerate(reader.pages):
            page_num = page_idx + 1
            text = page.extract_text() or ""
            full_text_parts.append(text)
            
            # Split lines to detect section boundaries
            lines = text.split("\n")
            buffer = []
            
            for line in lines:
                stripped = line.strip()
                match = DocumentParser._match_section_header(stripped)
                if match:
                    if buffer:
                        sections.append(ParsedSection(
                            section_name=current_section,
                            page_number=page_num,
                            content="\n".join(buffer).strip()
                        ))
                        buffer = []
                    current_section = match
                else:
                    if stripped:
                        buffer.append(stripped)
            
            if buffer:
                sections.append(ParsedSection(
                    section_name=current_section,
                    page_number=page_num,
                    content="\n".join(buffer).strip()
                ))

        if not sections:
            # Fallback if no text could be partitioned
            sections.append(ParsedSection(
                section_name="General",
                page_number=1,
                content="\n\n".join(full_text_parts).strip()
            ))

        return ParsedDocument(
            title=filename,
            total_pages=max(1, total_pages),
            sections=sections,
            raw_text="\n\n".join(full_text_parts)
        )

    @staticmethod
    def parse_text(text: str, filename: str) -> ParsedDocument:
        """Parses plain text or markdown, handling page markers and clinical sections."""
        # Detect explicit page breaks like "--- Page X ---" or form feed "\f"
        page_splits = re.split(r"(?:(?:\n|\r\n)---+\s*Page\s*(\d+)\s*---+|\f)", text, flags=re.IGNORECASE)
        
        sections: List[ParsedSection] = []
        current_section = "Overview / General Information"
        
        # If page splits were matched with capturing group, iterate smartly
        pages_text: List[tuple[int, str]] = []
        if len(page_splits) > 1:
            current_page = 1
            idx = 0
            while idx < len(page_splits):
                segment = page_splits[idx]
                if segment is None:
                    idx += 1
                    continue
                if segment.isdigit():
                    current_page = int(segment)
                else:
                    pages_text.append((current_page, segment))
                idx += 1
        else:
            pages_text = [(1, text)]

        total_pages = max([p[0] for p in pages_text]) if pages_text else 1

        for page_num, page_content in pages_text:
            lines = page_content.split("\n")
            buffer = []
            for line in lines:
                stripped = line.strip()
                match = DocumentParser._match_section_header(stripped)
                if match:
                    if buffer:
                        sections.append(ParsedSection(
                            section_name=current_section,
                            page_number=page_num,
                            content="\n".join(buffer).strip()
                        ))
                        buffer = []
                    current_section = match
                else:
                    if stripped:
                        buffer.append(stripped)
            if buffer:
                sections.append(ParsedSection(
                    section_name=current_section,
                    page_number=page_num,
                    content="\n".join(buffer).strip()
                ))

        if not sections:
            sections.append(ParsedSection(
                section_name="General",
                page_number=1,
                content=text.strip()
            ))

        return ParsedDocument(
            title=filename,
            total_pages=total_pages,
            sections=sections,
            raw_text=text
        )

    @staticmethod
    def _match_section_header(line: str) -> Optional[str]:
        if not line or len(line) > 100 or len(line) < 3:
            return None
        
        # Markdown heading check
        if line.startswith("#"):
            cleaned = line.lstrip("#").strip()
            if cleaned:
                return cleaned
                
        # Numbered headings (e.g. "1. INDICATIONS", "4.2 Contraindications")
        if re.match(r"^\d+(\.\d+)*\s+[A-Z]", line):
            return line
            
        # Clinical keywords check
        keywords = [
            "INDICATIONS AND USAGE", "DOSAGE AND ADMINISTRATION", "CONTRAINDICATIONS",
            "WARNINGS AND PRECAUTIONS", "ADVERSE REACTIONS", "ADVERSE EVENTS",
            "DRUG INTERACTIONS", "USE IN SPECIFIC POPULATIONS", "CLINICAL PHARMACOLOGY",
            "NONCLINICAL TOXICOLOGY", "CLINICAL STUDIES", "BOXED WARNING", "HIGHLIGHTS OF PRESCRIBING",
            "STUDY OBJECTIVES", "PRIMARY ENDPOINTS", "SECONDARY ENDPOINTS", "STUDY DESIGN",
            "METHODOLOGY", "PATIENT ELIGIBILITY", "EFFICACY ANALYSIS", "SAFETY ANALYSIS",
            "SAFETY BULLETIN", "OVERALL SURVIVAL", "PROGRESSION-FREE SURVIVAL"
        ]
        upper = line.upper().rstrip(":")
        for kw in keywords:
            if kw in upper:
                return line.rstrip(":")

        return None
