import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Базовый тип мероприятия из API
export interface Event {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  points_reward: number;
  is_active: boolean;
  category: string;
  image_url: string | null;
  organizer_id: number;
  is_online?: boolean;
  price?: number;
}

// Тип для ответа API (одиночное мероприятие)
export interface EventResponse {
  event: Event;
  organizer: {
    username: string;
  };
}

// Тип для списка мероприятий
export type EventsResponse = Event[];

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date_time: string;
  location: string;
  max_participants: number;
  points_reward?: number;
  category: string;
  image_url?: string;
  is_online?: boolean;
  price?: number;
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://event-manager-q544.onrender.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const token = state?.auth?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Events", "Event"],
  endpoints: (builder) => ({
    // Получение всех мероприятий
    getEvents: builder.query<EventsResponse, PaginationParams>({
      query: (params) => ({
        url: "/events",
        params: {
          page: params.page,
          limit: params.limit,
          category: params.category,
          search: params.search,
        },
      }),
      transformResponse: (response: any): Event[] => {
        console.log("Events API response:", response);

        // Если ответ содержит массив events
        if (response && Array.isArray(response.events)) {
          return response.events; // Возвращаем массив мероприятий напрямую
        }

        // Если ответ содержит массив объектов с полем event
        if (Array.isArray(response) && response[0]?.event) {
          return response.map((item: any) => item.event);
        }

        // Если ответ просто массив мероприятий
        if (Array.isArray(response)) {
          return response;
        }

        console.warn("Неизвестный формат ответа мероприятий:", response);
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Event" as const, id })),
              { type: "Events", id: "LIST" },
            ]
          : [{ type: "Events", id: "LIST" }],
    }),

    // Получение одного мероприятия
    getEvent: builder.query<EventResponse, number>({
      query: (id) => `/events/${id}`,
      transformResponse: (response: any): EventResponse => {
        console.log("Single event API response:", response);
        return response;
      },
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    // Создание мероприятия
    createEvent: builder.mutation<EventResponse, CreateEventRequest>({
      query: (eventData) => ({
        url: "/events",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),

    // Обновление мероприятия
    updateEvent: builder.mutation<
      EventResponse,
      { id: number; data: Partial<CreateEventRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Event", id },
        { type: "Events", id: "LIST" },
      ],
    }),

    // Удаление мероприятия
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),

    // Регистрация на мероприятие
    registerForEvent: builder.mutation<any, number>({
      query: (eventId) => ({
        url: `/events/${eventId}/register`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "Events", id: "LIST" },
      ],
    }),

    // Отмена регистрации
    cancelRegistration: builder.mutation<any, number>({
      query: (eventId) => ({
        url: `/events/${eventId}/register`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "Events", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useRegisterForEventMutation,
  useCancelRegistrationMutation,
} = eventsApi;
