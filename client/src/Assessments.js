import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import AssessmentsList from './AssessmentsList';
import AssessmentsGrid from './AssessmentsGrid';
import Datepicker from './Datepicker';

import {
    getCheckpoints,
    getAssessmentsList,
    startAssessmentThunk
      } from "./checkpointsSlice";


export default function Assessments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalCheckpoints, loading, assessmentsList, assessments_loading } = useSelector((state) => state.checkpoints)

  const initial_filters =
    {
      date_created: {
          touched: false,
          startDate: new Date(),
          endDate: null,
          key: 'selection',
          open: false
      },
      date_modified: {
          touched: false,
          startDate: new Date(),
          endDate: null,
          key: 'selection',
          open: false
      },

      view: "list",
      active_filter: ""
    };

  const [filterData, setFilterData] = useState(
    initial_filters
  );

  const handleDateCreatedChange = (item) => {
    const filters = {...filterData};
    const date_created = item[0];
    date_created.touched = true;
    filters.date_created = date_created;
    setFilterData(filters);
  }

  const handleDateModifiedChange = (item) => {
    const filters = {...filterData};
    const date_modified = item[0];
    date_modified.touched = true;
    filters.date_modified = date_modified;
    setFilterData(filters);
  }

  const handleDateCreatedClear = () => {
    const filters = {...filterData};
    const date_created = initial_filters.date_created;
    filters.date_created = date_created;
    setFilterData(filters);
  }

  const handleDateModifiedClear = () => {
    const filters = {...filterData};
    const date_modified = initial_filters.date_modified;
    filters.date_modified = date_modified;
    setFilterData(filters);
  }

  const checkAssessmentDate = (ad, s, e) => {
    const start = new Date(s).setHours(24,0,0,0);
    const end = new Date(e).setHours(24,0,0,0);
    const date = ad.setHours(24,0,0,0);
    if (date >= start   && date <= end){
      return true;
    }
    return false;
  }

  const updateView = (view) => {
    const filters = {...filterData};
    filters.view = view;
    setFilterData(filters);
  }

  const toggleFilters = (filter) => {
    const filters = {...filterData};
    if (filters.active_filter === filter){
      filters.active_filter = "";
    } else {
      filters.active_filter = filter;
    }
    setFilterData(filters);
  }

  useEffect(() => {
    dispatch(getCheckpoints())
    dispatch(getAssessmentsList())
  }, [])

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(startAssessmentThunk({ id: null, navigate: (id) => window.location.href = `/assessment/${id}` }));
  };

  if (assessments_loading && loading) return <div className="loading"></div>;


  return (
    <div className="template template-assessments-list">
      <div className="container">
      <h1 className="template-title">Your Data Sharing Risk Assessments</h1>
      <div className="template-columns">
        <div className="template-column template-column-70 ctas">


        <div className="assessments-list">
        <div className="assessments-filter">
          <div className="">
            <div className="filter-nav">
              <button
                className={"filter-button " + (filterData.active_filter === "date_created"  ? "active" : "")}
                onClick={() => toggleFilters("date_created")}
              >Filter by: <span>Date Created</span></button>
              <button
              className={"filter-button " + (filterData.active_filter === "date_modified"  ? "active" : "")}
                onClick={() => toggleFilters("date_modified")}
              >Filter by: <span>Date Modified</span></button>

              <button
                className={"layout-mode grid " + (filterData.view === "grid"  ? "active" : "")}
                onClick={() => updateView("grid")}
              ></button>
              <button
              className={"layout-mode list " + (filterData.view === "list"  ? "active" : "")}
                onClick={() => updateView("list")}
              ></button>

            </div>
            <div className={"filter-dropdown " + (filterData.active_filter === "date_created"  ? "active" : "")}>
            <Datepicker
              handleChange={handleDateCreatedChange}
              handleClear={handleDateCreatedClear}

            />
            </div>
            <div className={"filter-dropdown " + (filterData.active_filter === "date_modified" ? "active" : "")}>

            <Datepicker
              handleChange={handleDateModifiedChange}
              handleClear={handleDateModifiedClear}

            />
            </div>
          </div>
        </div>


        {
          filterData.view === "list" ?
          <AssessmentsList
            filterData={filterData}
            checkAssessmentDate={checkAssessmentDate}
          />
          :
          <AssessmentsGrid
            filterData={filterData}
            checkAssessmentDate={checkAssessmentDate}
          />
        }








        </div>


        </div>
        <div className="template-column template-column-30 ctas">
        <div className="start_assessment">
          <Link to="/assessment"
            className="button button-white"
            onClick={handleClick}
          >
              Start a new Data Sharing Risk Assessment
          </Link>
        </div>
        </div>
      </div>


      </div>



    </div>




  )

}
