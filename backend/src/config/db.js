const mongoose = require('mongoose');
require('dotenv').config();
const connect = ()=>{
    mongoose.connect(`mongodb+srv://dig30786:${process.env.DB_PASS}@cluster0.mcj6r.mongodb.net/TodoList?retryWrites=true&w=majority`);
}

module.exports = connect;

