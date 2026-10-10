# Beta 1.0.3 Data Review

This release adds a broad OCR/name/category cleanup pass on top of Beta 1.0.2. See `DATA-QUALITY-AUDIT.md` for the applied corrections and the intentionally unresolved items. The original screenshot-backed Tahoe DarkBlue record is consolidated into the canonical item record, and the Ford Raptor, GMC, Blackouts Baja, and MotorHome menu groups are separated from neighboring vehicle categories.

## Scope and safeguards
- Preserved item IDs and distinct same-name/color variants.
- Corrected only high-confidence OCR/name/category errors.
- Reconstructed malformed M1114 Humvee and DodgeRam 3500 name/price rows only where the master workbook or a canonical neighboring listing supported the values. These remain flagged as possible duplicate candidates.
- Kept ambiguous names and suspicious prices for verification instead of guessing.
- Google Forms reporting remains configured from the provided prefill link; file uploads still require respondents to sign into Google.
