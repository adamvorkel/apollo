const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


// TODO: change this stuff for production
// server restarts -> tokens lost from memory, use db instead
// access and refresh tokens should be stored in config file I think
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
let refreshTokens = [];

let generateAccessToken = user => jwt.sign(user, accessTokenSecret, { expiresIn: '30s' });
let generateRefreshToken = user => jwt.sign(user, refreshTokenSecret);

router.post('/login', (req, res) => {
    // TODO: Authenticate user
    const user = { name: req.body.username };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
});

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        return res.json({ accessToken });
    });
});

module.exports = router;