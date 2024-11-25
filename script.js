// Lista de chaves da API para tentativas de uso
const apiKeys = [
  "g4K4MHVJvcgMkQcAEkLMYucF",
  "KCPVLgXRUhqpG4r3Ew5qEjFq",
  "u545QXEHeDKDTQKLgdepFnFo",
  "2wV5FkzmMxxA5B7KC5QHWYb1",
  "hjD6NnxT6VKACKZYJxyZ57YZ",
  "S3sdCrRPQUtWoTCAJJAjCnCi",
  "4UiUxaEZSDvRFsnDeWBMck1z",
  "nNzLfT229G53pWvzYLZVqVTg",
  "ZkY26pFwVmPXkmxGWiRpAtQg",
  "n5mhKGZz8qypPumG6ZRLjX54",
  "DXbAWSWyoRJkzi8y3KaqB82p",
  "iCcDd7Gp4gpgqrehmVV2Yev5",
  "kbV3Tt1WvJdZydvSZ6KxkNKf",
];

// Índice da chave API atual
let currentApiKeyIndex = 0;

// Função para alternar para a próxima chave API
function getNextApiKey() {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
  return apiKeys[currentApiKeyIndex];
}

// Função para remover o fundo da imagem e adicionar um novo fundo
async function removerFundo() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];

  // Verifica se um arquivo de imagem foi selecionado
  if (!file) {
    alert("Por favor, selecione uma imagem");
    return;
  }

  const formData = new FormData();
  formData.append("image_file", file);

  // Tenta usar as chaves da API, alternando em caso de falha
  for (let tentativa = 0; tentativa < apiKeys.length; tentativa++) {
    const apiKey = apiKeys[tentativa];

    // Envia a imagem para a API
    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      // Processa a imagem recebida e adiciona o fundo
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        const imgSemFundo = new Image();
        const imgFundo = new Image();

        // Define a imagem de fundo após a imagem sem fundo ser carregada
        imgSemFundo.onload = () => {
          imgFundo.src = "fundo-rubeus.png";
        };

        imgFundo.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = imgFundo.width;
          canvas.height = imgFundo.height;

          // Desenha o fundo centralizado
          ctx.drawImage(
            imgFundo,
            (canvas.width - imgFundo.width) / 2,
            (canvas.height - imgFundo.height) / 2,
            imgFundo.width,
            imgFundo.height
          );

          // Calcula o corte e posicionamento da imagem sem fundo
          const escalaX = canvas.width / imgSemFundo.width;
          const escalaY = canvas.height / imgSemFundo.height;
          const escala = Math.max(escalaX, escalaY);

          const larguraCorte = canvas.width / escala;
          const alturaCorte = canvas.height / escala;

          const offsetX = (imgSemFundo.width - larguraCorte) / 2;
          const offsetY = (imgSemFundo.height - alturaCorte) / 2;

          // Desenha a imagem sem fundo cortada e centralizada
          ctx.drawImage(
            imgSemFundo,
            offsetX,
            offsetY,
            larguraCorte,
            alturaCorte,
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Exibe o resultado na página
          const resultado = document.getElementById("resultado");
          resultado.innerHTML = `<img src="${canvas.toDataURL()}" alt="Imagem com fundo da rubeus">`;
        };

        imgSemFundo.src = imageUrl;
        return;
      }

      continue;
    } catch (error) {
      console.log(`Erro com a chave ${tentativa + 1}:`, error); // Exibe o erro
      continue;
    }
  }

  alert(
    "Operação não concluída: tokens de remoção esgotados. Aguarde ou peça um novo token ao desenvolvedor."
  );
}
