const database = require('../services/database')

exports.getAllProducts = async (req, res) => {
    try {
        const result = await database.pool.query(
            `SELECT p.id, p.name, p,description, p.price, p.currency,
                    p.quantity, p.active, p.created_date, p.updated_date,
                    
                        (SELECT ROW_TO_JSON(category_obj) FROM (
                            SELECT id, name FROM category WHERE id = p.category_id
                        ) category_obj) AS category
                    
                FROM products p`
        )
        res.status(200)
            .json({ succes: true, data: result.rows })
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({ succes: false, error: 'Something went wrong' })
    }
}

exports.createProduct = async (req, res) => {
    try {

        if (!req.body.name) {
            res.status(422)
                .json({succes: false, error: `Name is required!`})
        }
        if (!req.body.price) {
            res.status(422)
                .json({succes: false, error: `Price is required!`})
        }

        if (!req.body.category_id) {
            res.status(422)
                .json({succes: false, error: `Category id is required!`})
        }
        const result = await database.pool.query({
            text: `
            INSERT INTO products (name, description, price, currency, quantity, active, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            values: [
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.price,
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.category_id
            ]
        })

         res.status(201)
                .json({succes: true, data: result.rows[0]})
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({ succes: false, error: 'Something went wrong' })
    }
}