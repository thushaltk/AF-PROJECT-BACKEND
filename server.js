const express = require('express');
const cors = require('cors');

//Routes
const researcherRoutes = require('./routes/researcher-routes');
const adminRoutes = require('./routes/admin-routes');
const attendeeRoutes = require('./routes/attendee-routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/researcher', researcherRoutes);
app.use('/api/attendee', attendeeRoutes);

//For ERROR HANDLING
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    .json({ message: error.message || 'An unknown error occured' });
})







app.listen(5000, () => {
    console.log("Listening on port 5000....");
});