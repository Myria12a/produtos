const listaProdutos = document.getElementById("lista-produtos");
const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function renderizarProdutos(produtos) {
  if (!produtos.length) {
    listaProdutos.innerHTML = `<p>Nenhum produto cadastrado.</p>`;
    return;
  }

  listaProdutos.innerHTML = produtos
    .map(
      (produto) => `
      <article class="produto-card">
        <h3>${produto.name}</h3>
        <p><strong>Preço:</strong> ${formatarPreco(produto.price)}</p>
        <p><strong>Categoria:</strong> ${produto.category}</p>
        <p><strong>Descrição:</strong> ${produto.description || "-"}</p>
        <div class="actions top-gap">
          <a class="btn btn-secondary" href="cadastro.html?id=${produto.id}">Editar</a>
          <button class="btn btn-danger" onclick="excluirProduto(${produto.id})">Excluir</button>
        </div>
      </article>
    `
    )
    .join("");
}

async function carregarProdutos() {
  try {
    const res = await fetch("/products");
    const produtos = await res.json();

    if (!res.ok) throw new Error("Erro ao carregar produtos.");

    renderizarProdutos(produtos);
  } catch (error) {
    mostrarMensagem(error.message || "Falha ao buscar produtos.", "erro");
  }
}

async function excluirProduto(id) {
  const confirmou = window.confirm("Deseja realmente excluir este produto?");
  if (!confirmou) return;

  try {
    const res = await fetch(`/products/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erro ao excluir produto.");

    mostrarMensagem(data.message || "Produto excluído com sucesso.");
    await carregarProdutos();
  } catch (error) {
    mostrarMensagem(error.message || "Falha ao excluir produto.", "erro");
  }
}

window.excluirProduto = excluirProduto;
carregarProdutos();
