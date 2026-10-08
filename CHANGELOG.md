# Noobs Only — DayZ Item Database Changelog

## Versioning

This project uses three-part version numbers inside each development stage:

- **Major** — structural or release-stage change; minor resets to `0`.
- **Minor** — meaningful feature/data-model/UI change within the same stage.
- **Patch** — small correction or refinement within the same stage.

The stage is separate from the number. Examples: `0.1.15 Pre-Alpha`, `Alpha 3.2.4`, `Beta 1.0.0`.

### Historical note

The pre-alpha portion below is a **reconstructed project history** from the preserved project context and build notes. The early conversation is not available here as a complete machine-readable transcript, so these entries should not be treated as a literal one-entry-per-chat-message audit. From Beta onward, every released build will have an explicit version entry and its changes will be recorded here.

---

# Beta

## Beta 1.0.0 — Current

### Release status
First public beta candidate. The major UI architecture is considered sufficiently mature for live use with a small group of testers. The remaining work is primarily data completion, verification, corrections, and refinement based on real-world use.

### UI / navigation
- Promoted the application from Alpha to **Beta**.
- Retained the compact horizontal item/trader rows and hierarchical category browsers established during Alpha.
- Retained the shared navigation model between Item Database and Trader Browser.
- Retained field-level information markers and tooltips.

### Vehicle keys and tags
- Rebuilt the Altar **Vehicle Keys** trader page from the supplied screenshots rather than relying on the corrupted OCR/imported records.
- Added the eight screenshot-confirmed vehicle key records:
  - Vehicle Key
  - Blue Vehicle Key
  - Green Vehicle Key
  - White Vehicle Key
  - Yellow Vehicle Key
  - Red Vehicle Key
  - Purple Vehicle Key
  - Pink Vehicle Key
- Corrected the key purchase price to **5,000 rubles**.
- Added the screenshot-confirmed key-tag records at **1,500 rubles**:
  - Vehicle Key Tag
  - Olga 24 Black/White/Wine Tag
  - Ada 4x4 Blue/White/Green Tag
  - Gunter 2 Blue/Black/Red Tag
  - Sarka 120 Grey/Red/Yellow Tag
  - Black, Blue, Green, Grey, Red, White, and Yellow Tag
- Removed the prior OCR/imported Vehicle Keys listings whose item names and prices did not correspond to the screenshots.
- Removed the incorrect sell prices from the Vehicle Keys page; the supplied page is a purchase listing, so no sell price is recorded.
- Added a **Key Tag** attachment point with quantity 1 to every vehicle key.
- Linked the vehicle keys to the available key-tag records.
- Added reverse key-tag compatibility relationships.
- Documented the user-confirmed behavior that assigning a key to a vehicle does not reveal which vehicle it belongs to; tags provide a visual distinction between otherwise identical keys.
- Added Vehicle Keys and Key Tags to the browse taxonomy.

### Verification
- Vehicle key/tag names, prices, attachment behavior, and visual-tag behavior are recorded as confirmed from the supplied evidence/user observation.
- Exact mod source for these records remains unconfirmed and is therefore marked missing rather than guessed.

---

# Alpha

## Alpha 9.0.0

- Introduced field-level reliability markers and the three primary visible states used by the UI:
  - `❌` confirmed unavailable / not applicable
  - `ⓘ` inferred or informational
  - `⚠` missing/problematic/action needed
- Added global hover tooltip handling.
- Added loose ammunition ballistics from the spreadsheet evidence, including damage, shock where present, Diesel overrides, and armor-related values.
- Added inferred ammunition/magazine relationships where trader and spreadsheet evidence supported them.
- Corrected a set of obvious trader OCR errors, including several ammunition caliber/name errors.
- Corrected Flare pagination duplication.
- Grouped same-name trader records for readability.
- Added a structured data-review checklist for unresolved or suspicious entries.
- Added compact primary facts for weapons, magazines, equipment, storage, vehicles, and ammunition.

## Alpha 8.0.0

- Widened the main database area while preserving the category tree width.
- Converted item/trader rows to compact one-line summaries.
- Moved expansion controls to the right side of the primary row.
- Added hierarchical category paths to item rows.
- Added alternate-category information for items appearing in multiple browse paths.
- Fixed category-tree selection so parent and child nodes actually filter the displayed items.
- Added visible indentation to nested category levels.
- Reworked Trader Browser to use a location → trader → page hierarchy instead of relying on dropdowns.
- Standardized navigation between Item Database and Trader Browser.
- Added consistent Back-to-top links.
- Improved browser-history handling and home/banner navigation.

## Alpha 7.0.0

- Reworked the category browser into a file-explorer-style hierarchy.
- Added independent scrolling for the category panel.
- Reduced redundant information in collapsed item rows.
- Added one-line primary item information.
- Moved the expansion control to the right side of the row.
- Added category-root behavior so clicking a category can also display the items within it.
- Added Trader Browser hierarchy and aligned its visual language with the Item Database.

## Alpha 6.0.0

- Separated Item Database and Trader Browser into distinct views.
- Replaced large item cards with compact expandable horizontal rows.
- Added expandable trader rows.
- Added category filtering tree.
- Added item → trader navigation.
- Added trader → item navigation.
- Added deeper item detail pages.
- Added browser/history-aware navigation.
- Preserved same-name records as separate underlying records while grouping them for readability.

## Alpha 5.0.0

- Imported the expanded Altar trader evidence from the updated master workbook.
- Preserved current screenshot-derived Altar listings while retaining legacy records where no reliable screenshot counterpart could be recovered.
- Enriched vehicle records using the Vehicles and RUSFORMA NEW spreadsheet data where the match was sufficiently strong.
- Established the rule that close spreadsheet matches may enrich vehicle details while the live trader screenshot remains authoritative for trader price.
- Preserved separate vehicle color variants rather than collapsing them into one item.

## Alpha 4.0.0

- Expanded trader browsing and Altar data coverage during the transition from the initial database prototype toward the large screenshot-backed trader dataset.
- Continued separating trader listings from canonical item records while allowing trader evidence to discover/enrich item records.

## Alpha 3.0.0

- Corrected false trader-to-item associations from the previous import.
- Removed placeholder relationships that incorrectly associated unrelated weapons/items with existing records.
- Consolidated the evolving category/property model.
- Added clearer source notes and project documentation.
- Continued the shift toward inferred information being explicitly marked rather than silently treated as confirmed.

## Alpha 2.0.0

- Added same-name record grouping.
- Added grouped trader price summaries and individual-record expansion.
- Preserved duplicate displayed names as separate records where color/cosmetic differences may represent distinct variants.
- Expanded the relational item model and early verification architecture.

## Alpha 1.0.0

- First functional Alpha build of the searchable DayZ item database.
- Established the JSON-backed item/mod data model.
- Established searchable item rows, item details, and the first relational navigation concepts.
- Established the GitHub Pages-compatible static architecture.

---

# Pre-Alpha

## 0.0.1 Pre-Alpha — Project inception

- Defined the goal: a free, searchable public item database for the modded Noobs Only PVE DayZ server.
- Established the core requirement that the user is the sole database editor.
- Established GitHub Pages + HTML/CSS/JavaScript + JSON as the initial free hosting architecture.

## 0.0.2 Pre-Alpha — Static database foundation

- Established the repository/file structure.
- Separated presentation code from JSON data.
- Established `items.json` and `mods.json` as the first core data sources.
- Resolved the early local-file loading/JSON placement problems.

## 0.0.3 Pre-Alpha — Classification model

- Established Category → Subcategory → Properties as the core conceptual classification model.
- Rejected redundant separate tag/form/type systems for the same information.
- Established Vanilla/mod source handling and the player-facing `Mod: Vanilla` concept.

## 0.0.4 Pre-Alpha — Trader architecture

- Moved trader pricing out of individual item economy objects and into `traders.json`.
- Established Location → Trader → Menu Category/Page → Listing as the trader hierarchy.
- Established the distinction between buy availability, sell availability, and unknown world-spawn status.

## 0.0.5 Pre-Alpha — Inventory and item properties

- Established inventory dimensions, storage space, capacity, and max-stack concepts.
- Distinguished item footprint from the storage capacity supplied by an item.
- Established the currency denomination/stacking model.

## 0.0.6 Pre-Alpha — Crafting and construction

- Established interactions/recipes as structured relationships rather than arbitrary item tags.
- Distinguished activation, combining, tool-on-target, assembling/disassembling, and construction.
- Established construction as a separate system from ordinary crafting.

## 0.0.7 Pre-Alpha — Attachment and compatibility model

- Established attachment points as first-class structured data.
- Established compatibility through item IDs, categories/subcategories, reusable rules, and exceptions.
- Established that compatibility should work in both directions so “Fits into” can be generated from host/attachment relationships.
- Established that modded attachment behavior may differ from conventional DayZ expectations and must therefore be evidence-marked.

## 0.0.8 Pre-Alpha — Food, hunting, fishing, and ammunition

- Established Food, Hunting, Fishing, Raw/Cooked/Canned/Packaged, and meat-packing concepts.
- Established boxed vs loose ammunition as distinct records.
- Established that boxed ammunition does not occupy firearm Magazine attachment points.
- Established weapon → magazine → ammunition relationships.

## 0.0.9 Pre-Alpha — Evidence workbook workflow

- Established the master workbook as the evidence source.
- Established screenshot pagination/transition-marker conventions.
- Established that screenshots can be imported in bulk while hover-dependent data can be supplied directly in the spreadsheet.
- Established that screenshot evidence should be processed by trader → category → page rather than manually transcribing hundreds of listings.

## 0.0.10 Pre-Alpha — Altar trader capture and data import

- Completed the first major Altar trader evidence collection.
- Established screenshot-backed trader listing import.
- Established preservation of same-name/color variants as separate records.
- Established the first large-scale trader/item enrichment pass.

---

# Future releases

From **Beta 1.0.0 onward**, version numbers will follow the same rules within the Beta stage:

- `Beta 1.0.1` — small correction/refinement
- `Beta 1.1.0` — meaningful backwards-compatible feature/data-model change
- `Beta 2.0.0` — major structural change
- and so on.

A future production release can start a new stage (for example `1.0.0`) once the database is considered ready for general use.
