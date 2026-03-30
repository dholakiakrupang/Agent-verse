const STORAGE_KEY = 'agentverse_agents';

/** Returns all user-submitted agents from localStorage */
export function getCustomAgents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Returns static + custom agents combined (custom first so they appear at top) */
export function getAllAgents(staticAgents) {
  const custom = getCustomAgents();
  return [...custom, ...staticAgents];
}

/** Saves a new agent to localStorage. Returns the saved agent with the assigned id. */
export function saveCustomAgent(agentData) {
  const existing = getCustomAgents();
  const maxId = existing.reduce((m, a) => Math.max(m, a.id), 1000);
  const agent = { ...agentData, id: maxId + 1, isCustom: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([agent, ...existing]));
  return agent;
}

/** Clears all user-submitted agents from localStorage (useful in dev) */
export function clearCustomAgents() {
  localStorage.removeItem(STORAGE_KEY);
}
