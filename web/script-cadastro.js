const formProduto = document.getElementById("form-produto");
const mensagem = document.getElementById("mensagem");
const tituloForm = document.getElementById("titulo-form");
const inputId = document.getElementById("produto-id");
const inputName = document.getElementById("name");
const inputPrice = document.getElementById("price");
const inputCategory = document.getElementById("category");
const inputDescription = document.getElementById("description");

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function validarFormulario() {
  const name = inputName.value.trim();
  const price = Number(inputPrice.value);
  const category = inputCategory.value.trim();

  if (!name || !category || inputPrice.value === "") {
    return "Preencha todos os campos obrigatórios.";
  }
  if (!Number.isFinite(price) || price < 0 || price > 999999.99) {
    return "Preço inválido. Use um valor entre 0 e 999999.99.";
  }
  return null;
}

async function carregarProdutoParaEdicao(id) {
  try {
    const res = await fetch("/products");
    const produtos = await res.json();

    if (!res.ok) throw new Error("Não foi possível buscar os produtos.");

    const produto = produtos.find((p) => p.id === Number(id));
    if (!produto) {
      mostrarMensagem("Produto não encontrado para edição.", "erro");
      return;
    }

    tituloForm.textContent = "Editar Produto";
    inputId.value = produto.id;
    inputName.value = produto.name;
    inputPrice.value = Number(produto.price).toFixed(2);
    inputCategory.value = produto.category;
    inputDescription.value = produto.description || "";
  } catch (error) {
    mostrarMensagem(error.message || "Erro ao carregar produto.", "erro");
  }
}

formProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const erro = validarFormulario();
  if (erro) {
    mostrarMensagem(erro, "erro");
    return;
  }

  const payload = {
    name: inputName.value.trim(),
    price: Number(inputPrice.value),
    category: inputCategory.value.trim(),
    description: inputDescription.value.trim(),
  };

  const id = inputId.value;
  const isEdicao = Boolean(id);

  try {
    const res = await fetch(isEdicao ? `/products/${id}` : "/products", {
      method: isEdicao ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Falha ao salvar produto.");
    }

    mostrarMensagem(data.message || "Produto salvo com sucesso.");
    if (!isEdicao) formProduto.reset();
  } catch (error) {
    mostrarMensagem(error.message || "Erro ao salvar produto.", "erro");
  }
});

const params = new URLSearchParams(window.location.search);
const idEdicao = params.get("id");
if (idEdicao) carregarProdutoParaEdicao(idEdicao);
