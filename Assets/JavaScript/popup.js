// global variables
var currentUrl = "";

// function to update the status text in the popup window 
function renderStatus(text, color) {
  $('#status').text(text);
  if (color === "green"){
    $('#status').css('color','green');
  } else {
    $('#status').css('color','red');
  };
}

// function to get the url of the current tab, takes a callback for what to do with it once received
function getCurrentTabUrl(callback) {
  console.log("getting current tab url");
  // set a query filter to be passed to chrome.tabs.query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  // query chrome.tabs to get current tab's url 
  chrome.tabs.query(queryInfo, function(tabsArray) {  
    //store the relevant info from the query results 
    var tab = tabsArray[0];  //an array of tabs will be returned, but it will be an array of one because we only ask for the active tab 
    var url = tab.url; 
    //write an error message to the console if url is not a string
    console.assert(typeof url == 'string', 'tab.url should be a string'); 
    //update the global 'currentUrl' variable.
    currentUrl = url;
    //execute callback to do something with the url when this query returns it
    callback(url);  
  }); 
};

//function to get all notes from the mongo database
function getNotes() {
  // make a request to the api for all the notes  
  $.ajax({
    url: 'http://localhost:3000/api/fetch-all-notes', 
    method: 'GET'
  // success case for request 
  }).done(function(response){
    renderStatus('Received notes for: ' + currentUrl, "green");
    displayNotes(response);
  // fail case for request
  }).fail(function(response){
    renderStatus('Failed to get notes for: ' + currentUrl, "red");
  })
}

// function to display an array of notes 
function displayNotes(notesArray){
  //display each note in the popup window, if it's url matches current URL (note: to optimize filtering should be done further upstream.)
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
      newNote.attr('id', noteId + "-form");
      var newTitle = $('<input>'); 
      newTitle.attr('class', 'existingTitle')
      newTitle.attr('value', noteTitle);
      newTitle.attr('name', 'title');
      newTitle.attr('id', noteId + "-title");
      newNote.append(newTitle);
      var newContents = $('<textarea>');
      newContents.text(noteContents);
      newContents.attr('class', 'existingContents')
      newContents.attr('name', 'contents');
      newContents.attr('id', noteId + "-contents");
      newNote.append(newContents);
      var newUpdateBtn = $('<button>');
      newUpdateBtn.attr('type', 'submit');
      newUpdateBtn.text('Update');
      newUpdateBtn.attr('class', 'update-note');
      newUpdateBtn.attr('data-note-id', noteId); //save the ID in the button
      newNote.append(newUpdateBtn);
      var newDeleteBtn = $('<button>');
      newDeleteBtn.attr('type', 'submit');
      newDeleteBtn.text('Delete');
      newDeleteBtn.attr('class', 'delete-note');
      newDeleteBtn.attr('data-note-id', noteId); //save the ID in the button
      newNote.append(newDeleteBtn);
      $('#notes-display').append(newNote);
    };
  })
}

// function to add a new note via api 
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

// function to update a note via api  
function updateNote(noteObj) {
  console.log("update this note:", JSON.stringify(noteObj));
  //ajax call
  $.ajax({
    method: 'POST',  // should to update backend to consume as "PUT"
    data: JSON.stringify(noteObj),
    contentType: 'application/json',
    url: 'http://localhost:3000/api/save-note'
  });
};

// function to delete a note via api  
function deleteNote(noteObj) {
  console.log("delte this note:", JSON.stringify(noteObj));
  //ajax call
  $.ajax({
    method: 'POST', // should update backend to consume as "DELETE"
    data: JSON.stringify(noteObj),
    contentType: 'application/json',
    url: 'http://localhost:3000/api/delete-note'
  });
};

// event listener for the extension   
document.addEventListener('DOMContentLoaded', function() {
  //get the current tab's url 
  getCurrentTabUrl(function(url) {
    //update status
    renderStatus('URL Found', "green");
    //get all notes from the Notes App 
    getNotes();
  });
});

// click event handler to save a new note 
$('#save-note').on('click', function(){
  var noteObj = {
    noteTitle: $('#note-title').val(),
    noteContents: $('#note-contents').val(),
    noteUrl: currentUrl,
  };
  addNote(noteObj);
});

// click event handler to update an existing note 
$(document).on('click', '.update-note', function(){
  //get id, title and contents
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

// click event handler to delete an existing note 
$(document).on('click', '.delete-note', function(){
  //get id
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
  //delete the note 
  deleteNote(noteObj);  
})

