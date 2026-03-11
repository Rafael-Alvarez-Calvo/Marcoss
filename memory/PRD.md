# Marcoss Peluquería-Barbería - PRD

## Problema Original
Crear un sitio web moderno, profesional y optimizado para SEO local para una barbería tradicional llamada Marcoss Peluquería-Barbería, ubicada en Madrid (Chamberí).

## Información del Negocio
- **Nombre**: Marcoss Peluquería-Barbería
- **Dirección**: Calle de Viriato, 32, Chamberí, 28010 Madrid
- **Teléfono**: 914 45 65 44
- **Valoración**: 4.9/5 (100 reseñas)
- **Horario**: Lun-Vie 9:30-13:45/16:30-20:30, Sáb 9:00-14:00, Dom Cerrado

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
- [x] SEO local optimizado

## Implementado (Fecha: 2025-03-11)
### Backend
- API FastAPI con MongoDB
- Endpoints: /api/services, /api/available-slots/{date}, /api/appointments
- Validación de horarios y disponibilidad
- CRUD de citas

### Frontend
- Landing page con 8 secciones
- Modal de reservas con 3 pasos
- Navegación con scroll suave
- Animaciones y micro-interacciones
- Diseño dark luxury con dorado

## Backlog (P0/P1/P2)
### P0 - Completado
- Sistema de reservas funcional
- Todas las secciones de la landing

### P1 - Futuro
- Panel de administración para gestionar citas
- Notificaciones por SMS/WhatsApp
- Integración con Google Calendar

### P2 - Mejoras
- Sistema de valoraciones interno
- Programa de fidelización
- Blog con consejos de cuidado
