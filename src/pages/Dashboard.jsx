import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>
          Bem-vindo ao LoginPlus
        </h1>

        <div className="cards">

          <div className="card">
            <h2>Usuários</h2>
            <p>15 cadastrados</p>
          </div>

          <div className="card">
            <h2>Produtos</h2>
            <p>32 cadastrados</p>
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;
