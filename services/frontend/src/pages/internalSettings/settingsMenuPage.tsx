import {MdPerson} from 'react-icons/md';
import {useSelector} from 'react-redux';
import {FaRegUserCircle} from 'react-icons/fa';
import {MdPhonelink, MdCreditCard} from 'react-icons/md';
import {RootState} from '../../redux/store';
import GenericPage from '../../GenericPage';

const UserSettingsPage = () => {
  const userData = useSelector((state: RootState) => state.user);

  return (
    <GenericPage
      pageData={{
        content: [
          {type: 'subtitle', primary: 'User settings'},
          {
            type: 'container',
            list: [
              {
                primaryText: 'Personal settings',
                primmaryRawIcon: MdPerson,
                link: '/settings/user',
                // text: next_payment_at?.toString() || ' ',
                // },
              },
            ],
          },
          {
            type: 'container',
            list: [
              {
                primaryText: 'User pofile',
                primmaryRawIcon: FaRegUserCircle,
                link: `/search/users/${userData.username}`,
              },
            ],
          },
          {
            type: 'container',
            list: [
              {
                primaryText: 'Account settings',
                primmaryRawIcon: MdPhonelink,
                link: '/settings/account',
              },
            ],
          },
          {
            type: 'container',
            list: [
              {
                primaryText: 'Billing & payments',
                primmaryRawIcon: MdCreditCard,
                link: '/settings/billing',
              },
            ],
          },
        ],
      }}
    />
  );
};

export default UserSettingsPage;
