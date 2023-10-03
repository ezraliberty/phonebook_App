const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>console.log("DB CONNECTED"))

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneBookSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  module.exports = mongoose.model("Person", phoneBookSchema)