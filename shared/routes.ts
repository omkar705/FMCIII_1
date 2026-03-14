import { z } from 'zod';
import { 
  insertUserSchema, users,
  insertStartupSchema, startups,
  insertApplicationSchema, applications,
  insertScorecardSchema, scorecards,
  insertMentorAssignmentSchema, mentorAssignments,
  insertFundingSchema, fundings,
  insertKnowledgeBaseSchema, knowledgeBase,
  roles, evaluationCriteria,
  insertPhysicalAssetSchema, physicalAssets,
  insertAssetBookingSchema, assetBookings,
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.object({ user: z.custom<typeof users.$inferSelect>(), token: z.string() }),
        401: errorSchemas.validation,
      }
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.object({ user: z.custom<typeof users.$inferSelect>(), token: z.string() }),
        400: errorSchemas.validation,
      }
    },
    profile: {
      method: 'GET' as const,
      path: '/api/auth/profile' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.validation,
      }
    }
  },
  startups: {
    list: {
      method: 'GET' as const,
      path: '/api/startups' as const,
      responses: {
        200: z.array(z.custom<typeof startups.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/startups/:id' as const,
      responses: {
        200: z.custom<typeof startups.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/startups' as const,
      input: insertStartupSchema,
      responses: {
        201: z.custom<typeof startups.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/startups/:id' as const,
      input: insertStartupSchema.partial(),
      responses: {
        200: z.custom<typeof startups.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  applications: {
    list: {
      method: 'GET' as const,
      path: '/api/applications' as const,
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/applications' as const,
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/applications/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    }
  },
  scorecards: {
    list: {
      method: 'GET' as const,
      path: '/api/scorecards' as const,
      responses: {
        200: z.array(z.custom<typeof scorecards.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/scorecards' as const,
      input: insertScorecardSchema,
      responses: {
        201: z.custom<typeof scorecards.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  mentorAssignments: {
    list: {
      method: 'GET' as const,
      path: '/api/mentor-assignments' as const,
      responses: {
        200: z.array(z.custom<typeof mentorAssignments.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/mentor-assignments' as const,
      input: insertMentorAssignmentSchema,
      responses: {
        201: z.custom<typeof mentorAssignments.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  funding: {
    list: {
      method: 'GET' as const,
      path: '/api/funding' as const,
      responses: {
        200: z.array(z.custom<typeof fundings.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/funding' as const,
      input: insertFundingSchema,
      responses: {
        201: z.custom<typeof fundings.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  knowledgeBase: {
    list: {
      method: 'GET' as const,
      path: '/api/knowledge-base' as const,
      responses: {
        200: z.array(z.custom<typeof knowledgeBase.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/knowledge-base' as const,
      input: insertKnowledgeBaseSchema,
      responses: {
        201: z.custom<typeof knowledgeBase.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  roles: {
    list: {
      method: 'GET' as const,
      path: '/api/roles' as const,
      responses: {
        200: z.array(z.custom<typeof roles.$inferSelect>()),
      }
    }
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      }
    }
  },
  physicalAssets: {
    list: {
      method: 'GET' as const,
      path: '/api/assets' as const,
      responses: {
        200: z.array(z.custom<typeof physicalAssets.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/assets' as const,
      input: insertPhysicalAssetSchema,
      responses: {
        201: z.custom<typeof physicalAssets.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  assetBookings: {
    list: {
      method: 'GET' as const,
      path: '/api/bookings' as const,
      responses: {
        200: z.array(z.custom<typeof assetBookings.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/bookings' as const,
      input: insertAssetBookingSchema,
      responses: {
        201: z.custom<typeof assetBookings.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/bookings/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}