import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Poll } from '../../types/poll';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/api';

interface PollState {
  polls: Poll[];
  currentPoll: Poll | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: PollState = {
  polls: [],
  currentPoll: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchPolls = createAsyncThunk(
  'polls/fetchPolls',
  async (params?: { page?: number; ordering?: string }) => {
    const response = await api.get(ENDPOINTS.POLLS.LIST, { params });
    return response.data;
  }
);

export const fetchPollById = createAsyncThunk(
  'polls/fetchPollById',
  async (id: number) => {
    const response = await api.get(ENDPOINTS.POLLS.DETAIL(id));
    return response.data;
  }
);

export const submitVote = createAsyncThunk(
  'polls/submitVote',
  async ({ pollId, optionId }: { pollId: number; optionId: number }) => {
    const response = await api.post(ENDPOINTS.POLLS.VOTE, { 
      poll_id: pollId, 
      option_id: optionId 
    });
    return response.data;
  }
);

const pollSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all polls
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and paginated response
        if (Array.isArray(action.payload)) {
          state.polls = action.payload;
          state.totalPages = 1;
        } else if (action.payload.results) {
          state.polls = action.payload.results;
          state.totalPages = Math.ceil(action.payload.count / 10) || 1;
        }
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch polls';
      })
      // Fetch single poll by ID
      .addCase(fetchPollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoll = action.payload;
      })
      .addCase(fetchPollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch poll';
      })
      // Submit vote
      .addCase(submitVote.fulfilled, (state, action) => {
        // Update the current poll if it's the one we voted on
        if (state.currentPoll && state.currentPoll.id === action.payload.id) {
          state.currentPoll = action.payload;
        }
        // Update the poll in the polls list
        state.polls = state.polls.map(poll => 
          poll.id === action.payload.id ? action.payload : poll
        );
      });
  },
});

export const { setLoading, setPage, clearCurrentPoll, clearError } = pollSlice.actions;
export default pollSlice.reducer;