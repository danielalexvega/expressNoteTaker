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

app.get('/api/notes', (req, res) => {
    notes = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8');
    return res.json(notes);
});

app.post('/api/notes', (req, res) => {
    notes = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8');
    updateNoteId(notes);
    console.log(`THE NOTE ID IS ${noteId}`);
    let newNote = req.body; 
    newNote.id = noteId;
    console.log(newNote);

    if (typeof notes === 'string') {
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
        if (note.id === deleteID) {
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
    let edit = (req.body);
    edit.id = parseInt(edit.id); 
    let editIndex = -1;
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8'));

    notes.forEach((note, index) => {
        if (note.id === edit.id) {
            editIndex = index;
        }
    });

    notes.splice(editIndex, 1, edit);

    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), 'utf-8', (err) => {
        if (err) throw err;
    });
    res.json(edit);
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