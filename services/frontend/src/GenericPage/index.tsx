import {Button, Grid} from '@mui/material';
import WrapperInner from './WrapperInner';
import Filter from './Filter';
import {GenericPageType} from '../types/typesGenericPage';
import GenericPageList from './GenericPageList';
import GenericPageSubtitle from './GenericPageSubtitle';
import GenericPageTabs from './GenericPageTab';
import GenericPageContainer from './GenericPageContainer';
import GenericPageWidgets from './GenericPageWidgets';
import GenericPageIframe from './GenericPageIframe';
import {useUtilsStore} from '../zustand/utils';
import {createElement} from 'react';
import SubHeaderInner from './WrapperInner/SubHeaderInner';
import {ProjectChat} from '../components/ProjectChat';

const GenericPage = ({pageData}: {pageData: GenericPageType}) => {
  const filterString = useUtilsStore((state) => state.data.filterString);

  return (
    <WrapperInner bodyMargin={false} bgTransparent>
      {/* <Grid
      justifyContent="space-between"
      alignItems="center"
      container 
      spacing={0}
    >
      <Grid item>
        <SubHeaderInner transparent />
      </Grid>
    </Grid>*/}
      <SubHeaderInner settingsMenu={pageData?.settingsMenu} />
      <Grid
        justifyContent="space-between"
        alignItems="center"
        container
        spacing={0}
        style={{marginBottom: 10}}
      >
        <Grid item>
          <Grid
            justifyContent="space-between"
            alignItems="center"
            container
            spacing={1}
          >
            {pageData.subHeader?.map((elem, i) => {
              let Comp;
              if (elem === 'filter') {
                Comp = Filter;
              } /* else if ('button' in elem) {
                Comp = allButtons[elem.button];
              } */ else if ('buttonLabel' in elem) {
                Comp = () => (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      elem.startIcon ? createElement(elem.startIcon) : undefined
                    }
                    style={{borderRadius: 2}}
                    onClick={() => elem.onClick()}
                  >
                    {elem.buttonLabel}
                  </Button>
                );
              } else Comp = () => null;

              return (
                <Grid key={i} item>
                  <Comp />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      {pageData.content.map((o, i) => {
        if (o.type === 'list') {
          return (
            <GenericPageList key={i} listData={o} filterValue={filterString} />
          );
        } else if (o.type === 'subtitle') {
          return <GenericPageSubtitle key={i} {...o} />;
        } else if (o.type === 'tabs') {
          return <GenericPageTabs key={i} {...o} />;
        } else if (o.type === 'container') {
          return <GenericPageContainer key={i} data={o} />;
        } else if (o.type === 'widgets') {
          return <GenericPageWidgets key={i} data={o.data} />;
        } else if (o.type === 'chat') {
          return <ProjectChat key={i} projectId={o.projectId} />;
        } else if (o.type === 'iframe') {
          return (
            <GenericPageIframe
              key={i}
              url={o.url}
              // sendDataToFrame={o.sendDataToFrame}
            />
          );
        } else if (o.type === 'customComponent') {
          return createElement(o.value, {key: i});
        } else {
          return null;
        }
      })}
    </WrapperInner>
  );
};

export default GenericPage;
