import { db } from "./db";
import {
  users, startups, startupProfiles, applications,
  evaluationCriteria, scorecards, mentorAssignments,
  fundings, knowledgeBase, roles, physicalAssets, assetBookings,
  type User, type Startup, type Application, type Scorecard,
  type MentorAssignment, type Funding, type KnowledgeBaseArticle, type Role,
  type EvaluationCriteria, type PhysicalAsset, type AssetBooking,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  getUsers(): Promise<User[]>;

  // Roles
  getRoles(): Promise<Role[]>;

  // Startups
  getStartups(): Promise<Startup[]>;
  getStartup(id: number): Promise<Startup | undefined>;
  createStartup(startup: any): Promise<Startup>;
  updateStartup(id: number, startup: any): Promise<Startup | undefined>;

  // Applications
  getApplications(): Promise<Application[]>;
  createApplication(application: any): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;

  // Scorecards
  getScorecards(): Promise<Scorecard[]>;
  getScorecard(id: number): Promise<Scorecard | undefined>;
  createScorecard(scorecard: any): Promise<Scorecard>;

  // Mentor Assignments
  getMentorAssignments(): Promise<MentorAssignment[]>;
  createMentorAssignment(assignment: any): Promise<MentorAssignment>;

  // Fundings
  getFundings(): Promise<Funding[]>;
  createFunding(funding: any): Promise<Funding>;

  // Knowledge Base
  getKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]>;
  createKnowledgeBaseArticle(article: any): Promise<KnowledgeBaseArticle>;

  // Physical Assets
  getPhysicalAssets(): Promise<PhysicalAsset[]>;
  createPhysicalAsset(asset: any): Promise<PhysicalAsset>;

  // Asset Bookings
  getAssetBookings(): Promise<AssetBooking[]>;
  createAssetBooking(booking: any): Promise<AssetBooking>;
  cancelAssetBooking(id: number): Promise<AssetBooking | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(user: any): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async getStartups(): Promise<Startup[]> {
    return await db.select().from(startups);
  }
  async getStartup(id: number): Promise<Startup | undefined> {
    const [startup] = await db.select().from(startups).where(eq(startups.id, id));
    return startup;
  }
  async createStartup(startup: any): Promise<Startup> {
    const [newStartup] = await db.insert(startups).values(startup).returning();
    return newStartup;
  }
  async updateStartup(id: number, updates: any): Promise<Startup | undefined> {
    const [updated] = await db.update(startups).set(updates).where(eq(startups.id, id)).returning();
    return updated;
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }
  async createApplication(application: any): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }
  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [updated] = await db.update(applications).set({ status }).where(eq(applications.id, id)).returning();
    return updated;
  }

  async getScorecards(): Promise<Scorecard[]> {
    return await db.select().from(scorecards);
  }
  async getScorecard(id: number): Promise<Scorecard | undefined> {
    const [scorecard] = await db.select().from(scorecards).where(eq(scorecards.id, id));
    return scorecard;
  }
  async createScorecard(scorecard: any): Promise<Scorecard> {
    const [newScorecard] = await db.insert(scorecards).values(scorecard).returning();
    return newScorecard;
  }

  async getMentorAssignments(): Promise<MentorAssignment[]> {
    return await db.select().from(mentorAssignments);
  }
  async createMentorAssignment(assignment: any): Promise<MentorAssignment> {
    const [newAssignment] = await db.insert(mentorAssignments).values(assignment).returning();
    return newAssignment;
  }

  async getFundings(): Promise<Funding[]> {
    return await db.select().from(fundings);
  }
  async createFunding(funding: any): Promise<Funding> {
    const [newFunding] = await db.insert(fundings).values(funding).returning();
    return newFunding;
  }

  async getKnowledgeBaseArticles(): Promise<KnowledgeBaseArticle[]> {
    return await db.select().from(knowledgeBase);
  }
  async createKnowledgeBaseArticle(article: any): Promise<KnowledgeBaseArticle> {
    const [newArticle] = await db.insert(knowledgeBase).values(article).returning();
    return newArticle;
  }

  async getPhysicalAssets(): Promise<PhysicalAsset[]> {
    return await db.select().from(physicalAssets);
  }
  async createPhysicalAsset(asset: any): Promise<PhysicalAsset> {
    const [newAsset] = await db.insert(physicalAssets).values(asset).returning();
    return newAsset;
  }

  async getAssetBookings(): Promise<AssetBooking[]> {
    return await db.select().from(assetBookings);
  }
  async createAssetBooking(booking: any): Promise<AssetBooking> {
    const [newBooking] = await db.insert(assetBookings).values(booking).returning();
    return newBooking;
  }
  async cancelAssetBooking(id: number): Promise<AssetBooking | undefined> {
    const [updated] = await db.update(assetBookings).set({ status: "cancelled" }).where(eq(assetBookings.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();