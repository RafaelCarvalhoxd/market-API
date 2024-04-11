const database = require('../services/database')

exports.getAllCategories = async (req, res) => {
    try {
        const result = await database.pool.query('SELECT * FROM category');
        res.status(200)
            .json({ succes: true, data: result.rows });
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({ success: false, error: 'Something went wrong' });
    }
}

exports.createCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(422)
                .json({ error: 'Name is required' })
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)',
            values: [req.body.name]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409)
                .json({ error: `Category ${req.body.name} already exists` })
        }

        const result = await database.pool.query({
            text: 'INSERT INTO category (name) VALUES ($1) RETURNING *',
            values: [req.body.name]
        })

        return res.status(201)
            .json(result.rows[0])
    } catch (error) {
        return res.status(500)
            .json({ error: error.message })
    }
}