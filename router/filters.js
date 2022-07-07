const auth = require('../middleware/auth')
const express = require('express')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { CashBook } = require('../module/cashbook')
const { Expand } = require('../module/expand');
const { User } = require('../module/user')

router.get('/', auth, async function (req, res) {

    const schema = Joi.object({
        cashbookId: Joi.string().hex().length(24).required(),
        category: Joi.string().min(3).max(30),
        amount: Joi.number(),
        method: Joi.string().valid('CASH', 'ONLINE'),
        cashInOut: Joi.string().valid('CASH_IN', 'CASH_OUT'),
        date: Joi.object().keys({
            startDate: Joi.date(),
            endDate: Joi.date()
        })
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

    let query = {};

    query["cashbookId"] = req.body.cashbookId;

    query["userId"] = req.user._id;

    if (req.body.date && req.body.date.startDate) {
        query["date"] = {
            $gte: new Date(req.body.date.startDate).toISOString(),
            $lt: new Date(req.body.date.endDate).toISOString()
        }
    }
    if (req.body.cashInOut) {
        query["cashInOut"] = req.body.cashInOut
    }
    if (req.body.method) {
        query["method"] = req.body.method
    }
    if (req.body.category) {
        query["category"] = req.body.category
    }

    let entry = await Expand.find(query);

    if (!entry) return res.status(400).send('No entries found...!!');

    res.send(entry)

});



module.exports = router;
