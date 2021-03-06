import axios from 'axios';


const API = axios.create({
    baseURL: window.apiPath,
    headers: new Headers({
        'Content-Type': 'application/json',
    })
});


API.interceptors.request.use(config => {
    let token = localStorage.getItem('token');
    if (token) {
        config.headers.Token = token
    }
    let contextId = localStorage.getItem('context_id');
    if (contextId) {
        config.headers.contextId = contextId
    }
    config.headers.languageId = window.languageId;
    return config;
});

export default API;