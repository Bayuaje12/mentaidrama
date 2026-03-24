#!/bin/bash

echo "--- MENTAIDRAMA ADMIN CONTROL ---"
echo "1. NYALAKAN MAINTENANCE (Kunci Web)"
echo "2. MATIKAN MAINTENANCE (Buka Web)"
read -p "Pilih menu (1/2): " menu

if [ $menu -eq 1 ]; then
    # Mengubah false jadi true
    sed -i 's/const isMaintenance = false/const isMaintenance = true/g' src/app/page.tsx
    echo "Sedang mengunci website..."
elif [ $menu -eq 2 ]; then
    # Mengubah true jadi false
    sed -i 's/const isMaintenance = true/const isMaintenance = false/g' src/app/page.tsx
    echo "Sedang membuka website..."
else
    echo "Pilihan salah, Boy!"
    exit 1
fi

# Build ulang Next.js agar perubahan terbaca
npm run build && pm2 restart all
echo "--- SELESAI! Web MentaiDrama Berhasil Diupdate ---"

