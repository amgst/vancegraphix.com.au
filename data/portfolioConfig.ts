// ==============================================================================
// ==============================================================================
// VANCE GRAPHIX & PRINT PORTFOLIO CONFIGURATION
// ==============================================================================
// This file replaces the Admin page. 
// Enter your Google Drive details here to sync the portfolio.
// ==============================================================================

const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || "";

export const PORTFOLIO_CONFIG = {
  apiKey,

  // 2. Google Drive Folder IDs
  // Paste the ID of the folder for each category.
  // Folder ID is the last part of the URL: drive.google.com/drive/folders/YOUR_ID_HERE
  // NOTE: Folders must be set to "Anyone with the link" (Public).
  folderIds: {
    'Graphic Design & Print': '1WytrbAtcAe2mqwNFS4yBLJ9reybnuePM',
    'Web / Digital': '',
    'Video & Animation': '',
  } as Record<string, string>
};
