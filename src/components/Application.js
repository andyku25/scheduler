import React from "react";

import "components/Application.scss";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";
import { useApplicationData } from "hooks/useApplicationData";

import DayList from "components/DayList";
import Appointment from "components/Appointment";


export default function Application(props) {
  const {
    state,  
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

    const dailyAppointments = getAppointmentsForDay(state, state.day);
    const dailyInterviewers = getInterviewersForDay(state, state.day);

    const appointmentRender = dailyAppointments.map(appointment => {
      const interview = getInterview(state, appointment.interview);
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewers={dailyInterviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    });

    return (
      <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
          />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentRender}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
