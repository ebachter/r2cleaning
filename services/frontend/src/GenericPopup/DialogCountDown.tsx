import {useEffect, useState} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useDispatch} from 'react-redux';

function CircularProgressWithLabel(props: {text: string; logCount: number}) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.logCount)}`}</Typography>
      </Box>
    </Box>
  );
}

export default function CircularStatic() {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState<number>(30);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (progress > 0) {
      timer = setTimeout(() => setProgress(progress - 1), 1000);
    } else {
      setProgress(0);
      // dispatch(popupObjectPairingTimeout());
    }
    return () => {
      clearTimeout(timer);
    };
  }, [progress, dispatch]);
  // console.log(progress, progress/30*100)

  /* React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);*/

  return (
    <CircularProgressWithLabel
      text={String(progress)}
      logCount={100 - (progress / 30) * 100}
    />
  );
}
