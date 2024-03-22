import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { faker } from "@faker-js/faker";
import { testGraphQLQuery } from "./testGraphQLQuery";
import { addMocksToSchema } from "@graphql-tools/mock";
import { describe, expect } from "@jest/globals";

describe("User data download test", () => {
  const GetUser = `
          query GetUser($id: ID!) {
              getUser(id: $id) {
                  id
                  username
                  email
              }
          }
      `;

  it("Retrieves the appropriate user", async () => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const userId = faker.string.uuid();
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const mocks = {
      User: () => ({
        id: userId,
        username,
        email,
      }),
    };

    const schemaWithMocks = addMocksToSchema({ schema, mocks });

    const queryResponse = await testGraphQLQuery({
      schema: schemaWithMocks,
      source: GetUser,
      variableValues: { id: faker.string.uuid() },
    });
    const result = queryResponse.data ? queryResponse.data.getUser : null;

    expect(result).toEqual({
      id: userId,
      username,
      email,
    });
  });
});
