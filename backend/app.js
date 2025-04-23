const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/user', userRoutes);
app.use('/api/loan', loanRoutes);

module.exports = app;
