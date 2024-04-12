const database = require('../services/database')
const { validateName, validatePrice, validateCategoryId} = require('../utils/validationFields');

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
        res.status(200).json({ succes: true, data: result.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ succes: false, error: 'Something went wrong' })
    }
}

exports.createProduct = async (req, res) => {
    try {
        validateName(req, res);
        validatePrice(req, res);
        validateCategoryId(req, res);

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)',
            values: [req.body.category_id]
        });

        if (!existsResult.rows[0].exists) {
            return res.status(422).json({ error: 'Category id not found' });
        }

        const result = await database.pool.query({
            text: `
                INSERT INTO products (name, description, price, currency, quantity, active, category_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `,
            values: [
                req.body.name,
                req.body.description || null,
                req.body.price,
                req.body.currency || 'USD',
                req.body.quantity || 0,
                'active' in req.body ? req.body.active : true,
                req.body.category_id
            ]
        });

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.uptadeProduct = async (req, res) => {
    try {
         if (!req.body.name || !req.body.description || !req.body.price || !req.body.currency || !req.body.quantity || !req.body.active || !req.body.category_id) {
            return res.status(422).json({ error: 'All fields are required' })
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)',
            values: [req.body.category_id]
        });

        if (!existsResult.rows[0].exists) {
            return res.status(422).json({ error: 'Category id not found' });
        }

        const result = await database.pool.query({
            text: `
            UPDATE products
            SET name = $1, description = $2, price = $3, currency = $4, quantity = $5, active = $6, category_id = $7, updated_date = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
            `,
            values: [
                req.body.name,
                req.body.description,
                req.body.price,
                req.body.currency,
                req.body.quantity,
                req.body.active,
                req.body.category_id,
                req.params.id
            ]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Product not found' })
        } 

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const result = await database.pool.query({
            text: 'DELETE FROM products WHERE id = $1 RETURNING *',
            values: [req.params.id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Product not found' })
        }

        return res.status(200).json({ success: true, message: 'Product deleted' })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
