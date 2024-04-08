import { Controller, useFormContext } from 'react-hook-form';
import { Grid, FormControlLabel, Checkbox } from '@mui/material';

interface InputCheckboxProps {
  color?:
    | 'default'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | undefined;
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
}

const InputCheckbox1 = (props: InputCheckboxProps) => {
  const { control } = useFormContext();
  const { color, label, name, xs, sm, md, lg, disabled } = props;

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            render={({ field: props }) => (
              <Checkbox
                disabled={disabled}
                {...props}
                color={color || 'primary'}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
              />
            )}
          />
        }
        label={label}
        style={{ color: disabled ? 'grey' : 'default' }}
      />
    </Grid>
  );
};

export default InputCheckbox1;
