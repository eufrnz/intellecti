import { useState } from "react";
import { useInRouterContext, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerTeacher, type TeacherRequest, } from "../services/teacherService";

export function useRegisterTeacher(navigateOverride?: (path: string) => void) {
  const routerNavigate = useInRouterContext() ? useNavigate() : undefined;
  const navigate = navigateOverride ?? routerNavigate;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherRequest>({
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
      await registerTeacher(formData);
      toast.success("Professor cadastrado com sucesso!");
      navigate?.("/"); // Redireciona para o login após sucesso
    } catch (error: any) {
      console.error("Erro ao conectar à API:", error);
      toast.error(error.message || "Erro no cadastro do professor.");
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