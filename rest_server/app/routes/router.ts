import express from 'express';

const router = express.Router();

/* API routes */
router.use('/map', require('./api/mapRoutes'));
router.use('/place', require('./api/placeRoutes'));
router.use('/family', require('./api/familyRoutes'));

/* Important to export it this way to make Express happy */
module.exports = router;

