import Notification from "../models/Notification.js";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const notification = new Notification({
      userId,
      message,
      type,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};
