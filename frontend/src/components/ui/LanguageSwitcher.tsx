import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = {
    en: { label: 'English', shortLabel: 'EN' },
    'pt-BR': { label: 'Português', shortLabel: 'PT' }
};

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pt-BR' : 'en';
        i18n.changeLanguage(newLang);
    };

    const currentLang = i18n.language.startsWith('pt') ? 'pt-BR' : 'en';

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
            title={languages[currentLang === 'en' ? 'en' : 'pt-BR'].label}
        >
            {languages[currentLang].shortLabel}
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M17 16l-4-4m0 0l4-4m-4 4h7"
                />
            </svg>
        </button>
    );
};
