#!/usr/bin/env bash

readonly MYSQL_HOST=db
readonly MYSQL_USER=root
readonly MYSQL_PASS=soeinmisst
readonly SELF_DIR="$(dirname ${BASH_SOURCE[0]})"

function dbexec() {
   docker exec \
      -i \
      -e MYSQL_PWD="$MYSQL_PASS" \
      r2ecosystem-db-1 \
      mysql \
      --host="$MYSQL_HOST" \
      --user="$MYSQL_USER"
}

# sed 's/USE `r2db`;/USE `r2db`;/' |
cat "$SELF_DIR/db-dump/r2db-data.sql" | dbexec
