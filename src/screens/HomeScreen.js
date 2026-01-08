// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Home dashboard screen with smooth animations

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Linking, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
    AffirmationCard,
    SobrietyRings,
    MoodSelector,
    QuickActions,
    CravingLogModal,
    JournalModal,
    SlipModal,
    MoneySavedCard,
} from '../components/home';
import { BattleButton } from '../components/support';
import { MilestoneModal } from '../components/notifications';
import { useColors, colors, spacing, typography } from '../theme';
import { useUserStore } from '../store';
import { useMilestoneTracker } from '../hooks/useMilestoneTracker';
import { TIMING, EASING, SPRING } from '../utils/animations';

const ICON_MAP = {
    'compass': 'compass',
    'anchor': 'anchor',
    'heart': 'heart',
    'star': 'star',
    'leaf': 'leaf',
    'flame': 'flame',
    'shield': 'shield-checkmark',
    'diamond': 'diamond',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const HomeScreen = ({ navigation }) => {
    const colors = useColors();
    const { username, isAnonymous, avatarUrl, avatarId, avatarColor, userAddictions } = useUserStore();
    const [showCravingModal, setShowCravingModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [showSlipModal, setShowSlipModal] = useState(false);

    // Milestone auto-trigger
    const { pendingMilestone, celebrateMilestone } = useMilestoneTracker();

    // Animation values
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const ringsOpacity = useRef(new Animated.Value(0)).current;
    const ringsScale = useRef(new Animated.Value(0.95)).current;
    const slipOpacity = useRef(new Animated.Value(0)).current;
    const slipY = useRef(new Animated.Value(20)).current;
    const moodOpacity = useRef(new Animated.Value(0)).current;
    const actionsOpacity = useRef(new Animated.Value(0)).current;
    const affirmationOpacity = useRef(new Animated.Value(0)).current;
    const slipButtonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Staggered entrance animations
        Animated.stagger(100, [
            Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(ringsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(ringsScale, { toValue: 1, ...SPRING.gentle, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(slipOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(slipY, { toValue: 0, duration: 300, easing: EASING.decelerate, useNativeDriver: true }),
            ]),
            Animated.timing(moodOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(actionsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(affirmationOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    const displayName = isAnonymous ? 'Friend' : username || 'Friend';

    const handleLogCraving = () => setShowCravingModal(true);
    const handleJournal = () => setShowJournalModal(true);
    const handleNeedHelp = () => navigation.navigate('Support');
    const handleCallSupport = () => Linking.openURL('tel:988');
    const handleDistract = () => navigation.navigate('Distraction');
    const handleProfilePress = () => navigation.navigate('Main', { screen: 'Profile' });
    const handleLogSlip = () => setShowSlipModal(true);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const handleSlipPressIn = () => {
        Animated.spring(slipButtonScale, { toValue: 0.97, ...SPRING.stiff, useNativeDriver: true }).start();
    };

    const handleSlipPressOut = () => {
        Animated.spring(slipButtonScale, { toValue: 1, ...SPRING.gentle, useNativeDriver: true }).start();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.background.primary }]}>
                <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
                    <View style={styles.greetingContainer}>
                        <Text style={[styles.greeting, { color: colors.text.secondary }]}>{getGreeting()},</Text>
                        <Text style={[styles.name, { color: colors.text.primary }]}>{displayName}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={[styles.brandText, { color: colors.primary.teal }]}>AnchorOne</Text>
                        <Pressable onPress={handleProfilePress} style={styles.avatarPressable}>
                            <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
                        </Pressable>
                    </View>
                </Animated.View>
            </SafeAreaView>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: ringsOpacity, transform: [{ scale: ringsScale }] }}>
                    <SobrietyRings />
                </Animated.View>

                <Animated.View style={{ opacity: ringsOpacity }}>
                    <MoneySavedCard />
                </Animated.View>

                <Animated.View style={[styles.slipSection, { opacity: slipOpacity, transform: [{ translateY: slipY }] }]}>
                    <AnimatedPressable
                        onPress={handleLogSlip}
                        onPressIn={handleSlipPressIn}
                        onPressOut={handleSlipPressOut}
                        style={[styles.slipButton, { backgroundColor: colors.background.card, transform: [{ scale: slipButtonScale }] }]}
                    >
                        <View style={styles.slipIconContainer}>
                            <Ionicons name="reload" size={18} color="#F59E0B" />
                        </View>
                        <View style={styles.slipTextContainer}>
                            <Text style={[styles.slipButtonTitle, { color: colors.text.primary }]}>Had a slip?</Text>
                            <Text style={[styles.slipButtonSubtitle, { color: colors.text.muted }]}>Log it honestly - no judgment</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                    </AnimatedPressable>
                </Animated.View>

                <Animated.View style={{ opacity: moodOpacity }}>
                    <MoodSelector />
                </Animated.View>

                <Animated.View style={{ opacity: actionsOpacity }}>
                    <QuickActions onLogCraving={handleLogCraving} onJournal={handleJournal} onNeedHelp={handleNeedHelp} />
                </Animated.View>

                <Animated.View style={{ opacity: affirmationOpacity }}>
                    <AffirmationCard />
                </Animated.View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            <BattleButton
                onSOSPress={handleNeedHelp}
                onBreathePress={() => navigation.navigate('Breathing')}
                onCallPress={handleCallSupport}
                onDistractPress={handleDistract}
                onJournalPress={handleJournal}
                onMeetingPress={() => navigation.navigate('Support')}
            />

            <CravingLogModal visible={showCravingModal} onClose={() => setShowCravingModal(false)} />
            <JournalModal visible={showJournalModal} onClose={() => setShowJournalModal(false)} navigation={navigation} />
            <SlipModal visible={showSlipModal} onClose={() => setShowSlipModal(false)} />

            {/* Milestone celebration modal - auto-triggers when milestone is reached */}
            <MilestoneModal
                visible={!!pendingMilestone}
                onClose={celebrateMilestone}
                milestone={pendingMilestone}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: { backgroundColor: colors.background.primary, paddingBottom: spacing.sm },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.screenPadding, paddingTop: spacing.sm },
    greetingContainer: { flex: 1 },
    greeting: { fontSize: typography.size.sm, color: colors.text.secondary, fontWeight: '500' },
    name: { fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, color: colors.text.primary, letterSpacing: -0.5 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    brandText: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.primary.teal, letterSpacing: -0.5 },
    avatarPressable: { borderRadius: 24 },
    avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    avatarImage: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.primary.teal },
    logoImage: { width: 48, height: 48, borderRadius: 12 },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: spacing.xs, paddingBottom: 120 },
    slipSection: { paddingHorizontal: spacing.screenPadding, marginTop: spacing.sm, marginBottom: spacing.md },
    slipButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, padding: spacing.md, borderRadius: 16, borderWidth: 1, borderColor: '#F59E0B20' },
    slipIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F59E0B15', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    slipTextContainer: { flex: 1 },
    slipButtonTitle: { fontSize: typography.size.base, fontWeight: typography.weight.semibold, color: colors.text.primary },
    slipButtonSubtitle: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
    bottomPadding: { height: 20 },
});

export default HomeScreen;

// --- End of HomeScreen.js ---
