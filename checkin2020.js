const sheetId = "1P-Bgk3J9WbHhw7Q6XQiu6CvjwW9RdOwXq0j3_hC1zKk"; //蝴蝶夫人
const sheetName = "record";
const sheetActive = SpreadsheetApp.openById(sheetId);
const sheet = sheetActive.getSheetByName(sheetName);

function doGet(e) {
  var param = e.parameter;
  var key = param.key;
  // var date = param.date;
  var date = getDateKey();
  var timeStamp = getTimeStamp();

  var row = findInColumn("A", key);
  if (row === -1) {
    const replyMsg = {
      key: key,
      statusCode: 404,
      msg: `No this key. ${date} ${timeStamp}`,
    };
    return ContentService.createTextOutput(JSON.stringify(replyMsg));
  }

  var columnIdx = findInRow(date);
  if (columnIdx === -1) {
    date = getDateKeyWithSegment();
    if (columnIdx === -1) {
      const replyMsg = {
        key: key,
        statusCode: 404,
        msg: `No this date. ${date} ${timeStamp} ${row}`,
      };
      return ContentService.createTextOutput(JSON.stringify(replyMsg));
    }
  }

  var column = columnToLetter(columnIdx);
  var cell = sheet.getRange(row, columnIdx);
  cell.setValue(timeStamp);
  var name = sheet.getRange(row, 2).getValue();

  const replyMsg = { key: key, name: name, date: date, time: timeStamp };
  return ContentService.createTextOutput(JSON.stringify(replyMsg));
}

function isTwoReharsalDate(date) {
  return twoReharsalDates.includes(date);
}

function getDateKey() {
  const today = new Date();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var hour = today.getHours();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var date = month + day;
  return date;
}

function getDateKeyWithSegment() {
  const today = new Date();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var hour = today.getHours();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var date = month + day;
  if (hour < 12) {
    date = date + "A";
  } else if (hour < 17) {
    date = date + "B";
  } else if (hour < 21) {
    date = date + "C";
  }
  return date;
}

function getTimeStamp() {
  const today = new Date();
  var hour = today.getHours();
  var minute = today.getMinutes();
  var second = today.getSeconds();
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  return hour + ":" + minute + ":" + second;
}

function findInColumn(column, data) {
  var column = sheet.getRange(column + ":" + column); // like A:A
  var values = column.getValues();
  var row = 0;
  while (values[row] && values[row][0] !== data) {
    row++;
  }
  if (values[row] && values[row][0] === data) return row + 1;
  else return -1;
}

function findInRow(data) {
  var valueColumn = -1;
  for (i = 1; i <= sheet.getLastColumn(); i++) {
    if (sheet.getRange(1, i).getValue() == data) {
      valueColumn = i;
      break;
    }
  }
  return valueColumn;
}

function columnToLetter(column) {
  var temp,
    letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}
