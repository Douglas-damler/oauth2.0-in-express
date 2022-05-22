let db = require('./db');

const getClient = (clientId, clientSecret) => {
    let confidentialClients = db.confidentialClients.filter((client) => {
        return client.clientId === clientId && client.clientSecret === clientSecret;
    });
    return confidentialClients[0];
};

const saveToken = (token, client, user) => {
    token.client = {
        id: client.clientId;
    }
    token.user = {
        username: user.username;
    }
    db.tokens.push(token);
    return token;
};

const getUserFromClient = (client) => {
    return {};
};

const getAccessToken = (accessToken) => {
    const token = db.tokens.fillter((savedToken) => {
        return savedToken.accessToken === accessToken;
    });
    return token[0];
};

module.exports = {
    getClient: getClient,
    saveToken: saveToken,
    getUserFromClient: getUserFromClient,
    getAccessToken: getAccessToken
};