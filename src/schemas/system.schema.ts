import { z } from 'zod';

export const systemSchema = z.object({
  panel_id: z.number({ required_error: 'Panel requerido' }),
  panel_power: z.number(),
  panel_qty: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().int('Debe ser un número entero').min(1, 'Mínimo 1 panel')
  ),
  system_capacity: z.number().min(0.1, 'Capacidad mínima 0.1 kW'),
  inverter_id: z.number({ required_error: 'Inversor requerido' }),
  array_type: z.number().min(0).max(4),
  tilt: z.number().min(0).max(90),
  azimuth: z.number().min(0).max(359),
  losses: z.number().min(-5).max(99),
  inverter_qty: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().int('Debe ser un número entero').min(1, 'Mínimo 1 inversor')
  ),
});
