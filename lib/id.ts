'use client';

/**
 * Generates or retrieves a persistent unique identifier for the current device/browser.
 * Used for tracking anonymous interactions (reactions, chat history) on Convex.
 */
export function getDeviceId(): string {
    if (typeof window === 'undefined') return 'server';

    let id = localStorage.getItem('cedizen_device_id');
    if (!id) {
        id = `dev_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
        localStorage.setItem('cedizen_device_id', id);
    }
    return id;
}
