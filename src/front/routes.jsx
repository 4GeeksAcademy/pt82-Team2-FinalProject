// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { Landing } from "./pages/Landing";
import CreateEvent from "./pages/CreateEvent.jsx";
import Profile from "./pages/Profile";
import Dashboard from './pages/Dashboard.jsx';
import Discover from './pages/Discover.jsx';
import RSVP from './pages/RSVP.jsx';
import Favorites from './pages/Favorites.jsx';
import EventDetails from './pages/EventDetails.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route index element={<Landing />} />
      <Route path="home" element={<Home />} />
      <Route path="demo" element={<Demo />} />
      <Route path="createevent" element={<CreateEvent />} />
      <Route path="profile" element={<Profile />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="discover" element={<Discover />} />
      <Route path="rsvp" element={<RSVP />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="event/:eventId" element={<EventDetails />} />
      <Route path="resetpassword" element={<ResetPassword />} />
    </Route>
  )
);

