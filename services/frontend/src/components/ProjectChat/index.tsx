import {useState, ChangeEvent, useEffect} from 'react';
import Divider from '@mui/material/Divider';
import {Avatar, Grid, TextField, Button, Theme} from '@mui/material';
import {useSelector} from 'react-redux';
import ChatImage from './ChatImage';
import ChatContent from './ProjectChatContent';
import {RootState} from '../../redux/store';
import {trpcComp, trpcFunc} from '../../trpc';
import {
  connectSocket,
  subscribeToChat,
  disconnectSocket,
} from '../../sockets/ioChat';
import {ChatMessage} from '@remrob/mysql';
import {GenericPageChat} from '../../types/typesGenericPage';
import {setChatImage, useUtilsStore} from '../../zustand/utils';
import {Box} from '@mui/material';

const classes = {
  root: {
    width: '100%',
    // maxWidth: '36ch',
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    marginTop: 1,
    marginBottom: 1,
  },
  inline: {
    display: 'inline',
  },
  /* root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },*/
  avatar: {
    margin: 10,
  },
  hr: {
    alignSelf: 'stretch',
    height: 5,
    backgroundColor: 'grey',
  },
};

export function ProjectChat({
  projectId,
}: // chatImage,
// setChatImage,
Omit<GenericPageChat, 'type'>) {
  const [chatValue, setChatValue] = useState('');
  const userData = useSelector((state: RootState) => state.user);

  const {data, refetch} = trpcComp.appProjectChatLoad.useQuery({projectId});
  const chatImage = useUtilsStore((state) => state.data.chatImage);
  console.log('chatImage', chatImage);

  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    /* socket.onAny((eventName, ...args) => {
      console.log(eventName, args);
    }); */

    connectSocket();

    subscribeToChat((err, data) => {
      // const {projectId, message, chatImage}: ChatMessage = JSON.parse(data);
      refetch();
    });

    return () => {
      disconnectSocket();
    };
  }, [refetch]);

  const chatValid = chatValue.length && projectId;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatValue(event.target.value);
  };

  const sendChatMessage = async () => {
    const chatMessage: ChatMessage = {
      message: chatValue,
      projectId,
      chatImage: chatImage || null,
    };

    await trpcFunc.appProjectChatPost.mutate(chatMessage);
    refetch();
    setChatValue('');
    setChatImage && setChatImage(null);
  };

  return (
    <>
      {projectId && (
        <>
          <Divider sx={classes.hr} />
          <Box component="form" sx={classes.root} noValidate autoComplete="off">
            <Grid
              spacing={1}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <Avatar
                  alt={userData.name}
                  src={
                    userData.user_image_hash
                      ? `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/users/${userData.user_image_hash}`
                      : undefined
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  placeholder="What's happening?"
                  multiline
                  maxRows={4}
                  value={chatValue}
                  onChange={handleChange}
                  style={{width: '350px', marginBottom: 15}}
                />
                {chatImage && (
                  <ChatImage
                    chatImage={chatImage}
                    setChatImage={setChatImage}
                  />
                )}
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendChatMessage}
                  disabled={!chatValid}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item></Grid>
              <Grid item>
                <ChatContent feed={data?.feed || []} />
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
