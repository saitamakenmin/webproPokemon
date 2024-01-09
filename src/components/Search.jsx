import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

export default function Search() {
  const [value, setValue] = React.useState(null);
  const filter = createFilterOptions();
  const [type, setType] = React.useState('');
  const [generation, setGeneration] = React.useState('');
  const handleChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div style={styles.divStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel
        id="demo-select-small-label"
      >
        タイプ
      </InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={type}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value={1}>ノーマル</MenuItem>
        <MenuItem value={2}>ほのお</MenuItem>
        <MenuItem value={3}>みず</MenuItem>
        <MenuItem value={4}>でんき</MenuItem>
        <MenuItem value={5}>くさ</MenuItem>
        <MenuItem value={6}>こおり</MenuItem>
        <MenuItem value={7}>かくとう</MenuItem>
        <MenuItem value={8}>どく</MenuItem>
        <MenuItem value={9}>じめん</MenuItem>
        <MenuItem value={10}>ひこう</MenuItem>
        <MenuItem value={11}>エスパー</MenuItem>
        <MenuItem value={12}>むし</MenuItem>
        <MenuItem value={13}>いわ</MenuItem>
        <MenuItem value={14}>ゴースト</MenuItem>
        <MenuItem value={15}>ドラゴン</MenuItem>
        <MenuItem value={16}>あく</MenuItem>
        <MenuItem value={17}>はがね</MenuItem>
        <MenuItem value={18}>フェアリー</MenuItem>
      </Select>
    </FormControl>


    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel
        id="demo-select-small-label" 
      >
        世代
      </InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={generation}
        label="Generation"
        onChange={handleChange}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value={1}>第1世代</MenuItem>
        <MenuItem value={2}>第2世代</MenuItem>
        <MenuItem value={3}>第3世代</MenuItem>
        <MenuItem value={4}>第4世代</MenuItem>
        <MenuItem value={5}>第5世代</MenuItem>
        <MenuItem value={6}>第6世代</MenuItem>
        <MenuItem value={7}>第7世代</MenuItem>
        <MenuItem value={8}>第8世代</MenuItem>
      </Select>
    </FormControl>



    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={top100Films}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="ポケモン名を入力" />
      )}
    />
  </div>
  </div>
  );
}


const top100Films = [
  { title: 'Pikachu'},
];

var styles={
  divStyle:{
    textAlign: "center",
    marginTop: 0,
    marginLeft: 500,
    marginRight: 500,
    backgroundColor: '',
  }
}