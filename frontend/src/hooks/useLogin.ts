import { useState } from "react";
import { useInRouterContext, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUser, type LoginRequest } from "../services/authService";

interface DecodedToken {
  role?: string;
  roles?: string[];
  sub?: string;
}

export function useLogin(navigateOverride?: (path: string) => void) {
  const routerNavigate = useInRouterContext() ? useNavigate() : undefined;
  const navigate = navigateOverride ?? routerNavigate;
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        const decoded: DecodedToken = jwtDecode(data.token);
        const userRole = decoded.role || (decoded.roles && decoded.roles[0]) || "";
        localStorage.setItem("role", userRole);

        if (userRole === "ROLE_STUDENT") {
          navigate?.("/student/home");
        } else if (userRole === "ROLE_TEACHER") {
          navigate?.("/teacher/home");
        } else {
          alert("Usuário não possui uma role válida de acesso.");
          navigate?.("/");
        }
      } else {
        alert("Erro: Token não recebido do servidor.");
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      alert(error.message || "Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
  };
}