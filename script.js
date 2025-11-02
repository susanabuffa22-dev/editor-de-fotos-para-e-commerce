
<think duration="606" >
El usuario me ha enviado una nueva captura de pantalla de errores. Necesito analizarla para ver qué está pasando ahora que implementé la versión de prueba sin API.

</think>



Veo el problema. Aunque implementé la versión de prueba, parece que **todavía se está ejecutando el código original** (con la llamada a API). Esto significa que:

## 🚨 **El archivo no se actualizó correctamente en GitHub**

Necesito asegurarme de que **el nuevo código se suba correctamente**. Te voy a dar el **contenido completo actualizado** para que lo copies:


Perfecto, veo que **el código de prueba SÍ está en mi archivo**, pero probablemente **no se actualizó correctamente en GitHub**.

## 🔧 **Solución: Actualización Manual Completa**

Te voy a dar **instrucciones paso a paso** para asegurarme de que se actualice correctamente:

### **Paso 1: Verificar el commit anterior**
1. **Ve a GitHub** a tu archivo `script.js`
2. **Haz clic en el ícono de lápiz** (✏️) para editar
3. **Verifica** si ves las líneas:
   ```javascript
   // 🧪 TEMPORARY TEST MODE - Skip API to test image loading
   console.log('🧪 Modo de prueba - saltando llamada a API');
   ```

### **Paso 2: Si NO ves esa línea, reemplaza TODO el contenido:**

**Seleciona TODO el código** (Ctrl+A) y reemplázalo con este **archivo completo actualizado**:


## 📋 **Código Completo Actualizado - PARA COPIAR EN GITHUB**

Este es el **archivo completo con la corrección**. **Copia TODO el contenido** y reemplázalo en GitHub:

```
// ===========================
// E-COMMERCE PHOTO EDITOR
// JavaScript Application Logic
// ===========================

// Configuration
const CONFIG = {
    // ⚠️ IMPORTANTE: Reemplaza con tu API Key de Google AI
    API_KEY: "AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I", // 👈 CAMBIAR AQUÍ
    
    API_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    
    // System prompts para diferentes tipos de edición
    SYSTEM_PROMPTS: {
        standard: `Eres un editor de fotos profesional para e-commerce. Tu tarea es editar la imagen proporcionada según el prompt del usuario. 

INSTRUCCIONES ESPECÍFICAS:
- Mantén a la persona intacta, solo modifica el fondo, formato o expresión
- Asegúrate de que la imagen final tenga calidad profesional para e-commerce
- No cambies las proporciones de la persona
- Usa técnicas de edición realista

Devuelve SOLO la imagen editada en formato base64 sin texto adicional.`,
        
        virtualTryOn: `Eres un editor de fotos profesional especializado en "virtual try-on" para e-commerce. Tu tarea es combinar la imagen de la persona con la prenda de ropa proporcionada de manera realista.

INSTRUCCIONES ESPECÍFICAS:
- Coloca la prenda sobre la persona de manera natural y realista
- Asegúrate de que la prenda se ajuste correctamente a la forma del cuerpo
- Mantén la iluminación y sombras consistentes
- La prenda debe verse natural, como si la persona realmente la estuviera usando
- Calidad profesional para e-commerce

Devuelve SOLO la imagen combinada en formato base64 sin texto adicional.`
    }
};

// Global state variables
let base64ImageData = null;
let base64GarmentData = null;
let lastApiCall = null;
let editedImageBlob = null;

// ===========================
// DOM ELEMENTS
// ===========================

const elements = {
    // Upload elements
    imageUpload: document.getElementById('imageUpload'),
    garmentUpload: document.getElementById('garmentUpload'),
    personUploadArea: document.getElementById('personUploadArea'),
    garmentUploadArea: document.getElementById('garmentUploadArea'),
    
    // Preview elements
    personPreview: document.getElementById('personPreview'),
    garmentPreview: document.getElementById('garmentPreview'),
    personImage: document.getElementById('personImage'),
    garmentImage: document.getElementById('garmentImage'),
    originalImage: document.getElementById('originalImage'),
    editedImage: document.getElementById('editedImage'),
    
    // Control elements
    controls: document.getElementById('controls'),
    garmentSection: document.getElementById('garmentSection'),
    
    // Tool buttons
    btnWhiteBg: document.getElementById('btn-white-bg'),
    btnSquareFormat: document.getElementById('btn-square-format'),
    btnSmile: document.getElementById('btn-smile'),
    btnVirtualTryOn: document.getElementById('btn-virtual-try-on'),
    
    // Action buttons
    btnDownload: document.getElementById('btn-download'),
    btnRetry: document.getElementById('btn-retry'),
    btnCanvaExport: document.getElementById('btn-canva-export'),
    
    // Canva elements
    canvaPanel: document.getElementById('canvaPanel'),
    canvaStatus: document.getElementById('canvaStatus'),
    canvaIndicator: document.getElementById('canvaIndicator'),
    canvaStatusText: document.getElementById('canvaStatusText'),
    btnCanvaConnect: document.getElementById('btnCanvaConnect'),
    btnCanvaDisconnect: document.getElementById('btnCanvaDisconnect'),
    
    // UI elements
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
});

function initializeApp() {
    console.log('Inicializando Editor de Fotos E-commerce...');
    
    // Verificar si hay API key configurada
    if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
        console.warn('⚠️ API Key no configurada');
    }
}

function setupEventListeners() {
    // Image upload events
    elements.imageUpload.addEventListener('change', handlePersonImageUpload);
    elements.garmentUpload.addEventListener('change', handleGarmentImageUpload);
    
    // Tool button events
    elements.btnWhiteBg.addEventListener('click', () => standardTask('fondo blanco'));
    elements.btnSquareFormat.addEventListener('click', () => standardTask('formato cuadrado'));
    elements.btnSmile.addEventListener('click', () => standardTask('hacer sonreír'));
    elements.btnVirtualTryOn.addEventListener('click', virtualTryOnTask);
    
    // Action button events
    elements.btnDownload.addEventListener('click', downloadImage);
    elements.btnRetry.addEventListener('click', retryLastTask);
    elements.btnCanvaExport.addEventListener('click', exportToCanvaPro);
    
    // Drag and drop events
    setupDragAndDrop();
    
    // Initialize Canva state
    checkCanvaConnection();
}

// ===========================
// IMAGE UPLOAD HANDLERS
// ===========================

async function handlePersonImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const base64 = await fileToBase64(file);
        base64ImageData = base64;
        
        // Show preview with proper data URL
        const dataUrl = `data:${file.type};base64,${base64}`;
        elements.personImage.src = dataUrl;
        elements.personPreview.style.display = 'block';
        elements.originalImage.innerHTML = `<img src="${dataUrl}" alt="Imagen original">`;
        
        // Enable controls
        enableControls();
        
        // Show garment upload option
        elements.garmentSection.style.display = 'flex';
        
        console.log('✅ Imagen de persona cargada exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar imagen:', error);
        showError('Error al cargar la imagen. Por favor, intenta con otro archivo.');
    }
}

async function handleGarmentImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const base64 = await fileToBase64(file);
        base64GarmentData = base64;
        
        // Show preview with proper data URL
        const dataUrl = `data:${file.type};base64,${base64}`;
        elements.garmentImage.src = dataUrl;
        elements.garmentPreview.style.display = 'block';
        
        console.log('✅ Imagen de prenda cargada exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar prenda:', error);
        showError('Error al cargar la imagen de la prenda. Por favor, intenta con otro archivo.');
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
        system_instruction: {
            parts: [{ text: CONFIG.SYSTEM_PROMPTS.standard }]
        },
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
        system_instruction: {
            parts: [{ text: CONFIG.SYSTEM_PROMPTS.virtualTryOn }]
        },
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
    
    callApi(payload);
}

// ===========================
// API COMMUNICATION
// ===========================

async function callApi(payload) {
    // 🧪 TEMPORARY TEST MODE - Skip API to test image loading
    console.log('🧪 Modo de prueba - saltando llamada a API');
    showError('✅ ÉXITO: Las imágenes se cargan correctamente', 'success');
    
    // Show test result after a short delay
    setTimeout(() => {
        // Use the original loaded image as test result
        if (elements.personImage && elements.personImage.src) {
            elements.editedImage.innerHTML = `<img src="${elements.personImage.src}" alt="Imagen de prueba">`;
            elements.btnDownload.disabled = false;
            elements.btnRetry.disabled = false;
            console.log('✅ Imagen de prueba mostrada (carga OK)');
        }
        showLoader(false);
    }, 1500);
    
    return;
    
    /* ===== ORIGINAL API CODE (COMMENTED OUT FOR TESTING) =====
    // Check API key
    if (CONFIG.API_KEY === "TU_API_KEY_AQUI") {
        showError('Error 403 (Forbidden): API Key no configurada. Por favor, configura tu API Key en el código JavaScript.');
        return;
    }
    
    // Show loader
    showLoader(true);
    
    try {
        const response = await fetchWithBackoff(`${CONFIG.API_ENDPOINT}?key=${CONFIG.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Error 403 (Forbidden): API Key inválida o no habilitada. Verifica tu configuración.');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📨 Respuesta recibida:', data);
        
        // Extract image from response
        const imageBase64 = extractImageFromResponse(data);
        
        if (imageBase64) {
            // Show result with proper data URL
            const editedDataUrl = `data:image/jpeg;base64,${imageBase64}`;
            elements.editedImage.innerHTML = `<img src="${editedDataUrl}" alt="Imagen editada">`;
            
            // Enable action buttons
            elements.btnDownload.disabled = false;
            elements.btnRetry.disabled = false;
            
            console.log('✅ Imagen procesada exitosamente');
        } else {
            const reason = analyzeApiResponse(data);
            showError(`No se pudo generar la imagen. Razón: ${reason}`);
        }
        
    } catch (error) {
        console.error('❌ Error en API:', error);
        showError(error.message);
    } finally {
        showLoader(false);
    }
    */
}

async function fetchWithBackoff(url, options, maxRetries = 3) {
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            if (i === maxRetries) throw error;
            
            const delay = Math.pow(2, i) * 1000; // Exponential backoff
            console.log(`Reintentando en ${delay}ms... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// ===========================
// RESPONSE PROCESSING
// ===========================

function extractImageFromResponse(data) {
    try {
        // Buscar imagen en diferentes formatos de respuesta
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            
            for (let part of parts) {
                if (part.inline_data && part.inline_data.data) {
                    return part.inline_data.data;
                }
                if (part.text && part.text.includes('data:image')) {
                    // Extraer base64 del texto
                    const match = part.text.match(/data:image\/[a-z]+;base64,([a-zA-Z0-9+/=]+)/);
                    if (match) {
                        return match[1];
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

function analyzeApiResponse(data) {
    // Analizar diferentes tipos de respuestas de error
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
                return `Error: ${reason}`;
        }
    }
    
    if (data.promptFeedback && data.promptFeedback.blockReason) {
        return `Prompt bloqueado: ${data.promptFeedback.blockReason}`;
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
        // Convertir data URL a blob
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const image = new Image();
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            
            canvas.toBlob(function(blob) {
                if (blob) {
                    editedImageBlob = blob;
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `imagen-editada-${Date.now()}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    console.log('✅ Imagen descargada');
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

function showError(message, type = 'error') {
    // Configuración de tipos de notificación
    const typeConfig = {
        error: {
            background: '#DC3545',
            icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        },
        success: {
            background: '#198754',
            icon: '<polyline points="20,6 9,17 4,12"/>'
        },
        info: {
            background: '#0DCAF0',
            icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
        }
    };
    
    const config = typeConfig[type] || typeConfig.error;
    
    // Crear notificación
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification';
    notificationDiv.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${config.icon}
        </svg>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
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
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    document.body.appendChild(notificationDiv);
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remover después de 5 segundos para errores, 3 segundos para otros
    const timeout = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        if (notificationDiv.parentNode) {
            notificationDiv.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (notificationDiv.parentNode) {
                    notificationDiv.parentNode.removeChild(notificationDiv);
                }
            }, 300);
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

function setupDragAndDrop() {
    const uploadAreas = [elements.personUploadArea, elements.garmentUploadArea];
    
    uploadAreas.forEach(area => {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            area.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            area.style.borderColor = '#FF6B6B';
            area.style.background = '#FFE6E6';
        }
        
        function unhighlight() {
            area.style.borderColor = '#DEE2E6';
            area.style.background = '#FAFAFA';
        }
        
        // Handle dropped files
        area.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                const file = files[0];
                if (area.id === 'personUploadArea') {
                    elements.imageUpload.files = files;
                    elements.imageUpload.dispatchEvent(new Event('change'));
                } else if (area.id === 'garmentUploadArea') {
                    elements.garmentUpload.files = files;
                    elements.garmentUpload.dispatchEvent(new Event('change'));
                }
            }
        }
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            // Remove data URL prefix to get pure base64
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// ===========================
// CANVA PRO INTEGRATION
// ===========================

// Check Canva connection status
function checkCanvaConnection() {
    const accessToken = localStorage.getItem('canva_access_token');
    
    if (accessToken) {
        updateCanvaStatus('connected');
    } else {
        updateCanvaStatus('disconnected');
    }
}

function updateCanvaStatus(status) {
    if (status === 'connected') {
        elements.canvaIndicator.classList.add('connected');
        elements.canvaStatusText.textContent = 'Conectado';
        elements.btnCanvaConnect.style.display = 'none';
        elements.btnCanvaDisconnect.style.display = 'flex';
        elements.btnCanvaExport.disabled = false;
    } else {
        elements.canvaIndicator.classList.remove('connected');
        elements.canvaStatusText.textContent = 'Desconectado';
        elements.btnCanvaConnect.style.display = 'flex';
        elements.btnCanvaDisconnect.style.display = 'none';
        elements.btnCanvaExport.disabled = true;
    }
}

// Disconnect from Canva
function disconnectCanva() {
    localStorage.removeItem('canva_access_token');
    updateCanvaStatus('disconnected');
    showError('Desconectado de Canva Pro', 'info');
}

// Make function global for onclick handler
window.disconnectCanva = disconnectCanva;

// Export to Canva Pro function
function exportToCanvaPro() {
    const accessToken = localStorage.getItem('canva_access_token');
    
    if (!accessToken) {
        showError('Necesitas conectar con Canva Pro primero');
        return;
    }
    
    // Check if there's an edited image
    const img = elements.editedImage.querySelector('img');
    if (!img) {
        showError('No hay imagen editada para exportar');
        return;
    }
    
    showError('Exportando imagen a Canva Pro...', 'info');
    
    // Convert image to blob and upload to Canva
    fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
            // In a real implementation, you would upload to Canva Pro API
            // For demo purposes, we'll simulate the process
            console.log('📤 Subiendo imagen a Canva Pro...');
            
            // Simulate API call delay
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({ success: true, designId: 'demo-' + Date.now() });
                }, 2000);
            });
        })
        .then(data => {
            console.log('✅ Imagen exportada a Canva Pro:', data);
            showError('Imagen exportada exitosamente a Canva Pro', 'success');
            
            // In a real app, you would show a link to the Canva design
            console.log('🔗 Enlace al diseño en Canva:', `https://www.canva.com/design/${data.designId}`);
        })
        .catch(error => {
            console.error('❌ Error exportando a Canva:', error);
            showError('Error al exportar a Canva Pro');
        });
}

// Nota: Para integrar con Canva Pro, necesitarás configurar OAuth
// Aquí tienes una estructura base para la integración

function initializeCanvaIntegration() {
    // Configuración para Canva Pro OAuth
    const CANVA_CONFIG = {
        clientId: "TU_CANVA_CLIENT_ID", // 👈 CAMBIAR AQUÍ
        clientSecret: "TU_CANVA_CLIENT_SECRET", // 👈 CAMBIAR AQUÍ
        redirectUri: window.location.origin + "/canva-callback",
        scope: "design:read design:write"
    };
    
    // Función para iniciar OAuth con Canva
    function startCanvaOAuth() {
        const authUrl = `https://www.canva.com/oauth/authorize?` +
            `client_id=${CANVA_CONFIG.clientId}&` +
            `redirect_uri=${encodeURIComponent(CANVA_CONFIG.redirectUri)}&` +
            `scope=${encodeURIComponent(CANVA_CONFIG.scope)}&` +
            `response_type=code`;
        
        window.location.href = authUrl;
    }
    
    // Función para manejar el callback de OAuth
    function handleCanvaCallback(code) {
        // Intercambiar código por token de acceso
        fetch('/api/canva/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri: CANVA_CONFIG.redirectUri })
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('canva_access_token', data.access_token);
                console.log('✅ Canva Pro conectado exitosamente');
                updateCanvaStatus('connected');
            }
        })
        .catch(error => {
            console.error('❌ Error conectando con Canva:', error);
            showError('Error al conectar con Canva Pro');
        });
    }
    
    // Exportar funciones para uso global
    window.CanvaIntegration = {
        startOAuth: startCanvaOAuth,
        handleCallback: handleCanvaCallback,
        exportToCanva: exportToCanvaPro,
        config: CANVA_CONFIG
    };
}

// Inicializar integración con Canva al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvaIntegration();
});

console.log('🎨 Editor de Fotos E-commerce cargado correctamente');
```

## 📋 **Instrucciones Finales:**

1. **Ve a GitHub** → `script.js` → **Editar (✏️)**
2. **Selecciona TODO** el código existente (Ctrl+A)
3. **Borra todo** y **pégale** este código completo
4. **Commit** con mensaje: "Prueba de carga de imágenes - sin API"

**¿Ya hiciste el cambio? Cuando termines el commit, prueba cargar una imagen en tu aplicación y dime qué mensaje ves.**
