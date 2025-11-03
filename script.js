// ===========================
// EDITOR MULTIMODO - CSP SAFE
// ===========================
// 🎯 Versión compatible con Content Security Policy

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
// INICIALIZACIÓN CSP SAFE
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Editor Multimodo Iniciado (CSP Safe)');
    
    // ✅ OCULTAR MENSAJE DE API KEY AUTOMÁTICAMENTE
    hideApiKeyNotice();
    
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
// OCULTAR MENSAJE DE API KEY
// ===========================
function hideApiKeyNotice() {
    const apiNotice = document.getElementById('apiNotice');
    if (apiNotice) {
        apiNotice.style.display = 'none';
        console.log('✅ Mensaje de API Key ocultado - API configurada');
    }
}

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
    
    const target = insertionTargets.find(function(el) { return el !== null; });
    
    if (!target) {
        console.warn('⚠️ No se encontró elemento objetivo para insertar selector');
        return;
    }
    
    // Crear selector de modo usando createElement para CSP
    createModeSelectorElement(target);
}

// ===========================
// CREAR ELEMENTOS CSP SAFE
// ===========================
function createModeSelectorElement(target) {
    try {
        // Crear el contenedor principal
        const modeSelectorDiv = document.createElement('div');
        modeSelectorDiv.className = 'mode-selector';
        modeSelectorDiv.id = 'mode-selector-section';
        
        // Crear el título
        const title = document.createElement('h3');
        title.textContent = 'Seleccionar Destino';
        modeSelectorDiv.appendChild(title);
        
        // Crear contenedor de botones
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'mode-buttons';
        modeSelectorDiv.appendChild(buttonsContainer);
        
        // Botón Catálogo
        const catalogBtn = document.createElement('button');
        catalogBtn.className = 'mode-btn active';
        catalogBtn.id = 'catalog-mode';
        catalogBtn.addEventListener('click', function() { switchMode('catalog'); });
        
        const catalogIcon = document.createElement('span');
        catalogIcon.className = 'mode-icon';
        catalogIcon.textContent = '🛍️';
        catalogBtn.appendChild(catalogIcon);
        
        const catalogInfo = document.createElement('div');
        catalogInfo.className = 'mode-info';
        
        const catalogName = document.createElement('div');
        catalogName.className = 'mode-name';
        catalogName.textContent = 'Catálogo Web';
        catalogInfo.appendChild(catalogName);
        
        const catalogDim = document.createElement('div');
        catalogDim.className = 'mode-dimensions';
        catalogDim.textContent = '500×500px';
        catalogInfo.appendChild(catalogDim);
        
        catalogBtn.appendChild(catalogInfo);
        buttonsContainer.appendChild(catalogBtn);
        
        // Botón Instagram
        const instagramBtn = document.createElement('button');
        instagramBtn.className = 'mode-btn';
        instagramBtn.id = 'instagram-mode';
        instagramBtn.addEventListener('click', function() { switchMode('instagram'); });
        
        const instagramIcon = document.createElement('span');
        instagramIcon.className = 'mode-icon';
        instagramIcon.textContent = '📱';
        instagramBtn.appendChild(instagramIcon);
        
        const instagramInfo = document.createElement('div');
        instagramInfo.className = 'mode-info';
        
        const instagramName = document.createElement('div');
        instagramName.className = 'mode-name';
        instagramName.textContent = 'Instagram Reel';
        instagramInfo.appendChild(instagramName);
        
        const instagramDim = document.createElement('div');
        instagramDim.className = 'mode-dimensions';
        instagramDim.textContent = '1080×1920px';
        instagramInfo.appendChild(instagramDim);
        
        instagramBtn.appendChild(instagramInfo);
        buttonsContainer.appendChild(instagramBtn);
        
        // Display de modo actual
        const currentModeDiv = document.createElement('div');
        currentModeDiv.className = 'current-mode-display';
        currentModeDiv.id = 'current-mode-display';
        
        const currentIcon = document.createElement('span');
        currentIcon.className = 'mode-icon';
        currentIcon.textContent = '🛍️';
        currentModeDiv.appendChild(currentIcon);
        
        const currentInfo = document.createElement('div');
        currentInfo.className = 'mode-info';
        
        const currentName = document.createElement('div');
        currentName.className = 'mode-name';
        currentName.textContent = 'Catálogo Web';
        currentInfo.appendChild(currentName);
        
        const currentDim = document.createElement('div');
        currentDim.className = 'mode-dimensions';
        currentDim.textContent = '500×500px';
        currentInfo.appendChild(currentDim);
        
        currentModeDiv.appendChild(currentInfo);
        
        // Insertar en el DOM
        if (target.id === 'controls' || target.tagName === 'FIELDSET') {
            target.parentNode.insertBefore(modeSelectorDiv, target);
        } else {
            target.insertBefore(modeSelectorDiv, target.firstChild);
        }
        
        // Actualizar referencias
        elements.catalogMode = document.getElementById('catalog-mode');
        elements.instagramMode = document.getElementById('instagram-mode');
        elements.currentModeDisplay = document.getElementById('current-mode-display');
        
        console.log('✅ Selector de modo creado exitosamente (CSP Safe)');
        
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
        elements.btnWhiteBackground.addEventListener('click', function() { processInMode('white_background'); });
        console.log('✅ btnWhiteBackground listener configurado');
    } else {
        console.warn('⚠️ btnWhiteBackground no encontrado');
    }
    
    if (elements.btnSmile) {
        elements.btnSmile.addEventListener('click', function() { processInMode('smile_enhancement'); });
        console.log('✅ btnSmile listener configurado');
    } else {
        console.warn('⚠️ btnSmile no encontrado');
    }
    
    if (elements.btnVirtualTryOn) {
        elements.btnVirtualTryOn.addEventListener('click', function() { processInMode('virtual_tryon'); });
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
        elements.catalogMode.addEventListener('click', function() { switchMode('catalog'); });
        elements.instagramMode.addEventListener('click', function() { switchMode('instagram'); });
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
    
    var present = 0;
    var missing = 0;
    
    for (var key in elements) {
        if (elements.hasOwnProperty(key) && elements[key]) {
            console.log('✅ ' + key + ': Encontrado');
            present++;
        } else {
            console.log('❌ ' + key + ': NO encontrado');
            missing++;
        }
    }
    
    console.log('\n📈 Resumen: ' + present + ' elementos presentes, ' + missing + ' elementos faltantes');
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
        // Usar textContent en lugar de innerHTML
        var placeholder = document.createElement('p');
        placeholder.className = 'placeholder';
        placeholder.textContent = 'Procesar imagen en modo ' + modeConfigs[mode].name;
        
        elements.editedImage.innerHTML = '';
        elements.editedImage.appendChild(placeholder);
    }
    
    console.log('🔄 Modo cambiado a: ' + modeConfigs[mode].name);
}

function initializeMode() {
    switchMode('catalog');
}

function updateModeDisplay() {
    var config = modeConfigs[currentMode];
    
    if (elements.currentModeDisplay) {
        // Actualizar usando textContent en lugar de innerHTML
        elements.currentModeDisplay.textContent = '';
        
        var iconSpan = document.createElement('span');
        iconSpan.className = 'mode-icon';
        iconSpan.textContent = config.icon;
        
        var infoDiv = document.createElement('div');
        infoDiv.className = 'mode-info';
        
        var nameDiv = document.createElement('div');
        nameDiv.className = 'mode-name';
        nameDiv.textContent = config.name;
        
        var dimDiv = document.createElement('div');
        dimDiv.className = 'mode-dimensions';
        dimDiv.textContent = config.width + '×' + config.height + 'px';
        
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(dimDiv);
        
        elements.currentModeDisplay.appendChild(iconSpan);
        elements.currentModeDisplay.appendChild(infoDiv);
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
function processInMode(processType) {
    if (!base64ImageData) {
        showError('Por favor, sube una imagen primero');
        return;
    }
    
    if (isProcessing) {
        showError('Espere a que termine la operación actual');
        return;
    }
    
    var task = { type: processType, timestamp: Date.now() };
    processingQueue.push(task);
    
    processQueue();
}

function processQueue() {
    if (isProcessing || processingQueue.length === 0) {
        return;
    }
    
    isProcessing = true;
    var task = processingQueue.shift();
    
    try {
        console.log('🎯 Procesando: ' + task.type + ' en modo ' + modeConfigs[currentMode].name);
        
        var modeConfig = modeConfigs[currentMode];
        processImageWithQueue(base64ImageData, task.type, modeConfig, function(processedData) {
            if (processedData && elements.editedImage) {
                // Mostrar imagen procesada usando createElement
                elements.editedImage.innerHTML = '';
                var img = document.createElement('img');
                img.src = processedData;
                img.alt = 'Imagen procesada';
                elements.editedImage.appendChild(img);
                
                if (elements.btnDownload) elements.btnDownload.disabled = false;
                if (elements.btnRetry) elements.btnRetry.disabled = false;
                
                showError('✅ Procesamiento completado en modo ' + modeConfig.name, 'success');
                console.log('✅ Procesamiento completado');
            } else {
                showError('Error en el procesamiento');
            }
        });
        
    } catch (error) {
        console.error('❌ Error en procesamiento:', error);
        showError('Error: ' + error.message);
    } finally {
        isProcessing = false;
        
        if (processingQueue.length > 0) {
            setTimeout(function() {
                processQueue();
            }, 100);
        }
    }
}

// ===========================
// PROCESAMIENTO DE IMAGEN CSP SAFE
// ===========================
function processImageWithQueue(imageBase64, processType, modeConfig, callback) {
    try {
        analyzeImageOrientation(imageBase64, function(orientation) {
            console.log('📊 Orientación: ' + orientation);
            
            if (modeConfig.strategy === 'expansion') {
                processCatalogMode(imageBase64, orientation, processType, function(processedImage) {
                    if (processType !== 'dimensions_only') {
                        callImageAPI(processedImage, processType, modeConfig, function(resultImage) {
                            callback(resultImage);
                        });
                    } else {
                        callback(processedImage);
                    }
                });
            } else {
                processInstagramMode(imageBase64, orientation, processType, function(processedImage) {
                    if (processType !== 'dimensions_only') {
                        callImageAPI(processedImage, processType, modeConfig, function(resultImage) {
                            callback(resultImage);
                        });
                    } else {
                        callback(processedImage);
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Error en procesamiento con cola:', error);
        callback(null);
    }
}

// ===========================
// LÓGICA POR MODO
// ===========================
function processCatalogMode(imageBase64, orientation, processType, callback) {
    var modeConfig = modeConfigs.catalog;
    
    switch (orientation) {
        case 'vertical':
            console.log('📏 Procesando imagen vertical - expandir con IA');
            processWithAIExpansion(imageBase64, processType, modeConfig, callback);
            break;
            
        case 'square':
            console.log('📐 Procesando imagen cuadrada - mantener');
            callback(imageBase64);
            break;
            
        case 'horizontal':
            console.log('📏 Procesando imagen horizontal - centrar');
            smartCropToDimensions(imageBase64, modeConfig.width, modeConfig.height, callback);
            break;
            
        default:
            callback(imageBase64);
    }
}

function processInstagramMode(imageBase64, orientation, processType, callback) {
    var modeConfig = modeConfigs.instagram;
    
    switch (orientation) {
        case 'vertical':
            console.log('📏 Procesando imagen vertical - mantener');
            callback(imageBase64);
            break;
            
        case 'square':
            console.log('📐 Procesando imagen cuadrada - recortar a vertical');
            cropSquareToVertical(imageBase64, modeConfig.width, modeConfig.height, callback);
            break;
            
        case 'horizontal':
            console.log('📏 Procesando imagen horizontal - recortar a vertical');
            cropToVertical(imageBase64, modeConfig.width, modeConfig.height, callback);
            break;
            
        default:
            callback(imageBase64);
    }
}

// ===========================
// FUNCIONES DE PROCESAMIENTO
// ===========================
function processWithAIExpansion(imageBase64, processType, modeConfig, callback) {
    var prompt = 'Edit this image to expand and fill any missing spaces to create a complete ' + modeConfig.width + 'x' + modeConfig.height + 'px square format. Continue the original image naturally and seamlessly where spaces are needed. Maintain the subject and style of the original image.';
    
    callImageAPI(imageBase64, prompt, modeConfig, callback);
}

function smartCropToDimensions(imageBase64, targetWidth, targetHeight, callback) {
    var img = new Image();
    img.src = 'data:image/jpeg;base64,' + imageBase64;
    
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        var imgWidth = img.width;
        var imgHeight = img.height;
        var scaleX = targetWidth / imgWidth;
        var scaleY = targetHeight / imgHeight;
        var scale = Math.max(scaleX, scaleY);
        
        var scaledWidth = imgWidth * scale;
        var scaledHeight = imgHeight * scale;
        var offsetX = (targetWidth - scaledWidth) / 2;
        var offsetY = (targetHeight - scaledHeight) / 2;
        
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        
        var resultUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        console.log('✅ Procesamiento completado: ' + targetWidth + 'x' + targetHeight + 'px');
        callback(resultUrl);
    };
    
    img.onerror = function() {
        console.error('❌ Error cargando imagen para procesamiento');
        callback(null);
    };
}

function cropSquareToVertical(imageBase64, targetWidth, targetHeight, callback) {
    var img = new Image();
    img.src = 'data:image/jpeg;base64,' + imageBase64;
    
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        var sourceSize = Math.min(img.width, img.height);
        var sourceX = (img.width - sourceSize) / 2;
        var sourceY = (img.height - sourceSize) / 2;
        
        var scaleX = targetWidth / sourceSize;
        var scaleY = targetHeight / sourceSize;
        var scale = Math.max(scaleX, scaleY);
        
        var scaledWidth = sourceSize * scale;
        var scaledHeight = sourceSize * scale;
        var offsetX = (targetWidth - scaledWidth) / 2;
        var offsetY = (targetHeight - scaledHeight) / 2;
        
        ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, offsetX, offsetY, scaledWidth, scaledHeight);
        
        var resultUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        console.log('✅ Recorte cuadrado a vertical completado');
        callback(resultUrl);
    };
    
    img.onerror = function() {
        console.error('❌ Error en recorte cuadrado a vertical');
        callback(null);
    };
}

function cropToVertical(imageBase64, targetWidth, targetHeight, callback) {
    var img = new Image();
    img.src = 'data:image/jpeg;base64,' + imageBase64;
    
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        var sourceHeight = img.height;
        var sourceWidth = Math.floor(sourceHeight * (targetWidth / targetHeight));
        var sourceX = Math.floor((img.width - sourceWidth) / 2);
        var sourceY = 0;
        
        var scaleX = targetWidth / sourceWidth;
        var scaleY = targetHeight / sourceHeight;
        var scale = Math.max(scaleX, scaleY);
        
        var scaledWidth = sourceWidth * scale;
        var scaledHeight = sourceHeight * scale;
        var offsetX = (targetWidth - scaledWidth) / 2;
        var offsetY = (targetHeight - scaledHeight) / 2;
        
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, offsetX, offsetY, scaledWidth, scaledHeight);
        
        var resultUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        console.log('✅ Recorte a vertical completado');
        callback(resultUrl);
    };
    
    img.onerror = function() {
        console.error('❌ Error en recorte a vertical');
        callback(null);
    };
}

// ===========================
// ANÁLISIS DE ORIENTACIÓN
// ===========================
function analyzeImageOrientation(imageBase64, callback) {
    var img = new Image();
    img.src = 'data:image/jpeg;base64,' + imageBase64;
    
    img.onload = function() {
        var width = img.width;
        var height = img.height;
        var ratio = width / height;
        
        var orientation;
        if (ratio > 1.2) {
            orientation = 'horizontal';
        } else if (ratio < 0.8) {
            orientation = 'vertical';
        } else {
            orientation = 'square';
        }
        
        console.log('📊 Análisis - Ancho: ' + width + ', Alto: ' + height + ', Ratio: ' + ratio.toFixed(2) + ', Orientación: ' + orientation);
        callback(orientation);
    };
    
    img.onerror = function() {
        console.error('❌ Error analizando orientación');
        callback('square');
    };
}

// ===========================
// API DE IMAGEN IA
// ===========================
function callImageAPI(imageBase64, processType, modeConfig, callback) {
    try {
        var prompt;
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
        
        var requestBody = {
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
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_ENDPOINT, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    
                    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
                        var parts = result.candidates[0].content.parts;
                        
                        for (var i = 0; i < parts.length; i++) {
                            if (parts[i].inline_data && parts[i].inline_data.data) {
                                console.log('✅ Imagen generada exitosamente');
                                callback('data:image/jpeg;base64,' + parts[i].inline_data.data);
                                return;
                            }
                        }
                    }
                    
                    throw new Error('No se pudo extraer imagen de la respuesta');
                    
                } catch (parseError) {
                    console.error('❌ Error parseando respuesta:', parseError);
                    callback(null);
                }
            } else {
                console.error('❌ Error HTTP:', xhr.status);
                callback(null);
            }
        };
        
        xhr.onerror = function() {
            console.error('❌ Error de red');
            callback(null);
        };
        
        xhr.send(JSON.stringify(requestBody));
        
    } catch (error) {
        console.error('❌ Error llamando API:', error);
        callback(null);
    }
}

// ===========================
// MANEJO DE UPLOAD
// ===========================
function handleImageUpload(event) {
    var file = event.target.files[0];
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
        
        fileToBase64(file, function(base64) {
            base64ImageData = base64;
            
            var dataUrl = 'data:' + file.type + ';base64,' + base64;
            
            if (elements.personImage) {
                elements.personImage.src = dataUrl;
            }
            if (elements.personPreview) {
                elements.personPreview.style.display = 'block';
            }
            if (elements.originalImage) {
                elements.originalImage.innerHTML = '';
                var img = document.createElement('img');
                img.src = dataUrl;
                img.alt = 'Imagen original';
                elements.originalImage.appendChild(img);
            }
            if (elements.editedImage) {
                elements.editedImage.innerHTML = '';
                var placeholder = document.createElement('p');
                placeholder.className = 'placeholder';
                placeholder.textContent = 'Selecciona una herramienta para procesar en modo ' + modeConfigs[currentMode].name;
                elements.editedImage.appendChild(placeholder);
            }
            
            // Habilitar controles inmediatamente (sin delay para evitar CSP)
            enableControls();
            if (elements.garmentSection) {
                elements.garmentSection.style.display = 'flex';
            }
            
            console.log('✅ Imagen cargada exitosamente');
        });
        
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
    
    var files = event.dataTransfer.files;
    if (files.length > 0 && elements.fileInput) {
        var file = files[0];
        var dt = new DataTransfer();
        dt.items.add(file);
        elements.fileInput.files = dt.files;
        
        handleImageUpload({ target: { files: dt.files } });
    }
}

function fileToBase64(file, callback) {
    var reader = new FileReader();
    reader.onload = function() {
        var result = reader.result;
        var base64 = result.split(',')[1];
        callback(base64);
    };
    reader.onerror = function() {
        console.error('Error leyendo archivo');
        callback(null);
    };
    reader.readAsDataURL(file);
}

// ===========================
// HABILITAR DESHABILITAR CONTROLES
// ===========================
function enableControls() {
    console.log('🔓 Habilitando controles...');
    
    // Habilitar botones principales
    if (elements.btnWhiteBackground) {
        elements.btnWhiteBackground.disabled = false;
        elements.btnWhiteBackground.style.opacity = '1';
        console.log('✅ btnWhiteBackground habilitado');
    }
    
    if (elements.btnSmile) {
        elements.btnSmile.disabled = false;
        elements.btnSmile.style.opacity = '1';
        console.log('✅ btnSmile habilitado');
    }
    
    if (elements.btnVirtualTryOn) {
        elements.btnVirtualTryOn.disabled = false;
        elements.btnVirtualTryOn.style.opacity = '1';
        console.log('✅ btnVirtualTryOn habilitado');
    }
    
    // ✅ HABILITAR BOTÓN VERDE DE DESCARGA - MÚLTIPLES ESTRATEGIAS
    var allButtons = document.querySelectorAll('button');
    for (var i = 0; i < allButtons.length; i++) {
        var btn = allButtons[i];
        var style = window.getComputedStyle(btn);
        var bgColor = style.backgroundColor;
        var color = style.color;
        var textContent = btn.textContent || btn.innerText || '';
        
        // Si tiene color verde o contiene "descargar" en el texto
        if ((bgColor && (bgColor.indexOf('rgb(40, 167, 69') !== -1 || bgColor.indexOf('rgb(34, 197, 94') !== -1)) ||
            (color && (color.indexOf('rgb(40, 167, 69') !== -1 || color.indexOf('rgb(34, 197, 94') !== -1)) ||
            (textContent && (textContent.toLowerCase().indexOf('descargar') !== -1 || 
                           textContent.toLowerCase().indexOf('download') !== -1 ||
                           textContent.toLowerCase().indexOf('guardar') !== -1 ||
                           textContent.toLowerCase().indexOf('save') !== -1))) {
            
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = '#28a745'; // Verde forzado
            btn.style.color = 'white';
            console.log('✅ Botón verde encontrado y habilitado:', textContent);
        }
    }
    
    // También habilitar elementos.btnDownload si existe
    if (elements.btnDownload) {
        elements.btnDownload.disabled = false;
        elements.btnDownload.style.opacity = '1';
        elements.btnDownload.style.backgroundColor = '#28a745'; // Verde forzado
        elements.btnDownload.style.cursor = 'pointer';
        console.log('✅ btnDownload habilitado');
    }
    
    if (elements.btnRetry) {
        elements.btnRetry.disabled = false;
        elements.btnRetry.style.opacity = '1';
        console.log('✅ btnRetry habilitado');
    }
    
    console.log('🎯 Controles habilitados completados - ¡Botón verde listo para usar!');
}

function disableControls() {
    console.log('🔒 Deshabilitando controles...');
    
    if (elements.btnWhiteBackground) {
        elements.btnWhiteBackground.disabled = true;
        elements.btnWhiteBackground.style.opacity = '0.5';
    }
    if (elements.btnSmile) {
        elements.btnSmile.disabled = true;
        elements.btnSmile.style.opacity = '0.5';
    }
    if (elements.btnVirtualTryOn) {
        elements.btnVirtualTryOn.disabled = true;
        elements.btnVirtualTryOn.style.opacity = '0.5';
    }
    if (elements.btnDownload) {
        elements.btnDownload.disabled = true;
        elements.btnDownload.style.opacity = '0.5';
    }
    if (elements.btnRetry) {
        elements.btnRetry.disabled = true;
        elements.btnRetry.style.opacity = '0.5';
    }
    
    console.log('🎯 Controles deshabilitados completados');
}

function resetEditor() {
    processingQueue = [];
    isProcessing = false;
    
    if (elements.fileInput) elements.fileInput.value = '';
    if (elements.personImage) elements.personImage.src = '';
    if (elements.personPreview) elements.personPreview.style.display = 'none';
    if (elements.garmentSection) elements.garmentSection.style.display = 'none';
    if (elements.originalImage) {
        elements.originalImage.innerHTML = '';
        var placeholder1 = document.createElement('p');
        placeholder1.className = 'placeholder';
        placeholder1.textContent = 'Selecciona una imagen para comenzar';
        elements.originalImage.appendChild(placeholder1);
    }
    if (elements.editedImage) {
        elements.editedImage.innerHTML = '';
        var placeholder2 = document.createElement('p');
        placeholder2.className = 'placeholder';
        placeholder2.textContent = 'Procesar imagen en modo ' + modeConfigs[currentMode].name;
        elements.editedImage.appendChild(placeholder2);
    }
    
    base64ImageData = null;
    disableControls();
    
    console.log('🔄 Editor reiniciado');
}

function downloadImage() {
    try {
        if (!elements.editedImage) return;
        
        var editedImg = elements.editedImage.querySelector('img');
        if (!editedImg) {
            showError('No hay imagen para descargar');
            return;
        }
        
        var link = document.createElement('a');
        link.download = 'imagen_' + modeConfigs[currentMode].name.toLowerCase().replace(' ', '_') + '_' + Date.now() + '.jpg';
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

function showError(message, type) {
    type = type || 'error';
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.className = type === 'success' ? 'success' : 'error';
        elements.errorMessage.style.display = 'block';
        
        if (type === 'success') {
            // Usar setTimeout con función para evitar problemas de CSP
            setTimeout(function() {
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
