const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Initialize the Express app
const app = express();

// Database configuration
const db = require('./config/db');

// Import Sales model
const Sales = require('./models/Sales');

// Connect to MongoDB
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'yourSecretKey', // Change this to a strong secret key
    resave: false,
    saveUninitialized: false
}));

// Static folder for frontend
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set your views directory


// Route to render sales recording page
app.get('/sales', (req, res) => {
    res.render('recordSales'); // Create this view to record sales
});

// POST route to handle sale recording
app.post('/sales/record', async (req, res) => {
    const { brand, quantity } = req.body;
    try {
        const newSale = new Sales({ brand, quantity });
        await newSale.save();
        res.redirect('/sales/view'); // Redirect to view sales after recording
    } catch (error) {
        console.error(error);
        res.status(500).send('Error recording sale');
    }
});


// Route to display recorded sales
app.get('/sales/view', async (req, res) => {
    try {
        const salesRecords = await Sales.find(); // Retrieve all sales records
        res.render('viewSales', { sales: salesRecords }); // Render the viewSales template
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const salesRoutes = require('./routes/sales');
app.use('/sales', salesRoutes);

const ownerRoutes = require('./routes/owner');
app.use('/owner', ownerRoutes);


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/owner', require('./routes/owner'));
app.use('/sales', require('./routes/sales'));


// Route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the Beer and Wine Shop Stock Keeping Application!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
