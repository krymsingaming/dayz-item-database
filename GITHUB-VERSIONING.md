# GitHub Versioning Workflow

The repository should use **Git commits + version tags + GitHub Releases** rather than storing every historical ZIP inside the live site directory.

## Recommended naming

- `v0.0.1-pre-alpha`
- `v0.0.2-pre-alpha`
- ...
- `v1.0.0-alpha`
- `v2.0.0-alpha`
- `v1.0.0-beta`

The website itself uses the human-readable form (`Beta 1.0.0`), while Git tags use the `v` prefix.

## What goes into Git

The live repository should contain the current website source:

- `index.html`
- `style.css`
- `app.js`
- `data/`
- `CHANGELOG.md`
- `VERSION.json`
- documentation files

## What goes into GitHub Releases

For every important build, create a GitHub Release from the corresponding tag and attach the ZIP of that build. This preserves the exact downloadable snapshot without filling the working repository with old ZIP files.

## Normal workflow for future builds

1. Make the changes.
2. Update `VERSION.json`.
3. Add the new entry to `CHANGELOG.md`.
4. Test the site.
5. Commit the changes.
6. Create a tag for the version.
7. Push the commit and tag.
8. Create a GitHub Release from that tag.
9. Attach the build ZIP if an archived ZIP is desired.
10. Publish GitHub Pages from the current/default branch.

The version tag is the permanent pointer to that exact commit; later work does not change the tagged snapshot.
