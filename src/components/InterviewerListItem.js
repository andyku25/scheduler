import React from "react";
import classNames from "classnames";

import "components/InterviewerListItem.scss";


export default function InterviewerListItem(props) {
  const InterviewerItemClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,

  })
  
  return (
    <li onClick={props.setInterviewer} selected={props.selected} className={InterviewerItemClass} >
      <img src={props.avatar} alt={props.name} className="interviewers__item-image" />
      {props.selected && props.name}
    </li>
  )
}