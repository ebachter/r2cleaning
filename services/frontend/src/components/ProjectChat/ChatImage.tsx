import {makeStyles} from '@mui/styles';
import {Fab, Card} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';
import {SetChatImage} from './index.d';

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
    // maxHeight: 100,
    border: '1px solid silver',
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    marginRight: '20px',
    color: 'black',
    backgroundColor: 'white',
  },

  // ////////////
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    position: 'relative',
  },
  deleteIcon: {
    padding: 0,
    margin: 0,
    size: 5,
  },
});

export default function ImgMediaCard({
  chatImage,
  setChatImage,
}: {
  chatImage: string;
  setChatImage: SetChatImage;
}) {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, classes.card)}>
      <CardMedia image={chatImage} className={classes.media} />
      <Fab
        aria-label="like"
        className={classes.overlay}
        onClick={() => setChatImage(null)}
      >
        <DeleteIcon className={classes.deleteIcon} />
      </Fab>
    </Card>
  );
}
