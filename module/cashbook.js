const mongoose = require('mongoose')

const CashBookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const CashBook = mongoose.model('CashBook', CashBookSchema);


module.exports.CashBook = CashBook;