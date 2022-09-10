var express = require('express');
var router = express.Router();

const documentsModel = require("../models/documents");

router.get('/', async (req, res) => {
    const documents = await documentsModel.getAllDocuments();
    
    return res.json({
        data: documents
    });
});

router.post(
    "/",
    async (req, res) => {
        const newDocument = req.body;

        const result = await documentsModel.insertDocument(newDocument);
        return res.status(201).json({ data: result });
});

router.post("/init", async (req, res) => {
    const result = await documentsModel.initDocuments();

    console.log("init made");

    return res.status(201).json(result);
});

router.delete(
    "/",
    async (req, res) => {
        res.status(204).send();

    }
)

module.exports = router;