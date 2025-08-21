import { useState, useEffect } from 'react';
import { API_STATUS } from '../utils/constants';
import apiService from '../services/api';

export const useApiStatus = () => {
  const [apiStatus, setApiStatus] = useState(API_STATUS.CHECKING);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const data = await apiService.checkApiStatus();
        setApiStatus(data.status === 'running' ? API_STATUS.CONNECTED : API_STATUS.ERROR);
      } catch (error) {
        setApiStatus(API_STATUS.ERROR);
      }
    };

    checkAPI();
  }, []);

  return apiStatus;
};