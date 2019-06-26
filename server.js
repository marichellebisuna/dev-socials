const express = require('express');
const mongoose = require('mongoose');

const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

//DB Connection
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB connected.'))
	.catch((err) => console.log(err));

app.get('/', (req, res) => {
	res.send('Hello world!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running at port ${port}.`));
