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
    //not sure what this is doing, exactly but was used in the documentation 
    console.assert(typeof url == 'string', 'tab.url should be a string'); 
    //execute callback to do something with the url when this query returns it
    callback(url);  
  }); //end chrome.tabs.query
}

//function to get the Notes for the current tab 
function getNotes() {
  renderStatus("Running the getNotes function");
  //set up query url
  var queryURL = "http://localhost:3000/api/fetch-all-notes";
  //make a request to the Notes App and get an array back of all the notes  
  var request = new XMLHttpRequest();
  request.open('GET', queryURL, true);
  // The Google image search API responds with JSON, so let Chrome parse it.
  //request.responseType = 'json';
  request.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = request.response;
    if (!response) {
      renderStatus('No response from the api.');
      return;
    }
    //print the response out (for test purposes)
    renderStatus(response);
    //display the notes 
    displayNotes(response);
  };
  request.onerror = function() {
    renderStatus('Network error.');
  };
  request.send();
}

//test function to hit a different api 
function queryTest(){
  //var apiKey = "88a956b73055149f4e2abdbc2e704bc2";
	var apiKey = "c534e707825fc7c82817ddaaa699229d";
	//make the url to call
	var URL = "api.openweathermap.org/data/2.5/weather?q={Bujumbura}&appid=";
	var queryURL = "http://" + URL + apiKey;
	//make the call
  var x = new XMLHttpRequest();
  x.open('GET', queryURL);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response) {
      renderStatus('No response from the api.');
      return;
    };
    renderStatus(response);
  };
  x.onerror = function() {
    renderStatus('Network error.');
  };
  x.send();
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
  document.getElementById('status').textContent = statusText;
}

//create event listener for the extension   
document.addEventListener('DOMContentLoaded', function() {
  //get the current tab's url 
  getCurrentTabUrl(function(url) {
    //update status
    renderStatus('Retrieving your notes for: ' + url);

    //run a test query
    //queryTest();
    
    //get the note from the Notes App 
    getNotes();

  });

});
