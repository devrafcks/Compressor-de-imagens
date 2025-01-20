// Seleção de elementos do DOM
const dropzone = document.getElementById('dropzone');
const imageInput = document.getElementById('imageInput');
const imageProcessingArea = document.getElementById('imageProcessingArea');
const outputImage = document.getElementById('outputImage');
const downloadBtn = document.getElementById('downloadBtn');
const compressionOverlay = document.getElementById('compressionOverlay');

// Variável para armazenar o arquivo atual
let currentFile = null;

// Adiciona a classe de destaque quando o arquivo é arrastado para a área
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
});

// Remove a classe de destaque quando o arquivo sai da área
dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
});

// Lida com o evento de soltar o arquivo na área
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0]; // Obtém o primeiro arquivo arrastado
    if (file && file.type.startsWith('image/')) {
        processImage(file); // Processa o arquivo se for uma imagem
    }
});

// Permite que o usuário clique na área para abrir o seletor de arquivos
dropzone.addEventListener('click', () => {
    imageInput.click();
});

// Lida com a seleção de arquivo via seletor de arquivos
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0]; // Obtém o primeiro arquivo selecionado
    if (file && file.type.startsWith('image/')) {
        processImage(file); // Processa o arquivo se for uma imagem
    }
});

/**
 * Função para processar a imagem selecionada
 * @param {File} file - Arquivo de imagem selecionado
 */
function processImage(file) {
    currentFile = file; // Armazena o arquivo atual
    compressImage(file, 0.8); // Inicia a compressão com qualidade 80%
}

/**
 * Função para comprimir a imagem
 * @param {File} file - Arquivo de imagem original
 * @param {number} quality - Qualidade de compressão (0.0 a 1.0)
 */
function compressImage(file, quality) {
    const img = new Image();
    img.src = URL.createObjectURL(file); // Cria uma URL temporária para a imagem
    img.onload = () => {
        // Cria um elemento canvas para renderizar a imagem
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Renderiza a imagem no canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Converte o conteúdo do canvas em um Blob comprimido
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob); // Cria uma URL temporária para o Blob
            outputImage.src = url; // Exibe a imagem comprimida
            imageProcessingArea.style.display = 'block'; // Mostra a área de processamento
            downloadBtn.style.display = 'block'; // Mostra o botão de download

            // Calcula a taxa de compressão e exibe na sobreposição
            const compressionRatio = ((1 - (blob.size / file.size)) * 100).toFixed(1);
            compressionOverlay.textContent = `${compressionRatio}% Comprimido`;

            // Configura o botão de download para baixar a imagem comprimida
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = `compressed_${file.name}`; // Nome do arquivo comprimido
                a.click();
            };
        }, 'image/jpeg', quality); // Define o formato e qualidade do Blob
    };
}
