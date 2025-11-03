// ===========================
// E-COMMERCE PHOTO EDITOR
// JavaScript Application Logic - VERSIÓN CORREGIDA PARA EDICIÓN
// ===========================

// Configuration
const CONFIG = {
    API_KEY: "AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I",
    API_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent",
    
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
    console.log('🚀 Editor inicializado - Versión EDICIÓN');
});

function initializeApp() {
    console.log('🚀 Editor de fotos inicializado correctamente');
    
    if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
        console.warn('⚠️ API Key no configurada');
    } else {
        console.log('✅ API Key configurada correctamente');
        console.log('✅ Google AI Imagen API: Habilitada - MODELO DE EDICIÓN');
    }
}

function setupEventListeners() {
    elements.imageUpload.addEventListener('change', handlePersonImageUpload);
    elements.garmentUpload.addEventListener('change', handleGarmentImageUpload);
    
    elements.btnWhiteBg.addEventListener('click', function() {
        standardTask('Cambiar el fondo a blanco profesional, mantener a la persona intacta');
    });
    elements.btnSquareFormat.addEventListener('click', function() {
        standardTask('Cambiar formato a cuadrado 1:1, ajustar composición manteniendo la persona centrada');
    });
    elements.btnSmile.addEventListener('click', function() {
        standardTask('Mejorar la expresión de la persona para que se vea más sonriente y amigable');
    });
    elements.btnVirtualTryOn.addEventListener('click', virtualTryOnTask);
    
    elements.btnDownload.addEventListener('click', downloadImage);
    elements.btnRetry.addEventListener('click', retryLastTask);
    
    console.log('✅ Event listeners configurados correctamente');
    console.log('✅ Modo: Upload local de imágenes - CON GEMINI 2.5 FLASH IMAGE');
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
    
    console.log('🎯 Iniciando edición: ' + promptText);
    console.log('🎯 Usando modelo: gemini-2.5-flash-image-preview');
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
    
    lastApiCall = { type: 'virtual-try-on', prompt: 'combinar esta prenda con la persona' };
    
    const payload = {
        contents: [{
            parts: [
                { text: 'Combina esta prenda con la persona de manera realista, la prenda debe verse natural como si la persona realmente la estuviera usando. Virtual try-on profesional.' },
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
    
    console.log('🎯 Iniciando virtual try-on');
    console.log('🎯 Usando modelo: gemini-2.5-flash-image-preview');
    callApi(payload);
}

// ===========================
// API COMMUNICATION
// ===========================

async function callApi(payload) {
    console.log('🚀 Iniciando edición con Gemini 2.5 Flash Image...');
    showLoader(true);
    
    try {
        if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
            showError('API Key no configurada');
            showLoader(false);
            return;
        }
        
        console.log('📡 Enviando solicitud a Gemini Imagen...');
        console.log('📡 Endpoint: ' + CONFIG.API_ENDPOINT);
        
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
        console.log('📨 Respuesta recibida de Gemini Imagen:', data);
        
        const imageBase64 = extractImageFromResponse(data);
        
        if (imageBase64) {
            const editedDataUrl = 'data:image/jpeg;base64,' + imageBase64;
            elements.editedImage.innerHTML = '<img src="' + editedDataUrl + '" alt="Imagen editada">';
            
            elements.btnDownload.disabled = false;
            elements.btnRetry.disabled = false;
            
            console.log('✅ Imagen editada exitosamente');
            showError('✅ Imagen editada exitosamente con IA', 'success');
        } else {
            console.error('❌ No se pudo extraer imagen de la respuesta');
            console.log('📋 Respuesta completa:', JSON.stringify(data, null, 2));
            showError('La API no devolvió una imagen válida');
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
        console.log('🔍 Analizando respuesta de Gemini Imagen:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            
            if (!parts || !Array.isArray(parts)) {
                console.log('⚠️ No hay parts válidas en la respuesta');
                console.log('🔍 Estructura de respuesta:', JSON.stringify(data, null, 2));
                return null;
            }
            
            console.log('📋 Parts encontradas:', parts.length);
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                console.log(`🔍 Analizando part ${i}:`, part);
                
                // Buscar imagen en inline_data
                if (part.inline_data && part.inline_data.data) {
                    console.log('✅ Imagen encontrada en inline_data');
                    console.log('🔍 Tipo MIME:', part.inline_data.mime_type);
                    console.log('🔍 Tamaño de datos:', part.inline_data.data.length);
                    return part.inline_data.data;
                }
                
                // Buscar imagen en texto (formato data:image)
                if (part.text && part.text.indexOf('data:image') !== -1) {
                    const match = part.text.match(/data:image\/[a-z]+;base64,([a-zA-Z0-9+\/=]+)/);
                    if (match) {
                        console.log('✅ Imagen encontrada en texto');
                        return match[1];
                    }
                }
                
                // Log para debug
                if (part.text) {
                    console.log(`📝 Texto en part ${i}:`, part.text.substring(0, 200));
                }
            }
        }
        
        // Información adicional para debug
        if (data.candidates) {
            console.log('📋 Candidates disponibles:', data.candidates.length);
            if (data.candidates[0]) {
                console.log('📋 First candidate finish reason:', data.candidates[0].finishReason);
                if (data.candidates[0].safetyRatings) {
                    console.log('📋 Safety ratings:', data.candidates[0].safetyRatings);
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
            icon: '<circle cx=\'12\' cy=\'12\' r=\'10\'/><line x1=\'15\' y1=\'9\' x2=\'9\' y2=\'15\'/><line x1=\'9\' y1=\'9\' x2=\'15\' y2=\'15\'/>'
        },
        success: {
            background: '#198754',
            icon: '<polyline points=\'20,6 9,17 4,12\'/>'
        },
        info: {
            background: '#0DCAF0',
            icon: '<circle cx=\'12\' cy=\'12\' r=\'10\'/><line x1=\'12\' y1=\'16\' x2=\'12\' y2=\'12\'/><line x1=\'12\' y1=\'8\' x2=\'12.01\' y2=\'8\'/>'
        }
    };
    
    const config = typeConfig[type] || typeConfig.error;
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification';
    
    // Crear SVG sin innerHTML
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgElement = document.createElementNS(svgNS, 'svg');
    svgElement.setAttribute('width', '20');
    svgElement.setAttribute('height', '20');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.setAttribute('fill', 'none');
    svgElement.setAttribute('stroke', 'currentColor');
    svgElement.setAttribute('stroke-width', '2');
    
    // Crear elementos del SVG según el tipo
    if (config.icon.includes('circle') && config.icon.includes('polyline')) {
        const circle = document.createElementNS(svgNS, 'polyline');
        circle.setAttribute('points', '20,6 9,17 4,12');
        svgElement.appendChild(circle);
    } else if (config.icon.includes('circle') && config.icon.includes('line')) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '10');
        svgElement.appendChild(circle);
        
        const line1 = document.createElementNS(svgNS, 'line');
        line1.setAttribute('x1', '15');
        line1.setAttribute('y1', '9');
        line1.setAttribute('x2', '9');
        line1.setAttribute('y2', '15');
        svgElement.appendChild(line1);
        
        const line2 = document.createElementNS(svgNS, 'line');
        line2.setAttribute('x1', '9');
        line2.setAttribute('y1', '9');
        line2.setAttribute('x2', '15');
        line2.setAttribute('y2', '15');
        svgElement.appendChild(line2);
    } else if (config.icon.includes('line') && config.icon.includes('12.01')) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '10');
        svgElement.appendChild(circle);
        
        const line1 = document.createElementNS(svgNS, 'line');
        line1.setAttribute('x1', '12');
        line1.setAttribute('y1', '16');
        line1.setAttribute('x2', '12');
        line1.setAttribute('y2', '12');
        svgElement.appendChild(line1);
        
        const line2 = document.createElementNS(svgNS, 'line');
        line2.setAttribute('x1', '12');
        line2.setAttribute('y1', '8');
        line2.setAttribute('x2', '12.01');
        line2.setAttribute('y2', '8');
        svgElement.appendChild(line2);
    }
    
    // Crear span para el mensaje
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    // Agregar elementos al div
    notificationDiv.appendChild(svgElement);
    notificationDiv.appendChild(messageSpan);
    
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

console.log('🎨 Editor de Fotos E-commerce - MODELO DE EDICIÓN GEMINI 2.5 FLASH IMAGE');
