# Public Data Reporting Setup (Google Forms + Google Sheets)

The database is a static GitHub Pages site, so it cannot write directly into a private Google Sheet. The simple, free option is a Google Form linked to a Google Sheet. Friends submit reports through the form; responses are stored in the Sheet for you to review. The Sheet should remain private.

## One-time setup
1. While signed into the Google account that should own the reports, open https://forms.google.com and create a blank form named **Noobs Only Item Database — Data Report**.
2. Add these questions (make the first two short-answer fields required):
   - **Item / listing name** — Short answer
   - **Field or relationship to review** — Short answer
   - **Report type** — Multiple choice: Missing information; Incorrect information (I know the correction); Incorrect information (I don't know the correction); Confirm / verify existing information; Other
   - **Suggested correction or details** — Paragraph
   - **Evidence / screenshot link** — Short answer (optional; respondents may paste a share link)
   - **Your contact (optional)** — Short answer
3. In the form's **Responses** tab, click the green Sheets icon and choose **Create a new spreadsheet**. This links responses to a private response spreadsheet. Do not make the spreadsheet public.
4. Use **Publish** / **Send** to make the form available to people with the link. In access settings, allow your intended testers to respond; avoid collecting email addresses unless you specifically want that.
5. Copy the public responder URL (not the editor URL).
6. Open `data/reporting.json` and replace the empty `formUrl` value with that URL, keeping the JSON quotes. Commit/publish that one-file change to GitHub Pages.

## Test before sharing
- Open the live database in a private/incognito window.
- Click a field's Report marker and confirm the form opens.
- Submit a test report and verify it appears as a new row in the linked Sheet.
- Delete the test response afterward if desired.

## Important current limitation
The current report link opens the form and shows the item/field context in the database before opening it, but it does not yet prefill Google Form answers automatically. Google Forms requires each question's `entry.<number>` identifier to build a prefilled link. Once the form exists, you can send the form's **Get pre-filled link** URL (or provide the entry IDs) and the app can be updated to prefill item name and field automatically.

Google Forms and Google Sheets are free for ordinary personal use. You do not need to publish the response Sheet or give testers edit access to it.
