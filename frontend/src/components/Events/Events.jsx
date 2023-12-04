import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Sự kiện phổ biến</h1>
          </div>

          <div className="w-full grid mb-4">
            {allEvents.map((event) => (
              <EventCard data={event} />
            ))}
            {/* {allEvents.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]} />
            )} */}
            <h4>{allEvents?.length === 0 && "Không có sự kiện nào!"}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
