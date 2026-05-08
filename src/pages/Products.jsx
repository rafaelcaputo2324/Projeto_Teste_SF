import { useState } from "react";

function Products() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");

  function adicionarProduto() {
    if (!nome) return;

    setProdutos([...produtos, nome]);
    setNome("");
  }

  function removerProduto(index) {
    const lista = produtos.filter((_, i) => i !== index);
    setProdutos(lista);
  }

  return (
    <div className="products">
      <h1>Produtos</h1>

      <div className="form-product">
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <button onClick={adicionarProduto}>
          Adicionar
        </button>
      </div>

      {produtos.map((produto, index) => (
        <div className="product-item" key={index}>
          <span>{produto}</span>

          <button onClick={() => removerProduto(index)}>
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}

export default Products;
