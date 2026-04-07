import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /* ================= AUTH ================= */
  

  app.post(api.auth.login.path, async (req, res) => {
  try {
    const input = api.auth.login.input.parse(req.body);

    // ✅ Normalize input
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    console.log("LOGIN ATTEMPT:");
    console.log("Email:", email);
    console.log("Password:", JSON.stringify(password));

    // ✅ Fetch user
    const user = await storage.getUserByEmail(email);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("DB Password:", JSON.stringify(user.passwordHash));

    // ✅ Check password
    let isMatch = false;

    // 🔁 Support BOTH plain text and hashed (for now)
    if (user.passwordHash.startsWith("$2b$")) {
      // bcrypt hash
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } else {
      // plain text (temporary support)
      isMatch = user.passwordHash === password;
    }

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Login success");

    // ✅ Success response
    req.session.userId = user.id;
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

  /* ── Register ── */
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const email = input.email.trim().toLowerCase();

      // Reject duplicate email
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Hash the plain-text password that arrives in the passwordHash field
      const passwordHash = await bcrypt.hash(input.passwordHash, 10);

      // Default role: startup_founder (role_id = 2, matches ROLE_IDS.STARTUP_FOUNDER in client/src/lib/roles.ts)
      const STARTUP_FOUNDER_ROLE_ID = 2;

      const user = await storage.createUser({
        ...input,
        email,
        passwordHash,
        roleId: input.roleId ?? STARTUP_FOUNDER_ROLE_ID,
        status: input.status ?? "active",
      });

      // Persist the logged-in user in the session
      req.session.userId = user.id;

      return res.status(201).json({ user, token: "mock-jwt-token" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      }
      console.error("Register error:", err);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  /* ── Profile (current session user) ── */
  app.get(api.auth.profile.path, async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.json(user);
  });

  /* ================= STARTUPS ================= */

  // Admin view: only startups with "Selected" application
  app.get("/api/startups/selected", async (req, res) => {
    try {
      const items = await storage.getSelectedStartups();
      res.json(items);
    } catch (err) {
      console.error("Get selected startups error:", err);
      res.status(500).json({ message: "Failed to fetch startups" });
    }
  });

  app.get("/api/startups", async (req, res) => {
    const items = await storage.getStartups();
    res.json(items);
  });

  app.post("/api/startups", async (req, res) => {
    const item = await storage.createStartup(req.body);
    res.json(item);
  });

  app.get("/api/startups/by-user/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user id" });
      const startup = await storage.getStartupByUserId(userId);
      if (!startup) return res.status(404).json({ message: "Startup not found" });
      res.json(startup);
    } catch (err) {
      console.error("Get startup by user error:", err);
      res.status(500).json({ message: "Failed to fetch startup" });
    }
  });

  app.get("/api/startups/:id", async (req, res) => {

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid startup id" });
  }

  const startup = await storage.getStartupById(id);

  if (!startup) {
    return res.status(404).json({ message: "Startup not found" });
  }

  res.json(startup);
});

  app.put("/api/startups/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid startup id" });
      const updated = await storage.updateStartup(id, req.body);
      if (!updated) return res.status(404).json({ message: "Startup not found" });
      res.json(updated);
    } catch (err) {
      console.error("Update startup error:", err);
      res.status(500).json({ message: "Failed to update startup" });
    }
  });

  /* ================= STARTUP PROFILES ================= */

  app.get("/api/startup-profiles/by-startup/:startupId", async (req, res) => {
    try {
      const startupId = Number(req.params.startupId);
      if (isNaN(startupId)) return res.status(400).json({ message: "Invalid startup id" });
      const profile = await storage.getStartupProfileByStartupId(startupId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      res.json(profile);
    } catch (err) {
      console.error("Get startup profile error:", err);
      res.status(500).json({ message: "Failed to fetch startup profile" });
    }
  });

  app.put("/api/startup-profiles/by-startup/:startupId", async (req, res) => {
    try {
      const startupId = Number(req.params.startupId);
      if (isNaN(startupId)) return res.status(400).json({ message: "Invalid startup id" });
      const profile = await storage.upsertStartupProfileByStartupId(startupId, req.body);
      res.json(profile);
    } catch (err) {
      console.error("Upsert startup profile error:", err);
      res.status(500).json({ message: "Failed to update startup profile" });
    }
  });




  /* ================= APPLICATIONS ================= */

  app.get("/api/applications", async (req, res) => {
    const { email } = req.query;
    if (email && typeof email === "string") {
      const items = await storage.getApplicationsByEmail(email.trim().toLowerCase());
      return res.json(items);
    }
    const items = await storage.getApplications();
    return res.json(items);
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
        targetMarket,
        estimatedBudget,
        teamStrength,
        currentRevenue,
        scalability,
        marketOpportunity,
        financialProjections
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
        teammembers: teamStrength ? Number(teamStrength) : null,
      });

      const application = await storage.createApplication({
        startupId: startup.id,
        pitchDeckUrl: businessPlanFile ?? null,
        financialsUrl: financialProjectionsFile ?? null,
        status: "Applied",
        name:startupName,
        appl_name: applicantName,
        category:startupCategory,
        St_idea_desc:ideaDescription,
        target:targetMarket,
        est_budg:estimatedBudget ? Number(estimatedBudget) : null,
        mark_oppoe:marketOpportunity,
        Scalability:scalability,
        finan_projection:financialProjections,
        curr_revenue:currentRevenue ? Number(currentRevenue) : null,
        Team_strength:teamStrength ? Number(teamStrength) : null,
        prob_solution:problemSolution,
        prob_statement:problemStatement,
        email,
        phone: phone ?? null,

      });

      return res.status(201).json({ application, startup });
    } catch (err) {
      console.error("Application form error:", err);
      return res.status(500).json({ message: console.error()
       });
    }
  });


  /* ================= SCORECARDS ================= */

  app.get("/api/scorecards", async (req, res) => {
    try {
      const items = await storage.getScorecards();
      res.json(items);
    } catch (err) {
      console.error("Get scorecards error:", err);
      res.status(500).json({ message: "Failed to fetch scorecards" });
    }
  });

  app.get("/api/scorecards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid scorecard id" });
      const item = await storage.getScorecard(id);
      if (!item) return res.status(404).json({ message: "Scorecard not found" });
      res.json(item);
    } catch (err) {
      console.error("Get scorecard error:", err);
      res.status(500).json({ message: "Failed to fetch scorecard" });
    }
  });

  app.post("/api/scorecards", async (req, res) => {
    try {
      const { startupId, startupName, judgeRefId, judgeName, evaluationDate } = req.body;

      const missingFields: string[] = [];
      if (!startupId) missingFields.push("startupId");
      if (!judgeRefId) missingFields.push("judgeRefId");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const data: Record<string, unknown> = {
        startupId: Number(startupId),
        startupName: startupName ?? null,
        judgeRefId: Number(judgeRefId),
        judgeName: judgeName ?? null,
        evaluationDate: evaluationDate ?? null,
        status: "pending",
      };

      console.log("[POST /api/scorecards] Creating scorecard with data:", data);

      const item = await storage.createScorecard(data);
      return res.status(201).json(item);
    } catch (err) {
      console.error("Create scorecard error:", err);
      return res.status(500).json({ message: "Failed to create scorecard" });
    }
  });

  app.patch("/api/scorecards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid scorecard id" });
      const updated = await storage.updateScorecard(id, req.body);
      if (!updated) return res.status(404).json({ message: "Scorecard not found" });
      res.json(updated);
    } catch (err) {
      console.error("Update scorecard error:", err);
      res.status(500).json({ message: "Failed to update scorecard" });
    }
  });

  app.delete("/api/scorecards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid scorecard id" });
      const existing = await storage.getScorecard(id);
      if (!existing) return res.status(404).json({ message: "Scorecard not found" });
      await storage.deleteScorecard(id);
      res.json({ success: true });
    } catch (err) {
      console.error("Delete scorecard error:", err);
      res.status(500).json({ message: "Failed to delete scorecard" });
    }
  });

  app.get("/api/scorecards/:id/parameters", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid scorecard id" });
      const params = await storage.getScorecardParameters(id);
      res.json(params);
    } catch (err) {
      console.error("Get scorecard parameters error:", err);
      res.status(500).json({ message: "Failed to fetch parameters" });
    }
  });

  app.put("/api/scorecards/:id/parameters", async (req, res) => {
    try {
      const scorecardId = parseInt(req.params.id);
      if (isNaN(scorecardId)) return res.status(400).json({ message: "Invalid scorecard id" });
      const { parameterName, marks, maxMarks = 15 } = req.body;
      if (!parameterName) return res.status(400).json({ message: "parameterName is required" });

      const param = await storage.upsertScorecardParameter(
        scorecardId,
        parameterName,
        marks !== undefined ? (marks === null ? null : Number(marks)) : null,
        Number(maxMarks),
      );

      // Recalculate and update scorecard score and status based on parameters
      const TOTAL_EXPECTED_PARAMS = 7; // Must match PARAMETERS array in ScorecardDetail.tsx
      const allParams = await storage.getScorecardParameters(scorecardId);
      const filled = allParams.filter(p => p.marks !== null && p.marks !== undefined);
      let newStatus = "pending";
      if (filled.length > 0) {
        newStatus = filled.length >= TOTAL_EXPECTED_PARAMS ? "completed" : "in_progress";
      }
      const totalScore = filled.length > 0
        ? allParams.reduce((sum, p) => sum + (p.marks ?? 0), 0)
        : null;
      await storage.updateScorecard(scorecardId, { status: newStatus, score: totalScore });

      res.json(param);
    } catch (err) {
      console.error("Upsert scorecard parameter error:", err);
      res.status(500).json({ message: "Failed to save parameter" });
    }
  });


  /* ================= MENTOR ASSIGNMENTS ================= */

  // Support both camelCase and kebab-case paths for backwards compatibility
  app.get("/api/mentorAssignments", async (req, res) => {
    const items = await storage.getMentorAssignments();
    res.json(items);
  });
  app.get("/api/mentor-assignments", async (req, res) => {
    const items = await storage.getMentorAssignments();
    res.json(items);
  });

  app.get("/api/mentor-assignments/by-startup/:startupId", async (req, res) => {
    try {
      const startupId = Number(req.params.startupId);
      if (isNaN(startupId)) return res.status(400).json({ message: "Invalid startup id" });
      const assignment = await storage.getMentorAssignmentByStartupId(startupId);
      if (!assignment) return res.status(404).json({ message: "No mentor assigned" });
      res.json(assignment);
    } catch (err) {
      console.error("Get mentor assignment by startup error:", err);
      res.status(500).json({ message: "Failed to fetch mentor assignment" });
    }
  });

  app.post("/api/mentorAssignments", async (req, res) => {
    try {
      const item = await storage.createMentorAssignment(req.body);
      res.status(201).json(item);
    } catch (err) {
      console.error("Create mentor assignment error:", err);
      res.status(500).json({ message: "Failed to create mentor assignment" });
    }
  });
  app.post("/api/mentor-assignments", async (req, res) => {
    try {
      const item = await storage.createMentorAssignment(req.body);
      res.status(201).json(item);
    } catch (err) {
      console.error("Create mentor assignment error:", err);
      res.status(500).json({ message: "Failed to create mentor assignment" });
    }
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

  // Support both camelCase and kebab-case paths (shared/routes.ts uses kebab-case)
  app.get("/api/knowledgeBase", async (req, res) => {
    const items = await storage.getKnowledgeBaseArticles();
    res.json(items);
  });
  app.get("/api/knowledge-base", async (req, res) => {
    const items = await storage.getKnowledgeBaseArticles();
    res.json(items);
  });

  app.post("/api/knowledgeBase", async (req, res) => {
    try {
      const item = await storage.createKnowledgeBaseArticle(req.body);
      res.status(201).json(item);
    } catch (err) {
      console.error("Create knowledge base article error:", err);
      res.status(500).json({ message: "Failed to create article" });
    }
  });
  app.post("/api/knowledge-base", async (req, res) => {
    try {
      const item = await storage.createKnowledgeBaseArticle(req.body);
      res.status(201).json(item);
    } catch (err) {
      console.error("Create knowledge base article error:", err);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  /* ================= USERS ================= */

app.get("/api/users", async (req, res) => {
  const requesterId = req.session.userId;
  if (!requesterId) return res.status(401).json({ message: "Not authenticated" });
  const requester = await storage.getUser(requesterId);
  if (!requester || requester.roleId !== 1) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const items = await storage.getUsers();
  res.json(items);
});

app.patch("/api/users/:id", async (req, res) => {
  try {
    // Only admins may update other users' roles
    const requesterId = req.session.userId;
    if (!requesterId) return res.status(401).json({ message: "Not authenticated" });
    const requester = await storage.getUser(requesterId);
    if (!requester || requester.roleId !== 1) {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user id" });
    const { name, roleId } = req.body;
    const updates: Partial<{ name: string; roleId: number }> = {};
    if (name !== undefined) updates.name = name;
    if (roleId !== undefined) updates.roleId = Number(roleId);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    const updated = await storage.updateUser(id, updates);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

app.patch("/api/users/:id/profile", async (req, res) => {
  try {
    // Users may only update their own profile
    const requesterId = req.session.userId;
    if (!requesterId) return res.status(401).json({ message: "Not authenticated" });
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user id" });
    if (requesterId !== id) {
      return res.status(403).json({ message: "Forbidden: cannot update another user's profile" });
    }
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    const updated = await storage.updateUser(id, { name: name.trim() });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update user profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});


  /* ================= JUDGES ================= */

  app.get("/api/judges", async (req, res) => {
    try {
      const items = await storage.getJudges();
      res.json(items);
    } catch (err) {
      console.error("Get judges error:", err);
      res.status(500).json({ message: "Failed to fetch judges" });
    }
  });

  app.post("/api/judges", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: "name is required" });
      const item = await storage.createJudge({ name });
      res.status(201).json(item);
    } catch (err) {
      console.error("Create judge error:", err);
      res.status(500).json({ message: "Failed to create judge" });
    }
  });

  app.patch("/api/judges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid judge id" });
      const updated = await storage.updateJudge(id, req.body);
      if (!updated) return res.status(404).json({ message: "Judge not found" });
      res.json(updated);
    } catch (err) {
      console.error("Update judge error:", err);
      res.status(500).json({ message: "Failed to update judge" });
    }
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