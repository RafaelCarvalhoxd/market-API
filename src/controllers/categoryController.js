const database = require('../services/database')
const { validateName } = require('../utils/validationFields');

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
        validateName(req, res);

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)',
            values: [req.body.name]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409).json({ error: `Category ${req.body.name} already exists` })
        }

        const result = await database.pool.query({
            text: 'INSERT INTO category (name) VALUES ($1) RETURNING *',
            values: [req.body.name]
        })

        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        validateName(req, res)

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)',
            values: [req.body.name]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409).json({ error: `Category ${req.body.name} already exists` })
        }

        const result = await database.pool.query({
            text: `
                UPDATE category
                SET name = $1, updated_date = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `,
            values: [req.body.name, req.params.id]
        })

         if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Category not found' })
        } 

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}