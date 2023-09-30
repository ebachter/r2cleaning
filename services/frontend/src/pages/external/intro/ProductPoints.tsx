import {Paper, Grid, Divider, Typography, Button, Theme} from '@mui/material'; // List, ListItem, ListItemIcon, ListItemText, ListSubheader, Container,
// import StopIcon from '@mui/icons-material/Stop';
import {alpha} from '@mui/material/styles';
import {Link} from 'react-router-dom';
import {useTranslation, Trans} from 'react-i18next';

// import Typography from '../../../../components/Typography';

const classes = {
  icon: {
    // color: theme.palette.primary.main,
    // fontSize: '60px',
    backgroundColor: (theme: Theme) => theme.palette.secondary.main,
    // padding: '10px'
  },
  h6: {
    maxWidth: 800,
  },
};

const ProductPoints = () => {
  const {t} = useTranslation('external');
  const points = {
    regular: [
      // 'Easy activation', // registr - sec / flex
      t('start.productPoint1'), // 'Edge computing', // edge - reduce complexity, costs
      t('start.productPoint2'), // 'Machine learning',
      t('start.productPoint3'), // 'Smart contracts',

      // 'Standby mode', // standby - more control and protect environment
      // 'Developer tools'
    ],
    /* advanced: [
      // 'Advanced visualizations even in fullscreen mode', // widgets
      // 'Scale IoT products in different countries using pre-built internationalization', // internationalisation - built in
      // 'Experince ease of development using tools like simulator or widget developer', // simulator
      'Rapid development using tools widget developer and simulator', // simulator
    ], */
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        marginTop: 0,
        padding: '5rem 1rem 3rem 1rem',
        backgroundColor: '#F5F5F5',
      }}
    >
      <Grid container direction="row" justifyContent="center">
        <Grid item>
          <Typography variant="h4" align="center" color="textPrimary">
            {t('start.productCatchWord')}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{mt: 4}}
      >
        {points.regular.map((text, i) => (
          <Grid item key={i} sx={{marginLeft: 4, marginRight: 4}}>
            <Grid container direction="row" alignItems={'center'}>
              <Grid item>
                <Divider
                  orientation="vertical"
                  sx={{
                    ...classes.icon,
                    width: 3,
                    height: 18,
                    marginRight: '3px',
                  }}
                />
              </Grid>
              <Grid item>
                <Typography color="textSecondary" variant="h6" noWrap>
                  {text}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Grid container direction="row" justifyContent="center" sx={{mt: 5}}>
        <Grid item>
          <Typography
            color="textSecondary"
            align="center"
            variant="h6"
            sx={classes.h6}
          >
            <Trans t={t} i18nKey="start.productText" />
          </Typography>
        </Grid>
      </Grid>

      <Grid container direction="row" justifyContent="center" mt={5}>
        <Grid item>
          <Button
            component={Link}
            to="/order"
            variant="outlined"
            color="secondary"
            sx={{
              pl: 5,
              pr: 5,
              color: (theme) => alpha(theme.palette.common.black, 0.75),
              border: (theme) => `2px solid ${theme.palette.secondary.main}`,
              fontWeight: 'bold',
              '&:hover': {
                border: (theme) => `2px solid ${theme.palette.secondary.main}`,
                // color: (theme) => theme.palette.common.black,
              },
            }}
          >
            {t('start.readMore')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductPoints;
