#!/bin/bash
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Running seeders..."
npx sequelize-cli db:seed:all

echo "Starting application..."
node src/index.js
