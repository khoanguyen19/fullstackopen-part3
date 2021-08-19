const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


morgan.token("body", (req, res) => {
    return JSON.stringify(req.body);
})

app.use(express.json());
app.use(express.static('build'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/info', (req, res) => {
    const date = new Date();
    const message = `
        <p>Phone book has info for ${persons.length} people</p>
        <p>${date}</p>
    `
    res.send(message);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if(person) {
        res.json(person);
    } else {
        res.status(404).send('Not Found');
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    
    res.status(204).end()
})

const generateId = () => {
    let id = 1;
    const idArray = persons.map(person => person.id);
    while(idArray.includes(id)) {
        id = Math.floor(Math.random() * 1000000);
    }
     
    return id;
}

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const name = body.name;
    const number = body.number;
    const checkName = persons
        .map(person => person.name.toUpperCase())
        .includes(name.trim().toUpperCase());
    console.log(checkName);
    if(checkName){
        return res.status(400).json({
            error: 'Name must be unique'
        });
    }
    if(!name) {
        return res.status(400).json({
            error: 'Missing name'
        });
    }
    if(!number) {
        return res.status(400).json({
            error: 'Missing number'
        });
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    res.json(person);
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});