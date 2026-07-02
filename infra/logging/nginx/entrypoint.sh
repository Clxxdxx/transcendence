#!/bin/sh
# Generar .htpasswd con credenciales básicas
# Credenciales: admin / admin_kibana_42
# En producción, cambiar con: docker exec transcendence_nginx_kibana htpasswd -c /etc/nginx/.htpasswd <usuario>

if [ ! -f /etc/nginx/.htpasswd ]; then
    # Hash bcrypt de 'admin_kibana_42'
    # Generar con: openssl passwd -apr1 admin_kibana_42
    echo "admin:\$apr1\$3k7x/vWx\$kLtDvUGo6H8HFe8CvFmSH/" > /etc/nginx/.htpasswd
    chmod 644 /etc/nginx/.htpasswd
    echo "[INFO] Created .htpasswd with credentials: admin / admin_kibana_42"
    echo "[INFO] Change password in production: docker exec transcendence_nginx_kibana htpasswd -c /etc/nginx/.htpasswd <user>"
fi

# Ejecutar nginx
exec nginx -g "daemon off;"
