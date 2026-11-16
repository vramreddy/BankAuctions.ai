import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const checkerCorrectionSchema = z.object({
  decision: z.enum(['VERIFIED', 'CORRECTED', 'REJECTED']),
  correctionNotes: z.string().optional(),
  corrections: z.record(z.any()).optional()
});

export const inspectionSubmissionSchema = z.object({
  occupancyStatus: z.string().min(1, 'Occupancy status is required'),
  accessRoadType: z.string().min(1, 'Access road type is required'),
  boundaryMatches: z.boolean(),
  propertyCondition: z.string().min(1, 'Property condition is required'),
  utilitiesObserved: z.array(z.string()).default([]),
  litigationObserved: z.string().default('None seen'),
  engineerValuationEstimate: z.number().positive('Estimated market value must be positive'),
  engineerNotes: z.string().min(5, 'Detailed notes are required for buyer intelligence'),
  gpsCoordinates: z.string().regex(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/, 'Valid GPS coordinates required (lat, lng)'),
  landmarkName: z.string().min(2, 'Nearest landmark name is required'),
  landmarkDistanceKm: z.number().nonnegative('Landmark distance must be zero or positive'),
  photos: z.array(z.string()).min(3, 'At least 3 physical inspection photographs are required')
});
