const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');

// Render owner dashboard with sales data
router.get('/', async (req, res) => {
    try {
        const sales = await Sales.find(); // Fetch all sales records
        res.render('owner', { title: 'Owner Dashboard', sales: sales }); // Pass sales data to the view
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
