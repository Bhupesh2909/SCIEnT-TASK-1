import React from 'react'

import './App.css'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom'
import Home from './components/pages/HomePage.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import SignupPage from './components/pages/SignupPage.jsx'
import AdminDashboard from './components/pages/AdminDashboard.jsx'
import CreateProject from './components/pages/CreateProject.jsx'
import CreateUser from './components/pages/CreateUser.jsx'
import EditProfilePage from './components/pages/EditProfile.jsx'
import ProfessorUpload from './components/pages/ProfessorUpload.jsx'
import ProfessorDashboard from './components/pages/ProfessorDashboard.jsx'
import ProfilePage from './components/pages/ProfilePage.jsx'
import StudentDashboard from './components/pages/StudentDashboard.jsx'




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-project" element={<CreateProject />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/profile/:userId/edit" element={<EditProfilePage />} />
        <Route path="/professor/upload" element={<ProfessorUpload />} />
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </>
  );
}

export default App
