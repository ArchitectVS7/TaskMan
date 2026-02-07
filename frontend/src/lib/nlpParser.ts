import * as chrono from 'chrono-node';
import nlp from 'compromise';

import type { TaskPriority } from '../types';

export interface ParsedTask {
  title: string;
  dueDate: Date | null;
  priority: TaskPriority | null;
  projectHint: string | null;
}

// Priority keyword mappings
const PRIORITY_PATTERNS: { pattern: RegExp; priority: TaskPriority }[] = [
  { pattern: /\b(?:urgent|asap|critical|p0)\b/i, priority: 'URGENT' },
  { pattern: /\b(?:high\s*(?:priority|prio)?|important|p1)\b/i, priority: 'HIGH' },
  { pattern: /\b(?:medium\s*(?:priority|prio)?|normal|p2)\b/i, priority: 'MEDIUM' },
  { pattern: /\b(?:low\s*(?:priority|prio)?|minor|p3)\b/i, priority: 'LOW' },
];

// Project hint: "#projectname" or "in <project>" or "for <project>"
const PROJECT_PATTERN = /(?:#(\S+)|(?:\b(?:in|for)\s+project\s+)["']?([^"'\s,]+)["']?)/i;

/**
 * Parse a natural language string into structured task fields.
 *
 * Examples:
 *   "Buy groceries tomorrow high priority"
 *   => { title: "Buy groceries", dueDate: tomorrow, priority: "HIGH" }
 *
 *   "Review PR #frontend by Friday urgent"
 *   => { title: "Review PR", dueDate: Friday, priority: "URGENT", projectHint: "frontend" }
 *
 *   "Write tests due next Monday p2"
 *   => { title: "Write tests", dueDate: next Monday, priority: "MEDIUM" }
 */
export function parseNaturalLanguage(input: string): ParsedTask {
  let remaining = input.trim();

  // 1. Extract priority
  let priority: TaskPriority | null = null;
  for (const { pattern, priority: p } of PRIORITY_PATTERNS) {
    if (pattern.test(remaining)) {
      priority = p;
      remaining = remaining.replace(pattern, '').trim();
      break;
    }
  }

  // 2. Extract project hint
  let projectHint: string | null = null;
  const projectMatch = remaining.match(PROJECT_PATTERN);
  if (projectMatch) {
    projectHint = (projectMatch[1] || projectMatch[2]).toLowerCase();
    remaining = remaining.replace(PROJECT_PATTERN, '').trim();
  }

  // 3. Extract date using chrono-node
  let dueDate: Date | null = null;
  const chronoResults = chrono.parse(remaining, new Date(), { forwardDate: true });
  if (chronoResults.length > 0) {
    const result = chronoResults[0];
    dueDate = result.start.date();
    // Remove the date text from the remaining string
    remaining = (
      remaining.slice(0, result.index) + remaining.slice(result.index + result.text.length)
    ).trim();
  }

  // 4. Clean up connecting words left behind
  remaining = remaining
    .replace(/\b(?:due|by|on|at|before)\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,\s]+|[,\s]+$/g, '')
    .trim();

  // 5. Use compromise to clean up the title
  const doc = nlp(remaining);
  // Capitalize first letter properly
  const title = doc.text().trim() || remaining;

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    dueDate,
    priority,
    projectHint,
  };
}

/**
 * Format a parsed result back into a human-readable preview string.
 */
export function formatParsedPreview(parsed: ParsedTask): string {
  const parts: string[] = [];
  if (parsed.title) parts.push(parsed.title);
  if (parsed.dueDate) {
    parts.push(`due ${parsed.dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`);
  }
  if (parsed.priority) parts.push(`[${parsed.priority}]`);
  if (parsed.projectHint) parts.push(`#${parsed.projectHint}`);
  return parts.join(' | ');
}
