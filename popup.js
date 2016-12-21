//function to go get the url of the current tab 
function getCurrentTabUrl(callback) {
  // set a query filter to be passed to chrome.tabs.query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  // query chrome.tabs to get current tab's information (looking for the url)
  chrome.tabs.query(queryInfo, function(tabsArray) {  
    //store the relevant info from the query results 
    var tab = tabsArray[0];  //an array of tabs will be returned, but it will be an array of one because we only ask for the active tab 
    var url = tab.url; 
    //write an error message to the console if url is not a string
    console.assert(typeof url == 'string', 'tab.url should be a string'); 
    //execute callback to do something with the url when this query returns it
    callback(url);  
  }); //end chrome.tabs.query
}

//function to get all notes from the mongo database
function getNotes() {
  renderStatus("Running the getNotes function");
  //make a request to the Notes App and get an array back of all the notes  
  $.ajax({
    url: "http://localhost:3000/api/fetch-all-notes", 
    method: "GET"
  }).done(function(response){
    //update status
    renderStatus("Status: Response received");
    $("#status").css("color","green");
    //display the notes 
    displayNotes(response);
  }).fail(function(response){
    //update status
    renderStatus("API call failed");
    $("#status").css("color","red");
    //display the error
    $("#text").text("response: " + JSON.stringify(response));
  })
}

//funciton to display the notes returned by the Notes App api 
function displayNotes(notesArray){
  //display each note in the popup window
  notesArray.forEach((note) => {
    //get note title
    var noteTitle = note.noteTitle;
    //get note body
    var noteContents = note.noteContents;
    //add the note to the popup window's html 
    var newNote = $("<div>");
    var newTitle = $("<h3>" + noteTitle + "</h3>");
    var newContents = $("<p>" + noteContents + "</p>")
    newNote.append(newTitle);
    newNote.append(newContents);
    $("#notes-display").append(newNote);
  })
}

//function to update the status text in the popup window 
function renderStatus(statusText) {
  $("#status").text(statusText);
}

//create event listener for the extension   
document.addEventListener('DOMContentLoaded', function() {
  //get the current tab's url 
  getCurrentTabUrl(function(url) {
    //update status
    renderStatus('Retrieving your notes for: ' + url);
    //get the note from the Notes App 
    getNotes();

  });

});
