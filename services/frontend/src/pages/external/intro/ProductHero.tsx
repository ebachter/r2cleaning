import {Link} from 'react-router-dom';
import {useTranslation, Trans} from 'react-i18next';
import Button from './ProductHeroButton';
import ProductHeroLayout from './ProductHeroLayout';
import IconImage from '../../../GenericPageExt/IconImage';
import Typography from '@mui/material/Typography';
import {Grid, Theme} from '@mui/material';
import {Box} from '@mui/material';

const styles = {
  button: {
    minWidth: 200,
  },
  more: {
    marginTop: (theme: Theme) => theme.spacing(2),
  },
  h5: (theme: Theme) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(6),
    },
    fontWeight: 400,
  }),
  h6: {
    color: 'silver',
    fontWeight: 600,
  },
  underlineTextSecondary: {
    height: 2,
    width: 100,
    display: 'block',
    margin: (theme: Theme) => theme.spacing(1),
    backgroundColor: (theme: Theme) => theme.palette.secondary.main,
  },
};

function ProductHero() {
  const {t} = useTranslation('external');

  return (
    <ProductHeroLayout>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item>
          <IconImage height={40} src="/cl_logo_2_white.png" />
        </Grid>
        <Grid item>
          <Box component="span" sx={styles.underlineTextSecondary} />
        </Grid>
        <Grid item sx={{mt: 4}}>
          <Typography
            // color="textPrimary"
            // align="center"
            variant="h4"
            //marked="centerShort"
            sx={{...styles.h6, fontWeight: 'bold'}}
          >
            <Trans t={t} i18nKey="start.header" />
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            color="inherit"
            align="center"
            variant="h6"
            sx={styles.h5}
            style={{color: '#cccccc'}}
          >
            <Box sx={{whiteSpace: 'pre-wrap'}}>{t('start.headerText')}</Box>
          </Typography>
        </Grid>
        <Grid item sx={{mt: 5}}>
          <Button
            component={Link}
            to={'/order'}
            color="primary"
            variant="contained"
            size="large"
            sx={styles.button}
          >
            {t('start.signup')}
          </Button>
        </Grid>
        <Grid item sx={{mt: 5}}>
          <Typography variant="body2" color="inherit" sx={styles.more}>
            {t('start.discover')}
          </Typography>
        </Grid>
        <Grid item>
          <Box
            component="img"
            sx={{mt: 2}}
            src="/productHeroArrowDown.png"
            height="16"
            width="12"
            alt="arrow down"
          />
        </Grid>
      </Grid>
    </ProductHeroLayout>
  );
}

export default ProductHero;
