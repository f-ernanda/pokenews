import database from "infra/database";

beforeAll(clearDatabase);

async function clearDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

test("should return 201 when a POST request is made to /api/v1/migrations, and 200 when the same request is made again", async () => {
  const firstResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(firstResponse.status).toBe(201);

  const firstResponseBody = await firstResponse.json();

  expect(Array.isArray(firstResponseBody)).toBe(true);
  expect(firstResponseBody.length).toBeGreaterThan(0);
  const result = await database.query("SELECT * FROM pgmigrations");
  expect(result.rows.length).toBeGreaterThan(0);

  const secondResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(secondResponse.status).toBe(200);

  const secondResponseBody = await secondResponse.json();

  expect(Array.isArray(secondResponseBody)).toBe(true);
  expect(secondResponseBody.length).toBe(0);
});
