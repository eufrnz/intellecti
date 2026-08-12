import { useState } from "react";
import { useInRouterContext, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerStudent, type StudentRequest,  } from "../services/studentService";

export function useRegisterStudent(navigateOverride?: (path: string) => void) {
  const routerNavigate = useInRouterContext() ? useNavigate() : undefined;
  const navigate = navigateOverride ?? routerNavigate;
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
      toast.success("Aluno cadastrado com sucesso!");
      navigate?.("/"); 
    } catch (error: any) {
      console.error("Erro ao conectar à API:", error);
      toast.error(error.message || "Erro no cadastro do aluno.");
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