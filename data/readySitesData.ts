export interface ReadySite {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
    features: string[];
    previewLink?: string;
    order?: number; // For ordering templates
    isConcept?: boolean;
}

export const READY_SITES_SEED_DATA: ReadySite[] = [
    {
        id: '1',
        title: 'Premium Car Rental',
        category: 'Automotive',
        image: '/template_cars.png',
        description: 'A high-end car rental website with fleet showcase and booking inquiry system.',
        features: ['Fleet Gallery', 'Booking Form', 'Service Details'],
        previewLink: 'https://cars-six-rouge.vercel.app/',
        order: 1
    },
    {
        id: '2',
        title: 'Modern Dental Clinic',
        category: 'Healthcare',
        image: '/template_dental.png',
        description: 'Clean and trustworthy design for dental clinics with appointment scheduling.',
        features: ['Appointment Booking', 'Service List', 'Team Profiles'],
        previewLink: 'https://dental-clinic-website-seven.vercel.app/',
        order: 2
    },
    {
        id: '5',
        title: 'SweetTreats & Events Hub',
        category: 'Food & Events',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'A delightful website for bakeries and event planners. Showcase your treats and manage event bookings.',
        features: ['Menu Showcase', 'Event Booking', 'Gallery'],
        previewLink: 'https://sweet-treats-black.vercel.app/',
        order: 3
    },
    {
        id: '6',
        title: 'ClearLedger Accounting',
        category: 'Finance',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Professional accounting and advisory website. Perfect for CPA firms and financial consultants.',
        features: ['Service Overview', 'Client Portal', 'Consultation Booking'],
        previewLink: 'https://clear-leadger.vercel.app/',
        order: 4
    }
];


