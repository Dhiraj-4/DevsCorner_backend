import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app.js";

let refreshToken;

describe("POST /login", () => {
  it("should return accessToken and set refreshToken cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "testuser@example.com",
        password: "Str0ngP@ssw0rd!"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("info");

    const cookies = res.headers["set-cookie"];
    console.log("this is what cookies hold: ", cookies);

    expect(cookies).toBeDefined();
    refreshToken = cookies.find(c => c.startsWith("refreshToken="));
    expect(refreshToken).toBeDefined();
  });
});

describe("POST /auth/refresh", () => {
  it("should return new accessToken", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("cookie", refreshToken);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });
});