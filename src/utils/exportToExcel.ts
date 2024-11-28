import * as XLSX from "xlsx";
import os from "os";
import path from "path";
import { BreachResult } from "../types/breach";
import { showToast, Toast } from "@raycast/api";

export async function exportToExcel(data: BreachResult[]) {
    try {
        if (!Array.isArray(data) || data.length === 0) {
            await showToast({
                style: Toast.Style.Failure,
                title: "No Data to Export",
                message: "There are no breaches to export.",
            });
            return;
        }

        const rows = data.map((breach) => ({
            Email: breach.email,
            Source: breach.source.name,
            "Breach Date": breach.source.breach_date || "N/A",
            Password: breach.password || "N/A",
            Verified: breach.source.unverified ? "No" : "Yes",
            Fields: breach.fields.join(", ") || "None",
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Breaches");

        const desktopPath = path.join(os.homedir(), "Desktop", "breaches.xlsx");
        XLSX.writeFile(workbook, desktopPath);

        await showToast({
            style: Toast.Style.Success,
            title: "Export Successful",
            message: `File saved to desktop.`,
        });
    } catch (error) {
        await showToast({
            style: Toast.Style.Failure,
            title: "Export Failed",
            message: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    }
}
