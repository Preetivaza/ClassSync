import express from 'express';
import {
  createTimetableEntry,
  getMyTimetable,
  getGroupTimetable,
  getTimetableByDay,
  updateTimetableEntry,
  deleteTimetableEntry,
  getWeeklyTimetable
} from '../controllers/timetableController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(protect);

// Routes
router.route('/')
  .post(createTimetableEntry);

router.route('/my')
  .get(getMyTimetable);

router.route('/group/:groupId')
  .get(getGroupTimetable);

router.route('/day/:day')
  .get(getTimetableByDay);

router.route('/weekly')
  .get(getWeeklyTimetable);

router.route('/:id')
  .put(updateTimetableEntry)
  .delete(deleteTimetableEntry);

export default router;