// =====================================================================
//  GOOGLE APPS SCRIPT — Zepto Hiring Lead Capture
//  Paste this ENTIRE file into the Apps Script editor, then Deploy.
//  Target Sheet ID: 11ez4yDoJ1oi4QPk_LOXmOPrLTY3Vhk1xN7w845u4YlA
// =====================================================================

const SHEET_ID   = "11ez4yDoJ1oi4QPk_LOXmOPrLTY3Vhk1xN7w845u4YlA";
const SHEET_NAME = "Sheet1"; // Change only if your tab has a different name

// ── Primary handler: GET with URL params (no CORS issues for static sites) ──
function doGet(e) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet if it somehow doesn't exist
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

    // Read URL params (sent from the website form via fetch GET)
    const p = e.parameter;
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      p.fullName || "",
      p.phone    || "",
      p.email    || "",
      p.city     || "",
      p.workType || ""
    ]);

    return buildResponse({ result: "success" });
  } catch (err) {
    return buildResponse({ result: "error", message: err.toString() });
  }
}

// ── Fallback: POST handler (not used by website but useful for testing) ──
function doPost(e) {
  // Delegate to same logic by adapting the event object
  return doGet(e);
}

// ── Helper: return plain JSON ────────────────────────────────────────
function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
