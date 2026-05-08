import { Link } from "react-router-dom";
import "./../styles/login.css";

function Login() {
  function handleLogin(e) {
    e.preventDefault();

    alert("Login realizado!");
  }

  return (
    <div className="container-login">
      <div className="left-login">
        <h1>LoginPlus</h1>

        <p>
          Faça login para acessar
          o sistema.
        </p>
      </div>

      <form className="card-login" onSubmit={handleLogin}>
        <h2>Entrar</h2>

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Senha"
        />

        <button type="submit">
          Entrar
        </button>

        <p className="register-text">
          Não possui conta?
          <Link to="/cadastro">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
