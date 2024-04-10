const database = require('../services/database')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await database.pool.query(
            `SELECT p.id, p.name, p,description, p.price, p.currency,
                    p.quantity, p.active, p.created_date, p.updated_date,
                    
                    (SELECT ROW_TO_JSON(category_obj) FROM (
                        SELECT id, name FROM category WHERE id = p.category_id
                    ) category_obj) AS category
                    
                FROM products p`
        )
        res.status(200).json({ succes: true, data: products.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({ succes:false, error: 'Something went wrong'})
    }
}