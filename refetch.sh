#!/bin/sh

echo "Refetching server changes"

git fetch
git reset --hard origin/master

npm install