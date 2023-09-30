import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import {useTranslation} from 'react-i18next';
import {LanguageOptions} from '@remrob/mysql';

const languages = {en: 'English', de: 'Deutsch'};

const LangChangeSimpleMenu = (props: {
  color: 'primary' | 'secondary' | 'customNeutral';
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setLang = (lang: LanguageOptions) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  // console.log('props+++')
  // const { i18n } = this.props; // initialLanguage,
  // console.log(i18n.language, this.props)
  // const { i18n } = this.props;
  const {i18n} = useTranslation('footer');

  let selectedLang: LanguageOptions;
  if (i18n.language === 'en') selectedLang = 'en';
  else if (i18n.language === 'de') selectedLang = 'de';
  else selectedLang = 'en';

  return (
    <>
      <Button
        aria-owns={anchorEl ? 'change-lng-menu' : undefined}
        aria-haspopup="true"
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        variant="text"
        // style={{width: 'auto', fontSize: '1rem', marginRight: '1.5rem'}}
        color={props.color}
        // sx={(theme) => theme.palette.primary.contrastText}
      >
        {languages[selectedLang]}
        <ArrowDropDown />
      </Button>
      <Menu
        anchorEl={anchorEl}
        // keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => setLang('en')}
          selected={selectedLang === 'en'}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => setLang('de')}
          selected={selectedLang === 'de'}
        >
          Deutsch
        </MenuItem>
      </Menu>
    </>
  );
};

export default LangChangeSimpleMenu;

// LangChangeSimpleMenu.propTypes = {
//i18n: PropTypes.object.isRequired,
// };
