const router = require('express').Router();
const { validate, OrderModel, OrderStatus } = require('../models/order');
const { parseError } = require('../utils/error');

router.post("/purchase", async function(req, res){

    try{
        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);
        
        const order = new OrderModel(req.body);

        order.status = OrderStatus.Placed;
        order.date = new Date();
        order.userId = req.user._id;

        await order.save();

        const response = { _id: order._id, date: order.date, status: order.status, productsCount: order.products.length, cost: 0};

        return res.status(200).send(response);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

module.exports = router;