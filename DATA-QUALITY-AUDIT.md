# Beta 1.0.3 Data Quality Audit

This is a data-cleanup release based on the existing Beta 1.0.2 data and the project master workbook. It preserves item IDs and distinct variant records. Prices were changed only where the imported text clearly split a model name and the master workbook or adjacent canonical listing supplied the intended price.

## Summary
- Item-name cleanup: more than 260 high-confidence corrections across the item database, including repeated OCR errors in vehicle names and parts.
- Trader menu-category values corrected or normalized: more than 230 listing rows, including model-family regrouping.
- Vehicle Trader listings audited: 1138.
- Item records: 2500. Trader listing records: 2484.

## High-confidence corrections applied
- Corrected M1114 Humvee OCR variants such as `41114`, `441114`, `#41114`, `#1114`, `Humvce`, and `Humyce`.
- Reconstructed three malformed `< M1` / `« M1` / `114` rows as `M1114 Humvee`; buy/sell prices were restored from the master Vehicles worksheet (750000 / 375000). All three are flagged as possible duplicate listings and need in-game/trader confirmation before deleting any.
- Reconstructed two malformed `< DodgeRam` / `3500` rows as `DodgeRam 3500`; prices restored from the existing DodgeRam 3500 listing (700000 / 350000). Both remain separate and flagged as possible duplicates pending verification.
- Corrected clear OCR errors across vehicle parts and names, including `Clowplug` → `Glow Plug`, `BMW £34` → `BMW E34`, `DadgeRam` → `DodgeRam`, `Oriver` → `Driver`, `LAPY` → `LAPV`, `Landrever` → `Landrover`, and repeated cargo-door number/color OCR mistakes where the pattern was clear.
- Normalized Jeep Gladiator menu category typo `Jeep_CladiatorF9` to `Jeep_GladiatorF9`, including related item subcategories and the remaining misspelled Jeep model prefixes.
- Reassigned clearly model-mismatched LAPV, MRAP Cougar, MRAP Punisher, DodgeRam 3500, Blackouts Baja, GMC, Ford Raptor, and MotorHome listings to their corresponding menu categories. Updated item subcategories to match those corrected families.
- Corrected clear non-vehicle category spelling errors: `Supressors`, `Hoodies & Sweater`, `Holster & Pouches`, and `Tackle and Knifes`.
- Repaired 106 Hunting and Fishing listings that referenced a nonexistent vendor ID, and replaced their `Uncategorized` labels with the available item subcategory/category. Corrected obvious fish-name misspellings including `StealheadTrout` and `Largemout Bass`.
- Removed obvious leading/trailing OCR punctuation where it did not convey variant information.

## Still requires review
- A few entries remain too corrupted to safely reconstruct, including `Rq2 .` (formerly `Rq2 . ‘`) and `Kamaz_TyphoonK_Trunk CamoGreen 2h`. They are deliberately not guessed.
- Some item names still contain `?` or unusual symbols in cargo-part names where the intended slot number is ambiguous, including `LAPV Carga? Door (Desert)` and some Kamaz cargo entries.
- The three reconstructed M1114 rows and two reconstructed DodgeRam rows are possible duplicate candidates; they were not deleted because the available source does not prove whether each is a duplicate or a distinct listing.
- The GMC, Blackouts Baja, Ford Raptor, and MotorHome groups were split from neighboring categories based on the item names. A few other mixed/ambiguous categories may remain and should be checked against the live trader.
- Vehicle prices were not normalized wholesale. Unusual prices (for example, sell 41000 or buy 2800/sell 4000) were preserved unless there was direct support for a correction.

## Reporting status
The Google Forms responder URL and prefill entry IDs remain configured. The site fills the Item / Listing name and Field / Relationship questions; correction type, corrected information, evidence, and contact are left for the reporter. File uploads in Google Forms require a Google sign-in; an optional evidence-link question is the sign-in-friendly alternative.

## Validation
Final validation passed: all JSON files parse, JavaScript syntax checks, item/listing IDs are unique, and every trader listing references an existing item and a defined vendor. ZIP integrity was checked before delivery.


## Beta 1.0.4 availability clarification
- The 19 loose-ammunition items with a corresponding boxed item are explicitly marked `availability.trader: false` and `availability.worldSpawn: false`. Their boxed counterparts remain the records intended for loot/trader availability.
- Loose Flare and Bolt were not assigned these false values because they have no boxed-ammunition target in the current item data; their existing trader behavior remains unchanged.
- The database no longer flags known non-traded loose ammo as a missing trader-availability warning in the main item row.
