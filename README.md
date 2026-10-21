# Aplikasi Presensi & Monitoring PKL – SMKN 1 Nglipar

Aplikasi web satu file (`index.html`) untuk presensi, jurnal, penilaian, monitoring, dan pelaporan Praktik Kerja Lapangan (PKL). Data disimpan di **Google Spreadsheet** melalui **Google Apps Script**, sehingga tidak perlu server sendiri.

---

## Daftar Isi
1. [Fitur](#1-fitur)
2. [Isi Paket](#2-isi-paket)
3. [Instalasi](#3-instalasi)
4. [Peran & Kode Login](#4-peran--kode-login)
5. [Cara Penggunaan](#5-cara-penggunaan)
6. [Struktur Spreadsheet](#6-struktur-spreadsheet)
7. [Rumus Keaktifan](#7-rumus-keaktifan)
8. [Pencetakan Laporan](#8-pencetakan-laporan)
9. [Pemecahan Masalah](#9-pemecahan-masalah)
10. [Keterbatasan & Keamanan](#10-keterbatasan--keamanan)

---

## 1. Fitur

**Siswa**
- Presensi masuk dan pulang dengan GPS (jarak ke lokasi perusahaan dihitung otomatis), izin/sakit, dan jurnal kegiatan harian.
- Riwayat presensi, ringkasan hadir/izin/alpa, dan skor keaktifan.
- **Laporan PKL**: template 5 bab, bisa dicicil, tersimpan otomatis, dapat diunduh sebagai Word (`.doc`) atau dicetak ke PDF.
- Chat dengan guru pembimbing (aplikasi atau WhatsApp).
- Cetak Laporan Jurnal dengan grafik.

**Guru Pembimbing**
- Daftar siswa hadir dan tidak hadir per tanggal.
- Grafik keaktifan siswa dan grafik radar (perbandingan dengan rata-rata kelompok).
- Riwayat presensi per siswa dan **koreksi presensi** yang salah (riwayat koreksi tetap tercatat).
- **Penilaian** siswa (6 aspek, predikat A–D).
- **Laporan monitoring** kunjungan ke perusahaan, bisa dicetak.
- Komunikasi: chat per siswa, broadcast, dan tautan WhatsApp.
- Cetak Laporan Guru dengan grafik.

**Admin**
- Menambah peserta dan guru, menentukan guru pembimbing, menghapus atau mereset data.
- Tabel rekap peserta dan cetak Laporan Admin (landscape, dengan grafik).

---

## 2. Isi Paket

| File | Fungsi |
|---|---|
| `index.html` | Seluruh aplikasi (tampilan + logika). |
| `Code.gs` | Backend Google Apps Script. |
| `Contoh_Spreadsheet_Presensi_PKL.xlsx` | Contoh isi spreadsheet dan penjelasan kolom. |
| `LOGO NGLIPAR.png` | (Anda siapkan sendiri) Logo untuk kop surat; letakkan di folder yang sama dengan `index.html`. Jika tidak ada, kop tetap tercetak tanpa logo. |

---

## 3. Instalasi

### Langkah 1 – Siapkan Spreadsheet & Apps Script
1. Buat Google Spreadsheet baru (nama bebas).
2. Menu **Ekstensi → Apps Script**.
3. Hapus kode bawaan, tempel seluruh isi `Code.gs`, lalu simpan.
4. Pilih fungsi **`setupSheet`** pada toolbar dan klik **Jalankan**. Setujui permintaan izin akses. Sheet bernama **Presensi** akan dibuat dengan 16 kolom.
5. Klik **Terapkan → Deployment baru**:
   - Jenis: **Aplikasi web**
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
6. Salin **URL aplikasi web** (berakhiran `/exec`).

> Setiap kali `Code.gs` diubah, buat **versi deployment baru** (Terapkan → Kelola deployment → Edit → Versi baru) agar perubahan berlaku.

### Langkah 2 – Hubungkan `index.html`
1. Buka `index.html` dengan editor teks.
2. Cari konstanta `APPS_SCRIPT_URL` dan ganti isinya dengan URL `/exec` tadi.
3. Cari konstanta `ADMIN_CODE` untuk melihat atau mengganti kode login admin.

### Langkah 3 – Hosting
`index.html` harus dibuka lewat **HTTPS** agar GPS dan kamera dapat bekerja. Pilihan yang mudah dan gratis:
- GitHub Pages, Netlify, atau Cloudflare Pages: unggah `index.html` dan `LOGO NGLIPAR.png`.
- Hosting sekolah dengan sertifikat HTTPS.

Membuka file langsung dari penyimpanan (`file://`) tidak disarankan karena izin lokasi bisa ditolak browser.

### Langkah 4 – Uji
Buka aplikasi, login sebagai admin, tambahkan satu guru dan satu siswa, lalu coba presensi dari ponsel.

---

## 4. Peran & Kode Login

Semua peran masuk lewat kolom **INPUT KODE** di halaman login. Sistem mengenali peran dari kodenya:

| Peran | Asal kode |
|---|---|
| Admin | `ADMIN_CODE` di `index.html` = AAA000. |
| Guru | Dibuat admin di tab **Guru Pembimbing**. |
| Siswa | Dibuat otomatis saat admin menambah peserta. |

Kode dikirim ke guru atau siswa lewat tombol WhatsApp yang tersedia setelah kode dibuat.

---

## 5. Cara Penggunaan

### 5.1 Admin

**Menambah guru pembimbing**
1. Login dengan kode admin → tab **Guru Pembimbing**.
2. Isi nama dan nomor HP (format `08xxxxxxxxxx`), klik **Tambah Guru & Buat Kode**.
3. Kirim kode ke guru dengan tombol **Kirim Kode WA** pada tabel.

**Menambah peserta**
1. Tab **Tambah Peserta**: isi nama, kelas, HP, perusahaan, koordinat perusahaan (`lat,lng`, bisa memakai peta yang tersedia), nomor BPJS, tanggal mulai dan selesai.
2. Pilih **Guru Pembimbing**.
3. Klik tambah. Kode login siswa muncul dan dapat disalin atau dikirim lewat WhatsApp.

**Mengelola data**
- Tab **Laporan Peserta**: pembimbing dapat diganti langsung lewat kolom *Pembimbing*. Tombol **Reset** menghapus riwayat satu siswa (data siswa tetap), **Hapus** menghapus siswa atau guru beserta seluruh datanya.
- **Cetak Laporan Admin**: isi nama dan NIP admin serta kepala sekolah untuk tanda tangan, lalu cetak.

### 5.2 Siswa

**Presensi harian** (tab *Presensi*)
1. Ambil lokasi GPS (dan foto bila diminta), lalu tekan **Absen Masuk**.
2. Tulis **jurnal kegiatan** hari itu dan kirim.
3. Sore hari tekan **Absen Pulang**.
4. Jika tidak masuk, gunakan **Izin** dan tulis alasannya.

**Riwayat** (tab *Riwayat*)
Menampilkan hadir, izin, alpa, skor keaktifan, dan tabel harian. Tombol **Cetak Laporan Jurnal** membuat laporan dengan grafik.

**Laporan PKL** (tab *Laporan PKL*)
1. Isi bab demi bab; target sekitar 150 kata per bab. Progres terlihat pada bar.
2. Tulisan tersimpan otomatis (di perangkat dan, setelah 3 detik tidak mengetik, di server). Tombol **Simpan** untuk menyimpan manual.
3. **Sisipkan Rekap Jurnal ke Bab III** mengisi Bab III dari jurnal harian.
4. **Unduh Word (.doc)** atau **Cetak / PDF**. Laporan memuat sampul, bab I–V, lampiran jurnal, dan tanda tangan.

**Pesan** (tab *Pesan*)
Chat dengan guru pembimbing. Tombol **WhatsApp** membuka chat ke nomor guru. Badge merah menandakan pesan baru.

### 5.3 Guru Pembimbing

Pilih siswa pada kotak **Siswa Bimbingan** di bagian atas; kotak ini dipakai oleh semua tab.

| Tab | Kegunaan |
|---|---|
| **Ringkasan** | Pilih tanggal untuk melihat siswa hadir dan tidak hadir (tombol **[WA]** menegur yang belum presensi), grafik batang keaktifan, dan grafik radar. Pilih siswa untuk membandingkan radar siswa dengan rata-rata kelompok. |
| **Riwayat & Koreksi** | Tabel harian, termasuk hari alpa otomatis. Klik **Koreksi** pada baris, atau **+ Koreksi Tanggal**, lalu pilih status (Hadir/Izin/Sakit/Alpa), jam masuk/pulang, dan isi alasan (wajib). |
| **Penilaian** | Isi 6 aspek (0–100) dan catatan, lalu **Simpan Nilai**. Tersedia tombol cetak jurnal dan laporan akhir siswa. |
| **Monitoring** | Isi form kunjungan (tanggal, pembimbing DUDI, kondisi, kesesuaian, sikap, pengamatan, kendala, tindak lanjut) lalu simpan. Riwayat kunjungan bisa dicetak satu per satu. |
| **Pesan** | Chat dengan siswa terpilih; **Broadcast** mengirim notifikasi ke semua siswa bimbingan; **Daftar Link WhatsApp** menghasilkan tautan WA per siswa dengan pesan yang sudah terisi. |
| **Cetak** | Isi NIP guru dan data kepala sekolah, lalu **Cetak Laporan Guru**. |

Tombol **Muat Ulang** memperbarui data dari spreadsheet. Data juga diperbarui otomatis tiap 20 detik.

---

## 6. Struktur Spreadsheet

Satu sheet bernama **Presensi** dengan 16 kolom (baris 1 adalah header, jangan diubah):

`Tanggal | Waktu | Nama | Kelas | hp | Perusahaan | Koordinat Perusahaan | Koordinat Presensi | Jarak | Status | Kegiatan | Mulai | Selesai | Kode | Pembimbing | Laporan`

Kolom **Status** menentukan jenis baris:

| Status | Arti |
|---|---|
| `PESERTA` | Data siswa. Kolom *Pembimbing* berisi **kode guru**. |
| `GURU` | Data guru (Nama, hp, Kode). |
| `Masuk` / `Pulang` | Absen siswa, lengkap dengan koordinat dan jarak. |
| `Kegiatan` | Jurnal harian. |
| `Izin` | Izin atau sakit; alasan di kolom Kegiatan. |
| `KOREKSI` | Koreksi guru. Detail JSON di kolom Laporan. |
| `NILAI` | Penilaian guru (satu baris per siswa, diperbarui bila dinilai ulang). |
| `MONITORING` | Laporan kunjungan guru. |
| `PESAN` | Chat dan broadcast. |
| `LAPORAN` | Draf laporan akhir siswa (satu baris per siswa). |

Format tanggal adalah `yyyy-mm-dd`, waktu `hh:mm:ss`, koordinat `lat,lng`; semua kolom berformat teks. Lihat `Contoh_Spreadsheet_Presensi_PKL.xlsx` untuk contoh tiap jenis baris.

Anda boleh membuka dan menyaring spreadsheet secara langsung (misalnya filter kolom Status = `Masuk`), tetapi **jangan mengubah header** dan hindari mengedit kolom Laporan yang berisi JSON.

---

## 7. Rumus Keaktifan

Skor keaktifan (0–100%) dihitung dari lima indikator, yang juga menjadi sumbu grafik radar:

| Indikator | Cara hitung | Bobot |
|---|---|---|
| Kehadiran | hari hadir ÷ hari kerja | 40% |
| Jurnal | hari hadir yang ada jurnalnya ÷ hari hadir | 25% |
| Presensi Pulang | hari hadir yang absen pulang ÷ hari hadir | 15% |
| Lokasi Valid | presensi dengan jarak ≤ 100 m ÷ presensi berjarak tercatat | 10% |
| Laporan | progres laporan PKL (target 150 kata per bab) | 10% |

Aturan hari kerja:
- Hari kerja dihitung **Senin–Jumat**, dari tanggal mulai sampai hari ini (atau tanggal selesai).
- Hari kerja yang berlalu tanpa catatan dihitung **Alpa**. Hari ini tidak dihitung alpa sebelum hari berakhir.
- Hari libur nasional tidak dikenali, jadi alpa pada hari libur perlu dikoreksi guru (status Izin atau Sakit).
- Bobot dapat diubah pada fungsi `stats` di bagian skrip `index.html`.

Nilai akhir adalah rata-rata 6 aspek penilaian guru. Predikat: A ≥ 90, B ≥ 80, C ≥ 70, D < 70.

---

## 8. Pencetakan Laporan

| Laporan | Dari | Isi |
|---|---|---|
| Jurnal Siswa | Siswa (tab Riwayat) atau guru (tab Penilaian) | Identitas, ringkasan, grafik radar dan kehadiran mingguan, tabel indikator, jurnal harian, tanda tangan. |
| Laporan Akhir PKL | Siswa atau guru | Sampul, bab I–V, lampiran jurnal. |
| Laporan Guru | Guru (tab Cetak) | Rekap siswa, grafik keaktifan, radar rata-rata, rekap monitoring. |
| Monitoring | Guru (tab Monitoring) | Satu kunjungan. |
| Laporan Admin | Admin | Grafik per kelas dan distribusi kehadiran, rekap seluruh siswa (landscape). |

Tips:
- Pada dialog cetak browser, pilih **Simpan sebagai PDF** untuk menghasilkan PDF.
- Nonaktifkan opsi **Header dan footer** agar tidak ada URL dan tanggal pada halaman.
- Grafik dirender sebagai gambar resolusi tinggi dan disertai tabel angka agar nilainya dapat diperiksa.
- Gunakan Chrome atau Edge untuk hasil cetak terbaik.

---

## 9. Pemecahan Masalah

| Masalah | Penyebab / solusi |
|---|---|
| "Gagal Terhubung" saat login | `APPS_SCRIPT_URL` salah, deployment belum "Siapa saja", atau tidak ada internet. Buka URL `/exec` di browser; seharusnya tampil data JSON. |
| Perubahan `Code.gs` tidak berlaku | Buat versi deployment baru (lihat langkah 1). |
| Kode login "tidak ditemukan" | Data baru butuh beberapa detik masuk ke spreadsheet. Tunggu lalu coba lagi, dan periksa baris `PESERTA` atau `GURU` di spreadsheet. |
| GPS tidak terbaca | Gunakan HTTPS, izinkan lokasi pada browser, dan aktifkan GPS ponsel. |
| Tanggal atau koordinat di spreadsheet berubah format | Pastikan kolom berformat Teks (`setupSheet()` mengatur ini). Data lama berformat `dd/mm/yyyy` tetap terbaca. |
| Grafik tidak muncul | Perpustakaan Chart.js dimuat dari CDN; periksa koneksi internet. |
| Hasil cetak tidak pas | Gunakan Chrome/Edge, skala 100%, dan jangan memakai "Fit to page" ganda. |
| Pesan baru tidak muncul | Pesan dimuat tiap 20 detik; tekan **Muat Ulang** pada panel guru, atau buka ulang tab Pesan. |

---

## 10. Keterbatasan & Keamanan

- **Apps Script tanpa autentikasi.** Siapa pun yang tahu URL `/exec` dapat membaca atau menulis data. Jangan menyebarkan URL; untuk penggunaan jangka panjang sebaiknya tambahkan token rahasia pada permintaan.
- **Kode login adalah satu-satunya pengaman** di sisi aplikasi, dan pemeriksaan peran dilakukan di browser. Jaga kerahasiaan kode.
- **Foto presensi tidak disimpan** ke spreadsheet (ukurannya terlalu besar).
- **Broadcast WhatsApp** berupa daftar tautan per siswa. Pengiriman massal otomatis memerlukan WhatsApp Business API berbayar.
- **Konkurensi:** Apps Script memakai kunci (lock) saat menulis, tetapi pengisian bersamaan oleh banyak siswa dalam hitungan detik dapat sedikit melambat.
- **Kapasitas:** satu sel Google Sheets maksimal 50.000 karakter, sehingga laporan akhir yang sangat panjang tidak dapat disimpan di server (sistem akan memberi peringatan; salinan di perangkat tetap ada).
- **Cadangan:** unduh spreadsheet secara berkala (File → Unduh) sebagai arsip.
