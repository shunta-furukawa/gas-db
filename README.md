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

### 1. Basic Operations

#### Creating an Instance of the `Spreadsheet` Class
The following example demonstrates how to fetch a sheet and retrieve all data from it.

```javascript
function getAllData() {
// Instantiate the Spreadsheet class
const spreadsheet = new gasdb.Spreadsheet();

// Access the sheet "Stories"
const sheet = spreadsheet.at("Stories");

// Retrieve all data from the sheet
const data = sheet.findAll();
Logger.log(data);
}
```

---

### 2. CRUD Operations

#### Search Data by Conditions
Retrieve only the data that matches specific conditions.

```javascript
function findData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// Search for data that matches the conditions
const conditions = { Title: "Adventure" };
const results = sheet.find(conditions);
Logger.log(results);
}
```

#### Insert Data
Add new data to the sheet.

```javascript
function insertData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// Insert data
sheet.insert({ Title: "New Story", Author: "John Doe" });
}
```

#### Update Data
Update existing data based on specific conditions.

```javascript
function updateData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// Update data that matches the conditions
const newData = { Title: "Updated Story" };
const conditions = { Author: "John Doe" };
sheet.update(newData, conditions);
}
```

#### Upsert Data (Insert or Update)
Insert data if it doesn't exist, otherwise update it.

```javascript
function upsertData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// Perform upsert
const data = { Title: "Dynamic Story", Author: "Jane Doe" };
const conditions = { Title: "Dynamic Story" };
sheet.upsert(data, conditions);
}
```

---

## Advanced Features

#### Create or Retrieve a Sheet
Create a new sheet if it doesn't already exist.

```javascript
function createOrFindSheet() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.createOrFindSheet("NewSheet");
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

## FAQ

### Q: I got the error `TypeError: gasdb.Spreadsheet is not a constructor`. What should I do?
- Verify that the library has been added correctly to your project.
- Ensure you have selected the latest version of the library.

### Q: Do I need to change the script ID?
- No, you don't need to change the script ID to use the library.

---

## License
This library is distributed under the MIT License.

---

## Japanese Documentation

The Japanese documentation for this library can be found at [`docs/ja/README.md`](docs/ja/README.md).
