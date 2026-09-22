/* ================================================================
 * ACTIVE SSE CLIENTS
 *
 * userId -> Set<Response>
 * ================================================================ */

const clients = new Map()


/* ================================================================
 * ADD NOTIFICATION CLIENT
 * ================================================================ */

export const addNotificationClient = (
  userId,
  res
) => {
  if (!clients.has(userId)) {
    clients.set(
      userId,
      new Set()
    )
  }

  const userClients =
    clients.get(userId)

  userClients.add(res)

  console.log(
    `Notification SSE connected: ${userId}`
  )

  console.log(
    `Active connections for user: ${userClients.size}`
  )


  /*
   * Return cleanup function.
   */

  return () => {
    userClients.delete(res)

    if (userClients.size === 0) {
      clients.delete(userId)
    }

    console.log(
      `Notification SSE disconnected: ${userId}`
    )

    console.log(
      `Remaining connections: ${userClients.size}`
    )
  }
}


/* ================================================================
 * PUSH NOTIFICATION
 * ================================================================ */

export const pushNotification = (
  userId,
  notification
) => {
  if (!userId) {
    console.error(
      'Cannot push notification: userId missing.'
    )

    return
  }


  const userClients =
    clients.get(userId)


  /*
   * No active frontend connection.
   */

  if (
    !userClients ||
    userClients.size === 0
  ) {
    console.log(
      `No active notification connection for user: ${userId}`
    )

    return
  }


  /*
   * Create SSE event.
   */

  const event =
    `event: notification\n` +
    `data: ${JSON.stringify(
      notification
    )}\n\n`


  /*
   * Send to all active connections
   * for this user.
   */

  for (const client of userClients) {
    try {
      client.write(event)
    } catch (error) {
      console.error(
        'Failed to push notification:',
        error.message
      )

      userClients.delete(client)
    }
  }


  console.log(
    `Notification pushed to ${userClients.size} connection(s)`
  )
}