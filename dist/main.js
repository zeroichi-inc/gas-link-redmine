function update () {
                return _entry.update(...arguments);
            };
"use strict";
var _entry = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    update: () => update
  });

  // src/services/spreadsheet/spreadsheetService.ts
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var writeSpreadsheet = (data) => {
    const sheet = ss.getSheetByName(data.sheetName);
    if (!sheet) {
      showMessage("\u30B7\u30FC\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F", 3);
      return;
    }
    showMessage("\u30B7\u30FC\u30C8\u30AF\u30EA\u30A2");
    sheet.clear();
    const writeData = convertSheetData(data);
    showMessage("\u66F8\u304D\u8FBC\u307F\u4E2D");
    sheet.getRange(1, 1, writeData.length, writeData[0].length).setValues(writeData);
    showMessage("\u7D42\u4E86\u3057\u307E\u3057\u305F", 3);
  };
  var convertSheetData = (data) => {
    switch (data.sheetName) {
      case "time_entries" /* TIME_ENTRIES */:
        const headers = ["time_entry_id", "\u4F5C\u696D\u65E5", "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8ID", "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u540D", "\u30E6\u30FC\u30B6\u30FC\u540D", "\u30B3\u30E1\u30F3\u30C8", "\u30C1\u30B1\u30C3\u30C8ID", "\u4F5C\u696D\u5206\u985E", "\u4F5C\u696D\u6642\u9593", "\u30B3\u30B9\u30C8"];
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
            `=VLOOKUP(INDIRECT("E"&ROW()),'\u30B3\u30B9\u30C8'!$A$1:$C$21,3,FALSE)*INDIRECT("I"&ROW())`
          ];
        });
        convertData.unshift(headers);
        return convertData;
      default:
        return [];
    }
  };
  var showMessage = (message, timeout = -1) => {
    ss.toast(message, "", timeout);
  };

  // src/constants/redmine.ts
  var API_LIMIT = 100;

  // src/api/redmineApi.ts
  var FORMAT = ".json";
  var API_KEY = PropertiesService.getScriptProperties().getProperty("REDMINE_API_KEY");
  var BASE_URL = PropertiesService.getScriptProperties().getProperty("REDMINE_URL");
  var OPTIONS = {
    muteHttpExceptions: true
  };
  var fetchAllRequest = (endpoint) => __async(void 0, null, function* () {
    try {
      let offset = 0;
      let moreResults = true;
      const pageSize = 100;
      const allTimeEntries = [];
      while (moreResults) {
        const urls = [...Array(pageSize)].map((_, cnt) => {
          const queryParams = [`limit=${API_LIMIT}`, `offset=${offset}`, `key=${API_KEY}`];
          const url = `${BASE_URL}${endpoint}${FORMAT}?${queryParams.join("&")}`;
          offset += API_LIMIT;
          return url;
        });
        let foundEmptyResponse = false;
        const responses = UrlFetchApp.fetchAll(urls.map((url) => __spreadValues({ url }, OPTIONS)));
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
        });
        if (foundEmptyResponse) {
          moreResults = false;
        }
      }
      return [].concat(...allTimeEntries);
    } catch (e) {
      throw new Error(`Error fetching data: ${e}`);
    }
  });

  // src/services/redmine/redmineService.ts
  var getTimeEntries = () => __async(void 0, null, function* () {
    showMessage("\u5DE5\u6570\u53D6\u5F97\u4E2D");
    return yield fetchAllRequest("time_entries" /* TimeEntries */);
  });

  // src/controllers/spreadsheetController.ts
  var ss2 = SpreadsheetApp.getActiveSpreadsheet();
  var updateTimeEntries = () => __async(void 0, null, function* () {
    const data = {
      values: yield getTimeEntries(),
      sheetName: "time_entries" /* TIME_ENTRIES */
    };
    writeSpreadsheet(data);
  });

  // src/main.ts
  function update() {
    updateTimeEntries();
  }
  return __toCommonJS(main_exports);
})();
