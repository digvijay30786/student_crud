const express = require('express');

const server = express();

const connect = require('./config/db');

const cors = require('cors');

const { createProxyMiddleware } = require('http-proxy-middleware');

//config .env file using detenv
require('dotenv').config();

//call controller
const studentController  = require('./controller/student.controller');

//import inbuilt midelware
server.use(express.json());
server.use(cors());
server.use('/student',studentController);
const port = 2400;

server.listen(port , async () => {
    await connect();
    console.log(`server is runnig on port ${port}`)
});