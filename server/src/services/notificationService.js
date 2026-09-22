import crypto from 'crypto'

import {
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'

import dynamoClient from '../config/dynamo.js'

import {
  pushNotification,
} from './notificationSse.js'


const TABLE_NAME =
  'DocuVaultNotifications'


/* ================================================================
 * CREATE NOTIFICATION
 * ================================================================ */

export const createNotification = async ({
  userId,
  type = 'GENERAL',
  title,
  body = '',
  icon = 'Bell',
  tint = 'text-brand-500',
  bg = 'bg-brand-500/10',
  documentId = null,
}) => {

  /*
   * Validate user.
   */

  if (!userId) {
    throw new Error(
      'userId is required to create a notification.'
    )
  }


  /*
   * Validate title.
   */

  if (!title) {
    throw new Error(
      'Notification title is required.'
    )
  }


  /*
   * Generate notification ID.
   */

  const notificationId =
    crypto.randomUUID()


  /*
   * Timestamp.
   */

  const createdAt =
    new Date().toISOString()


  /*
   * DynamoDB item.
   */

  const item = {
    userId: {
      S: userId,
    },

    notificationId: {
      S: notificationId,
    },

    type: {
      S: type,
    },

    title: {
      S: title,
    },

    body: {
      S: body,
    },

    icon: {
      S: icon,
    },

    tint: {
      S: tint,
    },

    bg: {
      S: bg,
    },

    read: {
      BOOL: false,
    },

    createdAt: {
      S: createdAt,
    },
  }


  /*
   * Add document ID when available.
   */

  if (documentId) {
    item.documentId = {
      S: documentId,
    }
  }


  /*
   * Save notification to DynamoDB.
   */

  await dynamoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  )


  /*
   * Convert to frontend object.
   */

  const notification = {
    id: notificationId,
    userId,
    type,
    title,
    body,
    icon,
    tint,
    bg,
    read: false,
    createdAt,
    documentId,
  }


  /*
   * Push notification immediately
   * to connected frontend clients.
   */

  pushNotification(
    userId,
    notification
  )


  /*
   * Return notification.
   */

  return notification
}


/* ================================================================
 * GET USER NOTIFICATIONS
 * ================================================================ */

export const getUserNotifications = async ({
  userId,
  limit = 30,
}) => {

  if (!userId) {
    throw new Error(
      'userId is required.'
    )
  }


  const response =
    await dynamoClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,

        KeyConditionExpression:
          'userId = :userId',

        ExpressionAttributeValues: {
          ':userId': {
            S: userId,
          },
        },

        Limit: limit,

        ScanIndexForward: false,
      })
    )


  return (
    response.Items || []
  ).map((item) => ({
    id:
      item.notificationId?.S,

    userId:
      item.userId?.S,

    type:
      item.type?.S ||
      'GENERAL',

    title:
      item.title?.S ||
      '',

    body:
      item.body?.S ||
      '',

    icon:
      item.icon?.S ||
      'Bell',

    tint:
      item.tint?.S ||
      'text-brand-500',

    bg:
      item.bg?.S ||
      'bg-brand-500/10',

    read:
      item.read?.BOOL ||
      false,

    createdAt:
      item.createdAt?.S ||
      null,

    documentId:
      item.documentId?.S ||
      null,
  }))
}


/* ================================================================
 * MARK ONE NOTIFICATION AS READ
 * ================================================================ */

export const markNotificationAsRead =
  async ({
    userId,
    notificationId,
  }) => {

    if (!userId) {
      throw new Error(
        'userId is required.'
      )
    }


    if (!notificationId) {
      throw new Error(
        'notificationId is required.'
      )
    }


    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,

        Key: {
          userId: {
            S: userId,
          },

          notificationId: {
            S: notificationId,
          },
        },

        UpdateExpression:
          'SET #read = :read',

        ExpressionAttributeNames: {
          '#read': 'read',
        },

        ExpressionAttributeValues: {
          ':read': {
            BOOL: true,
          },
        },
      })
    )


    return {
      success: true,
    }
  }


/* ================================================================
 * MARK ALL NOTIFICATIONS AS READ
 * ================================================================ */

export const markAllNotificationsAsRead =
  async ({
    userId,
  }) => {

    if (!userId) {
      throw new Error(
        'userId is required.'
      )
    }


    const notifications =
      await getUserNotifications({
        userId,
        limit: 100,
      })


    const unreadNotifications =
      notifications.filter(
        (notification) =>
          !notification.read
      )


    await Promise.all(
      unreadNotifications.map(
        (notification) =>
          markNotificationAsRead({
            userId,
            notificationId:
              notification.id,
          })
      )
    )


    return {
      success: true,

      updated:
        unreadNotifications.length,
    }
  }


/* ================================================================
 * DELETE NOTIFICATION
 * ================================================================ */

export const deleteNotification =
  async ({
    userId,
    notificationId,
  }) => {

    if (!userId) {
      throw new Error(
        'userId is required.'
      )
    }


    if (!notificationId) {
      throw new Error(
        'notificationId is required.'
      )
    }


    await dynamoClient.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,

        Key: {
          userId: {
            S: userId,
          },

          notificationId: {
            S: notificationId,
          },
        },
      })
    )


    return {
      success: true,
    }
  }