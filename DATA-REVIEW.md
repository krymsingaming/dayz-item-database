# Beta 1.0.2 Data Review — Amendment

This amendment completes corrections from the original Beta 1.0.1 review. These changes are included in the Beta 1.0.2 correction batch and do not create a new version number.

## Applied in this amendment
- Removed the malformed `2014 Chevy Tahoe Hea 20 $` vehicle record and its trader listing.
- Added `2014 Chevy Tahoe DarkBlue` and `2014 Chevy Tahoe Red`, using the established Tahoe vehicle price pattern. Their six expected part records are checked below.
- Corrected Tahoe part OCR/typos and merged duplicate records where a canonical record already existed, preserving the canonical item record and its enriched data.
- Corrected `Tahoe Trunk Pink $` / `Tahoe Trunk Pink S0` to `Tahoe Trunk Pink` and merged duplicates. The prior note saying this record was absent was incorrect; it was present in Beta 1.0.1.
- Removed the duplicate `Boxed 7.62x54mmR Tracer Rounds` item record and reassigned its trader listing to the canonical spreadsheet-enriched record. The canonical boxed item links to the loose tracer record, which retains Damage 150 and `Mod: Vanilla`.
- Applied the user-confirmed rule that guns, ammunition, and attachments sold at Altar are Vanilla, including ammunition used by modded weapons. In particular, `7.62x54mmR Tracer` is Vanilla even though the MAK-54 that uses it is a Morty's weapon.

## Tahoe variant part coverage

Each color variant should have DriverDoor, CoDriverDoor, CargoDoor1, CargoDoor2, Hood, and Trunk. The records are present for both DarkBlue and Red after this amendment. Where an imported trader listing was not available for a part, the record is marked inferred rather than inventing a price.

## Reporting setup status

The report action is currently not connected to a real Google Form/Sheet because `data/reporting.json` has an empty `formUrl`. A Google Form must be created and linked to a response spreadsheet by the database owner; the published form URL then needs to be added to this file. See `REPORTING-SETUP.md`.

## Reliability conventions
- Confirmed information: no reliability icon.
- Inferred information: `ⓘ`.
- Confirmed unavailable / not applicable: `❌`.
- Information not found yet, or reported incorrect: `⚠`.
- Previously missing information that has since been corrected: `ⓘ` via the `corrected` state.
