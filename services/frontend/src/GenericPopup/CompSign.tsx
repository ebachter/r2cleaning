import {TextField} from '@mui/material';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import {Box} from '@mui/system';

export default function ToggleButtonNotEmpty({
  sign,
  setSign,
  limit,
  setLimit,
}: {
  sign: '<' | '>';
  setSign: (val: '<' | '>') => void;
  limit: number;
  setLimit: (val: number) => void;
}) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Box>
          <ToggleButtonGroup
            exclusive
            aria-label="text alignment"
            onChange={(e, val) => {
              setSign(val);
            }}
            value={sign}
          >
            <ToggleButton value=">" aria-label="more">
              <VerticalAlignTopIcon />
            </ToggleButton>
            <ToggleButton value="<" aria-label="less">
              <VerticalAlignBottomIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>

      <Grid item>
        <TextField
          label={`Set ${sign === '>' ? 'upper' : 'lower'} limit`}
          value={limit}
          onChange={(e) => {
            console.log(e.target.value);
            !isNaN(Number(e.target.value)) && setLimit(Number(e.target.value));
          }}
          variant="outlined"
          size="small"
        />
      </Grid>
    </Grid>
  );
}
