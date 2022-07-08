const { array } = require('joi');
const mongoose = require('mongoose')

const ExpandSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        Array: ['CASH', 'ONLINE', 'Paytm'],
        default: 'CASH'
    },
    cashInOut: {
        type: String,
        enum: ['CASH_IN', 'CASH_OUT'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cashbookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CashBook',
        required: true
    }
});


const Expand = mongoose.model('Expand', ExpandSchema);


module.exports.Expand = Expand;