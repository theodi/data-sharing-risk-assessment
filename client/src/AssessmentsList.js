import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAssessment } from './checkpointsSlice';

export default function AssessmentsList(props) {
  const dispatch = useDispatch();
  const { totalCheckpoints, assessmentsList, loading, error } = useSelector((state) => state.checkpoints);

  const { filterData, checkAssessmentDate } = props;

  const formatId = (id) => {
    if (id.length > 8) {
      return `${id.substring(0, 4)}....${id.substring(id.length - 4)}`;
    }
    return id;
  };

  return (
    <table>
      <tbody>
        <tr>
          <th>Dataset Name</th>
          <th>Assessment ID</th>
          <th>Created</th>
          <th>Modified</th>
          <th>Owner</th>
          <th>% Completed</th>
          <th>Delete</th>
        </tr>
        {assessmentsList.map((d, i) => {
          const percentComplete = Math.round((d.answers.length / totalCheckpoints) * 100);
          const dc = new Date(d.date_created);
          const dm = new Date(d.date_modified);
          const dateCreated = dc.getDate() + ' / ' + (dc.getMonth() + 1) + ' / ' + dc.getFullYear();
          const dateModified = dm.getDate() + ' / ' + (dm.getMonth() + 1) + ' / ' + dm.getFullYear();
          const name = d.data_capture && d.data_capture.dataset_name ? d.data_capture.dataset_name.value : 'not set';
          const id = d._id;
          const owner = d.ownerEmail;

          const date_created_show = filterData.date_created.touched
            ? checkAssessmentDate(dc, filterData.date_created.startDate, filterData.date_created.endDate)
            : true;
          const date_modified_show = filterData.date_modified.touched
            ? checkAssessmentDate(dm, filterData.date_modified.startDate, filterData.date_modified.endDate)
            : true;
          if (date_created_show && date_modified_show) {
            return (
              <tr key={i} className="assessment">
                <td><a href={`/assessment/${id}`}>{name}</a></td>
                <td><a href={`/assessment/${id}`}>{formatId(id)}</a></td>
                <td><a href={`/assessment/${id}`} className="">{dateCreated} </a></td>
                <td><a href={`/assessment/${id}`} className="">{dateModified} </a></td>
                <td><a href={`/assessment/${id}`} className="">{owner}</a></td>
                <td><a href={`/assessment/${id}`} className="">{percentComplete}%</a></td>
                <td onClick={() => dispatch(deleteAssessment(d._id))} className="delete">
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.91216 0.880944C8.93954 0.792644 8.93952 0.698353 8.91209 0.609981C8.88465 0.521608 8.83105 0.443117 8.75803 0.384417C8.68502 0.325717 8.59588 0.289439 8.50186 0.28017C8.40784 0.2709 8.31316 0.289052 8.22978 0.332333L6.35485 1.30966L6.06373 0.778093C5.99431 0.64976 5.89957 0.536094 5.78499 0.443665C5.67041 0.351236 5.53825 0.281876 5.39616 0.239591C5.25406 0.197305 5.10484 0.182935 4.95712 0.197307C4.8094 0.211679 4.66611 0.25451 4.53553 0.323326L2.69676 1.28079C2.43303 1.41868 2.23619 1.65319 2.1494 1.93292C2.06261 2.21265 2.09295 2.51477 2.23376 2.77304L2.52401 3.30458L0.585701 4.31349C0.493463 4.36215 0.420217 4.43913 0.377252 4.53255C0.334287 4.62597 0.323989 4.73065 0.347947 4.83046C0.371905 4.93027 0.428792 5.01967 0.509831 5.08487C0.590871 5.15007 0.691565 5.18745 0.796397 5.19126C0.880414 5.19441 0.963748 5.17574 1.0379 5.13716L8.68022 1.15678C8.79189 1.09849 8.87528 0.999303 8.91216 0.880944ZM3.36631 2.86583L3.07605 2.3343C3.06526 2.31468 3.05855 2.29318 3.05628 2.27103C3.05402 2.24889 3.05626 2.22653 3.06287 2.20524C3.06948 2.18396 3.08034 2.16416 3.09481 2.147C3.10928 2.12984 3.12708 2.11565 3.14719 2.10524L4.98599 1.14693C5.00609 1.13629 5.02816 1.12966 5.05092 1.12741C5.07368 1.12517 5.09668 1.12737 5.11858 1.13387C5.14048 1.14037 5.16085 1.15105 5.1785 1.1653C5.19616 1.17954 5.21075 1.19706 5.22143 1.21684L5.51169 1.74838L3.36631 2.86583Z" fill="white" />
                    <path d="M6.50513 7.64632C6.37856 7.6419 6.25546 7.68672 6.16283 7.77094C6.0702 7.85517 6.01562 7.97191 6.01107 8.09554L5.9045 11.1475C5.90017 11.2713 5.94637 11.3918 6.03291 11.4825C6.11946 11.5731 6.23927 11.6265 6.36598 11.631C6.4927 11.6354 6.61594 11.5905 6.7086 11.5061C6.80125 11.4217 6.85574 11.3047 6.86006 11.1809L6.96664 8.12891C6.97073 8.00526 6.92443 7.885 6.8379 7.79452C6.75137 7.70404 6.63169 7.65074 6.50513 7.64632Z" fill="white" />
                    <path d="M8.89966 7.73006C8.77309 7.72564 8.64999 7.77046 8.55736 7.85468C8.46473 7.93891 8.41015 8.05565 8.40561 8.17928L8.29903 11.2313C8.2947 11.3551 8.3409 11.4755 8.42745 11.5662C8.51399 11.6569 8.6338 11.7103 8.76051 11.7147C8.88723 11.7191 9.01047 11.6742 9.10313 11.5898C9.19579 11.5054 9.25027 11.3884 9.2546 11.2647L9.36117 8.21265C9.36526 8.089 9.31896 7.96874 9.23243 7.87826C9.14591 7.78778 9.02623 7.73448 8.89966 7.73006Z" fill="white" />
                    <path d="M4.92866 14.547L9.90693 14.7208C10.2533 14.7328 10.592 14.6201 10.8586 14.4042C11.1253 14.1882 11.3014 13.8841 11.3535 13.5494L12.6552 5.18317L2.85156 4.84082L3.56725 13.2792C3.59615 13.6165 3.75073 13.9319 4.00167 14.1656C4.25261 14.3992 4.58247 14.535 4.92866 14.547ZM11.5497 6.07413L10.4088 13.404C10.392 13.5126 10.335 13.6114 10.2485 13.6815C10.162 13.7515 10.052 13.788 9.93964 13.784L4.96138 13.6101C4.84904 13.6061 4.74203 13.562 4.66066 13.4861C4.57928 13.4102 4.52919 13.3078 4.51988 13.1984L3.89307 5.80675L11.5497 6.07413Z" fill="white" />
                  </svg>
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}