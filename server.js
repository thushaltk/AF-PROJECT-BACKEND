const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//Routes
const researcherRoutes = require('./routes/researcher-routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/researcher', researcherRoutes);


app.listen(5000, () => {
    console.log("Listening on port 5000....");
});