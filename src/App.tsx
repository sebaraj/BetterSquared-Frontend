import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignupSuccessPage from './pages/SignupSuccessPage';
import MyGroupsPage from './pages/MyGroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupHomePage from './pages/GroupHomePage';
import UserAccountPage from './pages/UserAccountPage';
import JoinGroupPage from './pages/JoinGroupPage';
import GroupUsersPage from './pages/GroupUsersPage';
import EditGroupPage from './pages/EditGroupPage';
import BetsPage from './pages/BetsPage';
import LeaguesPage from './pages/SelectLeaguePage';
import GamesPage from './pages/GamesPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />
        <Route path="/my-groups" element={<MyGroupsPage />} />
        <Route path="/create-group" element={<CreateGroupPage />} />
        <Route path="/group/:group_name" element={<GroupHomePage />} />
        <Route path="/group/:group_name/user/:username" element={<UserAccountPage />} />
        <Route path="/join-group" element={<JoinGroupPage />} />
        <Route path="/group/:group_name/users" element={<GroupUsersPage />} />
        <Route path="/group/edit/:group_name" element={<EditGroupPage />} />
        <Route path="/group/:group_name/active" element={<BetsPage isActive={true} />} />
        <Route path="/group/:group_name/settled" element={<BetsPage isActive={false} />} />
        <Route path="/group/:group_name/leagues" element={<LeaguesPage />} />
        <Route path="/bet/:group_name/league/:league_name" element={<GamesPage />} />
        
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
