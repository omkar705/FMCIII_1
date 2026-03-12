import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /* ================= AUTH ================= */

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);

      const user = await storage.getUserByEmail(input.email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.passwordHash !== input.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.json({
        user,
        token: "mock-jwt-token"
      });

    } catch (err) {

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join(".")
        });
      }

      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });


  /* ================= STARTUPS ================= */

  app.get("/api/startups", async (req, res) => {
    const items = await storage.getStartups();
    res.json(items);
  });

  app.post("/api/startups", async (req, res) => {
    const item = await storage.createStartup(req.body);
    res.json(item);
  });


  /* ================= APPLICATIONS ================= */

  app.get("/api/applications", async (req, res) => {
    const items = await storage.getApplications();
    res.json(items);
  });

  app.post("/api/applications", async (req, res) => {
    const item = await storage.createApplication(req.body);
    res.json(item);
  });


  /* ================= SCORECARDS ================= */

  app.get("/api/scorecards", async (req, res) => {
    const items = await storage.getScorecards();
    res.json(items);
  });

  app.post("/api/scorecards", async (req, res) => {
    const item = await storage.createScorecard(req.body);
    res.json(item);
  });


  /* ================= MENTOR ASSIGNMENTS ================= */

  app.get("/api/mentorAssignments", async (req, res) => {
    const items = await storage.getMentorAssignments();
    res.json(items);
  });

  app.post("/api/mentorAssignments", async (req, res) => {
    const item = await storage.createMentorAssignment(req.body);
    res.json(item);
  });


  /* ================= FUNDING ================= */

  app.get("/api/funding", async (req, res) => {
    const items = await storage.getFundings();
    res.json(items);
  });

  app.post("/api/funding", async (req, res) => {
    const item = await storage.createFunding(req.body);
    res.json(item);
  });


  /* ================= KNOWLEDGE BASE ================= */

  app.get("/api/knowledgeBase", async (req, res) => {
    const items = await storage.getKnowledgeBaseArticles();
    res.json(items);
  });

  app.post("/api/knowledgeBase", async (req, res) => {
    const item = await storage.createKnowledgeBaseArticle(req.body);
    res.json(item);
  });

  /* ================= USERS ================= */

app.get("/api/users", async (req, res) => {
  const items = await storage.getUsers();
  res.json(items);
});


  return httpServer;
}