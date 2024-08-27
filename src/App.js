import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Admin/Dashboard'
import GenerateFeedbackForm from './Components/Admin/GenerateFeedbackForm'
import ViewFeedbackForm from './Components/Admin/ViewFeedbackForm'
import Navbar from './Components/Navbar'
import Carousel from './Components/Carousel'
import About from './Components/About'
import Services from './Components/Services'
import Contact from './Components/Contact'
import Footer from './Components/Footer'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Panel Routes */}
        <Route path="/admin/Dashboard" element={
          <>
            <Dashboard />
          </>
        }/>
        <Route path="/admin/GenerateFeedbackForm/:feedbackLabel/:FormId?" element={
          <>
            <div className='app-container'>
              <GenerateFeedbackForm />
            </div>
          </>
        }/>
        <Route path="/admin/ViewFeedbackForm/:FormId" element={
          <>
            <ViewFeedbackForm />
          </>
        }/>

        {/* Website Routes */}
        <Route path="/custom-feedback-form-builder" element={
          <>
            <Navbar />
            <Carousel />
            <Footer />
          </>
        } />
        <Route path="/About" element={
           <>
           <Navbar />
           <About />
           <Footer />
         </>
        } />
        <Route path="/Services" element={
           <>
           <Navbar />
           <Services />
           <Footer />
         </>
        } />
        <Route path="/Contact" element={
           <>
           <Navbar />
           <Contact />
           <Footer />
         </>
        } />
      </Routes>
    </Router>
  );
}

export default App;









