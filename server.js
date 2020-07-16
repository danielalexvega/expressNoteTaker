const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();
var PORT = process.env.PORT || 3000;
let notes;
let idCount = 1;

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
    // console.log('Get: ');
    // console.log(notes);
    // console.log(typeof notes);
    return res.json(notes);
});


app.post('/api/notes', (req, res) => {
    notes = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8');
    console.log('YOU START WITH THIS IN POST');
    console.log(notes);
    console.log(typeof notes);
    let newNote = req.body;
    console.log('YOU JUST GOT THIS FROM POST');
    console.log(typeof newNote);
    console.log(newNote);

    if(typeof notes === 'string') {
        notes = JSON.parse(notes);
    }
    console.log('------------------------------');
    console.log(notes);
    console.log(typeof notes);

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), 'utf-8', (err) => {
        if (err) throw err;
        console.log('File written');
    });
    return res.json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
    let chosen = req.params.id;
    console.log(chosen);

    let deleteID = req.body
});


app.get('*', (req, res) => {
    console.log('test');
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log('App listening on PORT' + PORT);
});