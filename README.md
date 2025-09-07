# Deployment Process Automation

A Google Apps Script add-on that automates the creation of deployment rollback plans by extracting change request information from instruction documents and matching it with commit IDs from a tracking spreadsheet.

## Overview

This automation tool streamlines the deployment process by:

- **Extracting Change Requests**: Automatically identifies and extracts change request information from instruction documents
- **Matching Commit IDs**: Links ticket numbers (CMFBP-XXXXXX format) with their corresponding commit IDs from a tracking spreadsheet
- **Generating Rollback Plans**: Creates structured tables for both "Change Requests" and "Mapping Tables" sections in rollback documents
- **Google Docs Integration**: Works seamlessly within Google Documents with a custom sidebar interface

## Features

- 🔄 **Automated Table Generation**: Creates and updates tables in rollback documents
- 📊 **Spreadsheet Integration**: Connects with Google Sheets for commit ID tracking
- 🎯 **Pattern Matching**: Uses regex to identify ticket numbers in CMFBP-XXXXXX format
- 📝 **Document Processing**: Searches and updates specific sections in Google Documents
- 🖥️ **Custom UI**: Provides a sidebar interface for easy interaction

## Prerequisites

- Google Apps Script environment
- Access to Google Documents and Google Sheets
- Documents with specific structure:
  - Instruction document with "Change Requests" and "Mapping Tables" sections
  - Rollback document with corresponding sections
  - Tracking spreadsheet with ticket numbers and commit IDs

## Setup

### 1. Google Apps Script Setup

1. Open [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the contents of `code.js` into the main script file
4. Update the `appsscript.json` configuration as needed

### 2. Document Configuration

Update the following document IDs in `code.js`:

```javascript
// Spreadsheet ID for tracking commit IDs
var spreadSheet = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID");

// Instructions document ID
var instructionsDoc = DocumentApp.openById("YOUR_INSTRUCTIONS_DOC_ID");

// Rollback document ID
var rollbackDoc = DocumentApp.openById("YOUR_ROLLBACK_DOC_ID");
```

### 3. Document Structure Requirements

#### Instructions Document
Must contain sections with Heading 2:
- "Change Requests" - Contains a table with ticket information
- "Mapping Tables" - Contains a table with mapping information

#### Tracking Spreadsheet
Must have a sheet named "checklist" with:
- Column A: Ticket numbers (CMFBP-XXXXXX format)
- Column B: Corresponding commit IDs

#### Rollback Document
Must have corresponding sections:
- "Change Requests" - Will be populated with commit ID and ticket number pairs
- "Mapping Tables" - Will be populated with commit ID and ticket number pairs

## Usage

### 1. Install the Add-on

1. In Google Docs, go to **Add-ons** → **Get add-ons**
2. Install the custom add-on (or use the Apps Script editor to deploy)

### 2. Using the Sidebar

1. Open your instruction document
2. Go to **Add-ons** → **Start** to open the sidebar
3. Enter the required document IDs
4. Click **Insert** to process the documents

### 3. Automated Processing

The script will:
1. Search for "Change Requests" and "Mapping Tables" sections
2. Extract ticket numbers from the instruction document tables
3. Match ticket numbers with commit IDs from the tracking spreadsheet
4. Generate new tables in the rollback document with the matched data

## Functions

### Main Functions

- `buildCrTable()`: Builds the Change Requests table in the rollback document
- `buildMtTable()`: Builds the Mapping Tables table in the rollback document
- `showSidebar()`: Displays the custom sidebar interface
- `insertText()`: Handles text insertion functionality

### Utility Functions

- `reverseTable()`: Utility for table operations
- `showGroup()`: Logging utility for debugging

## Configuration

### Time Zone
The script is configured for "America/Guatemala" timezone. Update in `appsscript.json`:

```json
{
  "timeZone": "America/Guatemala",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

### Runtime Version
Uses V8 runtime for better performance and modern JavaScript features.

## Error Handling

The script includes comprehensive error handling:
- StackDriver logging for debugging
- Graceful handling of missing elements
- Validation of document structure

## Development

### File Structure
```
deployment-process-automation/
├── code.js                 # Main Apps Script code
├── appsscript.json         # Apps Script configuration
├── sidebar.html            # Main sidebar interface
├── sidebar-inputs.html     # Input form sidebar
└── README.md               # This documentation
```

### Key Components

1. **Document Processing**: Searches for specific headings and tables
2. **Pattern Matching**: Uses regex to identify ticket numbers
3. **Table Generation**: Creates structured tables with matched data
4. **UI Integration**: Provides user-friendly sidebar interface

## Troubleshooting

### Common Issues

1. **Document IDs not found**: Ensure all document IDs are correct and accessible
2. **Missing sections**: Verify that documents contain the required "Change Requests" and "Mapping Tables" sections
3. **Permission errors**: Ensure the script has access to all required documents and spreadsheets
4. **Pattern matching failures**: Verify ticket numbers follow the CMFBP-XXXXXX format

### Debugging

Enable logging to troubleshoot issues:
- Check the Apps Script execution log
- Use `Logger.log()` statements throughout the code
- Verify document structure matches requirements

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the Apps Script execution logs
3. Verify document structure and permissions
4. Create an issue in the repository

---

**Note**: This automation tool is designed for specific document structures and ticket numbering formats. Ensure your documents match the required structure before use.
