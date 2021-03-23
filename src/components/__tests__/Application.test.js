import React from "react";

import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

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
    // console.log(prettyDOM(appointments));
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
    console.log(prettyDOM(dayDom));

    expect(getByText(dayDom, "2 spots remaining")).toBeInTheDocument();
    
  });


});
