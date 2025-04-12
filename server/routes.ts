import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { lawyerData } from "../client/src/lib/lawyer-data";
import { practiceAreaEnum, experienceLevelEnum } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed database with initial lawyer data
  await seedLawyerData();
  
  // Get all lawyers
  app.get('/api/lawyers', async (_req: Request, res: Response) => {
    try {
      const lawyers = await storage.getAllLawyers();
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve lawyers" });
    }
  });

  // Get a specific lawyer by ID
  app.get('/api/lawyers/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid lawyer ID" });
      }
      
      const lawyer = await storage.getLawyer(id);
      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }
      
      res.json(lawyer);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve lawyer" });
    }
  });

  // Filter lawyers by practice area
  app.get('/api/lawyers/practice/:practiceArea', async (req: Request, res: Response) => {
    try {
      const practiceAreaResult = practiceAreaEnum.safeParse(req.params.practiceArea);
      if (!practiceAreaResult.success) {
        return res.status(400).json({ message: "Invalid practice area" });
      }
      
      const lawyers = await storage.getLawyersByPracticeArea(practiceAreaResult.data);
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter lawyers by practice area" });
    }
  });

  // Filter lawyers by minimum rating
  app.get('/api/lawyers/rating/:minRating', async (req: Request, res: Response) => {
    try {
      const minRating = parseFloat(req.params.minRating);
      if (isNaN(minRating) || minRating < 1 || minRating > 5) {
        return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5" });
      }
      
      const lawyers = await storage.getLawyersByRating(minRating);
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter lawyers by rating" });
    }
  });

  // Filter lawyers by price range
  app.get('/api/lawyers/price', async (req: Request, res: Response) => {
    try {
      const minPrice = req.query.min ? parseInt(req.query.min as string) : 0;
      const maxPrice = req.query.max ? parseInt(req.query.max as string) : 500;
      
      if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice <= 0 || minPrice > maxPrice) {
        return res.status(400).json({ message: "Invalid price range" });
      }
      
      const lawyers = await storage.getLawyersByPriceRange(minPrice, maxPrice);
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter lawyers by price range" });
    }
  });

  // Filter lawyers by experience level
  app.get('/api/lawyers/experience/:level', async (req: Request, res: Response) => {
    try {
      const experienceLevelResult = experienceLevelEnum.safeParse(req.params.level);
      if (!experienceLevelResult.success) {
        return res.status(400).json({ message: "Invalid experience level" });
      }
      
      const lawyers = await storage.getLawyersByExperienceLevel(experienceLevelResult.data);
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter lawyers by experience level" });
    }
  });

  // Get available lawyers for consultation
  app.get('/api/lawyers/available', async (_req: Request, res: Response) => {
    try {
      const lawyers = await storage.getAvailableLawyers();
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve available lawyers" });
    }
  });

  // Get featured lawyers
  app.get('/api/lawyers/featured', async (_req: Request, res: Response) => {
    try {
      const lawyers = await storage.getFeaturedLawyers();
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve featured lawyers" });
    }
  });

  // Search lawyers
  app.get('/api/lawyers/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim() === '') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const lawyers = await storage.searchLawyers(query);
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search lawyers" });
    }
  });

  // Advanced filtering endpoint with multiple criteria
  app.post('/api/lawyers/filter', async (req: Request, res: Response) => {
    try {
      const filterSchema = z.object({
        practiceAreas: z.array(practiceAreaEnum).optional(),
        minRating: z.number().min(1).max(5).optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        experienceLevels: z.array(experienceLevelEnum).optional(),
        onlyAvailable: z.boolean().optional(),
      });
      
      const filterResult = filterSchema.safeParse(req.body);
      if (!filterResult.success) {
        return res.status(400).json({ message: "Invalid filter criteria", errors: filterResult.error });
      }
      
      const filters = filterResult.data;
      let filteredLawyers = await storage.getAllLawyers();
      
      // Apply filters sequentially
      if (filters.practiceAreas && filters.practiceAreas.length > 0) {
        filteredLawyers = filteredLawyers.filter(lawyer => 
          filters.practiceAreas!.some(area => lawyer.practiceAreas.includes(area))
        );
      }
      
      if (filters.minRating !== undefined) {
        filteredLawyers = filteredLawyers.filter(lawyer => lawyer.rating >= filters.minRating!);
      }
      
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const min = filters.minPrice ?? 0;
        const max = filters.maxPrice ?? Infinity;
        filteredLawyers = filteredLawyers.filter(lawyer => 
          lawyer.hourlyRate >= min && lawyer.hourlyRate <= max
        );
      }
      
      if (filters.experienceLevels && filters.experienceLevels.length > 0) {
        filteredLawyers = filteredLawyers.filter(lawyer => 
          filters.experienceLevels!.includes(lawyer.experienceLevel as any)
        );
      }
      
      if (filters.onlyAvailable) {
        filteredLawyers = filteredLawyers.filter(lawyer => lawyer.availableForConsultation);
      }
      
      res.json(filteredLawyers);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter lawyers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function seedLawyerData() {
  try {
    // Check if lawyers already exist to avoid duplicates on server restart
    const existingLawyers = await storage.getAllLawyers();
    if (existingLawyers.length === 0) {
      for (const lawyer of lawyerData) {
        await storage.createLawyer(lawyer);
      }
      console.log("Lawyer data seeded successfully");
    }
  } catch (error) {
    console.error("Failed to seed lawyer data:", error);
  }
}
