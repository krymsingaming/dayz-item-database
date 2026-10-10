# Google Forms reporting setup

The Google Form responder URL and the two prefill entry IDs are now configured in `data/reporting.json`. The website automatically fills the **Item / Listing name** and **Field or Relationship** questions. It deliberately leaves the correction type, correction details, evidence, and contact questions for the player to complete.

## What the website pre-fills

- On an item page, the item’s category breadcrumb and name (for example, `Weapon/Firearms/Sidearms/FX-45`).
- On a trader page, the location, trader, menu category, item breadcrumb, and item name.
- The field the player clicked, such as `Caliber`, `Buy Price`, or `Sell Price`.

Buy and Sell prices in the Trader Browser are now report buttons. Clicking one opens the form with the corresponding listing context and field prefilled.

## Evidence upload limitation

Google Forms’ **File upload** question requires respondents to sign in to a Google account. This is a Google Forms restriction, not a website integration error. If you want to let players report without signing in, replace or supplement the upload question with an optional evidence URL field. The reporter can share an image link from a host they are comfortable using; remind them to make the link viewable by the report reviewer.

## If the form changes later

If you delete and recreate the two context questions, Google Forms may assign new `entry...` IDs. Update `prefillFields` in `data/reporting.json` using a new pre-filled link. Keep `formUrl` as the base responder URL without query parameters.
