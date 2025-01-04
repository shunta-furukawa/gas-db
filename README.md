# gas-db: Google Sheets Wrapper Library for Apps Script

`gas-db` is a wrapper library for Google Apps Script that simplifies working with Google Sheets. It provides an intuitive API to handle CRUD operations such as retrieving, searching, inserting, updating, and deleting data in sheets.

---

## Features

- Access and manipulate sheet data as JSON-like objects
- Simple and efficient API for CRUD operations
- Manage multiple sheets easily
- Use column names as keys for data manipulation

---

## Setup

This library is already published as an Apps Script library. Follow the steps below to include it in your project:

1. **Open your Apps Script project**  
   Open the [Google Apps Script editor](https://script.google.com/) and create a new project.

2. **Add the library**  
   In the script editor, go to the "Libraries" section, and enter the following script ID:  

```
1-oNObQAV_UrShtdZWEy8FwqmjGpD0-kVxWw-VdZdg0Dmx4xPs9Jp0-5Z
```


3. **Select a version**  
Choose the latest version from the dropdown menu.

4. **Save**  
Click "Save" to add the library to your project.

---

## Usage

### Summary of Benefits
Using `gas-db` reduces boilerplate code, simplifies common operations, and allows developers to focus on business logic rather than low-level spreadsheet manipulations. 
The comparison highlights how gas-db abstracts away complexities like range manipulation and data filtering, making the code cleaner and easier to maintain.

### 1. Basic Operations

Creating an Instance of the `Spreadsheet` Class. The following example demonstrates how to fetch a sheet and retrieve all data from it.

#### Example

Without `gas-db`:

```javascript
function getAllDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  Logger.log(data);
}
```

With `gas-db`:

```javascript
function getAllDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const data = sheet.findAll();
  Logger.log(data);
}
```

---

### 2. Using `from()` to Access Another Spreadsheet

The `Spreadsheet().from(scriptId)` method allows you to connect to a different Google Spreadsheet by providing its script ID. This is particularly useful when you need to work with spreadsheets other than the active one.

#### Example

Without `gas-db`:

```javascript
function accessAnotherSpreadsheetWithoutGasDb() {
  const anotherSpreadsheet = SpreadsheetApp.openById("ANOTHER_SPREADSHEET_ID");
  const sheet = anotherSpreadsheet.getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  Logger.log(data);
}
```

With `gas-db`:

```javascript
function accessAnotherSpreadsheetWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet().from("ANOTHER_SPREADSHEET_ID");
  const sheet = spreadsheet.at("Stories");
  const data = sheet.findAll();
  Logger.log(data);
}
```

---

### ３. CRUD Operations

#### Search Data by Conditions
Retrieve only the data that matches specific conditions.

Without `gas-db`:

```javascript
function findDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  const results = data.filter(row => row[0] === "Adventure"); // Assuming "Title" is in the first column
  Logger.log(results);
}
```

With `gas-db`:

```javascript
function findDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const results = sheet.find({ Title: "Adventure" });
  Logger.log(results);
}
```

#### Insert Data
Add new data to the sheet.

Without `gas-db`:

```javascript
function insertDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  sheet.appendRow(["New Story", "John Doe"]); // Assuming Title and Author are the only columns
}
```

With `gas-db`:

```javascript
function insertDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  sheet.insert({ Title: "New Story", Author: "John Doe" });
}
```

#### Update Data
Update existing data based on specific conditions.

Without `gas-db`:

```javascript
function updateDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  const updatedData = data.map(row => {
    if (row[1] === "John Doe") { // Assuming "Author" is in the second column
      row[0] = "Updated Story"; // Update the "Title"
    }
    return row;
  });
  sheet.getRange(1, 1, updatedData.length, updatedData[0].length).setValues(updatedData);
}
```

With `gas-db`:

```javascript
function updateDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const newData = { Title: "Updated Story" };
  const conditions = { Author: "John Doe" };
  sheet.update(newData, conditions);
}
```

#### Upsert Data (Insert or Update)
Insert data if it doesn't exist, otherwise update it.

Without `gas-db`:

```javascript
function upsertDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  const existingRowIndex = data.findIndex(row => row[0] === "Dynamic Story"); // Assuming "Title" is in the first column

  if (existingRowIndex !== -1) {
    // Update the row
    const range = sheet.getRange(existingRowIndex + 1, 1, 1, data[0].length);
    range.setValues([["Dynamic Story", "Jane Doe"]]);
  } else {
    // Insert new data
    sheet.appendRow(["Dynamic Story", "Jane Doe"]);
  }
}
```

With `gas-db`:

```javascript
function upsertDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const data = { Title: "Dynamic Story", Author: "Jane Doe" };
  const conditions = { Title: "Dynamic Story" };
  sheet.upsert(data, conditions);
}
```

---

## Advanced Features

### Create or Retrieve a Sheet
Create a new sheet if it doesn't already exist.

```javascript
function createOrFindSheet() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.createOrFindSheet("NewSheet");
}
```

--- 

### Customizing the Header Index (`hI`)

When working with a Google Sheet, `gas-db` assumes by default that the first row (1) contains the headers (column names). These headers are used as keys when processing the data. However, if your data uses a different row as the header (e.g., the second or third row), you can adjust this behavior by specifying the hI (headerIndex) parameter.

#### Key Features:

- Define which row contains the column headers when interacting with a sheet.
- Allows flexible data processing when headers are not in the first row.
- Prevents manual pre-processing of sheets with non-standard header rows.

#### Usage Examples:

Specifying a Custom Header Index

```javascript
function customHeaderIndex() {
  const spreadsheet = new gasdb.Spreadsheet();

  // Access a sheet with headers in the 2nd row
  const sheet = spreadsheet.at("Stories", 2);

  // Retrieve all data, using the 2nd row as keys for the data objects
  const data = sheet.findAll();
  Logger.log(data);
}
```

In this example:

- If the sheet "Stories" has headers in the 2nd row, specifying hI = 2 ensures that the keys for the returned data objects correspond to the column names in row 2.

#### Default Behavior

If you do not specify the hI parameter, gas-db will assume the header row is the first row (hI = 1).

```javascript
function defaultHeaderIndex() {
  const spreadsheet = new gasdb.Spreadsheet();

  // Access the sheet assuming the headers are in the 1st row
  const sheet = spreadsheet.at("Stories");

  // Retrieve all data
  const data = sheet.findAll();
  Logger.log(data);
}
```

---

## Required Scopes

To use this library, ensure your project's manifest includes the following scope:

```
https://www.googleapis.com/auth/spreadsheets
```


In the Apps Script editor, go to "Project Settings" to explicitly define the scope and avoid errors.

---

## Troubleshooting

When working with Google Sheets, you may encounter API errors, such as:

- 503 Service Unavailable: This error often occurs due to a temporary issue with the Google Sheets API.

### Recommendations:

- Retry Logic: Implement a retry mechanism with exponential backoff. For example:

    ```javascript
    function retryWithBackoff(fn, retries = 5) {
        for (let i = 0; i < retries; i++) {
            try {
            return fn();
            } catch (e) {
            if (i === retries - 1) throw e;
            const backoffTime = Math.pow(2, i) * 1000;
            Utilities.sleep(backoffTime);
            }
        }
    }
    ``` 

- Sheet Rotation: If you frequently encounter rate limits or service interruptions, consider rotating between multiple sheets or breaking up large operations into smaller chunks.

For more details, refer to [Google Sheets API Troubleshooting](https://developers.google.com/sheets/api/troubleshoot-api-errors#503-service-unavailable).

> Note: Error handling strategies like these are not included in the gas-db library, as the library focuses on simplifying CRUD operations. Developers are encouraged to implement error handling based on their specific use cases.

---

## FAQ

### Q: Do I need to change the script ID?
- No, you don't need to change the script ID to use the library.

---

## License
This library is distributed under the MIT License.

---

## Japanese Documentation

The Japanese documentation for this library can be found at [`docs/ja/README.md`](docs/ja/README.md).
