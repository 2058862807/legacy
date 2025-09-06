const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8001);
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Logging middleware
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// COMPATIBILITY LAYER - Add /api/* routes that forward to /v1/* handlers
app.get("/api/documents/list", (req, res) => {
  console.log(`🔄 Compatibility: /api/documents/list -> /v1/documents/list`);
  try {
    const email = String(req.query.user_email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    // Return empty array (matches original API format)
    res.json([]);
  } catch (error) {
    console.error("Error in /api/documents/list:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

app.get("/api/documents", (req, res) => {
  console.log(`🔄 Compatibility: /api/documents -> /v1/documents`);
  try {
    const email = String(req.query.user_email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    res.json([]);
  } catch (error) {
    console.error("Error in /api/documents:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

app.get("/api/users", (req, res) => {
  console.log(`🔄 Compatibility: /api/users -> /v1/users`);
  try {
    const email = String(req.query.email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "email parameter is required" 
      });
    }

    res.json({ 
      ok: true, 
      user: null,
      message: "User not found",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /api/users:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

app.get("/api/wills", (req, res) => {
  console.log(`🔄 Compatibility: /api/wills -> /v1/wills`);
  try {
    const userEmail = String(req.query.user_email || "").trim();
    
    if (!userEmail) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    res.json([]);
  } catch (error) {
    console.error("Error in /api/wills:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

app.get("/api/compliance", (req, res) => {
  console.log(`🔄 Compatibility: /api/compliance -> /v1/compliance`);
  try {
    res.json({ 
      ok: true, 
      rules: [],
      states_supported: 50,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /api/compliance:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

app.get("/api/test", (req, res) => {
  console.log(`🔄 Compatibility: /api/test -> /v1/test`);
  res.json({
    ok: true,
    message: "API routing is working (compatibility layer)",
    version: "api-compat",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/debug/cors", (req, res) => {
  console.log(`🔄 Compatibility: /api/debug/cors`);
  res.json({
    ok: true,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health endpoints
app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "nexteraestate-api"
  });
});

app.get("/v1/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    version: "v1",
    timestamp: new Date().toISOString(),
    service: "nexteraestate-api"
  });
});

// Diagnostics endpoint
app.get("/v1/diagnostics", (_req, res) => {
  try {
    const routes = app._router.stack
      .map((r: any) => r.route && `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`)
      .filter(Boolean);

    res.json({
      ok: true,
      version: "v1",
      env: { 
        nodeEnv: NODE_ENV,
        corsOrigin: ORIGIN, 
        portBound: !!PORT 
      },
      routes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      code: "DIAGNOSTICS_ERROR",
      message: "Failed to generate diagnostics"
    });
  }
});

// Business routes under /v1
app.get("/v1/list", (req, res) => {
  try {
    const email = String(req.query.user_email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_EMAIL",
        message: "user_email must be a valid email address"
      });
    }

    // TODO: Replace with real database query
    res.json({ 
      ok: true, 
      documents: [],
      user_email: email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /v1/list:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

// Documents endpoint (for /api/documents/list compatibility)
app.get("/v1/documents/list", (req, res) => {
  try {
    const email = String(req.query.user_email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    // TODO: Replace with real database query
    res.json([
      // Empty array for now - matches original API format
    ]);
  } catch (error) {
    console.error("Error in /v1/documents/list:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

app.get("/v1/documents", (req, res) => {
  try {
    const email = String(req.query.user_email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    // TODO: Replace with real database query  
    res.json([]);
  } catch (error) {
    console.error("Error in /v1/documents:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

// User lookup endpoint
app.get("/v1/users", (req, res) => {
  try {
    const email = String(req.query.email || "").trim();
    
    if (!email) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "email parameter is required" 
      });
    }

    // TODO: Replace with real database query
    res.json({ 
      ok: true, 
      user: null,
      message: "User not found",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /v1/users:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

// Will lookup endpoint
app.get("/v1/wills", (req, res) => {
  try {
    const userEmail = String(req.query.user_email || "").trim();
    
    if (!userEmail) {
      return res.status(400).json({ 
        ok: false, 
        code: "BAD_INPUT", 
        message: "user_email parameter is required" 
      });
    }

    // TODO: Replace with real database query
    res.json({ 
      ok: true, 
      wills: [],
      user_email: userEmail,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /v1/wills:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

// Compliance endpoint
app.get("/v1/compliance", (_req, res) => {
  try {
    res.json({ 
      ok: true, 
      rules: [],
      states_supported: 50,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /v1/compliance:", error);
    res.status(500).json({
      ok: false,
      code: "SERVER_ERROR", 
      message: "Internal server error"
    });
  }
});

// Test endpoint
app.get("/v1/test", (_req, res) => {
  res.json({
    ok: true,
    message: "API routing is working",
    version: "v1",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    ok: false,
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Global error:", err);
  res.status(500).json({ 
    ok: false, 
    code: "SERVER_ERROR", 
    message: "Internal server error" 
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 NexteraEstate API listening on port ${PORT}`);
  console.log(`📡 Environment: ${NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${ORIGIN}`);
  
  // Log all registered routes
  const routes = app._router.stack
    .map((r: any) => r.route && `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`)
    .filter((route: any) => route !== null && route !== undefined);
  
  console.log("📋 Registered routes:");
  routes.forEach((route: string) => console.log(`   ${route}`));
});

module.exports = app;