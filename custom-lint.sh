#!/bin/bash -eu
function should_fail() {
  oldopt=$-
  set +e
  "$@"
  ret=$?
  set -$oldopt
  return $(((!!$ret)^1))
}

echo -n "Should not contain IE8 reserved keywords..."
should_fail grep "\.catch" fingerprint2.js dist/fingerprint2.min.js --quiet
echo "ok"
