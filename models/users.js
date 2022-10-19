const database = require("../db/database");
const ObjectId = require('mongodb').ObjectId;
const validator = require('email-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_KEY);

const users = {
    sendEmail: async function sendEmail(res, body) {
        sgMail
            .send(body)
            .then(() => {
                console.log("Email skickat");
            })
            .catch((error) => {
                console.error("Error: ", error)
            });
    },

    getAllUsers: async function getAllUsers(res) {
        let db;
        try {
            db = await database.getDb("users");
            const allUsers = await db.collection.find().toArray();
            if (allUsers) {
                return allUsers;
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

    register: async function register(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email and password is missing",
                }
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email is not validated",
                }
            });
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Not able to hash password",
                    }
                });
            }

            let db = await database.getDb("users");

            try {
                const doc = {
                    email: email,
                    password: hash,
                };

                await db.collection.insertOne(doc);

                return res.status(201).json({
                    message: "User created"
                });
            } catch (error) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not create a new user",
                    }
                })
            } finally {
                await db.client.close();
            }
        });
    },

    login: async function login(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email and password is missing",
                }
            });
        }

        let db = await database.getDb("users");

        try {
            const query = { email: email };

            const user = await db.collection.findOne(query);

            if (user) {
                return users.comparePasswords(res, user, password);
            }

            return res.status(401).json({
                data: {
                    message: "User doesn't exist."
                }
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    message: "Could not find the user",
                }
            })
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: async function comparePasswords(res, user, password) {
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not decrypt password"
                    }
                });
            }

            if (result) {
                const payload = { email: user.email };
                const secret = process.env.JWT_SECRET;

                const token = jwt.sign(payload, secret, { expiresIn: '1h'});

                return res.status(201).json({
                    data: {
                        _id: user["_id"],
                        email: user.email,
                        token: token,
                    }
                });
            }
            return res.status(401).json({
                errors: {
                    status: 401,
                    message: "Password not correct"
                }
            });

        });
        
    },

    checkToken: function checkToken(req, res, next) {
        const token = req.headers['x-access-token'];
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        message: "Token is not valid"
                    }
                });
            }
    
            // Valid token send on the request
            next();
        });
    },

    deleteUser: async function deleteUser(userToDelete) {
        let db;

        try {
            db = await database.getDb("users");
            const filter = { _id: ObjectId(userToDelete._id) };

            const result = await db.collection.deleteOne(filter);

            console.log(result);
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
}

module.exports = users;