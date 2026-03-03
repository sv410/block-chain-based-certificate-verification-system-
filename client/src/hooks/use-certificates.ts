import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertCertificate } from "@shared/routes";
import { z } from "zod";

// Helper to safely parse and log Zod errors
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCertificates() {
  return useQuery({
    queryKey: [api.certificates.list.path],
    queryFn: async () => {
      const res = await fetch(api.certificates.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      return parseWithLogging(api.certificates.list.responses[200], data, "certificates.list");
    },
  });
}

export function useCertificate(hash: string) {
  return useQuery({
    queryKey: [api.certificates.get.path, hash],
    queryFn: async () => {
      // Build URL substituting :hash with the actual hash
      const url = api.certificates.get.path.replace(':hash', encodeURIComponent(hash));
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch certificate');
      const data = await res.json();
      return parseWithLogging(api.certificates.get.responses[200], data, "certificates.get");
    },
    enabled: !!hash, // Only run if hash is provided
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCertificate) => {
      const validated = api.certificates.create.input.parse(data);
      const res = await fetch(api.certificates.create.path, {
        method: api.certificates.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.certificates.create.responses[400].parse(responseData);
          throw new Error(error.message);
        }
        throw new Error('Failed to create certificate');
      }
      
      return parseWithLogging(api.certificates.create.responses[201], responseData, "certificates.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.certificates.list.path] });
    },
  });
}

export function useVerifyCertificate() {
  return useMutation({
    mutationFn: async (hash: string) => {
      const validated = api.certificates.verify.input.parse({ hash });
      const res = await fetch(api.certificates.verify.path, {
        method: api.certificates.verify.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        if (res.status === 404) {
          const error = api.certificates.verify.responses[404].parse(responseData);
          throw new Error(error.message);
        }
        throw new Error('Failed to verify certificate');
      }
      
      return parseWithLogging(api.certificates.verify.responses[200], responseData, "certificates.verify");
    },
  });
}
