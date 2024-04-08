import { Controller, useFormContext } from 'react-hook-form';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import {
  Unstable_NumberInput as NumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { HelpOutline, UndoRounded } from '@mui/icons-material';


interface InputFloat1Props {
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
  help?: string;
}

const InputFloat1 = (props: InputFloat1Props) => {
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
    help,
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
              if (value === "" || value === '-') {
                field.onChange(value);
              } else if (!isNaN(parseFloat(value)) && (value.match(/^\-?\d+(\.\d*)?$/) || value.match(/^\-?0+(\.0*)?$/))) {
                field.onChange((value.endsWith('.') || value === '-' || value.match(/^\-?0+(\.0*)?$/)) ? value : parseFloat(value))
              } else {
                field.onChange(field.value)
              }
            }}
            value={field.value}
            disabled={disabled}
            InputProps={{
              endAdornment: help ? (
                <Tooltip title={help}>
                  <IconButton>
                    <HelpOutline fontSize='small' />
                  </IconButton>
                </Tooltip>
              ) : null,
            }}
          />
        )}
      />
    </Grid>
  );
};

export default InputFloat1;
