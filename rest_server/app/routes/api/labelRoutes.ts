import express from 'express';
const router = express.Router();

import { LabelController } from '../../controller/labelController';
const labelController = new LabelController();

/* Label Entity routes */
router.get('/count', function (req, res) {
    labelController.countAll(res);
});

router.get('/exists/:id', function (req, res) {
    labelController.exists(req, res);
});

router.get('/:id', function (req, res) {
    labelController.findById(req, res);
});

router.get('/', function (req, res) {
    labelController.findAll(req, res);
});

router.put('/:id', function (req, res) {
    labelController.update(req, res);
});

router.post('/create', function (req, res) {
    labelController.create(req, res);
});

router.delete('/:id', function (req, res) {
    labelController.deleteById(req, res);
});

/* Important to export it this way to make Express happy */
module.exports = router;

