const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const PORT = 5000;


dotenv.config({ path:'./config.env'})

require('./db/conn')

app.use(express.json());

app.use(require('./router/auth'))


//link the router file to make our router easy

// app.get('/', (req, res) => {
//   res.send("Hello from server");
// });

// app.get('/login', (req, res) => {
//   res.send("Hello, this is login");
// });



app.listen(PORT, () => {
  console.log(`Server running on posrt ${PORT}`);
});