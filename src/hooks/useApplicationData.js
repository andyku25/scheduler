import { useState, useEffect } from "react";
import axios from "axios";

// create setspots function
// note: take the total number of appointment spots on the day minus number of appointments not null
const setSpots = (state) => {
  const days = state.days.map(day => ({
    ...day,
    spots: day.appointments.length - day.appointments.filter(i => state.appointments[i].interview).length
  }))
  return {...state, days};
}


export  function useApplicationData() {
  // create application state
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Retrieve API data and pass in as the state
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


  // function to be used to book an interview update state with new appointment interview details
  const bookInterview = (id, interview) => {
    console.log(id);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          appointments
        })
        setState(setSpots);
      })
      // .catch((err) => console.log(err)) <--REMOVE! *Bug* Error handling on the index does not fire with this code.
  }

  // Function to update state for the removal of an interview appointment
  const cancelInterview = (id) => {
    // update local state
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    // update the DB to empty the appointment ID interview details(set the appointment to null)
    return axios
      .delete(`api/appointments/${id}`)
      .then((res) => {
        console.log(res);
        setState({
          ...state,
          appointments
        })
        setState(setSpots)
      })
      // .catch((err) => console.error("delete error", err)) <--REMOVE! *Bug* Error handling on the index does not fire with this code.
  }

  // function to update the current state day
  const setDay = day => setState({ ...state, day });

  return { state, setDay, bookInterview, cancelInterview };
}