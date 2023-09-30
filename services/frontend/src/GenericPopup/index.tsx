import {useEffect, Fragment} from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  ListSubheader,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/lab/Alert';
import {useImmer} from 'use-immer';
import {DialogInput} from './DialogInput';
import {DialogRadio} from './DialogRadio';
import {DialogList} from './DialogList';
import {DialogSwitch} from './DialogSwitch';
import {DialogFilesUpload} from './DialogFilesUpload';
import {DialogButtonWithInput} from './DialogButtonWithInput';
import {DialogOptions} from './DialogOptions';
import {DialogAutocomplete} from './DialogAutocomplete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import CountDown from './DialogCountDown';
import ColorPicker from './DialogColorPicker';
import {CustomButton} from './CustomButton';
import {PopupContentMixArray} from '../types/typesPopup';
import {closePopup, getPopupAllValues, usePopupStore} from '../zustand/popup';
import {
  BungalowTwoTone,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import {
  setPopupElementValue,
  setPopupElementVisible,
  setPopupElementOptions,
} from '../zustand/popup';
import {readFileAsync} from '@remrob/utils';
import {Box} from '@mui/system';
import PrettyJson from './PrettyJson';

export default function DialogGenericPopup() {
  const {
    open = true,
    header,
    mandatory = false,
    loading = false,
    content,
    buttons,
    onPopupClose,
  } = usePopupStore((state) => state.data);

  const [newContent, setNewContent] = useImmer<PopupContentMixArray>([]);

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === 'backdropClick' && mandatory) return;
    if (onPopupClose) onPopupClose();
    closePopup();
  };

  useEffect(() => {
    setNewContent(() => content);
  }, [content]);

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={mandatory}
      onClose={(e, r) => {
        handleClose(e, r);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth={'xs'}
    >
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>
        {newContent.map((element, i) => {
          const {type} = element;
          switch (type) {
            case 'success':
            case 'info':
            case 'warning':
            case 'error': {
              const {bodyText} = element;
              return (
                <Alert
                  key={i}
                  variant="filled"
                  severity={type}
                  style={{marginTop: 10, marginBottom: 10}}
                >
                  {bodyText}
                </Alert>
              );
            }

            case 'sectionHeader': {
              const {text, visible} = element;
              return (
                visible !== false && (
                  <ListSubheader key={i} disableGutters>
                    {text}
                  </ListSubheader>
                )
              );
            }

            case 'checkbox': {
              const {
                elemKey,
                label,
                value,
                onChange,
                disabled = false,
                visible,
              } = element;
              return (
                visible && (
                  <FormGroup key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<CheckBoxOutlineBlank fontSize="small" />}
                          checkedIcon={<CheckBox fontSize="small" />}
                          checked={value}
                          onChange={(e) => {
                            onChange
                              ? onChange(e.target.checked, {
                                  setPopupElementValue,
                                  setPopupElementVisible,
                                })
                              : setPopupElementValue(elemKey, e.target.checked);
                          }}
                          disabled={disabled}
                        />
                      }
                      label={label}
                    />
                  </FormGroup>
                )
              );
            }

            case 'input': {
              const {visible, ...rest} = element;
              return visible !== false && <DialogInput key={i} {...rest} />;
            }

            case 'dialogList': {
              const {elemKey, options, labelText, visible, value} = element;
              return (
                visible !== false && (
                  <DialogList
                    key={i}
                    elemKey={elemKey}
                    options={options}
                    value={value}
                    labelText={labelText}
                  />
                )
              );
            }

            case 'countdown': {
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '10px',
                  }}
                >
                  <CountDown />
                </div>
              );
            }

            case 'color': {
              const {visible} = element;
              return (
                visible !== false && (
                  <Fragment key={i}>
                    <ColorPicker key={i} {...element} />
                  </Fragment>
                )
              );
            }

            case 'file': {
              const {setOnChange, visible} = element;
              return (
                visible !== false && (
                  <Fragment key={i}>
                    <label htmlFor="upload-image">
                      <Button variant="contained" component="span" size="small">
                        CHOOSE AN IMAGE
                      </Button>
                      <input
                        id="upload-image"
                        accept="image/*"
                        hidden
                        type="file"
                        onChange={async (e) => {
                          const popupValues = getPopupAllValues();
                          if (e.target.files?.[0]) {
                            const imageString = (await readFileAsync(
                              e.target.files[0],
                            )) as string;
                            setOnChange &&
                              setOnChange(imageString, {
                                setPopupElementValue,
                                popupValues,
                              });
                          }
                        }}
                      />
                    </label>
                  </Fragment>
                )
              );
            }

            case 'dialogSelect': {
              const {elemKey, label, options, value, setOnChange, visible} =
                element;
              return (
                visible !== false && (
                  <FormControl
                    key={i}
                    variant="outlined"
                    size="small"
                    fullWidth
                    style={{marginTop: 10, marginBottom: 10}}
                  >
                    <InputLabel>{label}</InputLabel>
                    <Select
                      value={value || ''}
                      onChange={(e) => {
                        const popupValues = getPopupAllValues();
                        setOnChange
                          ? setOnChange(e.target.value, {
                              setPopupElementValue,
                              setPopupElementVisible,
                              setPopupElementOptions,
                              popupValues,
                            })
                          : setPopupElementValue(elemKey, e.target.value);
                      }}
                      label={label}
                    >
                      {(options || []).map((o, i) => (
                        <MenuItem key={i} value={o.id}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              );
            }

            case 'dialogTabs': {
              const {elemKey, dialogTabItems, onElementUpdate, value} = element;
              return (
                <AppBar key={i} position="static" color="default">
                  <Tabs
                    value={value}
                    TabIndicatorProps={{
                      style: {backgroundColor: '#e77600'},
                    }}
                    onChange={(e, value) => {
                      onElementUpdate &&
                        onElementUpdate(value, {
                          setPopupElementValue,
                          setPopupElementVisible,
                        });
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    {dialogTabItems.map(({id, freeText}) => (
                      <Tab key={id} value={id} label={freeText} />
                    ))}
                  </Tabs>
                </AppBar>
              );
            }

            case 'dialogRadio': {
              const {visible, ...rest} = element;
              return visible !== false && <DialogRadio key={i} {...rest} />;
            }

            case 'dialogToggle': {
              return <DialogSwitch key={i} {...element} />;
            }

            case 'upload': {
              const {visible, ...rest} = element;
              return (
                visible !== false && (
                  <DialogFilesUpload
                    key={i}
                    {...rest}
                    /* setFiles={(files: FileList | null) =>
                      setValue(elemKey, files)
                    } */
                  />
                )
              );
            }

            case 'options': {
              const {elemKey, visible, ...rest} = element;
              return (
                visible !== false && (
                  <DialogOptions key={i} elemKey={elemKey} {...rest} />
                )
              );
            }

            case 'autocomplete': {
              const {visible, ...rest} = element;
              return (
                visible !== false && <DialogAutocomplete key={i} {...rest} />
              );
            }

            case 'image': {
              const {imageString} = element;
              return <img width="100%" src={imageString} alt="Image" />;
            }

            case 'buttons': {
              const {buttons} = element;
              const Comp = buttons.map(({label, onClick}, n) => (
                <Grid key={n} item>
                  <Button
                    onClick={async () => {
                      if (onClick) {
                        const allValues = getPopupAllValues();
                        onClick(allValues, {
                          setPopupElementValue,
                          setPopupElementVisible,
                        });
                      }
                    }}
                  >
                    {label}
                  </Button>
                </Grid>
              ));
              return (
                <Box key={i} sx={{width: '100%'}}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {Comp}
                  </Grid>
                </Box>
              );
            }

            case 'json': {
              const {value} = element;
              return <PrettyJson key={i} data={value} />;
            }

            default:
              return null;
          }
        })}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '5px',
          }}
        >
          {loading && <CircularProgress />}
        </div>
      </DialogContent>

      <DialogActions>
        {buttons.map((element, i) => {
          const {type, labelText} = element;
          switch (type) {
            case 'close':
            case 'cancel': {
              const {onButtonClick} = element;
              return (
                <CustomButton
                  key={i}
                  elemKey={element.elemKey}
                  onClick={(e, r) => {
                    onButtonClick && onButtonClick();
                    handleClose(e, r);
                  }}
                  label={labelText || 'Cancel'}
                  disabled={loading === true}
                />
              );
            }

            case 'confirmWithInput': {
              return (
                <DialogButtonWithInput
                  key={i}
                  loading={loading}
                  handleClose={handleClose}
                  {...element}
                />
              );
            }

            default:
              return null;
          }
        })}
      </DialogActions>
    </Dialog>
  );
}
