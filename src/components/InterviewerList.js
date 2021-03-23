import React from "react";
import PropTypes from "prop-types";

import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss"


function InterviewerList(props) {
  const interviewItems = props.interviewers.map((item) => {
    return (
      <InterviewerListItem
      key={item.id}
      name={item.name}
      avatar={item.avatar}
      selected={(item.id === props.value)}
      setInterviewer={ event => { props.onChange(item.id) }} />
    )
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewItems}
      </ul>
    </section>
  )
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;