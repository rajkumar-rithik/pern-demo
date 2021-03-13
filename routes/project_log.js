const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async(req, res) => {
    let savedProject;
    try {
        if (req.body.period === true) {
            savedProject = await pool.query("INSERT INTO project_log (project_id, task_id, log_description, user_id, log_hour, log_date) SELECT a.*,b.log_date FROM (SELECT $1 as project_id, $2 as task_id, $3 as log_description, $4::int as user_id, $5::int as log_hour) a CROSS JOIN (SELECT date_trunc('day', dd):: date as log_date FROM generate_series($6::timestamp , $7::timestamp, '1 day'::interval) dd) b RETURNING *", [
                req.body.project_id,
                req.body.task_id,
                req.body.log_description,
                req.body.user_id,
                req.body.log_hour,
                req.body.from_date,
                req.body.to_date
            ]);
        } else {
            savedProject = await pool.query("INSERT INTO project_log (project_id, task_id, log_description, user_id, log_hour, log_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
                req.body.project_id,
                req.body.task_id,
                req.body.log_description,
                req.body.user_id,
                req.body.log_hour,
                req.body.log_date
            ]);
            console.log(req.body);
            console.log("12");
        }
        res.json(savedProject.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
        console.log(err, savedProject);
    }
});

router.get('/', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM v_project_log");
        res.json(project.rows);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.get('/:projectId', async(req, res) => {
    try {
        const project = await pool.query("SELECT * FROM v_project_log WHERE project_id = $1", [req.params.projectId]);
        res.json(project.rows[0]);
    } catch (err) {
        res.json({ err_message: err.message });
    }
});

router.put('/:logId', async(req, res) => {
    try {
        const project = await pool.query("UPDATE project_log SET project_id = $2, task_id = $3, log_description = $4, user_id = $5, log_hour = $6, log_date = $7 WHERE id = $1 RETURNING *", [
            req.params.logId,
            req.body.project_id,
            req.body.task_id,
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