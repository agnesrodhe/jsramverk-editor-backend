const mongo  = require("mongodb").MongoClient;
const collectionName = "docs";

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://texteditor:agro21@cluster0.wxupg3n.mongodb.net/?retryWrites=true&w=majority`;

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;