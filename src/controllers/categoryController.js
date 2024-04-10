const database = require('../services/database')

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await database.pool.query('SELECT * FROM category');
        res.status(200).json({ succes: true, data: categories.rows });
    } catch (error) {
        console.log(error)
         res.status(500).json({ success: false, error: 'Something went wrong' });
    }
}