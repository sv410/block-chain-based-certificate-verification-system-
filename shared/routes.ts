import { z } from 'zod';
import { insertCertificateSchema, certificates } from './schema';

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
  certificates: {
    list: {
      method: 'GET' as const,
      path: '/api/certificates' as const,
      responses: {
        200: z.array(z.custom<typeof certificates.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/certificates/:hash' as const,
      responses: {
        200: z.custom<typeof certificates.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/certificates' as const,
      input: insertCertificateSchema,
      responses: {
        201: z.custom<typeof certificates.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/certificates/verify' as const,
      input: z.object({ hash: z.string() }),
      responses: {
        200: z.object({
          valid: z.boolean(),
          certificate: z.custom<typeof certificates.$inferSelect>().optional(),
          message: z.string()
        }),
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
