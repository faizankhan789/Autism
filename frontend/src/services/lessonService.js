import api from './api';

/**
 * Fetch all lesson categories.
 */
export const getCategories = () =>
  api.get('/lessons/categories/').then((res) => res.data);

/**
 * Fetch lessons belonging to a specific category.
 * @param {number|string} categoryId
 */
export const getLessons = (categoryId) =>
  api.get('/lessons/', { params: { category: categoryId } }).then((res) => res.data);

/**
 * Fetch a single lesson by its ID.
 * @param {number|string} id
 */
export const getLesson = (id) =>
  api.get(`/lessons/${id}/`).then((res) => res.data);

/**
 * Fetch quizzes associated with a lesson.
 * @param {number|string} lessonId
 */
export const getQuizzes = (lessonId) =>
  api.get(`/lessons/${lessonId}/quizzes/`).then((res) => res.data);

/**
 * Save lesson progress for a child.
 * @param {Object} data - { child, lesson, score, completed, ... }
 */
export const saveProgress = (data) =>
  api.post('/lessons/progress/', data).then((res) => res.data);

/**
 * Fetch lesson progress records for a specific child.
 * @param {number|string} childId
 */
export const getProgress = (childId) =>
  api.get('/lessons/progress/', { params: { child: childId } }).then((res) => res.data);
