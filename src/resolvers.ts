import { v4 } from "uuid";
import { todos } from "./db.js";
import { GqlContext } from "./GqlContext.js";

interface User {
  id: string;
  username: string;
  description?: string;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
}

const NEW_TODO = "NEW TODO";

const resolvers = {
  Query: {
    getUser: async (
      obj: any,
      args: {
        id: string;
      },
      ctx: GqlContext,
      info: any
    ): Promise<User> => {
      return {
        id: v4(),
        username: "Dawid",
      };
    },

    getTodos: async (
      parent: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<Todo>> => {
      return [
        {
          id: v4(),
          title: "Task first",
          description: "Task first description",
        },
        {
          id: v4(),
          title: "Task second",
          description: "Task second description",
        },
        {
          id: v4(),
          title: "Task third",
        },
      ];
    },
  },

  Mutation: {
    addTodo: async (
      parent: any,
      args: {
        title: string;
        description: string;
      },
      { pubsub }: GqlContext,
      info: any
    ): Promise<Todo> => {
      const newTodo = {
        id: v4(),
        title: args.title,
        description: args.description,
      };
      todos.push(newTodo);
      pubsub.publish(NEW_TODO, { newTodo });
      return todos[todos.length - 1];
    },
  },
  Subscription: {
    newTodo: {
      subscribe: (parent: any, args: null, { pubsub }: GqlContext) =>
        pubsub.asyncIterator(NEW_TODO),
    },
  },
};

export default resolvers;
