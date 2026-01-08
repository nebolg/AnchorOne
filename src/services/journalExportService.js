// Author: -GLOBENXCC-
// OS support: iOS, Android
// Description: Service for exporting journal entries to PDF format

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';

export const journalExportService = {
    generateJournalHTML(entries, userInfo = {}) {
        const styles = `
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: #1a1a2e;
                    line-height: 1.6;
                    padding: 40px;
                    background: #fff;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #14B8A6;
                }
                .header h1 {
                    font-size: 28px;
                    color: #14B8A6;
                    margin-bottom: 8px;
                }
                .header p {
                    color: #6b7280;
                    font-size: 14px;
                }
                .entry {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 12px;
                    border-left: 4px solid #14B8A6;
                }
                .entry-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }
                .entry-date {
                    font-size: 12px;
                    color: #6b7280;
                    font-weight: 600;
                }
                .entry-mood {
                    font-size: 12px;
                    padding: 4px 10px;
                    border-radius: 12px;
                    background: #14B8A6;
                    color: white;
                }
                .entry-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #1a1a2e;
                }
                .entry-content {
                    font-size: 14px;
                    color: #374151;
                    white-space: pre-wrap;
                }
                .entry-tags {
                    margin-top: 12px;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .tag {
                    font-size: 11px;
                    padding: 3px 8px;
                    background: #e5e7eb;
                    border-radius: 8px;
                    color: #4b5563;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 12px;
                    color: #9ca3af;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }
                .stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin: 20px 0;
                    padding: 20px;
                    background: #f0fdfa;
                    border-radius: 12px;
                }
                .stat {
                    text-align: center;
                }
                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #14B8A6;
                }
                .stat-label {
                    font-size: 12px;
                    color: #6b7280;
                }
            </style>
        `;

        const getMoodEmoji = (mood) => {
            const moods = { 1: '😊 Great', 2: '🙂 Good', 3: '😐 Okay', 4: '😔 Low', 5: '😢 Struggling' };
            return moods[mood] || 'Unknown';
        };

        const totalEntries = entries.length;
        const averageMood = entries.length > 0
            ? (entries.reduce((sum, e) => sum + (e.mood || 3), 0) / entries.length).toFixed(1)
            : 0;

        const entriesHTML = entries
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(entry => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="entry-date">${format(new Date(entry.createdAt), 'MMMM d, yyyy • h:mm a')}</span>
                        ${entry.mood ? `<span class="entry-mood">${getMoodEmoji(entry.mood)}</span>` : ''}
                    </div>
                    ${entry.title ? `<div class="entry-title">${entry.title}</div>` : ''}
                    <div class="entry-content">${entry.content || entry.text || ''}</div>
                    ${entry.tags && entry.tags.length > 0 ? `
                        <div class="entry-tags">
                            ${entry.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AnchorOne Journal Export</title>
                ${styles}
            </head>
            <body>
                <div class="header">
                    <h1>⚓ AnchorOne Journal</h1>
                    <p>Recovery Journal Export • Generated on ${format(new Date(), 'MMMM d, yyyy')}</p>
                </div>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">${totalEntries}</div>
                        <div class="stat-label">Total Entries</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${averageMood}</div>
                        <div class="stat-label">Avg. Mood</div>
                    </div>
                </div>

                ${entriesHTML || '<p style="text-align:center;color:#9ca3af;">No journal entries found.</p>'}

                <div class="footer">
                    <p>This document was generated by AnchorOne — Your Recovery Companion</p>
                    <p>⚓ One day at a time</p>
                </div>
            </body>
            </html>
        `;
    },

    async exportToPDF(entries, userInfo = {}) {
        try {
            const html = this.generateJournalHTML(entries, userInfo);

            const { uri } = await Print.printToFileAsync({
                html,
                base64: false,
            });

            const filename = `AnchorOne_Journal_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
            const newUri = `${FileSystem.documentDirectory}${filename}`;

            await FileSystem.moveAsync({
                from: uri,
                to: newUri,
            });

            return newUri;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    },

    async sharePDF(pdfUri) {
        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                throw new Error('Sharing is not available on this device');
            }

            await Sharing.shareAsync(pdfUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Share your journal',
                UTI: 'com.adobe.pdf',
            });
        } catch (error) {
            console.error('Error sharing PDF:', error);
            throw error;
        }
    },

    async exportAndShare(entries, userInfo = {}) {
        const uri = await this.exportToPDF(entries, userInfo);
        await this.sharePDF(uri);
        return uri;
    },
};

export default journalExportService;

// --- End of journalExportService.js ---
