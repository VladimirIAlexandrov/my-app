export const setServerAddress = (address) => {
    localStorage.setItem('serverAddress', address);
};

export const getServerAddress = () => {
    return localStorage.getItem('serverAddress') || 'http://localhost:5000';
};
