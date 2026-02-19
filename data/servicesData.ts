import {
  Palette,
  Monitor,
  ShoppingBag,
  Code,
  Smartphone,
  PenTool,
  Layout,
  Globe
} from 'lucide-react';
import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'shopify-services',
    title: 'Shopify Solutions',
    description: 'Complete Shopify store setup, customization, and scaling.',
    icon: ShoppingBag,
    services: [
      {
        id: 'shopify-setup',
        title: 'Store Setup & Configuration',
        description: 'Full store setup including domain, payments, and shipping.',
        longDescription: 'We handle the technical setup of your Shopify store, ensuring everything from domain connection to payment gateways and shipping zones is configured correctly.',
        features: ['Theme Installation', 'Domain Setup', 'Payment Gateway', 'Shipping Rates'],
        pricing: { basic: '$299', standard: '$499', premium: '$899' },
        deliveryTime: '3-5 Days'
      },
      {
        id: 'shopify-customization',
        title: 'Theme Customization',
        description: 'Tailoring themes to match your brand identity.',
        longDescription: 'Customizing existing Shopify themes with your brand colors, fonts, and layout adjustments to create a unique look.',
        features: ['CSS Customization', 'Layout Changes', 'Brand Integration', 'Mobile Optimization'],
        pricing: { basic: '$150', standard: '$300', premium: '$600' },
        deliveryTime: '2-4 Days'
      },
      {
        id: 'shopify-dropshipping',
        title: 'Dropshipping Automation',
        description: 'Automated stores with product research and supplier sync.',
        longDescription: 'Building fully automated dropshipping stores with winning product research, supplier integration (DSers, CJ, etc.), and order fulfillment setup.',
        features: ['Product Research', 'Supplier Integration', 'Profit Calculation', 'Auto-Fulfillment'],
        pricing: { basic: '$399', standard: '$699', premium: '$1299' },
        deliveryTime: '5-7 Days'
      }
    ]
  },
  {
    id: 'custom-web-dev',
    title: 'Custom Web Development',
    description: 'Tailor-made websites using React, Next.js, and modern tech.',
    icon: Code,
    services: [
      {
        id: 'custom-website',
        title: 'Custom Website Design',
        description: 'Unique designs built from scratch for your brand.',
        longDescription: 'Bespoke website design and development using modern technologies like React and Tailwind CSS for maximum performance and flexibility.',
        features: ['Custom UI/UX', 'React/Next.js', 'Fast Performance', 'SEO Friendly'],
        pricing: { basic: '$999', standard: '$1999', premium: '$3999' },
        deliveryTime: '14-21 Days'
      },
      {
        id: 'web-app-dev',
        title: 'Web Application Development',
        description: 'Complex functionality and interactive web apps.',
        longDescription: 'Development of dynamic web applications with user authentication, databases, and complex business logic.',
        features: ['User Auth', 'Database Integration', 'API Development', 'Admin Dashboard'],
        pricing: { basic: '$2500', standard: '$5000', premium: '$10000+' },
        deliveryTime: '1-2 Months'
      },
      {
        id: 'landing-pages',
        title: 'High-Converting Landing Pages',
        description: 'Single pages designed to sell a product or service.',
        longDescription: 'Optimized landing pages focused on conversion, perfect for marketing campaigns and product launches.',
        features: ['A/B Testing Ready', 'Fast Loading', 'Conversion Focused', 'Analytics Setup'],
        pricing: { basic: '$300', standard: '$600', premium: '$1200' },
        deliveryTime: '3-5 Days'
      }
    ]
  },
  {
    id: 'graphics-services',
    title: 'Graphics & Branding',
    description: 'Visual identity, social media graphics, and UI design.',
    icon: Palette,
    services: [
      {
        id: 'logo-branding',
        title: 'Logo & Brand Identity',
        description: 'Memorable logos and complete brand guidelines.',
        longDescription: 'Creation of unique logos and comprehensive brand identity systems including color palettes, typography, and usage guidelines.',
        features: ['Logo Design', 'Brand Book', 'Social Kits', 'Vector Files'],
        pricing: { basic: '$250', standard: '$550', premium: '$950' },
        deliveryTime: '5-7 Days'
      },
      {
        id: 'social-media-graphics',
        title: 'Social Media Graphics',
        description: 'Engaging posts, stories, and banners for social platforms.',
        longDescription: 'Custom designed graphics for Instagram, Facebook, LinkedIn, and Twitter to maintain a consistent brand presence.',
        features: ['Post Templates', 'Story Designs', 'Cover Images', 'Ad Creatives'],
        pricing: { basic: '$100', standard: '$250', premium: '$500' },
        deliveryTime: '3-5 Days'
      },
      {
        id: 'ui-ux-design',
        title: 'UI/UX Design',
        description: 'User interface and experience design for web and mobile.',
        longDescription: 'Designing intuitive and beautiful user interfaces for websites and mobile applications using tools like Figma.',
        features: ['Wireframing', 'Prototyping', 'High-Fidelity Design', 'Design System'],
        pricing: { basic: '$500', standard: '$1200', premium: '$2500' },
        deliveryTime: '7-14 Days'
      }
    ]
  },
  {
    id: 'wordpress-services',
    title: 'WordPress Solutions',
    description: 'Professional WordPress websites, themes, and maintenance.',
    icon: Globe,
    services: [
      {
        id: 'wordpress-setup',
        title: 'WordPress Setup & Design',
        description: 'Complete WordPress installation and theme design.',
        longDescription: 'We handle everything from hosting setup and WordPress installation to selecting and customizing the perfect theme for your business.',
        features: ['Hosting Setup', 'Theme Installation', 'Essential Plugins', 'SEO Basics'],
        pricing: { basic: '$299', standard: '$599', premium: '$999' },
        deliveryTime: '5-7 Days'
      },
      {
        id: 'wordpress-customization',
        title: 'Theme Customization',
        description: 'Customizing themes to fit your unique brand.',
        longDescription: 'Advanced customization of WordPress themes using child themes, custom CSS, and PHP to achieve your desired look and functionality.',
        features: ['Child Theme', 'Custom CSS', 'Plugin Integration', 'Speed Optimization'],
        pricing: { basic: '$199', standard: '$399', premium: '$799' },
        deliveryTime: '3-5 Days'
      },
      {
        id: 'wordpress-maintenance',
        title: 'Maintenance & Security',
        description: 'Ongoing updates, backups, and security monitoring.',
        longDescription: 'Keep your WordPress site secure and running smoothly with our monthly maintenance packages including updates, backups, and security scans.',
        features: ['Weekly Updates', 'Daily Backups', 'Security Scans', 'Uptime Monitoring'],
        pricing: { basic: '$49/mo', standard: '$99/mo', premium: '$199/mo' },
        deliveryTime: 'Ongoing'
      }
    ]
  }
];