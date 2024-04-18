/**
 * 工数取得機能
 */

import { SheetName } from '../constants/sheet';
import { writeSpreadsheet, SheetType } from '../services/spreadsheet/spreadsheetService';
import { getTimeEntries } from '../services/redmine/redmineService';

const ss = SpreadsheetApp.getActiveSpreadsheet();

export const updateTimeEntries = async () => {   
    const data: SheetType = {
        values: await getTimeEntries(),
        sheetName: SheetName.TIME_ENTRIES
    }
    writeSpreadsheet(data);
}
