// declare variables
var currentUrl = "";

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
    renderStatus('API call to database failed');
    $('#status').css('color','red');
    //display the error
    $('#text').text('response: ' + JSON.stringify(response));
  })
}

//funciton to display the notes returned by the Notes App api 
function displayNotes(notesArray){
  //display each note in the popup window, if it's url matches current URL (note: not efficient if lots of notes in db.  filtering should be done further upstream.)
  notesArray.forEach((note) => {
    if (note.noteUrl === currentUrl){
      console.log("creating note for note object:", note);
      //get note title, body and id of the note
      var noteTitle = note.noteTitle;
      var noteContents = note.noteContents;
      var noteId = note._id;
      //add the note to the popup window's html 
      var newNote = $('<form>');
      //newNote.attr('method', 'POST');
      newNote.attr('class', 'note');
      newNote.attr('id', noteId + "-field");
      var newField = $('<fieldset>');
      newNote.append(newField);
      var newTitle = $('<input>'); 
      newTitle.attr('value', noteTitle);
      newTitle.attr('name', 'title');
      newTitle.attr('id', noteId + "-title");
      newField.append(newTitle);
      var newContents = $('<textarea>');
      newContents.text(noteContents);
      newContents.attr('name', 'contents');
      newContents.attr('id', noteId + "-contents");
      newField.append(newContents);
      var newUpdateBtn = $('<button>');
      newUpdateBtn.attr('type', 'submit');
      newUpdateBtn.text('Update');
      newUpdateBtn.attr('class', 'update-note');
      newUpdateBtn.attr('data-note-id', noteId); //save the ID in the button
      newField.append(newUpdateBtn);
      var newDeleteBtn = $('<button>');
      newDeleteBtn.attr('type', 'submit');
      newDeleteBtn.text('Delete');
      newDeleteBtn.attr('class', 'delete-note');
      newDeleteBtn.attr('data-note-id', noteId); //save the ID in the button
      newField.append(newDeleteBtn);
      $('#notes-display').append(newNote);
    };
  })
}

//function to update the status text in the popup window 
function renderStatus(statusText) {
  $('#status').text(statusText);
};

//create event listener for the extension   
document.addEventListener('DOMContentLoaded', function() {
  //get the current tab's url 
  getCurrentTabUrl(function(url) {
    //update status
    renderStatus('Retrieving your notes for: ' + url);
    //get all notes from the Notes App 
    getNotes();
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
};

//--- code for adding new note 

// process note inputs into an obj
function getNoteData(){
  console.log("getting note data"); //test.
  // store note contents in obj.
  var note = {
    noteTitle: $('#note-title').val(),
    noteContents: $('#note-contents').val(),
    noteUrl: currentUrl,
  };
  // return note object.
  return note;
};

// process ajax post request
function addNote(noteObj) {
  console.log("save note", JSON.stringify(noteObj));
  //ajax call
  $.ajax({
    method: 'POST',
    data: JSON.stringify(noteObj),
    contentType: 'application/json',
    url: 'http://localhost:3000/api/add-notes'
  });
};

// click event handler to save a new note 
$('#save-note').on('click', function(){
  console.log("add note button clicked");
  //check to make sure the URL has been aquired when window loaded.
  if (currentUrl === ""){
    alert("Missing page Url. Cannot add note. Try restarting the extension");
    return;
  // if current Url isn't empty, add the note 
  } else {
    var noteObj = getNoteData();
    addNote(noteObj);
  };
});

//--- code for updating a note 
// ajax post to update a note 
function updateNote(noteObj) {
  console.log("update this note:", JSON.stringify(noteObj));
  //ajax call
  $.ajax({
    method: 'POST',
    data: JSON.stringify(noteObj),
    contentType: 'application/json',
    url: 'http://localhost:3000/api/save-note'
  });
};
// click event handler to update a new note 
$(document).on('click', '.update-note', function(){
  console.log("Update button pressed");
  //get title and contents
  var id = $(this).data('note-id');
  var title = document.getElementById(id + "-title").value;
  var contents =  document.getElementById(id + "-contents").value;
  //create note object 
  var noteObj = {
    noteTitle: title,  //title is the name of the input field in the form. 
    noteContents: contents,  //message is the name of the text area in the form. 
    noteUrl: currentUrl,  //current URL is a global variable set when the extension is opened.
    _id: id
  };
  //update the note
  updateNote(noteObj);
});

//--- code for deleting a note  
//$(document).on('click', '.delete-note', function(){
//})

