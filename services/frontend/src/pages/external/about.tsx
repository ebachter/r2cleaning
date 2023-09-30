import {useTranslation} from 'react-i18next';
import GenericPageExt from '../../GenericPageExt';

const AboutPage = () => {
  const {t} = useTranslation('external');
  return (
    <GenericPageExt
      pageTitle="About"
      content={[
        /* {
      section: 'REMROB is ..',
      points: [
        '.. a platform for real-time monitoring and control of IoT objects. REMROB is based on a multi-role model to reduce the complexity and cover different scenarios. The roles are developer, operator and user of an IoT object.'
      ],
    },*/
        {
          type: 'header_image',
          path: '/images/extAbout/about.header.jpg',
          responsive: true,
          text: t('about.pageHeader'),
        },
        {
          type: 'header_text',
          title: 'REMROB - Remote Robotics',
          text: t('about.definition'),
        },
        {
          type: 'label_text',
          label: t('about.list1_label'),
          text: t('about.list1_text')
        },
        {
          type: 'points_image',
          section: t('about.list2_section'),
          subHeader:t('about.list2_subHeader'),
          points: [
            t('about.list2_point1'),
            t('about.list2_point2'),
            t('about.list2_point3'),
            t('about.list2_point4'),
            t('about.list2_point5')
          ],
          // path: '/images/extAbout/users.webp',
          path: '/images/extAbout/about.users.jpg',
        },
        {
          type: 'points1_points2',
          section: t('about.list3_section'),
          subHeader: t('about.list3_subHeader'),
          points: [
            t('about.list3_point1a'),
            t('about.list3_point1b'),
            t('about.list3_point1c'),
          ],
          // path: '/images/extAbout/hwdevs.webp',
          // section2: 'Widget developers',
          points2: [
            t('about.list3_point2a'),
            t('about.list3_point2b'),
            t('about.list3_point2c'),
          ],
        },
        {
          section: t('about.list4_section'),
          subHeader: t('about.list4_subHeader'),
          points: [
            t('about.list4_point1'),
            t('about.list4_point2'),
            t('about.list4_point3'),
            t('about.list4_point4'),
          ],
          path: '/images/extAbout/about.operators.jpg',
          type: 'image_points',
        },
      ]}
    />
  );
};

export default AboutPage;
