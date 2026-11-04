require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true
}));
app.use(express.json());

// Application health check - used by AWS ALB
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        application: "Employee Management System"
    });
});

// Database connectivity check
app.get("/api/db-health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            status: "connected",
            database: "MySQL"
        });
    } catch (error) {
        console.error("Database health check failed:", error.message);

        res.status(503).json({
            status: "disconnected"
        });
    }
});

// Application information
app.get("/api", (req, res) => {
    res.json({
        message: "Employee Management API",
        version: "1.0.0",
        platform: "AWS ECS Fargate"
    });
});

// Get all employees
app.get("/api/employees", async (req, res) => {
    try {
        const [employees] = await pool.query(
            `SELECT id, name, email, department, created_at
       FROM employees
       ORDER BY id DESC`
        );

        res.json(employees);
    } catch (error) {
        console.error("Get employees error:", error.message);

        res.status(500).json({
            message: "Unable to retrieve employees"
        });
    }
});

// Add an employee
app.post("/api/employees", async (req, res) => {
    try {
        const { name, email, department } = req.body;

        if (!name || !email || !department) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO employees (name, email, department)
       VALUES (?, ?, ?)`,
            [name.trim(), email.trim(), department.trim()]
        );

        res.status(201).json({
            message: "Employee added successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add employee error:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Unable to add employee"
        });
    }
});

// API fallback for unknown endpoints
app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({
            message: "API endpoint not found"
        });
    }

    return res.status(404).json({
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application running on port ${PORT}`);
});