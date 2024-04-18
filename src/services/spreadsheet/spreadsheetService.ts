import { TimeEntryModel } from '../../models/timeEntryModel';
import { SheetName } from '../../constants/sheet';

const ss = SpreadsheetApp.getActiveSpreadsheet();

export const writeSpreadsheet = (data: SheetType): void => {
        const sheet = ss.getSheetByName(data.sheetName);
        if (!sheet) {
            showMessage('シートが見つかりませんでした', 3);
            return;
        }

        showMessage("シートクリア");
        sheet.clear();

        const writeData = convertSheetData(data);

        showMessage("書き込み中");
        sheet.getRange(1, 1, writeData.length, writeData[0].length).setValues(writeData);
        showMessage("終了しました", 3);
}

export const convertSheetData = (data: SheetType): string[][] => {
    switch (data.sheetName) {
        case SheetName.TIME_ENTRIES:
            const headers = ["time_entry_id", "作業日", "プロジェクトID", "プロジェクト名", "ユーザー名", "コメント", "チケットID", "作業分類", "作業時間", "コスト"];
            const convertData = data.values.map((d) => {
                return [
                    d.id,
                    d.spent_on,
                    d.project.id,
                    d.project.name,
                    d.user.name,
                    d.comments,
                    d.issue ? d.issue.id : "",
                    d.activity.name,
                    d.hours,
                    `=VLOOKUP(INDIRECT("E"&ROW()),'コスト'!$A$1:$C$21,3,FALSE)*INDIRECT("I"&ROW())`
                ]
            })
            convertData.unshift(headers);
            return convertData;
        default:
            return [];
    }
}

export const showMessage = (message: string, timeout: number = -1): void => {
    ss.toast(message, "", timeout);
}

export type SheetType = {
    values: TimeEntryModel[];
    sheetName: SheetName;
}
