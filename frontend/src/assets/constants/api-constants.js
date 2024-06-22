// Auth
export const $authApi = {
    login: '/auth/login/',
    emailVerify: '/auth/email-verify/',
    passwordRecovery: '/auth/password-recovery/',
    me: '/auth/me/',
};

// Files
export const $filesApi = {
    list: '/files/',
    id: id => `/files/${id}/`,
    view: id => `/files/${id}/view/`,
};
