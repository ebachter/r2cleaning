import {useRef} from 'react';
import {Button, Paper} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {setPopupElementValue, setPopupElementVisible} from '../zustand/popup';
import {PopupContentUpload} from '../types/typesPopup';
import {readFileAsync} from '@remrob/utils';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export const DialogFilesUpload = ({
  elemKey,
}: Omit<PopupContentUpload, 'type'>) => {
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p>SELECT FILES</p>

      <Paper
        style={{
          marginTop: '10px',
          border: '1px solid silver',
          padding: '10px',
        }}
      >
        <input
          accept="image/png,image/jpeg,application/javascript,text/html"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          ref={inputRef}
          onChange={async () => {
            if (inputRef?.current?.files) {
              setPopupElementValue(elemKey, inputRef?.current?.files);
            }
          }}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            className={classes.button}
          >
            Upload files
          </Button>
        </label>
      </Paper>
    </div>
  );
};
