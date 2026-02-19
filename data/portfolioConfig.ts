// ==============================================================================
// ==============================================================================
// WBIFY PORTFOLIO CONFIGURATION
// ==============================================================================
// This file replaces the Admin page. 
// Enter your Google Drive details here to sync the portfolio.
// ==============================================================================

export const PORTFOLIO_CONFIG = {
  // 1. Google Cloud API Key
  // Must have "Google Drive API" enabled.
  apiKey: "AIzaSyAR2OJEg72JYnrk488De536TS_5wyFTYMA",

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