import React, { useState } from "react";

const defaultEvent = {
    id: 1,
    title: "Sample Event",
    description: "A simple event for demonstration.",
    location: "Main Hall",
    date: "2025-10-01",
    time: "10:00 AM",
    image: "https://via.placeholder.com/400x200?text=Event+Image"
};

const RSVP_OPTIONS = ["yes", "no", "maybe"];

const EventDetails = ({ event = defaultEvent }) => {
    const [selectedRSVP, setSelectedRSVP] = useState(null);

    // Save RSVP to localStorage for RSVP page
    const handleRSVP = (option) => {
        setSelectedRSVP(option);
        const rsvps = JSON.parse(localStorage.getItem("rsvps") || "[]");
        // Remove previous RSVP for this event
        const filtered = rsvps.filter(r => r.eventId !== event.id);
        filtered.push({ eventId: event.id, event, rsvp: option });
        localStorage.setItem("rsvps", JSON.stringify(filtered));
    };

    return (
        <div className="event-details-container">
            <div className="event-details-card">
                <img src={event.image} alt="Event" style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }} />
                <h2>{event.title}</h2>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <div style={{ margin: "20px 0" }}>
                    <strong>Are you interested in going?</strong>
                    <div>
                        {RSVP_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                style={{
                                    margin: "0 8px",
                                    background: selectedRSVP === opt ? "#007bff" : "#eee",
                                    color: selectedRSVP === opt ? "#fff" : "#333",
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleRSVP(opt)}
                            >
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </button>
                        ))}
                    </div>
                    {selectedRSVP && (
                        <p style={{ marginTop: "10px" }}>
                            You selected: <strong>{selectedRSVP.toUpperCase()}</strong>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;