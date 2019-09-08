import express from 'express';
const router = express.Router();

import { FamilyController } from '../../controller/familyController';
const familyController = new FamilyController();

router.get('/:mapid/:userid/count', function (req, res) {
    familyController.countAll(req, res);
});

router.get('/:mapid/:userid/exists/:familyid', function (req, res) {
    familyController.exists(req, res);
});

router.get('/:mapid/:userid/:familyid', function (req, res) {
    familyController.findById(req, res);
});

router.get('/:mapid/:userid', function (req, res) {
    familyController.findAll(req, res);
});

router.put('/:mapid/:userid/:familyid', function (req, res) {
    familyController.update(req, res);
});

/* Important to export it this way to make Express happy */
module.exports = router;

