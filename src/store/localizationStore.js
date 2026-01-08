// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Localization store with multi-language support

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUPPORTED_LANGUAGES = {
    en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    ko: { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
    hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
};

const TRANSLATIONS = {
    en: {
        common: {
            continue: 'Continue',
            back: 'Back',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            done: 'Done',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            settings: 'Settings',
            profile: 'Profile',
        },
        home: {
            welcome: 'Welcome back',
            streak: 'Day Streak',
            logCraving: 'Log Craving',
            needSupport: 'Need Support?',
            quickActions: 'Quick Actions',
        },
        recovery: {
            daysClean: 'Days Clean',
            yourJourney: 'Your Recovery Journey',
            keepGoing: 'Keep going, you\'re doing amazing!',
            slip: 'I had a slip',
            slipNote: 'Slips happen. This is part of learning.',
        },
        emotions: {
            howFeeling: 'How are you feeling?',
            great: 'Great',
            good: 'Good',
            okay: 'Okay',
            struggling: 'Struggling',
            craving: 'Craving',
        },
        community: {
            title: 'Community',
            share: 'Share your story',
            support: 'Support others',
            anonymous: 'Anonymous',
        },
    },
    es: {
        common: {
            continue: 'Continuar',
            back: 'Atrás',
            save: 'Guardar',
            cancel: 'Cancelar',
            delete: 'Eliminar',
            edit: 'Editar',
            done: 'Hecho',
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            settings: 'Configuración',
            profile: 'Perfil',
        },
        home: {
            welcome: 'Bienvenido de nuevo',
            streak: 'Días consecutivos',
            logCraving: 'Registrar ansia',
            needSupport: '¿Necesitas apoyo?',
            quickActions: 'Acciones rápidas',
        },
        recovery: {
            daysClean: 'Días limpio',
            yourJourney: 'Tu viaje de recuperación',
            keepGoing: '¡Sigue así, lo estás haciendo increíble!',
            slip: 'Tuve una recaída',
            slipNote: 'Las recaídas suceden. Esto es parte del aprendizaje.',
        },
        emotions: {
            howFeeling: '¿Cómo te sientes?',
            great: 'Genial',
            good: 'Bien',
            okay: 'Regular',
            struggling: 'Luchando',
            craving: 'Con ansia',
        },
        community: {
            title: 'Comunidad',
            share: 'Comparte tu historia',
            support: 'Apoya a otros',
            anonymous: 'Anónimo',
        },
    },
    fr: {
        common: {
            continue: 'Continuer',
            back: 'Retour',
            save: 'Enregistrer',
            cancel: 'Annuler',
            delete: 'Supprimer',
            edit: 'Modifier',
            done: 'Terminé',
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès',
            settings: 'Paramètres',
            profile: 'Profil',
        },
        home: {
            welcome: 'Bon retour',
            streak: 'Jours consécutifs',
            logCraving: 'Noter une envie',
            needSupport: 'Besoin de soutien?',
            quickActions: 'Actions rapides',
        },
        recovery: {
            daysClean: 'Jours sobres',
            yourJourney: 'Votre parcours de rétablissement',
            keepGoing: 'Continuez, vous êtes formidable!',
            slip: 'J\'ai eu une rechute',
            slipNote: 'Les rechutes arrivent. Cela fait partie de l\'apprentissage.',
        },
        emotions: {
            howFeeling: 'Comment vous sentez-vous?',
            great: 'Super',
            good: 'Bien',
            okay: 'Ça va',
            struggling: 'En difficulté',
            craving: 'Envie',
        },
        community: {
            title: 'Communauté',
            share: 'Partagez votre histoire',
            support: 'Soutenez les autres',
            anonymous: 'Anonyme',
        },
    },
};

export const useLocalizationStore = create(
    persist(
        (set, get) => ({
            currentLanguage: 'en',
            isRTL: false,

            setLanguage: (langCode) => {
                if (SUPPORTED_LANGUAGES[langCode]) {
                    set({
                        currentLanguage: langCode,
                        isRTL: SUPPORTED_LANGUAGES[langCode].rtl || false,
                    });
                }
            },

            t: (key) => {
                const { currentLanguage } = get();
                const keys = key.split('.');

                let translation = TRANSLATIONS[currentLanguage];
                if (!translation) translation = TRANSLATIONS.en;

                for (const k of keys) {
                    translation = translation?.[k];
                    if (!translation) break;
                }

                if (!translation) {
                    let fallback = TRANSLATIONS.en;
                    for (const k of keys) {
                        fallback = fallback?.[k];
                        if (!fallback) break;
                    }
                    return fallback || key;
                }

                return translation;
            },

            getCurrentLanguage: () => {
                const { currentLanguage } = get();
                return SUPPORTED_LANGUAGES[currentLanguage];
            },

            getAvailableLanguages: () => Object.values(SUPPORTED_LANGUAGES),

            reset: () => set({
                currentLanguage: 'en',
                isRTL: false,
            }),
        }),
        {
            name: 'anchorone-localization',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useLocalizationStore;

// --- End of localizationStore.js ---
