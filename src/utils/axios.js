import axios from 'axios';

import { HOST_API } from 'src/config-global';

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${HOST_API}${endpoints.auth.refreshToken}`, {
            refresh_token: refreshToken,
          });
          const newToken = response.data.access_token;
          sessionStorage.setItem('token', newToken);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          window.location.href = '/auth/jwt/login';
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = '/auth/jwt/login';
      }
    }

    // Create a new Error object with additional properties
    const customError = new Error(error.message);
    customError.config = error.config;
    customError.code = error.code;
    customError.request = error.request;
    if (error.response) {
      customError.response = error.response;
    }
    return Promise.reject(customError);
  }
);

export default axiosInstance;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/admin/me',
    login: '/api/admin/login',
    register: '/api/auth/register',
    refreshToken: '/api/admin/refresh-token',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/admin/blog-list',
    tags: '/api/admin/tags',
    details: '/api/admin/detail-blog/',
    latest: '/api/post/latest',
    search: '/api/post/search',
    new: '/api/admin/new',
    update: '/api/admin/update-blog',
    updateStatus: '/api/admin/update-blog-status',
    delete: (id) => `/api/admin/delete-blog/${id}`,
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  form: {
    list: '/api/admin/form-list',
    }
  category: {
    list: '/api/category/list',
  },
};
