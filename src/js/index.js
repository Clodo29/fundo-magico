document.addEventListener("DOMContentLoaded", function () {
    // Objetivo:
    // Enviar um texto de um formulário para uma API do n8n e exibir o resultado do código html, css e colocar a animação no fundo da tela do site.
    // Passos:
    // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
    const formulario = document.querySelector(".form-group");// Seleciona o formulário
    const descricaoInput = document.getElementById("description");// Campo de texto onde o usuário digita a descrição
    const codigoHtml = document.getElementById("html-code");// Área onde o código HTML será exibido
    const codigoCss = document.getElementById("css-code");// Área onde o código CSS será exibido
    const secaoPreview = document.getElementById("preview-section");// Seção onde o preview será exibido

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault(); // Evita o recarregamento da página

        // 2. Obter o valor digitado pelo usuário no campo de texto.
        const descricao = descricaoInput.value.trim();// Pega o valor do input e remove espaços em branco desnecessários

        if (!descricao) {
            return; // Sai da função se a descrição estiver vazia
        }

        // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
        mostrarCarregamento(true);// Função para mostrar o indicador de carregamento

        // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
        try {
            const resposta = await fetch("https://codadev.app.n8n.cloud/webhook/Fundo-Magico",{ // Substitua pela URL do seu webhook n8n
                method: "POST",
                headers: {
                    "Content-Type": "application/json",// Define o tipo de conteúdo como JSON
                },
                body: JSON.stringify({ descricao }), // Envia o texto do formulário no corpo da requisição            
            });

            const dados = await resposta.json();// Espera a resposta em JSON


            codigoHtml.textContent = dados.html || ""; // Supondo que a resposta tenha uma propriedade 'html'
            codigoCss.textContent = dados.css || "";// Supondo que a resposta tenha uma propriedade 'css'

            secaoPreview.style.display = "block";
            secaoPreview.innerHTML = dados.html || "";// Insere o HTML retornado na seção de preview

            let tagEstilo = document.getElementById("estilo-dinamico");
            //se essa tag já existir, remover ela antes de criar uma nova
            if (tagEstilo) {
                tagEstilo.remove();
            }

            if (dados.css) {// Insere o CSS retornado dinamicamente na página
                tagEstilo = document.createElement("style");
                tagEstilo.id = "estilo-dinamico";
                tagEstilo.textContent = dados.css;
                document.head.appendChild(tagEstilo);
            }
        } catch (error) {// Captura erros na requisição
            console.error("Error ao fazer a requisição:", error);
            codigoHtml.textContent = "Não consegui gerar o HTML, tente novamente.";
            codigoCss.textContent = "Não consegui gerar o CSS, tente novamente.";
            secaoPreview.innerHTML = "";
        }
        finally {
            mostrarCarregamento(false);
        }
    });

    function mostrarCarregamento(estaCarregando) {
        const botaoEnviar = document.getElementById("generate-btn");
        if (estaCarregando) {
            botaoEnviar.textContent = "Carregando Background...";
        } else {
            botaoEnviar.textContent = "Gerar Background";
        }
    }
    // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
    // 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
    //    - Mostrar o HTML e CSS gerado em uma área de preview.
    //    - Inserir o CSS retornado dinamicamente na página para aplicar o background.
    // 7. Remover o indicador de carregamento após o recebimento da resposta.
});
