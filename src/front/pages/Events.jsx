import React, { useState, useEffect } from "react";
import "./Events.css";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState({}); // { eventId: "yes" | "maybe" }
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch events, favorites, and RSVPs from backend on load
    const fetchData = async () => {
      try {
        // Events
        const responseEvents = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventsData = await responseEvents.json();
        setEvents(Array.isArray(eventsData) ? eventsData : []);

        // Favorites
        const responseFavorites = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favoritesData = await responseFavorites.json();
        setFavorites(Array.isArray(favoritesData) ? favoritesData.map(f => f.event_id) : []);

        // RSVPs
        const responseRsvps = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rsvps`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rsvpsData = await responseRsvps.json();
        const rsvpsMap = {};
        if (Array.isArray(rsvpsData)) {
          rsvpsData.forEach(item => {
            rsvpsMap[item.event_id] = item.rsvp;
          });
        }
        setRsvps(rsvpsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token]);

  // Toggle RSVP (Yes/Maybe)
  const handleRSVP = (event, status) => {
    setRsvps(previous => {
      const current = previous[event.id];

      if (current === status) {
        // unselect
        const updated = { ...previous };
        delete updated[event.id];

        // DELETE 
        fetch(`${import.meta.env.VITE_BACKEND_URL}/rsvps/${event.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(console.error);

        return updated;
      } else {
        // select
        const updated = { ...previous, [event.id]: status };

        // POST
        fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${event.id}/rsvp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ event_id: event.id, rsvp: status }),
        }).catch(console.error);

        return updated;
      }
    });
  };

  // Toggle favorite
  const handleFavorite = (event) => {
    if (favorites.includes(event.id)) {
      setFavorites(previous => previous.filter(f => f !== event.id));
      // DELETE in background
      fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(console.error);
    } else {
      setFavorites(previous => [...previous, event.id]);
      // POST in background
      fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      }).catch(console.error);
    }
  };

  const isFavorited = (eventId) => favorites.includes(eventId);

  return (
    <div className="event-list">
      <h2 className="discover-title">Discover Events</h2>
      {events.map(event => (
        <div key={event.id} className="event-card">
          <img src={event.image} alt="Event" className="event-img" />
          <div className="event-body">
            <h3>{event.title}</h3>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>

            <div className="event-actions">
              <button
                title="Yes"
                onClick={() => handleRSVP(event, "yes")}
                className={`rsvp-btn yes-btn${rsvps[event.id] === "yes" ? " selected" : ""}`}
              >
                Yes
              </button>
              <button
                title="Maybe"
                onClick={() => handleRSVP(event, "maybe")}
                className={`rsvp-btn maybe-btn${rsvps[event.id] === "maybe" ? " selected" : ""}`}
              >
                Maybe
              </button>
              <span
                role="button"
                aria-label="Favorite"
                title="Favorite"
                className={`favorite-emoji${isFavorited(event.id) ? " favorited" : ""}`}
                onClick={() => handleFavorite(event)}
              >
                ♥
              </span>
            </div>

            {rsvps[event.id] && (
              <p>RSVP: <strong>{rsvps[event.id].toUpperCase()}</strong></p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Event;