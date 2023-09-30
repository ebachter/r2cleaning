import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import GenericPage from '../../GenericPage';
import {trpcComp} from '../../trpc';
import {TrpcReturnTypes} from '../../types/typesHelpers';
import {Theme} from '@mui/material';

type QueryDataType = TrpcReturnTypes['appTimelineLoad'][number];

const classes = {
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: (theme: Theme) => ({
    backgroundColor: theme.palette.secondary.main,
  }),
};

const headerObject = {
  userRegistration: {
    en: {header: 'Registration', textFn: () => `User succesfully registered.`},
    color: 'primary',
    Icon: ExitToAppIcon,
  },
  pairingSuccess: {
    en: {header: 'Object pairing'},
    color: 'secondary',
    Icon: SettingsInputHdmiIcon,
  },
  objectOfflineAlert: {
    en: {header: 'Offline alert'},
    color: 'secondary',
    Icon: NotificationsActiveIcon,
  },
  sensorLimitReached: {
    en: {header: 'Sensor limit'},
    color: 'secondary',
    Icon: HourglassFullIcon,
  },
} as const;

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

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = String(minutes < 10 ? '0' + minutes : minutes);
  const strTime = hours + ':' + minutesStr + ' ' + ampm;
  return strTime;
};

const CustomItem = ({
  last,
  operation,
  data,
  created_at,
}: {
  last: boolean;
} & QueryDataType) => {
  const {
    color,
    Icon,
    en: {header},
  } = headerObject[operation];
  const d = created_at;
  // const mins = d.getMinutes();
  // const hour = d.getHours();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  // const str =  isToday(d) ? `${('0'+hour).slice(-2)}:${('0'+mins).slice(-2)}` : `${('0'+day).slice(-2)} ${monthNames[month]} ${year}`;

  const strAMPM = isToday(d)
    ? formatAMPM(d)
    : `${('0' + day).slice(-2)} ${monthNames[month]} ${year}`;

  const strBody =
    operation === 'userRegistration'
      ? headerObject.userRegistration.en.textFn()
      : JSON.stringify(data, null, 2);

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography variant="body2" color="textSecondary">
          {strAMPM}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color={color}>
          <Icon />
        </TimelineDot>
        {!last && <TimelineConnector sx={classes.secondaryTail} />}
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3} sx={classes.paper}>
          <Typography variant="subtitle1" component="h1">
            {header}
          </Typography>
          <Typography variant="body2">{strBody}</Typography>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};

const TimelineComp = () => {
  const timeline: QueryDataType[] = []; // useSelector(state => state.r2meta.timeline);

  const {data} = trpcComp.appTimelineLoad.useQuery();

  //useEffect(() => {
  let timelineSorted = (data || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf(),
    );
  //}, [timeline]);

  return (
    <Timeline position="alternate">
      {timelineSorted.map(({timeline_id, operation, data, created_at}, i) => (
        <CustomItem
          last={i === timeline.length - 1}
          key={i}
          timeline_id={timeline_id}
          operation={operation}
          created_at={created_at}
          data={data}
        />
      ))}
    </Timeline>
  );
};

export default function CustomizedTimeline() {
  return (
    <>
      <GenericPage
        pageData={{
          header: [],
          subHeader: [],

          content: [{type: 'customComponent', value: TimelineComp}],
        }}
      />
    </>
  );
}
