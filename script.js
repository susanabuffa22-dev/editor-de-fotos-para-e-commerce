 // Editor de Fotos para E-commerce
// Versión compatible con CSP (sin eval, new Function, setTimeout con string)

const API_KEY = "AIzaSyBAuTlMG2kQWBIpaylzCUhGJopB2JcNh6I";

// Elementos DOM
const elements = {
    // Person Image
    personImage: document.getElementById('personImage'),
    personInput: document.getElementById('personInput'),
    personPreview: document.getElementById('personPreview'),
    
    // Garment Image
    garmentImage: document.getElementById('garmentImage'),
    garmentInput: document.getElementById('garmentInput'),
    garmentPreview: document.getElementById('garmentPreview'),
    
    // Tools
    btnBackground: document.getElementById('btnBackground'),
    btnColor: document.getElementById('btnColor'),
    btnEnhance: document.getElementById('btnEnhance'),
    btnMakeup: document.getElementById('btnMakeup'),
    
    // Display areas
    originalImage: document.getElementById('originalImage'),
    editedImage: document.getElementById('editedImage'),
    
    // Loader and buttons
    loader: document.getElementById('loader'),
    btnDownload: document.getElementById('btnDownload'),
    btnRetry: document.getElementById('btnRetry'),
    
    // Error message
    errorMessage: document.getElementById('errorMessage')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showLoader(false);
    console.log('🚀 Editor de fotos inicializado correctamente');
});

// Setup event listeners
function setupEventListeners() {
    // Image uploads
    elements.personInput.addEventListener('change', handlePersonImageUpload);
    elements.garmentInput.addEventListener('change', handleGarmentImageUpload);
    
    // Tool buttons
    elements.btnBackground.addEventListener('click', function() { callApi('white'); });
    elements.btnColor.addEventListener('click', function() { callApi('color'); });
    elements.btnEnhance.addEventListener('click', function() { callApi('enhance'); });
    elements.btnMakeup.addEventListener('click', function() { callApi('makeup'); });
    
    // Action buttons
    elements.btnDownload.addEventListener('click', downloadImage);
    elements.btnRetry.addEventListener('click', retry);
}

// Handle person image upload
function handlePersonImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('La imagen es demasiado grande. Máximo 10MB.', 'error');
        return;
    }
    
    showLoader(true);
    
    fileToBase64(file).then(function(base64) {
        const dataUrl = "data:" + file.type + ";base64," + base64;
        elements.personImage.src = dataUrl;
        elements.personPreview.style.display = 'block';
        elements.originalImage.innerHTML = '<img src="' + dataUrl + '" alt="Imagen original">';
        
        showLoader(false);
        showError('Imagen de persona cargada exitosamente', 'success');
        console.log('✅ Persona cargada correctamente');
        
        // Enable tool buttons
        enableTools(true);
    }).catch(function(error) {
        showLoader(false);
        showError('Error al cargar la imagen de persona', 'error');
        console.error('❌ Error al cargar persona:', error);
    });
}

// Handle garment image upload
function handleGarmentImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('La imagen es demasiado grande. Máximo 10MB.', 'error');
        return;
    }
    
    showLoader(true);
    
    fileToBase64(file).then(function(base64) {
        const dataUrl = "data:" + file.type + ";base64," + base64;
        elements.garmentImage.src = dataUrl;
        elements.garmentPreview.style.display = 'block';
        
        showLoader(false);
        showError('Imagen de prenda cargada exitosamente', 'success');
        console.log('✅ Prenda cargada correctamente');
        
        // Enable tool buttons
        enableTools(true);
    }).catch(function(error) {
        showLoader(false);
        showError('Error al cargar la imagen de prenda', 'error');
        console.error('❌ Error al cargar prenda:', error);
    });
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function() {
            // Remove data URL prefix if present
            let base64 = reader.result;
            if (base64.startsWith('data:')) {
                base64 = base64.split(',')[1];
            }
            resolve(base64);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Convert data URL to base64
function dataUrlToBase64(dataUrl) {
    return dataUrl.split(',')[1];
}

// Call API for image editing
async function callApi(toolType) {
    if (!elements.personImage || !elements.personImage.src) {
        showError('Por favor carga una imagen de persona primero', 'error');
        return;
    }
    
    showLoader(true);
    showError('', '');
    
    let prompt = '';
    switch(toolType) {
        case 'white':
            prompt = 'Cambia el fondo a blanco puro, manteniendo la persona intacta';
            break;
        case 'color':
            prompt = 'Convierte la imagen a color manteniendo todos los detalles';
            break;
        case 'enhance':
            prompt = 'Mejora la calidad y nitidez de la imagen, realza los detalles';
            break;
        case 'makeup':
            prompt = 'Aplica maquillaje natural y realza la belleza de la persona';
            break;
        default:
            showError('Tipo de herramienta no válida', 'error');
            return;
    }
    
    const personImageBase64 = dataUrlToBase64(elements.personImage.src);
    
    const payload = {
        contents: [{
            parts: [
                {
                    text: prompt
                },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: personImageBase64
                    }
                }
            ]
        }],
        generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048
        }
    };
    
    try {
        console.log('🔄 Enviando solicitud a Google AI...');
        
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('📡 Respuesta recibida - Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error de API:', errorData);
            throw new Error('Error de API: ' + response.status + ' - ' + (errorData.error?.message || 'Error desconocido'));
        }
        
        const data = await response.json();
        console.log('📦 Datos de respuesta recibidos:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const textResponse = data.candidates[0].content.parts.find(function(part) { return part.text; });
            const imageResponse = data.candidates[0].content.parts.find(function(part) { return part.inline_data; });
            
            if (imageResponse && imageResponse.inline_data) {
                const imageBase64 = imageResponse.inline_data.data;
                const editedDataUrl = "data:image/jpeg;base64," + imageBase64;
                
                elements.editedImage.innerHTML = '<img src="' + editedDataUrl + '" alt="Imagen editada">';
                elements.btnDownload.disabled = false;
                elements.btnRetry.disabled = false;
                
                showError('Imagen editada exitosamente', 'success');
                console.log('✅ Imagen procesada correctamente');
            } else if (textResponse) {
                console.log('📝 Respuesta de texto:', textResponse.text);
                showError('Respuesta: ' + textResponse.text, 'info');
            } else {
                throw new Error('No se recibió imagen en la respuesta');
            }
        } else {
            throw new Error('Estructura de respuesta inesperada');
        }
        
    } catch (error) {
        console.error('❌ Error en callApi:', error);
        showError('Error al procesar la imagen: ' + error.message, 'error');
        
        // Fallback: show original image
        if (elements.personImage.src) {
            elements.editedImage.innerHTML = '<img src="' + elements.personImage.src + '" alt="Imagen original (sin procesar)">';
            elements.btnDownload.disabled = false;
            elements.btnRetry.disabled = false;
            showError('Mostrando imagen original debido al error de API', 'warning');
        }
    } finally {
        showLoader(false);
    }
}

// Enable/disable tool buttons
function enableTools(enabled) {
    elements.btnBackground.disabled = !enabled;
    elements.btnColor.disabled = !enabled;
    elements.btnEnhance.disabled = !enabled;
    elements.btnMakeup.disabled = !enabled;
}

// Download edited image
function downloadImage() {
    const editedImg = elements.editedImage.querySelector('img');
    if (!editedImg) {
        showError('No hay imagen editada para descargar', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'foto_editada_' + Date.now() + '.jpg';
    link.href = editedImg.src;
    link.click();
    
    showError('Imagen descargada exitosamente', 'success');
    console.log('💾 Imagen descargada');
}

// Retry image editing
function retry() {
    elements.editedImage.innerHTML = '';
    elements.btnDownload.disabled = true;
    elements.btnRetry.disabled = true;
    showError('Listo para procesar nuevamente', 'info');
    console.log('🔄 Modo retry activado');
}

// Show/hide loader
function showLoader(show) {
    if (show) {
        elements.loader.style.display = 'block';
    } else {
        elements.loader.style.display = 'none';
    }
}

// Show error/success message
function showError(message, type) {
    if (!elements.errorMessage) return;
    
    elements.errorMessage.textContent = message;
    elements.errorMessage.className = 'message ' + type;
    
    if (message) {
        elements.errorMessage.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds (CSP-safe)
        if (type === 'success') {
            setTimeout(function() {
                elements.errorMessage.style.display = 'none';
            }, 3000);
        }
    } else {
        elements.errorMessage.style.display = 'none';
    }
}
