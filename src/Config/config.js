const API_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_DEV;

const STORAGE_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_STORAGE_URL_PROD
    : process.env.REACT_APP_STORAGE_URL_DEV;

export { API_URL, STORAGE_URL };