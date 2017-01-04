// main variables
var currentUrl = "";
//variables for saving and updating notes
var saveNoteBtn = $('#save-note');
var updateNoteBtn = $('#update-note');
var noteTitle = $('#note-title');
var noteContents = $('#note-contents');

//function to get all notes from the mongo database
function getNotes() {
  //make a request to the Notes App and get an array back of all the notes  
  $.ajax({
    url: 'http://localhost:3000/api/fetch-all-notes', 
    method: 'GET'
  }).done(function(response){
    //update status
    renderStatus('Status: Response received');
    $('#status').css('color','green');
    //display the notes 
    displayNotes(response);
  }).fail(function(response){
    //update status
    renderStatus('API call failed');
    $('#status').css('color','red');
    //display the error
    $('#text').text('response: ' + JSON.stringify(response));
  })
}

//function to get a note from the mongo database by its ID
function getNoteById(id) {
  var noteId = id;
  var queryUrl = 'http://localhost:3000/api/fetch-note/' + id;
  //make a request to the Notes App and get an array back of all the notes  
  $.ajax({
    url: queryUrl, 
    method: 'GET'
  }).done(function(response){
    //update status
    renderStatus('Status: Response received');
    $('#status').css('color','green');
    //display the notes 
    displayNotes(response);
  }).fail(function(response){
    //update status
    renderStatus('API call failed');
    $('#status').css('color','red');
    //display the error
    $('#text').text('response: ' + JSON.stringify(response));
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
    var newNote = $('<div>');
    var newTitle = $('<h3>' + noteTitle + '</h3>');
    var newContents = $('<p>' + noteContents + '</p>')
    newNote.append(newTitle);
    newNote.append(newContents);
    $('#notes-display').append(newNote);
  })
}

//function to update the status text in the popup window 
function renderStatus(statusText) {
  $('#status').text(statusText);
}

//create event listener for the extension   
document.addEventListener('DOMContentLoaded', function() {
  //get the current tab's url 
  getCurrentTabUrl(function(url) {
    //update status
    renderStatus('Retrieving your notes for: ' + url);
    //get all notes from the Notes App 
    getNotes();
    //get a specific note by ID from the Notes App 
    //getNoteById('585c6b18d8404226f08d003f') //for test
  });

});

//function to get the url of the current tab, takes a callback for what to do with it once received
function getCurrentTabUrl(callback) {
  console.log("getting current tab url");
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
    //update the global currentUrl variable.
    currentUrl = url;
    //execute callback to do something with the url when this query returns it
    callback(url);  
  }); //end chrome.tabs.query
}

// process note inputs into an obj
function getNoteData(){
  console.log("creating note data"); //test.
  // store note contents in obj.
  var note = {
    noteTitle: noteTitle.val(),
    noteContents: noteContents.val(),
    noteUrl: currentUrl
  };
  console.log(note); //test.
  // return note object.
  return note;
}


// process ajax post request
function postNoteData(noteObj) {
  console.log(JSON.stringify(noteObj));
  //ajax call
  $.ajax({
    method: 'POST',
    data: JSON.stringify(noteObj),
    contentType: 'application/json',
    url: 'http://localhost:3000/api/add-notes'
  });
}

// click event handler to process and save note from Popup to DB
saveNoteBtn.on('click', function(){
  var noteObj = getNoteData();
  postNoteData(noteObj);
});



