// ===========================
// EDITOR MULTIMODO - ULTRA ROBUSTO
// ===========================
// 🎯 Versión ultra robusta con validación completa de elementos

// Configuración
const API_KEY = 'AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`;

// Estados
let currentMode = 'catalog';
let base64ImageData = null;
let processingQueue = [];
let isProcessing = false;

// Configuraciones por modo
const modeConfigs = {
    catalog: {
        name: 'Catálogo Web',
        width: 500,
        height: 500,
        icon: '🛍️',
        strategy: 'expansion'
    },
    instagram: {
        name: 'Instagram Reel',
        width: 1080,
        height: 1920,
        icon: '📱',
        strategy: 'cropping'
    }
};

// Elementos DOM - CON VALIDACIÓN EXTREMA
const elements = {
    fileInput: null,
    uploadArea: null,
    personImage: null,
    personPreview: null,
    garmentSection: null,
    originalImage: null,
    editedImage: null,
    btnDownload: null,
    btnRetry: null,
    btnVirtualTryOn: null,
    btnWhiteBackground: null,
    btnSmile: null,
    catalogMode: null,
    instagramMode: null,
    currentModeDisplay: null,
    loader: null,
    errorMessage: null
};

// ===========================
// INICIALIZACIÓN ULTRA ROBUSTA
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Editor Multimodo Iniciado (Ultra Robusto)');
    
    // Validar todos los elementos primero
    initializeElements();
    
    // Crear selector de modo con múltiples estrategias
    createModeSelectorUltraRobust();
    
    // Configurar event listeners solo si los elementos existen
    setupEventListenersSafe();
    
    // Configurar modo selector solo si existe
    setupModeSelectorSafe();
    
    initializeMode();
    
    // Log del estado final
    logFinalStatus();
});

// ===========================
// INICIALIZACIÓN DE ELEMENTOS
// ===========================
function initializeElements() {
    // IDs CORREGIDOS con múltiples estrategias
    elements.fileInput = document.getElementById('imageUpload') || 
                         document.querySelector('input[type="file"][id*="image"]') ||
                         document.querySelector('input[type="file"]');
    
    elements.uploadArea = document.getElementById('personUploadArea') ||
                          document.querySelector('#personUploadArea') ||
                          document.querySelector('.upload-area');
    
    elements.personImage = document.getElementById('personImage');
    elements.personPreview = document.getElementById('personPreview');
    elements.garmentSection = document.getElementById('garmentSection');
    
    elements.originalImage = document.getElementById('originalImage') ||
                            document.querySelector('#originalImage') ||
                            document.querySelector('.image-display.original');
    
    elements.editedImage = document.getElementById('editedImage') ||
                          document.querySelector('#editedImage') ||
                          document.querySelector('.image-display.edited');
    
    elements.btnDownload = document.getElementById('btn-download') ||
                          document.querySelector('#btn-download') ||
                          document.querySelector('button[id*="download"]');
    
    elements.btnRetry = document.getElementById('btn-retry') ||
                       document.querySelector('#btn-retry') ||
                       document.querySelector('button[id*="retry"]');
    
    elements.btnVirtualTryOn = document.getElementById('btn-virtual-try-on') ||
                              document.querySelector('#btn-virtual-try-on') ||
                              document.querySelector('button[id*="virtual"]');
    
    elements.btnWhiteBackground = document.getElementById('btn-white-bg') ||
                                 document.querySelector('#btn-white-bg') ||
                                 document.querySelector('button[id*="white"]');
    
    elements.btnSmile = document.getElementById('btn-smile') ||
                       document.querySelector('#btn-smile') ||
                       document.querySelector('button[id*="smile"]');
    
    elements.catalogMode = document.getElementById('catalog-mode');
    elements.instagramMode = document.getElementById('instagram-mode');
    elements.currentModeDisplay = document.getElementById('current-mode-display');
    
    elements.loader = document.getElementById('loader');
    elements.errorMessage = document.getElementById('apiNotice') || document.getElementById('errorMessage');
}

// ===========================
// CREAR SELECTOR ULTRA ROBUSTO
// ===========================
function createModeSelectorUltraRobust() {
    // Si ya existe, no crear de nuevo
    if (elements.catalogMode && elements.instagramMode) {
        console.log('✅ Selector de modo ya existe');
        return;
    }
    
    // Múltiples estrategias para encontrar dónde insertar
    const insertionTargets = [
        document.getElementById('controls'),
        document.querySelector('#controls'),
        document.querySelector('.panel'),
        document.querySelector('.tools-panel'),
        document.querySelector('.upload-panel'),
        document.querySelector('fieldset'),
        document.querySelector('.panel.tools-panel'),
        document.querySelector('.preview-section'),
        document.querySelector('.main-content'),
        document.querySelector('.container'),
        document.body  // Último recurso: body
    ];
    
    const target = insertionTargets.find(el => el !== null);
    
    if (!target) {
        console.warn('⚠️ No se encontró elemento objetivo para insertar selector');
        return;
    }
    
    // Crear selector de modo
    const modeSelectorHTML = `
        <div class="mode-selector" id="mode-selector-section">
            <h3>Seleccionar Destino</h3>
            <div class="mode-buttons">
                <button class="mode-btn active" id="catalog-mode">
                    <span class="mode-icon">🛍️</span>
                    <div class="mode-info">
                        <div class="mode-name">Catálogo Web</div>
                        <div class="mode-dimensions">500×500px</div>
                    </div>
                </button>
                <button class="mode-btn" id="instagram-mode">
                    <span class="mode-icon">📱</span>
                    <div class="mode-info">
                        <div class="mode-name">Instagram Reel</div>
                        <div class="mode-dimensions">1080×1920px</div>
                    </div>
                </button>
            </div>
            <div class="current-mode-display" id="current-mode-display">
                <span class="mode-icon">🛍️</span>
                <div class="mode-info">
                    <div class="mode-name">Catálogo Web</div>
                    <div class="mode-dimensions">500×500px</div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar de forma segura
    try {
        if (target.id === 'controls' || target.tagName === 'FIELDSET') {
            target.insertAdjacentHTML('beforebegin', modeSelectorHTML);
        } else {
            target.insertAdjacentHTML('afterbegin', modeSelectorHTML);
        }
        
        // Actualizar referencias
        elements.catalogMode = document.getElementById('catalog-mode');
        elements.instagramMode = document.getElementById('instagram-mode');
        elements.currentModeDisplay = document.getElementById('current-mode-display');
        
        console.log('✅ Selector de modo creado exitosamente');
        
    } catch (error) {
        console.error('❌ Error creando selector de modo:', error);
    }
}

// ===========================
// EVENT LISTENERS SEGUROS
// ===========================
function setupEventListenersSafe() {
    console.log('🔧 Configurando event listeners...');
    
    // Upload handlers con validación
    if (elements.fileInput) {
        elements.fileInput.addEventListener('change', handleImageUpload);
        console.log('✅ fileInput listener configurado');
    } else {
        console.warn('⚠️ fileInput no encontrado');
    }
    
    if (elements.uploadArea) {
        elements.uploadArea.addEventListener('dragover', handleDragOver);
        elements.uploadArea.addEventListener('dragleave', handleDragLeave);
        elements.uploadArea.addEventListener('drop', handleDrop);
        console.log('✅ uploadArea listeners configurados');
    } else {
        console.warn('⚠️ uploadArea no encontrado');
    }
    
    // Tool handlers con validación
    if (elements.btnWhiteBackground) {
        elements.btnWhiteBackground.addEventListener('click', () => processInMode('white_background'));
        console.log('✅ btnWhiteBackground listener configurado');
    } else {
        console.warn('⚠️ btnWhiteBackground no encontrado');
    }
    
    if (elements.btnSmile) {
        elements.btnSmile.addEventListener('click', () => processInMode('smile_enhancement'));
        console.log('✅ btnSmile listener configurado');
    } else {
        console.warn('⚠️ btnSmile no encontrado');
    }
    
    if (elements.btnVirtualTryOn) {
        elements.btnVirtualTryOn.addEventListener('click', () => processInMode('virtual_tryon'));
        console.log('✅ btnVirtualTryOn listener configurado');
    } else {
        console.warn('⚠️ btnVirtualTryOn no encontrado');
    }
    
    if (elements.btnDownload) {
        elements.btnDownload.addEventListener('click', downloadImage);
        console.log('✅ btnDownload listener configurado');
    } else {
        console.warn('⚠️ btnDownload no encontrado');
    }
    
    if (elements.btnRetry) {
        elements.btnRetry.addEventListener('click', resetEditor);
        console.log('✅ btnRetry listener configurado');
    } else {
        console.warn('⚠️ btnRetry no encontrado');
    }
    
    console.log('✅ Event listeners básicos configurados');
}

// ===========================
// MODO SELECTOR SEGURO
// ===========================
function setupModeSelectorSafe() {
    if (!elements.catalogMode) {
        console.warn('⚠️ catalogMode no encontrado para configurar listener');
        return;
    }
    
    if (!elements.instagramMode) {
        console.warn('⚠️ instagramMode no encontrado para configurar listener');
        return;
    }
    
    try {
        elements.catalogMode.addEventListener('click', () => switchMode('catalog'));
        elements.instagramMode.addEventListener('click', () => switchMode('instagram'));
        console.log('✅ Modo selector listeners configurados');
    } catch (error) {
        console.error('❌ Error configurando modo selector:', error);
    }
}

// ===========================
// LOG DE ESTADO FINAL
// ===========================
function logFinalStatus() {
    console.log('\n📊 === REPORTE FINAL DE ELEMENTOS ===');
    
    let present = 0;
    let missing = 0;
    
    for (const [key, element] of Object.entries(elements)) {
        if (element) {
            console.log(`✅ ${key}: Encontrado`);
            present++;
        } else {
            console.log(`❌ ${key}: NO encontrado`);
            missing++;
        }
    }
    
    console.log(`\n📈 Resumen: ${present} elementos presentes, ${missing} elementos faltantes`);
    console.log('=====================================\n');
}

// ===========================
// MODO SELECTOR
// ===========================
function switchMode(mode) {
    if (currentMode === mode) return;
    
    if (isProcessing) {
        showError('Espere a que termine la operación actual antes de cambiar el modo');
        return;
    }
    
    currentMode = mode;
    updateModeDisplay();
    
    if (base64ImageData && elements.editedImage) {
        elements.editedImage.innerHTML = '<p class="placeholder">Procesar imagen en modo ' + modeConfigs[mode].name + '</p>';
    }
    
    console.log('🔄 Modo cambiado a: ' + modeConfigs[mode].name);
}

function initializeMode() {
    switchMode('catalog');
}

function updateModeDisplay() {
    const config = modeConfigs[currentMode];
    
    if (elements.currentModeDisplay) {
        elements.currentModeDisplay.innerHTML = `
            <span class="mode-icon">${config.icon}</span>
            <div class="mode-info">
                <div class="mode-name">${config.name}</div>
                <div class="mode-dimensions">${config.width}×${config.height}px</div>
            </div>
        `;
    }
    
    // Actualizar botones
    if (elements.catalogMode && elements.instagramMode) {
        elements.catalogMode.classList.remove('active');
        elements.instagramMode.classList.remove('active');
        
        if (currentMode === 'catalog') {
            elements.catalogMode.classList.add('active');
        } else {
            elements.instagramMode.classList.add('active');
        }
    }
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
        
        const modeConfig = modeConfigs[currentMode];
        const processedData = await processImageWithQueue(base64ImageData, task.type, modeConfig);
        
        if (processedData && elements.editedImage) {
            elements.editedImage.innerHTML = '<img src="' + processedData + '" alt="Imagen procesada">';
            
            if (elements.btnDownload) elements.btnDownload.disabled = false;
            if (elements.btnRetry) elements.btnRetry.disabled = false;
            
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
            const orientation = await analyzeImageOrientation(imageBase64);
            console.log('📊 Orientación: ' + orientation);
            
            let processedImage;
            
            if (modeConfig.strategy === 'expansion') {
                processedImage = await processCatalogMode(imageBase64, orientation, processType);
            } else {
                processedImage = await processInstagramMode(imageBase64, orientation, processType);
            }
            
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
            console.log('📏 Procesando imagen vertical - expandir con IA');
            return await processWithAIExpansion(imageBase64, processType, modeConfig);
            
        case 'square':
            console.log('📐 Procesando imagen cuadrada - mantener');
            return imageBase64;
            
        case 'horizontal':
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
            console.log('📏 Procesando imagen vertical - mantener');
            return imageBase64;
            
        case 'square':
            console.log('📐 Procesando imagen cuadrada - recortar a vertical');
            return await cropSquareToVertical(imageBase64, modeConfig.width, modeConfig.height);
            
        case 'horizontal':
            console.log('📏 Procesando imagen horizontal - recortar a vertical');
            return await cropToVertical(imageBase64, modeConfig.width, modeConfig.height);
            
        default:
            return imageBase64;
    }
}

// ===========================
// FUNCIONES DE PROCESAMIENTO
// ===========================
async function processWithAIExpansion(imageBase64, processType, modeConfig) {
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
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const imgWidth = img.width;
            const imgHeight = img.height;
            const scaleX = targetWidth / imgWidth;
            const scaleY = targetHeight / imgHeight;
            const scale = Math.max(scaleX, scaleY);
            
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            const offsetX = (targetWidth - scaledWidth) / 2;
            const offsetY = (targetHeight - scaledHeight) / 2;
            
            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
            
            const resultUrl = canvas.toDataURL('image/jpeg', 0.9);
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
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const sourceSize = Math.min(img.width, img.height);
            const sourceX = (img.width - sourceSize) / 2;
            const sourceY = (img.height - sourceSize) / 2;
            
            const scaleX = targetWidth / sourceSize;
            const scaleY = targetHeight / sourceSize;
            const scale = Math.max(scaleX, scaleY);
            
            const scaledWidth = sourceSize * scale;
            const scaledHeight = sourceSize * scale;
            const offsetX = (targetWidth - scaledWidth) / 2;
            const offsetY = (targetHeight - scaledHeight) / 2;
            
            ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, offsetX, offsetY, scaledWidth, scaledHeight);
            
            const resultUrl = canvas.toDataURL('image/jpeg', 0.9);
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
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const sourceHeight = img.height;
            const sourceWidth = Math.floor(sourceHeight * (targetWidth / targetHeight));
            const sourceX = Math.floor((img.width - sourceWidth) / 2);
            const sourceY = 0;
            
            const scaleX = targetWidth / sourceWidth;
            const scaleY = targetHeight / sourceHeight;
            const scale = Math.max(scaleX, scaleY);
            
            const scaledWidth = sourceWidth * scale;
            const scaledHeight = sourceHeight * scale;
            const offsetX = (targetWidth - scaledWidth) / 2;
            const offsetY = (targetHeight - scaledHeight) / 2;
            
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, offsetX, offsetY, scaledWidth, scaledHeight);
            
            const resultUrl = canvas.toDataURL('image/jpeg', 0.9);
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
            resolve('square');
        };
    });
}

// ===========================
// API DE IMAGEN IA
// ===========================
async function callImageAPI(imageBase64, processType, modeConfig) {
    try {
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
        
        if (isProcessing) {
            showError('Espere a que termine la operación actual');
            return;
        }
        
        const base64 = await fileToBase64(file);
        base64ImageData = base64;
        
        const dataUrl = 'data:' + file.type + ';base64,' + base64;
        
        if (elements.personImage) {
            elements.personImage.src = dataUrl;
        }
        if (elements.personPreview) {
            elements.personPreview.style.display = 'block';
        }
        if (elements.originalImage) {
            elements.originalImage.innerHTML = '<img src="' + dataUrl + '" alt="Imagen original">';
        }
        if (elements.editedImage) {
            elements.editedImage.innerHTML = '<p class="placeholder">Selecciona una herramienta para procesar en modo ' + modeConfigs[currentMode].name + '</p>';
        }
        
        enableControls();
        if (elements.garmentSection) {
            elements.garmentSection.style.display = 'flex';
        }
        
        console.log('✅ Imagen cargada exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar imagen:', error);
        showError('Error al cargar la imagen');
    }
}

function handleDragOver(event) {
    event.preventDefault();
    if (elements.uploadArea) {
        elements.uploadArea.classList.add('drag-over');
    }
}

function handleDragLeave(event) {
    event.preventDefault();
    if (elements.uploadArea) {
        elements.uploadArea.classList.remove('drag-over');
    }
}

function handleDrop(event) {
    event.preventDefault();
    if (elements.uploadArea) {
        elements.uploadArea.classList.remove('drag-over');
    }
    
    const files = event.dataTransfer.files;
    if (files.length > 0 && elements.fileInput) {
        const file = files[0];
        const dt = new DataTransfer();
        dt.items.add(file);
        elements.fileInput.files = dt.files;
        
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
    if (elements.btnWhiteBackground) elements.btnWhiteBackground.disabled = false;
    if (elements.btnSmile) elements.btnSmile.disabled = false;
    if (elements.btnVirtualTryOn) elements.btnVirtualTryOn.disabled = false;
}

function disableControls() {
    if (elements.btnWhiteBackground) elements.btnWhiteBackground.disabled = true;
    if (elements.btnSmile) elements.btnSmile.disabled = true;
    if (elements.btnVirtualTryOn) elements.btnVirtualTryOn.disabled = true;
    if (elements.btnDownload) elements.btnDownload.disabled = true;
    if (elements.btnRetry) elements.btnRetry.disabled = true;
}

function resetEditor() {
    processingQueue = [];
    isProcessing = false;
    
    if (elements.fileInput) elements.fileInput.value = '';
    if (elements.personImage) elements.personImage.src = '';
    if (elements.personPreview) elements.personPreview.style.display = 'none';
    if (elements.garmentSection) elements.garmentSection.style.display = 'none';
    if (elements.originalImage) {
        elements.originalImage.innerHTML = '<p class="placeholder">Selecciona una imagen para comenzar</p>';
    }
    if (elements.editedImage) {
        elements.editedImage.innerHTML = '<p class="placeholder">Procesar imagen en modo ' + modeConfigs[currentMode].name + '</p>';
    }
    
    base64ImageData = null;
    disableControls();
    
    console.log('🔄 Editor reiniciado');
}

async function downloadImage() {
    try {
        if (!elements.editedImage) return;
        
        const editedImg = elements.editedImage.querySelector('img');
        if (!editedImg) {
            showError('No hay imagen para descargar');
            return;
        }
        
        const link = document.createElement('a');
        link.download = `imagen_${modeConfigs[currentMode].name.toLowerCase().replace(' ', '_')}_${Date.now()}.jpg`;
        link.href = editedImg.src;
        
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
    if (elements.loader) {
        elements.loader.style.display = show ? 'flex' : 'none';
    }
}

function showError(message, type = 'error') {
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.className = type === 'success' ? 'success' : 'error';
        elements.errorMessage.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    console.log(type === 'success' ? '✅' : '❌', message);
}

function hideError() {
    if (elements.errorMessage) {
        elements.errorMessage.style.display = 'none';
    }
}
