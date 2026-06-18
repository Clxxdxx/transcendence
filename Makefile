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


all: up migrate

# Levanta los contenedores en segundo plano y construye si es necesario
up:
	@echo "$(GREEN)Levantando servicios de $(NAME)...$(RESET)"
	$(DOCKER_COMPOSE) $(ENV_FILE) up -d --build --wait
# cambiado para que sea adaptable a todas las versiones, claudio.

# Detiene los contenedores
down:
	@echo "$(RED)Deteniendo servicios...$(RESET)"
	$(DOCKER_COMPOSE) $(ENV_FILE) down

# Detiene y borra contenedores, volúmenes y redes huérfanas
clean:
	@echo "$(RED)Limpiando contenedores y volúmenes...$(RESET)"
	$(DOCKER_COMPOSE) $(ENV_FILE) down -v --remove-orphans || true
	docker network prune -f || true

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

.PHONY: all up down clean migrate install logs shell-back shell-front ps