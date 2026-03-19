import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const judges = pgTable("judges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  status: text("status").default("active"),
  roleId: integer("role_id").references(() => roles.id),
  name: text("name").notNull(),
});

export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  name: text("startupName").notNull(),
  domain: text("domain"),
  description: text("description"),
  teammembers: text("teamStrength"),
  userId: integer("user_id").references(() => users.id),
  stage: text("stage"),
  location: text("location"),
  website: text("website"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
});

export const startupProfiles = pgTable("startup_profiles", {
  id: serial("id").primaryKey(),
  startupId: integer("startup_id").references(() => startups.id).notNull(),
  documentsUrl: text("documents_url"),
  milestoneData: text("milestone_data"),
  onboardingStatus: text("onboarding_status").default("pending"),
  evaluationSummary: text("evaluation_summary"),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  startupId: integer("startup_id").references(() => startups.id).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").default("Applied"), // Applied, Interview, Selected
  pitchDeckUrl: text("pitch_deck_url"),
  financialsUrl: text("financials_url"),
  name: text("startupName").notNull(),
  email:text("email").notNull(),
  phone:text("phone").notNull(),
  appl_name: text("applicantName").notNull(),
  category:text("startupCategory").notNull(),
  prob_statement:text("problemStatement").notNull(),
  St_idea_desc:text("ideaDescription").notNull(),
  target:text("targetMarket"),
  est_budg:integer("estimatedBudget"),
  Team_strength:integer("teamStrength"),
  curr_revenue:integer("currentRevenue"),
  prob_solution:text("problemSolution").notNull(),
  Scalability:text("scalability"),
  mark_oppor:text("marketOpportunity"),
  finan_projection:text("financialProjections"),
});

export const evaluationCriteria = pgTable("evaluation_criteria", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  weight: integer("weight").notNull(),
});

export const scorecards = pgTable("scorecards", {
  id: serial("id").primaryKey(),
  // Legacy fields (kept for backward compatibility with existing records)
  applicationId: integer("application_id").references(() => applications.id),
  judgeId: integer("judge_id").references(() => users.id),
  totalScore: integer("total_score"), // superseded by `score`
  remarks: text("remarks"),           // superseded by `feedback`
  // New fields
  startupId: integer("startup_id").references(() => startups.id),
  startupName: text("startup_name"),
  judgeName: text("judge_name"),
  judgeRefId: integer("judge_ref_id").references(() => judges.id),
  score: integer("score"),
  feedback: text("feedback"),
  evaluationDate: text("evaluation_date"),
  status: text("status").default("pending"), // pending | in_progress | completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scorecardParameters = pgTable("scorecard_parameters", {
  id: serial("id").primaryKey(),
  scorecardId: integer("scorecard_id").references(() => scorecards.id).notNull(),
  parameterName: text("parameter_name").notNull(),
  marks: integer("marks"),
  maxMarks: integer("max_marks").notNull().default(15),
});

export const mentorAssignments = pgTable("mentor_assignments", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  startupId: integer("startup_id").references(() => startups.id).notNull(),
  assignedDate: timestamp("assigned_date").defaultNow(),
  status: text("status").default("active"),
});

export const fundings = pgTable("fundings", {
  id: serial("id").primaryKey(),
  startupId: integer("startup_id").references(() => startups.id).notNull(),
  investorId: integer("investor_id").references(() => users.id).notNull(),
  fundingDate: timestamp("funding_date").defaultNow(),
  amount: integer("amount").notNull(),
  fundingType: text("funding_type").notNull(),
});

export const knowledgeBase = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const physicalAssets = pgTable("physical_assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // meeting_room | lab_equipment | hot_desk
  description: text("description"),
  capacity: integer("capacity"),
});

export const assetBookings = pgTable("asset_bookings", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => physicalAssets.id).notNull(),
  bookedBy: integer("booked_by").references(() => users.id).notNull(),
  bookingDate: text("booking_date").notNull(), // ISO date string YYYY-MM-DD
  startTime: text("start_time").notNull(), // e.g. "09:00"
  endTime: text("end_time").notNull(), // e.g. "11:00"
  purpose: text("purpose"),
  status: text("status").default("confirmed"), // confirmed | cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertStartupSchema = createInsertSchema(startups).omit({ id: true });
export const insertStartupProfileSchema = createInsertSchema(startupProfiles).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, submittedAt: true });
export const insertScorecardSchema = createInsertSchema(scorecards).omit({ id: true });
export const insertScorecardParameterSchema = createInsertSchema(scorecardParameters).omit({ id: true });
export const insertJudgeSchema = createInsertSchema(judges).omit({ id: true });
export const insertMentorAssignmentSchema = createInsertSchema(mentorAssignments).omit({ id: true, assignedDate: true });
export const insertFundingSchema = createInsertSchema(fundings).omit({ id: true, fundingDate: true });
export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({ id: true, createdAt: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });
export const insertEvaluationCriteriaSchema = createInsertSchema(evaluationCriteria).omit({ id: true });
export const insertPhysicalAssetSchema = createInsertSchema(physicalAssets).omit({ id: true });
export const insertAssetBookingSchema = createInsertSchema(assetBookings).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Startup = typeof startups.$inferSelect;
export type StartupProfile = typeof startupProfiles.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Scorecard = typeof scorecards.$inferSelect;
export type ScorecardParameter = typeof scorecardParameters.$inferSelect;
export type Judge = typeof judges.$inferSelect;
export type MentorAssignment = typeof mentorAssignments.$inferSelect;
export type Funding = typeof fundings.$inferSelect;
export type KnowledgeBaseArticle = typeof knowledgeBase.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type EvaluationCriteria = typeof evaluationCriteria.$inferSelect;
export type PhysicalAsset = typeof physicalAssets.$inferSelect;
export type AssetBooking = typeof assetBookings.$inferSelect;