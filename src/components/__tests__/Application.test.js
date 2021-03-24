import React from "react";

import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, waitForElementToBeRemoved } from "@testing-library/react";
import { fireEvent } from "@testing-library/react/dist";
import axios from "axios";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(
      <Application />
    );
  
    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      })
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(
      <Application />
    );
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment")[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    const input = getByPlaceholderText(appointment, /enter student name/i)
    fireEvent.change(input, {target: {value: "Lydia Miller-Jones"}});
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const days = getAllByTestId(container, "day");
    const dayDom = days.find((day) => {
      return queryByText(day, "Monday");
    });
    
    expect(getByText(dayDom, "no spots remaining")).toBeInTheDocument();
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(
      <Application />
    )
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");
    const appointmentDom = appointments.find(appointment => {
      return queryByText(appointment, "Archie Cohen");
    })
    
    fireEvent.click(getByAltText(appointmentDom, "Delete"));
    expect(getByText(appointmentDom, "Are you sure you want to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointmentDom, "Confirm"));
    expect(getByText(appointmentDom, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointmentDom, "Add"));

    const days = getAllByTestId(container, "day");
    const dayDom = days.find((day) => {
      return queryByText(day, "Monday");
    });

    expect(getByText(dayDom, "2 spots remaining")).toBeInTheDocument();
  });
  
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(
      <Application />
    )

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");
    const appointmentDom = appointments.find(appointment => {
      return queryByText(appointment, "Archie Cohen")
    });

    fireEvent.click(getByAltText(appointmentDom, "Edit"))

    const input = getByPlaceholderText(appointmentDom, /enter student name/i)
    fireEvent.change(input, {
      target: {value: "Lydia Miller-Jones"}
    });
    fireEvent.click(getByAltText(appointmentDom, "Sylvia Palmer"));
    fireEvent.click(getByText(appointmentDom, "Save"));
    expect(getByText(appointmentDom, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointmentDom, "Lydia Miller-Jones"));

    const days = getAllByTestId(container, "day");
    const dayDom = days.find((day) => {
      return queryByText(day, "Monday");
    });

    expect(getByText(dayDom, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(
      <Application />
    )
    await waitForElement(() => getByAltText(container, "Add"))

    const appointments = getAllByTestId(container, "appointment");
    const appointmentDom = appointments.find(appointment => getByAltText(appointment, "Add"));

    fireEvent.click(getByAltText(appointmentDom, "Add"));
    expect(getByPlaceholderText(appointmentDom, /enter student name/i)).toBeInTheDocument();

    const input = getByPlaceholderText(appointmentDom, /enter student name/i)
    fireEvent.change(input, {
      target: {value: "Lydia Miller-Jones"}
    });

    fireEvent.click(getByAltText(appointmentDom, "Sylvia Palmer"))

    fireEvent.click(getByText(appointmentDom, "Save"))
    expect(getByText(appointmentDom, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointmentDom, "Saving"))
    expect(getByText(appointmentDom, "Could not Save Appointment")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(
      <Application />
    )

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointmentDom = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    
    fireEvent.click(getByAltText(appointmentDom, "Delete"));
    expect(getByText(appointmentDom, "Are you sure you want to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointmentDom, "Confirm"));
    expect(getByText(appointmentDom, "Deleting")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointmentDom, "Deleting"));
    expect(getByText(appointmentDom, "Could not Delete Appointment")).toBeInTheDocument();

  });

  it("should return to the empty component on cancel click from the new appointment form", async () => {
    const { container } = render(
      <Application />
    )

    await waitForElement(() => getByAltText(container, "Add"));
    const appointments = getAllByTestId(container, "appointment");
    const appointmentDom = appointments.find(appointment => getByAltText(appointment, "Add"));

    fireEvent.click(getByAltText(appointmentDom, "Add"));
    expect(getByPlaceholderText(appointmentDom, "Enter Student Name")).toBeInTheDocument();
    
    fireEvent.click(getByText(appointmentDom, "Cancel"));
    expect(getByAltText(appointmentDom, "Add")).toBeInTheDocument();
  });
});
