const database = require('../services/database')
const { validateName } = require('../utils/validationFields');

exports.getAllCategories = async (req, res) => {
    try {
        const result = await database.pool.query('SELECT * FROM category');
        res.status(200).json({ succes: true, data: result.rows });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
};

exports.createCategory = async (req, res) => {
    try {
        validateName(req, res);

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)',
            values: [req.body.name]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409).json({ succes: false, error: `Category ${req.body.name} already exists` })
        }

        const result = await database.pool.query({
            text: 'INSERT INTO category (name) VALUES ($1) RETURNING *',
            values: [req.body.name]
        })

        return res.status(201).json({ succes: true, data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
};

exports.updateCategory = async (req, res) => {
    try {
        validateName(req, res)

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)',
            values: [req.body.name]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409).json({ succes: false, error: `Category ${req.body.name} already exists` })
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
            return res.status(404).json({ succes: false, error: 'Category not found' })
        }

        return res.status(200).json({ succes: true, data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const result = await database.pool.query({
            text: 'DELETE FROM category WHERE id = $1 RETURNING *',
            values: [req.params.id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({ succes: false, error: 'Category not found' })
        }

        return res.status(200).json({ success: true, message: 'Product deleted' })
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const result = await database.pool.query({
            text: 'SELECT * FROM category WHERE id = $1',
            values: [req.params.id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({succes: false, error: 'Category not found' })
        }

        return res.status(200).json({ succes: true, data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
};