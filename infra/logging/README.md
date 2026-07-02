Setup mínimo ELK para desarrollo

Instrucciones rápidas:

1. Desde la carpeta `infra/logging` levantar la pila:

```bash
docker compose up -d
```

2. Verificar que Elasticsearch esté listo:

```bash
curl http://localhost:9200/
```

3. Abrir Kibana en http://localhost:5601

Notas:
- Esta configuración es para desarrollo local: `xpack.security` está deshabilitado. Para producción debes activar TLS y autenticación.
- Logstash escucha en el puerto TCP 5000 codecs JSON. Laravel debe enviar JSON a `logstash:5000`.
- Implementar ILM (Index Lifecycle Management) y snapshots en ES para políticas de retención.
