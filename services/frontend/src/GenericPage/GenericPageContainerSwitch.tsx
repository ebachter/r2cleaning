import {IconButton, Menu, MenuItem} from '@mui/material';
import {useState} from 'react';
import {GenericPageContainerSwitchType} from '../types/typesGenericPage';
import {MdRepeat} from 'react-icons/md';

const GenericPageContainerSwitch = ({
  data: o,
}: {
  data: GenericPageContainerSwitchType;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton
        disabled={o.disabled}
        aria-label="Select state"
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MdRepeat />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {o.options.map((o, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              o.onClick();
              setAnchorEl(null);
            }}
            style={{
              borderLeft: `8px solid ${o.color}`,
            }}
          >
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default GenericPageContainerSwitch;
