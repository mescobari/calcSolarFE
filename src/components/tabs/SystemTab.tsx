import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { systemSchema } from '../../schemas/system.schema';
import { z } from 'zod';
import Grid from '@mui/material/Grid';
import { TextField, Button, MenuItem, InputAdornment, Tooltip } from '@mui/material';
import panelsData from './panels.json';
import invertersData from './inverters.json';



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
