const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();
var PORT = process.env.PORT || 3000;
let notes;
let noteId;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// * The application should have a `db.json` file on the backend that will be used to store and retrieve notes using the `fs` module.

// * The following API routes should be created:
//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.


//this needs to be a string...
app.get('/api/notes', (req, res) => {
    notes = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8');
    return res.json(notes);
});

app.post('/api/notes', (req, res) => {
    notes = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8');
    //THIS IS A STRING... WE'RE GIVEN A STRING, WE PASS IT IN, AND WE UPDATE NOTEID
    updateNoteId(notes);
    console.log(`THE NOTE ID IS ${noteId}`);
    let newNote = req.body;   //THIS IS AN OBJECT

    newNote.id = noteId;
    console.log(newNote);

    if (typeof notes === 'string') {  //CONVERT THE STRING BACK IN AN ARRAY (OBJECT)
        notes = JSON.parse(notes);
    }
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), 'utf-8', (err) => {
        if (err) throw err;
        console.log('File written');
    });
    return res.json(notes);
});




app.delete('/api/notes/:id', (req, res) => {
    let deleteID = parseInt(req.params.id);
    let deleteIndex = -1;
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8')); 

    notes.forEach((note, index) => {
        if(note.id === deleteID) {
            deleteIndex = index;
        }
    });
    console.log(deleteIndex);

    notes.splice(deleteIndex, 1);

    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), 'utf-8', (err) => {
        if (err) throw err;
        console.log('File overwritten');
    });

    res.json(deleteIndex);
});

app.put('/api/notes/', (req, res) => {
    console.log(typeof req.body);
    let edit = (req.body); //object
    let editIndex = -1;
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8'));

    notes.forEach((note, index) => {
        if(note.id === edit.id){
            editIndex = index;
        }
    });

    notes.splice(editIndex, 1, edit);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), 'utf-8', (err) => {
        if (err) throw err;
        console.log('File overwritten');
    });

    res.json(notes);
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

function updateNoteId(notes) {
    let tempObject = JSON.parse(notes);
    if (tempObject.length === 0) {
        noteId = 1;
    } else {
        noteId = tempObject[tempObject.length - 1].id + 1;
    }
    console.log(noteId);
}

app.listen(PORT, () => {
    console.log('App listening on PORT' + PORT);
});