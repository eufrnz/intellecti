import { Link } from "react-router-dom";

export default function Choose() {
  return (
    <div className="h-screen w-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-red-500">
            Intellecti
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Escolha seu tipo de conta para continuar
          </p>
        </div>

        {/* Opções de Seleção */}
        <div className="flex flex-col gap-4">
          
          {/* Opção: Professor */}
          <Link
            to="/register/teacher"
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-neutral-200 bg-white hover:border-red-500 hover:bg-red-50/30 transition text-center group"
          >
            <span className="text-lg font-semibold text-neutral-800 group-hover:text-red-500 transition">
              Sou Professor(a)
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              Quero criar e gerenciar turmas e atividades
            </span>
          </Link>

          {/* Opção: Aluno */}
          <Link
            to="/register/student"
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-neutral-200 bg-white hover:border-blue-900 hover:bg-blue-50/30 transition text-center group"
          >
            <span className="text-lg font-semibold text-neutral-800 group-hover:text-blue-900 transition">
              Sou Aluno(a)
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              Quero responder atividades e acompanhar meu desempenho
            </span>
          </Link>

        </div>

        {/* Rodapé / Voltar para o Login */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-sm text-neutral-500 hover:text-neutral-900 transition"
          >
            Já possui uma conta?{" "}
            <span className="font-semibold underline">
              Entrar
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}