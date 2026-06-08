import { db } from "./db";
import {
  users, startups, startupProfiles, applications,
  evaluationCriteria, scorecards, scorecardParameters, judges, mentorAssignments,
  fundings, knowledgeBase, roles, physicalAssets, assetBookings,
  startupRevenueDetails, startupTrainingFees, startupConsultancyFees, 
  startupRegistrationFees, startupMonthlyCollections,
  type User, type Startup, type StartupProfile, type Application, type Scorecard,
  type ScorecardParameter, type Judge,
  type MentorAssignment, type Funding, type KnowledgeBaseArticle, type Role,
  type EvaluationCriteria, type PhysicalAsset, type AssetBooking,
  type StartupRevenueDetails, type StartupTrainingFees, type StartupConsultancyFees,
  type StartupRegistrationFees, type StartupMonthlyCollections,
} from "@shared/schema";
import { eq, inArray, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<{ name: string; roleId: number }>): Promise<User | undefined>;

  // Roles
  getRoles(): Promise<Role[]>;

  // Judges
  getJudges(): Promise<Judge[]>;
  getJudge(id: number): Promise<Judge | undefined>;
  createJudge(judge: any): Promise<Judge>;
  updateJudge(id: number, updates: any): Promise<Judge | undefined>;

  // Startups
  getStartups(): Promise<Startup[]>;
  getSelectedStartups(): Promise<Startup[]>;
  getStartup(id: number): Promise<Startup | undefined>;
  getStartupByUserId(userId: number): Promise<Startup | undefined>;
  createStartup(startup: any): Promise<Startup>;
  updateStartup(id: number, startup: any): Promise<Startup | undefined>;

  // Startup Profiles
  getStartupProfileByStartupId(startupId: number): Promise<StartupProfile | undefined>;
  upsertStartupProfileByStartupId(startupId: number, data: any): Promise<StartupProfile>;

  // Applications
  getApplications(): Promise<Application[]>;
  getApplicationsByEmail(email: string): Promise<Application[]>;
  createApplication(application: any): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;

  // Scorecards
  getScorecards(): Promise<Scorecard[]>;
  getScorecard(id: number): Promise<Scorecard | undefined>;
  createScorecard(scorecard: any): Promise<Scorecard>;
  updateScorecard(id: number, updates: any): Promise<Scorecard | undefined>;
  deleteScorecard(id: number): Promise<void>;

  // Scorecard Parameters
  getScorecardParameters(scorecardId: number): Promise<ScorecardParameter[]>;
  upsertScorecardParameter(scorecardId: number, parameterName: string, marks: number | null, maxMarks: number): Promise<ScorecardParameter>;

  // Mentor Assignments
  getMentorAssignments(): Promise<MentorAssignment[]>;
  getMentorAssignmentByStartupId(startupId: number): Promise<MentorAssignment | undefined>;
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

  // Revenue Details (Part A - Incubation Charges)
  getRevenueDetailsByStartupId(startupId: number): Promise<StartupRevenueDetails | undefined>;
  upsertRevenueDetails(startupId: number, data: any): Promise<StartupRevenueDetails>;

  // Training Fees (Part B)
  getTrainingFeesByStartupId(startupId: number): Promise<StartupTrainingFees[]>;
  createTrainingFee(fee: any): Promise<StartupTrainingFees>;
  deleteTrainingFee(id: number): Promise<void>;

  // Consultancy Fees (Part C)
  getConsultancyFeesByStartupId(startupId: number): Promise<StartupConsultancyFees[]>;
  createConsultancyFee(fee: any): Promise<StartupConsultancyFees>;
  deleteConsultancyFee(id: number): Promise<void>;

  // Registration Fees (Part D)
  getRegistrationFeesByStartupId(startupId: number): Promise<StartupRegistrationFees[]>;
  createRegistrationFee(fee: any): Promise<StartupRegistrationFees>;
  deleteRegistrationFee(id: number): Promise<void>;

  // Monthly Collections
  getMonthlyCollectionsByStartup(startupId: number, financialYear?: string, month?: string): Promise<StartupMonthlyCollections[]>;
  getMonthlyCollection(startupId: number, financialYear: string, month: string): Promise<StartupMonthlyCollections | undefined>;
  upsertMonthlyCollection(startupId: number, financialYear: string, month: string, data: any): Promise<StartupMonthlyCollections>;
  deleteMonthlyCollection(id: number): Promise<void>;
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
  async updateUser(id: number, updates: Partial<{ name: string; roleId: number }>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async getJudges(): Promise<Judge[]> {
    return await db.select().from(judges);
  }
  async getJudge(id: number): Promise<Judge | undefined> {
    const [judge] = await db.select().from(judges).where(eq(judges.id, id));
    return judge;
  }
  async createJudge(judge: any): Promise<Judge> {
    const [newJudge] = await db.insert(judges).values(judge).returning();
    return newJudge;
  }
  async updateJudge(id: number, updates: any): Promise<Judge | undefined> {
    const [updated] = await db.update(judges).set(updates).where(eq(judges.id, id)).returning();
    return updated;
  }

  async getStartups(): Promise<Startup[]> {
    return await db.select().from(startups);
  }

  async getSelectedStartups(): Promise<Startup[]> {
    // Only return startups that have at least one "Selected" application
    const selectedApps = await db
      .select({ startupId: applications.startupId })
      .from(applications)
      .where(eq(applications.status, "Selected"));
    const ids = Array.from(new Set(selectedApps.map((a) => a.startupId)));
    if (ids.length === 0) return [];
    return await db.select().from(startups).where(inArray(startups.id, ids));
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

  async getStartupByUserId(userId: number): Promise<Startup | undefined> {
    const [startup] = await db.select().from(startups).where(eq(startups.userId, userId));
    return startup;
  }

  async getStartupProfileByStartupId(startupId: number): Promise<StartupProfile | undefined> {
    const [profile] = await db
      .select()
      .from(startupProfiles)
      .where(eq(startupProfiles.startupId, startupId));
    return profile;
  }

  async upsertStartupProfileByStartupId(startupId: number, data: any): Promise<StartupProfile> {
    const existing = await this.getStartupProfileByStartupId(startupId);
    if (existing) {
      const [updated] = await db
        .update(startupProfiles)
        .set(data)
        .where(eq(startupProfiles.startupId, startupId))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(startupProfiles)
      .values({ startupId, ...data })
      .returning();
    return created;
  }
async getStartupById(id: number) {
  const [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.id, id));

  return startup;
}

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  async getApplicationsByEmail(email: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.email, email));
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
  async updateScorecard(id: number, updates: any): Promise<Scorecard | undefined> {
    const [updated] = await db.update(scorecards).set({ ...updates, updatedAt: new Date() }).where(eq(scorecards.id, id)).returning();
    return updated;
  }
  async deleteScorecard(id: number): Promise<void> {
    await db.delete(scorecardParameters).where(eq(scorecardParameters.scorecardId, id));
    await db.delete(scorecards).where(eq(scorecards.id, id));
  }

  async getScorecardParameters(scorecardId: number): Promise<ScorecardParameter[]> {
    return await db.select().from(scorecardParameters).where(eq(scorecardParameters.scorecardId, scorecardId));
  }
  async upsertScorecardParameter(scorecardId: number, parameterName: string, marks: number | null, maxMarks: number): Promise<ScorecardParameter> {
    const existing = await db.select().from(scorecardParameters)
      .where(eq(scorecardParameters.scorecardId, scorecardId));
    const found = existing.find(p => p.parameterName === parameterName);
    if (found) {
      const [updated] = await db.update(scorecardParameters)
        .set({ marks, maxMarks })
        .where(eq(scorecardParameters.id, found.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(scorecardParameters)
      .values({ scorecardId, parameterName, marks, maxMarks })
      .returning();
    return created;
  }

  async getMentorAssignments(): Promise<MentorAssignment[]> {
    return await db.select().from(mentorAssignments);
  }

  async getMentorAssignmentByStartupId(startupId: number): Promise<MentorAssignment | undefined> {
    const [assignment] = await db
      .select()
      .from(mentorAssignments)
      .where(eq(mentorAssignments.startupId, startupId));
    return assignment;
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

  // Revenue Details (Part A - Incubation Charges)
  async getRevenueDetailsByStartupId(startupId: number): Promise<StartupRevenueDetails | undefined> {
    const [details] = await db.select().from(startupRevenueDetails).where(eq(startupRevenueDetails.startupId, startupId));
    return details;
  }

  async upsertRevenueDetails(startupId: number, data: any): Promise<StartupRevenueDetails> {
    const existing = await this.getRevenueDetailsByStartupId(startupId);
    if (existing) {
      const [updated] = await db
        .update(startupRevenueDetails)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(startupRevenueDetails.startupId, startupId))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(startupRevenueDetails)
      .values({ startupId, ...data })
      .returning();
    return created;
  }

  // Training Fees (Part B)
  async getTrainingFeesByStartupId(startupId: number): Promise<StartupTrainingFees[]> {
    return await db.select().from(startupTrainingFees).where(eq(startupTrainingFees.startupId, startupId));
  }

  async createTrainingFee(fee: any): Promise<StartupTrainingFees> {
    const [newFee] = await db.insert(startupTrainingFees).values(fee).returning();
    return newFee;
  }

  async deleteTrainingFee(id: number): Promise<void> {
    await db.delete(startupTrainingFees).where(eq(startupTrainingFees.id, id));
  }

  // Consultancy Fees (Part C)
  async getConsultancyFeesByStartupId(startupId: number): Promise<StartupConsultancyFees[]> {
    return await db.select().from(startupConsultancyFees).where(eq(startupConsultancyFees.startupId, startupId));
  }

  async createConsultancyFee(fee: any): Promise<StartupConsultancyFees> {
    const [newFee] = await db.insert(startupConsultancyFees).values(fee).returning();
    return newFee;
  }

  async deleteConsultancyFee(id: number): Promise<void> {
    await db.delete(startupConsultancyFees).where(eq(startupConsultancyFees.id, id));
  }

  // Registration Fees (Part D)
  async getRegistrationFeesByStartupId(startupId: number): Promise<StartupRegistrationFees[]> {
    return await db.select().from(startupRegistrationFees).where(eq(startupRegistrationFees.startupId, startupId));
  }

  async createRegistrationFee(fee: any): Promise<StartupRegistrationFees> {
    const [newFee] = await db.insert(startupRegistrationFees).values(fee).returning();
    return newFee;
  }

  async deleteRegistrationFee(id: number): Promise<void> {
    await db.delete(startupRegistrationFees).where(eq(startupRegistrationFees.id, id));
  }

  // Monthly Collections
  async getMonthlyCollectionsByStartup(startupId: number, financialYear?: string, month?: string): Promise<StartupMonthlyCollections[]> {
    let query = db.select().from(startupMonthlyCollections).where(eq(startupMonthlyCollections.startupId, startupId));
    
    if (financialYear) {
      query = query.where(eq(startupMonthlyCollections.financialYear, financialYear));
    }
    
    if (month) {
      query = query.where(eq(startupMonthlyCollections.month, month));
    }
    
    return await query;
  }

  async getMonthlyCollection(startupId: number, financialYear: string, month: string): Promise<StartupMonthlyCollections | undefined> {
    const [collection] = await db
      .select()
      .from(startupMonthlyCollections)
      .where(
        and(
          eq(startupMonthlyCollections.startupId, startupId),
          eq(startupMonthlyCollections.financialYear, financialYear),
          eq(startupMonthlyCollections.month, month)
        )
      );
    return collection;
  }

  async upsertMonthlyCollection(startupId: number, financialYear: string, month: string, data: any): Promise<StartupMonthlyCollections> {
    const existing = await this.getMonthlyCollection(startupId, financialYear, month);
    if (existing) {
      const [updated] = await db
        .update(startupMonthlyCollections)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(startupMonthlyCollections.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(startupMonthlyCollections)
      .values({ startupId, financialYear, month, ...data })
      .returning();
    return created;
  }

  async deleteMonthlyCollection(id: number): Promise<void> {
    await db.delete(startupMonthlyCollections).where(eq(startupMonthlyCollections.id, id));
  }
}

export const storage = new DatabaseStorage();