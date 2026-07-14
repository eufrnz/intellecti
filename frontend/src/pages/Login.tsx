import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const { formData, isLoading, handleChange, handleSubmit } = useLogin();

  return (
    <div className="h-screen w-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-red-500">
            Intellecti
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Nome de Usuário
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="usuario"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Senha
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-blue-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <Link to="/choose" className="text-sm text-neutral-500 hover:text-neutral-900 transition">
            Não possui conta?
            <span className="font-semibold underline text-neutral-900 ml-1">
              Criar conta
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}