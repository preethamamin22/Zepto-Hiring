# How to integrate the form with Google Sheets

The website is fully built and ready! It captures the required fields: Full Name, Phone Number, Email, City, and Work Type.

To forward this data to the Google Sheet provided (`https://docs.google.com/spreadsheets/d/11ez4yDoJ1oi4QPk_LOXmOPrLTY3Vhk1xN7w845u4YlA/edit?usp=sharing`), you will need to set up a Google Apps Script Web App. 

Follow these steps exactly:

### Step 1: Open the Google Sheet
1. Go to your Google Sheet: [Link](https://docs.google.com/spreadsheets/d/11ez4yDoJ1oi4QPk_LOXmOPrLTY3Vhk1xN7w845u4YlA/edit?usp=sharing)
2. Make sure you are logged in and have Edit access to it.
3. In the first row of the sheet, create these EXACT headers in columns A through F:
   `Date | Full Name | Phone Number | Email | City | Work Type`

### Step 2: Open Google Apps Script
1. In the Google Sheets menu, click on **Extensions** > **Apps Script**.
2. Delete any code in the editor, and paste the following code:

```javascript
const sheetName = 'Sheet1'; // Change this if your sheet tab has a different name

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const rowData = [
      new Date(), // Date
      e.parameter.fullName,
      e.parameter.phone,
      e.parameter.email,
      e.parameter.city,
      e.parameter.workType
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as Web App
1. Click the **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Under Description, type "Lead Capture Form".
4. Under "Execute as", select **Me**.
5. Under "Who has access", select **Anyone**.
6. Click **Deploy**. (You may need to authorize access through your Google Account. Click "Advanced" -> "Go to script (unsafe)").
7. Copy the **Web app URL** that is generated.

### Step 4: Update `script.js`
1. Open the `script.js` file in your project.
2. Find line 22 where it says:
   `const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";`
3. Replace `"YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"` with the URL you just copied.

### You're Done!
Your landing page form will now correctly send leads directly to your Google Sheet. It is ready for high-conversion advertising campaigns.
