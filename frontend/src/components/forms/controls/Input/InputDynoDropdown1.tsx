import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, Select, FormControlLabel, InputLabel, FormControl, MenuItem } from '@mui/material';

interface InputDD1Props {
  label?: string;
  name: string;
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  disabled?: boolean;
  rules?: any;
  multiline?: boolean;
  rows?: number;
  style?: any;
  hidden?: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: {value: string | number; label: string}[];
}

const InputDropdown1 = (props: InputDD1Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const {
    label,
    name,
    xs,
    sm,
    md,
    lg,
    disabled,
    rules,
    multiline,
    rows,
    style,
    hidden,
    defaultValue,
    placeholder,
    options,
  } = props;
  
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue ? defaultValue : ''}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              label={label}
              disabled={disabled}
            >
              {placeholder && <MenuItem value="">{placeholder}</MenuItem>}
              {options &&
                options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default InputDropdown1;
