import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <h2>LoginPlus</h2>

      <div>
        <Link to="/dashboard">Home</Link>

        <Link to="/produtos">
          Produtos
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
