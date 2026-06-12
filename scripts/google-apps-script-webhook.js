/**
 * Naqa Beauty — Google Sheets Order Webhook
 *
 * Setup:
 * 1. Row 1 headers (Feuille 2):
 *    Date | orderId | country | name | phone | product | sku | quantity | totalPrice | currency | status
 * 2. Extensions → Apps Script → paste this file
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone  ← required (not "Anyone with Google account")
 * 4. Copy the deployment URL into GOOGLE_SHEETS_WEBHOOK_URL on frontend (Easypanel)
 */

const SHEET_NAME = "Feuille 2";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ success: false, error: "Sheet not found: " + SHEET_NAME });
    }

    sheet.appendRow([
      data.date || "",
      data.orderId || "",
      data.country || "",
      data.name || "",
      data.phone || "",
      data.product || "",
      data.sku || "",
      data.quantity || "",
      data.totalPrice !== undefined ? data.totalPrice : "",
      data.currency || "",
      data.status || "جديد",
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ status: "ok", service: "Naqa Beauty Orders Webhook" });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
