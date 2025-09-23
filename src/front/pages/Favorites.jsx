import React, { useEffect, useState } from "react";

const Favorites = () => {
  // State to store favorite events and members
  const [favoritesEvents, setFavoritesEvents] = useState([]);
  const [favoritesMembers, setFavoritesMembers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch favorites when component loads
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Function to fetch all favorite events and members from backend
  const fetchFavorites = async () => {
    try {
      const responseEvents = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const events = await responseEvents.json();
      setFavoritesEvents(events);

      // Fetch favorite members
      const responseMembers = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorite-members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const members = await responseMembers.json();
      setFavoritesMembers(members);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Add a favorite event
  const addFavoriteEvent = async (eventId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });
      const data = await response.json();
      if (response.ok) {
        // Add new favorite to state to update UI
        setFavoritesEvents((prev) => [...prev, data.favorite]);
      } else {
        alert(data.msg || data.error);
      }
    } catch (error) {
      console.error("Error adding favorite event:", error);
    }
  };

  // Remove a favorite event
  const removeFavoriteEvent = async (eventId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // Remove event from state
        setFavoritesEvents((prev) =>
          prev.filter((fav) => fav.event_id !== eventId)
        );
      }
    } catch (error) {
      console.error("Error removing favorite event:", error);
    }
  };

  // Add a favorite member
  const addFavoriteMember = async (memberId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorite-members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ member_id: memberId }),
      });
      const data = await response.json();
      if (response.ok) {
        // Add new member to state
        setFavoritesMembers((prev) => [...prev, data.favorite]);
      } else {
        alert(data.msg || data.error);
      }
    } catch (error) {
      console.error("Error adding favorite member:", error);
    }
  };

  // Remove a favorite member
  const removeFavoriteMember = async (memberId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorite-members/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // Remove member from state
        setFavoritesMembers((prev) =>
          prev.filter((fav) => fav.member_id !== memberId)
        );
      }
    } catch (error) {
      console.error("Error removing favorite member:", error);
    }
  };

  // Display the favorites lists
  return (
    <div>
      <h2>Favorite Events</h2>
      {favoritesEvents.length === 0 ? (
        <p>No favorite events</p> 
      ) : (
        favoritesEvents.map((fav) => (
          <div key={fav.event_id}>
            {fav.name}
            <button onClick={() => removeFavoriteEvent(fav.event_id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <h2>Favorite Members</h2>
      {favoritesMembers.length === 0 ? (
        <p>No favorite members</p>
      ) : (
        favoritesMembers.map((fav) => (
          <div key={fav.member_id}>
            {fav.name}
            <button onClick={() => removeFavoriteMember(fav.member_id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorites;
