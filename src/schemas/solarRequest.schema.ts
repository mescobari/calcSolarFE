import { z } from 'zod';

export const locationSchema = z.object({
  address: z.string().optional(),
  lat: z
    .preprocess(
      (val) => (val === '' || val === undefined ? undefined : Number(val)),
      z
        .number({ invalid_type_error: 'La latitud debe ser un número' })
        .min(-90, 'La latitud mínima es -90')
        .max(90, 'La latitud máxima es 90')
        .optional()
    ),
  lon: z
    .preprocess(
      (val) => (val === '' || val === undefined ? undefined : Number(val)),
      z
        .number({ invalid_type_error: 'La longitud debe ser un número' })
        .min(-180, 'La longitud mínima es -180')
        .max(180, 'La longitud máxima es 180')
        .optional()
    ),
  file_id: z.string().optional(),
}).refine(
  (data) =>
    (data.file_id && (data.lat === undefined || data.lon === undefined)) ||
    (!data.file_id && data.lat !== undefined && data.lon !== undefined),
  {
    message: 'Debe ingresar file_id o ambos campos de latitud y longitud',
    path: ['file_id', 'lat', 'lon'],
  }
);

export const solarRequestSchema = z.object({
  // ...agregar el resto de campos en siguientes iteraciones
  // location: locationSchema,
});
