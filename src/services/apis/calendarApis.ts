import { api } from '.';

// Define types for the calendar data
interface CalendarItem {
  id: number;
  store_id: number;
  article_id: number;
  status: string;
  job_id: string;
  scheduled_date: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface CalendarResponse {
  count: number;
  calendars: CalendarItem[];
}

interface ScheduleArticleRequest {
  store_id: number;
  article_id: string;
  scheduled_date: string;
}

interface ScheduleArticleResponse {
  message: string;
}

interface UpdateCalendarRequest {
  scheduled_date?: string;
  status?: string;
  color?: string;
}

// Create the calendar API endpoints
export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all scheduled articles
    getScheduledArticles: builder.query<CalendarResponse, void>({
      query: () => ({
        url: '/calendars',
        method: 'GET',
      }),
    }),

    // Schedule an article
    scheduleArticle: builder.mutation<ScheduleArticleResponse, ScheduleArticleRequest>({
      query: (scheduleData) => ({
        url: '/schedule-article',
        method: 'POST',
        body: scheduleData,
      }),
      invalidatesTags: ['Articles', 'Subscription'],
    }),

    // Update calendar entry
    updateCalendar: builder.mutation<CalendarItem, { calendarId: number; data: UpdateCalendarRequest }>({
      query: ({ calendarId, data }) => ({
        url: `/calendars/${calendarId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Articles', 'Subscription'],
    }),

    // Delete calendar entry
    deleteCalendar: builder.mutation<void, number>({
      query: (calendarId) => ({
        url: `/calendars/${calendarId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles', 'Subscription'],
    }),
  }),
});

// Export the hooks for use in components
export const {
  useGetScheduledArticlesQuery,
  useScheduleArticleMutation,
  useUpdateCalendarMutation,
  useDeleteCalendarMutation,
} = calendarApi;
