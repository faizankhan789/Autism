import api from './api';

/**
 * Fetch all available games.
 */
export const getGames = () =>
  api.get('/games/').then((res) => res.data);

/**
 * Fetch a single game by its ID.
 * @param {number|string} id
 */
export const getGame = (id) =>
  api.get(`/games/${id}/`).then((res) => res.data);

/**
 * Save a game session / result.
 * @param {Object} data - { child, game, score, duration, metrics, ... }
 */
export const saveSession = (data) =>
  api.post('/games/sessions/', data).then((res) => res.data);

/**
 * Fetch game sessions for a specific child.
 * @param {number|string} childId
 */
export const getSessions = (childId) =>
  api.get('/games/sessions/', { params: { child: childId } }).then((res) => res.data);

/**
 * Fetch rewards / achievements earned by a specific child.
 * @param {number|string} childId
 */
export const getRewards = (childId) =>
  api.get('/games/rewards/', { params: { child: childId } }).then((res) => res.data);
