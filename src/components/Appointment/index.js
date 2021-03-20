import React from "react";

import Header from "components/Appointment/header";
import Empty from "components/Appointment/empty";
import Show from "components/Appointment/show";
import Form from "components/Appointment/form";
import Status from "components/Appointment/status";
import Confirm from "components/Appointment/confirm";

import { useVisualMode } from "hooks/useVisualMode";

import "components/Appointment/styles.scss";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)

  // save appointment data
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    }
    console.log(props.id)
    console.log(interview);

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))

  };

  // delete appointment
  const removeApt = () => {
    transition(DELETING);

    // set the interview data back to null
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))

  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === SHOW && <Show student={props.interview.student} interviewer={props.interview.interviewer } onDelete={() => transition(CONFIRM)} onEdit={() => transition(EDIT)} /> }
      { mode === EMPTY && <Empty onAdd={()=> transition(CREATE)} /> }
      { mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save} /> }
      { mode === SAVING && <Status message={"Saving"} /> }
      { mode === CONFIRM && <Confirm message={"Are you sure you want to delete?"} onCancel={() => back()} onConfirm={removeApt} /> }
      { mode === DELETING && <Status message={"Deleting"} /> }
      { mode === EDIT && <Form interviewers={props.interviewers} name={props.interview.student} interviewer={props.interview.interviewer.id} onCancel={() => back()} onSave={save} />}
    </article>
  )
}