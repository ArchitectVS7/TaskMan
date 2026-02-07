import { describe, it, expect } from 'vitest';
import { parseNaturalLanguage } from '../nlpParser';

describe('parseNaturalLanguage', () => {
  it('returns the input as title when no metadata detected', () => {
    const result = parseNaturalLanguage('Buy groceries');
    expect(result.title).toBe('Buy groceries');
    expect(result.dueDate).toBeNull();
    expect(result.priority).toBeNull();
    expect(result.projectHint).toBeNull();
  });

  it('extracts "urgent" priority', () => {
    const result = parseNaturalLanguage('Deploy fix urgent');
    expect(result.priority).toBe('URGENT');
    expect(result.title).not.toContain('urgent');
  });

  it('extracts "high priority"', () => {
    const result = parseNaturalLanguage('Fix bug high priority');
    expect(result.priority).toBe('HIGH');
    expect(result.title).not.toMatch(/high priority/i);
  });

  it('extracts "low priority"', () => {
    const result = parseNaturalLanguage('Refactor code low priority');
    expect(result.priority).toBe('LOW');
  });

  it('extracts p0 as URGENT', () => {
    const result = parseNaturalLanguage('Fix crash p0');
    expect(result.priority).toBe('URGENT');
  });

  it('extracts p2 as MEDIUM', () => {
    const result = parseNaturalLanguage('Update docs p2');
    expect(result.priority).toBe('MEDIUM');
  });

  it('extracts date from "tomorrow"', () => {
    const result = parseNaturalLanguage('Buy milk tomorrow');
    expect(result.dueDate).not.toBeNull();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(result.dueDate!.getDate()).toBe(tomorrow.getDate());
    expect(result.title.toLowerCase()).not.toContain('tomorrow');
  });

  it('extracts date from "next Friday"', () => {
    const result = parseNaturalLanguage('Review PR next Friday');
    expect(result.dueDate).not.toBeNull();
    expect(result.dueDate!.getDay()).toBe(5); // Friday
  });

  it('extracts project hint from #hashtag', () => {
    const result = parseNaturalLanguage('Fix API #frontend');
    expect(result.projectHint).toBe('frontend');
    expect(result.title).not.toContain('#frontend');
  });

  it('extracts project hint from "in project X"', () => {
    const result = parseNaturalLanguage('Write blog in project marketing');
    expect(result.projectHint).toBe('marketing');
  });

  it('handles combined date + priority + project', () => {
    const result = parseNaturalLanguage('Buy milk tomorrow high priority #shopping');
    expect(result.dueDate).not.toBeNull();
    expect(result.priority).toBe('HIGH');
    expect(result.projectHint).toBe('shopping');
    expect(result.title).toBe('Buy milk');
  });

  it('capitalizes the first letter of title', () => {
    const result = parseNaturalLanguage('fix the bug');
    expect(result.title.charAt(0)).toBe('F');
  });

  it('handles empty input', () => {
    const result = parseNaturalLanguage('');
    expect(result.title).toBe('');
  });

  it('handles "asap" as URGENT', () => {
    const result = parseNaturalLanguage('Ship feature asap');
    expect(result.priority).toBe('URGENT');
  });

  it('handles "important" as HIGH', () => {
    const result = parseNaturalLanguage('Review contracts important');
    expect(result.priority).toBe('HIGH');
  });
});
