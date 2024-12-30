# gas-db

`gas-db` is a library designed to simplify working with Google Sheets through Google Apps Script (GAS). It provides an intuitive API for performing CRUD operations on Google Sheets, enabling developers to treat Sheets like a database.

---

## Features

- Treat Google Sheets as a database with structured data operations.
- Retrieve and manipulate data using column names as keys.
- Filter and query data with ease.
- Insert, update, and clear rows programmatically.
- Automatically generates a column-to-index dictionary for simpler data handling.

---

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/gas-db.git
   cd gas-db
   ```

2. Copy the code into your Google Apps Script project:
   - Open the [GAS Editor](https://script.google.com/).
   - Copy the files `sheet.js` and `spreadsheet.js` into your GAS project.

3. **Optional**: If you need advanced features or external dependencies, bundle the code using Webpack or similar tools before importing it into GAS.

---

## Usage

Here’s a quick example of how to use `gas-db`:

```
import Spreadsheet from './spreadsheet'; // Adjust path as necessary

// Access the active spreadsheet
const db = Spreadsheet.from();

// Get a sheet instance by name
const users = db.at('Users');

// Fetch all data
const allUsers = users.findAll();
Logger.log(allUsers);

// Filter users based on conditions
const admins = users.find({ role: 'admin' });
Logger.log(admins);

// Insert new data
users.insert({ name: 'John Doe', role: 'user', age: 30 });

// Update data matching conditions
users.update({ role: 'admin' }, { name: 'John Doe' });

// Clear all rows except the header
users.clear();
```

---

## Contribution Guide

We welcome contributions to improve this library! Please follow the steps below to contribute:

### **1. Fork the Repository**
Click the "Fork" button on this repository to create your own copy.

### **2. Clone Your Fork**
```
git clone https://github.com/your-username/gas-db.git
cd gas-db
```

### **3. Create a New Branch**
```
git checkout -b feature/your-feature-name
```

### **4. Make Changes**
Edit the code, write tests, or update the documentation.

### **5. Test Your Changes**
- Copy your changes into a GAS project.
- Test the functionality in a real Google Sheets environment.

### **6. Commit and Push**
```
git add .
git commit -m "Add feature: your-feature-name"
git push origin feature/your-feature-name
```

### **7. Submit a Pull Request**
Go to the original repository and create a Pull Request (PR). Add details about the changes you’ve made.

---

## Development Workflow

1. **Linting**:
   ```
   npm run lint
   ```

2. **Bundling**:
   If external dependencies are added (e.g., `lodash`):
   ```
   npm run build
   ```

3. **Testing**:
   - Test in a real Google Apps Script project.
   - Add any new functionality to the documentation.

---

## Directory Structure

---

## Internationalization (i18n)

The main documentation is provided in English. For other languages, additional folders under `docs/` are used. For example:


### Translations

- [日本語 (Japanese)](docs/ja/README.md)

If you'd like to contribute to the translations, please submit a Pull Request!

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Feedback
If you encounter any issues or have feature requests, please open an [issue](https://github.com/shunta-furukawa/gas-db/issues). Contributions, ideas, and feedback are always welcome!
