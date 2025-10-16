import React, { useState, useEffect } from "react";
import "./Events.css";

const initialEvent = [
  {
    id: 1,
    title: "Event",
    description: "An event for demonstration.",
    location: "Main Hall",
    date: "2025-10-01",
    time: "10:00 AM",
    image: "https://via.placeholder.com/400x200?text=Event+Image"
  },
  {
    id: 2,
    title: "Meetup",
    description: "Meet other React developers.",
    location: "Community Center",
    date: "2025-10-05",
    time: "2:00 PM",
    image: "https://via.placeholder.com/400x200?text=React+Meetup"
  },
  {
    id: 3,
    title: "Event",
    description: "An event for demonstration.",
    location: "Main Hall",
    date: "2025-10-01",
    time: "10:00 AM",
    image: "https://via.placeholder.com/400x200?text=Event+Image"
  },
  {
    id: 4,
    title: "Meetup",
    description: "Meet other React developers.",
    location: "Community Center",
    date: "2025-10-05",
    time: "2:00 PM",
    image: "https://via.placeholder.com/400x200?text=React+Meetup"
  },
  {
    id: 5,
    title: "Event",
    description: "An event for demonstration.",
    location: "Main Hall",
    date: "2025-10-01",
    time: "10:00 AM",
    image: "https://via.placeholder.com/400x200?text=Event+Image"
  },
  {
    id: 6,
    title: "Meetup",
    description: "Meet other React developers.",
    location: "Community Center",
    date: "2025-10-05",
    time: "2:00 PM",
    image: "https://via.placeholder.com/400x200?text=React+Meetup"
  },
];

const Event = () => {
  const [events] = useState(initialEvent);
  const [rsvps, setRsvps] = useState({}); // { eventId: "yes" | "maybe" }
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch favorites and RSVPs from backend on load
    const fetchData = async () => {
      try {
        // Favorites
        const favRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favData = await favRes.json();
        setFavorites(Array.isArray(favData) ? favData.map(f => f.event_id) : []);

        // RSVPs
        const rsvpRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rsvps`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rsvpData = await rsvpRes.json();
        const rsvpMap = {};
        if (Array.isArray(rsvpData)) {
          rsvpData.forEach(item => {
            rsvpMap[item.event_id] = item.rsvp;
          });
        }
        setRsvps(rsvpMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [token]);

  // Toggle RSVP (Yes/Maybe)
  const handleRSVP = (ev, status) => {
    setRsvps(prev => {
      const current = prev[ev.id];

      if (current === status) {
        // unselect
        const updated = { ...prev };
        delete updated[ev.id];

        // DELETE 
        fetch(`${import.meta.env.VITE_BACKEND_URL}/rsvps/${ev.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(console.error);

        return updated;
      } else {
        // select
        const updated = { ...prev, [ev.id]: status };

        // POST
        fetch(`${import.meta.env.VITE_BACKEND_URL}/rsvps`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ event_id: ev.id, rsvp: status }),
        }).catch(console.error);

        return updated;
      }
    });
  };

  // Toggle favorite
  const handleFavorite = (ev) => {
    if (favorites.includes(ev.id)) {
      setFavorites(prev => prev.filter(f => f !== ev.id));
      // DELETE in background
      fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites/${ev.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(console.error);
    } else {
      setFavorites(prev => [...prev, ev.id]);
      // POST in background
      fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: ev.id }),
      }).catch(console.error);
    }
  };

  const isFavorited = (eventId) => favorites.includes(eventId);

  return (
    <div className="event-list">
      {events.map(ev => (
        <div key={ev.id} className="event-card">
          <img src={ev.image} alt="Event" className="event-img" />
          <div className="event-body">
            <h3>{ev.title}</h3>
            <p><strong>Description:</strong> {ev.description}</p>
            <p><strong>Location:</strong> {ev.location}</p>
            <p><strong>Date:</strong> {ev.date}</p>
            <p><strong>Time:</strong> {ev.time}</p>

            <div className="event-actions">
              <button
                title="Yes"
                onClick={() => handleRSVP(ev, "yes")}
                className={`rsvp-btn yes-btn${rsvps[ev.id] === "yes" ? " selected" : ""}`}
              >
                Yes
              </button>
              <button
                title="Maybe"
                onClick={() => handleRSVP(ev, "maybe")}
                className={`rsvp-btn maybe-btn${rsvps[ev.id] === "maybe" ? " selected" : ""}`}
              >
                Maybe
              </button>
              <span
                role="button"
                aria-label="Favorite"
                title="Favorite"
                className={`favorite-emoji${isFavorited(ev.id) ? " favorited" : ""}`}
                onClick={() => handleFavorite(ev)}
              >
                ♥
              </span>
            </div>

            {rsvps[ev.id] && (
              <p>RSVP: <strong>{rsvps[ev.id].toUpperCase()}</strong></p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Event;
