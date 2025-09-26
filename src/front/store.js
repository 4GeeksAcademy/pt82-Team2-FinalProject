export const initialStore = () => {
  const token = localStorage.getItem("token");
  return {
    message: null,
    isLoggedIn: !!token,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
    case "LOGIN":
      return {
        ...store,
        isLoggedIn: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...store,
        isLoggedIn: false,
      };

    // case "UPDATE_PROFILE":
    //   return { ...store, user: { ...store.user, ...action.payload } };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
