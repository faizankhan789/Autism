import api from './api';

/**
 * Fetch all story categories.
 */
export const getCategories = () =>
  api.get('/stories/categories/').then((res) => res.data);

/**
 * Fetch stories belonging to a specific category.
 * @param {number|string} categoryId
 */
export const getStories = (categoryId) =>
  api.get('/stories/', { params: { category: categoryId } }).then((res) => res.data);

/**
 * Fetch a single story by its ID.
 * @param {number|string} id
 */
export const getStory = (id) =>
  api.get(`/stories/${id}/`).then((res) => res.data);

/**
 * Save story reading progress for a child.
 * @param {Object} data - { child, story, current_scene, completed, ... }
 */
export const saveProgress = (data) =>
  api.post('/stories/progress/', data).then((res) => res.data);

/**
 * Fetch story progress records for a specific child.
 * @param {number|string} childId
 */
export const getProgress = (childId) =>
  api.get('/stories/progress/', { params: { child: childId } }).then((res) => res.data);
