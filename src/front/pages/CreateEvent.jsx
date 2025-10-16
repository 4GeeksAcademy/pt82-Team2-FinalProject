import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import "./CreateEvent.css";

function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPhoto, setEventPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  function getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  function cleanupOldEvents() {
    try {
      const events = JSON.parse(localStorage.getItem("events")) || [];
      if (events.length > 10) {
        const recentEvents = events.slice(-10);
        localStorage.setItem("events", JSON.stringify(recentEvents));
        console.log("Cleaned up old events, kept most recent 10");
      }
    } catch (e) {
      console.error("Error cleaning up events:", e);
    }
  }

  function handlePhotoChange(e) {
    setEventPhoto(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("userProfile"));

    if (!currentUser) {
      setMessage("Please log in to create an event.");
      return;
    }

    if (
      eventName &&
      eventDate &&
      eventLocation &&
      eventTime &&
      eventDescription &&
      eventPhoto
    ) {
      const currentSize = getLocalStorageSize();
      if (currentSize > 4 * 1024 * 1024) { // keeps at 4 mb
        cleanupOldEvents();
      }

      compressImage(eventPhoto, 600, 0.6).then(compressedFile => {
        const reader = new FileReader();
        reader.onload = function (readerEvent) {
          try {
            const base64Photo = readerEvent.target.result;

            const newEvent = {
              id: Date.now().toString(),
              name: eventName,
              date: eventDate,
              location: eventLocation,
              time: eventTime,
              description: eventDescription,
              photo: base64Photo,
              createdBy: {
                id: currentUser.id || currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                profilePicture: currentUser.profilePicture
              },
              createdAt: new Date().toISOString(),
              attendees: []
            };

            try {
              const currentEvents = JSON.parse(localStorage.getItem("events")) || [];
              const updatedEvents = [...currentEvents, newEvent];
              localStorage.setItem("events", JSON.stringify(updatedEvents));

              setEvents(updatedEvents);
              setMessage("Event created!");

              // erase
              setEventName('');
              setEventDate('');
              setEventLocation('');
              setEventTime('');
              setEventDescription('');
              setEventPhoto(null);
              e.target.reset();

              console.log("Event created with ID:", newEvent.id);

              setTimeout(() => {
                navigate(`/event/${newEvent.id}`);
              }, 100);

            } catch (storageError) {
              console.error("Storage error:", storageError);
              if (storageError.name === 'QuotaExceededError') {
                cleanupOldEvents();
                try {
                  const currentEvents = JSON.parse(localStorage.getItem("events")) || [];
                  const updatedEvents = [...currentEvents, newEvent];
                  localStorage.setItem("events", JSON.stringify(updatedEvents));
                  setEvents(updatedEvents);
                  setMessage("Event created! (Storage cleaned up)");
                  setTimeout(() => navigate(`/event/${newEvent.id}`), 100);
                } catch (retryError) {
                  setMessage("Storage full. Please try a smaller image or contact support.");
                }
              } else {
                setMessage("Error saving event. Please try again.");
              }
            }

          } catch (e) {
            console.error("Error processing event:", e);
            setMessage("Error creating event. Please try again.");
          }
        };

        reader.onerror = function () {
          setMessage("Error reading photo file. Please try again.");
        };

        reader.readAsDataURL(compressedFile);
      });

    } else {
      setMessage("Please complete all fields.");
    }
  }

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create Event</h1>
      <div className="signup-box">
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="signup-input"
          />
          <input
            type="date"
            placeholder="Event Date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="signup-input"
          />
          <input
            type="text"
            placeholder="Event Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="signup-input"
          />
          <input
            type="time"
            placeholder="Event Time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="signup-input"
          />
          <textarea
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="signup-input"
            style={{ minHeight: "80px" }}
          />
          <div className="photo-upload-wrapper">
            <label className="photo-upload-title" htmlFor="file-upload">
              Add Banner Photo:
            </label>
            {eventPhoto ? (
              <div className="photo-preview-container">
                <img
                  src={URL.createObjectURL(eventPhoto)}
                  alt="Preview"
                  className="photo-preview"
                  onLoad={e => URL.revokeObjectURL(e.target.src)}
                />
                <label
                  htmlFor="file-upload"
                  className="change-photo-label"
                  tabIndex={0}
                >
                  Change Photo
                </label>
              </div>
            ) : (
              <label htmlFor="file-upload" className="file-upload-label">
                <span className="plus-sign">+</span>
              </label>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="file-upload-input"
            />
          </div>
          <button type="submit" className="signup-button">
            Create Event
          </button>
          {message && (
            <div style={{ color: "white", marginTop: 10 }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
