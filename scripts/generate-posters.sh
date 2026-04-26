#!/bin/bash

# Script para generar posters PNG (primer frame) de cada GIF de ejercicios

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
GIF_DIR="$PROJECT_ROOT/src/assets/Ejercicios"
POSTER_DIR="$GIF_DIR/posters"

echo "Generando posters desde $GIF_DIR..."
echo "Destino: $POSTER_DIR"

count=0
for f in "$GIF_DIR"/*.gif; do
  if [ -f "$f" ]; then
    base=$(basename "$f" .gif)
    output="$POSTER_DIR/${base}.png"
    
    echo "Procesando: $base"
    ffmpeg -y -i "$f" -frames:v 1 -update 1 "$output" -loglevel error
    
    if [ $? -eq 0 ]; then
      count=$((count + 1))
    else
      echo "Error procesando $base"
    fi
  fi
done

echo "Completado. Se generaron $count posters PNG."
