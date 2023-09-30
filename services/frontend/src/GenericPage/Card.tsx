import {makeStyles} from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import {Link} from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import ObjectProjectLabel from './ObjectProjectLabel';
import {GenericPageWidgets} from '../types/typesGenericPage';

const useStyles = makeStyles(() => ({
  root: {
    //minWidth: '12rem', //275,
    //maxWidth: '12rem',
    //width: '12rem',
    width: '100%',
    /* [theme.breakpoints.up('lg')]: {
      backgroundColor: green[500],
    },*/
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
  content: {
    height: '2.5rem',

    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  underLine: {
    height: 3,
    width: '100%',
    display: 'block',
    margin: `4px auto 4px`,
  },
}));

export default function OutlinedCard(
  props: GenericPageWidgets['data'][number],
) {
  const classes = useStyles();
  // const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root} variant="outlined">
      <CardActionArea component={Link} to={`/widgets/${props.widgetId}`}>
        <CardContent>
          <Typography variant="body1" component="h2" noWrap gutterBottom>
            {props.name}
            <span
              style={{backgroundColor: props.iconColor}}
              className={classes.underLine}
            />
          </Typography>
          {/*<div style={{ width: '100%', height: '0.2rem', backgroundColor: props.iconColor, marginBottom: '0.5rem' }} />
           <Typography className={classes.pos} color="textSecondary">
            adjective
            </Typography>*/}
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className={classes.content}
          >
            {props.descr}
          </Typography>
          {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
            Word of the Day
          </Typography>*/}
        </CardContent>
        <CardContent style={{marginBottom: 0, paddingBottom: 0}}>
          <ObjectProjectLabel
            name={props?.project?.projectName || ''}
            color={props?.project?.projectColor || ''}
          />
        </CardContent>
      </CardActionArea>
      <CardActions style={{paddingLeft: '16px', paddingRight: '16px'}}>
        <Typography variant="caption" color="textSecondary">
          {`By `}
          <MuiLink
            component={Link}
            to={`/search/users/${props.creatorId}`}
            color="textSecondary"
          >
            @{props.creatorId}
          </MuiLink>
        </Typography>
        {/* <Button size="small">Learn More</Button>*/}
      </CardActions>
    </Card>
  );
}
