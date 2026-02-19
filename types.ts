import { LucideIcon } from 'lucide-react';

export interface SubService {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  pricing: {
    basic: string;
    standard: string;
    premium: string;
  };
  deliveryTime: string;
  galleryFolderId?: string; // Optional Google Drive Folder ID for specific service gallery
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  services: SubService[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}