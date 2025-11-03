// ===========================
// E-COMMERCE PHOTO EDITOR
// JavaScript Application Logic - VERSIÓN FINAL CORREGIDA
// ===========================

// Configuration
const CONFIG = {
    API_KEY: "AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I",
    API_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    
    SYSTEM_PROMPTS: {
        standard: "Eres un editor de fotos profesional para e-commerce. Edita la imagen manteniendo a la persona intacta, solo modifica el fondo, formato o expresión. Asegúrate de que la imagen final tenga calidad profesional. Devuelve SOLO la imagen editada en formato base64 sin texto adicional.",
        
        virtualTryOn: "Eres un editor de fotos profesional especializado en virtual try-on. Combina la imagen de la persona con la prenda de manera realista. La prenda debe verse natural como si la persona realmente la estuviera usando. Devuelve SOLO la imagen combinada en formato base64 sin texto adicional."
    }
};

// Global state
let base64ImageData = null;
let base64GarmentData = null;
let lastApiCall = null;

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
    canvaPanel: document.getElementById('canvaPanel'),
    canvaStatus: document.getElementById('canvaStatus'),
    canvaIndicator: document.getElementById('canvaIndicator'),
    canvaStatusText: document.getElementById('canvaStatusText'),
    btnCanvaConnect: document.getElementById('btnCanvaConnect'),
    btnCanvaDisconnect: document.getElementById('btnCanvaDisconnect'),
    loader: document.getElementById('loader'),
    apiNotice: document.getElementById('apiNotice')
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    showApiNotice();
    console.log('🚀 Editor inicializado - Versión Final');
});

function initializeApp() {
    console.log('🚀 Editor de fotos inicializado correctamente');
    
    if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
        console.warn('⚠️ API Key no configurada');
    } else {
        console.log('✅ API Key configurada correctamente');
        console.log('✅ Google AI API: Habilitada');
    }
}

function setupEventListeners() {
    elements.imageUpload.addEventListener('change', handlePersonImageUpload);
    elements.garmentUpload.addEventListener('change', handleGarmentImageUpload);
    
    elements.btnWhiteBg.addEventListener('click', function() {
        standardTask('fondo blanco');
    });
    elements.btnSquareFormat.addEventListener('click', function() {
        standardTask('formato cuadrado');
    });
    elements.btnSmile.addEventListener('click', function() {
        standardTask('hacer sonreír');
    });
    elements.btnVirtualTryOn.addEventListener('click', virtualTryOnTask);
    
    elements.btnDownload.addEventListener('click', downloadImage);
    elements.btnRetry.addEventListener('click', retryLastTask);
    
    console.log('✅ Event listeners configurados correctamente');
    console.log('✅ Modo: Upload local de imágenes - SIN Firebase Storage');
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
// TOOL FUNCTIONS
// ===========================

function standardTask(promptText) {
    if (!base64ImageData) {
        showError('Primero debes cargar una imagen de persona');
        return;
    }
    
    lastApiCall = { type: 'standard', prompt: promptText };
    
    const payload = {
        contents: [{
            parts: [
                { text: promptText },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: base64ImageData
                    }
                }
            ]
        }],
        generation_config: {
            temperature: 0.1,
            max_output_tokens: 8192
        }
    };
    
    console.log('🎯 Iniciando tarea: ' + promptText);
    callApi(payload);
}

function virtualTryOnTask() {
    if (!base64ImageData) {
        showError('Primero debes cargar una imagen de persona');
        return;
    }
    
    if (!base64GarmentData) {
        showError('Primero debes cargar una imagen de prenda');
        return;
    }
    
    lastApiCall = { type: 'virtual-try-on', prompt: 'virtual try-on' };
    
    const payload = {
        contents: [{
            parts: [
                { text: 'virtual try-on' },
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
    
    console.log('🎯 Iniciando tarea: virtual try-on');
    callApi(payload);
}

// ===========================
// API COMMUNICATION
// ===========================

async function callApi(payload) {
    console.log('🚀 Iniciando edición con Google AI...');
    showLoader(true);
    
    try {
        if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
            showError('API Key no configurada');
            showLoader(false);
            return;
        }
        
        console.log('📡 Enviando solicitud a Google AI...');
        
        const response = await fetchWithBackoff(CONFIG.API_ENDPOINT + '?key=' + CONFIG.API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('Error ' + response.status + ': ' + response.statusText);
        }
        
        const data = await response.json();
        console.log('📨 Respuesta recibida de Google AI:', data);
        
        const imageBase64 = extractImageFromResponse(data);
        
        if (imageBase64) {
            const editedDataUrl = 'data:image/jpeg;base64,' + imageBase64;
            elements.editedImage.innerHTML = '<img src="' + editedDataUrl + '" alt="Imagen editada">';
            
            elements.btnDownload.disabled = false;
            elements.btnRetry.disabled = false;
            
            console.log('✅ Imagen procesada exitosamente');
            showError('✅ Imagen editada exitosamente con IA', 'success');
        } else {
            const reason = analyzeApiResponse(data);
            showError('No se pudo generar la imagen. Razón: ' + reason);
        }
        
    } catch (error) {
        console.error('❌ Error en API:', error);
        showError('Error de conexión: ' + error.message);
    } finally {
        showLoader(false);
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
// RESPONSE PROCESSING
// ===========================

function extractImageFromResponse(data) {
    try {
        console.log('🔍 Analizando respuesta:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            
            if (!parts || !Array.isArray(parts)) {
                console.log('⚠️ No hay parts válidas');
                return null;
            }
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (part.inline_data && part.inline_data.data) {
                    console.log('✅ Imagen encontrada');
                    return part.inline_data.data;
                }
                if (part.text && part.text.indexOf('data:image') !== -1) {
                    const match = part.text.match(/data:image\/[a-z]+;base64,([a-zA-Z0-9+\/=]+)/);
                    if (match) {
                        console.log('✅ Imagen encontrada en texto');
                        return match[1];
                    }
                }
            }
        }
        
        console.log('❌ No se encontró imagen en la respuesta');
        return null;
    } catch (error) {
        console.error('❌ Error extrayendo imagen:', error);
        return null;
    }
}

function analyzeApiResponse(data) {
    if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
        const reason = data.candidates[0].finishReason;
        
        switch (reason) {
            case 'SAFETY':
                return 'La IA bloqueó el resultado (Motivo: SAFETY)';
            case 'RECITATION':
                return 'Contenido bloqueado por derechos de autor';
            case 'OTHER':
                return 'Error desconocido en el procesamiento';
            default:
                return 'Error: ' + reason;
        }
    }
    
    if (data.promptFeedback && data.promptFeedback.blockReason) {
        return 'Prompt bloqueado: ' + data.promptFeedback.blockReason;
    }
    
    return 'La respuesta no contiene una imagen válida';
}

// ===========================
// ACTION FUNCTIONS
// ===========================

function downloadImage() {
    const img = elements.editedImage.querySelector('img');
    if (!img) return;
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const image = new Image();
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            
            canvas.toBlob(function(blob) {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'imagen-editada-' + Date.now() + '.jpg';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    console.log('✅ Imagen descargada');
                    showError('Imagen descargada exitosamente', 'success');
                }
            }, 'image/jpeg', 0.9);
        };
        image.src = img.src;
        
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
        standardTask(lastApiCall.prompt);
    } else if (lastApiCall.type === 'virtual-try-on') {
        virtualTryOnTask();
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
            background: '#DC3545',
            icon: 'error'
        },
        success: {
            background: '#198754',
            icon: 'success'
        },
        info: {
            background: '#0DCAF0',
            icon: 'info'
        }
    };
    
    const config = typeConfig[type] || typeConfig.error;
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification';
    
    let svgIcon = '';
    if (config.icon === 'error') {
        svgIcon = '
```<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>```
';
    } else if (config.icon === 'success') {
        svgIcon = '
```<polyline points="20,6 9,17 4,12"/>```
';
    } else if (config.icon === 'info') {
        svgIcon = '
```<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>```
';
    }
    
    notificationDiv.innerHTML = svgIcon + '<span>' + message + '</span>';
    
    Object.assign(notificationDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: config.background,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notificationDiv);
    
    const timeout = type === 'error' ? 5000 : 3000;
    setTimeout(function() {
        if (notificationDiv.parentNode) {
            notificationDiv.parentNode.removeChild(notificationDiv);
        }
    }, timeout);
}

function showApiNotice() {
    if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
        elements.apiNotice.style.display = 'flex';
    } else {
        elements.apiNotice.style.display = 'none';
    }
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

console.log('🎨 Editor de Fotos E-commerce - VERSIÓN FINAL CORREGIDA');
