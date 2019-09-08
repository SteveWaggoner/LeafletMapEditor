import express from 'express';
const router = express.Router();

import { PlaceController } from '../../controller/placeController';
const placeController = new PlaceController();

router.get('/:mapid/:userid/count', function (req, res) {
    placeController.countAll(req, res);
});

router.get('/:mapid/:userid/exists/:placeid', function (req, res) {
    placeController.exists(req, res);
});

router.get('/:mapid/:userid/:placeid', function (req, res) {
    placeController.findById(req, res);
});

router.get('/:mapid/:userid', function (req, res) {
    placeController.findAll(req, res);
});

router.put('/:mapid/:userid/:placeid', function (req, res) {
    placeController.update(req, res);
});

/* Important to export it this way to make Express happy */
module.exports = router;

