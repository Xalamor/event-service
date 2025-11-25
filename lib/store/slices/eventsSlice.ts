import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Event {
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

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  filters: {
    category: string;
    date: string;
    search: string;
  };
  isLoading: boolean;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  filters: {
    category: "",
    date: "",
    search: "",
  },
  isLoading: false,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<Event>) => {
      state.currentEvent = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<EventsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        date: "",
        search: "",
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setEvents,
  setCurrentEvent,
  setFilters,
  clearFilters,
  setLoading,
} = eventsSlice.actions;
export default eventsSlice.reducer;
