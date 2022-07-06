const mongoose = require('mongoose')
const users = require('./router/users')
const auth = require('./router/auth')
const cashbooks = require('./router/cashbooks')
const expands = require('./router/expands')
const filters = require('./router/filters')

const express = require('express')
const app = express();
app.use(express.json());

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/cashbooks', cashbooks)
app.use('/api/expands', expands)
app.use('/api/filters', filters)
//test

mongoose.connect('mongodb://localhost/CashBook_Project')
    .then(() => console.log('Connected To MongoDB...'))
    .catch(err => console.log('Could not connected to mongoDb...', err))


const port= process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port Number ${port}...`));