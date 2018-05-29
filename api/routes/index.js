import express from 'express';

// Grab all our routes
import auth from './auth';
import rooms from './rooms';
import bookings from './bookings';
import uploads from './uploads';

const router = express.Router();

// // Define Routes
router.use('/api/auth/', auth);
router.use('/api/rooms/', rooms);
router.use('/api/bookings/', bookings);
router.use('/api/uploads/', uploads);

export default router;
