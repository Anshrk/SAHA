import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const practiceAreaEnum = z.enum([
  "family_law",
  "criminal_defense",
  "immigration_law",
  "personal_injury",
  "estate_planning",
  "tax_law",
  "employment_law",
  "business_law",
  "intellectual_property",
  "real_estate_law"
]);

export type PracticeArea = z.infer<typeof practiceAreaEnum>;

export const experienceLevelEnum = z.enum([
  "junior",
  "mid",
  "senior"
]);

export type ExperienceLevel = z.infer<typeof experienceLevelEnum>;

export const lawyers = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profileImage: text("profile_image").notNull(),
  bio: text("bio").notNull(),
  practiceAreas: text("practice_areas").array().notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  location: text("location").notNull(),
  experienceLevel: text("experience_level").notNull(),
  availableForConsultation: boolean("available_for_consultation").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  address: text("address").notNull(),
});

export const insertLawyerSchema = createInsertSchema(lawyers).omit({ id: true });

export type InsertLawyer = z.infer<typeof insertLawyerSchema>;
export type Lawyer = typeof lawyers.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
