import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database with some example certificates if none exist
  seedDatabase().catch(console.error);

  app.get(api.certificates.list.path, async (_req, res) => {
    const certs = await storage.getCertificates();
    res.status(200).json(certs);
  });

  app.get(api.certificates.get.path, async (req, res) => {
    const cert = await storage.getCertificateByHash(req.params.hash);
    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json(cert);
  });

  app.post(api.certificates.create.path, async (req, res) => {
    try {
      const input = api.certificates.create.input.parse(req.body);
      const cert = await storage.createCertificate(input);
      res.status(201).json(cert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.certificates.verify.path, async (req, res) => {
    try {
      const { hash } = api.certificates.verify.input.parse(req.body);
      const cert = await storage.getCertificateByHash(hash);
      
      if (!cert) {
        return res.status(200).json({
          valid: false,
          message: "No certificate found matching this hash."
        });
      }

      if (cert.isRevoked) {
        return res.status(200).json({
          valid: false,
          certificate: cert,
          message: "This certificate has been revoked."
        });
      }

      return res.status(200).json({
        valid: true,
        certificate: cert,
        message: "Certificate is valid and verified."
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getCertificates();
  if (existing.length === 0) {
    await storage.createCertificate({
      studentName: "Alice Smith",
      courseName: "Blockchain Fundamentals",
      issuedBy: "Web3 Institute"
    });
    await storage.createCertificate({
      studentName: "Bob Jones",
      courseName: "Smart Contract Development",
      issuedBy: "Crypto Academy"
    });
    await storage.createCertificate({
      studentName: "Charlie Brown",
      courseName: "Full Stack Web3",
      issuedBy: "Tech University"
    });
  }
}
