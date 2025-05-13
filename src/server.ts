import { buildApp } from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 3333;
const app = buildApp();

app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`🚀 Server running at ${address}`);
});
