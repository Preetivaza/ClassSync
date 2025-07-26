// controllers/timetableController.js
import Timetable from '../models/Timetable.js';
import User from '../models/User.js';
import Group from '../models/Group.js';

// @desc    Create timetable entry
// @route   POST /api/timetable
// @access  Private (Teacher/Student)
export const createTimetableEntry = async (req, res) => {
  try {
    const { day, startTime, endTime, subject, location, groupId } = req.body;
    
    // Validate required fields
    if (!day || !startTime || !endTime || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Day, startTime, endTime, and subject are required'
      });
    }

    // Check if user is authorized to create timetable entry
    const userId = req.user._id;
    const userRole = req.user.role;

    let timetableData = {
      day,
      startTime,
      endTime,
      subject,
      location,
      user: userId
    };

    // If it's a teacher and group is provided, associate with group
    if (userRole === 'teacher' && groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found'
        });
      }
      
      // Check if user is the group creator (teacher)
      if (group.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create timetable for this group'
        });
      }
      
      timetableData.group = groupId;
      timetableData.teacher = userId;
      delete timetableData.user; // Remove user field for group timetable
    }

    // Check for time conflicts
    const existingEntries = await Timetable.find({
      $or: [
        { user: userId, day, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { group: groupId, day, startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingEntries.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Time conflict detected with existing timetable entry'
      });
    }

    const timetableEntry = await Timetable.create(timetableData);

    res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: timetableEntry
    });
  } catch (error) {
    console.error('Error creating timetable entry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's timetable
// @route   GET /api/timetable/my
// @access  Private
export const getMyTimetable = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const timetableEntries = await Timetable.find({ user: userId })
      .sort({ day: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: timetableEntries.length,
      data: timetableEntries
    });
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get group timetable
// @route   GET /api/timetable/group/:groupId
// @access  Private (Group members only)
export const getGroupTimetable = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is member of the group
    if (!group.members.includes(userId) && group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this group timetable'
      });
    }

    const timetableEntries = await Timetable.find({ group: groupId })
      .populate('teacher', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: timetableEntries.length,
      data: timetableEntries
    });
  } catch (error) {
    console.error('Error fetching group timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get timetable by day
// @route   GET /api/timetable/day/:day
// @access  Private
export const getTimetableByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const userId = req.user._id;

    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day. Must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday'
      });
    }

    const timetableEntries = await Timetable.find({ 
      $or: [
        { user: userId, day: day.toLowerCase() },
        { group: { $in: await Group.find({ members: userId }).distinct('_id') }, day: day.toLowerCase() }
      ]
    })
    .populate('group', 'name')
    .populate('teacher', 'name')
    .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: timetableEntries.length,
      data: timetableEntries
    });
  } catch (error) {
    console.error('Error fetching timetable by day:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update timetable entry
// @route   PUT /api/timetable/:id
// @access  Private (Owner only)
export const updateTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const timetableEntry = await Timetable.findById(id);
    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check authorization
    let isAuthorized = false;
    if (timetableEntry.user) {
      // Personal timetable entry
      isAuthorized = timetableEntry.user.toString() === userId.toString();
    } else if (timetableEntry.group && timetableEntry.teacher) {
      // Group timetable entry
      isAuthorized = timetableEntry.teacher.toString() === userId.toString();
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this timetable entry'
      });
    }

    // Check for time conflicts (excluding current entry)
    const { day, startTime, endTime } = req.body;
    if (day && startTime && endTime) {
      const conflictQuery = {
        _id: { $ne: id },
        day: day || timetableEntry.day,
        startTime: { $lt: endTime || timetableEntry.endTime },
        endTime: { $gt: startTime || timetableEntry.startTime }
      };

      if (timetableEntry.user) {
        conflictQuery.user = userId;
      } else {
        conflictQuery.group = timetableEntry.group;
      }

      const existingEntries = await Timetable.find(conflictQuery);
      if (existingEntries.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Time conflict detected with existing timetable entry'
        });
      }
    }

    const updatedEntry = await Timetable.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Timetable entry updated successfully',
      data: updatedEntry
    });
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Owner only)
export const deleteTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const timetableEntry = await Timetable.findById(id);
    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check authorization
    let isAuthorized = false;
    if (timetableEntry.user) {
      // Personal timetable entry
      isAuthorized = timetableEntry.user.toString() === userId.toString();
    } else if (timetableEntry.group && timetableEntry.teacher) {
      // Group timetable entry
      isAuthorized = timetableEntry.teacher.toString() === userId.toString();
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this timetable entry'
      });
    }

    await Timetable.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get weekly timetable
// @route   GET /api/timetable/weekly
// @access  Private
export const getWeeklyTimetable = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's personal timetable
    const personalEntries = await Timetable.find({ user: userId });

    // Get timetable for groups user belongs to
    const userGroups = await Group.find({ 
      $or: [
        { members: userId },
        { createdBy: userId }
      ]
    }).distinct('_id');

    const groupEntries = await Timetable.find({ 
      group: { $in: userGroups }
    })
    .populate('group', 'name')
    .populate('teacher', 'name');

    // Combine and organize by day
    const allEntries = [...personalEntries, ...groupEntries];
    const weeklyTimetable = {};

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      weeklyTimetable[day] = allEntries
        .filter(entry => entry.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    res.status(200).json({
      success: true,
      data: weeklyTimetable
    });
  } catch (error) {
    console.error('Error fetching weekly timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};