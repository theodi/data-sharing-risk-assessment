import { configureStore } from '@reduxjs/toolkit'
import checkpointsReducer from "./checkpointsSlice";


export default configureStore({
  reducer: {
    checkpoints: checkpointsReducer
  },
})
