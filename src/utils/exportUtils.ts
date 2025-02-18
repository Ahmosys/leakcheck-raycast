import * as XLSX from "xlsx";
import os from "os";
import path from "path";
import { BreachResult } from "../types/breach";
import { showToast, Toast } from "@raycast/api";

/**
 * Exports breach data to an Excel file on the user's desktop
 * Creates a spreadsheet with the following columns:
 * - Email: The compromised email address
 * - Source: The name of the breach source
 * - Breach Date: When the breach occurred
 * - Password: Exposed password (if available)
 * - Verified: Whether the breach source is verified
 * - Fields: List of compromised data types
 *
 * @param data - Array of breach results to export
 * @throws Will show error toast if export fails
 * @returns {Promise<void>} Resolves when export is complete
 */
export async function exportToExcel(data: BreachResult[]): Promise<void> {
  try {
    // Validate input data
    if (!Array.isArray(data) || data.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No Data to Export",
        message: "There are no breaches to export.",
      });
      return;
    }

    // Transform data for Excel format
    const rows = data.map((breach) => ({
      Email: breach.email || "N/A",
      Source: breach.source.name || "N/A",
      "Breach Date": breach.source.breach_date || "N/A",
      Password: breach.password || "N/A",
      Verified: breach.source.unverified ? "No" : "Yes",
      Fields: breach.fields.join(", ") || "None",
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Breaches");

    // Save to desktop
    const desktopPath = path.join(os.homedir(), "Desktop", "breaches.xlsx");
    XLSX.writeFile(workbook, desktopPath);

    // Show success message
    await showToast({
      style: Toast.Style.Success,
      title: "Export Successful",
      message: `File saved to your desktop.`,
    });
  } catch (error) {
    // Handle export errors
    await showToast({
      style: Toast.Style.Failure,
      title: "Export Failed",
      message: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
}
