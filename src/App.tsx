import { useEffect, useState } from "react";
import "./App.css";
import "./components/dashboard/index.css";
import Api from "./services";

// Rotas para utilização
// http://localhost:3001/produto - Cadastro de produto
// http://localhost:3001/produto/:id - Excluir produto
// http://localhost:3001 - Listar todos os produtos

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [products, setProducts] = useState([]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const obj = {
      codigo: formData.get("codigo"),
      produto: formData.get("produto"),
    };
    event.currentTarget.reset();

    try {
      await Api.post("/produto", obj);

      listProducts();
    } catch (error) {
      console.error(error);
    }
  }

  async function removeProduct(id: string) {
    try {
      await Api.delete(`/produto/${id}`);

      listProducts();
    } catch (error) {
      console.error(error);
    }
  }

  async function listProducts() {
    try {
      const response = await Api.get("/produto");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    listProducts();
  }, []);

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <nav>
        <button onClick={toggleTheme}>{darkMode ? "☀" : "🌙"}</button>
      </nav>
      <main>
        <h1>Tabela de Produtos</h1>
      </main>

      <form onSubmit={addProduct}>
        <input name="codigo" type="number" placeholder="Código" required />
        <input
          name="produto"
          type="text"
          placeholder="Nome do produto"
          required
        />
        <button type="submit">Cadastrar</button>
      </form>

      <ul className="product-list">
        {products.map(
          (product: { id: string; codigo: number; produto: string }) => (
            <li key={product.id}>
              <span>Código: {product.codigo}</span>
              <span>Produto: {product.produto}</span>
              <div>
                <button onClick={() => removeProduct(product.id)}>
                  Deletar
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;
