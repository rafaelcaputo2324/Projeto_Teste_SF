import { useState } from "react";
import Navbar from "../components/Navbar";

function Products() {

  const [produtos, setProdutos] = useState([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");

  function adicionarProduto() {

    if (!nome || !preco || !quantidade) {
      return;
    }

    const novoProduto = {
      nome,
      preco,
      quantidade,
    };

    setProdutos([...produtos, novoProduto]);

    setNome("");
    setPreco("");
    setQuantidade("");
  }

  function removerProduto(index) {
    const lista = produtos.filter(
      (_, i) => i !== index
    );

    setProdutos(lista);
  }

  return (
    <>
      <Navbar />

      <div className="products">

        <h1>Produtos</h1>

        <div className="form-product">

          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) =>
              setPreco(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) =>
              setQuantidade(e.target.value)
            }
          />

          <button onClick={adicionarProduto}>
            Adicionar
          </button>

        </div>

        {produtos.map((produto, index) => (

          <div
            className="product-item"
            key={index}
          >

            <div>
              <h3>{produto.nome}</h3>

              <p>
                Preço: R$ {produto.preco}
              </p>

              <p>
                Quantidade:
                {" "}
                {produto.quantidade}
              </p>
            </div>

            <button
              onClick={() =>
                removerProduto(index)
              }
            >
              Excluir
            </button>

          </div>

        ))}

      </div>
    </>
  );
}

export default Products;
