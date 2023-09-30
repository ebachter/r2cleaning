import {Fragment, useState} from 'react';
import Divider from '@mui/material/Divider';
import {ChatMessagePostedItem} from './ChatMessagePostedItem';
import {projects_chats} from '@remrob/mysql';

export default function ProjectChatContent({feed}: {feed: projects_chats[]}) {
  const chat = feed || [];
  const sortedChat = [...chat].sort((a: any, b: any) => {
    return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
  });

  return (
    <>
      {sortedChat.map(
        ({message_id, text, user_fk, created_at, chat_image}, i) => {
          return (
            <Fragment key={message_id}>
              {i > 0 && <Divider sx={{backgroundColor: 'silver'}} />}
              <ChatMessagePostedItem
                userId={user_fk}
                messageId={message_id}
                text={text}
                createdAt={created_at}
                chatImage={chat_image}
              />
            </Fragment>
          );
        },
      )}
    </>
  );
}
