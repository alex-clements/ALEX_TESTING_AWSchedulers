import { Autocomplete, TextField } from '@mui/material';

interface InputAutocomplete1Interface {
  options: any;
  labelField: string;
  valueField: string;
}

const InputAutocomplete1 = ({
  options,
  labelField,
  valueField,
}: InputAutocomplete1Interface) => {
  return (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={options}
      //   @ts-ignore
      getOptionLabel={(option) => option[labelField]}
      //   @ts-ignore
      getOptionKey={(option) => option[valueField]}
      renderInput={(params) => (
        <TextField {...params} label="Meeting Participants" />
      )}
      sx={{ width: '100%' }}
    />
  );
};

export default InputAutocomplete1;
