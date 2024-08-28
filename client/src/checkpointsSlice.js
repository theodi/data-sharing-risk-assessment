import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';

// Thunk to get checkpoints
export const getCheckpoints = createAsyncThunk(
  'posts/getCheckpoints',
  async (thunkAPI) => {
    const res = await fetch("/json/checkpoints.json").then(
      (data) => data.json()
    );
    return res;
  }
);

// Thunk to get assessments list from the server
export const getAssessmentsList = createAsyncThunk(
  'users/getAssessmentsList',
  async (thunkAPI) => {
    const res = await axiosInstance.get('/assessments', { withCredentials: true });
    return res.data;
  }
);

// Thunk to create a new assessment
export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (assessment, thunkAPI) => {
    const response = await axiosInstance.post('/assessments', assessment, { withCredentials: true });
    return response.data;
  }
);

// Thunk to start an assessment
export const startAssessmentThunk = createAsyncThunk(
  'assessments/startAssessmentThunk',
  async ({ id, navigate }, { dispatch, getState }) => {
    const state = getState().checkpoints;
    const date = new Date().toString();
    let found = false;
    let assessment = {
      id: null,
      date_created: date,
      date_modified: date,
      answers: [],
      data_capture: {},
      status: "started"
    };

    if (id) {
      assessment = state.assessmentsList.find(assessment => assessment._id === id);
      found = true;
    }

    if (id && found) {
      dispatch(startAssessment(id));
      navigate(id);
    } else {
      const response = await dispatch(createAssessment(assessment)).unwrap();
      navigate(response._id);
    }
  }
);

// Thunk to resume an assessment
export const resumeAssessmentThunk = createAsyncThunk(
  'assessments/resumeAssessmentThunk',
  async (id, { dispatch, getState }) => {
    const state = getState().checkpoints;
    const assessment = state.assessmentsList.find(assessment => assessment._id === id);

    if (assessment) {
      dispatch(startAssessment(id));
      const activeCheckpointIndex = assessment.answers.length > 0 ? assessment.answers.length : 1;
      dispatch(updateActiveCheckpointIndex(activeCheckpointIndex));
      dispatch(updateActiveCheckpoint(activeCheckpointIndex));
    } else {
      throw new Error('Assessment not found');
    }
  }
);

// Thunk to delete an assessment
export const deleteAssessment = createAsyncThunk(
  'checkpoints/deleteAssessment',
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/assessments/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Add shared user
export const addSharedUser = createAsyncThunk(
  'checkpoints/addSharedUser',
  async ({ assessmentId, email }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/assessments/${assessmentId}/sharedUsers`, { email });
      return { assessmentId, email };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Remove shared user
export const removeSharedUser = createAsyncThunk(
  'checkpoints/removeSharedUser',
  async ({ assessmentId, email }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/assessments/${assessmentId}/sharedUsers/${email}`);
      return { assessmentId, email };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const initialState = {
  checkpoints: [],
  totalCheckpoints: 0,
  activeCheckpoint: [],
  checkpointAnswers: [],
  activeCheckpointAnswer: [],
  activeCheckpointIndex: 1,
  loading: false,
  error: null,
  assessmentsList: [],
  activeAssessment: {
    id: null,
    date_created: "",
    date_modified: "",
    answers: [],
    data_capture: {},
    status: "",
    sharedWidth: []
  },
  assessmentStatus: "",
  extraInfoState: false,
};

export const checkpointsSlice = createSlice({
  name: "checkpoints",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    getActiveCheckpoint: (state, action) => {
      state.activeCheckpoint = action.payload[state.activeCheckpointIndex - 1];
    },
    updateExtraInfoState: (state, action) => {
      state.extraInfoState = action.payload;
    },
    updateActiveCheckpointIndex: (state, action) => {
      state.activeCheckpointIndex = action.payload;
      checkpointsSlice.caseReducers.updateActiveCheckpoint(state, action);
      state.extraInfoState = false;
    },
    updateActiveCheckpoint: (state, action) => {
      state.activeCheckpoint = state.checkpoints[action.payload - 1];
      state.activeCheckpointAnswer = state.checkpointAnswers.find(a => a.id === action.payload);
    },
    updateCheckpointAnswers: (state, action) => {
      const answer = action.payload;
      const index = state.checkpointAnswers.findIndex(x => x.id === answer.id);

      if (index === -1) {
        state.checkpointAnswers.push(answer);
      } else {
        state.checkpointAnswers[index] = answer;
      }
      state.activeCheckpointAnswer = answer;
      state.activeAssessment.answers = state.checkpointAnswers;

      const assessmentIndex = state.assessmentsList.findIndex(assessment => assessment._id === state.activeAssessment.id);
      if (assessmentIndex !== -1) {
        state.assessmentsList[assessmentIndex] = state.activeAssessment;
      }
      try {
        // Update assessment data on the server
        axiosInstance.put(`/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
        state.error = null;
      } catch (err) {
        console.err('Failed to save');
        // Ignore and continue as it'll probably work next time
      }
    },
    startAssessment: (state, action) => {
      const id = action.payload;
      const date = new Date().toString();
      state.assessmentStatus = "started";

      const assessment = state.assessmentsList.find(assessment => assessment._id === id);
      if (assessment) {
        state.activeAssessment.id = id;
        state.checkpointAnswers = assessment.answers;

        if (assessment.answers.length === 0) {
          state.activeCheckpointIndex = state.checkpointAnswers[0]?.id || 1;
          state.activeCheckpointAnswer = state.checkpointAnswers.find(a => a.id === state.activeCheckpointIndex);
          state.activeCheckpoint = state.checkpoints[0];
        } else if (assessment.answers.length >= state.totalCheckpoints) {
          state.activeCheckpointIndex = state.totalCheckpoints;
          state.activeCheckpointAnswer = assessment.answers[state.totalCheckpoints - 1];
          state.activeCheckpoint = state.checkpoints[state.totalCheckpoints - 1];
        } else {
          state.activeCheckpointIndex = state.checkpointAnswers[state.checkpointAnswers.length - 1].id;
          state.activeCheckpointAnswer = state.checkpointAnswers.find(a => a.id === state.activeCheckpointIndex);
          state.activeCheckpoint = state.checkpoints[state.activeCheckpointIndex - 1];
        }
        state.activeAssessment.status = assessment.status;
        state.activeAssessment.answers = state.checkpointAnswers;
        state.activeAssessment.date_created = assessment.date_created;
        state.activeAssessment.data_capture = assessment.data_capture;
      } else {
        state.activeAssessment = {
          id: null,
          date_created: date,
          date_modified: date,
          answers: [],
          data_capture: {},
          status: "started"
        };
      }
      state.activeAssessment.date_modified = date;
    },
    updateAssessmentStatus: (state, action) => {
      state.activeAssessment.status = action.payload;

      const assessmentIndex = state.assessmentsList.findIndex(assessment => assessment._id === state.activeAssessment.id);
      if (assessmentIndex !== -1) {
        state.assessmentsList[assessmentIndex] = state.activeAssessment;
      }
      try {
        // Update assessment data on the server
        axiosInstance.put(`/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
        state.error = null;
      } catch (err) {
        state.error = err.message;
      }
    },
    updateAssessmentData: (state, action) => {
      state.activeAssessment.data_capture = action.payload;

      const assessmentIndex = state.assessmentsList.findIndex(assessment => assessment._id === state.activeAssessment.id);
      if (assessmentIndex !== -1) {
        state.assessmentsList[assessmentIndex] = state.activeAssessment;
      }
      try {
        // Update assessment data on the server
        axiosInstance.put(`/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
        state.error = null;
      } catch (err) {
        console.err('Failed to save');
        // Ignore and continue as it'll probably work next time
      }
    }
  },
  extraReducers: {
    [getCheckpoints.pending]: (state) => {
      state.loading = true;
    },
    [getCheckpoints.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.checkpoints = payload;
      state.totalCheckpoints = payload.length;
      state.activeCheckpoint = payload[state.activeCheckpointIndex - 1];
    },
    [getCheckpoints.rejected]: (state) => {
      state.loading = false;
    },

    [getAssessmentsList.pending]: (state) => {
      state.loading = true;
    },
    [getAssessmentsList.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.assessmentsList = payload.map(assessment => ({
        ...assessment,
        id: assessment._id // Add this line to set id to _id
      }));
    },
    [getAssessmentsList.rejected]: (state) => {
      state.loading = false;
    },

    [createAssessment.pending]: (state) => {
      state.loading = true;
    },
    [createAssessment.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.assessmentsList.push(payload);
      state.activeAssessment.id = payload._id;
    },
    [createAssessment.rejected]: (state) => {
      state.loading = false;
    },
    [deleteAssessment.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteAssessment.fulfilled]: (state, action) => {
      state.loading = false;
      const id = action.payload;
      const index = state.assessmentsList.findIndex(assessment => assessment._id === id);
      if (index !== -1) {
        state.assessmentsList.splice(index, 1);
      }
    },
    [deleteAssessment.rejected]: (state, action) => {
      state.loading = false;
      state.error = "Failed to delete assessment.\n" + action.payload;
    },
    [addSharedUser.fulfilled]: (state, action) => {
      state.loading = false;
      const { assessmentId, email } = action.meta.arg;
      const assessment = state.assessmentsList.find(assessment => assessment._id === assessmentId);
      if (assessment) {
        assessment.sharedWith.push({ user: email });
      }
    },
    [removeSharedUser.fulfilled]: (state, action) => {
      state.loading = false;
      const { assessmentId, email } = action.meta.arg;
      const assessment = state.assessmentsList.find(assessment => assessment._id === assessmentId);
      if (assessment) {
        assessment.sharedWith = assessment.sharedWith.filter(user => user.user !== email);
      }
    },
    [addSharedUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [removeSharedUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addSharedUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = "Failed to share with user.\n" + action.payload;
    },
    [removeSharedUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = "Failed to remove share with user.\n" + action.payload;
    }
  },
});

export const { clearError, getActiveCheckpoint, updateActiveCheckpointIndex, updateActiveCheckpoint, updateCheckpointAnswers, startAssessment, updateAssessmentStatus, updateAssessmentData, updateExtraInfoState } = checkpointsSlice.actions;

export default checkpointsSlice.reducer;