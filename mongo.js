const mongoose = require('mongoose');

// if(process.argv.length < 3) {
//     console.log('Please provide your password as an argument: node mongo.js <password>');
//     process.exit(1);
// }

const password = process.argv[2];

const url = 
`mongodb+srv://bingosu196:${password}@cluster0.ezfn5.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

switch(process.argv.length) {
    case 2:
        console.log('Please provide your password as an argument: node mongo.js <password>');
        process.exit(1);
        break;
    case 3:
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person);
            })
            mongoose.connection.close();
        })
        break;
    case 5: 
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })
        person.save().then(result => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
            mongoose.connection.close()
        })
        break;
    default:
        console.log('Invalid input');
        process.exit(1);
}




// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
// });