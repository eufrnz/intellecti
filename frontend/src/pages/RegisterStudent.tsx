import { Link } from "react-router-dom";
import { useRegisterStudent } from "../hooks/useRegisterStudent";
import { BRAND_NAME, THEME_COLORS } from "../constants/theme";

export default function RegisterStudent() {
  const { formData, isLoading, handleChange, handleSubmit } = useRegisterStudent();

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4" style={{ background: THEME_COLORS.surface }}>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border" style={{ borderColor: THEME_COLORS.border, boxShadow: '0 12px 34px rgba(0,0,0,0.08)' }}>
        
        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight" style={{ color: THEME_COLORS.red }}>
            {BRAND_NAME}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Cadastro de Aluno
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Nome
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ex: João"
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Sobrenome
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ex: Silva"
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

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
              placeholder="ex: joao_silva"
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
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
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
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
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg py-3 text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: THEME_COLORS.blueDark, boxShadow: `0 10px 24px ${THEME_COLORS.blue}20` }}
          >
            {isLoading ? "Cadastrando..." : "Criar conta de Aluno"}
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