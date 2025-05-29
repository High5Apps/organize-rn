import { useTranslation } from '../i18n';
import { PostCategory } from '../networking';

export default function usePostCategoryTitles(): {
  [key in PostCategory]: string;
} {
  const { t } = useTranslation();
  return {
    general: t('modifier.general'),
    grievances: t('object.grievance', { count: 100 }),
    demands: t('object.demand', { count: 100 }),
  };
}
