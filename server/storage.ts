import { certificates, type InsertCertificate, type Certificate } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  getCertificates(): Promise<Certificate[]>;
  getCertificateByHash(hash: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
}

export class DatabaseStorage implements IStorage {
  async getCertificates(): Promise<Certificate[]> {
    return await db.select().from(certificates);
  }

  async getCertificateByHash(hash: string): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates).where(eq(certificates.certificateHash, hash));
    return certificate;
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    // Generate simulated blockchain data
    const txHash = "0x" + crypto.randomBytes(32).toString("hex");
    
    // Create a deterministic hash for the certificate based on its contents and timestamp
    const timestamp = new Date().getTime();
    const dataToHash = `${insertCertificate.studentName}-${insertCertificate.courseName}-${insertCertificate.issuedBy}-${timestamp}`;
    const certificateHash = crypto.createHash("sha256").update(dataToHash).digest("hex");

    const [certificate] = await db.insert(certificates)
      .values({
        ...insertCertificate,
        txHash,
        certificateHash,
      })
      .returning();
      
    return certificate;
  }
}

export const storage = new DatabaseStorage();
