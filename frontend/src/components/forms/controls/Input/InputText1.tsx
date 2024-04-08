import { Controller, useFormContext } from 'react-hook-form';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

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
  help?: string;
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
    help,
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
            type={hidden ? 'hidden' : 'text'}
            {...field}
            disabled={disabled}
            InputProps={{
              endAdornment: help ? (
                // <Tooltip
                //   title={<span style={{ fontSize: '1.25rem' }}>{help}</span>}
                //   arrow
                // >
                <Tooltip title={help}>
                  <IconButton>
                    <HelpOutline fontSize="small" />
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

export default InputText1;
