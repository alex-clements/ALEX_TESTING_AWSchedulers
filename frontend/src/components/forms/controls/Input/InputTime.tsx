import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '@mui/material';

interface InputText1Props {
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

const InputText1 = (props: InputText1Props) => {
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
  } = props;

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <Controller
        defaultValue={defaultValue ? defaultValue : ''}
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <TextField
            style={style}
            placeholder={placeholder}
            fullWidth
            size="small"
            multiline={multiline}
            rows={rows}
            error={!!errors[name]}
            helperText={errors?.[name]?.message as string}
            label={label}
            type={hidden ? 'hidden' : 'time'}
            {...field}
            disabled={disabled}
          />
        )}
      />
    </Grid>
  );
};

export default InputText1;
