import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent, type StudentRequest,  } from "../services/studentService";

export function useRegisterStudent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StudentRequest>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerStudent(formData);
      alert("Aluno cadastrado com sucesso!");
      navigate("/"); 
    } catch (error: any) {
      console.error("Erro ao conectar à API:", error);
      alert(`Erro no cadastro: ${error.message || "Não foi possível conectar ao servidor."}`);
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