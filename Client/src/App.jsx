import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './Pages/Home';
import Upcoming from './pages/Upcoming';
import Previous from './Pages/Previous';
import Recordings from './Pages/Recordings';
import PersonalRoom from './Pages/PersonalRoom';
import Room from './Dashboard/Room';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { UserProvider, useUser } from './context/UserContext';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { Navigate } from 'react-router-dom';
import { SpeechProvider } from './context/SpeechContext';
import ErrorBoundary from "./ErrorBoundary.jsx" // Import the ErrorBoundary component

const App = () => {
  const DefaultRedirect = () => {
    const { user } = useUser(); // Access the login function from context
    return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
  };

  return (
    <SpeechProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            <Route path="/room/:roomid" element={<PrivateRoute><Room /></PrivateRoute>} />
          </Routes>
        </Router>
      </UserProvider>
    </SpeechProvider>
  );
};

export default App;
