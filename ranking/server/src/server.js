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

console.log('Logging level: ', process.env.LOG_LEVEL)

switch (process.env.LOG_LEVEL) {
  case 'ERROR':
    console.warn = function() {};
  case 'WARN':
    console.info = function() {};
  case 'INFO':
    console.log = function() {};
  case 'LOG':
    console.debug = function() {};
    console.trace = function() {};
    console.dir = function() {};
}

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.info(
    `🚀  Server ready at http://${process.env.SERVER_IP}:${4000}${
      server.graphqlPath
    }`
  )
);
