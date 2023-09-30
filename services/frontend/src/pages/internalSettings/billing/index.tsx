import GenericPage from '../../../GenericPage';

const SettingsPage = () => {
  return (
    <GenericPage
      pageData={{
        content: [
          {type: 'subtitle', primary: 'Billing and payment settings'},
          {
            type: 'container',
            list: [
              {
                primaryText: 'Add your payment data',
              },
            ],
          },
        ],
      }}
    />
  );
};

export default SettingsPage;
