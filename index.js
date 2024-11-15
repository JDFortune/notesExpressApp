require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Note = require('./models/note');


app.use(express.json());
morgan.token('data', (req, res) => { return JSON.stringify(req.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors());
app.use(express.static('dist'))

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      response.json(note);
    })
    .catch(error => {
      response.status(404).json({
        error: 'The note was note found, you silly bitch!'
      });
    });
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'});
  }

  
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then(savedNote => {
    response.json(savedNote);
  });
});

app.put('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      note.important = !note.important;
      note.save().then(note => response.json(note))
    })
    .catch(error => {
      response.status(404).json({
        error: 'Note not found'
      });
    });
});

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    "error":"unkonwn endpoint"
  })
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}`);
});