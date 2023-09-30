import {FC, Fragment, useEffect, useRef, useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {makeStyles} from '@mui/styles';
import {useCallback} from 'react';
import {
  Paper,
  FormControl,
  TextField,
  Grid,
  Button,
  Link as MuiLink,
  Theme,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import {useAppDispatch} from '../hooks/hooksRedux';
import Alert from '@mui/lab/Alert';
import {useTranslation} from 'react-i18next';
import {useImmer} from 'use-immer';
import {Link, useParams} from 'react-router-dom';
import {Form, FormContent, FormContentElem} from '../types/typesGenericForm';
import {Box, Stack} from '@mui/system';

const paperStyle = {
  /* height: 100,
  width: 100,
  margin: 20, */
  padding: '30px',
  textAlign: 'center',
  verticalAlign: 'middle',
  display: 'inline-block',
  opacity: 0.85,
  margin: '0 auto',
  marginTop: '40px',
  //    backgroundColor: theme.forms.main.backgroundColor
};

const formControl = {
  margin: (theme: Theme) => theme.spacing(1),
  width: '95%',
};

const container = {
  // border: '1px solid #2a6ba0',
  // border: '1px solid red',
  display: 'inline-block',
  marginTop: '20px',
  width: '300px',
};

const useStyles = makeStyles((theme) => ({
  buttonStyled: {
    margin: '20px 0 5px 0',
  },
  placeholder: {
    height: 40,
  },
  resetLink: {
    // fontSize: '60%',
    // color: 'silver',
    // fontWeight: 'normal'
    marginTop: '1rem',
  },
  headerLine: {
    minHeight: 10,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
    color: 'white',
    textAlign: 'right',
  },
}));

const AuthForm: FC<{formData: Form}> = ({formData}) => {
  const [formState, setFormState] = useImmer<Form>(formData);

  const appendFormContent = (data: FormContent) => {
    setFormState((draft) => {
      draft.content.push(...data);
    });
  };

  const placeContentElem = (index: number, elem: FormContentElem) => {
    setFormState((draft) => {
      draft.content.splice(index, 0, elem);
    });
  };

  const delElemByKey = (key: string) => {
    setFormState((draft) => {
      draft.content = draft.content.filter(
        (o) => !('elemKey' in o) || o.elemKey !== key,
      );
    });
  };

  const setContentElemValue = (elemKey: string, value: string) => {
    setFormState((draft) => {
      const element = draft.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element && 'value' in element) {
        element.value = value;
      }
    });
  };
  const setContentElemDisabled = (elemKey: string, value: boolean) => {
    setFormState((draft) => {
      const element = draft.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element) element.disabled = value;
    });
  };
  const getAllValues = () => {
    const values = formState.content.reduce(
      (n, o) =>
        'elemKey' in o && 'value' in o ? {...n, [o.elemKey]: o.value} : n,
      {},
    );
    return values as any;
  };

  /* const setContent = (data: FormContent) => {
    setFormState((draft) => {
      draft.content = data;
    });
  }; */

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const {t} = useTranslation('external', {useSuspense: false});
  const params = useParams();

  const [inputValues, updateInputValues] = useImmer<{[k: string]: string}>({});
  const [requestStatus, setRequestStatus] = useState<number | null>(null);
  // const [state, setState] = useState({ reCapString: '' });

  const setInputValue = useCallback(
    (sid: string, value: string) => {
      updateInputValues((draft) => {
        draft[sid] = value;
      });
    },
    [updateInputValues],
  );

  useEffect(() => {
    formState.content.forEach((elem, i) => {
      if (elem.type === 'input') {
        setInputValue(elem.elemKey, '');
      }
      if (i === formState.content.length) setRequestStatus(null);
    });
  }, [formState.content, dispatch, setInputValue]); // formState.content

  useEffect(() => {
    formState.onLoadActions.forEach(({actionFn}) =>
      actionFn({setContentElemDisabled, placeContentElem, delElemByKey}),
    );
  }, [formState.onLoadActions, dispatch, params]);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const formHeadLine = {
    backgroundColor: (theme: Theme) => theme.palette.primary.main,
    opacity: 0.9,
    color: 'white',
    marginBottom: '10px',
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  };

  return (
    <Paper sx={paperStyle}>
      <div style={{textAlign: 'center'}}>
        <Typography variant="h5" component="div">
          {formState.header}
        </Typography>

        <Box sx={container}>
          <FormControl sx={formControl}>
            <Stack spacing={3}>
              {formState.subHeader && (
                <Paper sx={formHeadLine}>{formState.subHeader}</Paper>
              )}
              {formState.forgotPassword && (
                <Paper sx={formHeadLine}>
                  Log in to REMROB
                  {/*<Link to="/reset">
                  <Button size="small" className={classes.resetLink}>Forgot password?</Button>
                </Link>*/}
                </Paper>
              )}
              {formState.content.map((element, i) => {
                const {type} = element;
                switch (type) {
                  case 'success':
                  case 'error':
                  case 'info': {
                    const {label} = element;
                    return (
                      <Alert key={i} variant="filled" severity={type}>
                        {label}
                      </Alert>
                    );
                  }
                  case 'input': {
                    const {elemKey, disabled, format, label, value, onChange} =
                      element;
                    const setValue = (value: string) =>
                      setContentElemValue(elemKey, value);
                    return (
                      <FormControl key={i}>
                        <TextField
                          size="small"
                          type={format === 'password' ? 'password' : 'text'}
                          fullWidth
                          value={value || inputValues[elemKey] || ''}
                          disabled={
                            typeof disabled === 'boolean' ? disabled : undefined
                          }
                          onChange={(e) => {
                            setInputValue(elemKey, e.target.value);
                            onChange &&
                              onChange({
                                value: e.target.value,
                                setValue,
                                setContentElemDisabled,
                                delElemByKey,
                              });
                          }}
                          // disabled={disabled?.status.includes(requestStatus)}
                          label={label}
                        />
                      </FormControl>
                    );
                  }

                  case 'recaptchaButton': {
                    const {
                      funcButton,
                      disabled,
                      withRecaptcha,
                      onSubmit,
                      label,
                    } = element;
                    return (
                      <Fragment key={i}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={
                            typeof disabled === 'boolean' ? disabled : undefined
                          }
                          onClick={async () => {
                            let reCapString = null;

                            if (withRecaptcha) {
                              if (!reCapString)
                                reCapString =
                                  await recaptchaRef?.current?.executeAsync();
                              recaptchaRef?.current?.reset();
                              if (!reCapString)
                                throw new Error('reCaptcha is undefined');
                            }

                            if (funcButton && reCapString) {
                              const values: {[key: string]: any} =
                                funcButton.params.reduce(
                                  (o, v) => ({...o, [v]: inputValues[v]}),
                                  {},
                                );

                              const {status} = await funcButton.func({
                                ...values,
                                reCapString,
                              });
                              if (status) setRequestStatus(status);
                            }

                            if (onSubmit) {
                              const allValues = getAllValues();
                              onSubmit({
                                allValues,
                                reCapString: reCapString || null,
                                appendFormContent,
                                placeContentElem,
                                setContentElemDisabled,
                                delElemByKey,
                              });
                            }
                          }}
                          // disabled={disabled?.status.includes(requestStatus)}
                          className={classes.buttonStyled}
                          fullWidth
                        >
                          {label}
                        </Button>
                        {withRecaptcha && (
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            size="invisible"
                            sitekey={process.env.REACT_APP_RECAP_SITE_KEY!}
                          />
                        )}
                      </Fragment>
                    );
                  }

                  default:
                    return null;
                }
              })}

              {requestStatus && formState.codes?.[requestStatus] && (
                <Alert severity={formState.codes?.[requestStatus].type}>
                  {
                    // @ts-ignore
                    `${t(formState.codes?.[requestStatus].text)}`
                  }
                </Alert>
              )}

              {formState.forgotPassword && (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  className={classes.resetLink}
                  // spacing={1}
                >
                  <Grid item>
                    <MuiLink component={Link} to="/reset">
                      Forgot password?
                    </MuiLink>
                  </Grid>
                  <Grid item sx={{ml: 1, mr: 1}}>
                    <Typography color="primary" variant="body2">
                      {'\n\u2022'}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <MuiLink component={Link} to="/signup">
                      Signup
                    </MuiLink>
                  </Grid>
                </Grid>
              )}
            </Stack>
          </FormControl>

          <div>
            {/*
                (loginProcessing || loginStatus === 200) && <CircularProgress className={classes.progress} /> 
                // formControl.loading && <CircularProgress className={classes.progress} /> 
              */}
          </div>
          {/* loginStatus &&
              <Paper className={classes.root} elevation={1}>
                <Typography component="p" align="center" color="error">
                  { loginStatus === 500 && "Connection error" }
                  { loginStatus === 401 && "Incorrect credentials" }
                  { ![200, 500, 401].includes(loginStatus) && "Something went wrong" }
                </Typography>
              </Paper>
            */}
        </Box>
      </div>
    </Paper>
  );
};

export default AuthForm;
