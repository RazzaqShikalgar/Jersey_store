const express = require('express');
const router = express.Router();

//Get Product Model
const Product = require('../models/product');

// -------GET-------
router.get('/add/:product', function (req,res) {
    const slug = req.params.product;
    Product.findOne({slug: slug}, function (err, p) {
        if(err)
        console.log(err);

        if(typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
            })
        }
    });
});

module.exports = router;