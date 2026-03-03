import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  courseName: text("course_name").notNull(),
  issuedBy: text("issued_by").notNull(),
  issueDate: timestamp("issue_date").defaultNow(),
  txHash: text("tx_hash").notNull(),
  certificateHash: text("certificate_hash").notNull().unique(),
  isRevoked: boolean("is_revoked").default(false).notNull(),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({ 
  id: true, 
  issueDate: true,
  txHash: true,
  certificateHash: true
});

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
