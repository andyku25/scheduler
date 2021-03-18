export function getAppointmentsForDay(state, day) {
    const appointmentsOnDay = state.days.filter(appointment => (appointment.name === day));
    if (appointmentsOnDay[0]) {
      const appointmentsArr = [...appointmentsOnDay[0].appointments];
      return appointmentsArr.map(id => state.appointments[id])
    }
    return [];
};
