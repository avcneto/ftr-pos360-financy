import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    title: String!
    description: String
    color: String
    icon: String
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    date: DateTime!
    description: String
    categoryId: ID
    category: Category
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    signUp(name: String!, email: String!, password: String!): AuthPayload!
    signIn(email: String!, password: String!): AuthPayload!
    updateProfile(name: String!): User!

    createCategory(
      title: String!
      description: String
      color: String
      icon: String
    ): Category!
    updateCategory(
      id: ID!
      title: String
      description: String
      color: String
      icon: String
    ): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(
      title: String!
      amount: Float!
      type: String!
      date: String!
      description: String
      categoryId: ID
    ): Transaction!
    updateTransaction(
      id: ID!
      title: String
      amount: Float
      type: String
      date: String
      description: String
      categoryId: ID
    ): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;
