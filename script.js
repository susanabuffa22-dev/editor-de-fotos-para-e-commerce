// ===========================
// EDITOR MULTIMODO CORREGIDO
// ===========================
// 🎯 Versión corregida para eliminar ghosting y conflictos de renderizado

// Configuración
const API_KEY = 'AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`;

// Estados
let currentMode = 'catalog';
let base64ImageData = null;
let processingQueue = []; // Cola para prevenir conflictos
let isProcessing = false; // Flag para evitar procesamiento concurrente

// Configuraciones por modo
const modeConfigs = {
    catalog: {
        name: 'Catálogo Web',
        width: 500,
        height: 500,
        icon: '🛍️',
        strategy: 'expansion' // Expandir verticales, centrar horizontales
    },
    instagram: {
        name: 'Instagram Reel',
        width: 1080,
        height: 1920,
        icon: '📱',
        strategy: 'cropping' // Recortar a vertical
    }
};

// Elementos DOM
const elements = {
    fileInput: document.getElementById('image-upload'),
    uploadArea: document.getElementById('upload-area'),
    personImage: document.getElementById('person-image'),
    personPreview: document.getElementById('person-preview'),
    garmentSection: document.getElementById('garment-section'),
    originalImage: document.getElementById('original-image'),
    editedImage: document.getElementById('edited-image'),
    btnDownload: document.getElementById('btn-download'),
    btnRetry: document.getElementById('btn-retry'),
    btnVirtualTryOn: document.getElementById('btn-virtual-tryon'),
    btnWhiteBackground: document.getElementById('btn-white-background'),
    btnSmile: document.getElementById('btn-smile'),
    catalogMode: document.getElementById('catalog-mode'),
    instagramMode: document.getElementById('instagram-mode'),
    currentModeDisplay: document.getElementById('current-mode-display'),
    loader: document.getElementById('loader'),
    errorMessage: document.getElementById('error-message'),
    imageUploadSection: document.getElementById('image-upload-section'),
    modeSelectorSection: document.getElementById('mode-selector-section'),
    toolsSection: document.getElementById('tools-section'),
    previewSection: document.getElementById('preview-section')
};

// ===========================
// INICIALIZACIÓN
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Editor Multimodo Iniciado');
    setupEventListeners();
    setupModeSelector();
    initializeMode();
});

// ===========================
// MODO SELECTOR
// ===========================
function setupModeSelector() {
    // Eventos para botones de modo
    elements.catalogMode.addEventListener('click', () => switchMode('catalog'));
    elements.instagramMode.addEventListener('click', () => switchMode('instagram'));
    
    console.log('✅ Modo selector configurado');
}

function switchMode(mode) {
    if (currentMode === mode) return; // No cambiar si ya está activo
    
    // Cancelar operaciones en curso
    if (isProcessing) {
        showError('Espere a que termine la operación actual antes de cambiar el modo');
        return;
    }
    
    currentMode = mode;
    updateModeDisplay();
    
    // Limpiar preview si hay imagen cargada
    if (base64ImageData) {
        elements.editedImage.innerHTML = '<p class="placeholder">Procesar imagen en modo ' + modeConfigs[mode].name + '</p>';
    }
    
    console.log('🔄 Modo cambiado a: ' + modeConfigs[mode].name);
}

function initializeMode() {
    // Configurar modo por defecto
    switchMode('catalog');
}

function updateModeDisplay() {
    const config = modeConfigs[currentMode];
    elements.currentModeDisplay.innerHTML = `
        <span class="mode-icon">${config.icon}</span>
        <div class="mode-info">
            <div class="mode-name">${config.name}</div>
            <div class="mode-dimensions">${config.width}×${config.height}px</div>
        </div>
    `;
    
    // Actualizar apariencia de botones
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentMode === 'catalog') {
        elements.catalogMode.classList.add('active');
    } else {
        elements.instagramMode.classList.add('active');
    }
}

// ===========================
// GESTORES DE EVENTOS
//===========================
function setupEventListeners() {
    // Upload handlers
    elements.fileInput.addEventListener('change', handleImageUpload);
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleDrop);
    
    // Tool handlers
    elements.btnWhiteBackground.addEventListener('click', () => processInMode('white_background'));
    elements.btnSmile.addEventListener('click', () => processInMode('smile_enhancement'));
    elements.btnVirtualTryOn.addEventListener('click', () => processInMode('virtual_tryon'));
    elements.btnDownload.addEventListener('click', downloadImage);
    elements.btnRetry.addEventListener('click', resetEditor);
    
    console.log('✅ Event listeners configurados');
}

// ===========================
// SISTEMA DE COLA PROCESAMIENTO
// ===========================
async function processInMode(processType) {
    if (!base64ImageData) {
        showError('Por favor, sube una imagen primero');
        return;
    }
    
    if (isProcessing) {
        showError('Espere a que termine la operación actual');
        return;
    }
    
    // Agregar a la cola y procesar
    const task = { type: processType, timestamp: Date.now() };
    processingQueue.push(task);
    
    await processQueue();
}

async function processQueue() {
    if (isProcessing || processingQueue.length === 0) {
        return;
    }
    
    isProcessing = true;
    const task = processingQueue.shift();
    
    try {
        console.log('🎯 Procesando: ' + task.type + ' en modo ' + modeConfigs[currentMode].name);
        
        // Obtener configuración del modo actual
        const modeConfig = modeConfigs[currentMode];
        
        // Crear canvas limpio para procesamiento
        const processedData = await processImageWithQueue(base64ImageData, task.type, modeConfig);
        
        if (processedData) {
            // Mostrar resultado en preview
            elements.editedImage.innerHTML = '<img src="' + processedData + '" alt="Imagen procesada">';
            elements.btnDownload.disabled = false;
            elements.btnRetry.disabled = false;
            
            showError(`✅ Procesamiento completado en modo ${modeConfig.name}`, 'success');
            console.log('✅ Procesamiento completado');
        } else {
            showError('Error en el procesamiento');
        }
        
    } catch (error) {
        console.error('❌ Error en procesamiento:', error);
        showError('Error: ' + error.message);
    } finally {
        isProcessing = false;
        
        // Procesar siguiente tarea en la cola
        if (processingQueue.length > 0) {
            setTimeout(processQueue, 100);
        }
    }
}

// ===========================
// PROCESAMIENTO DE IMAGEN CORREGIDO
// ===========================
async function processImageWithQueue(imageBase64, processType, modeConfig) {
    return new Promise(async (resolve) => {
        try {
            // 1. Analizar orientación
            const orientation = await analyzeImageOrientation(imageBase64);
            console.log('📊 Orientación: ' + orientation);
            
            // 2. Aplicar estrategia según modo
            let processedImage;
            
            if (modeConfig.strategy === 'expansion') {
                // MODO CATÁLOGO: Expandir verticales, centrar horizontales
                processedImage = await processCatalogMode(imageBase64, orientation, processType);
            } else {
                // MODO INSTAGRAM: Recortar a vertical
                processedImage = await processInstagramMode(imageBase64, orientation, processType);
            }
            
            // 3. Llamar API si es necesario
            if (processType !== 'dimensions_only') {
                processedImage = await callImageAPI(processedImage, processType, modeConfig);
            }
            
            resolve(processedImage);
            
        } catch (error) {
            console.error('❌ Error en procesamiento con cola:', error);
            resolve(null);
        }
    });
}

// ===========================
// LÓGICA POR MODO
// ===========================
async function processCatalogMode(imageBase64, orientation, processType) {
    const modeConfig = modeConfigs.catalog;
    
    switch (orientation) {
        case 'vertical':
            // IMAGEN VERTICAL: Usar IA para expandir/fill
            console.log('📏 Procesando imagen vertical - expandir con IA');
            return await processWithAIExpansion(imageBase64, processType, modeConfig);
            
        case 'square':
            // IMAGEN CUADRADA: Mantener como está
            console.log('📐 Procesando imagen cuadrada - mantener');
            return imageBase64;
            
        case 'horizontal':
            // IMAGEN HORIZONTAL: Centrar/cortar a cuadrado
            console.log('📏 Procesando imagen horizontal - centrar');
            return await smartCropToDimensions(imageBase64, modeConfig.width, modeConfig.height);
            
        default:
            return imageBase64;
    }
}

async function processInstagramMode(imageBase64, orientation, processType) {
    const modeConfig = modeConfigs.instagram;
    
    switch (orientation) {
        case 'vertical':
            // IMAGEN VERTICAL: Mantener como está
            console.log('📏 Procesando imagen vertical - mantener');
            return imageBase64;
            
        case 'square':
            // IMAGEN CUADRADA: Recortar a vertical (centro)
            console.log('📐 Procesando imagen cuadrada - recortar a vertical');
            return await cropSquareToVertical(imageBase64, modeConfig.width, modeConfig.height);
            
        case 'horizontal':
            // IMAGEN HORIZONTAL: Recortar a vertical (centro)
            console.log('📏 Procesando imagen horizontal - recortar a vertical');
            return await cropToVertical(imageBase64, modeConfig.width, modeConfig.height);
            
        default:
            return imageBase64;
    }
}

// ===========================
// FUNCIONES DE PROCESAMIENTO ESPECÍFICAS
// ===========================
async function processWithAIExpansion(imageBase64, processType, modeConfig) {
    // Para imágenes verticales en modo catálogo
    // La IA will expandir/fill los espacios faltantes
    const prompt = `Edit this image to expand and fill any missing spaces to create a complete ${modeConfig.width}x${modeConfig.height}px square format. Continue the original image naturally and seamlessly where spaces are needed. Maintain the subject and style of the original image.`;
    
    return await callImageAPI(imageBase64, prompt, modeConfig);
}

async function smartCropToDimensions(imageBase64, targetWidth, targetHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + imageBase64;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // LIMPIAR CANVAS ANTES DE USAR
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set target dimensions
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // LIMPIAR NUEVAMENTE DESPUÉS DE CAMBIAR DIMENSIONES
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const imgWidth = img.width;
            const imgHeight = img.height;
            
            // Calculate scaling and cropping
            const scaleX = targetWidth / imgWidth;
            const scaleY = targetHeight / imgHeight;
            const scale = Math.max(scaleX, scaleY); // Scale to fill completely
            
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            
            // Calculate position to center the image
            const offsetX = (targetWidth - scaledWidth) / 2;
            const offsetY = (targetHeight - scaledHeight) / 2;
            
            // Draw the image scaled and centered
            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
            
            const resultUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // LIMPIAR RECURSOS
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            console.log('✅ Procesamiento completado: ' + targetWidth + 'x' + targetHeight + 'px');
            resolve(resultUrl);
        };
        
        img.onerror = function() {
            console.error('❌ Error cargando imagen para procesamiento');
            resolve(null);
        };
    });
}

async function cropSquareToVertical(imageBase64, targetWidth, targetHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + imageBase64;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // LIMPIAR CANVAS
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // LIMPIAR NUEVAMENTE
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Tomar la parte central de la imagen cuadrada
            const sourceSize = Math.min(img.width, img.height);
            const sourceX = (img.width - sourceSize) / 2;
            const sourceY = (img.height - sourceSize) / 2;
            
            // Escalar y centrar en formato vertical
            const scaleX = targetWidth / sourceSize;
            const scaleY = targetHeight / sourceSize;
            const scale = Math.max(scaleX, scaleY);
            
            const scaledWidth = sourceSize * scale;
            const scaledHeight = sourceSize * scale;
            
            const offsetX = (targetWidth - scaledWidth) / 2;
            const offsetY = (targetHeight - scaledHeight) / 2;
            
            // Draw the cropped image
            ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, offsetX, offsetY, scaledWidth, scaledHeight);
            
            const resultUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // LIMPIAR RECURSOS
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            console.log('✅ Recorte cuadrado a vertical completado');
            resolve(resultUrl);
        };
        
        img.onerror = function() {
            console.error('❌ Error en recorte cuadrado a vertical');
            resolve(null);
        };
    });
}

async function cropToVertical(imageBase64, targetWidth, targetHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + imageBase64;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // LIMPIAR CANVAS
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // LIMPIAR NUEVAMENTE
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Tomar la parte central de la imagen horizontal
            const sourceHeight = img.height;
            const sourceWidth = Math.floor(sourceHeight * (targetWidth / targetHeight));
            const sourceX = Math.floor((img.width - sourceWidth) / 2);
            const sourceY = 0;
            
            // Escalar para llenar completamente el canvas vertical
            const scaleX = targetWidth / sourceWidth;
            const scaleY = targetHeight / sourceHeight;
            const scale = Math.max(scaleX, scaleY);
            
            const scaledWidth = sourceWidth * scale;
            const scaledHeight = sourceHeight * scale;
            
            const offsetX = (targetWidth - scaledWidth) / 2;
            const offsetY = (targetHeight - scaledHeight) / 2;
            
            // Draw the cropped image
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, offsetX, offsetY, scaledWidth, scaledHeight);
            
            const resultUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // LIMPIAR RECURSOS
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            console.log('✅ Recorte a vertical completado');
            resolve(resultUrl);
        };
        
        img.onerror = function() {
            console.error('❌ Error en recorte a vertical');
            resolve(null);
        };
    });
}

// ===========================
// ANÁLISIS DE ORIENTACIÓN
// ===========================
async function analyzeImageOrientation(imageBase64) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + imageBase64;
        
        img.onload = function() {
            const width = img.width;
            const height = img.height;
            const ratio = width / height;
            
            let orientation;
            if (ratio > 1.2) {
                orientation = 'horizontal';
            } else if (ratio < 0.8) {
                orientation = 'vertical';
            } else {
                orientation = 'square';
            }
            
            console.log('📊 Análisis - Ancho: ' + width + ', Alto: ' + height + ', Ratio: ' + ratio.toFixed(2) + ', Orientación: ' + orientation);
            resolve(orientation);
        };
        
        img.onerror = function() {
            console.error('❌ Error analizando orientación');
            resolve('square'); // Fallback
        };
    });
}

// ===========================
// API DE IMAGEN IA
// ===========================
async function callImageAPI(imageBase64, processType, modeConfig) {
    try {
        // Determinar prompt basado en el tipo de procesamiento
        let prompt;
        switch (processType) {
            case 'white_background':
                prompt = 'Remove the background and replace it with a pure white background. Keep the main subject intact.';
                break;
            case 'smile_enhancement':
                prompt = 'Gently enhance the smile and facial expression to look more natural and attractive. Keep the overall appearance realistic.';
                break;
            case 'virtual_tryon':
                prompt = 'Apply virtual try-on effects that look natural and professional. Enhance the overall appearance while maintaining realism.';
                break;
            default:
                prompt = 'Enhance this image to make it more professional and appealing for e-commerce use.';
        }
        
        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: prompt
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: imageBase64
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            }
        };
        
        console.log('🤖 Llamando a API de imagen...');
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
            const parts = result.candidates[0].content.parts;
            
            for (let part of parts) {
                if (part.inline_data && part.inline_data.data) {
                    console.log('✅ Imagen generada exitosamente');
                    return 'data:image/jpeg;base64,' + part.inline_data.data;
                }
            }
        }
        
        throw new Error('No se pudo extraer imagen de la respuesta');
        
    } catch (error) {
        console.error('❌ Error llamando API:', error);
        throw error;
    }
}

// ===========================
// MANEJO DE UPLOAD
// ===========================
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        if (!file.type.startsWith('image/')) {
            showError('Por favor, selecciona una imagen válida');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showError('La imagen es demasiado grande. Máximo 10MB.');
            return;
        }
        
        // Cancelar operaciones en curso
        if (isProcessing) {
            showError('Espere a que termine la operación actual');
            return;
        }
        
        const base64 = await fileToBase64(file);
        base64ImageData = base64;
        
        const dataUrl = 'data:' + file.type + ';base64,' + base64;
        elements.personImage.src = dataUrl;
        elements.personPreview.style.display = 'block';
        elements.originalImage.innerHTML = '<img src="' + dataUrl + '" alt="Imagen original">';
        elements.editedImage.innerHTML = '<p class="placeholder">Selecciona una herramienta para procesar en modo ' + modeConfigs[currentMode].name + '</p>';
        
        enableControls();
        elements.garmentSection.style.display = 'flex';
        
        console.log('✅ Imagen cargada exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar imagen:', error);
        showError('Error al cargar la imagen');
    }
}

function handleDragOver(event) {
    event.preventDefault();
    elements.uploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    elements.uploadArea.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    elements.uploadArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const input = elements.fileInput;
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        
        handleImageUpload({ target: { files: dt.files } });
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function enableControls() {
    elements.btnWhiteBackground.disabled = false;
    elements.btnSmile.disabled = false;
    elements.btnVirtualTryOn.disabled = false;
}

function disableControls() {
    elements.btnWhiteBackground.disabled = true;
    elements.btnSmile.disabled = true;
    elements.btnVirtualTryOn.disabled = true;
    elements.btnDownload.disabled = true;
    elements.btnRetry.disabled = true;
}

function resetEditor() {
    // Cancelar operaciones en curso
    processingQueue = [];
    isProcessing = false;
    
    elements.fileInput.value = '';
    elements.personImage.src = '';
    elements.personPreview.style.display = 'none';
    elements.garmentSection.style.display = 'none';
    elements.originalImage.innerHTML = '<p class="placeholder">Selecciona una imagen para comenzar</p>';
    elements.editedImage.innerHTML = '<p class="placeholder">Procesar imagen en modo ' + modeConfigs[currentMode].name + '</p>';
    
    base64ImageData = null;
    disableControls();
    
    console.log('🔄 Editor reiniciado');
}

async function downloadImage() {
    try {
        const editedImg = elements.editedImage.querySelector('img');
        if (!editedImg) {
            showError('No hay imagen para descargar');
            return;
        }
        
        // Crear link de descarga
        const link = document.createElement('a');
        link.download = `imagen_${modeConfigs[currentMode].name.toLowerCase().replace(' ', '_')}_${Date.now()}.jpg`;
        link.href = editedImg.src;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('💾 Imagen descargada');
        
    } catch (error) {
        console.error('❌ Error descargando imagen:', error);
        showError('Error al descargar la imagen');
    }
}

// ===========================
// UI HELPERS
// ===========================
function showLoader(show) {
    if (show) {
        elements.loader.style.display = 'flex';
    } else {
        elements.loader.style.display = 'none';
    }
}

function showError(message, type = 'error') {
    elements.errorMessage.textContent = message;
    elements.errorMessage.className = type === 'success' ? 'success' : 'error';
    elements.errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            elements.errorMessage.style.display = 'none';
        }, 5000);
    }
    
    console.log(type === 'success' ? '✅' : '❌', message);
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}
