import express from 'express'

import {
  getNotifications,
  notificationStream,
  readNotification,
  readAllNotifications,
  testNotification,
} from '../controllers/notificationController.js'

const router = express.Router()


// Get existing notifications
router.get(
  '/',
  getNotifications
)


// Real-time SSE stream
router.get(
  '/stream',
  notificationStream
)


// Mark one notification as read
router.post(
  '/:id/read',
  readNotification
)


// Mark all notifications as read
router.post(
  '/read-all',
  readAllNotifications
)
router.post('/test', testNotification)



export default router