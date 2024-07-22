import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../context/modal-context'
import {
  startAssessmentThunk,
  } from "./../checkpointsSlice";

const Button = (props) => {
  const { setModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/assessments/`);
  };


  function ExternalLink(props) {
    return <a className={"button button-white " + (props.link_icon) } href={props.link_url} target="_blank" rel="noreferrer">{props.link_title}</a>;
  }

  function InternalLink(props) {
    return <a
      href={props.link_url}
      className={"button button-white " + (props.link_icon)}
      onClick={handleClick}
    >
      {props.link_title}
    </a>
  }

  function ModalLink(props) {

    return <button className={"button button-white " + ( props.link_icon) } onClick={() => {
        axios.get(props.link_url).then(res => {
          const modalData = {
            type: "default",
            content: res.data[0]
          };
          setModal(modalData);
        });
      }}
    >
      {props.link_title}
    </button>
  }

  function ReportLink(props) {

    return <button className={"button button-white " + ( props.link_icon) } onClick={() => {
        axios.get(props.link_url).then(res => {
          const modalData = {
            type: "report",
            content: res.data[0]
          };
          setModal(modalData);
        });
      }}
    >
      {props.link_title}
    </button>
  }

  if (props.link_type === "external") {
    return <ExternalLink link_title={props.link_title} link_url={props.link_url} link_type={props.link_type} link_icon={props.link_icon} theme={props.theme}/>;
  } else if(props.link_type === "modal"){
    return <ModalLink  link_title={props.link_title} link_url={props.link_url} link_type={props.link_type} link_icon={props.link_icon} theme={props.theme}/>;
  } else if(props.link_type === "report"){
    return <ReportLink  link_title={props.link_title} link_url={props.link_url} link_type={props.link_type} link_icon={props.link_icon} theme={props.theme}/>;
  } else {
    return <InternalLink link_title={props.link_title} link_url={props.link_url} link_type={props.link_type} link_icon={props.link_icon} theme={props.theme}/>;

  }
};

export default Button;
