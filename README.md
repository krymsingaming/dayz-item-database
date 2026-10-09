# Noobs Only — DayZ Item Database Beta 1.0.2

Beta 1.0.2 is a source-backed Trader-Altar vehicle-name correction release following Beta 1.0.1. The major UI architecture remains unchanged.

## Beta 1.0.2 data changes
- Applied the user-confirmed Jeep, Bronco, Tahoe, and Toyota 4Runner vehicle-name corrections from the Beta 1.0.1 review.
- Removed duplicate vehicle-part item records where a clean record already existed and reassigned their trader listings to the clean record.
- Corrected the confirmed 2014 Chevy Tahoe Green and Pink variant typos.
- Preserved `2014 Chevy Tahoe Hea 20 $` because the evidence does not establish whether it represents the missing DarkBlue or Red variant.
- Did not guess unrelated OCR strings that were not resolved by the user.

## Beta 1.0.1 data changes
- Applied the user's follow-up corrections from `DATA-REVIEW.md`.
- Removed the unusable `$c`, `BK-18 s e B0`, and `30rd KA-MA Mag` records/listings rather than guessing.
- Added user-confirmed GunsMags records for Kimber Custom, Kimber Custom Mag, ArexZero, ArexZero Mag 18Rnd, and Marlin 1895, with reliability markers where names or fields remain uncertain.
- Added explicit missing-field display support so a verified missing field can still be shown with its marker in item details.
- Added the `corrected` reliability state for future report-driven corrections.

See `CHANGELOG.md` for the complete project history and `DATA-REVIEW.md` for the current data-review state.
