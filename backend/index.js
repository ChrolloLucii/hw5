import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import cors from 'cors'
const cookieParser = require('cookie-parser');
import fs from 'fs-extra';

import {getCachedData, setCachedData} from './cache.js'

const app = express();

app.use(express.json());
app.use(cookieParser);
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: 'your_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly : true,
        sameSite: 'lax'
    }
}));

app.post('register', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: 'Login and password required' });
    let users = [];
    if (await fs.pathExists('users.json')) {
        users = await fs.readJson('users.json');
    }
    if (users.find(u => u.login === login)) {
        return res.status(409).json({ error: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    users.push({ login, password: hash });
    await fs.writeJson('users.json', users);
    res.json({ success: true });
});
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    let users = [];
    if (await fs.pathExists('users.json')) {
        users = await fs.readJson('users.json');
    }
    const user = users.find(u => u.login === login);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = { login };
    res.json({ success: true });
});
function requireAuth(req, res, next) {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
}
app.get('/profile', requireAuth, (req, res) => {
    res.json({ login: req.session.user.login });
});
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});
app.get('/data', requireAuth, async (req, res) => {
    let data = await getCachedData();
    if (!data) {
        data = { value: Math.random(), time: Date.now() };
        await setCachedData(data);
    }
    res.json(data);
});

app.listen(3000, () => console.log('Server Started'))