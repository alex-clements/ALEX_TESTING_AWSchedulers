import { Controller, useFormContext } from 'react-hook-form';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import {
  Unstable_NumberInput as NumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { HelpOutline, UndoRounded } from '@mui/icons-material';


interface InputFloat3Props {
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
  helpOnClick?: () => void;
}

const InputFloat3 = (props: InputFloat3Props) => {
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
    helpOnClick,
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
            type='number'
            inputProps={{
                step: "0.01"
            }}
            onChange={(val) => {
                const value = val.target.value;
                field.onChange(parseFloat(value));
            }}
            value={field.value}
            disabled={disabled}
            InputProps={{
              endAdornment: help ? (
                <Tooltip title={help}>
                  {helpOnClick ? (
                    <IconButton onClick={helpOnClick}>
                      <HelpOutline fontSize='small' />
                    </IconButton>
                  ) : (
                    <IconButton>
                      <HelpOutline fontSize='small' />
                    </IconButton>
                  )}
                </Tooltip>
              ) : null,
            }}
          />
        )}
      />
    </Grid>
  );
};

export default InputFloat3;
