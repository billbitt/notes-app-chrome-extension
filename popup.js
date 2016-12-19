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

} //end getCurrentTabUrl 

//function to get the Notes for the current tab 
function getNotes(currentUrl, callback, errorCallback) {

  //store the current url, which will be used to find the associated notes file 
  var url = currentUrl; 

  //make a request to the Notes App and get the an object back for the note associated with the url  
  var request = new XMLHttpRequest();

  request.open('GET', searchUrl);

  request.responseType = 'json';

  request.onload = function() {

    //Parse and process the response from the Notes App
    //note: I am assuming we get one object back.  if we will be getting multiple notes back, we will need to revise to interpret the array 
    var response = request.response;  
    // check to see if we did not receive a response 
    if (!response) {
      errorCallback('No response from the Notes App');
      return;
    };
    //store the relevant data from the response
    var title = response.title;
    var body = response.body;
    //execute a callback that will update the html with the note content 
    callback(title, body);

  }; //end request.onload

  request.onerror = function() {
    errorCallback('Network error.');
  };  //end request.onerror 

  request.send();
} // end getNotes 

//function to update the status text in the popup window 
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

//funtion to add a note for the current tab  
document.addEventListener('DOMContentLoaded', function() {

  //get the current tab's url 
  getCurrentTabUrl(function(url) {

    //update status
    renderStatus('Retrieving your notes for:' + url);

    //get the note from the Notes App 
    getNotes(url, function(noteTitle, noteBody) {

      //update status 
      renderStatus('Successfully received notes for: ' + url);
      //update title of popup.html
      var title = noteTitle;
      //do stuff here
        
      //update body of popup.html
      var body = noteBody;
      //do stuff here

    }, function(errorMessage) {
      renderStatus('Cannot display notes. ' + errorMessage);

    });  //end getNotes

  });  //end getCurrentTabUrl

}); //end document.addEventListener
