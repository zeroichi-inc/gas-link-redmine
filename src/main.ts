/**
 * エントリーポイント
 */
import { updateTimeEntries } from "./controllers/spreadsheetController";

export function update() {
    // TimeEntryデータをシートに書き出す
    updateTimeEntries();
}
