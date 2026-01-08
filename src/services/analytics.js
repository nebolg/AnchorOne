// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Analytics service for tracking user activity and syncing with backend

import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

class AnalyticsService {
    constructor() {
        this.userId = null;
        this.sessionStarted = false;
        this.queue = [];
        this.isProcessing = false;
    }

    // Initialize analytics with user ID
    async init(userId) {
        this.userId = userId || await this.getAnonymousId();
        if (!this.sessionStarted) {
            await this.startSession();
        }
    }

    // Get or create anonymous ID for tracking
    async getAnonymousId() {
        try {
            let anonId = await AsyncStorage.getItem('analytics_anon_id');
            if (!anonId) {
                anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await AsyncStorage.setItem('analytics_anon_id', anonId);
            }
            return anonId;
        } catch (e) {
            return `anon_${Date.now()}`;
        }
    }

    // Get device info for tracking
    getDeviceInfo() {
        return {
            platform: Platform.OS,
            osVersion: Platform.Version,
            deviceName: Device.deviceName || 'Unknown',
            deviceType: Device.deviceType,
            isDevice: Device.isDevice,
        };
    }

    // Start a new session (called on app open)
    async startSession() {
        try {
            this.sessionStarted = true;
            const appVersion = Constants.expoConfig?.version || '1.0.0';

            await api.request('/analytics/session', {
                method: 'POST',
                body: JSON.stringify({
                    userId: this.userId,
                    deviceInfo: this.getDeviceInfo(),
                    appVersion,
                }),
            });
            console.log('[Analytics] Session started');
        } catch (error) {
            console.log('[Analytics] Session start failed (offline mode)');
        }
    }

    // Track screen view
    async trackScreen(screenName) {
        this.queueActivity({
            screen: screenName,
            action: 'view',
        });
    }

    // Track user action
    async trackAction(action, metadata = {}) {
        this.queueActivity({
            action,
            metadata,
        });
    }

    // Track specific events
    async trackEvent(eventName, data = {}) {
        this.queueActivity({
            action: eventName,
            metadata: data,
        });
    }

    // Queue activity to batch send
    queueActivity(activity) {
        this.queue.push({
            ...activity,
            userId: this.userId,
            timestamp: new Date().toISOString(),
        });

        // Process queue if not already processing
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    // Process queued activities
    async processQueue() {
        if (this.queue.length === 0 || this.isProcessing) return;

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const activity = this.queue.shift();
            try {
                await api.request('/analytics/activity', {
                    method: 'POST',
                    body: JSON.stringify(activity),
                });
            } catch (error) {
                // Re-queue on failure
                this.queue.unshift(activity);
                break;
            }
        }

        this.isProcessing = false;
    }

    // Flush all queued events (call on app background)
    async flush() {
        await this.processQueue();
    }
}

export const analytics = new AnalyticsService();
export default analytics;

// --- End of analytics.js ---
