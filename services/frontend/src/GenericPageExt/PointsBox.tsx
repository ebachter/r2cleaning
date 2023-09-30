import {ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import {BsDash} from 'react-icons/bs';

const PointsBox = ({points}: {points: string[]}) => (
  <>
    {points.map((item, i) => (
      <ListItem key={i} sx={{pt: 0, pb: 0}}>
        <ListItemIcon sx={{mr: 1, minWidth: 'auto'}}>
          <BsDash style={{fontSize: 10}} />
        </ListItemIcon>
        <ListItemText
          primary={<Typography color="textSecondary">{item}</Typography>}
        />
      </ListItem>
    ))}
  </>
);

export default PointsBox;
