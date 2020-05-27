function onOpen() {
  var ui = DocumentApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Automation')
      .addItem('Do magic', 'searchCrs')
      .addSeparator()
      .addSubMenu(ui.createMenu('Sub-menu')
          .addItem('Second item', 'menuItem2'))
      .addToUi();
  
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

function menuItem1() {
  DocumentApp.getUi() // Or DocumentApp or FormApp.
     .alert('You clicked the first menu item!');
}

function menuItem2() {
  DocumentApp.getUi() // Or DocumentApp or FormApp.
     .alert('You clicked the second menu item!');
}

function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar-inputs')
      .setTitle('Menu');
  DocumentApp.getUi().showSidebar(ui);
  
}

function showGroup(group) {
  Logger.log(group)
}
  
  var spreadSheet = SpreadsheetApp.openById("1KHoW5YGQ4PUfp8DUJ17jebpy6iIdVFnIP2r6R0xhZtY");
var sheet = spreadSheet.getSheetByName("checklist");
var range = sheet.getRange(2, 1,sheet.getLastRow()-1,sheet.getLastColumn());

var instructionsDoc = DocumentApp.openById("1S1gQKglnJbTRtyscf6111zcbDvshSDAD2sJ_BQn_PDE");
var instDocBody = instructionsDoc.getBody();

var rollbackDoc = DocumentApp.openById("1TsSb3eLGwsLVANeB3Fe8E9Pfzkwx3o4UIIArSlCzDkI");
var rollbackDocBody = rollbackDoc.getBody();

// Define the search parameters.
var searchType = DocumentApp.ElementType.PARAGRAPH;
var searchHeading = DocumentApp.ParagraphHeading.HEADING2;
var searchResult = null;

var searchType2 = DocumentApp.ElementType.TABLE;
var searchResult2 = null;


function reverseTable() {
  Logger.log(range.getA1Notation());
}

function buildCrTable(){
  
  // Define search parameters for Heading 2 "Change requests"
  let searchType = DocumentApp.ElementType.PARAGRAPH;
  let searchHeading = DocumentApp.ParagraphHeading.HEADING2;
  let searchResult = null;
  
  // Define search parameters for "Change requests" table
  let searchType2 = DocumentApp.ElementType.TABLE;
  let searchResult2 = null;
  
  // Search through Rollback plan document
  // Search Heading 2 "Change requests"
  searchResult = null;
  while (searchResult = rollbackDocBody.findElement(searchType, searchResult)) {
    let par = searchResult.getElement().asParagraph();
    if (par.getHeading() == searchHeading && par.getText() == "Change Requests") {
      // Found it
      Logger.log("Heading 2 found in rollback doc");   
      while (searchResult2 = rollbackDocBody.findElement(searchType2, searchResult)) {
        let rollbackDocTable = searchResult2.getElement().asTable();
        Logger.log(rollbackDocTable.getText());
        var crTableIndex = rollbackDocBody.getChildIndex(rollbackDocTable);
        rollbackDocBody.removeChild(rollbackDocTable);
        break;
      }      
      break;
    }
  }  
  
  // Search through Instructions document
  // Search Heading 2 "Change requests"
  searchResult = null;
  while (searchResult = instDocBody.findElement(searchType, searchResult)) {
    let par = searchResult.getElement().asParagraph();
    if (par.getHeading() == searchHeading && par.getText() == "Change Requests") {
      // Found one, update and stop.
      Logger.log("Heading 2 found in instructions doc");
      while (searchResult2 = instDocBody.findElement(searchType2, searchResult)) {
        var instDocTable = searchResult2.getElement().asTable();
        Logger.log(instDocTable.getText());
        var tableNumRows = instDocTable.getNumRows();
        break;
      }      
      break;
    }
  }

  let rege = new RegExp('CMFBP-[0-9]{1,6}');
  Logger.log("tableNumRows: "+tableNumRows);
  var l = 1;
  var cells = [];
  cells[0] = ['Object ID','Ticket number'];

  for(let i = tableNumRows-1; i >= 0; i--){
    
    let tableRowText = instDocTable.getRow(i).getText();
    if (tableRowText != null){
      Logger.log("Row text: "+tableRowText);
      let matchId = tableRowText.match(rege);
      var ticketId = matchId[0];
      Logger.log("Ticket ID: "+ ticketId);
      
      // Creates  a text finder for the range.
      var textFinder = range.createTextFinder(ticketId);
      
      // Returns the first occurrence of 'dog'.
      var firstOccurrence = textFinder.findNext();      
      let subRange = firstOccurrence.getRow();
      let commitID = sheet.getRange('B'+subRange).getDisplayValue();
      Logger.log("Commit ID: "+commitID);
      
      cells[l] = [commitID,ticketId];
      l++;
    } 
  }
  // rollBody.appendTable([['Hola','Ok'],['Hm','Ya']]);
  Logger.log("Array: " +cells);
  rollbackDocBody.insertTable(crTableIndex,cells);
}

function buildMtTable(){
  
  // Define search parameters for Heading 2 "Change requests"
  let searchType = DocumentApp.ElementType.PARAGRAPH;
  let searchHeading = DocumentApp.ParagraphHeading.HEADING2;
  let searchResult = null;
  
  // Define search parameters for "Change requests" table
  let searchType2 = DocumentApp.ElementType.TABLE;
  let searchResult2 = null;
  
  // Search through Rollback plan document
  // Search Heading 2 "Change requests"
  while (searchResult = rollbackDocBody.findElement(searchType, searchResult)) {
    let par = searchResult.getElement().asParagraph();
    if (par.getHeading() == searchHeading && par.getText() == "Mapping Tables") {
      // Found one, update and stop.
      Logger.log("Heading 2 found in rollback doc");
      
      while (searchResult2 = rollbackDocBody.findElement(searchType2, searchResult)) {
        let rollbackDocTable = searchResult2.getElement().asTable();
        Logger.log(rollbackDocTable.getText());
        var mtTableIndex = rollbackDocBody.getChildIndex(rollbackDocTable);
        rollbackDocBody.removeChild(rollbackDocTable);
        // var tableNumRows = table.getNumRows();       
        break;
      }      
      break;
    }
  }
  
  // Search through Instructions document
  // Search Heading 2 "Change requests"
  searchResult = null;
  while (searchResult = instDocBody.findElement(searchType, searchResult)) {
    let par = searchResult.getElement().asParagraph();
    if (par.getHeading() == searchHeading && par.getText() == "Mapping Tables") {
      // Found one, update and stop.
      Logger.log("Heading 2 found in instructions doc");
      while (searchResult2 = instDocBody.findElement(searchType2, searchResult)) {
        var instDocTable = searchResult2.getElement().asTable();
        Logger.log(instDocTable.getText());
        // rollbackDocBody.removeChild(table);
        var tableNumRows = instDocTable.getNumRows();
        break;
      }      
      break;
    }
  }
  
  let rege = new RegExp('CMFBP-[0-9]{1,6}');
  
  Logger.log("tableNumRows: "+tableNumRows);
  
  var l = 1;
  let tableCells = [];
  tableCells[0] = ['Object ID','Ticket number'];
  for(let i = tableNumRows-1; i >= 0; i--){
    
    let tableRowText = instDocTable.getRow(i).getText();
    if (tableRowText != null){
      Logger.log("Row text: "+tableRowText);
      let matchId = tableRowText.match(rege);
      var ticketId = matchId[0];
      Logger.log("Ticket ID: "+ ticketId);
      
      // Creates  a text finder for the range.
      var textFinder = range.createTextFinder(ticketId);
      
      // Returns the first occurrence of 'dog'.
      var firstOccurrence = textFinder.findNext();      
      let subRange = firstOccurrence.getRow();
      let commitID = sheet.getRange('B'+subRange).getDisplayValue();
      Logger.log("Commit ID: "+commitID);
      
      tableCells[l] = [commitID,ticketId];
      l++;
    } 
  }
  // rollBody.appendTable([['Hola','Ok'],['Hm','Ya']]);
  Logger.log("Array: " +tableCells);
  rollbackDocBody.insertTable(mtTableIndex,tableCells);
}

////////////////////////////////////

function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getSelectedElements();
    if (elements.length === 1 && elements[0].getElement().getType() ===
        DocumentApp.ElementType.INLINE_IMAGE) {
      throw new Error('Can\'t insert text into an image.');
    }
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          var parent = element.getParent();
          var remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only translate elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();

    // If the cursor follows or preceds a non-space character, insert a space
    // between the character and the translation. Otherwise, just insert the
    // translation.
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) != ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
  }
}


