const typeDefs = `#graphql

  type User {
   id: ID!
   username: String!
   email:String
  }

  type Todo {
   id: ID!
   title: String!
   description:String
  }

  type Query {
   getUser(id: ID) : User
   getTodos: [Todo!]
  }
  type Mutation {
    addTodo(title: String!, description: String): Todo
  }

  type Subscription {
    newTodo: Todo!
  }
`;

export default typeDefs;
