const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLScalarType,
    GraphQLList
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: GraphQLString },
        owner: { type: GraphQLString },
        allowed_users: { type: new GraphQLList(GraphQLString) },
    })
});

module.exports = DocumentType;