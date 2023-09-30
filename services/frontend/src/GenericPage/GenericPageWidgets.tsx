import {Grid} from '@mui/material';
import {GenericPageWidgets} from '../types/typesGenericPage';
import MuiCard from './Card';

const GenericPageContainer = ({data}: {data: GenericPageWidgets['data']}) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={1}
    >
      {data.map(({widgetId, name, descr, creatorId, iconColor, project}, k) => {
        return (
          <Grid
            item
            key={k}
            style={{marginTop: 5, marginBottom: 5}}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <MuiCard
              widgetId={widgetId}
              name={name}
              descr={descr}
              creatorId={creatorId}
              iconColor={iconColor}
              project={project}
            />
          </Grid>
        );
      })}
      {[0, 1, 2].map((k) => (
        <Grid
          key={k}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          item
          style={{marginTop: 5, marginBottom: 5}}
        >
          <div />
        </Grid>
      ))}
    </Grid>
  );
};

export default GenericPageContainer;
