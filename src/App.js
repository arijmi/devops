
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import AdminHome from './Components/AdminHome/AdminHome';
import AddEmployee from './Components/Home/AddEmployee';
import EmployeHome from './Components/EmployeHome/EmployeHome';
import EditEmployeeModal from './Components/Home/EditEmployeeModal';
import Notifications from './Components/Home/Notifications';
import Profile from './Components/Home/Profile';
import Poste from './Components/Home/Poste';
import PosteAdmin from './Components/AdminHome/PosteAdmin';
import PosteEm from './Components/EmployeHome/PosteEm';
import Dashboard  from './Components/Home/Dashboard';
import DashboardAdmin from './Components/AdminHome/DashboardAdmin';
import EditPoste from './Components/Home/EditPoste';
import CongeDetail from './Components/Home/CongeDetail';
import CongeUser from './Components/Home/CongeUser';
import AddTimeSheet from './Components/EmployeHome/AddTimeSheet';
import MyTimeSheet from './Components/EmployeHome/MyTimeSheet';
import MyConge from './Components/EmployeHome/MyConge';
import ProfileEm from './Components/EmployeHome/ProfileEm';
import EditTimeSheet from './Components/EmployeHome/EditTimeSheet';
import EditConge from './Components/EmployeHome/EditConge';
import AddConge from './Components/EmployeHome/AddConge';
import ProfileAdmin from './Components/AdminHome/ProfileAdmin';
import ListeEmp from './Components/AdminHome/ListeEmp';
import ListeManager from './Components/AdminHome/ListeManager';
import Settings from './Components/Settings/Settings';
import AddUser from './Components/AdminHome/AddUser';
import EditTimeSheetManager from './Components/Home/EditTimeSheetManeger';
import AllTimeSheetManager from './Components/Home/AllTimeSheetManager';
import MyEvaluation from './Components/EmployeHome/MyEvaluation';
import AllCongeManager from './Components/Home/AllCongeManager';
function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LoginSignup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/edit/:id" element={<EditEmployeeModal />} />
              <Route path="/addEmploy" element={<AddEmployee />} />
              <Route path="/adminHome" element={<AdminHome />} />
              <Route path="/employeHome" element={<EmployeHome />} />
              <Route path="/notif" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ProfileAdmin" element={<ProfileAdmin />} />
              <Route path="/poste" element={<Poste/>} />
              <Route path="/posteEmploye" element={<PosteEm/>} />
              <Route path="/posteAdmin" element={<PosteAdmin/>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
              <Route path="/editpost/:postId" element={<EditPoste />} /> 
              <Route path="/congedetail/:actorId/:createdAt" element={<CongeDetail />} />
              <Route path="/conges/user/:actorId" element={<CongeUser />} />
              <Route path="/addTS" element={<AddTimeSheet />} />
              <Route path="/MyConge/:actorId" element={<MyConge />} />
              <Route path="/MyTimeSheet" element={<MyTimeSheet />} />
              <Route path="/ProfileEm" element={<ProfileEm />} />
              <Route path="/EditTimeSheet/:IdTimeSheet" element={<EditTimeSheet />} />
              <Route path="/EditConge/:id" element={<EditConge />} />
              <Route path="/addConge" element={<AddConge />} />
              <Route path="/ListeEmp" element={<ListeEmp />} />
              <Route path="/ListeManager" element={<ListeManager />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/EditTimeSheetManage/:id" element={<EditTimeSheetManager />} />
              <Route path="/AllTimeSheetManager" element={<AllTimeSheetManager />} />
              <Route path="/allCongeManager" element={<AllCongeManager />} />
              <Route path="/MyEvaluation" element={<MyEvaluation />} />

              <Route path="*" element={<Navigate to="/page_404" />} />
          </Routes>
      </Router>
  );
}

export default App;
