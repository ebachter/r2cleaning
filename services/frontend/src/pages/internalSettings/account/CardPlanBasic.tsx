import {Fragment} from 'react';
import {makeStyles} from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useSelector} from 'react-redux';
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
      plan: 'basic',
      label: 'Basic',
      info: 'Use basic functionality including stand-by mode. Avoid unnecessary costs. Make the planet green.',
      pricing: 'hohe Funktionalität',
      points: [
        'Kostenfrei',
        // '1 Gb Speicher',
        // '3 Monate Datenhaltung',
        'Alle Funktionen verfügbar',
        'Freie Developer Tools',
        'StandBy nach 72 Stunden',
        // '1 hr processing frequence',
      ],
    },
  },
};
const formData = action.data.formPlanActivate;

export default function OutlinedCard({
  changeUserPlan,
}: {
  changeUserPlan: ({plan}: {plan: 'basic'}) => void;
}) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const plan = useSelector((state: RootState) => state.user.plan);

  const handleClickOpen = async () => {
    changeUserPlan({plan: 'basic'});
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent style={{minHeight: '240px'}}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Tarif
        </Typography>
        <Typography variant="h5" component="h2">
          {bull}
          {formData?.label}
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
          disabled={plan === 'basic'}
          onClick={handleClickOpen}
        >
          {plan === 'basic' ? 'Aktiv' : 'Auswählen'}
        </Button>
      </CardActions>
    </Card>
  );
}
