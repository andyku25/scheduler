import React from "react";
import classNames, { className } from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  console.log(props);
  const { name, spots, selected, setDay } = props;

  const formatSpots = (spots) => {
    if (spots === 0) {
      return "no spots remaining";
    } else if (spots === 1) {
      return "1 spot remaining";
    } else {
      return `${spots} spots remaining`;
    }
  }

  const DayListItemClasses = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": (spots === 0)
  })
  
  return (
    <li selected={selected} onClick={() => setDay(name)} className={DayListItemClasses}>
      <h2 className="text--regular">{ name }</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}