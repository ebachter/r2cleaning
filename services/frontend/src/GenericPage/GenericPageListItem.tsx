import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Grid,
  ListItemAvatar,
  Theme,
} from '@mui/material';
import Avatar, {AvatarTypeMap} from '@mui/material/Avatar';
import {IconButton, Link} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Project from './ObjectProjectLabel';
import {GenericPageListItemType} from '../types/typesGenericPage';
import {MdLens} from 'react-icons/md';
import {createElement} from 'react';

const classes = {
  listItemText: {
    marginLeft: (theme: Theme) => theme.spacing(1),
    fontWeight: 600,
    // color: 'red'
  },
};

export const GenericPageListItem = ({
  data,
  avatarType,
}: {
  data: GenericPageListItemType;
  avatarType: AvatarTypeMap['props']['variant'];
}) => {
  const {
    link,
    customIcon,
    standardIcon,
    primaryText,
    primaryTextProjectColor,
    secondaryText,
    connection,
    project,
    secondaryCircleColor,
  } = data;
  // const object = useSelector((state: RootState) => state.objects[objectId]);

  return (
    <Link
      {...(link ? {component: RouterLink, to: link} : {})}
      style={{textDecoration: 'none'}}
    >
      <ListItem component={Paper} sx={{marginBottom: '8px'}} variant="outlined">
        {customIcon && (
          <ListItemIcon>
            <Avatar
              variant={avatarType || 'rounded'}
              alt="Model icon"
              src={`${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/icons/models/${customIcon}?s=30`}
            />
          </ListItemIcon>
        )}

        {standardIcon && (
          <ListItemAvatar>
            <Avatar
              variant={avatarType || 'rounded'}
              sx={{backgroundColor: standardIcon?.colorAvatarBackground}}
            >
              {createElement(standardIcon.icon)}
            </Avatar>
          </ListItemAvatar>
        )}

        <ListItemText
          primary={
            primaryTextProjectColor ? (
              <Project
                name={primaryText || ''}
                color={primaryTextProjectColor}
              />
            ) : (
              primaryText
            )
          }
          sx={classes.listItemText}
          secondary={secondaryText || null}
        />
        <ListItemSecondaryAction>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            {project && (
              <Grid item>
                <Project
                  name={project?.name || ''}
                  color={project?.color || ''}
                />
              </Grid>
            )}
            {connection && (
              <Grid item>
                <Tooltip title={connection} placement="top" arrow>
                  <IconButton aria-label="Comments" component={'span'}>
                    <MdLens
                      style={{
                        color: secondaryCircleColor,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  );
};
