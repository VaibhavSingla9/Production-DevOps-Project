const request = require("supertest");
const app = require("./server");

describe("GET /", () => {
    test("should return the welcome message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(
            "Hello! Welcome to Production DevOps Project."
        );
    });
});

test("should return application health status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        status: "UP"
    });
});


test("should expose Prometheus metrics", async () => {
    const response = await request(app).get("/metrics");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("# HELP http_requests_total");
});