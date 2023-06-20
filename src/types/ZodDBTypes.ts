import { z } from "zod";

export const ZMeasurementProgramStep = z.object({
  programId: z.coerce.number().int(),
  name: z.coerce.string(),
  description: z.coerce.string().optional(),
  order: z.coerce.number().int(),
  targetValue: z.coerce.number(),
  usl: z.coerce.number(),
  lsl: z.coerce.number(),
  measurementUnitId: z.coerce.number().int(),
  instrumentId: z.coerce.number().int(),
});

export const ZInstrument = z.object({
  name: z.coerce.string(),
  manufacturer: z.coerce.string(),
  model: z.coerce.string(),
  serialNumber: z.coerce.string(),
  verificationDate: z.coerce.string(),
  verificationDueDate: z.coerce.string(),
  calibrationDate: z.coerce.string(),
  upperLimit: z.coerce.number(),
  lowerLimit: z.coerce.number(),
  resolution: z.coerce.number(),
  accuracy: z.coerce.number(),
  measurementUnitId: z.coerce.number().int(),
  location: z.coerce.string(),
  notes: z.coerce.string().nullable(),
});

export const ZMeasurementStep = z.object({})