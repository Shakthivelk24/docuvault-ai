import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'
import { UserButton, useAuth } from '@clerk/clerk-react'

import {
  Menu,
  Search,
  Bell,
  Sparkles,
  CheckCircle2,
  Upload,
  ArrowRight,
  FileText,
  AlertCircle,
} from 'lucide-react'

import ThemeToggle from '@/components/ui/ThemeToggle'
import { useDismiss } from '@/hooks/useDismiss'
import { timeAgo } from '@/lib/format'
import api from '@/services/api'


// =========================================================
// NOTIFICATION ICONS
// =========================================================

const NOTIFICATION_ICONS = {
  CheckCircle2,
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  Bell,
}


// =========================================================
// NOTIFICATIONS
// =========================================================

function Notifications() {
  const { getToken } = useAuth()

  const [open, setOpen] =
    useState(false)

  const [notifications, setNotifications] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const close = useCallback(
    () => setOpen(false),
    []
  )

  const ref = useDismiss(close)


  // =======================================================
  // LOAD NOTIFICATIONS
  // =======================================================

  const loadNotifications =
    useCallback(async () => {
      try {
        setLoading(true)

        const response =
          await api.getNotifications()

        if (
          response?.success &&
          Array.isArray(
            response.notifications
          )
        ) {
          setNotifications(
            response.notifications
          )
        }
      } catch (error) {
        console.error(
          'Failed to load notifications:',
          error
        )
      } finally {
        setLoading(false)
      }
    }, [])


  // =======================================================
  // INITIAL NOTIFICATION LOAD
  // =======================================================

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])


  // =======================================================
  // REAL-TIME SSE CONNECTION
  // =======================================================

  useEffect(() => {
    let controller = null
    let reconnectTimer = null
    let stopped = false

    const connect = async () => {
      try {
        controller =
          new AbortController()


        // ---------------------------------------------------
        // Get Clerk token
        // ---------------------------------------------------

        const token =
          await getToken()

        if (!token) {
          console.warn(
            'Clerk token unavailable for notification stream.'
          )

          if (!stopped) {
            reconnectTimer =
              setTimeout(
                connect,
                3000
              )
          }

          return
        }


        // ---------------------------------------------------
        // API URL
        // ---------------------------------------------------

        const API_URL =
          import.meta.env.VITE_API_URL

        if (!API_URL) {
          console.error(
            'VITE_API_URL is not configured.'
          )

          return
        }


        // ---------------------------------------------------
        // Connect to SSE endpoint
        // ---------------------------------------------------

        const response =
          await fetch(
            `${API_URL}/notifications/stream`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,

                Accept:
                  'text/event-stream',
              },

              signal:
                controller.signal,
            }
          )


        if (!response.ok) {
          throw new Error(
            `Notification stream failed with status ${response.status}`
          )
        }


        if (!response.body) {
          throw new Error(
            'Notification stream has no response body.'
          )
        }


        console.log(
          'Notification SSE connected.'
        )


        // ---------------------------------------------------
        // Read SSE stream
        // ---------------------------------------------------

        const reader =
          response.body.getReader()

        const decoder =
          new TextDecoder()

        let buffer = ''


        while (!stopped) {
          const {
            value,
            done,
          } = await reader.read()


          if (done) {
            break
          }


          buffer +=
            decoder.decode(
              value,
              {
                stream: true,
              }
            )


          /*
           * SSE events are separated
           * by a blank line.
           */

          const events =
            buffer.split(
              '\n\n'
            )

          buffer =
            events.pop() || ''


          for (
            const eventBlock
            of events
          ) {
            if (
              !eventBlock.trim()
            ) {
              continue
            }


            const lines =
              eventBlock.split('\n')


            let eventName =
              'message'

            let data = ''


            for (
              const line
              of lines
            ) {
              if (
                line.startsWith(
                  'event:'
                )
              ) {
                eventName =
                  line
                    .slice(6)
                    .trim()
              }


              if (
                line.startsWith(
                  'data:'
                )
              ) {
                data +=
                  line
                    .slice(5)
                    .trim()
              }
            }


            // ------------------------------------------------
            // NEW NOTIFICATION
            // ------------------------------------------------

            if (
              eventName ===
                'notification' &&
              data
            ) {
              try {
                const notification =
                  JSON.parse(data)


                setNotifications(
                  (current) => {

                    /*
                     * Avoid duplicates.
                     */

                    const exists =
                      current.some(
                        (item) =>
                          item.id ===
                          notification.id
                      )


                    if (exists) {
                      return current
                    }


                    return [
                      notification,
                      ...current,
                    ].slice(0, 30)
                  }
                )


                /*
                 * Optional browser console message
                 */

                console.log(
                  'New notification:',
                  notification
                )
              } catch (error) {
                console.error(
                  'Failed to parse notification:',
                  error
                )
              }
            }
          }
        }


        // ---------------------------------------------------
        // Reconnect after connection closes
        // ---------------------------------------------------

        if (!stopped) {
          console.log(
            'Notification SSE disconnected. Reconnecting...'
          )

          reconnectTimer =
            setTimeout(
              connect,
              3000
            )
        }
      } catch (error) {

        /*
         * AbortController cancellation
         * is expected during cleanup.
         */

        if (
          error?.name ===
          'AbortError'
        ) {
          return
        }


        console.error(
          'Notification SSE error:',
          error
        )


        if (!stopped) {
          reconnectTimer =
            setTimeout(
              connect,
              3000
            )
        }
      }
    }


    connect()


    // -------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------

    return () => {
      stopped = true


      if (reconnectTimer) {
        clearTimeout(
          reconnectTimer
        )
      }


      if (controller) {
        controller.abort()
      }
    }
  }, [getToken])


  // =======================================================
  // UNREAD COUNT
  // =======================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length


  // =======================================================
  // MARK ONE NOTIFICATION AS READ
  // =======================================================

  const handleNotificationClick =
    async (notification) => {
      if (notification.read) {
        return
      }


      try {
        await api.markNotificationAsRead(
          notification.id
        )


        setNotifications(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                notification.id
                  ? {
                      ...item,
                      read: true,
                    }
                  : item
            )
        )
      } catch (error) {
        console.error(
          'Failed to mark notification as read:',
          error
        )
      }
    }


  // =======================================================
  // MARK ALL AS READ
  // =======================================================

  const handleMarkAllAsRead =
    async () => {
      if (unreadCount === 0) {
        return
      }


      try {
        await api.markAllNotificationsAsRead()


        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                read: true,
              })
            )
        )
      } catch (error) {
        console.error(
          'Failed to mark all notifications as read:',
          error
        )
      }
    }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      ref={ref}
      className="relative"
    >

      {/* ===================================================
       * NOTIFICATION BUTTON
       * =================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        className={[
          'relative flex h-10 w-10 items-center justify-center',
          'rounded-xl text-muted',
          'transition-all duration-200',
          'hover:bg-[rgb(var(--surface-2))]',
          'hover:text-[rgb(var(--text))]',
          open
            ? 'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))]'
            : '',
        ].join(' ')}
        aria-label="Notifications"
        aria-expanded={open}
      >

        <Bell
          className="h-[18px] w-[18px]"
        />


        {/* Unread indicator */}

        {unreadCount > 0 && (
          <span
            className="
              absolute
              right-[8px]
              top-[7px]
              h-2
              w-2
              rounded-full
              bg-brand-500
              ring-2
              ring-[rgb(var(--surface))]
            "
          />
        )}

      </button>


      {/* ===================================================
       * NOTIFICATION DROPDOWN
       * =================================================== */}

      {open && (
        <div
          className="
            absolute right-0 z-50 mt-2
            w-[calc(100vw-2rem)] max-w-sm
            overflow-hidden
            rounded-2xl
            border border-[rgb(var(--border))]
            bg-[rgb(var(--surface-1))]
            shadow-xl
            animate-fade-in
          "
        >

          {/* =================================================
           * HEADER
           * ================================================= */}

          <div
            className="
              flex items-center justify-between
              border-b
              border-[rgb(var(--border))]
              px-4
              py-3.5
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                "
              >
                Notifications
              </p>


              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-muted
                "
              >
                Recent activity
              </p>

            </div>


            {unreadCount > 0 && (
              <span
                className="
                  rounded-full
                  bg-brand-500/10
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-brand-500
                "
              >
                {unreadCount} new
              </span>
            )}

          </div>


          {/* =================================================
           * NOTIFICATION LIST
           * ================================================= */}

          <ul
            className="
              max-h-[380px]
              overflow-y-auto
            "
          >

            {/* =================================================
             * LOADING
             * ================================================= */}

            {loading ? (

              <li
                className="
                  px-5
                  py-10
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[rgb(var(--surface-2))]
                    text-muted
                  "
                >

                  <Bell
                    className="
                      h-5
                      w-5
                      animate-pulse
                    "
                  />

                </div>


                <p
                  className="
                    text-sm
                    font-medium
                  "
                >
                  Loading notifications...
                </p>

              </li>


            ) : notifications.length === 0 ? (

              /* =================================================
               * EMPTY STATE
               * ================================================= */

              <li
                className="
                  px-5
                  py-10
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[rgb(var(--surface-2))]
                    text-muted
                  "
                >

                  <Bell
                    className="h-5 w-5"
                  />

                </div>


                <p
                  className="
                    text-sm
                    font-medium
                  "
                >
                  You're all caught up
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-muted
                  "
                >
                  No new notifications.
                </p>

              </li>


            ) : (

              /* =================================================
               * NOTIFICATIONS
               * ================================================= */

              notifications.map(
                (notification) => {

                  const Icon =
                    NOTIFICATION_ICONS[
                      notification.icon
                    ] || Bell


                  return (
                    <li
                      key={
                        notification.id
                      }
                      className={[
                        'border-b',
                        'border-[rgb(var(--border))]',
                        'last:border-0',

                        !notification.read
                          ? 'bg-brand-500/[0.025]'
                          : '',
                      ].join(' ')}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className="
                          flex
                          w-full
                          gap-3
                          px-4
                          py-3.5
                          text-left
                          transition-colors
                          hover:bg-[rgb(var(--surface-2))]
                        "
                      >

                        {/* Icon */}

                        <span
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${notification.bg}
                            ${notification.tint}
                          `}
                        >

                          <Icon
                            className="
                              h-4
                              w-4
                            "
                          />

                        </span>


                        {/* Content */}

                        <span
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <span
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <span
                              className={[
                                'block',
                                'text-sm',

                                notification.read
                                  ? 'font-medium'
                                  : 'font-semibold',
                              ].join(' ')}
                            >
                              {
                                notification.title
                              }
                            </span>


                            {/* Unread dot */}

                            {!notification.read && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  shrink-0
                                  rounded-full
                                  bg-brand-500
                                "
                              />
                            )}

                          </span>


                          <span
                            className="
                              mt-0.5
                              block
                              text-xs
                              leading-5
                              text-muted
                            "
                          >
                            {
                              notification.body
                            }
                          </span>


                          <span
                            className="
                              mt-1
                              block
                              text-[11px]
                              text-muted/80
                            "
                          >
                            {timeAgo(
                              notification.createdAt
                            )}
                          </span>

                        </span>

                      </button>

                    </li>
                  )
                }
              )
            )}

          </ul>


          {/* =================================================
           * FOOTER
           * ================================================= */}

          {notifications.length > 0 && (
            <div
              className="
                flex
                gap-2
                border-t
                border-[rgb(var(--border))]
                p-2
              "
            >

              {/* Mark all as read */}

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={
                    handleMarkAllAsRead
                  }
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    rounded-xl
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-muted
                    transition-colors
                    hover:bg-[rgb(var(--surface-2))]
                    hover:text-[rgb(var(--text))]
                  "
                >
                  Mark all as read
                </button>
              )}


              {/* View all */}

              <button
                type="button"
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-brand-500
                  transition-colors
                  hover:bg-brand-500/10
                "
              >

                View all

                <ArrowRight
                  className="
                    h-3.5
                    w-3.5
                  "
                />

              </button>

            </div>
          )}

        </div>
      )}

    </div>
  )
}


// =========================================================
// NAVBAR
// =========================================================

export default function Navbar({
  onMenuClick,
}) {
  const navigate =
    useNavigate()

  const [query, setQuery] =
    useState('')


  // =======================================================
  // SEARCH
  // =======================================================

  function onSearch(event) {
    event.preventDefault()

    const value =
      query.trim()

    navigate(
      `/documents${
        value
          ? `?q=${encodeURIComponent(
              value
            )}`
          : ''
      }`
    )
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <header
      className="
        surface
        sticky
        top-0
        z-30
        flex
        h-16
        items-center
        border-b
        border-[rgb(var(--border))]
        px-3
        sm:px-5
        lg:px-6
      "
    >

      {/* ===================================================
       * LEFT SIDE
       * =================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-2
        "
      >

        {/* Mobile menu */}

        <button
          type="button"
          onClick={onMenuClick}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-muted
            transition-colors
            hover:bg-[rgb(var(--surface-2))]
            hover:text-[rgb(var(--text))]
            lg:hidden
          "
          aria-label="Open menu"
        >

          <Menu
            className="h-5 w-5"
          />

        </button>


        {/* =================================================
         * DESKTOP SEARCH
         * ================================================= */}

        <form
          onSubmit={onSearch}
          className="
            relative
            hidden
            w-full
            max-w-xl
            sm:block
          "
        >

          <Search
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted
            "
          />


          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search documents..."
            className="
              h-10
              w-full
              rounded-xl
              border
              border-transparent
              bg-[rgb(var(--surface-2))]
              pl-10
              pr-4
              text-sm
              outline-none
              placeholder:text-muted
              transition-all
              duration-200
              focus:border-brand-500/30
              focus:bg-[rgb(var(--surface))]
              focus:ring-2
              focus:ring-brand-500/10
            "
            aria-label="Search documents"
          />

        </form>

      </div>


      {/* ===================================================
       * RIGHT SIDE
       * =================================================== */}

      <div
        className="
          ml-2
          flex
          shrink-0
          items-center
          gap-0.5
          sm:gap-1
        "
      >

        {/* Mobile search */}

        <button
          type="button"
          onClick={() =>
            navigate('/documents')
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-muted
            transition-colors
            hover:bg-[rgb(var(--surface-2))]
            hover:text-[rgb(var(--text))]
            sm:hidden
          "
          aria-label="Search documents"
        >

          <Search
            className="
              h-[18px]
              w-[18px]
            "
          />

        </button>


        {/* Theme */}

        <ThemeToggle />


        {/* Notifications */}

        <Notifications />


        {/* Divider */}

        <div
          className="
            mx-1.5
            hidden
            h-6
            w-px
            bg-[rgb(var(--border))]
            sm:block
          "
        />


        {/* User */}

        <div
          className="
            flex
            items-center
          "
        >

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  'h-9 w-9 ring-2 ring-brand-500/10 transition-shadow hover:ring-brand-500/25',
              },
            }}
          />

        </div>

      </div>

    </header>
  )
}