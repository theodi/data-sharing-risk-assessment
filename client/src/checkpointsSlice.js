import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to get checkpoints
export const getCheckpoints = createAsyncThunk(
  'posts/getCheckpoints',
  async (thunkAPI) => {
    const res = await fetch("./json/checkpoints.json").then(
      (data) => data.json()
    );
    return res;
  }
);

// Thunk to get assessments list from the server
export const getAssessmentsList = createAsyncThunk(
  'users/getAssessmentsList',
  async (thunkAPI) => {
    const res = await axios.get('http://localhost:3080/api/assessments', { withCredentials: true });
    return res.data;
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
  assessmentsList: [],
  activeAssessment: {
    id: null,
    date_created: "",
    date_modified: "",
    answers: [],
    data_capture: {},
    status: ""
  },
  assessmentStatus: "",
  extraInfoState: false,
  assessments_loading: false
};

export const checkpointsSlice = createSlice({
  name: "checkpoints",
  initialState,
  reducers: {
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
      const checkpointAnswers = state.checkpointAnswers;

      if (index === -1) {
        state.checkpointAnswers.push(answer);
      } else {
        state.checkpointAnswers[index] = answer;
      }
      state.activeCheckpointAnswer = answer;
      state.activeAssessment.answers = state.checkpointAnswers;

      state.assessmentsList[state.activeAssessment.id] = state.activeAssessment;

      // Update assessment on the server
      axios.put(`http://localhost:3080/api/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
    },
    startAssessment: (state, action) => {
      let id = action.payload,
          date = new Date().toString();

      state.assessmentStatus = "started";

      if (id != null) {
        state.activeAssessment.id = id;
        state.checkpointAnswers = state.assessmentsList[id].answers;

        if (state.assessmentsList[id].answers.length >= state.totalCheckpoints) {
          state.activeCheckpointIndex = state.totalCheckpoints;
          state.activeCheckpointAnswer = state.assessmentsList[id].answers[state.totalCheckpoints - 1];
        } else {
          state.activeCheckpointIndex = state.checkpointAnswers[state.checkpointAnswers.length - 1].id;
          state.activeCheckpointAnswer = state.checkpointAnswers.find(a => a.id === state.activeCheckpointIndex);
        }
        state.activeAssessment.status = state.assessmentsList[id].status;
        state.activeAssessment.answers = state.checkpointAnswers;
        state.activeAssessment.date_created = state.assessmentsList[id].date_created;
        state.activeAssessment.data_capture = state.assessmentsList[id].data_capture;
      } else {
        id = getAssessmentId(state.assessmentsList);

        state.activeAssessment.id = id;

        state.assessmentStatus = "started";
        state.activeAssessment.date_created = date;
        state.activeCheckpointIndex = 1;
        state.activeCheckpointAnswer = [];
        state.checkpointAnswers = [];
        state.activeAssessment.status = "started";
        state.activeAssessment.answers = [];
        state.activeAssessment.data_capture = {};
        state.activeAssessment.answers = [];

        // Create new assessment on the server
        axios.post('http://localhost:3080/api/assessments', state.activeAssessment, { withCredentials: true })
          .then(response => {
            state.activeAssessment.id = response.data.id;
            state.assessmentsList[state.activeAssessment.id] = state.activeAssessment;
          });
      }
      state.activeAssessment.date_modified = date;
    },
    deleteAssessment: (state, action) => {
      let id = action.payload;

      state.assessmentsList.splice(id, 1);

      // Delete assessment from the server
      axios.delete(`http://localhost:3080/api/assessments/${id}`, { withCredentials: true });
    },
    updateAssessmentStatus: (state, action) => {
      state.activeAssessment.status = action.payload;
      state.assessmentsList[state.activeAssessment.id] = state.activeAssessment;

      // Update assessment status on the server
      axios.put(`http://localhost:3080/api/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
    },
    updateAssessmentData: (state, action) => {
      state.activeAssessment.data_capture = action.payload;
      state.assessmentsList[state.activeAssessment.id] = state.activeAssessment;

      // Update assessment data on the server
      axios.put(`http://localhost:3080/api/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
    },
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
      state.assessments_loading = true;
    },
    [getAssessmentsList.fulfilled]: (state, { payload }) => {
      state.assessments_loading = false;
      state.assessmentsList = payload;
    },
    [getAssessmentsList.rejected]: (state) => {
      state.assessments_loading = false;
    },
  },
});

const getAssessmentId = (assessmentsList) => {
  if (assessmentsList != null) {
    return assessmentsList.length;
  }
  return 0;
};

export const { getActiveCheckpoint, updateActiveCheckpointIndex, updateActiveCheckpoint, updateCheckpointAnswers, startAssessment, deleteAssessment, updateAssessmentStatus, updateAssessmentData, updateExtraInfoState } = checkpointsSlice.actions;

export default checkpointsSlice.reducer;