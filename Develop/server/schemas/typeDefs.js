const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: Id
    username: String
    email: String
    bookCount: Int
    savedBooks : [Book]
}

type Book {
    bookId : String
    authors : [String]
    description : String
    title : String
    image : String
    link : String
}

type Auth {
    token: ID!
    user: User
}

input BookInput{
    bookId : String
    authors: [String]
    description String
    title: String
    image: String
    link: String
}

type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String! email: String!, password: String!): Auth
    savedBook(book: BookInput!): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;