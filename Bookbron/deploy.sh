#!/bin/bash

# Environment o'zgaruvchilarini yuklash
source .env

# Docker image'larni yangilash
echo "Docker image'larni yangilash..."
docker-compose build

# Eski containerlarni to'xtatish
echo "Eski containerlarni to'xtatish..."
docker-compose down

# Yangi containerlarni ishga tushirish
echo "Yangi containerlarni ishga tushirish..."
docker-compose up -d

# Mongodb backup
echo "MongoDB backup yaratish..."
docker exec bookbron_mongodb_1 mongodump --out /data/backup/$(date +%Y%m%d)

# Log fayllarni tozalash
echo "Log fayllarni tozalash..."
find ./logs -type f -name "*.log" -mtime +7 -exec rm {} \;

echo "Deployment muvaffaqiyatli yakunlandi!" 