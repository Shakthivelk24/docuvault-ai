import { getAuth } from '@clerk/express'

import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService.js'

import {
  addNotificationClient,
} from '../services/notificationSse.js'


/* ================================================================
 * GET NOTIFICATIONS
 * ================================================================ */

export const getNotifications = async (
  req,
  res
) => {
  try {
    const { userId } =
      getAuth(req)


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }


    const notifications =
      await getUserNotifications({
        userId,
        limit: 30,
      })


    return res.status(200).json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error(
      'Failed to get notifications:',
      error
    )


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to get notifications.',
    })
  }
}


/* ================================================================
 * SSE NOTIFICATION STREAM
 * ================================================================ */

export const notificationStream = async (
  req,
  res
) => {
  try {
    const { userId } =
      getAuth(req)


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }


    /*
     * SSE headers
     */

    res.writeHead(200, {
      'Content-Type':
        'text/event-stream',

      'Cache-Control':
        'no-cache, no-transform',

      Connection:
        'keep-alive',

      'X-Accel-Buffering':
        'no',

      'Access-Control-Allow-Origin':
        process.env.CLIENT_URL ||
        'http://localhost:5173',

      'Access-Control-Allow-Credentials':
        'true',
    })


    /*
     * Send initial connection event.
     */

    res.write(
      `event: connected\n` +
      `data: ${JSON.stringify({
        success: true,
        message:
          'Notification stream connected.',
      })}\n\n`
    )


    /*
     * Register this connection.
     */

    const removeClient =
      addNotificationClient(
        userId,
        res
      )


    /*
     * Heartbeat.
     *
     * Keeps the SSE connection alive.
     */

    const heartbeat =
      setInterval(() => {
        try {
          res.write(
            `event: heartbeat\n` +
            `data: ${JSON.stringify({
              timestamp:
                new Date().toISOString(),
            })}\n\n`
          )
        } catch (error) {
          console.error(
            'SSE heartbeat failed:',
            error.message
          )

          clearInterval(
            heartbeat
          )
        }
      }, 30000)


    /*
     * Browser disconnected.
     */

    req.on('close', () => {
      clearInterval(
        heartbeat
      )

      removeClient()
    })
  } catch (error) {
    console.error(
      'Notification SSE error:',
      error
    )


    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Failed to start notification stream.',
      })
    }


    res.end()
  }
}


/* ================================================================
 * MARK ONE NOTIFICATION AS READ
 * ================================================================ */

export const readNotification = async (
  req,
  res
) => {
  try {
    const { userId } =
      getAuth(req)


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }


    const {
      id: notificationId,
    } = req.params


    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message:
          'Notification ID is required.',
      })
    }


    await markNotificationAsRead({
      userId,
      notificationId,
    })


    return res.status(200).json({
      success: true,
      message:
        'Notification marked as read.',
    })
  } catch (error) {
    console.error(
      'Failed to mark notification as read:',
      error
    )


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to mark notification as read.',
    })
  }
}


/* ================================================================
 * MARK ALL NOTIFICATIONS AS READ
 * ================================================================ */

export const readAllNotifications =
  async (req, res) => {
    try {
      const { userId } =
        getAuth(req)


      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        })
      }


      const result =
        await markAllNotificationsAsRead({
          userId,
        })


      return res.status(200).json({
        success: true,
        message:
          'All notifications marked as read.',
        updated:
          result.updated,
      })
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      )


      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Failed to mark all notifications as read.',
      })
    }
  }

  export const testNotification = async (
  req,
  res
) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const notification =
      await createNotification({
        userId,
        type: 'TEST',
        title: 'Test notification',
        body: 'Your real-time notification system is working.',
        icon: 'Bell',
        tint: 'text-brand-500',
        bg: 'bg-brand-500/10',
      })

    return res.status(201).json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error(
      'Failed to create test notification:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to create test notification.',
    })
  }
}