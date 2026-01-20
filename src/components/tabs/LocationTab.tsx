import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSchema } from '../../schemas/solarRequest.schema';
import { z } from 'zod';
import Grid from '@mui/material/Grid';
import { TextField, Button, Alert, Tooltip } from '@mui/material';

interface LocationTabProps {
  onChange?: (data: any) => void;
  defaultValues?: any;
}

const LocationTab: React.FC<LocationTabProps> = ({ onChange, defaultValues }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: defaultValues || {
      address: '',
      lat: undefined,
      lon: undefined,
      file_id: '',
    },
  });

  const onSubmit = (data: z.infer<typeof locationSchema>) => {
    if (onChange) onChange(data);
  };

  const lat = watch('lat');
  const lon = watch('lon');
  const file_id = watch('file_id');

  React.useEffect(() => {
    const subscription = watch((data) => {
      if (onChange) onChange(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tooltip title="Opcional, solo informativo">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Dirección del inmueble" fullWidth />
              )}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={6}>
          <Tooltip title="Latitud (-90 a 90)">
            <Controller
              name="lat"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Latitud"
                  type="number"
                  fullWidth
                  error={!!errors.lat}
                  helperText={errors.lat?.message}
                  inputProps={{ min: -90, max: 90, step: 0.1 }}
                />
              )}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={6}>
          <Tooltip title="Longitud (-180 a 180)">
            <Controller
              name="lon"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Longitud"
                  type="number"
                  fullWidth
                  error={!!errors.lon}
                  helperText={errors.lon?.message}
                  inputProps={{ min: -180, max: 180, step: 0.1 }}
                />
              )}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Opcional. Si se ingresa, lat/lon no son obligatorios">
            <Controller
              name="file_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="file_id"
                  fullWidth
                  error={!!errors.file_id}
                  helperText={errors.file_id?.message}
                />
              )}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          {errors.root && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Validar ubicación
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LocationTab;
