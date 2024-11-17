require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
// const cors = require('cors');
const Note = require('./models/note');
const errorHandler = require('./javascripts/errorHandler')


app.use(express.static('dist'));
app.use(express.json());
morgan.token('data', (req, res) => { return JSON.stringify(req.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
// app.use(cors());

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
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
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => {
      response.status(404).json({
        error: 'Note not found'
      });
    });
});

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    "error":"unkonwn endpoint"
  })
}

app.use(unknownEndpoint);
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}`);
});