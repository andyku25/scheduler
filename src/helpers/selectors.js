// Using filter
export function getAppointmentsForDay(state, day) {
    const dayLObj = state.days.filter(appointment => (appointment.name === day));
    if (dayLObj[0]) {
      const appointmentsArr = [...dayLObj[0].appointments];
      return appointmentsArr.map(id => state.appointments[id]);
    }
    return [];
};

// Using find
export function getInterviewersForDay(state, day) {
  const dayObj = state.days.find((eachDay) => (eachDay.name === day));
  if (dayObj) {
    return dayObj.interviewers.map(interviewerId => state.interviewers[interviewerId])
  }
  return [];
};

export function getInterview(state, interview) {
  if (interview) {
    return {
      interviewer: state.interviewers[interview.interviewer],
      student: interview.student};
  }
  return null;
};
