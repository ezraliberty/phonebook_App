const mongoose = require("mongoose");
require("dotenv").config();

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneBook = new mongoose.model("Person", phoneBookSchema);

// const phonebook = new PhoneBook({
//   name: process.argv[3],
//   number: process.argv[4],
// });

PhoneBook.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    });
    mongoose.connection.close()
})

// phonebook.save().then((result) => {
//   console.log(`added ${result.name} number ${result.number} to phonebook`);
//   mongoose.connection.close();
// });
