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
