import React, { useEffect, useState } from "react";

const Favorites = () => {
  // State to store favorite events and members
  const [favoritesEvents, setFavoritesEvents] = useState([]);
  const [favoritesMembers, setFavoritesMembers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch favorites when component loads
  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, []);

  // Function to fetch all favorite events and members from backend
  const fetchFavorites = async () => {
    try {
      const responseEvents = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const events = await responseEvents.json();
      // Ensure events is always an array
      setFavoritesEvents(Array.isArray(events) ? events : []);

      // Fetch favorite members
      const responseMembers = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorite-members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const members = await responseMembers.json();
      // Ensure members is always an array
      setFavoritesMembers(Array.isArray(members) ? members : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoritesEvents([]);
      setFavoritesMembers([]);
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
          Array.isArray(prev) ? prev.filter((favorites) => favorites.event_id !== eventId) : []
        );
      }
    } catch (error) {
      console.error("Error removing favorite event:", error);
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
          Array.isArray(prev) ? prev.filter((favorites) => favorites.member_id !== memberId) : []
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
      {Array.isArray(favoritesEvents) && favoritesEvents.length === 0 ? (
        <p>No favorite events</p>
      ) : (
        Array.isArray(favoritesEvents) &&
        favoritesEvents.map((favorites) => (
          <div key={favorites.event_id}>
            {favorites.name}
            <button onClick={() => removeFavoriteEvent(favorites.event_id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <h2>Favorite Members</h2>
      {Array.isArray(favoritesMembers) && favoritesMembers.length === 0 ? (
        <p>No favorite members</p>
      ) : (
        Array.isArray(favoritesMembers) &&
        favoritesMembers.map((favorites) => (
          <div key={favorites.member_id}>
            {favorites.name}
            <button onClick={() => removeFavoriteMember(favorites.member_id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorites;