// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: API service for connecting frontend to backend

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.40'; // Your host machine IP
const API_BASE_URL = __DEV__
    ? `http://${Platform.OS === 'android' ? '10.0.2.2' : (Platform.OS === 'web' ? 'localhost' : LOCAL_IP)}:3001/api`
    : 'https://your-production-api.com/api';

class ApiService {
    constructor() {
        this.token = null;
        this.initPromise = this.loadToken();
    }

    async loadToken() {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (this.token === null) {
                this.token = token;
            }
            return this.token;
        } catch (error) {
            console.error('Error loading token:', error);
            return null;
        }
    }

    async setToken(token) {
        this.token = token;
        try {
            await AsyncStorage.setItem('auth_token', token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    async clearToken() {
        this.token = null;
        try {
            await AsyncStorage.removeItem('auth_token');
        } catch (error) {
            console.error('Error clearing token:', error);
        }
    }

    async request(endpoint, options = {}) {
        await this.initPromise;
        const url = `${API_BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        } else if (!endpoint.includes('/auth/')) {
            // No token and trying to reach a protected route? 
            // Attempt auto-anonymous registration once
            try {
                console.log(`[API] No token for ${endpoint}, attempting auto-registration...`);
                await this.createAnonymousUser();
                if (this.token) {
                    headers['Authorization'] = `Bearer ${this.token}`;
                }
            } catch (authError) {
                console.warn('[API] Auto-registration failed:', authError.message);
            }
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle empty responses (like 204 No Content)
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Auth
    async createAnonymousUser() {
        const data = await this.request('/auth/anonymous', { method: 'POST' });
        await this.setToken(data.token);
        return data.user;
    }

    async googleLogin(idToken) {
        const data = await this.request('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ idToken }),
        });
        await this.setToken(data.token);
        return data;
    }

    async loginWithGoogle(idToken) {
        return this.googleLogin(idToken);
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        await this.setToken(data.token);
        return data;
    }

    async register(email, password, username) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, username }),
        });
        await this.setToken(data.token);
        return data;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (e) {
            // Ignore errors
        }
        await this.clearToken();
    }

    async deleteAccount() {
        await this.request('/auth/account', { method: 'DELETE' });
        await this.clearToken();
    }

    async exportData() {
        return this.request('/auth/export');
    }

    async changePassword(currentPassword, newPassword) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    async setAuthToken(token) {
        await this.setToken(token);
    }

    async clearAuthToken() {
        await this.clearToken();
    }

    async setUsername(userId, username) {
        return this.request('/auth/set-username', {
            method: 'POST',
            body: JSON.stringify({ userId, username }),
        });
    }

    // Users
    async getProfile() {
        return this.request('/users/me');
    }

    async updateProfile(updates) {
        return this.request('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    async uploadAvatar(imageUri) {
        await this.initPromise;
        const formData = new FormData();
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('avatar', {
            uri: imageUri,
            name: filename,
            type,
        });

        const uploadUrl = `${API_BASE_URL}/users/me/avatar`;
        console.log('[API] Uploading avatar to:', uploadUrl);
        console.log('[API] Token present:', !!this.token);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload avatar');
        }

        return response.json();
    }

    async getOtherProfile(userId) {
        return this.request(`/users/${userId}`);
    }

    async deleteAccount() {
        await this.request('/users/me', { method: 'DELETE' });
        await this.clearToken();
    }

    async exportData() {
        return this.request('/users/me/export');
    }

    // Addictions
    async getAddictions() {
        return this.request('/addictions');
    }

    async getMyAddictions() {
        return this.request('/addictions/mine');
    }

    async addAddiction(addictionId, startDate) {
        return this.request('/addictions/mine', {
            method: 'POST',
            body: JSON.stringify({ addictionId, startDate }),
        });
    }

    async createCustomAddiction(name, icon) {
        return this.request('/addictions/custom', {
            method: 'POST',
            body: JSON.stringify({ name, icon }),
        });
    }

    async removeAddiction(id) {
        return this.request(`/addictions/mine/${id}`, { method: 'DELETE' });
    }

    // Sobriety
    async getStreaks() {
        return this.request('/sobriety/streaks');
    }

    async getStreak(userAddictionId) {
        return this.request(`/sobriety/streak/${userAddictionId}`);
    }

    async logDay(userAddictionId, status, reason, note) {
        return this.request('/sobriety/log', {
            method: 'POST',
            body: JSON.stringify({ userAddictionId, status, reason, note }),
        });
    }

    async logSlip(userAddictionId, reason, note) {
        return this.request('/sobriety/slip', {
            method: 'POST',
            body: JSON.stringify({ userAddictionId, reason, note }),
        });
    }

    async restartStreak(userAddictionId) {
        return this.request(`/sobriety/restart/${userAddictionId}`, { method: 'POST' });
    }

    // Cravings
    async logCraving(userAddictionId, intensity, mood, trigger, note) {
        return this.request('/cravings', {
            method: 'POST',
            body: JSON.stringify({ userAddictionId, intensity, mood, trigger, note }),
        });
    }

    async getCravings(days = 30) {
        return this.request(`/cravings?days=${days}`);
    }

    async logMood(mood, note) {
        return this.request('/cravings/mood', {
            method: 'POST',
            body: JSON.stringify({ mood, note }),
        });
    }

    // Posts
    async getPosts(addictionId, limit = 20, offset = 0) {
        const params = new URLSearchParams({ limit, offset });
        if (addictionId) params.append('addictionId', addictionId);
        return this.request(`/posts?${params}`);
    }

    async getPost(id) {
        return this.request(`/posts/${id}`);
    }

    async createPost(content, addictionId, postType = 'text', imageUrl) {
        return this.request('/posts', {
            method: 'POST',
            body: JSON.stringify({ content, addictionId, postType, imageUrl }),
        });
    }

    async updatePost(id, content) {
        return this.request(`/posts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ content }),
        });
    }

    async deletePost(id) {
        return this.request(`/posts/${id}`, { method: 'DELETE' });
    }

    // Comments
    async getComments(postId) {
        return this.request(`/comments/post/${postId}`);
    }

    async addComment(postId, content) {
        return this.request('/comments', {
            method: 'POST',
            body: JSON.stringify({ postId, content }),
        });
    }

    async deleteComment(id) {
        return this.request(`/comments/${id}`, { method: 'DELETE' });
    }

    async toggleCommentReaction(commentId, type = 'hear_you') {
        return this.request('/comment-reactions/toggle', {
            method: 'POST',
            body: JSON.stringify({ commentId, type }),
        });
    }

    // Reactions
    async toggleReaction(postId, type) {
        return this.request('/reactions/toggle', {
            method: 'POST',
            body: JSON.stringify({ postId, type }),
        });
    }

    async getMyReactions(postId) {
        return this.request(`/reactions/post/${postId}`);
    }

    // Messages
    async getConversations() {
        return this.request('/messages/conversations');
    }

    async getMessages(userId, limit = 50) {
        return this.request(`/messages/with/${userId}?limit=${limit}`);
    }

    async sendMessage(receiverId, content) {
        return this.request('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiverId, content }),
        });
    }

    async getUnreadCount() {
        return this.request('/messages/unread');
    }

    // Insights
    async getCravingHeatmap(days = 30) {
        return this.request(`/insights/craving-heatmap?days=${days}`);
    }

    async getTriggers(days = 30) {
        return this.request(`/insights/triggers?days=${days}`);
    }

    async getMoodCorrelation(days = 30) {
        return this.request(`/insights/mood-correlation?days=${days}`);
    }

    async getInsightsSummary(days = 30) {
        return this.request(`/insights/summary?days=${days}`);
    }

    async getPatterns(days = 30) {
        return this.request(`/insights/patterns?days=${days}`);
    }

    // Slips
    async logSlip(slipData) {
        return this.request('/slips', {
            method: 'POST',
            body: JSON.stringify(slipData),
        });
    }

    async getSlips(addictionId = null, limit = 50, offset = 0) {
        let url = `/slips?limit=${limit}&offset=${offset}`;
        if (addictionId) url += `&addictionId=${addictionId}`;
        return this.request(url);
    }

    async getSlipStats(addictionId = null, days = 30) {
        let url = `/slips/stats?days=${days}`;
        if (addictionId) url += `&addictionId=${addictionId}`;
        return this.request(url);
    }

    async updateSlip(slipId, updates) {
        return this.request(`/slips/${slipId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    async deleteSlip(slipId) {
        return this.request(`/slips/${slipId}`, {
            method: 'DELETE',
        });
    }

    // Reports
    async submitReport(reportData) {
        return this.request('/reports', {
            method: 'POST',
            body: JSON.stringify(reportData),
        });
    }

    // Feedback (private - only developers can view)
    async submitFeedback(feedbackData) {
        return this.request('/feedback/submit', {
            method: 'POST',
            body: JSON.stringify(feedbackData),
        });
    }
}

export const api = new ApiService();
export default api;

// --- End of api.js ---
