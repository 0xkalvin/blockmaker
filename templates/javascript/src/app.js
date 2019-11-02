const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const health = require('./routes/health');

const { notFoundHandler, defaultErrorHandler }  = require('./middlewares/errorHandling');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use('/health', health);

app.use(notFoundHandler);
app.use(defaultErrorHandler);


module.exports = app;