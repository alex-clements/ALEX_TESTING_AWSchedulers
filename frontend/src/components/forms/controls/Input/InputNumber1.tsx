import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '@mui/material';
import {
  Unstable_NumberInput as NumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { UndoRounded } from '@mui/icons-material';


interface InputNumber1Props {
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
  defaultValue?: number;
  placeholder?: string;
}

const InputNumber1 = (props: InputNumber1Props) => {
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
        defaultValue={defaultValue ? defaultValue : null}
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
            type='string'
            onChange={(val) => {
              const value = val.target.value;
              if (value === "") {
                field.onChange("")
              } else if (value === '-' || !isNaN(parseInt(value))) {
                field.onChange(value === '-' ? value : parseInt(value))
              } else {
                field.onChange(undefined)
              }
            }}
            value={field.value}
            disabled={disabled}
          />
        )}
      />
    </Grid>
  );
};

export default InputNumber1;
