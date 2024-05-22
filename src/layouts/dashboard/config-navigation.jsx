import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  user: icon('ic_user'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('analytics'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('profile'), path: paths.dashboard.user.root },
              { title: t('cards'), path: paths.dashboard.user.cards },
              { title: t('list'), path: paths.dashboard.user.list },
              { title: t('create'), path: paths.dashboard.user.new },
              { title: t('edit'), path: paths.dashboard.user.demo.edit },
              { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

          // BLOG
          {
            title: t('blog'),
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
            children: [
              { title: t('list'), path: paths.dashboard.post.root },
              { title: t('details'), path: paths.dashboard.post.demo.details },
              { title: t('create'), path: paths.dashboard.post.new },
              { title: t('edit'), path: paths.dashboard.post.demo.edit },
            ],
          },

          // JOB
          {
            title: t('job'),
            path: paths.dashboard.job.root,
            icon: ICONS.job,
            children: [
              { title: t('list'), path: paths.dashboard.job.root },
              { title: t('details'), path: paths.dashboard.job.demo.details },
              { title: t('create'), path: paths.dashboard.job.new },
              { title: t('edit'), path: paths.dashboard.job.demo.edit },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
