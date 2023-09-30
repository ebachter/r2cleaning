import {Typography} from '@mui/material';
import {useTheme} from '@mui/styles'; //, alpha

export default function GitHubLabel({
  color,
  name,
}: {
  color: string;
  name: string;
}) {
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const [pendingValue, setPendingValue] = React.useState([]);
  const theme = useTheme();

  // const open = Boolean(anchorEl);
  // const id = open ? 'github-label' : undefined;

  const colorNew = color || '#ffffff';

  return (
    <Typography
      component="span"
      variant="button"
      sx={{
        // marginTop: 3,
        // height: 20,
        padding: '.15em 4px',
        // fontWeight: 600,
        // lineHeight: '15px',
        borderRadius: 1,
        // backgroundColor: 'rgba(0,134,114,.7)', //'#008672',
        backgroundColor: colorNew, // alpha(colorNew, 0.7),
        color: theme.palette.getContrastText(colorNew),
        // fontWeight: 600
        fontWeight: 'bold',
      }}
    >
      {name}
    </Typography>
  );
}
