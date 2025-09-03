import { Route, Routes } from "react-router-dom";
import FloatingShapes from "./components/FloatingShapes";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const {isAuthenticated , user} = useAuthStore();

  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }

  return children;
}

const RedirectAuthenticatedUser = ({children}) =>{
  const { isAuthenticated, user } = useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace />
  }
}

function App() {

  const {isChecking,checkAuth,isAuthenticated,user} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShapes
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShapes
        color="bg-green-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShapes
        color="bg-green-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={10}
      />
      <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
      </Routes>
    </div>
  );
}

export default App;
