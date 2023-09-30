import {MouseEvent, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {useDispatch} from 'react-redux';
import {Action} from 'redux';

const ITEM_HEIGHT = 48;

export default function ListItemMenu({
  menu_items,
  iconType,
}: {
  menu_items: Array<{text: string; action?: Action; func?: () => void}>;
  iconType?: String;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatchAction = (e: MouseEvent<HTMLLIElement>, action: Action) => {
    e.stopPropagation();
    dispatch(action);
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {iconType === 'horiz' ? <MoreHoriz /> : <MoreVertIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {menu_items.map((item, i) => (
          <MenuItem
            key={i}
            onClick={(e: MouseEvent<HTMLLIElement>) => {
              if (item.action) dispatchAction(e, item.action);
              if (item.func) {
                item.func();
                handleClose();
              }
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
