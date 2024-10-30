const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const jobRoutes = require('./routes/jobRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const workerRoutes = require('./routes/workerRoutes');



dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/workers', workerRoutes);



module.exports = app;