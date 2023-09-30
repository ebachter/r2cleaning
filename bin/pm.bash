#!/usr/bin/env bash

readonly TMPDIR=${TMPDIR:-/tmp}

readonly SELF_FILE="$(readlink -f "${BASH_SOURCE[0]}")"
readonly SELF_DIR="$(dirname "$SELF_FILE")"
readonly SELF="$(basename "$SELF_FILE")"
readonly PM_DIR=${PM_DIR:-"$SELF_DIR/pm.d"}

readonly APP_CMD=("$@")
readonly APP_CMD_HASH=$(echo "${APP_CMD[@]}" | cksum | cut -d' ' -f1)
readonly APP_PID_FILE="$TMPDIR/$APP_CMD_HASH.app.pid"
readonly APP_KILL_TIMEOUT=${APP_KILL_TIMEOUT:-15}

readonly APP_WATCHER_PID_FILE="$TMPDIR/$APP_CMD_HASH.appwatcher.pid"
readonly FILE_WATCHER_PID_FILE="$TMPDIR/$APP_CMD_HASH.filewatcher.pid"

HOOKS_COLLECTED=0
HOOKS=()
BEFORE_START_HOOKS=()
AFTER_SHUTDOWN_HOOKS=()

readonly DO_NOT_RESTART_FILE="$TMPDIR/$APP_CMD_HASH.donotrestart"

if [[ -n $PM_LOGTO ]]; then
   # Redirect stdout & stderr to the given log file
   exec &>"$PM_LOGTO"
fi

if [[ -n $PM_WATCH ]]; then
   # Convert to array
   WATCH_FILES=($PM_WATCH)
else
   WATCH_FILES=()
fi

trap 'kill_procs' EXIT

if [[ -f $DO_NOT_RESTART_FILE ]]; then
   rm "$DO_NOT_RESTART_FILE"
fi

function kill_procs() {
   # echo "[$SELF] Touching $DO_NOT_RESTART_FILE"
   touch "$DO_NOT_RESTART_FILE"

   kill_file_watcher
   kill_app
   kill_app_watcher
}

function start_app_watcher() {
   local APP_PID
   local APP_EXIT_CODE

   run_before_start_hooks

   until [[ -f $DO_NOT_RESTART_FILE ]]; do
      "${APP_CMD[@]}" &
      APP_PID=$!
      # echo "[$SELF] Writing app PID $APP_PID to $APP_PID_FILE"
      echo "$APP_PID" >"$APP_PID_FILE"
      # echo "[$SELF] Waiting for app PID $APP_PID"
      wait "$APP_PID"
      APP_EXIT_CODE=$?
      echo "[$SELF] Process exited with code $APP_EXIT_CODE"
      if [[ ! -f $DO_NOT_RESTART_FILE ]]; then
         sleep 1
      fi
   done

   run_after_shutdown_hooks
}

function kill_app_watcher() {
   # echo "[$SELF] Killing app watcher"
   kill_gently "$APP_WATCHER_PID_FILE" 3
}

function kill_app() {
   # echo "[$SELF] Killing application"
   kill_gently "$APP_PID_FILE" "$APP_KILL_TIMEOUT"
}

#
# ARG 1 -> PID file
# ARG 2 -> Kill timeout in seconds
# ARG 3 -> Signal, e.g. INT, HUP, KILL (default is INT)
#
function kill_gently() {
   local PID_FILE="$1"
   local KILL_TIMEOUT="$2"
   local SIG=${3:-INT}

   local PID
   local KILL_CHECK_COUNT
   local KILL_CHECK_COUNT_LIMIT=$((KILL_TIMEOUT * 10))

   if [[ ! -f $PID_FILE ]]; then
      return
   fi

   PID=$(cat "$PID_FILE")
   if [[ -z $PID ]]; then
      return
   fi

   echo "[$SELF] Sending SIG${SIG} to PID $PID"
   kill -"$SIG" "$PID" 2>/dev/null
   KILL_CHECK_COUNT=0
   while true; do
      if [[ ! -d /proc/$PID ]]; then
         break
      fi
      KILL_CHECK_COUNT=$((KILL_CHECK_COUNT + 1))
      if [[ $KILL_CHECK_COUNT -eq "$KILL_CHECK_COUNT_LIMIT" ]]; then
         # echo "[$SELF] Sending SIGKILL to $PID"
         kill -KILL "$PID" 2>/dev/null
         break
      fi
      sleep 0.5
   done
}

function extract_hook_name() {
   basename "$1" |
      sed -E 's/^[0-9]+-//' |
      sed -E 's/\.bash$//' |
      sed -E 's/[^a-zA-Z0-9]+/_/g'
}

function collect_hooks() {
   local HOOK_FILE
   local HOOK_NAME

   if [[ $HOOKS_COLLECTED == 1 ]]; then
      return
   fi

   HOOKS_COLLECTED=1

   for HOOK_FILE in "$PM_DIR"/hooks/*.bash; do
      [[ -f $HOOK_FILE ]] || continue

      HOOK_NAME=$(extract_hook_name "$HOOK_FILE")
      [[ -n "$HOOK_NAME" ]] || continue

      # shellcheck disable=SC1090
      source "$HOOK_FILE"
      HOOKS=("${HOOKS[@]}" "$HOOK_NAME")
   done
}

function run_before_start_hooks() {
   local HOOK_NAME
   local BEFORE_START_HOOK_FUNCTION
   local AFTER_SHUTDOWN_HOOK_FUNCTION

   collect_hooks

   for HOOK_NAME in "${HOOKS[@]}"; do
      BEFORE_START_HOOK_FUNCTION="${HOOK_NAME}_before_start"
      if command -pv "$BEFORE_START_HOOK_FUNCTION" &>/dev/null; then
         echo "[$SELF] Running hook $BEFORE_START_HOOK_FUNCTION"
         if $BEFORE_START_HOOK_FUNCTION; then
            AFTER_SHUTDOWN_HOOK_FUNCTION="${HOOK_NAME}_after_shutdown"
            if command -pv "$AFTER_SHUTDOWN_HOOK_FUNCTION" &>/dev/null; then
               AFTER_SHUTDOWN_HOOKS=(
                  "$AFTER_SHUTDOWN_HOOK_FUNCTION"
                  "${AFTER_SHUTDOWN_HOOKS[@]}"
               )
            fi
         fi
      fi
   done
}

function run_after_shutdown_hooks() {
   local AFTER_SHUTDOWN_HOOK_FUNCTION

   collect_hooks

   for AFTER_SHUTDOWN_HOOK_FUNCTION in "${AFTER_SHUTDOWN_HOOKS[@]}"; do
      echo "[$SELF] Running hook $AFTER_SHUTDOWN_HOOK_FUNCTION"
      $AFTER_SHUTDOWN_HOOK_FUNCTION
   done
}

function wait_for_file_change() {
   inotifywait --quiet --recursive "${WATCH_FILES[@]}" --event close_write &>/dev/null
}

function start_file_watcher() {
   while wait_for_file_change || true; do
      kill_app
      sleep 0.5
   done
}

function kill_file_watcher() {
   # echo "[$SELF] Killing watcher"
   kill_gently "$FILE_WATCHER_PID_FILE" 3 KILL
}

if [[ "${#WATCH_FILES[@]}" -gt 0 ]]; then
   start_file_watcher &
   FILE_WATCHER_PID=$!
   # echo "[$SELF] Writing file watcher PID $FILE_WATCHER_PID to $FILE_WATCHER_PID_FILE"
   echo "$FILE_WATCHER_PID" >"$FILE_WATCHER_PID_FILE"
fi

start_app_watcher &
APP_WATCHER_PID=$!
# echo "[$SELF] Writing file app watcher PID $APP_WATCHER_PID to $APP_WATCHER_PID_FILE"
echo "$APP_WATCHER_PID" >"$APP_WATCHER_PID_FILE"

wait $(jobs -pr)
