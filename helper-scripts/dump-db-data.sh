#!/usr/bin/env bash

readonly MYSQL_HOST=db
readonly MYSQL_USER=root
readonly MYSQL_PASS=soeinmisst
readonly SELF_DIR="$(dirname ${BASH_SOURCE[0]})"

function dbdump() {
   docker exec \
      -e MYSQL_PWD="$MYSQL_PASS" \
      r2ecosystem-db-1 \
      mysqldump \
      --host="$MYSQL_HOST" \
      --user="$MYSQL_USER" \
      --skip-comments \
      --complete-insert \
      "$@" |
      grep -vP '^\s*$'
}

function dbexec() {
   docker exec \
      -i \
      -e MYSQL_PWD="$MYSQL_PASS" \
      r2ecosystem-db-1 \
      mysql \
      --host="$MYSQL_HOST" \
      --user="$MYSQL_USER"
}

dbexec <<<"
USE r2db;

DELETE FROM chats
WHERE @@hostname RLIKE '^[a-f0-9]{12}$';
"

dbdump \
   --databases r2db \
   --extended-insert \
   --no-create-db \
   --no-create-info \
   --ignore-table=r2db.contracts_transactions \
   >"$SELF_DIR/db-dump/r2db-data.sql"
