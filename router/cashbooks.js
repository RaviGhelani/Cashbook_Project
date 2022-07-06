const auth = require('../middleware/auth')
const express = require('express')
const _ = require('lodash')
const router = express.Router();
const Joi = require('joi')
const { CashBook } = require('../module/cashbook')


router.get('/', auth, async function (req, res) {
    const cashbook = await CashBook.find({ userId: req.user._id });
    res.send(cashbook);
});

// router.get('/me', auth, async function (req, res) {

//     const cashbook = await CashBook.findById(req.user.id);
//     res.send(cashbook);

// });

router.post('/', auth, async function (req, res) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
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

    let book = await CashBook.findOne({ name: req.body.name, _id: req.user._id });
    if (book) return res.status(400).send('You already made cashbook in this name..!');


    book = new CashBook({
        name: req.body.name,
        userId: req.user._id
    });

    await book.save();

    res.send(book)

});

router.put('/:id', auth, async function (req, res) {

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
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

    const book = await CashBook.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
    }, { new: true });

    if (!book) return res.status(400).send('CashBook not found..!');

    await book.save();
    res.send(book);
});

router.delete('/:id', auth, async function (req, res) {

    const book = await CashBook.findOne({ _id: req.params.id, userId: req.user._id });
    if (!book) {
      return res.status(404).send("CashBook not avalable");
    }
    await book.remove()
    res.send(book);
});

module.exports = router;