// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: In-app distraction screen with mini-games and grounding exercises

import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ScrollView,
    Animated,
    Easing,
    Dimensions,
    Vibration,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors, colors, spacing, typography } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ACTIVITIES = [
    { id: 'breathing', icon: 'leaf', title: 'Box Breathing', desc: 'Calm your nervous system', color: '#14B8A6', gradient: ['#14B8A6', '#0D9488'] },
    { id: 'grounding', icon: 'earth', title: '5-4-3-2-1 Grounding', desc: 'Come back to the present', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
    { id: 'taptap', icon: 'finger-print', title: 'Focus Tap', desc: 'Channel your energy', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
    { id: 'affirmation', icon: 'heart', title: 'Affirmations', desc: 'Positive reminders', color: '#EC4899', gradient: ['#EC4899', '#DB2777'] },
    { id: 'bubble', icon: 'ellipse', title: 'Pop Bubbles', desc: 'Satisfying stress relief', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] },
];

const AFFIRMATIONS = [
    "This moment will pass.\nI can get through it.",
    "I am stronger than this craving.",
    "Every minute I resist is a victory.",
    "I choose my health and happiness.",
    "I am worthy of a better life.",
    "This urge is temporary.\nMy goals are permanent.",
    "I have survived 100% of my bad days.",
    "I am more than my addiction.",
    "Today, I choose myself.",
    "I can do hard things.",
];

const ActivityHeader = ({ title, subtitle, onBack, color }) => (
    <View style={styles.activityHeader}>
        <Pressable onPress={onBack} style={styles.activityBackBtn}>
            <Ionicons name="close" size={28} color={colors.text.primary} />
        </Pressable>
        <View style={styles.activityHeaderText}>
            <Text style={[styles.activityTitle, { color }]}>{title}</Text>
            {subtitle && <Text style={styles.activitySubtitle}>{subtitle}</Text>}
        </View>
    </View>
);

const BoxBreathingActivity = ({ onBack }) => {
    const [phase, setPhase] = useState('inhale');
    const [count, setCount] = useState(4);
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0.3)).current;
    const [round, setRound] = useState(1);
    const [totalBreaths, setTotalBreaths] = useState(0);

    useEffect(() => {
        const phases = ['inhale', 'hold1', 'exhale', 'hold2'];
        let phaseIndex = 0;
        let countdown = 4;

        const timer = setInterval(() => {
            countdown--;
            setCount(countdown);

            if (countdown === 0) {
                phaseIndex = (phaseIndex + 1) % 4;
                setPhase(phases[phaseIndex]);
                countdown = 4;
                setCount(4);

                if (phaseIndex === 0) {
                    setRound(r => r + 1);
                    setTotalBreaths(t => t + 1);
                }

                if (phases[phaseIndex] === 'inhale') {
                    Animated.parallel([
                        Animated.timing(scaleAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                        Animated.timing(opacityAnim, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
                    ]).start();
                } else if (phases[phaseIndex] === 'exhale') {
                    Animated.parallel([
                        Animated.timing(scaleAnim, { toValue: 0.5, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                        Animated.timing(opacityAnim, { toValue: 0.3, duration: 4000, useNativeDriver: true }),
                    ]).start();
                }
            }
        }, 1000);

        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
        ]).start();

        return () => clearInterval(timer);
    }, []);

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold1': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'hold2': return 'Hold';
        }
    };

    const getPhaseIcon = () => {
        switch (phase) {
            case 'inhale': return 'arrow-up';
            case 'hold1': return 'pause';
            case 'exhale': return 'arrow-down';
            case 'hold2': return 'pause';
        }
    };

    return (
        <View style={styles.activityFull}>
            <ActivityHeader title="Box Breathing" subtitle={`Round ${round}`} onBack={onBack} color="#14B8A6" />
            <View style={styles.breathingMain}>
                <Animated.View style={[styles.breathingOuter, { opacity: opacityAnim }]}>
                    <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]}>
                        <LinearGradient colors={['#14B8A6', '#0D9488']} style={styles.breathingInner}>
                            <Text style={styles.breathingCount}>{count}</Text>
                        </LinearGradient>
                    </Animated.View>
                </Animated.View>
                <View style={styles.phaseContainer}>
                    <Ionicons name={getPhaseIcon()} size={24} color="#14B8A6" />
                    <Text style={styles.phaseText}>{getPhaseText()}</Text>
                </View>
            </View>
            <View style={styles.breathingFooter}>
                <View style={styles.breathingStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalBreaths}</Text>
                        <Text style={styles.statLabel}>Breaths</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalBreaths * 16}s</Text>
                        <Text style={styles.statLabel}>Duration</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const GroundingActivity = ({ onBack }) => {
    const [step, setStep] = useState(5);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const prompts = {
        5: { sense: 'SEE', icon: 'eye', color: '#3B82F6', examples: 'colors, shapes, movement' },
        4: { sense: 'TOUCH', icon: 'hand-left', color: '#14B8A6', examples: 'textures, temperatures' },
        3: { sense: 'HEAR', icon: 'ear', color: '#F59E0B', examples: 'sounds near and far' },
        2: { sense: 'SMELL', icon: 'flower', color: '#EC4899', examples: 'scents around you' },
        1: { sense: 'TASTE', icon: 'restaurant', color: '#8B5CF6', examples: 'flavors in your mouth' },
    };

    const handleNext = () => {
        if (step > 1) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
            ]).start(() => {
                setStep(step - 1);
                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                ]).start();
            });
        }
    };

    const current = prompts[step];
    const progress = ((5 - step) / 4) * 100;

    return (
        <View style={styles.activityFull}>
            <ActivityHeader title="5-4-3-2-1 Grounding" onBack={onBack} color={current.color} />
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: current.color }]} />
            </View>
            <Animated.View style={[styles.groundingMain, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.groundingCircle, { backgroundColor: current.color + '20', borderColor: current.color }]}>
                    <Ionicons name={current.icon} size={56} color={current.color} />
                </View>
                <Text style={styles.groundingNumber}>{step}</Text>
                <Text style={styles.groundingPrompt}>
                    Name <Text style={{ color: current.color, fontWeight: '800' }}>{step}</Text> thing{step > 1 ? 's' : ''} you can
                </Text>
                <Text style={[styles.groundingSense, { color: current.color }]}>{current.sense}</Text>
                <Text style={styles.groundingExamples}>({current.examples})</Text>
            </Animated.View>
            <View style={styles.groundingFooter}>
                <Pressable onPress={handleNext} style={({ pressed }) => [styles.groundingBtn, { backgroundColor: current.color, opacity: pressed ? 0.8 : 1 }]}>
                    <Text style={styles.groundingBtnText}>{step > 1 ? "I've found them" : 'Complete'}</Text>
                    <Ionicons name={step > 1 ? 'arrow-forward' : 'checkmark'} size={20} color="#fff" />
                </Pressable>
                {step === 1 && <Text style={styles.groundingComplete}>You're grounded in the present moment.</Text>}
            </View>
        </View>
    );
};

const TapChallengeActivity = ({ onBack }) => {
    const [taps, setTaps] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!started) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [started]);

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && started) {
            setGameOver(true);
            if (taps > highScore) setHighScore(taps);
            if (Platform.OS !== 'web') Vibration.vibrate(200);
        }
    }, [timeLeft, started]);

    const handleTap = () => {
        if (!started) {
            setStarted(true);
            pulseAnim.setValue(1);
        }
        if (!gameOver) {
            setTaps(t => t + 1);
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 0.92, duration: 40, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 40, useNativeDriver: true }),
            ]).start();
        }
    };

    const handleRestart = () => {
        setTaps(0);
        setTimeLeft(10);
        setGameOver(false);
        setStarted(false);
    };

    const getResult = () => {
        if (taps >= 70) return { icon: 'flame', text: 'LEGENDARY!', color: '#F59E0B' };
        if (taps >= 50) return { icon: 'flash', text: 'Amazing!', color: '#8B5CF6' };
        if (taps >= 35) return { icon: 'fitness', text: 'Great job!', color: '#14B8A6' };
        return { icon: 'hand-left', text: 'Keep practicing!', color: '#3B82F6' };
    };

    return (
        <View style={styles.activityFull}>
            <ActivityHeader title="Focus Tap" subtitle={gameOver ? `Best: ${highScore}` : started ? `${timeLeft}s left` : 'Tap to start!'} onBack={onBack} color="#F59E0B" />
            <View style={styles.tapMain}>
                <Animated.View style={{ transform: [{ scale: started ? scaleAnim : pulseAnim }] }}>
                    <Pressable onPress={handleTap} disabled={gameOver}>
                        <LinearGradient colors={gameOver ? ['#14B8A6', '#0D9488'] : ['#F59E0B', '#D97706']} style={styles.tapCircle}>
                            <Text style={styles.tapCount}>{taps}</Text>
                            <Text style={styles.tapLabel}>{gameOver ? 'TAPS!' : started ? 'TAP!' : 'START'}</Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
                {gameOver && (
                    <View style={styles.tapResultContainer}>
                        <Ionicons name={getResult().icon} size={48} color={getResult().color} />
                        <Text style={[styles.tapResultText, { color: getResult().color }]}>{getResult().text}</Text>
                    </View>
                )}
            </View>
            {gameOver && (
                <View style={styles.tapFooter}>
                    <Pressable onPress={handleRestart} style={styles.restartBtn}>
                        <Ionicons name="refresh" size={20} color={colors.text.primary} />
                        <Text style={styles.restartBtnText}>Try Again</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const AffirmationActivity = ({ onBack }) => {
    const [index, setIndex] = useState(Math.floor(Math.random() * AFFIRMATIONS.length));
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
        ]).start(() => {
            setIndex((index + 1) % AFFIRMATIONS.length);
            translateY.setValue(20);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        });
    };

    return (
        <View style={styles.activityFull}>
            <ActivityHeader title="Affirmations" subtitle={`${index + 1} of ${AFFIRMATIONS.length}`} onBack={onBack} color="#EC4899" />
            <View style={styles.affirmationMain}>
                <Animated.View style={[styles.affirmationCard, { opacity: fadeAnim, transform: [{ translateY }] }]}>
                    <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.affirmationHeart}>
                        <Ionicons name="heart" size={28} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.affirmationText}>{AFFIRMATIONS[index]}</Text>
                </Animated.View>
            </View>
            <View style={styles.affirmationFooter}>
                <Pressable onPress={handleNext} style={styles.affirmationBtn}>
                    <Text style={styles.affirmationBtnText}>Next Affirmation</Text>
                    <Ionicons name="arrow-forward" size={18} color="#EC4899" />
                </Pressable>
            </View>
        </View>
    );
};

const BubblePopActivity = ({ onBack }) => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setGameOver(true);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (!gameOver && timeLeft > 0) {
            const interval = setInterval(() => {
                const newBubble = {
                    id: Date.now(),
                    x: Math.random() * (SCREEN_WIDTH - 100) + 20,
                    y: Math.random() * (SCREEN_HEIGHT - 400) + 150,
                    size: Math.random() * 40 + 40,
                    color: ['#3B82F6', '#14B8A6', '#8B5CF6', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 5)],
                };
                setBubbles(prev => [...prev.slice(-15), newBubble]);
            }, 600);
            return () => clearInterval(interval);
        }
    }, [gameOver, timeLeft]);

    const popBubble = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 1);
        if (Platform.OS !== 'web') Vibration.vibrate(30);
    };

    const handleRestart = () => {
        setBubbles([]);
        setScore(0);
        setTimeLeft(30);
        setGameOver(false);
    };

    return (
        <View style={styles.activityFull}>
            <ActivityHeader title="Pop Bubbles" subtitle={gameOver ? `Final Score: ${score}` : `${timeLeft}s | Score: ${score}`} onBack={onBack} color="#3B82F6" />
            <View style={styles.bubbleArea}>
                {bubbles.map(bubble => (
                    <Pressable key={bubble.id} onPress={() => popBubble(bubble.id)} style={[styles.bubble, { left: bubble.x, top: bubble.y, width: bubble.size, height: bubble.size, backgroundColor: bubble.color + '40', borderColor: bubble.color }]} />
                ))}
                {gameOver && (
                    <View style={styles.bubbleGameOver}>
                        <Ionicons name="trophy" size={64} color="#F59E0B" />
                        <Text style={styles.bubbleGameOverScore}>You popped {score} bubbles!</Text>
                        <Pressable onPress={handleRestart} style={styles.bubbleRestartBtn}>
                            <Ionicons name="refresh" size={20} color="#fff" />
                            <Text style={styles.bubbleRestartText}>Play Again</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
};

export const DistractionScreen = ({ navigation }) => {
    const themeColors = useColors();
    const [activeActivity, setActiveActivity] = useState(null);

    const renderActivity = () => {
        switch (activeActivity) {
            case 'breathing': return <BoxBreathingActivity onBack={() => setActiveActivity(null)} />;
            case 'grounding': return <GroundingActivity onBack={() => setActiveActivity(null)} />;
            case 'taptap': return <TapChallengeActivity onBack={() => setActiveActivity(null)} />;
            case 'affirmation': return <AffirmationActivity onBack={() => setActiveActivity(null)} />;
            case 'bubble': return <BubblePopActivity onBack={() => setActiveActivity(null)} />;
            default: return null;
        }
    };

    if (activeActivity) {
        return <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]} edges={['top', 'bottom']}>{renderActivity()}</SafeAreaView>;
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
                        <Ionicons name="close" size={28} color={themeColors.text.primary} />
                    </Pressable>
                    <View>
                        <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>Distract Me</Text>
                        <Text style={[styles.headerSubtitle, { color: themeColors.text.muted }]}>Break the cycle</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.heroSection}>
                        <View style={[styles.heroIcon, { backgroundColor: themeColors.primary.violet + '15' }]}>
                            <Ionicons name="game-controller" size={32} color={themeColors.primary.violet} />
                        </View>
                        <Text style={[styles.heroText, { color: themeColors.text.secondary }]}>Choose an activity to shift your focus away from cravings</Text>
                    </View>

                    <View style={styles.activitiesGrid}>
                        {ACTIVITIES.map((activity) => (
                            <Pressable key={activity.id} onPress={() => setActiveActivity(activity.id)} style={({ pressed }) => [styles.activityCard, { backgroundColor: themeColors.background.card }, pressed && styles.activityCardPressed]}>
                                <View style={[styles.activityIconBox, { backgroundColor: activity.color + '20' }]}>
                                    <Ionicons name={activity.icon} size={24} color={activity.color} />
                                </View>
                                <View style={styles.activityInfo}>
                                    <Text style={[styles.activityCardTitle, { color: themeColors.text.primary }]}>{activity.title}</Text>
                                    <Text style={[styles.activityCardDesc, { color: themeColors.text.muted }]}>{activity.desc}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={themeColors.text.muted} />
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    headerBackBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text.primary, textAlign: 'center' },
    headerSubtitle: { fontSize: typography.size.sm, color: colors.text.muted, textAlign: 'center' },
    content: { padding: spacing.md, paddingBottom: 40 },
    heroSection: { alignItems: 'center', marginBottom: spacing.xl },
    heroIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.violet + '15', marginBottom: spacing.md },
    heroText: { fontSize: typography.size.sm, color: colors.text.secondary, textAlign: 'center', maxWidth: 280, lineHeight: 22 },
    activitiesGrid: { gap: spacing.sm },
    activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, padding: spacing.md, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    activityCardPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
    activityIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    activityInfo: { flex: 1 },
    activityCardTitle: { fontSize: typography.size.base, fontWeight: typography.weight.semibold, color: colors.text.primary },
    activityCardDesc: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
    activityFull: { flex: 1, backgroundColor: colors.background.primary },
    activityHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
    activityBackBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    activityHeaderText: { flex: 1, marginLeft: spacing.sm },
    activityTitle: { fontSize: typography.size.xl, fontWeight: typography.weight.bold },
    activitySubtitle: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
    breathingMain: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    breathingOuter: { width: 220, height: 220, borderRadius: 110, backgroundColor: '#14B8A620', alignItems: 'center', justifyContent: 'center' },
    breathingCircle: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center' },
    breathingInner: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center' },
    breathingCount: { fontSize: 72, fontWeight: '200', color: '#fff' },
    phaseContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
    phaseText: { fontSize: typography.size.xl, fontWeight: typography.weight.semibold, color: colors.text.primary },
    breathingFooter: { padding: spacing.xl },
    breathingStats: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.card, borderRadius: 16, padding: spacing.md },
    statItem: { alignItems: 'center', paddingHorizontal: spacing.xl },
    statValue: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: '#14B8A6' },
    statLabel: { fontSize: typography.size.sm, color: colors.text.muted },
    statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
    progressBar: { height: 4, backgroundColor: colors.background.card, marginHorizontal: spacing.md, borderRadius: 2 },
    progressFill: { height: '100%', borderRadius: 2 },
    groundingMain: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    groundingCircle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: spacing.md },
    groundingNumber: { fontSize: 56, fontWeight: '200', color: colors.text.primary, marginBottom: spacing.md },
    groundingPrompt: { fontSize: typography.size.lg, color: colors.text.secondary, textAlign: 'center' },
    groundingSense: { fontSize: 32, fontWeight: typography.weight.bold, marginTop: spacing.xs },
    groundingExamples: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: spacing.sm },
    groundingFooter: { padding: spacing.xl, alignItems: 'center' },
    groundingBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: 50 },
    groundingBtnText: { fontSize: typography.size.base, fontWeight: '700', color: '#fff' },
    groundingComplete: { marginTop: spacing.md, fontSize: typography.size.sm, color: colors.text.muted },
    tapMain: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    tapCircle: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
    tapCount: { fontSize: 64, fontWeight: typography.weight.bold, color: '#fff' },
    tapLabel: { fontSize: typography.size.sm, fontWeight: '600', color: '#fff', opacity: 0.9 },
    tapResultContainer: { alignItems: 'center', marginTop: spacing.xl },
    tapResultEmoji: { fontSize: 48 },
    tapResultText: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, marginTop: spacing.sm },
    tapFooter: { padding: spacing.xl, alignItems: 'center' },
    restartBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, backgroundColor: colors.background.card, borderRadius: 50 },
    restartBtnText: { fontSize: typography.size.base, color: colors.text.primary, fontWeight: '600' },
    affirmationMain: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    affirmationCard: { backgroundColor: colors.background.card, borderRadius: 24, padding: spacing.xl, alignItems: 'center', width: '100%', minHeight: 240, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    affirmationHeart: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
    affirmationText: { fontSize: 22, fontWeight: typography.weight.medium, color: colors.text.primary, textAlign: 'center', lineHeight: 34 },
    affirmationFooter: { padding: spacing.xl, alignItems: 'center' },
    affirmationBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    affirmationBtnText: { fontSize: typography.size.base, color: '#EC4899', fontWeight: '600' },
    bubbleArea: { flex: 1, position: 'relative' },
    bubble: { position: 'absolute', borderRadius: 100, borderWidth: 2 },
    bubbleGameOver: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    bubbleGameOverEmoji: { fontSize: 64 },
    bubbleGameOverScore: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text.primary, marginTop: spacing.md },
    bubbleRestartBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#3B82F6', paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: 50, marginTop: spacing.xl },
    bubbleRestartText: { fontSize: typography.size.base, fontWeight: '700', color: '#fff' },
});

export default DistractionScreen;

// --- End of DistractionScreen.js ---
