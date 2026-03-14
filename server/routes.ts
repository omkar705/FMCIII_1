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

  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updated = await storage.updateApplicationStatus(id, status);
      if (!updated) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  /* ================= APPLICATION FORM (Incubatee) ================= */

  app.post("/api/application-form", async (req, res) => {
    try {
      const body = req.body as Record<string, string>;
      const {
        startupName,
        startupCategory,
        ideaDescription,
        applicantName,
        email,
        phone,
        problemStatement,
        problemSolution,
        businessPlanFile,
        financialProjectionsFile,
      } = body;

      const missingFields: string[] = [];
      if (!applicantName) missingFields.push("applicantName");
      if (!email) missingFields.push("email");
      if (!phone) missingFields.push("phone");
      if (!startupName) missingFields.push("startupName");
      if (!startupCategory) missingFields.push("startupCategory");
      if (!problemStatement) missingFields.push("problemStatement");
      if (!ideaDescription) missingFields.push("ideaDescription");
      if (!problemSolution) missingFields.push("problemSolution");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const startup = await storage.createStartup({
        name: startupName,
        domain: startupCategory ?? null,
        description: ideaDescription ?? null,
      });

      const application = await storage.createApplication({
        startupId: startup.id,
        pitchDeckUrl: businessPlanFile ?? null,
        financialsUrl: financialProjectionsFile ?? null,
        status: "Applied",
      });

      return res.status(201).json({ application, startup });
    } catch (err) {
      console.error("Application form error:", err);
      return res.status(500).json({ message: "Failed to submit application" });
    }
  });


  /* ================= SCORECARDS ================= */

  app.get("/api/scorecards", async (req, res) => {
    const items = await storage.getScorecards();
    res.json(items);
  });

  app.get("/api/scorecards/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid scorecard id" });
    const item = await storage.getScorecard(id);
    if (!item) return res.status(404).json({ message: "Scorecard not found" });
    res.json(item);
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


  /* ================= PHYSICAL ASSETS ================= */

  app.get("/api/assets", async (req, res) => {
    const items = await storage.getPhysicalAssets();
    res.json(items);
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const input = api.physicalAssets.create.input.parse(req.body);
      const item = await storage.createPhysicalAsset(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      }
      console.error("Create asset error:", err);
      res.status(500).json({ message: "Failed to create asset" });
    }
  });


  /* ================= ASSET BOOKINGS ================= */

  app.get("/api/bookings", async (req, res) => {
    const items = await storage.getAssetBookings();
    res.json(items);
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const input = api.assetBookings.create.input.parse(req.body);

      // Server-side conflict detection
      const existing = await storage.getAssetBookings();
      const conflict = existing.find(
        (b) =>
          b.assetId === input.assetId &&
          b.bookingDate === input.bookingDate &&
          b.status === "confirmed" &&
          !(input.endTime <= b.startTime || input.startTime >= b.endTime)
      );
      if (conflict) {
        return res.status(400).json({ message: "This asset is already booked for the selected time slot." });
      }

      const item = await storage.createAssetBooking(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      }
      console.error("Create booking error:", err);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await storage.cancelAssetBooking(id);
      if (!updated) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Cancel booking error:", err);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });


  return httpServer;
}