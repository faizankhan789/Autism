import api from './api';

/**
 * Fetch the dashboard summary for a specific child.
 * Includes aggregated stats: lessons completed, game scores, reading progress, etc.
 * @param {number|string} childId
 */
export const getSummary = (childId) =>
  api.get(`/dashboard/summary/`, { params: { child: childId } }).then((res) => res.data);

/**
 * Fetch activity log entries for a specific child.
 * @param {number|string} childId
 */
export const getActivityLogs = (childId) =>
  api.get('/dashboard/activity-logs/', { params: { child: childId } }).then((res) => res.data);

/**
 * Add a therapist / parent note for a child.
 * @param {Object} data - { child, content, note_type, ... }
 */
export const addNote = (data) =>
  api.post('/dashboard/notes/', data).then((res) => res.data);

/**
 * Fetch all notes for a specific child.
 * @param {number|string} childId
 */
export const getNotes = (childId) =>
  api.get('/dashboard/notes/', { params: { child: childId } }).then((res) => res.data);

/**
 * Fetch skill assessment records for a specific child.
 * @param {number|string} childId
 */
export const getSkillAssessments = (childId) =>
  api.get('/dashboard/skill-assessments/', { params: { child: childId } }).then((res) => res.data);
