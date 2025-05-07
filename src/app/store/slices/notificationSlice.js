import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch notifications');
      }

      return await response.json(); // Assuming the API returns the notifications
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/notifications/markasread', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark notifications as read');
      }

      return await response.json(); // Assuming the API returns a success message
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      const { notification_id } = action.payload;
      const notification = state.notifications.find(
        (n) => n.notification_id === notification_id
      );
      if (notification) {
        notification.is_read = true;
      }
    },
    addNotification: (state, action) => {
      const newNotification = action.payload;
      state.notifications.push(newNotification);
    },
    deleteNotification: (state, action) => {
      const { notification_id } = action.payload;
      state.notifications = state.notifications.filter(
        (n) => n.notification_id !== notification_id
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications; // Assuming API returns { notifications: [...] }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          is_read: true,
        })); // Mark all notifications as read
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark notifications as read';
      });
  },
});

export const {
  markAsRead,
  addNotification,
  deleteNotification,
  clearNotifications,
} = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectNotificationsLoading = (state) =>
  state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;

export default notificationsSlice.reducer;
