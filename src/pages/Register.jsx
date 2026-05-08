import { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/login.css";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    alert("Conta criada!");
  }

  return (
    <div className="container-login">
      <div className="left-login">
        <h1>LoginPlus</h1>

        <p>
          Crie sua conta para acessar
          o sistema.
        </p>
      </div>

      <form className="card-login" onSubmit={handleRegister}>
        <h2>Cadastrar</h2>

        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">
          Criar Conta
        </button>

        <p className="register-text">
          Já possui conta?
          <Link to="/">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
