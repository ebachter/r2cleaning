#!/usr/bin/env bash

readonly MYSQL_HOST=db
readonly MYSQL_USER=root
readonly MYSQL_PASS=soeinmisst

function dbdump() {
   docker exec \
      -e MYSQL_PWD="$MYSQL_PASS" \
      r2ecosystem_db_1 \
      mysqldump \
      --host="$MYSQL_HOST" \
      --user="$MYSQL_USER" \
      --skip-comments \
      "$@" |
      grep -vP '^\s*$'
}

function dbexec() {
   docker exec \
      -i \
      -e MYSQL_PWD="$MYSQL_PASS" \
      r2ecosystem_db_1 \
      mysql \
      --host="$MYSQL_HOST" \
      --user="$MYSQL_USER"
}

dbexec <<<"
USE r2db;

DELETE FROM chats
WHERE @@hostname RLIKE '^[a-f0-9]{12}$';
"

for MYSQL_DATABASE in r2data; do
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

   dbdump \
      --databases "$MYSQL_DATABASE" \
      --extended-insert \
      --no-create-db \
      --no-create-info \
      --complete-insert \
      >../docker/db/docker-entrypoint-initdb.d/03-data-$MYSQL_DATABASE.sql
done
