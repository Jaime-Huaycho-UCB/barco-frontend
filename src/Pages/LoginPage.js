import { useNavigate } from "react-router-dom";
import LoginComponent from "../Components/Login";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (name) => {
    localStorage.setItem("user", name); // Guardar el nombre
    navigate("/home"); // Redirigir a la página principal
  };

  return (
    <div>
      <LoginComponent onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
