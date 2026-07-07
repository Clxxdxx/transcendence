**Despliegue producción — ELK (infra/logging)**

Breve: instrucciones mínimas para dejar el stack de logging listo en producción usando `infra/logging/docker-compose.prod.yml`.

Requisitos

Credenciales desde `.env` raíz

En esta implementación los contenedores de `infra/logging` leen las credenciales desde el archivo `.env` en la raíz del repo (mismo comportamiento que el `docker-compose.yml` principal). Docker Compose no pedirá las credenciales interactivamente; debes colocarlas en el `.env` antes de arrancar.

Ejemplo: añade las siguientes variables al `.env` en la raíz del repo:

```ini
# credenciales ELK
ELASTIC_PASSWORD=S3cuReElasticP4ssw0rd
ES_JAVA_OPTS=-Xms1g -Xmx1g
```

Protege el `.env` y no lo subas al repositorio si contiene secretos.

Si prefieres usar `docker secret` en Swarm más adelante, puedo añadir esa opción en el compose y en la documentación.

Certificados TLS
  - `infra/logging/elasticsearch/certs/` (certs que use ES)
  - `infra/logging/kibana/config/` (cert y key para Kibana)

Red Docker

```bash
docker network create transcendence_net || true
```

Comando de despliegue (desde la raíz del repo)

```bash
docker compose -f docker-compose.yml -f infra/logging/docker-compose.prod.yml up -d
```

Makefile
-----
Se añadieron objetivos `make` en la raíz para facilitar el despliegue:

- `make logs-up` — crea la red (si no existe) y levanta ELK usando el `.env` raíz.
- `make up-with-logs` — levanta la app principal y el stack de logs juntos.
- `make logs-init` — ejecuta `infra/logging/create_resources.sh` para crear ILM, plantillas e importar dashboards (ejecuta localmente y asume que `.env` tiene las credenciales necesarias).

Ejemplo desde la raíz:

```bash
make logs-up
make logs-init
```

Notas operativas rápidas

Soporte
