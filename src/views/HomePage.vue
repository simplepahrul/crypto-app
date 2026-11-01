<template>
  <ion-page>
    <ion-content :fullscreen="true" ref="konten">
      <!-- kumpulan ikon, dipakai ulang lewat <use> -->
      <svg class="defs" aria-hidden="true">
        <defs>
          <symbol id="i-coin" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="19" fill="#ffd23f" stroke="#111" stroke-width="3" />
            <circle cx="24" cy="24" r="12.5" fill="none" stroke="#111" stroke-width="2" />
            <text x="24" y="31" text-anchor="middle" font-size="19" font-weight="900"
              font-family="Courier New, monospace" fill="#111">$</text>
          </symbol>
          <symbol id="i-btc" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="19" fill="#ff9f1c" stroke="#111" stroke-width="3" />
            <g stroke="#111" stroke-width="2.5" stroke-linecap="square">
              <line x1="21" y1="11" x2="21" y2="15" />
              <line x1="27" y1="11" x2="27" y2="15" />
              <line x1="21" y1="33" x2="21" y2="37" />
              <line x1="27" y1="33" x2="27" y2="37" />
            </g>
            <text x="24" y="32" text-anchor="middle" font-size="22" font-weight="900"
              font-family="Courier New, monospace" fill="#111">B</text>
          </symbol>
          <symbol id="i-eth" viewBox="0 0 48 48">
            <polygon points="24,4 38,24 24,31 10,24" fill="#a5b4fc" stroke="#111"
              stroke-width="3" stroke-linejoin="round" />
            <polygon points="10,29 24,36 38,29 24,45" fill="#7ae7c7" stroke="#111"
              stroke-width="3" stroke-linejoin="round" />
          </symbol>
          <symbol id="i-usd" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="19" fill="#7ae7c7" stroke="#111" stroke-width="3" />
            <rect x="13" y="20" width="22" height="8" fill="none" stroke="#111" stroke-width="2" />
            <text x="24" y="32" text-anchor="middle" font-size="20" font-weight="900"
              font-family="Courier New, monospace" fill="#111">$</text>
          </symbol>
          <symbol id="i-up" viewBox="0 0 48 48">
            <polygon points="24,6 42,28 31,28 31,42 17,42 17,28 6,28" fill="#7ae7c7"
              stroke="#111" stroke-width="3" stroke-linejoin="round" />
          </symbol>
          <symbol id="i-down" viewBox="0 0 48 48">
            <polygon points="24,42 42,20 31,20 31,6 17,6 17,20 6,20" fill="#ff6b6b"
              stroke="#111" stroke-width="3" stroke-linejoin="round" />
          </symbol>
          <symbol id="i-chart" viewBox="0 0 48 48">
            <rect x="5" y="5" width="38" height="38" fill="#fff" stroke="#111" stroke-width="3" />
            <polyline points="10,34 19,24 27,29 38,13" fill="none" stroke="#2f7fe0"
              stroke-width="4" stroke-linecap="square" stroke-linejoin="miter" />
            <circle cx="38" cy="13" r="3.5" fill="#ffd23f" stroke="#111" stroke-width="2" />
          </symbol>
        </defs>
      </svg>

      <main class="halaman">
        <header class="kepala">
          <svg class="hias koin"><use href="#i-btc" /></svg>
          <svg class="hias grafik"><use href="#i-chart" /></svg>

          <span class="stiker">COINLORE API</span>
          <h1>Harga<br />Crypto</h1>
          <p class="sub">Daftar koin dunia dalam USD</p>
        </header>

        <p v-if="pesanError" class="error">{{ pesanError }}</p>

        <!-- tampilan awal sebelum data diambil -->
        <div v-if="!daftarKoin.length && !pesanError" class="kosong">
          <svg class="ikon besar"><use href="#i-coin" /></svg>
          <p>Belum ada data.<br />Tekan tombol di bawah untuk mulai.</p>
        </div>

        <section v-if="daftarKoin.length">
          <div class="ringkas">
            <div class="kotak dingin">
              <span>Harga terendah</span>
              <strong>${{ hargaMin }}</strong>
            </div>
            <div class="kotak panas">
              <span>Harga tertinggi</span>
              <strong>${{ hargaMax }}</strong>
            </div>
          </div>

          <p class="label-daftar">
            Data {{ awal + 1 }} sampai {{ akhir }} dari {{ daftarKoin.length }}
          </p>

          <ul class="daftar">
            <li
              v-for="(item, i) in daftarTampil"
              :key="item.id"
              class="kartu"
              :class="{ top: item.rank <= 3 }"
              :style="{ animationDelay: i * 70 + 'ms' }"
            >
              <div class="rank">
                <small>Rank</small>
                <strong>{{ item.rank }}</strong>
              </div>
              <div class="lencana">
                <svg class="ikon"><use :href="ikon(item.simbol)" /></svg>
              </div>
              <div class="nama">
                <small>{{ item.nama }}</small>
                <strong>{{ item.simbol }}</strong>
                <em v-if="item.rank <= 3" class="badge">TOP 3</em>
              </div>
              <div class="harga">
                <small>USD</small>
                <strong>{{ item.harga }}</strong>
                <span class="tren" :class="item.perubahan >= 0 ? 'naik' : 'turun'">
                  <svg class="mini"><use :href="item.perubahan >= 0 ? '#i-up' : '#i-down'" /></svg>
                  {{ Math.abs(item.perubahan).toFixed(2) }}%
                </span>
              </div>
            </li>
          </ul>
        </section>
      </main>
    </ion-content>

    <!-- tombol di bawah supaya mudah dijangkau jempol -->
    <ion-footer class="ion-no-border">
      <div class="bar">
        <div v-if="daftarKoin.length" class="nav">
          <button class="tombol-kecil" @click="ganti(-1)" :disabled="halaman === 0">
            ← PREV
          </button>
          <span class="info">{{ halaman + 1 }} / {{ totalHalaman }}</span>
          <button
            class="tombol-kecil"
            @click="ganti(1)"
            :disabled="halaman >= totalHalaman - 1"
          >
            NEXT →
          </button>
        </div>
        <button class="tombol" @click="muatData" :disabled="sedangMuat">
          {{ sedangMuat ? 'MEMUAT...' : daftarKoin.length ? 'REFRESH' : 'AMBIL DATA' }}
        </button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonFooter, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
import AmbilCrypto from '@/services/AmbilCrypto';

const URL_CRYPTO = 'https://api.coinlore.net/api/tickers/';

interface Koin {
  id: string;
  rank: number;
  nama: string;
  simbol: string;
  harga: string;
  perubahan: number;
}

export default defineComponent({
  name: 'HomePage',
  components: { IonContent, IonFooter, IonPage },
  data() {
    return {
      daftarKoin: [] as Koin[],
      halaman: 0,
      perHalaman: 10,
      sedangMuat: false,
      pesanError: ''
    };
  },
  computed: {
    totalHalaman(): number {
      return Math.ceil(this.daftarKoin.length / this.perHalaman);
    },
    awal(): number {
      return this.halaman * this.perHalaman;
    },
    akhir(): number {
      return Math.min(this.awal + this.perHalaman, this.daftarKoin.length);
    },
    // data yang tampil di halaman ini (10 per halaman)
    daftarTampil(): Koin[] {
      return this.daftarKoin.slice(this.awal, this.akhir);
    },
    hargaMin(): string {
      return Math.min(...this.daftarKoin.map((k) => Number(k.harga))).toString();
    },
    hargaMax(): string {
      return Math.max(...this.daftarKoin.map((k) => Number(k.harga))).toString();
    }
  },
  methods: {
    // pilih ikon berdasarkan simbol koin
    ikon(simbol: string): string {
      const s = simbol.toUpperCase();
      if (s === 'BTC' || s === 'WBTC') return '#i-btc';
      if (s === 'ETH' || s === 'STETH' || s === 'WETH') return '#i-eth';
      if (['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD'].includes(s)) return '#i-usd';
      return '#i-coin';
    },
    ganti(arah: number) {
      this.halaman += arah;
      this.$nextTick(() => {
        const konten = (this.$refs.konten as any)?.$el;
        if (konten && konten.scrollToTop) konten.scrollToTop(300);
      });
    },
    async muatData() {
      this.sedangMuat = true;
      this.pesanError = '';
      try {
        const layanan = new AmbilCrypto(URL_CRYPTO);
        const res = await layanan.getData();

        this.daftarKoin = res.data.map((d: any) => ({
          id: d.id,
          rank: d.rank,
          nama: d.name,
          simbol: d.symbol,
          harga: d.price_usd,
          perubahan: Number(d.percent_change_24h) || 0
        }));

        this.halaman = 0;
      } catch (e) {
        this.pesanError = 'Data gagal diambil, coba cek koneksi internet.';
      } finally {
        this.sedangMuat = false;
      }
    }
  }
});
</script>

<style scoped>
ion-content {
  --background: #f4ecd8;
}

.defs {
  position: absolute;
  width: 0;
  height: 0;
}

.halaman {
  max-width: 600px;
  margin: 0 auto;
  padding: calc(var(--ion-safe-area-top, 0px) + 20px) 16px 24px;
  font-family: 'Courier New', ui-monospace, monospace;
  color: #111;
}

/* header */
.kepala {
  position: relative;
  margin-bottom: 22px;
}

.hias {
  position: absolute;
  pointer-events: none;
}

.koin {
  width: 84px;
  height: 84px;
  top: -6px;
  right: 4px;
  animation: balik 3s ease-in-out infinite;
}

.grafik {
  width: 62px;
  height: 62px;
  top: 58px;
  right: 62px;
  animation: melayang 4s ease-in-out infinite;
}

.stiker {
  display: inline-block;
  background: #111;
  color: #ffd23f;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 2px;
  padding: 4px 10px;
  transform: rotate(-2deg);
}

h1 {
  font-size: 44px;
  line-height: 1;
  margin: 14px 0 8px;
  text-transform: uppercase;
  font-weight: 900;
}

.sub {
  margin: 0;
  font-size: 14px;
}

/* keadaan kosong dan error */
.kosong {
  border: 3px dashed #111;
  padding: 28px 16px;
  text-align: center;
  background: #fff;
  animation: muncul 0.4s ease-out both;
}

.kosong p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.5;
}

.error {
  background: #ff6b6b;
  border: 3px solid #111;
  padding: 10px;
  font-weight: 700;
}

/* ringkasan */
.ringkas {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
}

.kotak {
  flex: 1;
  min-width: 0;
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  padding: 10px 12px;
  animation: muncul 0.4s ease-out both;
}

.kotak span {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.kotak strong {
  display: block;
  font-size: clamp(16px, 5vw, 22px);
  font-weight: 900;
  overflow-wrap: anywhere;
}

.dingin {
  background: #7ae7c7;
}

.panas {
  background: #ffd23f;
  animation-delay: 0.1s;
}

.label-daftar {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* daftar kartu */
.daftar {
  list-style: none;
  margin: 0;
  padding: 0;
}

.kartu {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  padding: 10px 12px;
  margin-bottom: 14px;
  animation: muncul 0.35s ease-out both;
}

.kartu.top {
  background: #fff1b8;
}

.rank {
  flex: none;
  min-width: 42px;
  text-align: center;
  border-right: 3px solid #111;
  padding-right: 10px;
}

.rank small,
.nama small,
.harga small {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rank strong {
  font-size: 22px;
  font-weight: 900;
}

.lencana {
  flex: none;
  width: 48px;
  height: 48px;
  border: 3px solid #111;
  background: #f4ecd8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ikon {
  width: 34px;
  height: 34px;
  display: block;
  animation: goyang 3s ease-in-out infinite;
}

.ikon.besar {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  animation: balik 3s ease-in-out infinite;
}

.nama {
  flex: 1;
  min-width: 0;
}

.nama small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nama strong {
  display: block;
  font-size: 20px;
  font-weight: 900;
}

.badge {
  display: inline-block;
  margin-top: 2px;
  padding: 1px 6px;
  background: #111;
  color: #ffd23f;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 1px;
}

.harga {
  flex: none;
  max-width: 38%;
  text-align: right;
}

.harga strong {
  display: block;
  font-size: clamp(15px, 4.6vw, 21px);
  font-weight: 900;
  overflow-wrap: anywhere;
}

.tren {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
  font-size: 11px;
  font-weight: 700;
}

.tren.naik {
  color: #0a7a5a;
}

.tren.turun {
  color: #c62828;
}

.mini {
  width: 12px;
  height: 12px;
}

/* tombol bawah */
.bar {
  background: #f4ecd8;
  border-top: 3px solid #111;
  padding: 12px 16px calc(var(--ion-safe-area-bottom, 0px) + 12px);
}

.tombol {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: 56px;
  background: #ffd23f;
  color: #111;
  border: 3px solid #111;
  box-shadow: 5px 5px 0 #111;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.08s, box-shadow 0.08s;
}

.tombol:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 1px 1px 0 #111;
}

.tombol:disabled {
  background: #ddd;
  cursor: wait;
}

/* navigasi halaman */
.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 12px;
}

.tombol-kecil {
  flex: 1;
  height: 44px;
  background: #7ae7c7;
  color: #111;
  border: 3px solid #111;
  box-shadow: 3px 3px 0 #111;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.08s, box-shadow 0.08s;
}

.tombol-kecil:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 #111;
}

.tombol-kecil:disabled {
  background: #ddd;
  color: #888;
  border-color: #888;
  box-shadow: 3px 3px 0 #888;
  cursor: not-allowed;
}

.info {
  flex: none;
  min-width: 64px;
  text-align: center;
  font-weight: 900;
}

/* responsif: layar kecil */
@media (max-width: 380px) {
  .halaman {
    padding-left: 12px;
    padding-right: 12px;
  }
  h1 {
    font-size: 36px;
  }
  .koin {
    width: 66px;
    height: 66px;
  }
  .grafik {
    width: 48px;
    height: 48px;
    top: 48px;
    right: 48px;
  }
  .kartu {
    gap: 8px;
    padding: 8px 10px;
  }
  .lencana {
    display: none;
  }
  .rank {
    min-width: 34px;
    padding-right: 8px;
  }
  .nama strong {
    font-size: 17px;
  }
  .harga {
    max-width: 44%;
  }
}

/* responsif: tablet ke atas */
@media (min-width: 768px) {
  h1 {
    font-size: 56px;
  }
  .koin {
    width: 104px;
    height: 104px;
  }
  .grafik {
    width: 76px;
    height: 76px;
    right: 80px;
  }
  .nama strong {
    font-size: 24px;
  }
}

/* animasi */
@keyframes balik {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0.1);
  }
}

@keyframes melayang {
  0%,
  100% {
    transform: translate(0, 0) rotate(-4deg);
  }
  50% {
    transform: translate(-8px, -6px) rotate(4deg);
  }
}

@keyframes goyang {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes muncul {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>