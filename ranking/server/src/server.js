import { ApolloServer } from 'apollo-server-express';
import models from './models';
import typeDefs from './schema';
import resolvers from './resolvers';
import app from './express';

const server = new ApolloServer({
  context: { models },
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.info(`🚀 Server ready at http://${process.env.SERVER_IP}:${4000}${server.graphqlPath}`)
);
 