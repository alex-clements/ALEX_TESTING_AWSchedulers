import { Autocomplete, FormControl, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { UserSimplifiedT, UserT } from '../../../../types/generaltypes';

interface InputAutocompleteUsersProps {
  name: string;
  options: UserSimplifiedT[];
  labelField: string;
  valueField: string;
  defaultValue?: string;
  rules?: any;
  label?: string;
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  style?: any;
  hidden?: boolean;
  placeholder?: string;
}

const InputAutocompleteUsers = (props: InputAutocompleteUsersProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const {
    name,
    options,
    labelField,
    valueField,
    defaultValue,
    label,
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
    placeholder,
  } = props;
  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ? defaultValue : ''}
        render={({ field: { onChange } }) => (
          <Autocomplete
            disabled={disabled}
            disableCloseOnSelect
            multiple
            limitTags={15}
            id="multiple-limit-tags"
            options={options}
            getOptionLabel={(option) =>
              (option as UserSimplifiedT)[
                labelField as keyof typeof option
              ] as string
            }
            getOptionKey={(option) =>
              (option as UserSimplifiedT)[
                valueField as keyof typeof option
              ] as string
            }
            onChange={(event, newValue) => {
              const selectedIDs = newValue.map(
                (user) => (user as UserSimplifiedT).id
              );
              onChange(selectedIDs);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Meeting Participants" />
            )}
            sx={{ width: '100%' }}
          />
        )}
      />
    </FormControl>
  );
};

export default InputAutocompleteUsers;
