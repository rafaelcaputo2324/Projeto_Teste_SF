import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    alert("Usuário cadastrado!");
  }

  return (
    <div className="container-login">
      <form className="card-login" onSubmit={handleRegister}>
        <h1>Cadastrar</h1>

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

        <button type="submit">Cadastrar</button>

        <p>
          Já possui conta? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;