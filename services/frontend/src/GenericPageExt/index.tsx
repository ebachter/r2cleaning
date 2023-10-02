import {Helmet} from 'react-helmet-async';
import WrapperOuter from './ExtPageWrapper';
import AppAppBar from './HeaderOuter/AppAppBar';
import {List, Grid, Typography} from '@mui/material';
import Image from './CustomImage';
import ExtPageHeaderImage from './ExtPageHeaderImage';
import SectionGrey from './SectionGrey';
import PointsBox from './PointsBox';
// import TitleUnderlined from './TitleUnderlined';
// import SubtitleUnderlined from './SubtitleUnderlined';
import ExtPageHeaderText from './ExtPageHeaderText';
import {ExtPageType} from '../types/typesExtPage';
import {
  CustomDivider,
  ExtTypoTextMain,
  // CustomTypoSubtitle1,
  CustomTypoTitle,
} from './CustomTypo';
import {Fragment, createElement} from 'react';
import {Box} from '@mui/system';
import AuthForm from './ExtPageForm';

const GenericPageExt = ({
  pageTitle,
  content,
  bodyMargin,
}: {
  pageTitle: string;
  content: ExtPageType;
  bodyMargin?: boolean;
}) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <AppAppBar />
      <WrapperOuter bodyMargin={!!bodyMargin}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="left"
        >
          {content.map((sectionData, i) => {
            const {type} = sectionData;
            if (type === 'formData') {
              const {data} = sectionData;
              return <AuthForm key={i} formData={data} />;
            }
            if (type === 'header_simple') {
              const {text} = sectionData;
              return (
                <Typography
                  color="textPrimary"
                  variant="h4"
                  style={{marginBottom: 30}}
                  key={i}
                >
                  {text}
                </Typography>
              );
            }
            if (type === 'textbox_simple') {
              const {texts} = sectionData;
              return (
                <Box key={i} sx={{mt: 1, mb: 1}}>
                  {texts.map((tmp, i) => {
                    if ('title' in tmp)
                      return (
                        <Typography
                          key={i}
                          color="textPrimary"
                          variant="subtitle1"
                          sx={{mt: 0.3, mb: 0.3, fontWeight: 'bold'}}
                        >
                          {tmp.title}
                        </Typography>
                      );
                    if ('primary' in tmp)
                      return (
                        <Typography key={i} color="text.primary" sx={{mt: 2}}>
                          {tmp.primary}
                        </Typography>
                      );
                    if ('secondary' in tmp)
                      return (
                        <Typography
                          key={i}
                          color="text.secondary"
                          sx={{whiteSpace: 'pre-line'}}
                        >
                          {tmp.secondary}
                        </Typography>
                      );
                  })}
                </Box>
              );
            }

            if (type === 'header_image') {
              const {path, text, responsive, width} = sectionData;
              return (
                <ExtPageHeaderImage
                  key={i}
                  path={path}
                  responsive={responsive}
                  text={text}
                  width={width}
                />
              );
            }

            if (type === 'header_text') {
              const {title, text} = sectionData;
              return <ExtPageHeaderText key={i} title={title} text={text} />;
            }

            if (type === 'label_text') {
              const {label, text} = sectionData;
              return (
                <SectionGrey key={i}>
                  <Grid item xs={12} sm={6}>
                    <CustomTypoTitle>
                      <Box sx={{whiteSpace: 'pre-wrap'}}>{label}</Box>
                      <CustomDivider />
                    </CustomTypoTitle>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ExtTypoTextMain align="left" color="light">
                      <Box sx={{whiteSpace: 'pre-wrap'}}>{text}</Box>
                    </ExtTypoTextMain>
                    {/* <SubtitleUnderlined text={text} color={'textSecondary'} /> */}
                  </Grid>
                </SectionGrey>
              );
            }

            if (type === 'points1_points2') {
              const {section, subHeader, points, points2} = sectionData;
              return (
                <SectionGrey key={i} alignItems={'flex-start'}>
                  <Grid item xs={12}>
                    <CustomTypoTitle>{section}</CustomTypoTitle>
                    <CustomDivider />
                  </Grid>
                  {/* <TitleUnderlined text={section} /> */}
                  <Grid item xs={12}>
                    <ExtTypoTextMain align="left">{subHeader}</ExtTypoTextMain>
                    {/* <SubtitleUnderlined text={subHeader} /> */}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List>
                      <PointsBox points={points} />
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List>
                      <PointsBox points={points2 || []} />
                    </List>
                  </Grid>
                </SectionGrey>
              );
            }
            if (type === 'points_image') {
              const {section, points, text, path, icons_bottom, subHeader} =
                sectionData;
              return (
                <Fragment key={i}>
                  <SectionGrey key={i} alignItems={'flex-end'}>
                    <Grid item xs={12} sm={6} order={{xs: 2, sm: 1}}>
                      <CustomTypoTitle align="left">
                        <Box sx={{whiteSpace: 'pre-wrap'}}>{section}</Box>
                      </CustomTypoTitle>
                      <CustomDivider />
                      {/* <TitleUnderlined text={section} /> */}
                      <List style={{marginBottom: 0, paddingBottom: 0}}>
                        <ExtTypoTextMain align="left">
                          {subHeader}
                        </ExtTypoTextMain>
                        {points && <PointsBox points={points} />}
                        {text && (
                          <ExtTypoTextMain align="left" color="light">
                            <Box sx={{whiteSpace: 'pre-wrap'}}>{text}</Box>
                          </ExtTypoTextMain>
                        )}
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6} order={{xs: 1, sm: 2}}>
                      {<Image path={path} responsive={true} />}
                    </Grid>
                  </SectionGrey>
                  {icons_bottom && parseIcons({icons: icons_bottom})}
                </Fragment>
              );
            }
            if (type === 'image_points') {
              const {section, points, text, path, subHeader, icons_bottom} =
                sectionData;
              return (
                <Fragment key={i}>
                  <SectionGrey alignItems={'flex-end'}>
                    <Grid item xs={12} sm={6}>
                      {path && <Image path={path} responsive={true} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <List>
                        <CustomTypoTitle>{section}</CustomTypoTitle>
                        <CustomDivider />
                        {/* <TitleUnderlined text={section} /> */}
                        {/* <SubtitleUnderlined text={subHeader} /> */}
                        <ExtTypoTextMain align="left">
                          {subHeader}
                        </ExtTypoTextMain>
                        {points && <PointsBox points={points} />}
                        {text && (
                          <ExtTypoTextMain align="left" color="light">
                            <Box sx={{whiteSpace: 'pre-wrap'}}>{text}</Box>
                          </ExtTypoTextMain>
                        )}
                      </List>
                    </Grid>
                  </SectionGrey>
                  {icons_bottom && parseIcons({icons: icons_bottom})}
                </Fragment>
              );
            }

            if (type === 'customComponent') {
              const {value} = sectionData;
              return createElement(value, {key: i});
            }

            throw Error('Unknown element');
          })}
        </Grid>

        {/*
            <div className={classes.extText}>
              <p>{t("about.item2IntroText")}</p>
              <Typography variant="subtitle1">
                {t("about.listRealtimeHeader")}
              </Typography>
              <p>{t("about.listRealtimeText")}</p>
              <Typography variant="subtitle1">
                {t("about.listMultimediaHeader")}
              </Typography>
              <p>{t("about.listMultimediaText")}</p>
              <Typography variant="subtitle1">
                {t("about.listBenefitsHeader")}
              </Typography>
              <p> {t("about.listBenefitsText")}:</p>
              <p>- {t("about.listBenefitsText1")}</p>
              <p>- {t("about.listBenefitsText2")}</p>
              <p>- {t("about.listBenefitsText3")}</p>
              <p>- {t("about.listBenefitsText4")}</p>
              <p>- {t("about.listBenefitsText5")}</p>
            </div>
*/}
      </WrapperOuter>
    </>
  );
};

export default GenericPageExt;

const parseIcons = ({
  icons,
}: {
  icons: {
    label: string;
    path: string;
  }[];
}) => (
  <Grid
    container
    direction="row"
    justifyContent="space-around"
    alignItems="flex-start"
    style={{marginTop: 40, marginBottom: 40}}
  >
    {icons.map(({path, label}, i) => (
      <Grid item key={i}>
        <Grid container justifyContent="center" direction="row">
          <Grid item component="div">
            {<Image path={path} responsive={false} width="80px" />}
          </Grid>
        </Grid>
        <Grid container justifyContent="center" direction="row">
          <Grid item>
            <ExtTypoTextMain color="light">
              <Box sx={{whiteSpace: 'pre-wrap'}}>{label}</Box>
            </ExtTypoTextMain>
          </Grid>
        </Grid>
      </Grid>
    ))}
  </Grid>
);
