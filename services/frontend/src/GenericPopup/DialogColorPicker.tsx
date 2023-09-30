import {useState} from 'react';
import reactCSS from 'reactcss';
import {SketchPicker} from 'react-color';
import {Box, Grid, Popover} from '@mui/material';
import {PopupContentColor} from '../types/typesPopup';
import {setPopupElementValue, getPopupAllValues} from '../zustand/popup';
import {getRandomColor} from '@remrob/utils';

const SketchExample = (params: Omit<PopupContentColor, 'type'>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);
  const popupValues = getPopupAllValues();
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: params.value,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '1002',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{mt: 2, mb: 2}}
    >
      <Grid sx={{ml: 2}}>Color</Grid>
      <Grid>
        <Box
          sx={{mt: 2}}
          component="div"
          style={styles.swatch}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          aria-haspopup="true"
        >
          <div style={styles.color} />
        </Box>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
        >
          <SketchPicker
            color={params.value || getRandomColor()}
            onChange={(color: {hex: string}) => {
              console.log(color);
              params.onChange
                ? params.onChange(color.hex, {
                    setPopupElementValue,
                    popupValues,
                  })
                : setPopupElementValue(params.elemKey, color.hex);

              handlePopoverClose();
            }}
          />
        </Popover>
      </Grid>
    </Grid>
  );
};

export default SketchExample;
