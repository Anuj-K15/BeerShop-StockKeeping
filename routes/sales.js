const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');

// Render record sales form
router.get('/record', (req, res) => {
    res.render('recordSales', { title: 'Record Sale' });
});

// Handle record sales
router.post('/record', async (req, res) => {
    const { brand, quantity } = req.body;

    const newSale = new Sales({
        brand,
        quantity,
        date: Date.now() // Automatically set current date and time
    });

    try {
        await newSale.save();
        res.redirect('/sales/view');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// View sales records
router.get('/view', async (req, res) => {
    try {
        const salesRecords = await Sales.find();
        res.render('viewSales', { title: 'Recorded Sales', sales: salesRecords });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
