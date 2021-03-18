import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";

import DayList from "components/DayList";
import Appointment from "components/Appointment"


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    const daysData = "/api/days";
    const appointmentsData = "/api/appointments";
    const interviewersData = "/api/interviewers";

    Promise.all([
      axios.get(daysData),
      axios.get(appointmentsData),
      axios.get(interviewersData)
    ])
      .then((all) => {
        // console.log(all);

        setState(prev => (
          { ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}
        ))
      })
      .catch(err => console.error(`Error getting days data: ${err}`))
    }, [])


    const setDay = day => setState({ ...state, day });

    const dailyAppointments = getAppointmentsForDay(state, state.day);

    console.log(state)
    const appointmentRender = dailyAppointments.map(appointment => {
      const interview = getInterview(state, appointment.interview)
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview} 
        />
      )
    })

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
