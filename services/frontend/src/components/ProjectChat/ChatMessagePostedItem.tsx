import {Dispatch, SetStateAction} from 'react';
import {Card, CardMedia, Grid, Fab} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {Typography} from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import {makeStyles} from '@mui/styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {popupChatImage} from '../../popups/popupChatImage';

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  inline: {
    display: 'inline',
    fontWeight: 'bold',
  },

  // ////////////////////////////////////////
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    position: 'relative',
    marginTop: 5,
  },
  overlay: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'grey',
    backgroundColor: 'white',
  },
}));

const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  let mins = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + mins + ' ' + ampm;
  return strTime;
};

export const ChatMessagePostedItem = ({
  // userData,
  messageId,
  userId,
  text,
  createdAt,
  chatImage,
}: {
  messageId: number;
  userId: number;
  text: string;
  createdAt: Date;
  chatImage: string | null;
}) => {
  const classes = useStyles();
  const d = new Date(createdAt);
  // const mins = d.getMinutes();
  // const hour = d.getHours();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  // const str =  isToday(d) ? `${('0'+hour).slice(-2)}:${('0'+mins).slice(-2)}` : `${('0'+day).slice(-2)} ${monthNames[month]} ${year}`;
  const strAMPM = isToday(d)
    ? formatAMPM(d)
    : `${('0' + day).slice(-2)} ${monthNames[month]} ${year}`;
  const bull = <span className={classes.bullet}>•</span>;

  const userData = useSelector((state: RootState) => state.user);
  const contacts = useSelector((state: RootState) => state.contacts);
  let chatUserName;
  let chatRealName;
  if (userId === userData.user_id) {
    chatUserName = userData.username;
    chatRealName = userData.name;
  } else {
    chatUserName = contacts[userId].username;
    chatRealName = contacts[userId].name;
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={3}
      style={{marginTop: 3, marginBottom: 3}}
    >
      <Grid item>
        <Avatar
          alt={userData?.name}
          src={
            userData?.user_image_hash
              ? `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/users/${
                  userData?.user_image_hash || 'no_icon'
                }`
              : undefined
          }
        />
      </Grid>
      <Grid item>
        <Typography
          component="span"
          variant="body2"
          className={classes.inline}
          color="textPrimary"
        >
          {`${chatRealName} @${chatUserName}`}
        </Typography>
        <Typography component="span" variant="body2" color="textPrimary">
          {bull}
          {strAMPM}
        </Typography>
        <Typography
          component="div"
          variant="body2"
          color="textSecondary"
          style={{maxWidth: 400}}
        >
          {text}
        </Typography>
        {chatImage && (
          <Card>
            <CardMedia image={chatImage} className={classes.media} />
            <Fab
              aria-label="like"
              className={classes.overlay}
              onClick={() => {
                popupChatImage({imageString: chatImage});
              }}
            >
              <OpenWithIcon style={{padding: 0, margin: 0}} /> {/* , size: 5 */}
            </Fab>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};
