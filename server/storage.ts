import { lawyers, type Lawyer, type InsertLawyer, type PracticeArea, type ExperienceLevel, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lawyer operations
  getAllLawyers(): Promise<Lawyer[]>;
  getLawyer(id: number): Promise<Lawyer | undefined>;
  createLawyer(lawyer: InsertLawyer): Promise<Lawyer>;
  updateLawyer(id: number, lawyer: Partial<InsertLawyer>): Promise<Lawyer | undefined>;
  deleteLawyer(id: number): Promise<boolean>;
  
  // Filtering operations
  getLawyersByPracticeArea(practiceArea: PracticeArea): Promise<Lawyer[]>;
  getLawyersByRating(minRating: number): Promise<Lawyer[]>;
  getLawyersByPriceRange(minPrice: number, maxPrice: number): Promise<Lawyer[]>;
  getLawyersByExperienceLevel(experienceLevel: ExperienceLevel): Promise<Lawyer[]>;
  getAvailableLawyers(): Promise<Lawyer[]>;
  getFeaturedLawyers(): Promise<Lawyer[]>;
  searchLawyers(query: string): Promise<Lawyer[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lawyers: Map<number, Lawyer>;
  currentUserId: number;
  currentLawyerId: number;

  constructor() {
    this.users = new Map();
    this.lawyers = new Map();
    this.currentUserId = 1;
    this.currentLawyerId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Lawyer methods
  async getAllLawyers(): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values());
  }

  async getLawyer(id: number): Promise<Lawyer | undefined> {
    return this.lawyers.get(id);
  }

  async createLawyer(insertLawyer: InsertLawyer): Promise<Lawyer> {
    const id = this.currentLawyerId++;
    const lawyer: Lawyer = { ...insertLawyer, id };
    this.lawyers.set(id, lawyer);
    return lawyer;
  }

  async updateLawyer(id: number, lawyerUpdate: Partial<InsertLawyer>): Promise<Lawyer | undefined> {
    const existingLawyer = this.lawyers.get(id);
    if (!existingLawyer) return undefined;
    
    const updatedLawyer = { ...existingLawyer, ...lawyerUpdate };
    this.lawyers.set(id, updatedLawyer);
    return updatedLawyer;
  }

  async deleteLawyer(id: number): Promise<boolean> {
    return this.lawyers.delete(id);
  }

  // Filtering methods
  async getLawyersByPracticeArea(practiceArea: PracticeArea): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.practiceAreas.includes(practiceArea)
    );
  }

  async getLawyersByRating(minRating: number): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.rating >= minRating
    );
  }

  async getLawyersByPriceRange(minPrice: number, maxPrice: number): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.hourlyRate >= minPrice && lawyer.hourlyRate <= maxPrice
    );
  }

  async getLawyersByExperienceLevel(experienceLevel: ExperienceLevel): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.experienceLevel === experienceLevel
    );
  }

  async getAvailableLawyers(): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.availableForConsultation
    );
  }

  async getFeaturedLawyers(): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.featured
    );
  }

  async searchLawyers(query: string): Promise<Lawyer[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.lawyers.values()).filter(lawyer => 
      lawyer.name.toLowerCase().includes(lowercaseQuery) ||
      lawyer.location.toLowerCase().includes(lowercaseQuery) ||
      lawyer.bio.toLowerCase().includes(lowercaseQuery) ||
      lawyer.practiceAreas.some(area => area.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const storage = new MemStorage();
