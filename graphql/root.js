const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const DocumentType = require("./document.js");
const UserType = require("./user.js");

const documentsModel = require("../models/documents.js");
const usersModel = require("../models/users.js");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        documents: {
            type: new GraphQLList(DocumentType),
            description: 'List of all documents',
            resolve: async function() {
                const allDocuments = await documentsModel.getAllDocuments();
                return allDocuments;
            }
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of all users',
            resolve: async function() {
                const allUsers = await usersModel.getAllUsers();
                return allUsers;
            }
        }
    })
});

module.exports = RootQueryType;