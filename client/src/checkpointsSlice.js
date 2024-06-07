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

// Thunk to create a new assessment
export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (assessment, thunkAPI) => {
    const response = await axios.post('http://localhost:3080/api/assessments', assessment, { withCredentials: true });
    return response.data;
  }
);

// Thunk to start an assessment
export const startAssessmentThunk = createAsyncThunk(
  'assessments/startAssessmentThunk',
  async (id, { dispatch, getState }) => {
    const state = getState().checkpoints;
    let assessment = state.assessmentsList.find(assessment => assessment._id === id);
    const date = new Date().toString();

    if (id && assessment) {
      dispatch(startAssessment(id));
    } else {
      assessment = {
        id: null,
        date_created: date,
        date_modified: date,
        answers: [],
        data_capture: {},
        status: "started"
      };
      const response = await dispatch(createAssessment(assessment)).unwrap();
      dispatch(startAssessment(response._id));
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

      const assessmentIndex = state.assessmentsList.findIndex(assessment => assessment._id === state.activeAssessment.id);
      if (assessmentIndex !== -1) {
        state.assessmentsList[assessmentIndex] = state.activeAssessment;

        // Update assessment on the server
        axios.put(`http://localhost:3080/api/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
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
        } else if (assessment.answers.length >= state.totalCheckpoints) {
          state.activeCheckpointIndex = state.totalCheckpoints;
          state.activeCheckpointAnswer = assessment.answers[state.totalCheckpoints - 1];
        } else {
          state.activeCheckpointIndex = state.checkpointAnswers[state.checkpointAnswers.length - 1].id;
          state.activeCheckpointAnswer = state.checkpointAnswers.find(a => a.id === state.activeCheckpointIndex);
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
    deleteAssessment: (state, action) => {
      let id = action.payload;

      const index = state.assessmentsList.findIndex(assessment => assessment._id === id);
      if (index !== -1) {
        state.assessmentsList.splice(index, 1);

        // Delete assessment from the server
        axios.delete(`http://localhost:3080/api/assessments/${id}`, { withCredentials: true });
      }
    },
    updateAssessmentStatus: (state, action) => {
      state.activeAssessment.status = action.payload;

      const assessmentIndex = state.assessmentsList.findIndex(assessment => assessment._id === state.activeAssessment.id);
      if (assessmentIndex !== -1) {
        state.assessmentsList[assessmentIndex] = state.activeAssessment;

        // Update assessment status on the server
        axios.put(`http://localhost:3080/api/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
      }
    },
    updateAssessmentData: (state, action) => {
      state.activeAssessment.data_capture = action.payload;

      const assessmentIndex = state.assessmentsList.findIndex(assessment => assessment._id === state.activeAssessment.id);
      if (assessmentIndex !== -1) {
        state.assessmentsList[assessmentIndex] = state.activeAssessment;

        // Update assessment data on the server
        axios.put(`http://localhost:3080/api/assessments/${state.activeAssessment.id}`, state.activeAssessment, { withCredentials: true });
      }
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

    [createAssessment.pending]: (state) => {
      state.assessments_loading = true;
    },
    [createAssessment.fulfilled]: (state, { payload }) => {
      state.assessments_loading = false;
      state.assessmentsList.push(payload);
      state.activeAssessment.id = payload._id;
    },
    [createAssessment.rejected]: (state) => {
      state.assessments_loading = false;
    }
  },
});

export const { getActiveCheckpoint, updateActiveCheckpointIndex, updateActiveCheckpoint, updateCheckpointAnswers, startAssessment, deleteAssessment, updateAssessmentStatus, updateAssessmentData, updateExtraInfoState } = checkpointsSlice.actions;

export default checkpointsSlice.reducer;
