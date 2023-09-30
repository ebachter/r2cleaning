import {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import CardPlanProfessional from './CardPlanProfessional';
import CardPlanBasic from './CardPlanBasic';
import {callUserDataLoad} from '../../../utils/trpcCalls';
import {trpcFunc} from '../../../trpc';
import GenericPage from '../../../GenericPage';
// import CardPlanDatapro from './CardPlanDatapro';

const SettingsPage = () => {
  useEffect(() => {
    callUserDataLoad();
  }, []);

  const changeUserPlan = async ({plan}: {plan: 'basic' | 'professional'}) => {
    await trpcFunc.appPlanActivate.mutate({plan});
    callUserDataLoad();
  };

  const customComponent = () => (
    <Grid container spacing={2}>
      <Grid item>
        <CardPlanBasic changeUserPlan={changeUserPlan} />
      </Grid>
      <Grid item>
        <CardPlanProfessional changeUserPlan={changeUserPlan} />
      </Grid>
      {/* <Grid item>
    <CardPlanDatapro />
  </Grid> */}
    </Grid>
  );

  return (
    <GenericPage
      pageData={{
        content: [
          {
            type: 'subtitle',
            primary: 'Plans',
            secondary: 'Select a plan best suited to your needs',
          },
          {type: 'customComponent', value: customComponent},
        ],
      }}
    />
  );
};

export default SettingsPage;
