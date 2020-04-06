const express = require('express');
const router = express.Router();

router.get('/bots', (req, res) => {
    res.json({bots: "Hello"});
});

// GET /order
router.get('/order/', (req, res) => {
    res.json({orders: [1, 2, 3]});
});

// POST /order
router.post('/order/', (req, res) => {
    res.json({orders: [1, 2, 3]});
});

// GET /order/4
router.get('/order/:id', (req, res) => {
    res.json({id: req.params.id});
});

// PUT /order/4
router.put('/order/:id', (req, res) => {
    res.json({id: req.params.id});
});

// DELETE
router.delete('/order/:id', (req, res) => {
    res.json({id: req.params.id});
});

module.exports = router;