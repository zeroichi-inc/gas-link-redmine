import { TimeEntryModel } from '../../models/timeEntryModel';
import { fetchAllRequest }  from '../../api/redmineApi';
import { RedmineEndPoint } from '../../constants/redmine';
import { showMessage } from '../spreadsheet/spreadsheetService';

export const getTimeEntries = async (): Promise<TimeEntryModel[]> => {
    showMessage("工数取得中");
    return await fetchAllRequest<TimeEntryModel[]>(RedmineEndPoint.TimeEntries);
}
