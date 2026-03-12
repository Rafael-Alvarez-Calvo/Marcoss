# Marcoss Peluquería-Barbería - PRD

## Problema Original
Crear un sitio web moderno, profesional y optimizado para SEO local para una barbería tradicional llamada Marcoss Peluquería-Barbería, ubicada en Madrid (Chamberí).

## Información del Negocio
- **Nombre**: Marcoss Peluquería-Barbería
- **Dirección**: Calle de Viriato, 32, Chamberí, 28010 Madrid
- **Teléfono**: 914 45 65 44
- **Valoración**: 4.9/5 (100 reseñas)
- **Horario**: Lun-Vie 9:30-13:45/16:30-20:30, Sáb 9:00-14:00, Dom Cerrado

## Stack Tecnológico (Actualizado 2025-03-12)
- **Frontend**: React + TypeScript (.tsx)
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: MongoDB con Mongoose
- **Estilos**: Tailwind CSS

## User Personas
1. **Cliente local**: Hombre del barrio de Chamberí buscando barbería de confianza
2. **Nuevo cliente**: Persona que busca "barbería cerca de mí" en Google
3. **Cliente recurrente**: Usuario que necesita reservar cita fácilmente

## Requisitos Core (Implementados)
- [x] Landing page con todas las secciones
- [x] Hero section con imagen real de la barbería
- [x] Sección "Sobre nosotros" con valores
- [x] Carta de servicios con precios
- [x] Galería de imágenes (reales + stock)
- [x] Reseñas de clientes
- [x] Mapa de ubicación
- [x] Sistema de reserva de citas online
- [x] Botón de llamada fijo en móvil
- [x] Diseño responsive mobile-first
- [x] **Migración a TypeScript completada**
- [x] **Backend migrado a Node.js + Express**

## Implementado

### Fase 1 (2025-03-11)
- Landing page completa con FastAPI + React JS
- Sistema de reservas funcional

### Fase 2 (2025-03-12)
- Migración frontend a TypeScript (.tsx)
- Migración backend a Node.js + Express + TypeScript
- Recompilación y testing completo

## Archivos Clave
- `/app/backend/src/server.ts` - API Node.js
- `/app/frontend/src/pages/LandingPage.tsx` - Página principal
- `/app/frontend/src/components/BookingModal.tsx` - Sistema de reservas

## Backlog (P0/P1/P2)
### P1 - Futuro
- Panel de administración para gestionar citas
- Notificaciones por SMS/WhatsApp
- Integración con Google Calendar

### P2 - Mejoras
- Sistema de valoraciones interno
- Programa de fidelización
- Blog con consejos de cuidado

## Notas de Deployment
⚠️ **ADVERTENCIA**: El backend Node.js puede tener limitaciones de deployment en Emergent (stack no oficialmente soportado). Se recomienda verificar funcionalidad en producción.
