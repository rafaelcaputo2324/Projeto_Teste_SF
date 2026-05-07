import { useState } from "react";
import "./../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    alert("Login realizado com sucesso!");
  }

  return (
    <div className="container-login">
      <div className="left-login">
        <h1>LoginPlus</h1>
        <p>
          Sistema de cadastro de usuários e produtos
          com autenticação segura.
        </p>
      </div>

      <form className="card-login" onSubmit={handleLogin}>
        <h2>Entrar</h2>

        <input
          type="email"
          placeholder="Digite seu email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">
          Entrar
        </button>

        <span>
          © 2026 LoginPlus
        </span>
      </form>
    </div>
  );
}

export default Login;