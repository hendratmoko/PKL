/**
 * PRESENSI PKL – SMKN 1 NGLIPAR  (Google Apps Script)
 * Cara pasang:
 * 1. Buka Google Sheet > Ekstensi > Apps Script, tempel seluruh kode ini (ganti isi lama).
 * 2. Jalankan fungsi setupSheet() sekali (izinkan akses).
 * 3. Terapkan > Deployment baru > Aplikasi web > Jalankan sebagai: Saya, Akses: Siapa saja.
 * 4. Salin URL /exec ke konstanta APPS_SCRIPT_URL di index.html.
 *
 * Satu sheet "Presensi", 16 kolom. Kolom Status menentukan jenis baris:
 *   PESERTA   = data siswa (Pembimbing = Kode guru)
 *   GURU      = data guru pembimbing (Nama, hp, Kode)
 *   Masuk / Pulang / Kegiatan / Izin = presensi & jurnal siswa
 *   KOREKSI   = koreksi presensi oleh guru (detail JSON di kolom Laporan)
 *   NILAI     = penilaian guru  | MONITORING = laporan kunjungan guru
 *   PESAN     = chat / broadcast | LAPORAN = draf laporan siswa (JSON)
 */
const SHEET = 'Presensi';
const HEAD = ['Tanggal','Waktu','Nama','Kelas','hp','Perusahaan','Koordinat Perusahaan','Koordinat Presensi','Jarak','Status','Kegiatan','Mulai','Selesai','Kode','Pembimbing','Laporan'];
const KEYS = ['tanggal','waktu','nama','kelas','hp','perusahaan','koordinatPerusahaan','koordinatPresensi','jarak','status','kegiatan','mulai','selesai','code','pembimbing','laporan'];
const N = KEYS.length, IDX_STATUS = 9, IDX_CODE = 13, IDX_PEMB = 14;

function setupSheet() { sh_(); }

function sh_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (s.getLastRow() < 1) {
    s.getRange(1, 1, 1, N).setValues([HEAD]).setFontWeight('bold').setBackground('#1e3a5f').setFontColor('#ffffff');
    s.setFrozenRows(1);
    s.getRange(2, 1, s.getMaxRows() - 1, N).setNumberFormat('@'); // semua teks: cegah tanggal/koordinat berubah format
  }
  return s;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function cell_(v, i) {
  if (v instanceof Date) return i === 0 || i === 11 || i === 12 ? Utilities.formatDate(v, 'Asia/Jakarta', 'yyyy-MM-dd') : Utilities.formatDate(v, 'Asia/Jakarta', 'HH:mm:ss');
  return v == null ? '' : String(v);
}
function vals_(d) { return KEYS.map(k => d[k] == null ? '' : String(d[k])); }
function append_(s, list) {
  if (!list.length) return;
  const r = Math.max(s.getLastRow(), 1) + 1;
  const rg = s.getRange(r, 1, list.length, N);
  rg.setNumberFormat('@');
  rg.setValues(list.map(vals_));
}

function doGet(e) {
  const a = (e && e.parameter && e.parameter.action) || 'getAll';
  const v = sh_().getDataRange().getValues(); v.shift();
  let rows = v.filter(r => r[IDX_STATUS] || r[2]).map(r => { const o = {}; KEYS.forEach((k, i) => o[k] = cell_(r[i], i)); return o; });
  if (a === 'getReport') rows = rows.filter(r => r.status === 'PESERTA');
  return out_(rows);
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const s = sh_();
    const act = d.action || 'append';
    const rows = d.rows || (d.nama || d.status ? [d] : []);
    if (act === 'append') append_(s, rows);
    else if (act === 'upsert') {            // 1 baris per (Status + Kode): NILAI, LAPORAN
      rows.forEach(r => {
        const v = s.getDataRange().getValues(); let hit = 0;
        for (let i = v.length - 1; i >= 1; i--) if (v[i][IDX_STATUS] === r.status && v[i][IDX_CODE] === r.code) { hit = i + 1; break; }
        if (hit) { const rg = s.getRange(hit, 1, 1, N); rg.setNumberFormat('@'); rg.setValues([vals_(r)]); } else append_(s, [r]);
      });
    } else if (act === 'setPembimbing') {
      const v = s.getDataRange().getValues();
      for (let i = 1; i < v.length; i++) if (v[i][IDX_STATUS] === 'PESERTA' && v[i][IDX_CODE] === d.kode) s.getRange(i + 1, IDX_PEMB + 1).setValue(d.pembimbing || '');
    } else if (act === 'deleteKode' || act === 'resetKode') {
      const v = s.getDataRange().getValues();
      for (let i = v.length - 1; i >= 1; i--) {
        if (v[i][IDX_CODE] !== d.kode) continue;
        if (act === 'resetKode' && (v[i][IDX_STATUS] === 'PESERTA' || v[i][IDX_STATUS] === 'GURU')) continue;
        s.deleteRow(i + 1);
      }
    } else if (act === 'clearAll') {
      if (s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
    }
    return out_({ ok: true });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
  finally { lock.releaseLock(); }
}
