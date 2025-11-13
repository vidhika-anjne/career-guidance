import { PORT } from "./config/env.js";
import { ensureDatabase } from "./db/pool.js";
import app from "./app.js";

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
    process.exit(1);
  });
