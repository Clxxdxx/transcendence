#!/bin/bash
# Script para crear usuarios necesarios en Elasticsearch

set -e

# Wait for Elasticsearch to be ready
until curl -s -u elastic:${ELASTIC_PASSWORD} http://localhost:9200/_cluster/health | grep -q '\"status\"'; do
  echo "Waiting for Elasticsearch to be ready..."
  sleep 2
done

echo "Elasticsearch is ready!"

# Create kibana_admin user if it doesn't exist
echo "Creating kibana_admin user..."
curl -s -X POST http://localhost:9200/_security/user/kibana_admin \
  -u elastic:${ELASTIC_PASSWORD} \
  -H 'Content-Type: application/json' \
  -d '{
    "password": "kibana_password",
    "roles": ["kibana_system", "manage_index_templates", "monitor", "kibana_admin"],
    "full_name": "Kibana Admin"
  }' | grep -q "created" || true

echo "kibana_admin user ready!"
