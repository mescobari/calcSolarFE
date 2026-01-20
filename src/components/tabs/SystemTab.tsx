import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { systemSchema } from '../../schemas/system.schema';
import { z } from 'zod';
import Grid from '@mui/material/Grid';
import { TextField, Button, MenuItem, InputAdornment, Tooltip } from '@mui/material';
import panelsData from './panels.json';
import invertersData from './inverters.json';

const arrayTypes = [
  { id: 0, name: 'Fixed - Open Rack' },
  { id: 1, name: 'Fixed - Roof Mounted' },
  { id: 2, name: '1-Axis' },
  { id: 3, name: '1-Axis Backtracking' },
  { id: 4, name: '2-Axis' },
];

type Panel = typeof panelsData[number];
type Inverter = typeof invertersData[number];

type SystemForm = z.infer<typeof systemSchema>;

interface SystemTabProps {
  onChange?: (data: any) => void;
  defaultValues?: any;
}

const SystemTab: React.FC<SystemTabProps> = ({ onChange, defaultValues }) => {
  const [panels] = useState<Panel[]>(panelsData as any);
  const [inverters] = useState<Inverter[]>(invertersData as any);
  const [panelPower, setPanelPower] = useState<number>(panels[0].power);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SystemForm>({
    resolver: zodResolver(systemSchema),
    defaultValues: defaultValues || {
      panel_id: panels[0].id,
      panel_power: panels[0].power,
      panel_qty: 1,
      system_capacity: panels[0].power / 1000,
      inverter_id: inverters[0].id,
      array_type: 0,
      tilt: 20,
      azimuth: 180,
      losses: 14,
      inverter_qty: 1,
    },
  });

  // Actualizar potencia de panel y system_capacity al cambiar panel o cantidad
  const panel_id = watch('panel_id');
  const panel_qty = watch('panel_qty');

  useEffect(() => {
    const selected = panels.find((p) => p.id === panel_id) || panels[0];
    setValue('panel_power', selected.power);
    setPanelPower(selected.power);
    setValue('system_capacity', (selected.power * (panel_qty || 1)) / 1000);
  }, [panel_id, panel_qty, panels, setValue]);

  const onSubmit = (data: SystemForm) => {
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
        <Grid item columns={{ xs: 12, sm: 8 }}>
          <Controller
            name="panel_id"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Modelo de Panel" fullWidth>
                {panels.map((panel) => (
                  <MenuItem key={panel.id} value={panel.id}>
                    {panel.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 4 }}>
          <Controller
            name="panel_qty"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cantidad de paneles"
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                error={!!errors.panel_qty}
                helperText={errors.panel_qty?.message}
              />
            )}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 6 }}>
          <TextField
            label="Potencia por panel (W)"
            value={panelPower}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 6 }}>
          <Controller
            name="system_capacity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Capacidad total (kW)"
                fullWidth
                InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end">kW</InputAdornment> }}
                error={!!errors.system_capacity}
                helperText={errors.system_capacity?.message}
              />
            )}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 8 }}>
          <Controller
            name="inverter_id"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Inversor" fullWidth>
                {inverters.map((inv) => (
                  <MenuItem key={inv.id} value={inv.id}>
                    {inv.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 4 }}>
          <Controller
            name="inverter_qty"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cantidad de inversores"
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                error={!!errors.inverter_qty}
                helperText={errors.inverter_qty?.message}
              />
            )}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 6 }}>
          <Controller
            name="array_type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Tipo de arreglo" fullWidth>
                {arrayTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item columns={{ xs: 12, sm: 6 }}>
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
        <Grid item columns={{ xs: 12, sm: 6 }}>
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
        <Grid item columns={{ xs: 12, sm: 6 }}>
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
        <Grid item columns={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary">
            Validar sistema
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SystemTab;
