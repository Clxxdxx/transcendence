# Nombre del proyecto
NAME = transcendence

# Colores para la terminal
GREEN = \033[0;32m
RED = \033[0;31m
RESET = \033[0m

all: up

# Levanta los contenedores en segundo plano y construye si es necesario
up:
	@echo "$(GREEN)Levantando servicios de $(NAME)...$(RESET)"
	docker-compose up -d --build

# Detiene los contenedores
down:
	@echo "$(RED)Deteniendo servicios...$(RESET)"
	docker-compose down

# Detiene y borra volúmenes
clean:
	@echo "$(RED)Limpiando contenedores y volúmenes...$(RESET)"
	docker-compose down -v

# Reinicia los contenedores
re: down up

# Ejecuta las migraciones
migrate:
	@echo "$(GREEN)Ejecutando migraciones...$(RESET)"
	docker exec -it transcendence_backend php artisan migrate

# Instala dependencias de Composer y ajusta permisos
install:
	docker exec -it transcendence_backend composer install
	docker exec -it transcendence_backend php artisan key:generate
	docker exec -it transcendence_backend chmod -R 777 storage bootstrap/cache

# Ver logs en tiempo real
logs:
	docker-compose logs -f

# Entrar a la terminal del backend
shell-back:
	docker exec -it transcendence_backend sh

# Entrar a la terminal del frontend
shell-front:
	docker exec -it transcendence_frontend sh

# Ver estado de los contenedores
ps:
	docker-compose ps

.PHONY: all up down clean re migrate install logs shell-back shell-front ps