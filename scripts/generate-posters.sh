#!/bin/bash

# Script para generar posters JPG (frame del medio) de cada video de ejercicios

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VIDEO_DIR="$PROJECT_ROOT/src/assets/Ejercicios/videos"
POSTER_DIR="$PROJECT_ROOT/src/assets/Ejercicios/posters"

echo "Generando posters desde $VIDEO_DIR..."
echo "Destino: $POSTER_DIR"

count=0
for f in "$VIDEO_DIR"/*.mp4; do
  if [ -f "$f" ]; then
    base=$(basename "$f" .mp4)
    output="$POSTER_DIR/${base}.jpg"

    echo "Procesando: $base"
    duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
    middle=$(echo "$duration / 2" | bc -l)
    ffmpeg -y -ss "$middle" -i "$f" -frames:v 1 -vf scale=240:240 -q:v 3 "$output" -loglevel error

    if [ $? -eq 0 ]; then
      count=$((count + 1))
    else
      echo "Error procesando $base"
    fi
  fi
done

echo "Completado. Se generaron $count posters JPG."
