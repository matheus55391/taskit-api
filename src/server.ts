import Fastify from "fastify";

const server = Fastify();

server.get("/", async () => {
  return { hello: "world" };
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
