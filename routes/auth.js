var express = require('express');
var router = express.Router();

const usersModel = require("../models/users");

router.post('/register', async (req, res) => {
    const body = req.body;

    await usersModel.register(res, body);

});

router.post('/login', async (req, res) => {
    const body = req.body;

    await usersModel.login(res, body);

});

// router.post(
//     "/",
//     async (req, res) => {
//         const newDocument = req.body;

//         const result = await documentsModel.insertDocument(newDocument);

//         return res.status(201).json({ data: result });
//     });

// router.post(
//     "/update",
//     async (req, res) => {
//         const documentToUpdate = req.body;
//         const result = await documentsModel.updateDocument(documentToUpdate);

//         return res.status(200).json({ data: result });
//     }
// );

// router.post("/init", async (req, res) => {
//     const result = await documentsModel.initDocuments();

//     console.log("init made");

//     return res.status(201).json(result);
// });

// router.delete(
//     "/delete",
//     async (req, res) => {
//         await documentsModel.deleteDocument(req.body);
//         res.status(204).send();
//     }
// );

module.exports = router;
