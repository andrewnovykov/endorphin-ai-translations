#!/bin/bash

# Simple script to copy missing English docs files to all languages

echo "🔄 Copying missing English docs files to all languages..."

# Get all language directories (2-letter codes)
for lang_dir in */; do
    if [[ -d "$lang_dir" && ${#lang_dir} -eq 3 ]]; then  # 2 letters + slash
        lang=$(basename "$lang_dir")
        
        if [[ "$lang" != "en" ]]; then
            echo "📁 Processing language: $lang"
            
            # Create docs directory if it doesn't exist
            mkdir -p "$lang/docs"
            
            # Copy only missing files (files that don't exist)
            for file in en/docs/*.json; do
                filename=$(basename "$file")
                target="$lang/docs/$filename"
                
                if [[ ! -f "$target" ]]; then
                    cp -v "$file" "$target"
                    echo "  ✅ Copied: $filename"
                else
                    echo "  ⚪ Already exists: $filename"
                fi
            done
            
            echo "✅ Processed $lang"
        fi
    fi
done

echo "🎉 Done! All missing docs files have been copied to all languages."
