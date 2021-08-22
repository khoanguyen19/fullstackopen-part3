require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

const app = express();

morgan.token("body", (req, res) => {
    return JSON.stringify(req.body);
})

app.use(express.json());
app.use(express.static('build'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res, next) => {
    
    Person.countDocuments({})
        .then(num => {
            const date = new Date();
            const message = `
                <p>Phone book has info ${num} people</p>
                <p>${date}</p>
            `
            res.send(message);
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
    
    const person = {
        name: body.name,
        number: body.number,
    }

    const opts = {
        new: true,
        runValidators: true,
        context: 'query',
    }
    Person.findByIdAndUpdate(req.params.id, person, opts)
        .then((updatedPerson) => {
            res.json(updatedPerson)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.status(204).end();
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson);
        })
        .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(person => {
            res.json(person)
        })
        .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
    console.log(err.message);

    if(err.name === 'CastError'){
        return res.status(400).send({error: 'Malformatted ID'});
    } else if(err.name === 'ValidationError'){
        return res.status(400).json(err.message);
    }

    next(err);
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});