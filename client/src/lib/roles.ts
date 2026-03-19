/** Numeric role IDs as stored in the database `roles` table. */
export const ROLE_IDS = {
  ADMIN: 1,
  /** Incubatee = Startup Founder – both refer to role_id 2. */
  INCUBATEE: 2,
  STARTUP_FOUNDER: 2,
  MENTOR: 3,
  INVESTOR: 4,
} as const;
