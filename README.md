# Noobs Only — DayZ Item Database Beta 1.0.4

Beta 1.0.4 is a maintenance patch on top of the Beta 1.0.3 data-quality cleanup for the static DayZ item and trader database. It keeps the existing UI and data model, corrects hundreds of high-confidence OCR/name issues, repairs trader category/vendor references, and documents remaining ambiguous entries rather than guessing.

## Beta 1.0.4 maintenance changes
- Fixed the desktop category sidebar clipping near the fixed report footer and corrected the top-right version badge.
- Corrected availability and warning behavior for 19 loose-ammunition records whose boxed versions are the actual trader/worldspawn items.

## Beta 1.0.3 data changes
- Corrected more than 260 item-name OCR, spelling, and punctuation issues, especially across vehicle variants and vehicle parts.
- Corrected duplicate Jeep Gladiator category naming and regrouped clearly miscategorized LAPV, MRAP, Blackouts Baja, GMC, Ford Raptor, MotorHome, and DodgeRam entries.
- Reconstructed malformed M1114 Humvee and DodgeRam 3500 rows where the source split part of the vehicle name into a price; these remain flagged as possible duplicates.
- Fixed the Hunting and Fishing vendor ID for 106 listings and replaced `Uncategorized` with the available item subcategory/category.
- Consolidated the screenshot-backed Tahoe DarkBlue listing into the canonical item record.
- Kept ambiguous names and suspicious prices documented in `DATA-QUALITY-AUDIT.md` for future verification.
- Retained the Google Forms reporting connection and prefill support.

See `CHANGELOG.md` for project history, `DATA-QUALITY-AUDIT.md` for this release's corrections and unresolved items, and `DATA-REVIEW.md` for the latest review status.

## Beta 1.0.1 data changes
- Applied the user's follow-up corrections from `DATA-REVIEW.md`.
- Removed the unusable `$c`, `BK-18 s e B0`, and `30rd KA-MA Mag` records/listings rather than guessing.
- Added user-confirmed GunsMags records for Kimber Custom, Kimber Custom Mag, ArexZero, ArexZero Mag 18Rnd, and Marlin 1895, with reliability markers where names or fields remain uncertain.
- Added explicit missing-field display support so a verified missing field can still be shown with its marker in item details.
- Added the `corrected` reliability state for future report-driven corrections.

See `CHANGELOG.md` for the complete project history and `DATA-REVIEW.md` for the current data-review state.
