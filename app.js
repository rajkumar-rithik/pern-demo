const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

const projectRoute = require('./routes/project');
const taskRoute = require('./routes/task');
const projectLogRoute = require('./routes/project_log');

app.use('/project', projectRoute);
app.use('/task', taskRoute);
app.use('/log', projectLogRoute);

app.get('/', (req, res) => {
    res.send('home');
});

app.listen(3001);