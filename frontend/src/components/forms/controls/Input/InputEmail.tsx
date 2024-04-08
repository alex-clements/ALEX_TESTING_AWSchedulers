import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '@mui/material';

interface InputEmailProps {
  label?: string;
  name: string;
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  disabled?: boolean;
  rules?: any;
  style?: any;
  hidden?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const InputEmail = (props: InputEmailProps) => {
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
        rules={{
          ...rules,
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            style={style}
            placeholder={placeholder}
            fullWidth
            size="small"
            error={!!errors[name]}
            helperText={errors?.[name]?.message as string}
            label={label}
            type={hidden ? 'hidden' : 'email'}
            {...field}
            disabled={disabled}
          />
        )}
      />
    </Grid>
  );
};

export default InputEmail;
