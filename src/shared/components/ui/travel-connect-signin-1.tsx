import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/app/providers/use-auth";
import imgLogin from "@/assets/img-login.png";
import safLogo from "@/assets/saf-logo.png";

/* ─────────────────────────────────────────────────────────────
   LOGIN PAGE — split-screen
   Esq : imagem ocupando todo o lado (sem padding, sem card)
   Dir : formulário centralizado com fundo branco
───────────────────────────────────────────────────────────── */
const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [isLoading, setIsLoading]       = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthContext();

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/painel/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">

      {/* ══════════════════════════════════════════
          LADO ESQUERDO — imagem full
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden md:block w-[55%] h-full"
      >
        <img
          src={imgLogin}
          alt="SAF Platform"
          className="w-full h-full object-cover rounded-tr-[30px] rounded-bl-[30px]"
        />
      </motion.div>

      {/* ══════════════════════════════════════════
          LADO DIREITO — formulário
      ══════════════════════════════════════════ */}
      <div className="w-full md:w-[45%] h-full flex items-center justify-center bg-white px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-xs flex flex-col items-center"
        >
          {/* Logo SAF */}
          <img src={safLogo} alt="SAF Logo" className="w-40 -mb-4 object-contain" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
              >
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="
                    w-full pl-9 pr-4 py-2.5 rounded-lg
                    border border-gray-200 bg-gray-50
                    text-sm text-gray-800 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="
                    w-full pl-9 pr-10 py-2.5 rounded-lg
                    border border-gray-200 bg-gray-50
                    text-sm text-gray-800 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                    transition-all duration-200
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Botão */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="
                w-full py-2.5 mt-1 rounded-lg
                bg-gradient-to-r from-blue-500 to-indigo-600
                hover:from-blue-600 hover:to-indigo-700
                text-white font-semibold text-sm
                shadow-md shadow-indigo-100
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </motion.button>

            {/* Esqueci senha */}
            <p className="text-center pt-1">
              <a href="#" className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">
                Esqueci minha senha
              </a>
            </p>
          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default Index;
