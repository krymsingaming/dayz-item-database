# Noobs Only — DayZ Item Database Alpha 9

Alpha 9 is a UI architecture revision of the Alpha 5 database build.

## Major UI changes

- Item Database and Trader Browser are separate views. The Trader Browser is not displayed beside normal search results.
- Searching/filtering the Item Database produces compact horizontal item bars rather than a card grid.
- Item bars use a file-explorer-style expand/collapse interaction.
- Same-name records remain separate in the data but are grouped in the item list for readability. The group count has a hoverable information icon explaining why the records are grouped.
- Category filtering is now a nested file-explorer-style category/subcategory tree.
- The first item interaction expands the item bar instead of opening a modal.
- A dedicated item detail view is available from the expanded item bar.
- Trader links open the Trader Browser with the relevant location, vendor, category, and item already selected/expanded when possible.
- Trader Browser rows are also file-explorer-style expandable rows.
- Trader state labels such as "Buy & Sell" and "Sell Only" are no longer displayed to players. Buy/sell availability is communicated directly by the presence of the corresponding price.
- Information/warning icons use hover tooltips so explanatory text does not make normal rows unnecessarily tall.
- The detail view retains the full explanatory information where appropriate.

## Data

Alpha 9 retains the Alpha 5 merged data set, including screenshot-imported Altar trader data and the vehicle enrichment work. This release changes presentation/navigation only unless noted in the source notes.

## Alpha 9 data review
Alpha 9 includes a `DATA-REVIEW.md` file documenting confirmed OCR corrections, source-backed ammunition/ballistics enrichment, and remaining suspicious entries that were deliberately left unresolved rather than guessed.
