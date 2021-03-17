import React from "react";

import Header from "components/Appointment/header";
import Empty from "components/Appointment/empty";
import Show from "components/Appointment/show";

import "components/Appointment/styles.scss";


export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time} />
      { props.interview && <Show student={props.interview.student} interviewer={props.interview.interviewer } /> }
      { !props.interview && <Empty /> }
    </article>
  )
}