import {useEffect} from 'react';
import {useImmer} from 'use-immer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {
  popupUserImageUpload,
  popupUserPasswordReset,
  popupUserSettingsLang,
  popupUserSettingsName,
  popupUserSettingsTimezone,
  showDeleteUserAccount,
} from '../../../popups/popupUserAccountDelete';
import GenericPage from '../../../GenericPage';
// import SubscribeButton from "./SubscribeButton";

const dataObject: Pick<
  RootState['user'],
  'email' | 'username' | 'name' | 'language' | 'timezone'
> = {
  // customid: '',
  username: '',
  name: '',
  email: '',
  language: 'en',
  timezone: '',
};

type DataObject = typeof dataObject;

const filteredUserData = (userData: RootState['user']) =>
  Object.entries(userData).reduce(
    (newObj, [key, val]) =>
      key in dataObject ? {...newObj, [key]: val} : newObj,
    {},
  ) as DataObject;

const SettingsPage = () => {
  const userData = useSelector((state: RootState) => state.user);
  const [state, setState] = useImmer<DataObject>(dataObject);

  useEffect(() => {
    setState(() => filteredUserData(userData));
  }, [userData, setState]);

  const language = {de: 'Deutsch', en: 'English'};

  return (
    <>
      <GenericPage
        pageData={{
          content: [
            {type: 'subtitle', primary: 'User profile'},
            {
              type: 'container',
              // title: 'Name',
              list: [
                {
                  primaryText: state.name,
                  secondaryText: `@${state.username}`,
                  startAvatar: {
                    startIconUrl: userData.user_image_hash
                      ? `${process.env.REACT_APP_DOMAIN_STATIC_FILES}/images/users/${userData.user_image_hash}`
                      : undefined,
                    avatarType: 'circular',
                  },
                  action: {
                    menu: [
                      {
                        text: 'Change icon',
                        func: () => popupUserImageUpload(),
                      },
                      {
                        text: 'Change name',
                        func: () => popupUserSettingsName(state.name),
                      },
                    ],
                  },
                },
              ],
            },

            {
              type: 'container',
              title: 'Email',
              list: [
                {
                  primaryText: `${state.email}`,
                },
              ],
            },

            {
              type: 'container',
              title: 'Language',
              list: [
                {
                  primaryText: language[state.language],
                  action: {
                    menu: [
                      {
                        text: 'Change',
                        func: () => popupUserSettingsLang(state.language),
                      },
                    ],
                  },
                },
              ],
            },

            {
              type: 'container',
              title: 'Timezone',
              list: [
                {
                  primaryText: state.timezone,
                  action: {
                    menu: [
                      {
                        text: 'Change',
                        func: () => popupUserSettingsTimezone(),
                      },
                    ],
                  },
                },
              ],
            },

            {
              type: 'container',
              list: [
                {
                  primaryButton: {
                    text: 'Reset password',
                    onClick: popupUserPasswordReset,
                  },
                },
              ],
            },

            {
              type: 'container',
              list: [
                {
                  primaryButton: {
                    text: 'Delete account',
                    onClick: showDeleteUserAccount,
                  },
                },
              ],
            },
          ],
        }}
      />

      {/* <Paper className={classes.paperBlocks}>
          <FormLabel>Subscription</FormLabel>

          <div>
            <SubscribeButton
              dispatch={dispatch}
              subscriptionStatus={props.subscriptionStatus}
              subscriptionLoading={props.subscriptionLoading}
            />
          </div>
          </Paper>*/}
    </>
  );
};

export default SettingsPage;
