// 🔗 URL da API do Google Apps Script (troque pela sua quando publicar)
const API_URL = "https://script.google.com/macros/s/AKfycbzbDAgMjVPJcI1hAT2m_ML8sdJXUGlTFTzEEXuWjgAog0EM0pepGq9iDIvI_h9kGnFqPw/exec";

let materiais = [];
let valorTotal = 0;

document.getElementById("add-material").addEventListener("click", () => {
  const materialSelect = document.getElementById("material");
  const [nome, preco] = materialSelect.value.split("|");
  const precoNum = parseFloat(preco);

  materiais.push({ nome, preco: precoNum });
  valorTotal += precoNum;

  atualizarLista();
});

function atualizarLista() {
  const lista = document.getElementById("lista-materiais");
  lista.innerHTML = "";

  materiais.forEach((mat, index) => {
    const li = document.createElement("li");
    li.textContent = `${mat.nome} - R$${mat.preco}`;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "X";
    btnRemover.onclick = () => {
      valorTotal -= mat.preco;
      materiais.splice(index, 1);
      atualizarLista();
    };

    li.appendChild(btnRemover);
    lista.appendChild(li);
  });

  document.getElementById("valor-total").textContent = `Valor Total: R$${valorTotal}`;
}

document.getElementById("salvar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value;
  const observacoes = document.getElementById("observacoes").value;

  if (!nome) {
    alert("Preencha o nome!");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      nome,
      observacoes,
      materiais,
      valorTotal
    }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    alert("Orçamento salvo com sucesso!");
    console.log(data);

    // Resetar formulário
    materiais = [];
    valorTotal = 0;
    atualizarLista();
    document.getElementById("orcamento-form").reset();
  })
  .catch(err => {
    console.error(err);
    alert("Erro ao salvar. Verifique a API.");
  });
});
