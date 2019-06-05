import express from 'express';

const router = express.Router();

/* API routes */
router.use('/label', require('./api/labelRoutes'));

/* Important to export it this way to make Express happy */
module.exports = router;

