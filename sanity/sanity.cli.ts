/**
 * AJ Digital SEO/AEO Engine — Sanity CLI Configuration
 */

import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_SANITY_PROJECT_ID',
    dataset:   process.env.SANITY_STUDIO_DATASET    || 'production',
  },
  autoUpdates: true,
})
