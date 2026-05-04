import database from "infra/database";

beforeAll(clearDatabase);

async function clearDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

test("should return 200 when a GET request is made to /api/v1/migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  const result = await database.query("SELECT * FROM pgmigrations");
  expect(result.rows.length).toBe(0);
});
