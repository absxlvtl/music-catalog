import request from "supertest";
import app from "../server.js";

describe("Tracks API – failures", () => {
  test("POST /tracks without Idempotency-Key → 400", async () => {
    const res = await request(app)
      .post("/tracks")
      .send({ title: "x" });

    expect(res.status).toBe(400);
  });

  test("GET /tracks/unknown → 404", async () => {
    const res = await request(app).get("/tracks/does-not-exist");
    expect(res.status).toBe(404);
  });
});
