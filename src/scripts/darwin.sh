#!/bin/bash

files=()

while IFS= read -r -d '' file; do
  filename=$(basename -- "$file")
  filename_no_extension="${filename%.*}"

  if [ ${#filename_no_extension} -eq 32 ]; then
    files+=("$file")
  fi
done < <(find "$HOME/.Trash" -type f \( -iname "*.webp" -o -iname "*.gif" -o -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

if [ ${#files[@]} -gt 0 ]; then
  echo "SUCCESS:"
  echo "${files[@]}"
  rm -rf "${files[@]}"
fi