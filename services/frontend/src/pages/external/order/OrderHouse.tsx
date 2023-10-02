import {FormControl, FormLabel, Slider} from '@mui/material';

export default function () {
  return (
    <>
      <FormControl sx={{mt: 5, ml: 1}}>
        <FormLabel>Площадь</FormLabel>
        <Slider
          defaultValue={50}
          aria-label="Default"
          valueLabelDisplay="on"
          min={10}
          max={300}
          sx={{mt: 4}}
        />
      </FormControl>

      <FormControl sx={{mt: 5, ml: 1}}>
        <FormLabel>Стоимость</FormLabel>
        <FormLabel>5000 руб.</FormLabel>
      </FormControl>
    </>
  );
}
