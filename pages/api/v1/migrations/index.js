import migrationRunner from "node-pg-migrate";
import path from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowMethods = ["GET", "POST"];
  if (!allowMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.createClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dir: path.join("infra", "migrations"),
      dryRun: true,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length === 0) {
        return response.status(200).json(migratedMigrations);
      }
      return response.status(201).json(migratedMigrations);
    }
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Failed to connect to the database" });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
