import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parametersSchema } from '../../schemas/parameters.schema';
import { z } from 'zod';
import Grid from '@mui/material/Grid';
import { TextField, Button, MenuItem, Collapse, Tooltip, Switch, FormControlLabel } from '@mui/material';

const moduleTypes = [
  { id: 0, name: 'Standard' },
  { id: 1, name: 'Premium' },
  { id: 2, name: 'Thin film' },
];
const arrayTypes = [
  { id: 0, name: 'Fixed - Open Rack' },
  { id: 1, name: 'Fixed - Roof Mounted' },
  { id: 2, name: '1-Axis' },
  { id: 3, name: '1-Axis Backtracking' },
  { id: 4, name: '2-Axis' },
];

type ParametersForm = z.infer<typeof parametersSchema>;

const defaultValues: ParametersForm = {
  format: 'json',
  module_type: 0,
  array_type: 1,
  tilt: 20,
  azimuth: 180,
  losses: 14,
  // opcionales
  dataset: undefined,
  radius: undefined,
  timeframe: undefined,
  dc_ac_ratio: 1.2,
  gcr: 0.4,
  bifaciality: undefined,
  albedo: undefined,
  use_wf_albedo: undefined,
  soiling: undefined,
  callback: undefined,
};

interface ParametersTabProps {
  onChange?: (data: any) => void;
}

const ParametersTab: React.FC<ParametersTabProps> = ({ onChange }) => {
  const [showOptional, setShowOptional] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ParametersForm>({
    resolver: zodResolver(parametersSchema),
    defaultValues,
  });

  const onSubmit = (data: ParametersForm) => {
    if (onChange) onChange(data);
  };

  React.useEffect(() => {
    const subscription = watch((data) => {
      if (onChange) onChange(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item columns={{ xs: 12, sm: 6 }}>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Formato" fullWidth>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="xml">XML</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="module_type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Tipo de módulo" fullWidth>
                {moduleTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="array_type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Tipo de arreglo" fullWidth>
                {arrayTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="tilt"
            control={control}
            render={({ field }) => (
              <Tooltip title="Inclinación (0-90)">
                <TextField
                  {...field}
                  label="Inclinación (°)"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, max: 90 }}
                  error={!!errors.tilt}
                  helperText={errors.tilt?.message}
                />
              </Tooltip>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="azimuth"
            control={control}
            render={({ field }) => (
              <Tooltip title="Azimut (0-359)">
                <TextField
                  {...field}
                  label="Azimut (°)"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, max: 359 }}
                  error={!!errors.azimuth}
                  helperText={errors.azimuth?.message}
                />
              </Tooltip>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="losses"
            control={control}
            render={({ field }) => (
              <Tooltip title="Pérdidas (-5 a 99)">
                <TextField
                  {...field}
                  label="Pérdidas (%)"
                  type="number"
                  fullWidth
                  inputProps={{ min: -5, max: 99 }}
                  error={!!errors.losses}
                  helperText={errors.losses?.message}
                />
              </Tooltip>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={() => setShowOptional((v) => !v)} sx={{ mb: 2 }}>
            {showOptional ? 'Ocultar parámetros opcionales' : 'Mostrar parámetros opcionales'}
          </Button>
        </Grid>
        <Collapse in={showOptional} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item columns={{ xs: 12, sm: 6 }}>
              <Controller
                name="dataset"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Dataset" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="radius"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Radio (km)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                    error={!!errors.radius}
                    helperText={errors.radius?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="timeframe"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Timeframe" fullWidth>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dc_ac_ratio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="DC/AC Ratio"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0.3, max: 2.0, step: 0.01 }}
                    error={!!errors.dc_ac_ratio}
                    helperText={errors.dc_ac_ratio?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="gcr"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="GCR"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0.01, max: 0.99, step: 0.01 }}
                    error={!!errors.gcr}
                    helperText={errors.gcr?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="bifaciality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bifacialidad"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                    error={!!errors.bifaciality}
                    helperText={errors.bifaciality?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="albedo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Albedo"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                    error={!!errors.albedo}
                    helperText={errors.albedo?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="use_wf_albedo"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={!!field.value} />}
                    label="Usar WF Albedo"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="soiling"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Soiling (%)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    error={!!errors.soiling}
                    helperText={errors.soiling?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="callback"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Callback" fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </Collapse>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Validar parámetros
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ParametersTab;
