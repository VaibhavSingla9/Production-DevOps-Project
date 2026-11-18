
const express = require("express");
const client = require("prom-client");
const app = express();

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
});


app.use((req, res, next) => {
    res.on("finish", () => {
        if (req.path !== "/metrics") {
            httpRequestCounter.inc({
                method: req.method,
                route: req.route?.path || req.path,
                status_code: res.statusCode
            });
        }
    });

    next();
}); 

const PORT = 3000;

// Home endpoint
app.get("/", (req, res) => {
    res.send("Hello! Welcome to Production DevOps Project.");
});



// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP"
    });
});


// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
