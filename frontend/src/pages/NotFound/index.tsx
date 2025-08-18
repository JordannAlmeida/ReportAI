import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-6xl font-bold text-orange">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          {t('notFound.title')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('notFound.description')}
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate('/')} variant="primary">
            {t('common.goHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
