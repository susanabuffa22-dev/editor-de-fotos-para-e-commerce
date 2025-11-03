// ===========================
// EDITOR MULTIMODO: CATÁLOGO + INSTAGRAM REEL
// Sistema inteligente de procesamiento según destino
// ===========================

// Configuration
const CONFIG = {
    API_KEY: "AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I",
    API_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent"
};

// Modes Configuration
const MODES = {
    CATALOG: {
        name: 'Catálogo Web',
        width: 500,
        height: 500,
        description: 'Productos e-commerce - Cuadrado 500x500px'
    },
    INSTAGRAM: {
        name: 'Instagram Reel',
        width: 1080,
        height: 1920,
        description: 'Reels verticales - 1080x1920px'
    }
};

// Global state
let base64ImageData = null;
let base64GarmentData = null;
let lastApiCall = null;
let currentMode = 'CATALOG'; // CATALOG or INSTAGRAM

// DOM Elements
const elements = {
    imageUpload: document.getElementById('imageUpload'),
    garmentUpload: document.getElementById('garmentUpload'),
    personPreview: document.getElementById('personPreview'),
    garmentPreview: document.getElementById('garmentPreview'),
    personImage: document.getElementById('personImage'),
    garmentImage: document.getElementById('garmentImage'),
    originalImage: document.getElementById('originalImage'),
    editedImage: document.getElementById('editedImage'),
    controls: document.getElementById('controls'),
    garmentSection: document.getElementById('garmentSection'),
    btnWhiteBg: document.getElementById('btn-white-bg'),
    btnSquareFormat: document.getElementById('btn-square-format'),
    btnSmile: document.getElementById('btn-smile'),
    btnVirtualTryOn: document.getElementById('btn-virtual-try-on'),
    btnDownload: document.getElementById('btn-download'),
    btnRetry: document.getElementById('btn-retry'),
    // NEW MODE SELECTOR
    modeSelector: document.getElementById('modeSelector'),
    catalogMode: document.getElementById('catalogMode'),
    instagramMode: document.getElementById('instagramMode'),
    currentModeDisplay: document.getElementById('currentModeDisplay'),
    loader: document.getElementById('loader'),
    apiNotice: document.getElementById('apiNotice')
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    console.log('🚀 Editor MULTIMODO: Catálogo + Instagram Reel');
});

function initializeApp() {
    console.log('🚀 Editor MULTIMODO inicializado');
    console.log('✅ Modo Catálogo: 500x500px cuadrado');
    console.log('✅ Modo Instagram: 1080x1920px vertical');
    console.log('✅ Expansión inteligente en modo catálogo');
    console.log('✅ Recorte inteligente en ambos modos');
    
    updateModeDisplay();
}

function setupEventListeners() {
    // Image uploads
    elements.imageUpload.addEventListener('change', handlePersonImageUpload);
    elements.garmentUpload.addEventListener('change', handleGarmentImageUpload);
    
    // Mode selector
    elements.catalogMode.addEventListener('click', () => setMode('CATALOG'));
    elements.instagramMode.addEventListener('click', () => setMode('INSTAGRAM'));
    
    // Editing buttons
    elements.btnWhiteBg.addEventListener('click', function() {
        smartProcessTask('Cambiar el fondo a blanco profesional, mantener a la persona intacta');
    });
    elements.btnSquareFormat.addEventListener('click', function() {
        smartProcessTask('Cambiar formato según destino, ajustar composición manteniendo la persona centrada');
    });
    elements.btnSmile.addEventListener('click', function() {
        smartProcessTask('Mejorar la expresión de la persona para que se vea más sonriente y amigable');
    });
    elements.btnVirtualTryOn.addEventListener('click', smartVirtualTryOn);
    
    // Action buttons
    elements.btnDownload.addEventListener('click', downloadImage);
    elements.btnRetry.addEventListener('click', retryLastTask);
    
    console.log('✅ Event listeners configurados');
}

// ===========================
// MODE MANAGEMENT
// ===========================

function setMode(mode) {
    currentMode = mode;
    updateModeDisplay();
    
    const modeConfig = MODES[mode];
    console.log('🎯 Modo cambiado a: ' + modeConfig.name);
    console.log('🎯 Dimensiones: ' + modeConfig.width + 'x' + modeConfig.height + 'px');
    console.log('🎯 Descripción: ' + modeConfig.description);
    
    showError('Modo cambiado a: ' + modeConfig.name, 'info');
}

function updateModeDisplay() {
    const modeConfig = MODES[currentMode];
    
    // Update display text
    elements.currentModeDisplay.textContent = `${modeConfig.name} (${modeConfig.width}x${modeConfig.height})`;
    
    // Update button states
    elements.catalogMode.classList.toggle('active', currentMode === 'CATALOG');
    elements.instagramMode.classList.toggle('active', currentMode === 'INSTAGRAM');
}

// ===========================
// SMART PROCESSING FUNCTIONS
// ===========================

function smartProcessTask(promptText) {
    if (!base64ImageData) {
        showError('Primero debes cargar una imagen de persona');
        return;
    }
    
    lastApiCall = { type: 'standard', prompt: promptText };
    
    const modeConfig = MODES[currentMode];
    
    console.log('🎯 Iniciando procesamiento INTELIGENTE');
    console.log('🎯 Modo: ' + modeConfig.name);
    console.log('🎯 Prompt: ' + promptText);
    
    showLoader(true);
    
    // Analyze image orientation to determine strategy
    analyzeImageOrientation(base64ImageData)
        .then(orientation => {
            console.log('📊 Orientación detectada: ' + orientation);
            return smartProcess(orientation, promptText, base64ImageData);
        })
        .then(finalResultUrl => {
            if (finalResultUrl) {
                elements.editedImage.innerHTML = '<img src="' + finalResultUrl + '" alt="Imagen procesada">';
                
                elements.btnDownload.disabled = false;
                elements.btnRetry.disabled = false;
                
                console.log('✅ Procesamiento inteligente completado');
                showError(`✅ Imagen procesada en modo ${modeConfig.name}`, 'success');
            } else {
                showError('Error en el procesamiento inteligente');
            }
        })
        .catch(error => {
            console.error('❌ Error en procesamiento inteligente:', error);
            showError('Error: ' + error.message);
        })
        .finally(() => {
            showLoader(false);
        });
}

function smartVirtualTryOn() {
    if (!base64ImageData) {
        showError('Primero debes cargar una imagen de persona');
        return;
    }
    
    if (!base64GarmentData) {
        showError('Primero debes cargar una imagen de prenda');
        return;
    }
    
    lastApiCall = { type: 'virtual-try-on', prompt: 'virtual try-on' };
    
    const modeConfig = MODES[currentMode];
    
    console.log('🎯 Iniciando Virtual Try-On INTELIGENTE');
    console.log('🎯 Modo: ' + modeConfig.name);
    
    showLoader(true);
    
    // Analyze image orientation to determine strategy
    analyzeImageOrientation(base64ImageData)
        .then(orientation => {
            console.log('📊 Orientación detectada: ' + orientation);
            return smartVirtualTryOnProcess(orientation);
        })
        .then(finalResultUrl => {
            if (finalResultUrl) {
                elements.editedImage.innerHTML = '<img src="' + finalResultUrl + '" alt="Virtual try-on procesado">';
                
                elements.btnDownload.disabled = false;
                elements.btnRetry.disabled = false;
                
                console.log('✅ Virtual try-on inteligente completado');
                showError(`✅ Virtual try-on en modo ${modeConfig.name}`, 'success');
            } else {
                showError('Error en el virtual try-on inteligente');
            }
        })
        .catch(error => {
            console.error('❌ Error en virtual try-on inteligente:', error);
            showError('Error: ' + error.message);
        })
        .finally(() => {
            showLoader(false);
        });
}

// ===========================
// INTELLIGENT PROCESSING LOGIC
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
            
            resolve(orientation);
        };
        
        img.onerror = function() {
            // Default to square if can't determine
            resolve('square');
        };
    });
}

async function smartProcess(orientation, promptText, imageBase64) {
    const modeConfig = MODES[currentMode];
    
    try {
        if (currentMode === 'CATALOG') {
            return await catalogProcessing(orientation, promptText, imageBase64);
        } else {
            return await instagramProcessing(orientation, promptText, imageBase64);
        }
    } catch (error) {
        console.error('Error en procesamiento inteligente:', error);
        throw error;
    }
}

async function catalogProcessing(orientation, promptText, imageBase64) {
    const modeConfig = MODES.CATALOG;
    
    console.log('🛍️ Procesamiento CATÁLOGO (500x500px)');
    
    if (orientation === 'vertical') {
        // MODO CATÁLOGO + IMAGEN VERTICAL = EXPANSIÓN INTELIGENTE
        console.log('🔧 Estrategia: EXPANSIÓN - Rellenar espacios faltantes');
        
        // IA expande la imagen para crear contenido en los espacios faltantes
        const expandedPrompt = promptText + ' + EXPANSIÓN INTELIGENTE: Rellena los espacios faltantes para completar formato cuadrado 500x500px, manteniendo continuidad natural con la imagen original.';
        
        return await processWithAI(expandedPrompt, imageBase64)
            .then(aiResult => {
                // Asegurar dimensiones exactas después de expansión
                return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
            });
            
    } else if (orientation === 'square') {
        // MODO CATÁLOGO + IMAGEN CUADRADA = MANTENER + AJUSTAR
        console.log('🔧 Estrategia: MANTENER - Imagen ya está en formato correcto');
        
        const adjustedPrompt = promptText + ' + FORMATO: Mantener proporciones cuadradas para catálogo e-commerce 500x500px.';
        
        return await processWithAI(adjustedPrompt, imageBase64)
            .then(aiResult => {
                return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
            });
            
    } else {
        // MODO CATÁLOGO + IMAGEN HORIZONTAL = RECORTE INTELIGENTE
        console.log('🔧 Estrategia: RECORTE - Centrar y recortar para cuadrado');
        
        const croppedPrompt = promptText + ' + COMPOSICIÓN: Ajustar para formato cuadrado 500x500px, manteniendo la persona centrada.';
        
        return await processWithAI(croppedPrompt, imageBase64)
            .then(aiResult => {
                return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
            });
    }
}

async function instagramProcessing(orientation, promptText, imageBase64) {
    const modeConfig = MODES.INSTAGRAM;
    
    console.log('📱 Procesamiento INSTAGRAM REEL (1080x1920px)');
    
    if (orientation === 'vertical') {
        // MODO INSTAGRAM + IMAGEN VERTICAL = MANTENER + AJUSTAR
        console.log('🔧 Estrategia: MANTENER - Imagen ya tiene orientación correcta');
        
        const adjustedPrompt = promptText + ' + FORMATO: Optimizar para Instagram Reel vertical 1080x1920px, mantener calidad y centrado.';
        
        return await processWithAI(adjustedPrompt, imageBase64)
            .then(aiResult => {
                return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
            });
            
    } else if (orientation === 'square') {
        // MODO INSTAGRAM + IMAGEN CUADRADA = RECORTE PARA VERTICAL
        console.log('🔧 Estrategia: RECORTE - Convertir cuadrado a vertical');
        
        const verticalPrompt = promptText + ' + FORMATO: Convertir a vertical 1080x1920px para Instagram Reel, mantener contenido principal centrado.';
        
        return await processWithAI(verticalPrompt, imageBase64)
            .then(aiResult => {
                return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
            });
            
    } else {
        // MODO INSTAGRAM + IMAGEN HORIZONTAL = RECORTE PARA VERTICAL
        console.log('🔧 Estrategia: RECORTE - Convertir horizontal a vertical');
        
        const verticalPrompt = promptText + ' + FORMATO: Convertir a vertical 1080x1920px para Instagram Reel, preservar elemento principal.';
        
        return await processWithAI(verticalPrompt, imageBase64)
            .then(aiResult => {
                return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
            });
    }
}

async function smartVirtualTryOnProcess(orientation) {
    const modeConfig = MODES[currentMode];
    
    console.log('👕 Virtual Try-On Inteligente - Modo: ' + modeConfig.name);
    
    const virtualPrompt = 'Combina esta prenda con la persona de manera realista, la prenda debe verse natural como si la persona realmente la estuviera usando. Virtual try-on profesional.';
    
    return await processVirtualTryOnWithAI(virtualPrompt)
        .then(aiResult => {
            return smartCropToDimensions(aiResult, modeConfig.width, modeConfig.height);
        });
}

// ===========================
// AI PROCESSING FUNCTIONS
// ===========================

async function processWithAI(promptText, imageBase64) {
    const payload = {
        contents: [{
            parts: [
                { text: promptText },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: imageBase64
                    }
                }
            ]
        }],
        generation_config: {
            temperature: 0.1,
            max_output_tokens: 8192
        }
    };
    
    return await callApiAndExtractImage(payload);
}

async function processVirtualTryOnWithAI(promptText) {
    const payload = {
        contents: [{
            parts: [
                { text: promptText },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: base64ImageData
                    }
                },
                { text: ' y ' },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: base64GarmentData
                    }
                }
            ]
        }],
        generation_config: {
            temperature: 0.1,
            max_output_tokens: 8192
        }
    };
    
    return await callApiAndExtractImage(payload);
}

async function callApiAndExtractImage(payload) {
    try {
        console.log('📡 Enviando a IA...');
        
        const response = await fetchWithBackoff(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': CONFIG.API_KEY,
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('Error ' + response.status + ': ' + response.statusText);
        }
        
        const data = await response.json();
        console.log('📨 Respuesta de IA recibida');
        
        const imageBase64 = extractImageFromResponse(data);
        
        if (!imageBase64) {
            throw new Error('La IA no devolvió una imagen válida');
        }
        
        console.log('✅ Imagen extraída de respuesta de IA');
        return imageBase64;
        
    } catch (error) {
        console.error('❌ Error en API:', error);
        throw error;
    }
}

async function fetchWithBackoff(url, options, maxRetries) {
    if (!maxRetries) {
        maxRetries = 3;
    }
    
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            if (i === maxRetries) throw error;
            
            const delay = Math.pow(2, i) * 1000;
            console.log('Reintentando en ' + delay + 'ms... (' + (i + 1) + '/' + maxRetries + ')');
            await new Promise(function(resolve) {
                setTimeout(resolve, delay);
            });
        }
    }
}

// ===========================
// IMAGE EXTRACTION
// ===========================

function extractImageFromResponse(data) {
    try {
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            
            if (parts && Array.isArray(parts)) {
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    
                    // Buscar en inline_data
                    if (part.inline_data && part.inline_data.data) {
                        return part.inline_data.data;
                    }
                    
                    // Buscar en texto (data:image)
                    if (part.text) {
                        const match = part.text.match(/data:image\/[a-z]+;base64,([a-zA-Z0-9+\/=]+)/);
                        if (match) {
                            return match[1];
                        }
                    }
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error extrayendo imagen:', error);
        return null;
    }
}

// ===========================
// SMART DIMENSIONAL PROCESSING
// ===========================

function smartCropToDimensions(imageBase64, targetWidth, targetHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + imageBase64;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set target dimensions
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
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
            console.log('✅ Procesamiento completado: ' + targetWidth + 'x' + targetHeight + 'px');
            resolve(resultUrl);
        };
        
        img.onerror = function() {
            console.error('❌ Error cargando imagen para procesamiento');
            resolve(null);
        };
    });
}

// ===========================
// IMAGE UPLOAD HANDLERS
// ===========================

async function handlePersonImageUpload(event) {
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
        
        const base64 = await fileToBase64(file);
        base64ImageData = base64;
        
        const dataUrl = 'data:' + file.type + ';base64,' + base64;
        elements.personImage.src = dataUrl;
        elements.personPreview.style.display = 'block';
        elements.originalImage.innerHTML = '<img src="' + dataUrl + '" alt="Imagen original">';
        
        enableControls();
        elements.garmentSection.style.display = 'flex';
        
        console.log('✅ Imagen de persona cargada exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar imagen:', error);
        showError('Error al cargar la imagen');
    }
}

async function handleGarmentImageUpload(event) {
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
        
        const base64 = await fileToBase64(file);
        base64GarmentData = base64;
        
        const dataUrl = 'data:' + file.type + ';base64,' + base64;
        elements.garmentImage.src = dataUrl;
        elements.garmentPreview.style.display = 'block';
        
        console.log('✅ Imagen de prenda cargada exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar prenda:', error);
        showError('Error al cargar la imagen de la prenda');
    }
}

// ===========================
// ACTION FUNCTIONS
// ===========================

function downloadImage() {
    const img = elements.editedImage.querySelector('img');
    if (!img) return;
    
    try {
        const modeConfig = MODES[currentMode];
        const a = document.createElement('a');
        a.href = img.src;
        a.download = `imagen-${currentMode.toLowerCase()}-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('✅ Imagen descargada en modo: ' + modeConfig.name);
        showError('Imagen descargada exitosamente', 'success');
        
    } catch (error) {
        console.error('Error descargando imagen:', error);
        showError('Error al descargar la imagen');
    }
}

function retryLastTask() {
    if (!lastApiCall) {
        showError('No hay una tarea previa para reintentar');
        return;
    }
    
    console.log('🔄 Reintentando última tarea:', lastApiCall);
    
    if (lastApiCall.type === 'standard') {
        smartProcessTask(lastApiCall.prompt);
    } else if (lastApiCall.type === 'virtual-try-on') {
        smartVirtualTryOn();
    }
}

// ===========================
// UI HELPERS
// ===========================

function enableControls() {
    elements.controls.disabled = false;
}

function showLoader(show) {
    elements.loader.style.display = show ? 'flex' : 'none';
}

function showError(message, type) {
    if (!type) {
        type = 'error';
    }
    
    const typeConfig = {
        error: {
            background: '#DC3545'
        },
        success: {
            background: '#198754'
        },
        info: {
            background: '#0DCAF0'
        }
    };
    
    const config = typeConfig[type] || typeConfig.error;
    
    const notificationDiv = document.createElement('div');
    notificationDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${config.background};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
    
    const timeout = type === 'error' ? 5000 : 3000;
    setTimeout(function() {
        if (notificationDiv.parentNode) {
            notificationDiv.parentNode.removeChild(notificationDiv);
        }
    }, timeout);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function fileToBase64(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            const result = reader.result;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = function(error) {
            reject(error);
        };
    });
}

console.log('🚀 EDITOR MULTIMODO: Catálogo + Instagram Reel - Versión Completa');
