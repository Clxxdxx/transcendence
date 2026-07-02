# Nombre del proyecto
NAME = transcendence

# Colores para la terminal
GREEN  = \033[0;32m
RED    = \033[0;31m
YELLOW = \033[0;33m
RESET  = \033[0m

ENV_FILE = --env-file backend/.env

# dependiado si funciona docker compose version usar docker compose o docker-compose
DOCKER_COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")


all: secrets/kibana_htpasswd up migrate logs-init

# Genera el archivo de credenciales para Kibana si no existe
secrets/kibana_htpasswd:
	@mkdir -p secrets
	@echo "$(YELLOW)Configuración de acceso a Kibana$(RESET)"
	@printf "Usuario para Kibana: "; read USER; \
	printf "Contraseña para Kibana: "; stty -echo; read PASS; stty echo; echo; \
	docker run --rm httpd:alpine htpasswd -nb "$$USER" "$$PASS" > secrets/kibana_htpasswd
	@echo "$(GREEN)Credenciales guardadas. Acceso: https://localhost/kibana/$(RESET)"

# Levanta los contenedores en segundo plano y construye si es necesario
up:
	@echo "$(GREEN)Levantando servicios de $(NAME)...$(RESET)"
	$(DOCKER_COMPOSE) $(ENV_FILE) -f docker-compose.yml -f infra/logging/docker-compose.prod.yml up -d --build --wait
# cambiado para que sea adaptable a todas las versiones, claudio.

# Inicializa infraestructura ELK (índices, ILM policy, patrón Kibana)
logs-init:
	@echo "$(YELLOW)Inicializando infraestructura ELK...$(RESET)"
	docker cp infra/logging/. transcendence_backend:/tmp/logging
	docker exec transcendence_backend chmod +x /tmp/logging/create_resources.sh
	docker exec -e ES_HOST=http://elasticsearch:9200 -e KIBANA_HOST=http://kibana:5601 \
		-w /tmp/logging transcendence_backend sh /tmp/logging/create_resources.sh

# Detiene los contenedores
down:
	@echo "$(RED)Deteniendo servicios...$(RESET)"
	$(DOCKER_COMPOSE) $(ENV_FILE) -f docker-compose.yml -f infra/logging/docker-compose.prod.yml down
	@rm -f secrets/kibana_htpasswd
	@echo "$(YELLOW)Credenciales de Kibana eliminadas. Se pedirán en el próximo make.$(RESET)"

# Detiene y borra contenedores, volúmenes y redes huérfanas
clean:
	@echo "$(RED)Limpiando contenedores y volúmenes...$(RESET)"
	$(DOCKER_COMPOSE) $(ENV_FILE) -f docker-compose.yml -f infra/logging/docker-compose.prod.yml down -v --remove-orphans || true
	docker network prune -f || true
	@rm -f secrets/kibana_htpasswd
	@echo "$(YELLOW)Credenciales de Kibana eliminadas. Se pedirán en el próximo make.$(RESET)"

# Ejecuta las migraciones
migrate:
	@echo "$(YELLOW)Esperando un momento para asegurar la conexión...$(RESET)"
	@sleep 15
	@echo "$(YELLOW)Ejecutando migraciones...$(RESET)"
	docker exec -i transcendence_backend php artisan migrate:fresh --seed
	docker exec -u root transcendence_backend chmod -R 777 storage bootstrap/cache

# Instala dependencias de Composer y ajusta permisos
install:
	docker exec -i transcendence_backend composer install
	docker exec -i transcendence_backend php artisan key:generate
	docker exec -i transcendence_backend chmod -R 777 storage bootstrap/cache

# Ver logs en tiempo real
logs:
	$(DOCKER_COMPOSE) $(ENV_FILE) logs -f

# Entrar a la terminal del backend
shell-back:
	docker exec -it transcendence_backend sh

# Entrar a la terminal del frontend
shell-front:
	docker exec -it transcendence_frontend sh

# Ver estado de los contenedores
ps:
	$(DOCKER_COMPOSE) $(ENV_FILE) ps

.PHONY: all up down clean migrate install logs logs-init shell-back shell-front ps