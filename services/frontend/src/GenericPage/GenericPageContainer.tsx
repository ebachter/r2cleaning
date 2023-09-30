import {
  Paper,
  List,
  ListItemText,
  ListItem,
  Button,
  ListItemSecondaryAction,
  ListItemIcon,
  Theme,
  ListSubheader,
  Avatar,
  ListItemButton,
  Grid,
  Chip,
  ListItemAvatar,
  TextField,
  Switch,
  IconButton,
} from '@mui/material';
import {GenericPageContainerType} from '../types/typesGenericPage';
import GenericPageContainerSwitch from './GenericPageContainerSwitch';
import {Box} from '@mui/system';
import {Link} from 'react-router-dom';
import {ReactNode, createElement} from 'react';
import ListItemMenu from './ListItemMenu';
import {MdArrowRight} from 'react-icons/md';
import {PageInit} from './PageInit';
import {Lens} from '@mui/icons-material';

const classes = {
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
  },
  nested: {
    paddingLeft: (theme: Theme) => theme.spacing(4),
  },
  paperBlocks: {
    // ...theme.mixins.gutters(),
    paddingTop: (theme: Theme) => theme.spacing(1),
    paddingBottom: (theme: Theme) => theme.spacing(1),
    marginBottom: (theme: Theme) => theme.spacing(2),
  },
  textField: {
    // marginRight: (theme: Theme) => theme.spacing(1),
    width: 200,
    display: 'block',
  },
};

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: Function;
  children: ReactNode;
}) => (condition ? wrapper(children) : children);

const GenericPageContainer = ({data}: {data: GenericPageContainerType}) => {
  return (
    <Paper sx={classes.paperBlocks}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        // sx={{padding: '10px 0px 10px'}}
      >
        <Grid item>
          <ListSubheader>{data.title}</ListSubheader>
        </Grid>
        {data.titleAction?.menu && (
          <Grid item>
            <ListItemMenu menu_items={data.titleAction.menu} />
          </Grid>
        )}
      </Grid>

      <List sx={{overflow: 'auto'}}>
        {data.list.map((o, i) => {
          if ('input' in o)
            return (
              <ListItem dense key={i}>
                <PageInit
                  {...o.input}
                  /* value={o.input.text}
                  label={'eeee'}
                  onChange={(v) => {
                    console.log(v);
                  }}
                  rows={5} */
                />
              </ListItem>
            );

          if ('primaryDisplay' in o)
            return (
              <ListItem dense key={i}>
                <TextField
                  label={o.primaryDisplay.label}
                  value={o?.primaryDisplay.text}
                  sx={classes.textField}
                  margin="normal"
                  variant="outlined"
                  disabled
                  size="small"
                />
              </ListItem>
            );
          if ('primaryButton' in o)
            return (
              <ListItem dense key={i}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={o.primaryButton.onClick}
                  disabled={o.primaryButton.disabled}
                >
                  {o.primaryButton.text}
                </Button>
              </ListItem>
            );
          if ('chipText' in o)
            return (
              /* <ListItem dense key={i}> */
              <Chip
                key={i}
                style={{marginRight: 4}}
                label={`#${o.chipText}`}
                color="primary"
                variant="outlined"
              />
              /* </ListItem> */
            );
          if ('primaryText' in o)
            return (
              <div key={i}>
                <ListItem
                  dense
                  disablePadding={!!o.link}
                  secondaryAction={
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      {o.action && 'button' in o.action && (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={o.action?.button?.disabled}
                          startIcon={
                            o.action.button?.icon
                              ? createElement(o.action.button?.icon)
                              : undefined
                          }
                          onClick={() => {
                            if (
                              o.action &&
                              'button' in o.action &&
                              o.action?.button?.onClick
                            )
                              o.action.button.onClick();
                          }}
                        >
                          {o.action.button &&
                            (o.action.button.verticalLineColor ? (
                              <Box
                                component="span"
                                sx={{
                                  paddingRight: 4,
                                  borderRight: `8px solid ${o.action.button.verticalLineColor}`,
                                }}
                              >
                                {o.action?.button.label}
                              </Box>
                            ) : (
                              o.action?.button.label
                            ))}
                        </Button>
                      )}
                      {o.action &&
                        'button2' in o.action &&
                        o.action?.button2 && (
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={o.action?.button2?.disabled}
                            sx={{ml: 1}}
                            onClick={() => {
                              if (
                                o.action &&
                                'button2' in o.action &&
                                o.action?.button2?.onClick
                              )
                                o.action.button2.onClick();
                            }}
                          >
                            {o.action.button2.label}
                          </Button>
                        )}
                      {o.action && 'switch' in o.action && o.action.switch && (
                        <Grid item>
                          <GenericPageContainerSwitch data={o.action.switch} />
                        </Grid>
                      )}
                      {o.action && 'chip' in o.action && o.action.chip && (
                        <Grid item>
                          <Chip size="small" label={o.action.chip.text} />
                        </Grid>
                      )}
                      {o.action && 'onoff' in o.action && o.action.onoff && (
                        <Grid item>
                          <IconButton aria-label="Comments" component="span">
                            <Lens
                              style={{
                                color:
                                  o.action.onoff.value === 'on'
                                    ? 'green'
                                    : 'silver',
                              }}
                            />
                          </IconButton>
                        </Grid>
                      )}
                      {o.action && 'label' in o.action && o.action?.label && (
                        <ListItemText
                          sx={{textAlign: 'right'}}
                          primary={`${o.action?.label.value}${
                            o.action?.label.addition
                              ? `  ${o.action?.label.addition}`
                              : ''
                          }`}
                        />
                      )}
                      {o.action && 'menu' in o.action && o.action.menu && (
                        <Grid item>
                          <ListItemMenu menu_items={o.action.menu} />
                        </Grid>
                      )}
                    </Grid>
                  }
                >
                  <ConditionalWrapper
                    condition={!!o.link}
                    wrapper={(children: ReactNode) => (
                      <ListItemButton
                        key={i}
                        component={Link}
                        to={o.link || ''}
                      >
                        {children}
                      </ListItemButton>
                    )}
                  >
                    {o.startAvatar && (
                      <ListItemAvatar>
                        <Avatar
                          variant={o.startAvatar?.avatarType || 'rounded'}
                          sx={{
                            backgroundColor:
                              o.startAvatar?.colorAvatarBackground,
                            ...(o.startAvatar.size === 'large'
                              ? {width: 56, height: 56, mr: 2}
                              : {}),
                          }}
                          src={
                            'startIconUrl' in o.startAvatar
                              ? o.startAvatar.startIconUrl
                              : undefined
                          }
                        >
                          {'icon' in o.startAvatar &&
                            createElement(o.startAvatar.icon)}
                        </Avatar>
                      </ListItemAvatar>
                    )}
                    {o.primmaryRawIcon && (
                      <ListItemAvatar>
                        <Avatar>
                          {createElement(o.primmaryRawIcon, {fontSize: '25px'})}
                        </Avatar>
                      </ListItemAvatar>
                    )}

                    {/* o.customIcon && (
                      <ListItemIcon>
                        <Avatar
                          variant={o.avatarType || 'rounded'}
                          alt="Model icon"
                          src={`${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/icons/models/${o.customIcon}?s=30`}
                        />
                      </ListItemIcon>
                    ) */}

                    {/* o.startIconUrl && (
                      <ListItemIcon>
                        <Avatar
                          variant={o?.avatarType || 'rounded'}
                          alt="Model icon"
                          src={o.startIconUrl}
                        />
                      </ListItemIcon>
                    ) */}
                    <ListItemText
                      primary={
                        <Box
                          component="div"
                          sx={
                            o.widget_line_color
                              ? {
                                  borderBottom: `3px solid ${o.widget_line_color}`,
                                  paddingBottom: 1,
                                  display: 'inline-block',
                                }
                              : {}
                          }
                        >
                          {o.primaryText}
                          {/* o.widget_line_color && (
                      <Divider sx={{backgroundColor: 'silver', height: 1}} />
                    ) */}
                        </Box>
                      }
                      secondary={o.secondaryText || null}
                    />

                    {o.action && 'toggle' in o.action && o.action.toggle && (
                      <Switch
                        checked={o.action.toggle.value}
                        onChange={(e) => {
                          if (o.action && 'toggle' in o.action)
                            o.action.toggle.onToggle(e.target.checked);
                        }}
                      />
                    )}

                    {o.action && 'switch' in o.action && o.action.switch && (
                      <ListItemText
                        sx={{textAlign: 'right'}}
                        primary={
                          <Box
                            component="span"
                            sx={{
                              paddingRight: 4,
                              borderRight: `8px solid ${o.action?.switch.color}`,
                            }}
                          >
                            {o.action?.switch.label}
                          </Box>
                        }
                      />
                    )}
                    {o.action &&
                      'actionIconRaw' in o.action &&
                      o.action?.actionIconRaw &&
                      createElement(o.action?.actionIconRaw)}
                  </ConditionalWrapper>
                </ListItem>
                {o.sublist &&
                  o.sublist.map((sub, i) => (
                    <ListItem sx={classes.nested} key={i} dense>
                      <ListItemIcon>
                        <MdArrowRight />
                      </ListItemIcon>
                      <ListItemText primary={sub.primary} />
                      <ListItemSecondaryAction>
                        <ListItemText primary={sub.value} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </div>
            );
        })}
      </List>
    </Paper>
  );
};

export default GenericPageContainer;
