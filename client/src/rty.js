// import React from 'react'
// import { useState } from "react";
// import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from './testSlice'
// import { open, close } from './otherSlice'
//
// import {
//     // getCheckpointsAsync,
//     showCheckpoints,
//     showActiveCheckpoint,
//     updateActiveCheckpointIndex,
//     updateActiveCheckpoint,
//       } from "./checkpointsSlice";
//
//
// export function Checkpoint() {
//   const count = useSelector((state) => state.test.value)
//   const opened = useSelector((state) => state.other.value)
//
//   const checkpoints = useSelector(showCheckpoints);
//
//   const t = useSelector((state) => state.checkpoints)
//
//   const activeCheckpoint = useSelector(showActiveCheckpoint);
//
//   const dispatch = useDispatch()
//
//
//   return (
//     <div>
//       <div>
//         <button onClick={() => dispatch(open())}>Open</button>
//         <button onClick={() => dispatch(close())}>Close</button>
//         <span>{opened}</span>
//         <button
//           aria-label="Increment value"
//           onClick={() => dispatch(updateActiveCheckpointIndex(2))}
//         >
//           Increment
//         </button>
//         <span>{count}</span>
//
//         <span>{activeCheckpoint.title}</span>
//         <button
//           aria-label="Decrement value"
//           onClick={() => dispatch(decrement())}
//         >
//           Decrement
//         </button>
//       </div>
//     </div>
//   )
// }
