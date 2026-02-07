export function generateTestUser(prefix = 'e2e') {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return {
    name: `${prefix} User ${ts}`,
    email: `${prefix}-${ts}-${rand}@test.local`,
    password: 'TestPass123!',
  };
}

export function generateProjectName(prefix = 'E2E Project') {
  return `${prefix} ${Date.now()}`;
}

export function generateTaskTitle(prefix = 'E2E Task') {
  return `${prefix} ${Date.now()}`;
}
