import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationContainer } from './components/NotificationContainer';
import PollList from './components/PollList';
import PollVote from './components/PollVote';
import PollResults from './components/PollResults';
import CreatePoll from './components/CreatePoll';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  useTheme(); // Initialize theme

  return (
    <Router>
      <Layout>
        <NotificationContainer />
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/poll/:id/vote" element={<PollVote />} />
          <Route path="/poll/:id/results" element={<PollResults />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;