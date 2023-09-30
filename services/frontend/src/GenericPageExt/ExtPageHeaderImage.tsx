import {makeStyles} from '@mui/styles';
// import { useImage } from 'react-image';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    textAlign: 'center',
    color: 'white',
  },
  centered: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

function ExtPageHeaderImage(props: {
  path: string;
  text?: string;
  responsive?: boolean;
  width?: string;
}) {
  const classes = useStyles();

  const path = props.path;
  const style: {width?: string; height?: string} = {};
  if (props?.responsive === true) {
    style.width = '100%';
    style.height = 'auto';
  } else if (props?.width) {
    style.width = props.width;
  }

  // const { src } = useImage({ srcList: path });
  // const { src } = path });

  // <Suspense>
  return (
    <div className={classes.container}>
      <img alt="" src={path} style={style} />
      <div className={classes.centered}>
        {props.text && <Typography variant="h3">{props.text}</Typography>}
      </div>
    </div>
  );
  // </Suspense>
}

export default ExtPageHeaderImage; //() {
/*  return (
    <Suspense>
      <ImageComponent />
    </Suspense>
  )
}*/

// export default ImageComponent;
