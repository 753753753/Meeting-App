import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminRegister from './Admin/AdminRegister.jsx';
import Login from './Auth/Login';
import Register from './Auth/Register';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Profile from './Components/Profile/Profile.jsx';
import { SpeechProvider } from './context/SpeechContext';
import { UserProvider, useUser } from './context/UserContext';
import AdminDashboard from './Dashboard/AdminDashboard.jsx';
import Room from './Dashboard/Room';
import ErrorBoundary from "./ErrorBoundary.jsx"; // Import the ErrorBoundary component
import MainLayout from './layouts/MainLayout';
import TeamMembers from './Pages/Admin/TeamMembers.jsx';
import ChatUs from './Pages/ChatUs.jsx';
import Home from './Pages/Home';
import PersonalRoom from './Pages/PersonalRoom';
import Previous from './Pages/Previous';
import Recordings from './Pages/Recordings';
import Upcoming from "./Pages/Upcoming.jsx";
import TeamLeader from './Pages/User/TeamLeader.jsx';

// Component to handle routes that need context
const AppRoutes = () => {
  const { user, role } = useUser();

  const DefaultRedirect = () => {
    return user ? <Navigate to="/dashboard" /> : <Navigate to="/register" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/adminregister' element={<AdminRegister />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <ErrorBoundary>
                  <Home />
                </ErrorBoundary>
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/upcoming"
          element={
            <PrivateRoute>
              <MainLayout>
                <Upcoming />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/previous"
          element={
            <PrivateRoute>
              <MainLayout>
                <Previous />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/recordings"
          element={
            <PrivateRoute>
              <MainLayout>
                <Recordings />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/room"
          element={
            <PrivateRoute>
              <MainLayout>
                <PersonalRoom />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <MainLayout>
                <ChatUs />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/proflie"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <MainLayout>
                {role === "admin" ? <TeamMembers /> : <TeamLeader />}
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/room/:roomid"
          element={
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

// Main App component
const App = () => {
  return (
    <SpeechProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </SpeechProvider>
  );
};

export default App;
