# Nombre del proyecto
NAME = transcendence

# Colores para la terminal
GREEN  = \033[0;32m
RED    = \033[0;31m
YELLOW = \033[0;33m
RESET  = \033[0m

ENV_FILE = --env-file backend/.env

all: up migrate

# Levanta los contenedores en segundo plano y construye si es necesario
up:
	@echo "$(GREEN)Levantando servicios de $(NAME)...$(RESET)"
	docker-compose $(ENV_FILE) up -d --build --wait

# Detiene los contenedores
down:
	@echo "$(RED)Deteniendo servicios...$(RESET)"
	docker-compose $(ENV_FILE) down

# Detiene y borra contenedores, volúmenes y redes huérfanas
clean:
	@echo "$(RED)Limpiando contenedores y volúmenes...$(RESET)"
	docker-compose $(ENV_FILE) down -v --remove-orphans || true
	docker network prune -f || true

# Rebuild completo desde cero
re: clean up migrate

# Ejecuta las migraciones
migrate:
	@echo "$(YELLOW)Esperando un momento para asegurar la conexión...$(RESET)"
	@sleep 15
	@echo "$(YELLOW)Ejecutando migraciones...$(RESET)"
	docker exec -it transcendence_backend php artisan migrate:fresh --seed

# Instala dependencias de Composer y ajusta permisos
install:
	docker exec -it transcendence_backend composer install
	docker exec -it transcendence_backend php artisan key:generate
	docker exec -it transcendence_backend chmod -R 775 storage bootstrap/cache

# Ver logs en tiempo real
logs:
	docker-compose $(ENV_FILE) logs -f

# Entrar a la terminal del backend
shell-back:
	docker exec -it transcendence_backend sh

# Entrar a la terminal del frontend
shell-front:
	docker exec -it transcendence_frontend sh

# Ver estado de los contenedores
ps:
	docker-compose $(ENV_FILE) ps

.PHONY: all up down clean re migrate install logs shell-back shell-front ps