/**
 * Lansing Alpha - Google Apps Script Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 * 2. Name it "Lansing Alpha Interest Form Responses"
 * 3. In row 1, add these headers:
 *    Timestamp | First Name | Last Name | Email | Phone | Zip Code | City | Children | How Heard
 * 4. Go to Extensions > Apps Script
 * 5. Delete the default code and paste this entire file
 * 6. Click Deploy > New deployment
 * 7. Select type: "Web app"
 * 8. Set "Execute as": Me
 * 9. Set "Who has access": Anyone
 * 10. Click Deploy and copy the Web App URL
 * 11. Replace YOUR_GOOGLE_APPS_SCRIPT_URL in script.js with that URL
 * 12. Commit and redeploy to Cloudflare Pages:
 *     cd lansing-alpha && npx wrangler pages deploy . --project-name lansing-alpha
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Format children data
    var childrenStr = '';
    if (data.children && data.children.length > 0) {
      childrenStr = data.children.map(function(child, i) {
        return 'Child ' + (i + 1) + ': ' + (child.grade || 'N/A') + ' / ' + (child.school || 'N/A');
      }).join('; ');
    }

    // Append row
    sheet.appendRow([
      new Date(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.zipCode || '',
      data.city || '',
      childrenStr,
      data.howHeard || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Lansing Alpha form backend is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
