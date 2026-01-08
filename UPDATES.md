# AnchorOne Updates

---

## 2026-01-08 - GitHub Pages Web Version

### New Web-Specific Pages
- `src/screens/web/LandingScreen.js` - Hero section, features grid, CTA buttons
- `src/screens/web/DonateScreen.js` - Ko-fi, Buy Me a Coffee, PayPal with ethical wording
- `src/screens/web/PrivacyPolicyScreen.js` - AdSense-ready privacy policy
- `src/screens/web/AboutScreen.js` - Mission, values, roadmap

### PWA Support
- `web/manifest.json` - PWA manifest for installability
- `web/service-worker.js` - Offline caching support
- `web/index.html` - HTML template with PWA meta tags, OG tags

### Deployment Setup
- `.github/workflows/deploy.yml` - GitHub Actions for automatic deployment
- `DEPLOYMENT.md` - Step-by-step deployment guide

### Configuration Changes
- `app.json` - Added web output:static, themeColor, description
- `package.json` - Added build:web, predeploy, deploy scripts

### Navigation Updates
- `RootNavigator.js` - Added web-specific routes (WebLanding, WebDonate, WebPrivacy, WebAbout)
- `screens/index.js` - Export web screens
- Added Platform detection via isWeb constant

### New Components
- `src/components/web/AdPlaceholder.js` - Hidden AdSense placeholder (easy toggle for future)

### Personalization
- Ko-fi: `https://ko-fi.com/globencabildo`
- PayPal: `https://paypal.me/GlobenXanderCabildo`
- Contact Email: `globencastro2004@gmail.com`
- GitHub Pages: `https://nebolg.github.io/AnchorOne`

---

## 2026-01-06 - Feedback System

### New: FeedbackScreen
- 5 feedback types: Bug Report, Feature Request, Improvement, Content Issue, Other
- 9 app areas to categorize feedback
- Submit tab with type selection cards
- History tab showing all submitted feedback with status badges
- Yearly projection showing potential savings

### feedbackStore
- Local persistence with AsyncStorage
- Status tracking: pending, reviewed, implemented, closed
- Delete, view history, stats

### Developer Analytics Dashboard
- **Active Users**: DAU, WAU, MAU tracking
- **Session tracking**: First seen, last active, session count
- **Activity tracking**: Screen visits, user actions
- **Top screens**: 7-day screen visit analytics
- **App versions**: User distribution by version
- **System health**: DB status, memory, uptime

### Admin Access
- Dashboard: `http://localhost:3001/admin/index.html`
- Feedback: `http://localhost:3001/admin/feedback.html`
- Admin key: `anchorone-dev-2024`

---

## 2026-01-06 - Bug Fixes & UI Improvements

### Fixed: Community Comment Count
- Posts now correctly display comment count from API (`comment_count` field)
- Fixed in `communityStore.js` `fetchPosts` method

### Fixed: Accessibility Settings 
- Created `useAccessibleTypography` hook in theme for text scaling
- High contrast mode now works through `useColors` hook
- Bold text setting now applies globally

### Improved: SobrietyRings Navigation
- Added smooth spring animation on press (AnimatedPressable)
- Scale animation from 1.0 → 0.97 on press for visual feedback

### Verified Working: Live Support Groups
- Chat functionality operational
- 8 moderated chat rooms available
- Real-time messaging with usernames
- Input validation and send button states

---

## 2026-01-06 - Per-Addiction Data Filtering

### Analytics Dashboard
- Added addiction filter tabs with "All" + individual addictions
- Stats now filter: days clean, cravings, slips, money saved
- Each metric shows data for selected addiction only

### Money Saved Card
- Shows total savings when "All" selected
- Per-addiction breakdown tabs with savings amount
- Animated switching between addiction views

### Money Saved Improvements
- Research-based default costs (2024 data: Alcohol $10, Cigarettes $10, Gambling $50)
- Added 12 addiction types with cost descriptions
- Yearly projection shows potential savings
- Modal shows addiction icons and cost explanations
- Fixed Analytics useMemo dependencies for proper filtering

---

## 2026-01-06 - Quick Access Distribution

### Community Tab
- **Live Support Groups** - Join moderated chat rooms
- **Success Stories** - Read inspiring recovery stories

### Progress Tab  
- **Achievements** - View badges and accomplishments
- **Analytics Dashboard** - Detailed recovery statistics
- **Weekly Progress** - 7-day summary and trends

### Insights Tab
- **My Triggers** - Manage trigger profiles
- **Challenges** - Group challenges
- **Coping Toolkit** - Evidence-based techniques
- **Guided Programs** - Structured recovery journeys

### Profile Tab (kept)
- Full settings and all feature access

---

## 2026-01-06 - Final Backlog Completion

### Journal PDF Export
- `journalExportService.js` - Generate styled PDF from journal entries
- Uses expo-print, expo-sharing, expo-file-system
- Beautiful HTML template with stats and formatted entries

### AI Pattern Detection
- `patternDetectionService.js` - Comprehensive pattern analysis
- Peak craving times, trigger correlations, mood-craving links
- Risk level calculation and personalized insights generation

### Success Stories Library
- `successStoriesStore.js` - 5 curated recovery stories
- `SuccessStoriesScreen.js` - Filter by addiction type, save favorites
- User story submission support

### Live Support Groups
- `liveSupportStore.js` - 8 moderated chat rooms
- `LiveSupportScreen.js` - Real-time messaging UI
- Topics: General, Alcohol, Smoking, Gambling, Drugs, Digital, First Week, Parents

### Guided Recovery Programs  
- `guidedProgramsStore.js` - 3 structured programs
- `GuidedProgramsScreen.js` - Day-by-day activity tracking
- Programs: First 30 Days, Mindfulness Journey, Anxiety Toolkit

### ProfileScreen Quick Access Updates
- Added Success Stories, Guided Programs, Live Support navigation links

### Dependencies Installed
- `expo-print`, `expo-sharing`, `expo-file-system`

---

## 2026-01-06 - UI Integration & Navigation

### ProfileScreen Quick Access
- Added **Quick Access** section with 4 feature links: Achievements, Challenges, Coping Toolkit, Analytics
- Added `All Notification Settings` link in Notifications section
- Added **Accessibility** section with Text & Display settings link

### Navigation Entry Points
- All 12 new screens now accessible from ProfileScreen
- Features: Achievements, Challenges, Coping Toolkit, Analytics Dashboard, Trigger Profile, Notification Settings, Weekly Progress, Accessibility Settings

---

## 2026-01-06 - Major Feature Expansion (Phases 6 & 7)

### Offline Data Sync (Phase 6)
- `syncStore.js` - Queue pending actions when offline, auto-sync on reconnect
- Connectivity monitoring with NetInfo
- Retry logic for failed sync operations

### Accessibility Improvements (Phase 7)
- `accessibilityStore.js` - Text size, motion, contrast, touch target settings
- `AccessibilitySettingsScreen.js` - Full settings screen with live preview
- 4 text size options: Small, Default, Large, Extra Large
- Reduce motion, high contrast, bold text, larger touch targets

### Multi-Language Support (Phase 7)
- `localizationStore.js` - 12 languages with translation keys
- Languages: English, Spanish, French, German, Portuguese, Italian, Japanese, Korean, Chinese, Arabic (RTL), Hindi, Russian
- Translation keys for common UI, home, recovery, emotions, community

### New Files Created
- `src/store/syncStore.js`
- `src/store/accessibilityStore.js`
- `src/store/localizationStore.js`
- `src/screens/AccessibilitySettingsScreen.js`

---

## 2026-01-06 - Major Feature Expansion (Phase 5)

### Push Notification System
- `notificationStore.js` - Preferences for 7 notification types with scheduling
- `notificationService.js` - Expo notifications integration for scheduling reminders
- Support for daily check-ins, mood reminders, challenge alerts, milestones

### Notification Settings Screen
- `NotificationSettingsScreen.js` - Toggle controls for each notification type
- Master push notification toggle with permission handling
- Per-notification time customization

### Weekly Progress Summary
- `WeeklyProgressScreen.js` - Comprehensive weekly stats and insights
- Shows clean days, cravings, slips, mood trends, money saved
- Challenge progress tracking and encouragement messages

### New Files Created
- `src/store/notificationStore.js`
- `src/services/notificationService.js`
- `src/screens/NotificationSettingsScreen.js`
- `src/screens/WeeklyProgressScreen.js`

---

## 2026-01-06 - Major Feature Expansion (Phase 4)

### Achievement System
- `achievementStore.js` - 22 badges across 4 categories (Streaks, Activity, Community, Challenges)
- `AchievementsScreen.js` - Badge grid with progress tracking and detail modals
- Automatic achievement unlock detection based on user stats

### Coping Toolkit
- `CopingToolkitScreen.js` - 8 evidence-based coping techniques
- Techniques: Breathing, 5-4-3-2-1 Grounding, Muscle Relaxation, Meditation, Cold Water Reset, Movement Break, Distraction Games, Safe Place Visualization
- Interactive step-by-step guides for each technique

### Daily Affirmations 2.0
- `affirmationsData.js` - 40 recovery affirmations across 6 categories
- Categories: Strength, Hope, Self Love, Progress, Resilience, Peace
- Daily affirmation rotation and category filtering

### New Files Created
- `src/store/achievementStore.js`
- `src/data/affirmationsData.js`
- `src/screens/AchievementsScreen.js`
- `src/screens/CopingToolkitScreen.js`

---

## 2026-01-06 - Major Feature Expansion (Phases 2 & 3)

### Phase 2: Analytics & Insights
- `moodStore.js` - Mood tracking with sleep quality and energy levels
- `MoodCheckInModal.js` - Multi-step mood check-in with sleep/energy tracking
- `AnalyticsDashboardScreen.js` - Comprehensive recovery statistics dashboard
- `triggerStore.js` - Trigger management with coping strategy profiles
- `TriggerProfileScreen.js` - Create personalized coping plans per trigger

### Phase 3: Community & Social
- `accountabilityStore.js` - Accountability partner buddy system
- `challengeStore.js` - Group challenges with 5 templates and progress tracking
- `ChallengesScreen.js` - Join challenges, log daily progress, track completion

### New Files Created
- `src/store/moodStore.js`
- `src/store/triggerStore.js`
- `src/store/accountabilityStore.js`
- `src/store/challengeStore.js`
- `src/components/home/MoodCheckInModal.js`
- `src/screens/AnalyticsDashboardScreen.js`
- `src/screens/TriggerProfileScreen.js`
- `src/screens/ChallengesScreen.js`

### Files Modified
- `src/store/index.js` - Added all new store exports
- `src/screens/index.js` - Added new screen exports
- `src/navigation/RootNavigator.js` - Added 4 new routes

---

## 2026-01-06 - Major Feature Expansion (Phase 1)

### Money Saved Calculator
- `moneySavedStore.js` - Zustand store with cost settings per addiction
- `MoneySavedCard.js` - Animated counter with configuration modal
- Displays total money saved since starting recovery
- Configurable daily costs per addiction type

### Health Timeline
- `healthData.js` - 8 addiction-specific recovery timelines with scientific milestones
- `HealthTimelineScreen.js` - Visual timeline with progress indicators
- Milestones from 20 minutes to 1 year per addiction type
- Shows achieved vs upcoming recovery benefits

### Theme Color Picker
- Updated `themeStore.js` - Added 6 accent color options
- `ThemePickerModal.js` - Color swatch selector with live preview
- Colors: Teal, Ocean Blue, Lavender, Rose, Amber, Emerald
- Added to ProfileScreen in Appearance section

### Enhanced Security Features
- `securityStore.js` - Biometric, panic mode, and auto-lock settings
- `BiometricLock.js` - Face ID / Fingerprint lock screen
- Panic mode with fake calculator disguise
- Triple-tap to reveal real app

### Content Reporting System
- `ReportModal.js` - 6 report reasons with notes field
- `reports.js` backend route - Submit, list, and review reports
- Report reasons: Harmful, Spam, Harassment, Misinformation, Inappropriate, Other
- Success confirmation flow

### Files Created
- `src/store/moneySavedStore.js`
- `src/store/securityStore.js`
- `src/components/home/MoneySavedCard.js`
- `src/components/settings/ThemePickerModal.js`
- `src/components/security/BiometricLock.js`
- `src/components/community/ReportModal.js`
- `src/screens/HealthTimelineScreen.js`
- `src/data/healthData.js`
- `backend/src/routes/reports.js`

### Files Modified
- `src/screens/HomeScreen.js` - Added MoneySavedCard
- `src/screens/InsightsScreen.js` - Added Health Timeline entry
- `src/screens/ProfileScreen.js` - Added Accent Color picker
- `src/store/themeStore.js` - Added accent color support
- `src/services/api.js` - Added submitReport method
- `src/navigation/RootNavigator.js` - Added HealthTimeline route

---

## 2026-01-06 - In-App Notifications & Recovery-Focused Copy

### Updated Existing Copy (Phase 1)
- `WelcomeScreen.js` - "Welcome to AnchorOne" with supportive messaging
- `SlipModal.js` - "Had a slip?" with non-judgmental confirmation
- `CravingLogModal.js` - "Log a craving" with awareness messaging
- `MoodSelector.js` - "How are you feeling today?" with helper text

### New Notification Components (Phase 2)
- `NotificationCopy.js` - Centralized copy constants for 13 notification types
- `MilestoneModal.js` - Soft milestone celebration modal
- `CrisisSupportCard.js` - Inline support resources card

### Milestone Auto-Trigger System
- `useMilestoneTracker.js` - Hook to detect and track milestone achievements
- Integrated into `HomeScreen.js` - Automatically shows celebration modal
- Milestones tracked: 1 Day, 3 Days, 1 Week, 2 Weeks, 1 Month, 2 Months, 3 Months, 6 Months, 1 Year
- Persisted in AsyncStorage to avoid repeat celebrations

### Language Guidelines Applied
- No competitive or guilt-based messaging
- Treats slips as learning opportunities, not failures
- Focus on reflection, progress, and dignity

---

## 2026-01-06 - Replaced All Emojis with Custom Ionicons

### Mood Icons (5 emojis → Ionicons)
- 😊 → `happy` | 🙂 → `happy-outline` | 😐 → `remove-circle` | 😔 → `sad-outline` | 😢/😰 → `sad`
- Updated: `JournalModal.js`, `SlipModal.js`, `SlipAnalyticsScreen.js`

### Intent Reasons (8 emojis → Ionicons)
- 💪 → `fitness` | ❤️ → `heart` | 💰 → `wallet` | 🧠 → `bulb`
- 🎯 → `locate` | 🌟 → `star` | 👨‍👩‍👧‍👦 → `people` | 🪞 → `person`
- Updated: `IntentScreen.js`

### Insight Cards (3 emojis → Ionicons)
- 📊 → `bar-chart` | 🔥 → `flame` | 😊 → `happy` | 💡 → `bulb`
- Updated: `InsightsScreen.js`

### Game Feedback (4 emojis → Ionicons)
- 🔥 → `flame` | ⚡ → `flash` | 💪 → `fitness` | 👊 → `hand-left` | 🎉 → `trophy`
- Updated: `DistractionScreen.js`

### Affirmation Card (1 emoji → Ionicons)
- ✨ → `sparkles`
- Updated: `AffirmationCard.js`

### Backend Addiction Seeds (8 emojis → icon names)
- 🍺 → `wine` | 🚬 → `smoke-free` | 💊 → `biotech` | 🔞 → `shield-lock`
- 🎰 → `dice-6` | 🎮 → `game-controller` | 📱 → `phone-portrait` | 🍭 → `leaf`
- Updated: `backend/src/db/seed.js`

### Addiction Icon Rendering (text → IconRenderer)
- Fixed `ProfileScreen.js` - addiction list now uses IconRenderer
- Fixed `CravingLogModal.js` - craving selection now uses IconRenderer

---

## 2026-01-05 - Community Tab & Story Depth Dark Mode Comprehensive Fix (Phase 6)

### CommunityScreen - Full Theme Coverage:
- Container background, header title/subtitle
- New post button (background, icon)
- Filter tabs (background, border, text - both active and inactive)
- PostCard receives `themeColors` prop for all internal elements
- PostCard: avatar, username, timeAgo, milestone badge, owner actions icons
- PostCard: content text, interactions container border
- PostCard: reaction icons/counts, comment icon/count

### CommentsScreen (Story Depth) - Full Theme Coverage:
- Comment items border left color
- Comment avatar (background, icon color)
- Comment user name, time text
- Comment content text
- Action buttons (heart icon, like text)
- Delete icon
- Floating input container (background, border)
- Input text color, placeholder color
- Send button (background, icon)

---

## 2026-01-05 - Story Depth, Share Insight, Slip History, Slip Analytics Dark Mode (Phase 5)

### All Target Features Fixed:

**CommentsScreen (Story Depth)** - 15+ elements:
- Error icon/text, avatar background/border, author name, post time
- Post content, reaction buttons (border, icons, counts)
- Stats divider, comments header icon and title

**CommunityScreen (Share Insight Modal)** - 8 elements:
- Modal container background, cancel button, title
- Text input (background, color, placeholder)
- Post hint (background, icon, text)

**SlipInsights (Slip History)** - 12 elements:
- Loading indicator, empty state (icon, title, text)
- Stats values/labels, divider, card title
- View all button (background, icons, text)
- History toggle (background, icons, text, no history text)

**SlipAnalyticsScreen** - 21 elements:
- Period buttons (background, text)
- Empty state (icon, title, text)
- Stats row (values, labels)
- All section titles (Severity Trend, Day Chart, Triggers, Mood Patterns, By Addiction)
- Trend values/subtitles, day labels/counts
- Trigger names/percentages, mood labels/counts, addiction names/counts

**InsightsScreen** - 8 elements:
- Container background, header title/subtitle
- InsightCard color props
- Heatmap section title/subtitle

---

## 2026-01-05 - Complete Dark Mode Audit (Phase 4)

### All Modals & Support Screens Fixed:

**SupportScreen** - Complete overhaul:
- Intro section (background, icon, text)
- Location badge (background, text)
- 4 filter pills (background, border, icon, text)
- Fallback notice (background, icon, text)
- International section (icon, title, subtitle, ResourceCard prop)
- Breathe card (icon background, title, description)
- Disclaimer text

**BattleButton (Drop Anchor Modal)**:
- Action items now use `themeColors.background.secondary`
- Close button uses dynamic background

**CravingLogModal** - All 3 steps:
- Step 1: Addiction cards (background, text)
- Step 2: Trigger chips (background, text, icons)
- Step 3: Notes input (background, border, text, placeholder), Summary card (background, all labels)

**SlipModal** - All 3 steps:
- Step 1: Addiction items (background, text)
- Step 2: Severity items (background, label, description)
- Step 3: Trigger items (background, icon, text)

### Total Elements Fixed This Phase: 50+ UI elements

---

## 2026-01-05 - White Card Background Dark Mode Fix (Phase 3)

### Fixed White Backgrounds in Dark Mode:
- **BreathingScreen** - Tips section now uses `themeColors.background.card`
- **DistractionScreen** - Activity cards, hero icon use dynamic card backgrounds
- **JournalModal** - Mood buttons, prompt chips, input, footer all themed
- **SupportScreen** - ResourceCard uses dynamic card background and text colors

### All 5 User-Reported White Card Issues: RESOLVED ✅

---

## 2026-01-05 - Deep Component Dark Mode Audit (Phase 2)

### Components Fixed with Dynamic Theme Colors:
- **CravingSlider** - Question text now uses themeColors.text.primary
- **SlipInsights** - Stats title, period now use dynamic colors
- **BattleButton** - Modal container, menu header, action items, close text all themed
- **Button** - Added useColors import for secondary text variant

### Modal/Popup Backgrounds Fixed:
- BattleButton modal now uses `themeColors.background.card` for proper dark mode visibility

### Total Coverage: 15 screens + 7 components with full dark mode support

---

## 2026-01-05 - Comprehensive Dark Mode Audit (All Screens)

### Added Dynamic Theme Support To:
- **EditProfileScreen** - Container, header, title, back button, save text
- **MessagesScreen** - Container, header, back icon, title, privacy note
- **DistractionScreen** - Container, header, activity cards, icons
- **BreathingScreen** - Container, header, close icon, title
- **UserProfileScreen** - Container, floating header, back icon
- **CommentsScreen** - Container, header, title, back icon
- **SlipAnalyticsScreen** - Container, header, title
- **JournalHistoryScreen** - Container, header, cards, date badges
- **SupportScreen** - Container, header, title
- **AccountScreen** - Container, header, title

### Components Updated:
- **SobrietyRings** - Ring track visibility fix with `text.muted + 30%` opacity

### Total: 15 screens + 4 home components + 3 modals + MainTabs now dark mode ready

---

## 2026-01-05 - Dark Mode Feature (Global Fix)

### Added
- **Theme Store**: `themeStore.js` with zustand for theme state management
- **Dark Color Palette**: Cozy dark theme with deep navy backgrounds
- **useColors() Hook**: Dynamic theme colors based on current mode
- **Toggle in Profile**: Appearance section with Dark Mode toggle

### Dark Mode Colors
- Backgrounds: Deep navy (#0F172A, #1E293B)
- Text: Light slate (#F1F5F9, #CBD5E1)
- Primary colors (teal, blue, violet) unchanged for brand consistency
- Status bar automatically adapts to theme

### Screens Updated with Dynamic Colors
- **HomeScreen** - Background, header, greeting text, cards
- **ProgressScreen** - Background, title, addiction tabs, milestones
- **CommunityScreen** - Background, posts, filters, icons
- **InsightsScreen** - Background, stats cards, heatmap, section titles
- **ProfileScreen** - All settings rows, toggles, sections (was working)
- **MainTabs** - Bottom tab bar background and icon colors

### Files Changed
- `src/store/themeStore.js` (NEW)
- `src/theme/colors.js`
- `src/theme/index.js`
- `src/store/index.js`
- `src/screens/HomeScreen.js`
- `src/screens/ProgressScreen.js`
- `src/screens/CommunityScreen.js`
- `src/screens/InsightsScreen.js`
- `src/screens/ProfileScreen.js`
- `src/components/common/Card.js`
- `src/navigation/MainTabs.js`
- `App.js`

---

## 2026-01-05 - Removed Gradient Buttons

### Changed
- All gradient buttons replaced with premium solid buttons
- Added shadow glow effects for depth and premium feel
- Button component now uses solid teal with colored shadow
- BattleButton FAB uses solid teal ring design
- QuickActions emergency button uses solid red with shadow

### Files Changed
- `src/components/common/Button.js`
- `src/components/support/BattleButton.js`
- `src/components/home/QuickActions.js`

---

## 2026-01-05 - Logo Update

### Changed
- Updated app logo on WelcomeScreen and RegisterScreen
- New premium logo with rounded corners and centered layout
- Logo copied to `assets/logo.png`

### Files Changed
- `assets/logo.png` (NEW)
- `src/screens/onboarding/WelcomeScreen.js`
- `src/screens/auth/RegisterScreen.js`

---

## 2026-01-04 - Enhanced Craving Log Modal

### Improvements
- **3-Step Wizard Flow**: Cleaner UX with step-by-step progression
- **Visual Intensity Meter**: Large circular display with color-coded feedback
- **Multi-Select Triggers**: 8 trigger options with color indicators
- **Notes Section**: Optional context for pattern recognition
- **Summary Card**: Review before submitting
- **Coping Suggestions**: After logging, shows quick coping strategies
- **Haptic Feedback**: Vibration on intensity change (mobile)
- **Smooth Animations**: Slide transitions between steps

---

## 2026-01-04 - Enhanced Reflection Modal

### Improvements
- **Mood Selector**: 5 mood options (Great, Good, Okay, Low, Anxious) with emoji icons
- **Reflection Prompts**: 5 prompts (Free Write, Gratitude, Challenge, Goal Check, Trigger)
- **Word & Character Count**: Real-time stats display
- **Success Animation**: Confirmation screen after saving
- **Smooth Animations**: Fade-in and slide transitions
- **Privacy Badge**: Reassurance of encrypted storage

---

## 2026-01-04 - Account Management System

### Added
- **Backend Auth Endpoints**
  - `POST /auth/register` - Email/password registration
  - `POST /auth/login` - Email/password login
  - `POST /auth/logout` - Logout user
  - `DELETE /auth/account` - Delete account and all data
  - `GET /auth/export` - Export all user data (GDPR)
  - `POST /auth/change-password` - Change password

- **New Screens**
  - `LoginScreen` - Email/password + Google sign-in
  - `RegisterScreen` - Create account with validation
  - `AccountScreen` - Manage account settings

### Enhanced
- **ProfileScreen** - Added "Account settings" link
- **API Service** - Added login, register, logout, deleteAccount, exportData methods
- **Database** - Added email and password_hash columns to users table

### Files Changed
- `backend/src/routes/auth.js`
- `src/screens/auth/LoginScreen.js` (NEW)
- `src/screens/auth/RegisterScreen.js` (NEW)
- `src/screens/AccountScreen.js` (NEW)
- `src/services/api.js`
- `src/navigation/RootNavigator.js`
- `src/screens/ProfileScreen.js`

---

## 2026-01-04 - App-Wide Animation & UI Enhancements

### Added
- **`src/utils/animations.js`** - Reusable animation utilities
  - Spring configurations (gentle, wobbly, stiff, soft)
  - Fade, slide, scale, pulse animations
  - Floating and rotation effects
  - Press feedback helpers

### Enhanced
- **WelcomeScreen** - Premium redesign
  - Staggered element animations
  - Floating logo with background orbs
  - Spring-based button interactions
  
- **Button Component** - Spring-based scale animation on press
- **Card Component** - Fade-in slide animation on mount
- **LocationScreen** - Auto-detect location with permission handling
- **HomeScreen** - Staggered entrance for all sections

### Files Changed
- `src/utils/animations.js` (NEW)
- `src/screens/onboarding/WelcomeScreen.js`
- `src/screens/onboarding/LocationScreen.js`
- `src/screens/HomeScreen.js`
- `src/components/common/Button.js`
- `src/components/common/Card.js`

---

## 2026-01-04 - Slip Tracking System

### Added
- **Database**: New `slips` table with comprehensive tracking fields
  - Addiction ID, severity (1-5), trigger, moods before/after
  - Notes, learnings, streak days lost
  - Indexed for efficient querying

- **Backend API**: `/api/slips` endpoints
  - `POST /` - Log a new slip
  - `GET /` - Get all slips (with filtering)
  - `GET /stats` - Get slip statistics (triggers, patterns)
  - `PATCH /:id` - Update slip notes/learnings
  - `DELETE /:id` - Remove a slip

- **Frontend**: Enhanced SlipModal component
  - 4-step wizard flow
  - Step 1: Select addiction
  - Step 2: Rate severity (1-5)
  - Step 3: Identify trigger + mood before/after
  - Step 4: Reflect & learn (optional notes)
  - Compassionate, non-judgmental messaging

- **HomeScreen Improvements**
  - Clickable profile avatar (navigates to Profile)
  - Shows real avatar image or custom icon
  - Dynamic greeting (morning/afternoon/evening)
  - "Had a slip?" button for honest logging

### Files Changed
- `backend/src/db/migrate_slips.js` (NEW)
- `backend/src/routes/slips.js` (NEW)
- `backend/src/index.js` (added slips routes)
- `src/services/api.js` (added slip API methods)
- `src/components/home/SlipModal.js` (NEW)
- `src/components/home/index.js` (export SlipModal)
- `src/screens/HomeScreen.js` (improved UI, avatar, slip button)

---

## 2026-01-04 - Slip Analytics Screen

### Added
- **SlipAnalyticsScreen** - Dedicated deep analytics for slip tracking
  - Day-of-week chart showing when slips happen most
  - Severity trend analysis (improving/stable/increasing)
  - Top triggers breakdown with percentage bars
  - Mood correlation (before vs after slip comparison)
  - Slips by addiction breakdown
  - Period selector (7/30/90 days)

- **SlipInsights** - Progress screen integration
  - View Full Analytics button → opens SlipAnalyticsScreen
  - Accepts navigation prop for routing

### Files Changed
- `src/screens/SlipAnalyticsScreen.js` (NEW)
- `src/screens/index.js` (added export)
- `src/navigation/RootNavigator.js` (added route)
- `src/components/progress/SlipInsights.js` (added navigation prop and View Full Analytics link)
- `src/screens/ProgressScreen.js` (pass navigation to SlipInsights)

---

## 2026-01-04 - Distraction Screen Enhancement

### Changed
- Removed gradient backgrounds from DistractionScreen
- Now uses solid `colors.background.primary` matching homepage
- Kept gradients only for interactive elements (buttons, icons)

### Files Changed
- `src/screens/DistractionScreen.js` (complete rewrite)

---

## 2026-01-04 - Location Localization

### Added
- Country selection during onboarding
- Localized crisis resources for US, UK, AU, CA, PH, SG, IN
- International resources section always visible
- Phone number sanitization for various formats

### Files Changed
- `src/data/crisisResources.js`
- `src/store/userStore.js` (country field)
- `src/screens/onboarding/LocationScreen.js` (NEW)
- `src/screens/SupportScreen.js`
- `backend/src/db/migrate_profile_fields.js`
- `backend/src/routes/users.js`

---

<!-- End of UPDATES.md -->
