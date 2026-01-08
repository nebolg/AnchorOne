// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Localized crisis resources data with country-specific support options

// Resource types
export const RESOURCE_TYPES = {
    VOICE: 'voice',
    TEXT: 'text',
    CHAT: 'chat',
    PEER: 'peer',
};

// Resource categories for filtering
export const CATEGORIES = {
    CRISIS: 'crisis',
    MENTAL_HEALTH: 'mental_health',
    ADDICTION: 'addiction',
    PEER_SUPPORT: 'peer_support',
};

// Country-specific resources
export const RESOURCES_BY_COUNTRY = {
    US: {
        name: 'United States',
        resources: [
            {
                id: 'us_988',
                name: 'Suicide & Crisis Lifeline',
                description: 'Free, confidential support for people in distress',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '988',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'us_crisis_text',
                name: 'Crisis Text Line',
                description: 'Text-based crisis support',
                type: RESOURCE_TYPES.TEXT,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '741741',
                contactType: 'sms',
                actionText: 'Text HOME',
                icon: 'chatbubble-ellipses',
            },
            {
                id: 'us_samhsa',
                name: 'SAMHSA Helpline',
                description: 'Treatment referral and information',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.ADDICTION,
                availability: '24/7',
                contact: '1-800-662-4357',
                contactType: 'phone',
                icon: 'medkit',
            },
            {
                id: 'us_aa',
                name: 'AA Meetings',
                description: 'Find local Alcoholics Anonymous meetings',
                type: RESOURCE_TYPES.PEER,
                category: CATEGORIES.PEER_SUPPORT,
                availability: 'Various times',
                contact: 'https://www.aa.org/find-aa',
                contactType: 'url',
                icon: 'people',
            },
            {
                id: 'us_na',
                name: 'NA Meetings',
                description: 'Narcotics Anonymous virtual & in-person',
                type: RESOURCE_TYPES.PEER,
                category: CATEGORIES.PEER_SUPPORT,
                availability: 'Various times',
                contact: 'https://www.na.org/meetingsearch/',
                contactType: 'url',
                icon: 'people',
            },
            {
                id: 'us_smart',
                name: 'SMART Recovery',
                description: 'Science-based addiction support',
                type: RESOURCE_TYPES.PEER,
                category: CATEGORIES.PEER_SUPPORT,
                availability: 'Online & in-person',
                contact: 'https://www.smartrecovery.org/community/',
                contactType: 'url',
                icon: 'bulb',
            },
        ],
    },
    GB: {
        name: 'United Kingdom',
        resources: [
            {
                id: 'uk_samaritans',
                name: 'Samaritans',
                description: 'Emotional support for anyone in distress',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '116 123',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'uk_shout',
                name: 'Shout',
                description: 'Free text support service',
                type: RESOURCE_TYPES.TEXT,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '85258',
                contactType: 'sms',
                actionText: 'Text SHOUT',
                icon: 'chatbubble-ellipses',
            },
            {
                id: 'uk_mind',
                name: 'Mind Infoline',
                description: 'Mental health information and support',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.MENTAL_HEALTH,
                availability: 'Mon-Fri 9am-6pm',
                contact: '0300 123 3393',
                contactType: 'phone',
                icon: 'heart',
            },
        ],
    },
    AU: {
        name: 'Australia',
        resources: [
            {
                id: 'au_lifeline',
                name: 'Lifeline',
                description: 'Crisis support and suicide prevention',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '13 11 14',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'au_beyond_blue',
                name: 'Beyond Blue',
                description: 'Anxiety, depression and suicide support',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.MENTAL_HEALTH,
                availability: '24/7',
                contact: '1300 22 4636',
                contactType: 'phone',
                icon: 'heart',
            },
        ],
    },
    CA: {
        name: 'Canada',
        flag: '🇨🇦',
        resources: [
            {
                id: 'ca_988',
                name: 'Suicide Crisis Helpline',
                description: 'National crisis support',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '988',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'ca_crisis_text',
                name: 'Crisis Text Line',
                description: 'Text-based crisis support',
                type: RESOURCE_TYPES.TEXT,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '686868',
                contactType: 'sms',
                actionText: 'Text CONNECT',
                icon: 'chatbubble-ellipses',
            },
        ],
    },
    PH: {
        name: 'Philippines',
        flag: '🇵🇭',
        resources: [
            {
                id: 'ph_ncmh',
                name: 'NCMH Crisis Hotline',
                description: 'National Center for Mental Health',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '1553',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'ph_doh',
                name: 'DOH Mental Health',
                description: 'Department of Health support line',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.MENTAL_HEALTH,
                availability: '24/7',
                contact: '0917-899-8727',
                contactType: 'phone',
                icon: 'medkit',
            },
            {
                id: 'ph_hopeline',
                name: 'Hopeline Philippines',
                description: 'Suicide prevention hotline',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '(02) 804-4673',
                contactType: 'phone',
                icon: 'heart',
            },
            {
                id: 'ph_in_touch',
                name: 'In Touch Community',
                description: 'Crisis support via text and chat',
                type: RESOURCE_TYPES.TEXT,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '0917-558-4673',
                contactType: 'phone',
                icon: 'chatbubble-ellipses',
            },
        ],
    },
    SG: {
        name: 'Singapore',
        flag: '🇸🇬',
        resources: [
            {
                id: 'sg_sos',
                name: 'Samaritans of Singapore',
                description: 'Emotional support for anyone in distress',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '1-767',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'sg_imh',
                name: 'IMH Mental Health Helpline',
                description: 'Institute of Mental Health',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.MENTAL_HEALTH,
                availability: '24/7',
                contact: '6389-2222',
                contactType: 'phone',
                icon: 'medkit',
            },
        ],
    },
    IN: {
        name: 'India',
        flag: '🇮🇳',
        resources: [
            {
                id: 'in_vandrevala',
                name: 'Vandrevala Foundation',
                description: 'Mental health support helpline',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.CRISIS,
                availability: '24/7',
                contact: '1860-2662-345',
                contactType: 'phone',
                icon: 'call',
            },
            {
                id: 'in_icall',
                name: 'iCall',
                description: 'Psychosocial helpline',
                type: RESOURCE_TYPES.VOICE,
                category: CATEGORIES.MENTAL_HEALTH,
                availability: 'Mon-Sat 8am-10pm',
                contact: '9152987821',
                contactType: 'phone',
                icon: 'heart',
            },
        ],
    },
};

// Supported countries list for picker
export const SUPPORTED_COUNTRIES = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'OTHER', name: 'Other / International', flag: '🌍' },
];

// International fallback resources
export const INTERNATIONAL_RESOURCES = [
    {
        id: 'intl_befrienders',
        name: 'Befrienders Worldwide',
        description: 'Find a crisis center in your country',
        type: RESOURCE_TYPES.CHAT,
        category: CATEGORIES.CRISIS,
        availability: 'Varies by location',
        contact: 'https://www.befrienders.org/find-a-helpline',
        contactType: 'url',
        icon: 'globe',
    },
    {
        id: 'intl_iasp',
        name: 'IASP Crisis Centers',
        description: 'International crisis center directory',
        type: RESOURCE_TYPES.CHAT,
        category: CATEGORIES.CRISIS,
        availability: 'Varies by location',
        contact: 'https://www.iasp.info/resources/Crisis_Centres/',
        contactType: 'url',
        icon: 'globe',
    },
    {
        id: 'intl_dharma',
        name: 'Recovery Dharma',
        description: 'Buddhist-inspired online recovery meetings',
        type: RESOURCE_TYPES.PEER,
        category: CATEGORIES.PEER_SUPPORT,
        availability: 'Online meetings worldwide',
        contact: 'https://recoverydharma.org/find-a-meeting',
        contactType: 'url',
        icon: 'leaf',
    },
];

// Get resources for a specific country code
export const getResourcesForCountry = (countryCode) => {
    const upperCode = countryCode?.toUpperCase();
    const countryResources = RESOURCES_BY_COUNTRY[upperCode];

    if (countryResources) {
        return {
            country: countryResources.name,
            resources: countryResources.resources,
            hasLocalResources: true,
        };
    }

    return {
        country: 'International',
        resources: INTERNATIONAL_RESOURCES,
        hasLocalResources: false,
    };
};

// Get type label
export const getTypeLabel = (type) => {
    switch (type) {
        case RESOURCE_TYPES.VOICE: return 'Voice Support';
        case RESOURCE_TYPES.TEXT: return 'Text Support';
        case RESOURCE_TYPES.CHAT: return 'Online Support';
        case RESOURCE_TYPES.PEER: return 'Peer Support';
        default: return 'Support';
    }
};

// Get type color
export const getTypeColor = (type) => {
    switch (type) {
        case RESOURCE_TYPES.VOICE: return '#3B82F6';
        case RESOURCE_TYPES.TEXT: return '#14B8A6';
        case RESOURCE_TYPES.CHAT: return '#8B5CF6';
        case RESOURCE_TYPES.PEER: return '#10B981';
        default: return '#6B7280';
    }
};

// --- End of crisisResources.js ---
