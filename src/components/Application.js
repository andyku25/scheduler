import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import { getAppointmentsForDay } from "helpers/selectors";

import DayList from "components/DayList";
import Appointment from "components/Appointment"


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  useEffect(() => {
    const daysData = "/api/days";
    const appointmentData = "/api/appointments";

    Promise.all([
      axios.get(daysData),
      axios.get(appointmentData)
    ])
      .then((all) => {
        console.log(all);

        setState(prev => (
          { ...prev, days: all[0].data, appointments: all[1].data }
        ))
      })
      .catch(err => console.error(`Error getting days data: ${err}`))
    }, [])


    const setDay = day => setState({ ...state, day });

    console.log(state);
    const dailyAppointments = getAppointmentsForDay(state, state.day);

    const appointmentRender = dailyAppointments.map(appointment => {
      return (
        <Appointment key={appointment.id} {...appointment} />
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
