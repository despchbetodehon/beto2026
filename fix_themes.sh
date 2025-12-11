#!/bin/bash

# List of files to fix
files=(
  "src/pages/beto/dashboard/index.tsx"
  "src/pages/beto/dashboard/digital/index.tsx"
  "src/pages/beto/dashboard/digital/empresas/index.tsx"
  "src/pages/beto/dashboard/fiat/index.tsx"
  "src/pages/beto/dashboard/empresas/index.tsx"
  "src/pages/beto/dashboard/empresas/anuencia/index.tsx"
  "src/pages/beto/dashboard/empresas/transferencia/index.tsx"
  "src/pages/beto/transferencia/dashboard/index.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Remove ThemeProvider import and createTheme declaration
    sed -i '/import.*createTheme.*ThemeProvider/d' "$file"
    sed -i '/^const theme = createTheme({/,/^});$/d' "$file"
    
    # Replace <ThemeProvider theme={theme}> wrapping
    sed -i 's/<ThemeProvider theme={theme}>//' "$file"
    sed -i 's/<\/ThemeProvider>//' "$file"
    
    echo "  ✓ Fixed"
  else
    echo "  ✗ File not found: $file"
  fi
done

echo "All themes fixed!"
