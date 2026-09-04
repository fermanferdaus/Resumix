#!/bin/sh
set -e

# Inisialisasi direktori uploads dengan kepemilikan node:node (UID 1000)
mkdir -p /app/public/uploads/avatars
chown -R node:node /app/public/uploads
chmod -R 775 /app/public/uploads

# Jalankan proses berikutnya sebagai user non-root node
exec su-exec node "$@"