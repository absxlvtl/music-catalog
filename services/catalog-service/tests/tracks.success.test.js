import request from "supertest";
import app from "../server.js";

describe("Tracks API – success", () => {
  test("POST /tracks creates track", async () => {
    const key = "test-key-1";

    const res = await request(app)
      .post("/tracks")
      .set("Idempotency-Key", key)
      .send({ title: "Track A", artist: "Artist X" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Track A");
  });

  test("GET /tracks returns list", async () => {
    const res = await request(app).get("/tracks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
