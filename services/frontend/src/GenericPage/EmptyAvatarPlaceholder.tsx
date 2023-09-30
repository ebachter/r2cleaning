import {Avatar, ListItemAvatar} from '@mui/material';

const EmptyAvatarPlaceholder = () => (
  <ListItemAvatar>
    <Avatar
      style={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    />
  </ListItemAvatar>
);
export default EmptyAvatarPlaceholder;
