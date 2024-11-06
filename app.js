//Import the express module
const express = require('express');
//Import the dotenv module and call the config method
require('dotenv').config();
//Import the cors module
const cors = require('cors');
//Create a variable to store the port number
const PORT = process.env.PORT;
//Create the web server 
const app = express();
//Use the cors middleware
app.use(cors());
//Use the express.json middleware to parse JSON requests
app.use(express.json());
//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// app.js
const express = require('express');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');


app.use(bodyParser.json());

// Routes
app.use(employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
