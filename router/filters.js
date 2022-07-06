const auth = require('../middleware/auth')
const express = require('express')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { CashBook } = require('../module/cashbook')
const { Expand } = require('../module/expand');
const { User } = require('../module/user')

router.get('/', auth, async function (req, res) {
    const cashbook = await CashBook.find({ userId: req.user._id });
    res.send(cashbook);
});



module.exports = router;
