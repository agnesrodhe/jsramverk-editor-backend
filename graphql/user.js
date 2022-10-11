const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLScalarType
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString }
    })
});

module.exports = UserType;