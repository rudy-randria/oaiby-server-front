export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export const SERVICE_ACTIONS = {
  STATUS: 'status',
  START: 'start',
  STOP: 'stop',
  RESTART: 'restart'
};

export const API_STATUS = {
  CHECKING: 'checking',
  CONNECTED: 'connected',
  ERROR: 'error'
};

export const REFRESH_INTERVAL = 5000; // 5 secondes