const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const db = require('./config/db');

const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
const Consultation = require('./models/consultation');
const Image = require('./models/image');

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/', routes);

db.sync({ alter: true });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});