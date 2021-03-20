import React from "react";

import Header from "components/Appointment/header";
import Empty from "components/Appointment/empty";
import Show from "components/Appointment/show";
import Form from "components/Appointment/form";
import Status from "components/Appointment/status";
import Confirm from "components/Appointment/confirm";
import Error from "components/Appointment/error";

import { useVisualMode } from "hooks/useVisualMode";

import "components/Appointment/styles.scss";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


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

    console.log(props);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true))

    // transition(SHOW);
  };

  // delete appointment
  const removeApt = () => {
    transition(DELETING, true);
    // set the interview data back to null
    console.log(props);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE, true))
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === SHOW && <Show student={props.interview.student} interviewer={props.interview.interviewer} onDelete={() => transition(CONFIRM)} onEdit={() => transition(EDIT)} /> }
      { mode === EMPTY && <Empty onAdd={()=> transition(CREATE)} /> }
      { mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save} /> }
      { mode === EDIT && <Form interviewers={props.interviewers} name={props.interview.student} interviewer={props.interview.interviewer.id} onCancel={() => back()} onSave={save} /> }
      { mode === SAVING && <Status message={"Saving"} /> }
      { mode === CONFIRM && <Confirm message={"Are you sure you want to delete?"} onCancel={() => back()} onConfirm={removeApt} /> }
      { mode === DELETING && <Status message={"Deleting"} /> }
      { mode === ERROR_SAVE && <Error message={"Could not Save Appointment"} onClose={() => back()} /> }
      { mode === ERROR_DELETE && <Error message={"Could not Delete Appointment"} onClose={() => back()} /> }
    </article>
  )
}