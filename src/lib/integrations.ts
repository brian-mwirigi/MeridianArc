/**
 * Integration Hooks
 * These are stubbed for Phase 5 implementation.
 * You will need API keys and OAuth setups to fully implement these.
 */

// CostHQ
export async function syncSessionToCostHQ(durationMins: number, label?: string) {
  console.log(`[CostHQ Stub] Syncing ${durationMins}m session under label: ${label || 'none'}`);
  // TODO: Add fetch call to CostHQ API with Bearer token
}

// Notion
export async function fetchNotionTasks() {
  console.log(`[Notion Stub] Fetching tasks from Notion database...`);
  // TODO: Add fetch call to Notion API to get pages in a specific database
  return [];
}

export async function markNotionTaskComplete(taskId: string) {
  console.log(`[Notion Stub] Marking task ${taskId} as complete...`);
  // TODO: PATCH request to Notion API to update page properties
}

// Google Calendar
export async function blockTimeOnGCal(startTime: string, endTime: string, summary: string) {
  console.log(`[GCal Stub] Blocking time from ${startTime} to ${endTime} for: ${summary}`);
  // TODO: Add fetch call to Google Calendar API using access token
}
