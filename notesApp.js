const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');
const addNoteButton = document.getElementById('addNote');
const notesDiv = document.getElementById('notes');
const deletedNotesDiv = document.getElementById('deletedNotes');
const archivedNotesDiv = document.getElementById('archivedNotes');

// Remove any previous data stored in local storage
localStorage.removeItem('deletedNotes');
localStorage.removeItem('archivedNotes');

// Display existing notes stored in local storage
showNotes();

// Define function to add a new note

function addNotes(){
    let notes = localStorage.getItem('notes');
    if(notes === null) {
        notes = [];
    } else {
        notes = JSON.parse(notes);
    }

    // Ensure that the user has entered some text before creating a note 
    if(addText.value == '') {
        alert('Add your note');
        return;
    }

    // Create a new note object and add it to the list of notes
    const noteObj = {
        title: addTitle.value,
        text: addText.value,
    }

    addTitle.value = '';
    addText.value = '';
    notes.push(noteObj);
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
}

// Define function to display existing notes stored in local storage

function showNotes() {
    let notesHTML = '';
    let notes = localStorage.getItem('notes');
    if(notes === null) {
        return;
    } else {
        notes = JSON.parse(notes);
    }

    for (let i=0; i<notes.length; i++) {
        // Build HTML for each note using template literals

        notesHTML += `<div class="note">
        <span class="title">${notes[i].title === "" ? 'Note' : notes[i].title}</span>
        <div class="text">${notes[i].text}</div>
        <button class="editNote" id="${i}" onclick="editNote(${i})">Edit</button>
        <button class="deleteNote" id="${i}" onclick="deleteNote(${i})">Delete</button>
        <button class="archiveNote" id="${i}" onclick="archiveNote(${i})">Archive</button>
        </div>
        `
    }

    // Insert HTML for all notes into the notes div
    notesDiv.innerHTML = notesHTML;
}

// Define function to delete a note
function deleteNote(ind) {
    let notes = localStorage.getItem('notes');
    if(notes === null) {
        return;
    } else {
        notes = JSON.parse(notes);
    }

    // Create a new deleted note object with a timestamp and add it to the list of deleted notes

    const deletedNote = {
        ...notes[ind],
        deleted: new Date().toISOString()
    };
    let deletedNotes = localStorage.getItem('deletedNotes');
    if(deletedNotes === null) {
        deletedNotes = [];
    }else {
        deletedNotes = JSON.parse(deletedNotes);
    }

    deletedNotes.push(deletedNote);
    localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));

    // Remove the note from the list of existing notes and update local storage
    notes.splice(ind, 1);
    localStorage.setItem('notes', JSON.stringify(notes));

    // Update the UI to reflect the changes

    showNotes();
    showDeletedNotes();
}

// Attach event listener to the add note button
addNoteButton.addEventListener('click', addNotes);

// Display Deleted Notes

// Define function to display existing deleted notes stored in local storage

function showDeletedNotes() {
    // Initializing an empty string to store the HTML for deleted notes
    let deletedNotesHTML = '';
    // Retrieving deleted notes from localStorage
    let deletedNotes = localStorage.getItem('deletedNotes');
    // If there are no deleted notes, return
    if (deletedNotes === null) {
        return;
    }else {
        deletedNotes = JSON.parse(deletedNotes); // otherwise, parse the deleted notes as JSON and proceed to loop through them
    }

    // Loop through each deleted note, and create HTML code to display it 

    for (let i=0; i < deletedNotes.length; i++) {
        deletedNotesHTML = `
        <div class="note deleted">
        <span class="title">${deletedNotes[i].title === "" ? 'Note' : deletedNotes[i].title}</span>
        <div class="text">${deletedNotes[i].text}</div>
        <div class="deletedData">${new Date(deletedNotes[i].deleted).toLocaleString()}</div>
        </div>
        `;
    }

    // Display the HTML for deleted notes in the deletedNotesDiv element
    deletedNotesDiv.innerHTML = deletedNotesHTML;
}

// Archive Note

function archiveNote(ind) {
    // Retrieving all notes from localStorage
    let notes = localStorage.getItem("notes");

    // If there are no notes, return
    if (notes === null) {
        return;
    }else {
        notes = JSON.parse(notes); // otherwise, parse the notes as JSON and proceed to archive the note at the given index
    }

    // Retrieve the note at the given index
    const note = notes[ind];

    // If the note has an empty title or empty text , return
    if (note.title === '' || note.text === '') {
        return ;
    }

    // Create an object to represent the archived note, and set its properties

    const archiveNote = {
        title: note.title,
        text: note.text,
        archived: new Date().toISOString(),
    };

    // Retrieve all archived notes from localStorage
    let archivedNotes = localStorage.getItem("archivedNotes");

    // if there are no archived notes, initialize an empty array to store them
    if (archivedNotes === null) {
        archivedNotes = [];
    } else {
        archivedNotes = JSON.parse(archivedNotes); // otherwise, parse the archived notes as JSON
    }

    // Add the newly archived note to the array of archived notes
    archivedNotes.push(archiveNote);

    // Update the archived notes in localStorage
    localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));

    // Remove the note from the array of notes at the  given index
    notes.splice(ind, 1);

    // Update the notes in localStorage
    localStorage.setItem("notes", JSON.stringify(notes));

    // Refresh the displayed notes and archived notes
    showNotes();
    showArchivedNotes();
}

// function to display all archived notes
function showArchivedNotes() {
    // Initialize empty string for HTML content
    let archivedNotesHTML = '';
    // Retrieve archived notes from localStorage
    let archivedNotes = localStorage.getItem("archivedNotes");
    // if there are no archived notes, return
    if (archivedNotes === null) {
        return;
    }else {
        archivedNotes = JSON.parse(archivedNotes); // otherwise, parse the archived notes as JSON and proceed to display them
    }

    // Loop through archived notes and add them to the HTML content
    for (let i=0; i<archivedNotes.length; i++) {
        archivedNotesHTML += `
        <div class="note archived">
        <span class="tilte">${archivedNotes[i].title === "" ? "Note" : archivedNotes[i].title}</span>
        <div class="text">${archivedNotes[i].text}</div>
        <div class="archivedData">${new Date(archivedNotes[i].archived).toLocaleString()}</div>
        </div>
        `;
    }

    // Update the HTML content of the archived notes container
    archivedNotesDiv.innerHTML = archivedNotesHTML;
}

// Edit Note
function editNote(ind) {
    // Retrieve all notes from local storage
    let notes = localStorage.getItem("notes");

    // If there are no notes, return
    if (notes === null) {
        return;
    } else {
        notes = JSON.parse(notes); // Otherwise, parse the notes as JSON and proceed to edit the note at the given index
    }

    // Retrieve the note at the given index
    const note = notes[ind];

    // If the note has no title or text, return
    if (note.title === "" || note.text === "") {
        return;
    }

    // Prompt the user to edit the title of the note

    const editedtitleNote = prompt("Edit  your title of the note", note.tilte);

    // If the user cancels, return
    if (editedtitleNote === null) {
        return;
    }

    // Update the note with the edited title and description
    note.title = editedtitleNote;
    note.text = editeddescNote;

    // Update localStorage with the edited note

    localStorage.setItem("notes", JSON.stringify(notes));

    // Show the updated notes on the page
    showNotes();
}