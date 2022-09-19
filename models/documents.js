const database = require("../db/database.js");
const initDocs = require("../data/documents.json");
const ObjectId = require('mongodb').ObjectId;

const documents = {
    getAllDocuments: async function getAllDocuments(res, req) {
        let db;

        try {
            db = await database.getDb();

            const allDocuments = await db.collection.find().toArray();

            if (allDocuments) {
                return allDocuments;
            }
        } catch (e) {
            return res.status(500).json({
                error: {
                    status: 500,
                    message: e.message,
                }
            });
        } finally {
            await db.client.close();
        }
    },

    insertDocument: async function insertDocument(newDocument) {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.insertOne(newDocument);

            return {
                ...newDocument,
                _id: result.insertedId
            };
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },

    updateDocument: async function updateDocument(documentToUpdate) {
        let db;

        try {
            db = await database.getDb();
            const filter = { _id: ObjectId(documentToUpdate._id) };

            const updateADocument = {
                $set: {
                    name: documentToUpdate.name,
                    text: documentToUpdate.text
                }
            };

            await db.collection.updateOne(filter, updateADocument);
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },

    deleteDocument: async function deleteDocument(documentToDelete) {
        let db;

        try {
            db = await database.getDb();
            const filter = { _id: ObjectId(documentToDelete._id) };

            const result = await db.collection.deleteOne(filter);

            console.log(result);
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },

    initDocuments: async function initDocuments() {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.insertMany(initDocs);

            console.log(`${result.insertedCount} documents were inserted`);
        } catch (e) {
            console.error(e.message);
        } finally {
            await db.client.close();
        }
    }
};

module.exports = documents;
