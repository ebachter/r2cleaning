#!/usr/bin/env bash

source ../.env

readonly MYSQL_HOST=$MYSQL_ADMIN_HOST
readonly MYSQL_USER=$MYSQL_ADMIN_USER
readonly MYSQL_PASS=$MYSQL_ADMIN_PASS

function dbdump() {
   docker exec \
      -e MYSQL_PWD="$MYSQL_PASS" \
      r2cleaning-db-1 \
      mysqldump \
      --host="$MYSQL_HOST" \
      --user="$MYSQL_USER" \
      --skip-comments \
      "$@" |
      grep -vP '^\s*$'
}

for MYSQL_DATABASE in cleandb; do
   dbdump \
      --databases "$MYSQL_DATABASE" \
      --no-data \
      >../docker/db/docker-entrypoint-initdb.d/02-schema-$MYSQL_DATABASE.sql

   dbdump \
      --databases "$MYSQL_DATABASE" \
      --routines \
      --no-data \
      --no-create-db \
      --no-create-info \
      >../docker/db/docker-entrypoint-initdb.d/03-routines-$MYSQL_DATABASE.sql

   #   dbdump \
   #      --databases "$MYSQL_DATABASE" \
   #      --extended-insert \
   #      --no-create-db \
   #      --no-create-info \
   #      --complete-insert \
   #      >../docker/db/docker-entrypoint-initdb.d/03-data-$MYSQL_DATABASE.sql
done
