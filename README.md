# Crypto Tracker

Aplikasi simple yang saya buat untuk melihat daftar cryptocurrency dunia beserta harganya dalam USD, dengan data dari CoinLore dan tampilan neo-brutalism yang saya rancang untuk layar HP.

Demo: [https://simplepahrul.github.io/crypto-app/](https://simplepahrul.github.io/crypto-app/)

## Apa yang bisa dilakukan aplikasi ini

Setelah tombol Ambil Data ditekan, aplikasi memuat daftar koin dari API, total 100 data. Supaya tidak penuh, data saya tampilkan 10 per halaman dan bisa dibuka lewat tombol Prev dan Next di bagian bawah layar. Setelah data masuk, tombol utama berubah menjadi Refresh untuk memuat ulang harga terbaru.

Tiap kartu berisi rank, nama, simbol, harga dalam USD, dan persentase perubahan harga 24 jam yang ditandai panah naik atau turun. Tiga koin teratas diberi warna berbeda dan label TOP 3. Ikon koinnya menyesuaikan jenisnya, misalnya Bitcoin, Ethereum, atau stablecoin, dan dibuat dengan SVG yang bergerak pelan. Di bagian atas ada ringkasan harga terendah dan tertinggi dari seluruh data.

Kalau internet bermasalah, aplikasi menampilkan pesan error dan tidak berhenti begitu saja.

## Teknologi yang dipakai

Ionic Vue dengan TypeScript, Vite sebagai build tool, Fetch API untuk request ke API, serta gh-pages untuk deploy ke GitHub Pages.

## Sumber data

```
https://api.coinlore.net/api/tickers/
```

Dari sini saya memakai lima field: rank, name, symbol, price_usd, dan percent_change_24h. Field percent_change_24h saya tambahkan sendiri supaya tren naik atau turun bisa ditampilkan.

## Struktur kode

```
src/
├── services/AmbilCrypto.ts   class untuk request GET ke API
├── views/HomePage.vue        tampilan dan logika halaman
└── router/index.ts           pengaturan rute
```

Urusan mengambil data saya pisahkan ke service, sedangkan HomePage.vue hanya mengurus tampilan. Dengan begitu, kalau nanti ada halaman lain yang butuh data dari API, class yang sama bisa dipakai lagi.

## Menjalankan di laptop

Pastikan Node.js versi LTS dan Ionic CLI sudah terpasang, lalu jalankan:

```
npm install
ionic serve
```

Aplikasi terbuka di localhost:8100. Karena proyek ini memakai base path untuk GitHub Pages, kalau halamannya kosong coba buka localhost:8100/crypto-app/. Untuk membuat versi produksi, jalankan `npm run build`.

## Deploy

Setiap kali ada perubahan, saya jalankan `npm run deploy`. Perintah ini membangun aplikasi lalu mengirim isi folder dist ke branch gh-pages, yang ditayangkan oleh GitHub Pages. Source code tetap ada di branch main.

## Hal yang sempat bikin tersandung

- Harga dari API dikirim sebagai string, bukan angka. Jadi untuk mencari harga terendah dan tertinggi, nilainya harus diubah dulu dengan Number().
- Saat dipasang di GitHub Pages, base path harus sama persis dengan nama repo. Kalau beda, halaman jadi putih.
- Halaman bisa 404 kalau di-refresh di GitHub Pages, jadi router saya ganti ke hash history.
- Push pertama ke GitHub sempat ditolak karena repo di GitHub sudah punya commit awal. Masalahnya selesai setelah saya jalankan git pull dengan opsi rebase sebelum push.

## Kesimpulan

Aplikasi ini sudah berjalan: data cryptocurrency berhasil diambil dari API online dan ditampilkan dalam bentuk yang mudah dibaca. Dari proses pengerjaannya, saya jadi lebih paham alur memanggil RESTful API di Ionic Vue, mulai dari service, penyimpanan data di komponen, sampai tampil di layar. Saya juga belajar bahwa urusan kecil seperti tipe data dari API dan base path bisa memengaruhi hasil akhir, jadi perlu dicek sejak awal.
