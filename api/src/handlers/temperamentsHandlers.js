const { getTemperamentsController } = require("../controllers/temperamentsControllers")

const getTemperamentsHandler = async (req, res) => {
    try {
        const response = await getTemperamentsController();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getTemperamentsHandler
}