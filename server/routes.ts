import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { roles, users, startups, applications } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user || user.passwordHash !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ user, token: "mock-jwt-token" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(401).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json({ user, token: "mock-jwt-token" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Startups
  app.get(api.startups.list.path, async (req, res) => {
    const items = await storage.getStartups();
    res.json(items);
  });
  
  app.get(api.startups.get.path, async (req, res) => {
    const item = await storage.getStartup(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.post(api.startups.create.path, async (req, res) => {
    try {
      const input = api.startups.create.input.parse(req.body);
      const item = await storage.createStartup(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.startups.update.path, async (req, res) => {
    try {
      const input = api.startups.update.input.parse(req.body);
      const item = await storage.updateStartup(Number(req.params.id), input);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Applications
  app.get(api.applications.list.path, async (req, res) => {
    const items = await storage.getApplications();
    res.json(items);
  });

  app.post(api.applications.create.path, async (req, res) => {
    try {
      const input = api.applications.create.input.parse({
        ...req.body,
        startupId: Number(req.body.startupId)
      });
      const item = await storage.createApplication(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.patch(api.applications.updateStatus.path, async (req, res) => {
    try {
      const input = api.applications.updateStatus.input.parse(req.body);
      const item = await storage.updateApplicationStatus(Number(req.params.id), input.status);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Scorecards
  app.get(api.scorecards.list.path, async (req, res) => {
    const items = await storage.getScorecards();
    res.json(items);
  });

  app.post(api.scorecards.create.path, async (req, res) => {
    try {
      const input = api.scorecards.create.input.parse({
        ...req.body,
        applicationId: Number(req.body.applicationId),
        judgeId: Number(req.body.judgeId),
        totalScore: Number(req.body.totalScore)
      });
      const item = await storage.createScorecard(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Mentor Assignments
  app.get(api.mentorAssignments.list.path, async (req, res) => {
    const items = await storage.getMentorAssignments();
    res.json(items);
  });

  app.post(api.mentorAssignments.create.path, async (req, res) => {
    try {
      const input = api.mentorAssignments.create.input.parse({
        ...req.body,
        mentorId: Number(req.body.mentorId),
        startupId: Number(req.body.startupId)
      });
      const item = await storage.createMentorAssignment(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Funding
  app.get(api.funding.list.path, async (req, res) => {
    const items = await storage.getFundings();
    res.json(items);
  });

  app.post(api.funding.create.path, async (req, res) => {
    try {
      const input = api.funding.create.input.parse({
        ...req.body,
        startupId: Number(req.body.startupId),
        investorId: Number(req.body.investorId),
        amount: Number(req.body.amount)
      });
      const item = await storage.createFunding(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Knowledge Base
  app.get(api.knowledgeBase.list.path, async (req, res) => {
    const items = await storage.getKnowledgeBaseArticles();
    res.json(items);
  });

  app.post(api.knowledgeBase.create.path, async (req, res) => {
    try {
      const input = api.knowledgeBase.create.input.parse({
        ...req.body,
        createdBy: Number(req.body.createdBy)
      });
      const item = await storage.createKnowledgeBaseArticle(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Roles & Users
  app.get(api.roles.list.path, async (req, res) => {
    const items = await storage.getRoles();
    res.json(items);
  });

  app.get(api.users.list.path, async (req, res) => {
    const items = await storage.getUsers();
    res.json(items);
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingRoles = await storage.getRoles();
    if (existingRoles.length === 0) {
      await db.insert(roles).values([
        { name: "Admin", description: "Platform Administrator" },
        { name: "Incubatee", description: "Startup Founder" },
        { name: "Mentor", description: "Incubator Mentor" },
        { name: "Investor", description: "Platform Investor" }
      ]);
      
      await db.insert(users).values([
        { email: "admin@fmciii.com", passwordHash: "password", name: "Admin User", roleId: 1 },
        { email: "founder@startup.com", passwordHash: "password", name: "Startup Founder", roleId: 2 },
        { email: "mentor@fmciii.com", passwordHash: "password", name: "Expert Mentor", roleId: 3 },
        { email: "investor@capital.com", passwordHash: "password", name: "Angel Investor", roleId: 4 }
      ]);
      
      await db.insert(startups).values([
        { name: "TechNova", domain: "AI/ML", description: "AI-driven analytics platform." },
        { name: "EcoGrow", domain: "Cleantech", description: "Sustainable agriculture solutions." }
      ]);

      await db.insert(applications).values([
        { startupId: 1, status: "Applied" },
        { startupId: 2, status: "Interview" }
      ]);
    }
  } catch (e) {
    console.error("Seed error", e);
  }
}