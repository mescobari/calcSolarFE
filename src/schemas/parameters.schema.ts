import { z } from 'zod';

export const parametersSchema = z.object({
  format: z.enum(['json', 'xml']),
  module_type: z.enum(['0', '1', '2']).transform(Number), // 0: Standard, 1: Premium, 2: Thin film
  array_type: z.number().min(0).max(4),
  tilt: z.number().min(0).max(90),
  azimuth: z.number().min(0).max(359),
  losses: z.number().min(-5).max(99),
  // Opcionales
  dataset: z.string().optional(),
  radius: z.number().min(0).max(100).optional(),
  timeframe: z.enum(['hourly', 'monthly']).optional(),
  dc_ac_ratio: z.number().min(0.3).max(2.0).optional(),
  gcr: z.number().min(0.01).max(0.99).optional(),
  bifaciality: z.number().min(0).max(1).optional(),
  albedo: z.number().min(0).max(1).optional(),
  use_wf_albedo: z.boolean().optional(),
  soiling: z.number().min(0).max(100).optional(),
  callback: z.string().optional(),
});
