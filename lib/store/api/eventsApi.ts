import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  organizerId: string;
  maxParticipants?: number;
  currentParticipants: number;
}

interface EventsResponse {
  events: Event[];
  total: number;
}

interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants?: number;
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<
      EventsResponse,
      { page?: number; limit?: number; category?: string; search?: string }
    >({
      query: (params) => ({
        url: "/events",
        params,
      }),
      providesTags: ["Event"],
    }),
    getEvent: builder.query<Event, string>({
      query: (id) => `/events/${id}`,
      providesTags: ["Event"],
    }),
    createEvent: builder.mutation<Event, CreateEventRequest>({
      query: (eventData) => ({
        url: "/events",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Event"],
    }),
    updateEvent: builder.mutation<Event, { id: string; data: Partial<Event> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
