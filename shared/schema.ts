import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  name: text("name").notNull(),
  domain: text("domain"),
  description: text("description"),
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
});

export const evaluationCriteria = pgTable("evaluation_criteria", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  weight: integer("weight").notNull(),
});

export const scorecards = pgTable("scorecards", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  judgeId: integer("judge_id").references(() => users.id).notNull(),
  totalScore: integer("total_score"),
  remarks: text("remarks"),
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

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertStartupSchema = createInsertSchema(startups).omit({ id: true });
export const insertStartupProfileSchema = createInsertSchema(startupProfiles).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, submittedAt: true });
export const insertScorecardSchema = createInsertSchema(scorecards).omit({ id: true });
export const insertMentorAssignmentSchema = createInsertSchema(mentorAssignments).omit({ id: true, assignedDate: true });
export const insertFundingSchema = createInsertSchema(fundings).omit({ id: true, fundingDate: true });
export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({ id: true, createdAt: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });
export const insertEvaluationCriteriaSchema = createInsertSchema(evaluationCriteria).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Startup = typeof startups.$inferSelect;
export type StartupProfile = typeof startupProfiles.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Scorecard = typeof scorecards.$inferSelect;
export type MentorAssignment = typeof mentorAssignments.$inferSelect;
export type Funding = typeof fundings.$inferSelect;
export type KnowledgeBaseArticle = typeof knowledgeBase.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type EvaluationCriteria = typeof evaluationCriteria.$inferSelect;