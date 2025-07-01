import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Navigate } from 'react-router-dom'


// import Dashboard from './pages/dashboard.jsx'
// import NotFoundPage from './pages/NotFoundPage.jsx'
// import Layout from './components/layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import Home from './pages/Home.jsx'
const Logout = () => {
  localStorage.clear()
  return <Navigate to="/login" />
}

const RegisterAndLogout = () => {
  localStorage.clear()
  return <Register />
}

const router = createBrowserRouter([
  // // {
  // //   path:"/", 
  // //   element: <ProtectedRoute><Layout /></ProtectedRoute>, 
  // //   children: [
  // //     {index: true, element: <App />},
  // //     {path:"/dashboard", element: <Dashboard />},
      
  // // ],
  // },

  {path: "/", element: <ProtectedRoute><Home /></ProtectedRoute>},
  {path:"/login", element: <Login />},
  {path:"/register", element: <RegisterAndLogout />},
  {path:"/logout", element: <Logout />},
  {path:"*", element: <NotFound />},
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)