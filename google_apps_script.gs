// =====================================================================
//  GOOGLE APPS SCRIPT — Zepto Hiring Lead Capture
//  Paste this ENTIRE file into the Apps Script editor, then Deploy.
//  Target Sheet ID: 11ez4yDoJ1oi4QPk_LOXmOPrLTY3Vhk1xN7w845u4YlA
// =====================================================================

const SHEET_ID   = "11ez4yDoJ1oi4QPk_LOXmOPrLTY3Vhk1xN7w845u4YlA";
const SHEET_NAME = "Sheet1"; // Change only if your tab has a different name

// ── Primary handler: receives form POST data from the website ──
function doPost(e) {
  return saveData(e);
}

// ── Fallback: also handle GET requests (for testing in browser) ──
function doGet(e) {
  return saveData(e);
}

// ── Core logic: save form data to sheet ──
function saveData(e) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Auto-create header row on first run
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Phone Number",
        "Email",
        "City",
        "Work Type"
      ]);
      sheet.getRange(1, 1, 1, 6)
           .setFontWeight("bold")
           .setBackground("#551FFF")
           .setFontColor("#FFFFFF");
    }

    // Read form parameters
    var p = e.parameter;
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      p.fullName || "",
      p.phone    || "",
      p.email    || "",
      p.city     || "",
      p.workType || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

