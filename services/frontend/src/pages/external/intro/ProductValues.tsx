import {styled} from '@mui/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import LoopIcon from '@mui/icons-material/Loop';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
// import AirlineSeatReclineExtra from '@mui/icons-material/AirlineSeatReclineExtra';
import {Theme, Typography} from '@mui/material';
import {createElement} from 'react';
import {Box} from '@mui/material';
import {useTranslation} from 'react-i18next';

const StyledLoopIcon = styled(LoopIcon)((props) => ({
  // color: theme.palette.primary.main,
  fontSize: '60px',
  border: `2px solid ${props.theme.palette.secondary.main}`,
  padding: '10px',
  alignItems: 'center',
}));

const StyledTypography = styled(Typography)((props) => ({
  height: '100%',
  width: '100%',
  display: 'block',
  marginTop: props.theme.spacing(0.5),
  // backgroundColor: props.theme.palette.primary.main,
}));

const classes = {
  icon: {
    // color: theme.palette.primary.main,
    fontSize: '60px',
    border: (theme: Theme) => `2px solid ${theme.palette.secondary.main}`,
    padding: '10px',
  },
  root: {
    display: 'flex',
    overflow: 'hidden',
    // backgroundColor: '#fff5f8', // theme.palette.secondary.light,
  },
  container: {
    marginTop: (theme: Theme) => theme.spacing(15),
    marginBottom: (theme: Theme) => theme.spacing(10),
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
    padding: (theme: Theme) => theme.spacing(2),
    // padding: theme.spacing(0, 5),
  },
  image: {
    height: 55,
  },
  title: {
    marginTop: (theme: Theme) => theme.spacing(5),
    marginBottom: (theme: Theme) => theme.spacing(5),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
  },
};

function ProductValues() {
  const {t} = useTranslation('external');
  return (
    <Box component="section" sx={classes.root}>
      <Container sx={classes.container}>
        {/*<img
          src="/productCurvyLines.png"
          className={classes.curvyLines}
          alt="curvy lines"
        />*/}
        <Grid container direction="row">
          {[
            {
              icon: StyledLoopIcon,
              title: t('start.prodVal1.title'),
              text: t('start.prodVal1.text'),
            },
            {
              icon: LanguageIcon,
              title: t('start.prodVal2.title'),
              text: t('start.prodVal2.text'),
            },
            {
              icon: CodeIcon,
              title: t('start.prodVal3.title'),
              text: t('start.prodVal3.text'),
            },
          ].map(({title, text, icon}, i) => (
            <Grid key={i} item xs={12} md={4} pl={1} pr={1}>
              <Box sx={classes.item}>
                {createElement(icon, {
                  sx: {
                    fontSize: '60px',
                    border: (theme) =>
                      `2px solid ${theme.palette.secondary.main}`,
                    padding: '10px',
                  },
                })}
                <StyledTypography variant="h5" align="center" sx={{mt: 4}}>
                  {title}
                </StyledTypography>
                <StyledTypography
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  sx={{mt: 3}}
                >
                  {text}
                </StyledTypography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;
