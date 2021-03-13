const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const savedProject = await pool.query("INSERT INTO task (title, description, reporter) VALUES ($1, $2, $3) RETURNING *", [
            req.body.title,
            req.body.description,
            req.body.reporter
        ]);
        res.json(savedProject.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.get('/', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM task");
        res.json(project.rows);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.get('/:taskId', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM task WHERE id = $1", [req.params.taskId]);
        res.json(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.put('/:taskId', async(req, res) => {
    try {
        const project = await pool.query("UPDATE task SET title = $2, description = $3, reporter = $4 WHERE id = $1 RETURNING *", [
            req.params.taskId,
            req.body.title,
            req.body.description,
            req.body.reporter
        ]);
        res.json(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});


router.delete('/:taskId', async(req, res) => {
    try {
        await pool.query("DELETE FROM task WHERE id = $1", [req.params.taskId]);
        res.json({ "message": "Delete Successfull", id: req.params.taskId });
    } catch (err) {
        res.json({ err_message: err });
    }
});


module.exports = router;