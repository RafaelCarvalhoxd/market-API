const express = require('express');
require('dotenv').config(); 
const categoryRouter = require('./src/routes/categoryRoute');
const productRouter = require('./src/routes/productRoute');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json())

app.use(categoryRouter)
app.use(productRouter)


app.listen(port, () => {
    console.log(`app running on port ${port}`)
})