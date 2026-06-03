import Database from '@tauri-apps/plugin-sql';

let dbInstance: Database | null = null;

declare global {
  interface Window {
    __TAURI_INTERNALS__?: any;
  }
}

// Mock data for browser fallback
const mockSessions: any[] = [];
const isBrowser = typeof window !== 'undefined' && !window.__TAURI_INTERNALS__;

export async function getDb(): Promise<Database | null> {
  if (isBrowser) return null;
  if (!dbInstance) {
    dbInstance = await Database.load('sqlite:meridian.db');
  }
  return dbInstance;
}

export async function initSchema() {
  if (isBrowser) return;
  const db = await getDb();
  if (!db) return;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      duration INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      label TEXT,
      completed BOOLEAN NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function logSession(type: string, duration: number) {
  if (isBrowser) {
    mockSessions.push({ type, duration, created_at: new Date().toISOString() });
    return;
  }
  const db = await getDb();
  if (!db) return;
  await db.execute('INSERT INTO sessions (type, duration) VALUES ($1, $2)', [type, duration]);
}

export async function getSessionStats() {
  if (isBrowser) {
    // Return mock data for the heatmap
    const today = new Date().toISOString().split('T')[0];
    return [
      { date: today, count: 4 }
    ];
  }
  
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select<{date: string, count: number}[]>(`
    SELECT date(created_at) as date, COUNT(*) as count 
    FROM sessions 
    WHERE type = 'work'
    GROUP BY date(created_at)
  `);
  
  return result;
}
