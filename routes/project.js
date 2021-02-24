const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const savedProject = await pool.query("INSERT INTO project (title, description, reporter) VALUES ($1, $2, $3) RETURNING *", [
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
        const project = await pool.query("SELECT * FROM project");
        res.json(project.rows);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.get('/:projectId', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM project WHERE id = $1", [req.params.projectId]);
        res.json(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.put('/:projectId', async(req, res) => {
    try {
        const project = await pool.query("UPDATE project SET title = $2, description = $3, reporter = $4 WHERE id = $1 RETURNING *", [
            req.params.projectId,
            req.body.title,
            req.body.description,
            req.body.reporter
        ]);
        res.json(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});


router.delete('/:projectId', async(req, res) => {
    try {
        await pool.query("DELETE FROM project WHERE id = $1", [req.params.projectId]);
        res.json({ "message": "Delete Successfull", id: req.params.projectId });
    } catch (err) {
        res.json({ err_message: err });
    }
});


module.exports = router;