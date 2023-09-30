import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {withStyles} from '@mui/styles';
import Grid from '@mui/material/Grid';
import useCurrentPath from '../../../hooks/useCurrentPath';
import {Theme} from '@mui/material';
import {AllRouterParams} from '../../../router/routes';

const classes = {
  /* separatorWhite: {
    color: 'white',
  }, */
  separatorInherit: {
    color: 'inherit',
  },
  icon: {
    marginRight: (theme: Theme) => theme.spacing(0.5),
    width: 20,
    height: 20,
  },
};

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    // backgroundColor: theme.palette.common.white,
    // color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

export default function SimpleBreadcrumbs() {
  const location = useLocation();
  const {search} = location;

  const params = useParams() as unknown;
  const route = useCurrentPath();

  const rootDir = route.path.split('/')[1];
  const navigate = useNavigate();
  const getAttributes = (i: number) => {
    const attributes: {
      color?: string;
      component?: typeof RouterLink;
      to?: string | null;
    } = {};

    if (
      route?.crumbs &&
      i === route.crumbs(params as AllRouterParams).length - 1
    ) {
      attributes.color = 'inherit';
    } else {
      attributes.color = 'inherit';
      attributes.component = RouterLink;
      if (route?.parent?.(params as AllRouterParams)[i])
        attributes.to = route.parent(params as AllRouterParams)[i];
      if (rootDir === 'search') {
        attributes.to = attributes.to + search;
      }
    }
    // attributes.style = {fontWeight: 600};
    // if (['search', 'settings', 'analytics', 'admin'].includes(rootDir))
    //  attributes.style.color = theme.palette.common.white;
    return attributes;
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      {['analytics', 'admin', 'settings'].includes(rootDir) && (
        <Grid item style={{marginLeft: '-10px'}}>
          <LightTooltip title="Back" arrow>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={classes.icon} />
            </IconButton>
          </LightTooltip>
        </Grid>
      )}
      <Grid item>
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumb"
          sx={classes.separatorInherit}
        >
          {route?.crumbs &&
            route.crumbs(params as AllRouterParams).map((item, i) => {
              if (
                route?.crumbs &&
                i === route.crumbs(params as AllRouterParams).length - 1
              ) {
                return (
                  <Typography {...getAttributes(i)} key={`breadcrumbs-${i}`}>
                    {item}
                  </Typography>
                );
              } else {
                return (
                  <Link {...getAttributes(i)} key={`breadcrumbs-${i}`}>
                    {item}
                  </Link>
                );
              }
            })}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}
