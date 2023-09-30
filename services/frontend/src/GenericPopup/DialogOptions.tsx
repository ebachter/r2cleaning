import {Grid, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import {PopupOptions} from '../types/typesPopup';

const useStyles = makeStyles((theme) => ({
  /* button: {
    margin: theme.spacing(1),
  }, */
  input: {
    display: 'none',
  },
  toggleContainer: {
    // margin: theme.spacing(2, 0),
  },
}));

export const DialogOptions = ({value, setOnChange}: PopupOptions) => {
  const classes = useStyles();

  return (
    <div>
      {/* <p>OPTIONS</p> */}
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              exclusive
              aria-label="text alignment"
              onChange={(e, val) => {
                console.log(val);
                setOnChange({sign: val});
              }}
              value={value?.sign || ''}
              size="small"
            >
              <ToggleButton value="greater" aria-label="more">
                <VerticalAlignTopIcon />
              </ToggleButton>
              <ToggleButton value="less" aria-label="less">
                <VerticalAlignBottomIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Grid>

        <Grid item>
          <TextField
            label={`Set "${
              value?.sign === 'greater' ? 'greater' : 'less'
            }" option`}
            value={value?.value || ''}
            onChange={(e) => {
              setOnChange({value: e.target.value});
            }}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>
    </div>
  );
};
