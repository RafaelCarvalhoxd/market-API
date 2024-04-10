const express = require('express');
const database = require('./services/database');
const categoryRouter = require('./routes/categoryRoute')
const productRouter = require('./routes/productRoute')
const port = 3000;

const app = express();

app.use(categoryRouter)
app.use(productRouter)


app.listen(port, () => {
    console.log(`app running on port ${port}`)
})