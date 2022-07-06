const auth = require('../middleware/auth')
const express = require('express')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { Expand } = require('../module/expand');
const { CashBook } = require('../module/cashbook');


router.get('/', auth, async function (req, res) {
    const expands = await Expand.find({ userId: req.user._id });
    res.send(expands);
});




router.get('/filter', auth, async function (req, res) {

    const schema = Joi.object({
        cashbookId: Joi.string().hex().length(24).required(),
        category: Joi.string().min(3).max(30),
        amount: Joi.number(),
        method: Joi.string().valid('CASH', 'ONLINE'),
        cashInOut: Joi.string().valid('CASH_IN', 'CASH_OUT'),
    });


    try {
        const value = await schema.validateAsync(req.body);
        console.log("value", value)
    }
    catch (err) {
        console.log("err", err)
        res.status(500).send(err.details[0].message);
        return;
    }
    // const expands = await Expand.find({ userId: req.user._id });
    // res.send(expands);

    items.find({
        created_at: {
            $gte: ISODate("2010-04-29T00:00:00.000Z"),
            $lt: ISODate("2010-05-01T00:00:00.000Z")
        }
    })
});









router.post('/', auth, async function (req, res) {
    const schema = Joi.object({
        cashbookId: Joi.string().hex().length(24).required(),
        category: Joi.string().min(3).max(30).required(),
        amount: Joi.number().required(),
        method: Joi.string().valid('CASH', 'ONLINE'),
        cashInOut: Joi.string().valid('CASH_IN', 'CASH_OUT').required(),
    });


    try {
        const value = await schema.validateAsync(req.body);
        console.log("value", value)
    }
    catch (err) {
        console.log("err", err)
        res.status(500).send(err.details[0].message);
        return;
    }

    let entry = await CashBook.findOne({ _id: req.body.cashbookId, userId: req.user._id });
    if (!entry) return res.status(400).send('No CashBook found at this Id...!!');


    entry = new Expand({
        category: req.body.category,
        amount: req.body.amount,
        method: req.body.method,
        cashInOut: req.body.cashInOut,
        userId: req.user._id,
        cashbookId: req.body.cashbookId
    });

    await entry.save();

    res.send(entry)

});

router.put('/:id', auth, async function (req, res) {
    const schema = Joi.object({
        cashbookId: Joi.string().hex().length(24).required(),
        category: Joi.string().min(3).max(30),
        amount: Joi.number(),
        method: Joi.string().valid('CASH', 'ONLINE'),
        cashInOut: Joi.string().valid('CASH_IN', 'CASH_OUT'),
    });


    try {
        const value = await schema.validateAsync(req.body);
        console.log("value", value)
    }
    catch (err) {
        console.log("err", err)
        res.status(500).send(err.details[0].message);
        return;
    }

    let entry = await Expand.findOne({ cashbookId: req.body.cashbookId, userId: req.user._id, _id: req.params.id });
    if (!entry) return res.status(400).send('No Entry found at given id...!!');

    entry = await Expand.findByIdAndUpdate(req.params.id, {
        category: req.body.category,
        amount: req.body.amount,
        method: req.body.method,
        cashInOut: req.body.cashInOut,
        cashbookId: req.body.cashbookId
    }, { new: true });

    await entry.save();
    res.send(entry)

});

router.delete('/:id', auth, async function (req, res) {

    const schema = Joi.object({
        cashbookId: Joi.string().hex().length(24).required(),
    });

    try {
        const value = await schema.validateAsync(req.body);
        console.log("value", value)
    }
    catch (err) {
        console.log("err", err)
        res.status(500).send(err.details[0].message);
        return;
    }

    const entry = await Expand.findOne({ _id: req.params.id, userId: req.user._id, cashbookId: req.body.cashbookId });

    if (!entry) return res.status(404).send("Entry not found..!");
    
    await entry.remove()
    res.send(entry);
});

module.exports = router;