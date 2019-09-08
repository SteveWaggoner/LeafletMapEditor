import express from 'express';
const router = express.Router();

import { MapController } from '../../controller/mapController';
const mapController = new MapController();

router.get('/count', function (req, res) {
    mapController.countAll(res);
});

router.get('/exists/:mapid', function (req, res) {
    mapController.exists(req, res);
});

router.get('/:mapid', function (req, res) {
    mapController.findById(req, res);
});

router.get('/', function (req, res) {
    mapController.findAll(req, res);
});


/* Important to export it this way to make Express happy */
module.exports = router;

