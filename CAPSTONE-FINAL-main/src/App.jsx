import { BrowserRouter, Route, Routes } from "react-router-dom";

import VerifyEmail from "./components/Auth/VerifyEmail";
import WelcomePage from "./components/Auth/WelcomePage";
import RegistrationPage from "./components/Auth/RegistrationPage";
import LoginPage from "./components/Auth/LoginPage";

import PediatricianLayout from "./components/Layout/PediatricianLayout";
import Appointments from "./pages/Pediatrician/Appointments";
import Calendar from "./pages/Pediatrician/Calendar";
import RequestConsultation from "./pages/Pediatrician/RequestConsultation";
import RequestAppointment from "./pages/Pediatrician/RequestAppointment";
import Chat from "./pages/Pediatrician/Chat";
import Profile from "./pages/Pediatrician/Profile";
import Notifications from "./pages/Pediatrician/Notifications";
import ParentComponent from "./pages/Pediatrician/ParentComponent";
import ActivityLog from "./pages/Pediatrician/ActivityLog";
import Settings from "./pages/Pediatrician/Settings";
import AboutUs from "./pages/Pediatrician/AboutUs";
import Patients from "./pages/Pediatrician/Patients";
import PediatricianViewConsultation from "./pages/Pediatrician/VIewConsultations";
import PrescriptionPad from "./pages/Pediatrician/Prescriptions";
import PediatricianDashboard from "./pages/Pediatrician/PediatricianDashboard";
import PediatricianViewAppointment from "./pages/Pediatrician/PediatricianViewAppointment";
import Consultations from "./pages/Pediatrician/Consultations";
import ViewPatient from "./pages/Pediatrician/ViewPatient"
import MedicalRecords from "./pages/Pediatrician/MedicalRecords"
import ViewPrescription from "./pages/Pediatrician/ViewPrescription";

import GuardianLayout from "./components/Layout/GuardianLayout";
import GuardianDashboard from "./pages/Guardian/GuardianDashboard";
import GuardianAppointments from "./pages/Guardian/GuardianAppointments";
import GuardianChat from "./pages/Guardian/GuardianChat";
import GuardianNotifications from "./pages/Guardian/GuardianNotifications";
import GuardianProfile from "./pages/Guardian/GuardianProfile";
import GuardianRequestConsultation from "./pages/Guardian/GuardianRequestConsultation";
import GuardianRequestAppointment from "./pages/Guardian/GuardianRequestAppointment";
import GuardianActivityLog from "./pages/Guardian/GuardianActivityLog";
import GuardianSettings from "./pages/Guardian/GuardianSettings";
import GuardianAboutUs from "./pages/Guardian/GuardianAboustUs";
import GuardianMyCalendar from "./pages/Guardian/GuardianCalendar";
import GuardianViewPatient from "./pages/Guardian/GuardianViewPatient";
import GuardianViewAppointment from "./pages/Guardian/GuardianViewAppointment";
import GuardianConsultations from "./pages/Guardian/GuardianConsultation";
import GuardianViewConsultation from "./pages/Guardian/GuardianViewConsultations";
import GuardianEditPatient from "./pages/Guardian/GuardianEditPatient";
import GuardianPatients from "./pages/Guardian/GuardianPatients";

import AdminLayout from "./components/Layout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminPrescriptions from "./pages/Admin/Prescriptions";
import AdminPatient from "./pages/Admin/Patients";
import AdminSettings from "./pages/Admin/Settings";
import AdminUsers from "./pages/Admin/Users";
import AdminProfile from "./pages/Admin/Profile";
import AdminMyCalendar from "./pages/Admin/Calendar";
import AdminAppointments from "./pages/Admin/Appointments";
import AdminConsultations from "./pages/Admin/Consultations";
import AdminActivityLogs from "./pages/Admin/ActivityLogs";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define WelcomePage as the landing page */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/registrationpage" element={<RegistrationPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/loginpage" element={<LoginPage />} />

        {/* Main App Layout */}
        <Route path="/guardian" element={<GuardianLayout />}>
          <Route path="dashboard" element={<GuardianDashboard />} />
          <Route path="appointments" element={<GuardianAppointments />} />
          <Route path="consultations" element={<GuardianConsultations />} />
          <Route path="patients" element={<GuardianPatients />} />
          <Route path="/guardian/:email" element={<GuardianViewPatient />} />
          <Route path="chat" element={<GuardianChat />} />
          <Route path="notifications" element={<GuardianNotifications />} />
          <Route path="profile" element={<GuardianProfile />} />
          <Route path="calendar" element={<GuardianMyCalendar />} />
          <Route path="request-consultation" element={<GuardianRequestConsultation />} />
          <Route path="request-appointment" element={<GuardianRequestAppointment />} />
          <Route path="/guardian/get-appointments/:appointmentId" element={<GuardianViewAppointment />} />
          <Route path="/guardian/get-consultation-details/:consultationId" element={<GuardianViewConsultation />} />
          <Route path="activity-log" element={<GuardianActivityLog />} />
          <Route path="settings" element={<GuardianSettings />} />
          <Route path="about-us" element={<GuardianAboutUs />} />
          <Route path="edit-patient" element={<GuardianEditPatient />} />
          <Route path="register-patient" element={<GuardianEditPatient />} />
        </Route>

        <Route path="/pediatrician" element={<PediatricianLayout />}>
          <Route path="dashboard" element={<PediatricianDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="chat/:roomName" element={<ParentComponent />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="/pediatrician/get-consultation-details-for-pediatrician/:consultationId" element={<PediatricianViewConsultation />} />
          <Route path="/pediatrician/get-appointments-pediatrician/:appointmentId" element={<PediatricianViewAppointment />} />
          <Route path="request-consultation" element={<RequestConsultation />} />
          <Route path="request-appointment" element={<RequestAppointment />} />
          <Route path="activity-log" element={<ActivityLog />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="prescriptions" element={<PrescriptionPad />} />
          <Route path="patients" element={<Patients />} />
          <Route path="view-patient" element={<ViewPatient />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="view-prescription" element={<ViewPrescription />} />   
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="prescriptions" element={<AdminPrescriptions />} />
          <Route path="patients" element={<AdminPatient />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="calendar" element={<AdminMyCalendar />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="consultations" element={<AdminConsultations />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
