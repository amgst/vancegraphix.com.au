import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { INQUIRIES_COLLECTION } from '../../lib/inquiryService';
import { CONTACT_MESSAGES_COLLECTION } from '../../lib/contactService';

export const NotificationContext = React.createContext<{
    permission: NotificationPermission;
    requestPermission: () => Promise<void>;
}>({
    permission: 'default',
    requestPermission: async () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            return;
        }
        try {
            const p = await Notification.requestPermission();
            setPermission(p);
            if (p === 'granted') {
                new Notification('Notifications Enabled', {
                    body: 'You will now receive local browser alerts for new inquiries while this tab is open.',
                    icon: '/shopify.png'
                });
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
        }
    };

    const showNotification = async (title: string, body: string, url?: string) => {
        if (permission === 'granted') {
            const notification = new Notification(title, {
                body,
                icon: '/shopify.png'
            });

            if (url) {
                notification.onclick = () => {
                    window.open(url, '_blank');
                    notification.close();
                };
            }
        }
    };

    // Keep the Firestore listeners for local notifications while the tab is open
    useEffect(() => {
        if (permission !== 'granted') return;

        // Listener for new inquiries
        const inquiriesRef = collection(db, INQUIRIES_COLLECTION);
        const inquiriesQuery = query(inquiriesRef, orderBy('createdAt', 'desc'), limit(1));
        
        const unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    // Only show if it's new (within last 30 seconds to avoid old records on load)
                    const isNew = data.createdAt && (Date.now() - data.createdAt.toMillis() < 30000);
                    if (isNew) {
                        showNotification(
                            'New Project Inquiry!',
                            `From: ${data.name} (${data.serviceType})`,
                            '/admin/inquiries'
                        );
                    }
                }
            });
        });

        // Listener for new contact messages
        const contactRef = collection(db, CONTACT_MESSAGES_COLLECTION);
        const contactQuery = query(contactRef, orderBy('createdAt', 'desc'), limit(1));

        const unsubscribeContact = onSnapshot(contactQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const isNew = data.createdAt && (Date.now() - data.createdAt.toMillis() < 30000);
                    if (isNew) {
                        showNotification(
                            'New Contact Message!',
                            `From: ${data.firstName} ${data.lastName}`,
                            '/admin/dashboard'
                        );
                    }
                }
            });
        });

        return () => {
            unsubscribeInquiries();
            unsubscribeContact();
        };
    }, [permission]);

    return (
        <NotificationContext.Provider value={{ permission, requestPermission }}>
            {children}
        </NotificationContext.Provider>
    );
};
