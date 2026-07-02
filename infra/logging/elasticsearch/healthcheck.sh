#!/bin/bash
set -e

# Wait for Elasticsearch to respond
curl -sS -f --fail --basic -u elastic:"${ELASTIC_PASSWORD}" http://localhost:9200 > /dev/null

echo "Elasticsearch is healthy"
exit 0
