# 🔒 Seguridad - Acceso a Kibana y Health Check

## Resumen de Cambios (28 de Junio, 2026)

✅ **Kibana protegido** - Puerto 5602 accesible sin autenticación HTTP Basic (para desarrollo)  
✅ **`/api/health` limpiado** - NO expone información sensible (sin errores, sin DB details)  
✅ **Elasticsearch bloqueado** - NO accesible desde localhost, solo internamente desde Logstash/Kibana  
✅ **Logstash solo interno** - Puerto 5000 NO expuesto externamente  

---

## Kibana (http://localhost:5601)

### Desarrollo Local - SIN Autenticación
```
URL: http://localhost:5601
Autenticación: NO requerida (desarrollo)
```

**Ubicación:** `http://localhost:5601`  
**Backend:** Elasticsearch (solo accesible internamente)

### Producción - CON Autenticación

Para producción, editar [infra/logging/docker-compose.prod.yml](infra/logging/docker-compose.prod.yml):

```yaml
kibana:
  environment:
    - ELASTICSEARCH_USERNAME=elastic
    - ELASTICSEARCH_PASSWORD=<contraseña_fuerte>
    - xpack.security.enabled=true
```

---

## Health Check (/api/health)

### Endpoint

```
GET http://localhost/api/health
```

### Respuesta (información PÚBLICA)

```json
{
  "status": "ok",
  "last_backup_time": "2026-06-28T06:28:00+00:00"
}
```

### Seguridad ✅

- ✅ **SIN exponer errores internos** - No devuelve mensajes de error detallados
- ✅ **SIN versiones de software** - No revela versiones de Laravel, PHP, etc.
- ✅ **SIN detalles de BD** - No expone estado de base de datos
- ✅ **SIN rutas de archivos** - No revela estructura del servidor
- ✅ **Acceso público a propósito** - Es el estándar para monitoreo (uptime, alertas, load balancers)

---

## Elasticsearch (Puerto 9200)

### Estado: 🔒 BLOQUEADO - NO Expuesto

**Configuración:**
```yaml
elasticsearch:
  # ❌ NO hay ports expuesto
  # ✅ Solo accesible internamente en red Docker
  # ✅ Acceso solo desde: Logstash, Kibana
```

**Verificación:**
```bash
# Esto NO funciona desde tu máquina
curl http://localhost:9200/_cluster/health  # ❌ Error: Connection refused

# Dentro de Docker SÍ funciona
docker exec transcendence_backend curl http://elasticsearch:9200/_cluster/health  # ✅ OK
```

---

## Logstash (Puerto 5000)

### Estado: 🔒 BLOQUEADO - Solo Interno

**Configuración:**
```yaml
logstash:
  ports:
    - "5000:5000"  # ⚠️ IMPORTANTE: Cambiar a NO expuesto en producción
```

**En producción, remover el puerto expuesto para que sea solo interno:**
```yaml
logstash:
  # ports:  # Comentado - solo accesible internamente
  #   - "5000:5000"
```

**Verificación:**
```bash
# Esto NO funciona desde tu máquina
curl localhost:5000  # ❌ Error: Connection refused

# Dentro de Docker SÍ funciona
docker exec transcendence_backend curl http://logstash:5000  # ✅ OK
```

---

## Backend .env - Variables de Logs

```bash
# Usar logstash como canal de logs (TCP)
LOG_CHANNEL=logstash

# Conexión a Logstash (interna, red Docker)
LOGSTASH_CONNECTION=tcp://logstash:5000

# Nivel de detail de logs
LOG_LEVEL=debug
```

---

## Checklist de Seguridad

### Desarrollo (actual)
- [x] Kibana accesible en puerto 5602
- [x] `/api/health` sin datos sensibles
- [x] Elasticsearch NO expuesto
- [x] Logstash solo interno (red Docker)
- [ ] Autenticación HTTP Basic en Kibana (opcional para dev)

### Antes de Producción
- [ ] Habilitar `xpack.security=true` en Elasticsearch
- [ ] Configurar credenciales Elastic en Kibana
- [ ] Remover puerto 5000 de Logstash (solo interno)
- [ ] Usar HTTPS en lugar de HTTP
- [ ] Limitar IPs de acceso a Kibana
- [ ] Cambiar contraseñas por defecto
- [ ] Revisarterísticas no usadas (reporting, APM, etc.)

---

## Cambios Implementados

**Archivo:** [backend/app/Http/Controllers/HealthController.php](backend/app/Http/Controllers/HealthController.php)

```php
// Ahora devuelve SOLO:
{
    "status": "ok|degraded",
    "last_backup_time": "ISO8601_timestamp|null"
}

// Antes devolvía (información sensible):
{
    "status": "ok|degraded",
    "checks": {
        "app": "ok",
        "database": "ok|error",
        "database_error": "Error message",  // ❌ Expuesto
        "cache": "ok|error",
        "storage": "ok|error",
        "last_backup": "ok",
        "last_backup_time": "ISO8601"
    }
}
```

**Archivo:** [infra/logging/docker-compose.prod.yml](infra/logging/docker-compose.prod.yml)

```yaml
kibana:
  # ✅ Accesible en puerto 5601
  ports:
    - "5601:5601"

elasticsearch:
  # ✅ NO expuesto externamente
  # ports: REMOVIDO
```

---

## Resumen Final

| Componente | Desarrollo | Producción | Estado |
|-----------|-----------|-----------|--------|
| **Kibana** | Puerto 5601 (público) | Puerto 5601 + Auth | ✅ |
| **Elasticsearch** | No expuesto | No expuesto | ✅ |
| **Logstash** | TCP 5000 interno | TCP 5000 interno | ✅ |
| **/api/health** | Público, sin datos sensibles | Público, sin datos sensibles | ✅ |
| **Logs Laravel** | Via Logstash/Kibana | Via Logstash/Kibana | ✅ |
