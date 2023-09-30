import React, {useLayoutEffect} from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {Box} from '@mui/system';

export default function LinearDeterminate() {
  const [scrolled, setScrolled] = React.useState(0);

  useLayoutEffect(() => {
    const listenToScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      setScrolled(scrolled);
    };
    window.addEventListener('scroll', listenToScroll);
    listenToScroll();
    return () => window.removeEventListener('scroll', listenToScroll);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <LinearProgress variant="determinate" value={scrolled} />
    </Box>
  );
}
