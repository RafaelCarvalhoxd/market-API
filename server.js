const express = require('express');
const database = require('./src/services/database');
const categoryRouter = require('./src/routes/categoryRoute');
const productRouter = require('./src/routes/productRoute');
const port = 3000;

const app = express();

app.use(categoryRouter)
app.use(productRouter)


app.listen(port, () => {
    console.log(`app running on port ${port}`)
})