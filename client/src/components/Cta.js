import Button from "./Button";

const Cta = (props) => {
  if (props.theme === "cta"){
    return (
      <div className={props.theme}>
        <div className="cta-bg"></div>
        <div className="cta-title"><span>{props.title}</span></div>
        <div className="cta-content">
          <div className="cta-text">{props.text}</div>
          <Button link_title={props.link_title} link_url={props.link_url} link_type={props.link_type} link_icon={props.link_icon} />
        </div>

      </div>
    )
  } else {
    return (
      <div className={props.theme}>

          <Button link_title={props.link_title} link_url={props.link_url} link_type={props.link_type} link_icon={props.link_icon} />


      </div>
    )
  }

};

export default Cta;
