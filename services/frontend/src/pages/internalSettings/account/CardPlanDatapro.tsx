import {Fragment} from 'react';
import {makeStyles} from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    maxWidth: 250,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const action = {
  data: {
    formPlanActivate: {
      plan: 'advanced',
      label: 'Advanced',
      info: 'Use basic functionality including stand-by mode. Avoid unnecessary costs. Make the planet green.',
      pricing: 'für komplexe Projekte',
      points: [
        // 'Pay as you use',
        // '5€ monatlich pro jede GB',
        // 'Writes, reads or storage',
        //'Data usage alerts',
        // 'Unlimitierte Speicherkapazität', // Storage
        // 'Unlimitierte Haltungsdauer', // data retention
        // '1sec processing frequence',
        'Maßgeschneiderte Lösungen',
        'Individuelles Pricing',
        'Profissionelle Beratung',
        'Fester Ansprechpartner',
      ],
    },
  },
};
const formData = action.data.formPlanActivate;

export default function OutlinedCard({
  changeUserPlan,
}: {
  changeUserPlan: ({plan}: {plan: 'advanced'}) => void;
}) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const userData = useSelector((state: RootState) => state.user);
  const basic = userData.plan === 'basic';

  const handleClickOpen = () => {
    changeUserPlan({plan: 'advanced'});
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent style={{minHeight: '220px'}}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Tarif
        </Typography>
        <Typography variant="h5" component="h2">
          {bull}
          {formData?.plan}
          {bull}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {formData?.pricing}
        </Typography>
        <Typography variant="body2" component="p">
          {action.data.formPlanActivate.points?.map((point, i) => (
            <Fragment key={i}>
              {bull} {point} <br />
            </Fragment>
          ))}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          disabled={basic}
          onClick={handleClickOpen}
        >
          {basic ? 'Aktiv' : 'Auswählen'}
        </Button>
      </CardActions>
    </Card>
  );
}
