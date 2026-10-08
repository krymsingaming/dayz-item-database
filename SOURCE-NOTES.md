# Source Notes — Alpha 9

Alpha 9 carries forward the Alpha 5 data import and vehicle enrichment. The primary change in this release is UI/navigation architecture.

## Trader/item crossover

The Item Database and Trader Browser are intentionally separate views.

From an item:
- Trader Listings opens the Trader Browser with the relevant trader/location/category selected and the relevant listing expanded.
- Trader prices are treated as navigation targets rather than a second trader database being displayed beside the item search.

From the Trader Browser:
- Selecting a listing expands it in place.
- The listing can open the item's dedicated detail view.

## Same-name records

Same-name records are not merged into one underlying record. They are grouped only in the visible item list. This is especially important for color/cosmetic variants and vehicle variants.

Visible group explanation:

> These records share the same displayed name and are grouped for readability. They remain separate because they may be unique variants, such as different colors or cosmetic effects.

## Vehicle enrichment

Where trader evidence and the existing spreadsheet vehicle data identify the same vehicle strongly enough, the database may use the spreadsheet to enrich vehicle details. Trader screenshot price/name evidence takes precedence when the live trader evidence differs from the older spreadsheet data.

Vehicle part listings can be used to infer temporary attachment-point names. Such inferred names remain explicitly provisional and should be corrected when stronger evidence becomes available.

## Alpha 9 data/UI refinement
- Replaced browser-clipped CSS-only hover tooltips with a short-delay global tooltip (~120 ms) so markers work inside horizontally clipped item rows.
- Confirmed unavailable trader actions use ❌; missing/unverified information uses ⚠; inferred/review information uses ⓘ.
- Item and trader category browsers use the same hierarchical navigation pattern; root headings reset to the full view.
- Item classification displays the full browse path, including the root category, and shows alternate paths through an ⓘ tooltip when applicable.
- Weapon Supplies ammunition pagination duplicates were cleaned where the repeated record was clearly the same item/price; Flare retains four actual trader entries from the screenshot page.
- Magazine listings were normalized to the Magazine category and pagination duplicates merged where the source evidence clearly showed the same record.
- Loose ammunition ballistics were populated from the Bullet Damage spreadsheet where the mapping was clear. Diesel overrides and shock values are retained as data; no effect beyond the recorded numeric values is inferred.
- Magazine capacities and weapon→magazine relationships were added where the trader item name directly establishes them.
- Remaining suspicious OCR/spreadsheet entries are documented in DATA-REVIEW.md rather than guessed.
