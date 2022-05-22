const express = require('express');
const path = require('path');
const OAuth2Server = require('oauth2-server');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 4001;

const oauth = new OAuth2Server({
    model: require('./model'),
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 60 * 60
});

const authenticateRequest = (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Request(res);

    return oauth.authenticate(request, response)
        .then(() => {
            next();
        }).catch((err) => {
            res.send("You are not allowed");
        });
};

const obtainToken = (req, res) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    return oauth.token(request, response)
        .then((token) => {
            res.json(token);
        }).catch((err) => {
            res.status(err.status || 500).json(err);
        });
};

app.all("/auth", obtainToken);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/home.html'));
})
app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/login.html'));
})

app.get('/secret', authenticateRequest, (req, res)=>{
    res.send('Welcome to the secret area.');
})

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));
