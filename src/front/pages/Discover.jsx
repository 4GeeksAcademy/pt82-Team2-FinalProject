import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Discover.css";

function Discover() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData") || localStorage.getItem("userProfile");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch { }
    }
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch { }
    }
    setLoading(false);
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRSVP = (eventId, response) => {
    if (!currentUser) return;

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const attendees = event.attendees || [];
        const existingIndex = attendees.findIndex((a) => a.id === currentUser.email);
        if (existingIndex >= 0) {
          attendees[existingIndex].response = response;
        } else {
          attendees.push({
            id: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            response,
          });
        }
        return { ...event, attendees };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleDelete = (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?"))
      return;
    const updatedEvents = events.filter(ev => ev.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  if (loading) {
    return <div className="discover-loading">Loading events...</div>;
  }

  return (
    <div className="discover-container">
            <nav className="dashboard-navbar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/discover">Discover</Link></li>
                    <li className="coming-soon">
                        <span>My Events</span>
                        <span className="coming-soon-tooltip">Coming Soon!</span>
                    </li>
                    <li className="coming-soon">
                        <span>RSVP</span>
                        <span className="coming-soon-tooltip">Coming Soon!</span>
                    </li>
                    <li className="coming-soon">
                        <span>Favorites</span>
                        <span className="coming-soon-tooltip">Coming Soon!</span>
                    </li>
                </ul>
            </nav>
      <div className="discover-header">
        <h1>Discover Events</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              {event.photo && (
                <div className="event-image">
                  <img src={event.photo} alt={event.name} />
                </div>
              )}
              <div className="event-content">
                <h3 className="event-title">{event.name}</h3>
                <div className="event-details">
                  <div className="event-detail">
                    <span className="detail-icon">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">🕒</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-description">
                  {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                </p>
                <div className="event-creator">
                  Created by: {event.createdBy?.firstName} {event.createdBy?.lastName}
                </div>
                <div className="event-attendees">
                  {event.attendees?.length || 0} attendees
                </div>
              </div>
              <div className="event-actions">
                <div className="rsvp-buttons">
                  <button
                    className={`rsvp-btn rsvp-yes${event.attendees?.find(a => a.id === currentUser?.email && a.response === "yes") ? " selected" : ""}`}
                    onClick={() => handleRSVP(event.id, "yes")}
                  >
                    Yes
                  </button>
                  <button
                    className={`rsvp-btn rsvp-maybe${event.attendees?.find(a => a.id === currentUser?.email && a.response === "maybe") ? " selected" : ""}`}
                    onClick={() => handleRSVP(event.id, "maybe")}
                  >
                    Maybe
                  </button>
                  <button
                    className={`rsvp-btn rsvp-no${event.attendees?.find(a => a.id === currentUser?.email && a.response === "no") ? " selected" : ""}`}
                    onClick={() => handleRSVP(event.id, "no")}
                  >
                    No
                  </button>
                </div>
                <div className="actions-row">
                  <Link to={`/event/${event.id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
              <button
                className="event-delete-btn"
                title="Delete Event"
                onClick={() => handleDelete(event.id)}
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          ))
        ) : (
          <div className="no-events">
            {searchTerm ? "No events found matching your search." : "No events available."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Discover;
