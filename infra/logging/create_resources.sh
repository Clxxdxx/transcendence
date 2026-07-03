#!/bin/sh
set -e
ES_HOST=${ES_HOST:-http://elasticsearch:9200}
KIBANA_HOST=${KIBANA_HOST:-http://kibana:5601}

wait_for() {
  url="$1"
  max_attempts=${2:-60}
  attempt=0
  until curl -s "$url" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
      echo "Timeout waiting for $url after $max_attempts attempts"
      return 1
    fi
    echo "Waiting for $url... (attempt $attempt/$max_attempts)"
    sleep 2
  done
}

# wait for Elasticsearch
wait_for "$ES_HOST"

echo "Creating ILM policy..."
curl -s -X PUT "$ES_HOST/_ilm/policy/laravel-logs-policy" \
  -H 'Content-Type: application/json' \
  -d @./elasticsearch/ilm_policy.json

echo "Uploading index template..."
curl -s -X PUT "$ES_HOST/_index_template/laravel-logs-template" \
  -H 'Content-Type: application/json' \
  -d @./elasticsearch/index_template.json

# create initial concrete index with alias
if [ "$(curl -s -o /dev/null -w '%{http_code}' $ES_HOST/laravel-logs-000001)" -ne 200 ]; then
  echo "Creating initial index laravel-logs-000001 with alias laravel-logs-write"
  curl -s -X PUT "$ES_HOST/laravel-logs-000001" \
    -H 'Content-Type: application/json' \
    -d '{"aliases": {"laravel-logs-write": {}}, "settings": {"index.lifecycle.name":"laravel-logs-policy","index.lifecycle.rollover_alias":"laravel-logs-write"}}'
fi

# wait for Kibana to be truly ready (status = available)
echo "Waiting for Kibana API to be ready..."
attempt=0
until curl -s "$KIBANA_HOST/kibana/api/status" | grep -q '"available"'; do
  attempt=$((attempt + 1))
  if [ $attempt -gt 90 ]; then
    echo "Warning: Kibana not available after 90 attempts, continuing anyway..."
    break
  fi
  echo "Waiting for Kibana... (attempt $attempt/90)"
  sleep 2
done

# create index pattern in Kibana (with error handling)
echo "Creating Kibana index pattern..."
curl -s -X POST "$KIBANA_HOST/kibana/api/saved_objects/index-pattern/laravel-logs-pattern" \
  -H 'kbn-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '{"attributes":{"title":"laravel-logs-*","timeFieldName":"@timestamp"}}' || echo "Warning: Could not create index pattern in Kibana"



echo "✓ Resources initialization complete."
