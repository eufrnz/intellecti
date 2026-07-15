import { Link } from "react-router-dom";
import { useRegisterTeacher } from "../hooks/useRegisterTeacher";
import { BRAND_NAME, THEME_COLORS } from "../constants/theme";

export default function RegisterTeacher() {
  const { formData, isLoading, handleChange, handleSubmit } = useRegisterTeacher();

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4" style={{ background: THEME_COLORS.surface }}>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border" style={{ borderColor: THEME_COLORS.border, boxShadow: '0 12px 34px rgba(0,0,0,0.08)' }}>
        

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight" style={{ color: THEME_COLORS.red }}>
            {BRAND_NAME}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Cadastro de Professor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Nome de Usuário (Username)
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="ex: prof_silva"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg py-3 text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: THEME_COLORS.red, boxShadow: `0 10px 24px ${THEME_COLORS.redDark}20` }}
          >
            {isLoading ? "Cadastrando..." : "Criar conta de Professor"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/choose" 
            className="text-xs text-neutral-500 hover:text-neutral-900 transition"
          >
            ← Voltar para seleção de conta
          </Link>
        </div>

      </div>
    </div>
  );
}