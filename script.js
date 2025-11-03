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
                
