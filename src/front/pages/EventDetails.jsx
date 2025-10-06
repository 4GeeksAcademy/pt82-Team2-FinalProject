import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EventDetails.css";

const getCurrentUser = () => {
  const userData = localStorage.getItem("userData") || localStorage.getItem("userProfile");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      if (parsed.email && parsed.firstName && parsed.lastName) {
        return parsed;
      }
    } catch {}
  }
  return { id: "guest", firstName: "Guest", lastName: "User", email: "guest@example.com" };
};

const rsvpOptions = ["yes", "no", "maybe"];

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [photoURL, setPhotoURL] = useState(null);
  const [rsvp, setRsvp] = useState("");
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleRsvp = (response) => {
    if (!currentUser || !event) return;

    const userId = currentUser.email || currentUser.id;
    const updatedAttendees = [...attendees];
    const idx = updatedAttendees.findIndex((a) => a.id === userId);

    if (idx >= 0) {
      updatedAttendees[idx] = { ...updatedAttendees[idx], response };
    } else {
      updatedAttendees.push({
        id: userId,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        response,
      });
    }

    setAttendees(updatedAttendees);
    setRsvp(response);

    const events = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = events.map((ev) =>
      ev.id === eventId ? { ...ev, attendees: updatedAttendees } : ev
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  useEffect(() => {
    try {
      const events = JSON.parse(localStorage.getItem("events")) || [];
      const foundEvent = events.find((ev) => ev.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
        setAttendees(foundEvent.attendees || []);

        if (currentUser && currentUser.email !== "guest@example.com") {
          const userId = currentUser.email || currentUser.id;
          const userAttendee = (foundEvent.attendees || []).find((a) => a.id === userId);
          setRsvp(userAttendee ? userAttendee.response : "");
        }

        setPhotoURL(
          foundEvent.photo && typeof foundEvent.photo === "string" && foundEvent.photo.startsWith("data:")
            ? foundEvent.photo
            : null
        );
      } else {
        setEvent(null);
        setAttendees([]);
        setPhotoURL(null);
        setRsvp("");
      }
    } catch {
      setEvent(null);
    }
  }, [eventId, currentUser]);

  if (!event) {
    return (
      <div className="event-details-container">
        <div className="event-details-card">
          <h2>Event Not Found</h2>
          <p>No event exists with this ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      {photoURL && (
        <div className="event-photo-banner-container">
          <img src={photoURL} alt="Event Banner" className="event-photo-banner" />
        </div>
      )}
      <div className="event-details-card">
        <h2>{event.name}</h2>
        <div className="event-details-info-inline">
          <span className="event-info-item">
            <i className="fa-solid fa-calendar-alt" /> {event.date}
          </span>
          <span className="event-info-item">
            <i className="fa-solid fa-clock" /> {event.time || "Time TBD"}
          </span>
          <span className="event-info-item">
            <i className="fa-solid fa-map-marker-alt" /> {event.location}
          </span>
        </div>
        <div className="event-details-description">
          <p>
            <i className="fa-solid fa-info-circle" /> {event.description}
          </p>
        </div>
        <hr className="event-details-divider" />
        <section className="event-section">
          <h3>RSVP</h3>
          <div className="event-details-inputs" style={{ gap: "1rem" }}>
            {rsvpOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`event-details-btn${rsvp === opt ? " selected" : ""}`}
                onClick={() => handleRsvp(opt)}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
          <h4>Attendees</h4>
          <ul>
            {attendees.map(({ id, firstName, lastName, response }) => (
              <li key={id}>
                {firstName} {lastName} {response ? `(${response})` : ""}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
