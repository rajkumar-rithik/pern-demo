const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const savedProject = await pool.query("INSERT INTO project_log (project_id, log_description, user_id, log_hour, log_date) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
            req.body.project_id,
            req.body.log_description,
            req.body.user_id,
            req.body.log_hour,
            req.body.log_date
        ]);
        res.json(savedProject.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.get('/', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM v_project_log");
        res.json(project.rows);
        console.log(project.rows);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.get('/:projectId', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM v_project_log WHERE project_id = $1", [req.params.projectId]);
        res.json(project.rows[0]);
        console.log(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.put('/:logId', async(req, res) => {
    try {
        const project = await pool.query("UPDATE project_log SET project_id = $2, log_description = $3, user_id = $4, log_hour = $5, log_date = $6 WHERE id = $1 RETURNING *", [
            req.params.logId,
            req.body.project_id,
            req.body.log_description,
            req.body.user_id,
            req.body.log_hour,
            req.body.log_date,
        ]);
        res.json(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});


router.delete('/:logId', async(req, res) => {
    try {
        await pool.query("DELETE FROM project_log WHERE id = $1", [req.params.logId]);
        res.json({ "message": "Delete Successfull", id: req.params.logId });
    } catch (err) {
        res.json({ err_message: err });
    }
});


module.exports = router;