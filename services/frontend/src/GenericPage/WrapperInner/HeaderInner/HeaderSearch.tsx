import {useEffect, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {styled, alpha} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import {useLocation} from 'react-router-dom';
import {setSearchString} from '../../../zustand/utils';
import useCurrentPath from '../../../hooks/useCurrentPath';
import {AllRoutesObject} from '../../../router/routes';
import {pushRoute} from '../../../router/helpers';

const Search = styled('form')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.55),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.65),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
type ValueOf = keyof AllRoutesObject;
type SearchRoutes = Record<ValueOf, Record<'parent', string>>;
const searchRoutes: Partial<SearchRoutes> = {
  '/search/services/:serviceTemplateId': {parent: '/search/services'},
  '/search/models/:modelId': {parent: '/search/models'},
  '/search/users/:username': {parent: '/search/users'},
  '/search/widgets/:widgetId': {parent: '/search/widgets'},
  '/search/objects/:objectId': {parent: '/search/objects'},
};

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export function AppInnerHeaderSearch() {
  const {path} = useCurrentPath();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const iniSearchString = queryParams.get('q') || '';
  useEffect(() => {
    setSearchString(iniSearchString);
  }, [iniSearchString]);

  const [localString, setLocalString] = useState(iniSearchString);
  const handleSearchIconClick = () => {
    let url: string;
    if (path.startsWith('/search/')) {
      url = `${path}${localString ? `?q=${localString}` : ''}`;
    } else {
      url = `/search/objects?q=${localString}`;
    }
    pushRoute(url);
  };

  return (
    <Search
      onSubmit={(e) => {
        e.preventDefault();
        setSearchString(localString);
        handleSearchIconClick();
      }}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{'aria-label': 'search'}}
        value={localString}
        onChange={(event) => {
          setLocalString(event.target.value);
        }}
        onBlur={() => {
          setLocalString(iniSearchString);
        }}
      />
    </Search>
  );
}
