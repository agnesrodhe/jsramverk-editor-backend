process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const collectionName = "docs";
const Document = require("../models/documents");

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

let _id = "";

describe('documents', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('GET /documents', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/documents")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('POST /documents', () => {
        it('201 creating new document', (done) => {
            let doc = {
                name: "Dokument 1",
                text: "Dokumentets innehåll"
            };

            chai.request(server)
                .post('/documents')
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('name');
                    res.body.data.name.should.equal('Dokument 1');

                    done();
                });
        });

        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/documents")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].should.have.property("_id");

                    _id = res.body.data[0]["_id"];

                    done();
                });
        });
    });

    describe('POST /documents/update', () => {
        it('201 update a document', (done) => {
            let doc = {
                _id: _id,
                name: "Dokument 1",
                text: "Dokumentets innehåll uppdaterat"
            };

            chai.request(server)
                .post('/documents/update')
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');

                    done();
                });
        });

        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/documents")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].text.should.be.equal("Dokumentets innehåll uppdaterat");

                    done();
                });
        });
    });
});

