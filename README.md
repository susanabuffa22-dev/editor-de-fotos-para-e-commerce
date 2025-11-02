# 🎨 Editor de Fotos E-commerce con Integración Canva Pro

Una aplicación web profesional para editar fotos de productos con herramientas especializadas para e-commerce, integración con Google AI y conectividad con Canva Pro.

## ✨ Características Principales

### 🔧 Herramientas de Edición
- **Fondo Blanco**: Convierte el fondo de la imagen a blanco profesional
- **Formato Cuadrado**: Ajusta la imagen a formato cuadrado ideal para e-commerce
- **Sonreír**: Mejora la expresión facial para fotos de producto
- **Virtual Try-On**: Combina imagen de persona con prenda de ropa de manera realista

### 🎯 Flujo de Trabajo Específico
1. **Inicio**: Todos los controles deshabilitados hasta cargar imagen principal
2. **Carga de Persona**: Habilita herramientas tras cargar imagen
3. **Herramientas Estándar**: Utilizan solo imagen de persona
4. **Virtual Try-On**: Requiere imagen de persona + prenda
5. **Exportación**: Descarga local o envío directo a Canva Pro

### 🎨 Diseño Visual
- **Colores**: Botones coral (#FF6B6B) y fondo blanco roto (#FAFAFA)
- **Diseño**: Minimalista y profesional para e-commerce
- **Responsivo**: Optimizado para desktop, tablet y móvil
- **Accesible**: Cumple estándares WCAG AA

### 🔗 Integración Canva Pro
- Conectividad OAuth con Canva Pro
- Exportación directa de imágenes editadas
- Estado de conexión visual con indicadores
- Desconexión segura

## 🚀 Configuración Inicial

### 1. API Key de Google AI
```javascript
// En script.js, línea 9
const CONFIG = {
    API_KEY: "TU_API_KEY_AQUI", // 👈 CAMBIAR AQUÍ
    // ...
};
```

### 2. Configuración Canva Pro (Opcional)
```javascript
// En script.js, función initializeCanvaIntegration
const CANVA_CONFIG = {
    clientId: "TU_CANVA_CLIENT_ID", // 👈 CAMBIAR AQUÍ
    clientSecret: "TU_CANVA_CLIENT_SECRET", // 👈 CAMBIAR AQUÍ
    redirectUri: window.location.origin + "/canva-callback",
    scope: "design:read design:write"
};
```

## 📋 Instrucciones de Uso

### 📸 Paso 1: Cargar Imagen Principal
1. Arrastra una imagen o haz clic en "Carga tu imagen (Persona)"
2. Formatos soportados: JPG, PNG hasta 10MB
3. Los controles se habilitarán automáticamente

### 🛠️ Paso 2: Elegir Herramienta
**Herramientas Estándar** (1 imagen):
- **Fondo Blanco**: Fondo limpio y profesional
- **Formato Cuadrado**: Optimizado para redes sociales
- **Sonreír**: Mejora la expresión facial

**Virtual Try-On** (2 imágenes):
1. Cargar imagen de prenda (opcional)
2. Clic en "Poner Ropa"
3. La IA combinará ambas imágenes

### 📥 Paso 3: Exportar Resultado
**Opciones de Descarga**:
- **Descargar**: Guardar imagen en dispositivo
- **Enviar a Canva Pro**: Exportar directamente a Canva (requiere conexión)
- **Generar Otra Vez**: Crear variación del resultado actual

## 🔧 Funciones Técnicas

### Manejo de Errores
- **Error 403**: API Key inválida o no habilitada
- **Filtros de Seguridad**: Contenido bloqueado por la IA
- **Sin Imagen**: Respuesta de API sin imagen válida

### API Integrations
**Google AI**:
- Modelo: Gemini 1.5 Flash
- Soporte: Imágenes base64
- Límite: 8K tokens de salida

**Canva Pro** (Opcional):
- OAuth 2.0
- Permisos: design:read, design:write
- API REST para upload de diseños

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- 💻 **Desktop**: Experiencia completa
- 📱 **Móvil**: Layout adaptativo
- 📟 **Tablet**: Diseño intermedio

## 🎨 Personalización

### Cambiar Colores
```css
/* En styles.css */
:root {
    --primary-500: #FF6B6B;     /* Coral para botones */
    --neutral-50: #FAFAFA;      /* Blanco roto para fondo */
}
```

### Agregar Nuevas Herramientas
```javascript
// En script.js, agregar botón HTML + evento
<button class="tool-btn" onclick="standardTask('tu-prompt-aqui')">
    <span>Tu Herramienta</span>
</button>
```

### Personalizar Prompts del Sistema
```javascript
// En script.js
SYSTEM_PROMPTS: {
    standard: `Tu prompt personalizado aquí...`
}
```

## 🔒 Seguridad y Privacidad

- **Imágenes**: Procesadas localmente, no almacenadas en servidor
- **API Keys**: Configuradas localmente, no transmitidas
- **Canva**: Conexión OAuth segura con tokens temporales
- **Datos**: No se guardan imágenes de usuario en la aplicación

## 🐛 Solución de Problemas

### Problema: Controles deshabilitados
**Solución**: Cargar imagen de persona primero

### Problema: Error 403 API
**Solución**: Verificar API Key de Google AI en script.js

### Problema: Canva no se conecta
**Solución**: 
1. Verificar client ID y secret
2. Configurar redirect URI en Canva Developer
3. Verificar scopes: "design:read design:write"

### Problema: Virtual try-on no funciona
**Solución**: 
1. Cargar ambas imágenes (persona + prenda)
2. Verificar formato de imágenes (JPG/PNG)
3. Usar imágenes de buena calidad

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- Revisar documentación arriba
- Verificar configuración de API keys
- Comprobar compatibilidad de navegador

---

**Desarrollado con ❤️ para profesionales de e-commerce**