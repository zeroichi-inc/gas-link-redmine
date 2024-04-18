/**
 * API共通処理
 */

import { API_LIMIT } from '../constants/redmine';

const FORMAT = '.json';

const API_KEY = PropertiesService.getScriptProperties().getProperty('REDMINE_API_KEY');
const BASE_URL = PropertiesService.getScriptProperties().getProperty('REDMINE_URL');
const OPTIONS = {
    muteHttpExceptions: true,
};


export const getRequest = (endpoint: string, params?: { [key: string]: string }): Promise<any> => {
    try {
        const queryParams = [`limit=${API_LIMIT}`, `key=${API_KEY}`];
        if (params) {
            if (params.offset) {
                queryParams.push(`offset=${params.offset}`);
            }
            if (params.include) {
                queryParams.push(`include=${params.include}`);
            }
        }
        const url = `${BASE_URL}${endpoint}${FORMAT}?${queryParams.join('&')}`;

        const response = UrlFetchApp.fetch(url, OPTIONS);
        const statusCode = response.getResponseCode();
        if (statusCode == 200) {
            return JSON.parse(response.getContentText());
        } else {
            throw new Error(`Request failed with status ${statusCode}`);
        }
    } catch (e) {
        throw new Error(`Error fetching data: ${e}`);
    }
}

export const fetchAllRequest = async <T>(endpoint: string):Promise<any> => {
    try {
        let offset = 0;
        let moreResults = true;
        const pageSize = 100;
        const allTimeEntries: any[] = [];

        while (moreResults) {
            const urls = [...Array(pageSize)].map((_, cnt) => {
                const queryParams = [`limit=${API_LIMIT}`, `offset=${offset}`, `key=${API_KEY}`];
                const url = `${BASE_URL}${endpoint}${FORMAT}?${queryParams.join('&')}`;
                offset += API_LIMIT;
                return url;
            });

            let foundEmptyResponse = false;
            const responses = UrlFetchApp.fetchAll(urls.map(url => ({ url, ...OPTIONS })));
            responses.forEach((response) => {
                const statusCode = response.getResponseCode();
                if (statusCode == 200) {
                    const data = JSON.parse(response.getContentText());
                    const timeEntries = data.time_entries;
                    if (timeEntries.length > 0) {
                        allTimeEntries.push(timeEntries);
                    } else {
                        foundEmptyResponse = true;
                    }
                } else {
                    throw new Error(`Request failed with status ${statusCode}`);
                }
            
            })

            if (foundEmptyResponse) {
                moreResults = false;
            }
        }
        return [].concat(...allTimeEntries);
            
    } catch (e) {
        throw new Error(`Error fetching data: ${e}`);
    }
}
