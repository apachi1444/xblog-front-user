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
  article_id: number;
  scheduled_date: string;
}

interface ScheduleArticleResponse {
  message: string;
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
    }),
  }),
});

// Export the hooks for use in components
export const {
  useGetScheduledArticlesQuery,
  useLazyGetScheduledArticlesQuery,
  useScheduleArticleMutation,
} = calendarApi;