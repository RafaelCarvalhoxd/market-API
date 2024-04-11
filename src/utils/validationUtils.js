const database = require('../services/database')

function validateField(fieldName) {
    return function(req, res) {
        if (!req.body[fieldName]) {
            return res.status(422).json({ error: `${fieldName} is required` });
        }
    };
}

async function checkCategoryAlreadyExists(name) {
    const existsResult = await database.pool.query({
        text: 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)',
        values: [name]
    });
    return existsResult.rows[0].exists;
}

async function checkCategoryIdExists(name) {

    const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)',
            values: [name]
        });
    return existsResult.rows[0].exists;
}
        
          
module.exports = { validateField, checkCategoryAlreadyExists, checkCategoryIdExists};