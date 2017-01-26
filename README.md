# Chrome Extension - Notes app
This is a chrome extension I am writing to interact with a separate note-taking application (in development with a partner).  
The purpose of this Chrome extension is to retrieve the user's current URL and interact with notes in our application that are tied to that URL.

### Application flow
+ When the extension is opened, it obtains the user's current tab using the Chrome.tabs API.
+ It passes the current tab, through an AJAX query, to our note-taking application.
+ When a response is received, it returns all notes that are associated with the current URL and displays them in the extension.
 * It uses jQuery to quickly loop through the results and place them in the DOM.
+ User's can edit existing notes, add a new note, or delete a note from the extension.  
 * Such actions initiate an AJAX call to our note-application's API in order to update the database.

### Project highlights
+ Wrote a Chrome extension
+ used HTML, CSS, JavaScript and jQuery. 
+ Used Chrome's API and our own custom API that we wrote in our note-taking application's back end.

### APIs
+ Chrome.tabs
+ Custom API developed for the accompanying application

### Libraries
+ jQuery

