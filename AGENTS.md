# cVIP — Nihai ATS & Proje Kural Referansı

> Bu dosya, projedeki her kararın dayanağıdır.  
> Tasarım, kod, validasyon, tema — hepsi önce buraya bakarak yapılır.  
> Kural yoksa eklenir; çelişki varsa bu dosya kazanır.

---

## İÇİNDEKİLER

1. [Felsefe](#1-felsefe)
2. [Dosya & Format](#2-dosya--format)
3. [Sayfa Yapısı](#3-sayfa-yapısı)
4. [Tipografi](#4-tipografi)
5. [Renk & Kontrast](#5-renk--kontrast)
6. [Bölüm Başlıkları](#6-bölüm-başlıkları)
7. [Bölüm Sırası](#7-bölüm-sırası)
8. [İletişim Bloğu](#8-i̇letişim-bloğu)
9. [İş Deneyimi Bloğu](#9-i̇ş-deneyimi-bloğu)
10. [Eğitim Bloğu](#10-eğitim-bloğu)
11. [Beceriler](#11-beceriler)
12. [Sertifikalar](#12-sertifikalar)
13. [Projeler](#13-projeler)
14. [Diller](#14-diller)
15. [Madde İşaretleri](#15-madde-i̇şaretleri)
16. [Tarih Formatı](#16-tarih-formatı)
17. [Kesinlikle Yasak Elemanlar](#17-kesinlikle-yasak-elemanlar)
18. [Semantik HTML & Veri Etiketleri](#18-semantik-html--veri-etiketleri)
19. [Teknoloji Stack Kuralları](#19-teknoloji-stack-kuralları)
20. [Validasyon Kuralları](#20-validasyon-kuralları)
21. [Tema Tasarım Sistemi](#21-tema-tasarım-sistemi)
22. [PDF Çıktısı](#22-pdf-çıktısı)

---

## 1. Felsefe

**ATS önce, tasarım sonra.** Her piksel, ATS parse sıralamasına zarar vermeden konulur.

**Desteklenen sistemler (hepsi):**

- Modern: Greenhouse, Lever, Workday, SmartRecruiters, Ashby, Rippling
- Kurumsal/eski: Oracle Taleo, iCIMS legacy, SAP SuccessFactors, BambooHR, ADP, PeopleSoft

Eski sistemler hâlâ kurumsal şirketlerin çoğunluğunda aktif. Tasarım modern, uyumluluk evrensel.

**Temel kural:** Bir CV, metin kopyalanıp düz bir `.txt` dosyasına yapıştırıldığında **anlam kaybı olmadan okunabiliyorsa** ATS uyumludur.

---

## 2. Dosya & Format

| Kural           | Değer                                                   |
| --------------- | ------------------------------------------------------- |
| Birincil format | `.pdf` (text-based, selectable)                         |
| Yedek format    | `.docx` (Taleo/iCIMS için en güvenli)                   |
| PDF türü        | Puppeteer server-side render — asla görsel/flatten      |
| Dosya adı       | `AdSoyad_CV.pdf` — boşluk yok, Türkçe karakter yok      |
| Dosya boyutu    | Maksimum 5 MB                                           |
| Sayfa sayısı    | 1 sayfa (0–5 yıl deneyim), 2 sayfa (5+ yıl, zorunluysa) |

**Dosya adı üretim kuralı:**

```
Ad → Türkçe karakter ASCII'ye (ş→s, ğ→g, ü→u, ö→o, ı→i, ç→c)
Boşluk → alt çizgi _
Özel karakter → sil
Örnek: "Ahmet Öztürk" → "Ahmet_Ozturk_CV.pdf"
```

---

## 3. Sayfa Yapısı

```
┌─────────────────────────────────┐
│  Kenar: min 1.27 cm (0.5 inç)  │
│  İdeal: 1.5–2 cm                │
│                                 │
│  ╔═══════════════════════╗      │
│  ║  TEK SÜTUN — ZORUNLU  ║      │
│  ╚═══════════════════════╝      │
│                                 │
│  İçerik sadece body alanında   │
│  Header/footer DOM alanı: BOŞ  │
└─────────────────────────────────┘
```

### Neden tek sütun?

Taleo ve iCIMS iki sütunu soldan sağa sıralı okur. "Beceriler" sütunu "Deneyim" içine karışır; parser hatalı yapı üretir.

### İzin verilen görsel zenginlik:

- Dikey accent çizgisi (sol kenarda, `position: absolute`, `pointer-events: none`)
- Bölüm ayraç çizgileri (`<hr>` veya CSS `border-bottom`)
- Arka plan renk bantları (full-width, `z-index: 0`, içerik üstüne çıkmaz)
- Bold, büyük punto başlıklar

### Kesinlikle yasak:

- `display: grid` ile yan yana metin kolonları
- `position: absolute` ile metni yerleştirme
- `float: left/right` ile iki sütun simülasyonu

---

## 4. Tipografi

### Güvenli fontlar (tüm ATS'lerde test edilmiş)

| Font                  | Güvenlik      | Notlar                                |
| --------------------- | ------------- | ------------------------------------- |
| **Calibri 11pt**      | ✅ En güvenli | Microsoft default, %99 parse başarısı |
| **Arial 10.5–11pt**   | ✅ En güvenli | Cross-platform                        |
| Helvetica             | ✅ Güvenli    | Mac'te system font                    |
| Verdana               | ✅ Güvenli    | Geniş karakter aralığı                |
| Georgia               | ✅ Güvenli    | Serif, profesyonel                    |
| Cambria               | ✅ Güvenli    | Microsoft serif                       |
| Times New Roman       | ✅ Güvenli    | Klasik, evrensel                      |
| Garamond              | ✅ Güvenli    | Zarif serif                           |
| Trebuchet MS          | ✅ Güvenli    | Modern sans-serif                     |
| Inter / Roboto / Lato | ⚠️ Koşullu    | Sadece PDF'e embed edildiğinde        |
| Playfair Display      | ❌ Riskli     | Embed olmadan gibberish               |
| Cormorant Garamond    | ❌ Riskli     | Embed olmadan gibberish               |

### Boyut sistemi

| Alan                          | Boyut              |
| ----------------------------- | ------------------ |
| Ad/Soyad                      | 22–28 pt           |
| Bölüm başlıkları              | 12–14 pt, **bold** |
| Pozisyon/Unvan                | 11–12 pt, **bold** |
| Gövde metni                   | 10–11 pt           |
| Yardımcı metin (tarih, konum) | 9–10 pt            |

### Biçimlendirme kuralları

```
Hizalama     : SOL — asla justify
Satır aralığı: 1.0–1.15
Letter-spacing: 0 – max +0.05em (daha fazlası kelimeleri böler)
Bold         : Serbest (başlıklar, pozisyonlar, şirketler)
İtalik       : Çok sınırlı (şirket adı veya derece)
Altı çizili  : SADECE link'lerde
Üstü çizili  : HİÇBİR ZAMAN
Büyük harf   : Bölüm başlıklarında kabul edilebilir
```

**Maksimum 2 farklı font per CV** — genellikle başlık fontu + gövde fontu.

---

## 5. Renk & Kontrast

```
Metin rengi      : #000000 veya maksimum #333333
Arka plan        : #FFFFFF (beyaz) zorunlu, açık renkler opsiyonel
Başlık rengi     : Koyu lacivert/mavi kabul edilir (#0A1930, #0052CC)
Minimum kontrast : WCAG AA — 4.5:1 oranı
```

### Renk kuralları

- Kritik bilgi (ad, e-posta, pozisyon, tarih) **asla** sadece renkle ayırt edilmez
- Açık gri metin (`#999` üzeri) kullanılamaz — eski ATS düşük kontrastı silebilir
- Arka plan deseni/gradient metin okunabilirliğini etkilememelidir

---

## 6. Bölüm Başlıkları

### Türkçe CV standart başlıkları

| Bölüm        | Birincil                       | Alternatifleri                 |
| ------------ | ------------------------------ | ------------------------------ |
| İletişim     | _(Başlık gerekmez — en üstte)_ | —                              |
| Özet         | **Profesyonel Özet**           | Hakkımda, Özet                 |
| Deneyim      | **İş Deneyimi**                | Deneyim, Profesyonel Deneyim   |
| Eğitim       | **Eğitim**                     | Akademik Geçmiş                |
| Beceriler    | **Beceriler**                  | Yetkinlikler, Teknik Beceriler |
| Sertifikalar | **Sertifikalar**               | Sertifika & Lisanslar          |
| Projeler     | **Projeler**                   | Kişisel Projeler               |
| Diller       | **Diller**                     | Yabancı Diller                 |

### İngilizce CV standart başlıkları

| Bölüm          | Birincil                 | Alternatifleri                      |
| -------------- | ------------------------ | ----------------------------------- |
| Summary        | **Professional Summary** | Summary, Profile                    |
| Experience     | **Work Experience**      | Professional Experience, Experience |
| Education      | **Education**            | —                                   |
| Skills         | **Skills**               | Technical Skills, Core Competencies |
| Certifications | **Certifications**       | Licenses & Certifications           |
| Projects       | **Projects**             | Key Projects                        |
| Languages      | **Languages**            | —                                   |

### Başlık kuralları

- Gerçek metin zorunlu — SVG, CSS `::before`, veya `background-image` ile başlık **geçersiz**
- Yaratıcı/özgün başlıklar **yasak**: "Yolculuğum", "Araç Kutum", "Ne Yapabilirim", "My Story"
- Başlıklar `<h2>` veya `<h3>` seviyesinde HTML element olmalı

### Dual-language (ikili dil) pattern — önerilir:

```html
<h2>
  İş Deneyimi
  <span class="sr-only">Work Experience</span>
</h2>
```

Parser hem Türkçe hem İngilizce anahtar kelimeyi yakalar.

---

## 7. Bölüm Sırası

ATS parser'ın beklediği ve en iyi puan alan sıra:

```
1. İletişim Bilgileri     ← Sabit, her zaman en üstte
2. Profesyonel Özet       ← Anahtar kelime yoğunluğu burada
3. İş Deneyimi            ← En ağır puanlandırılan bölüm
4. Eğitim                 ← Deneyimden sonra (tecrübeliler için)
5. Beceriler              ← Keyword matching için kritik
6. Sertifikalar           ← Teknik roller için güçlü sinyal
7. Projeler               ← Deneyim boşluklarını kapatır
8. Diller                 ← Uluslararası başvurular için filtre
```

> **Not:** Yeni mezunlar için Eğitim, Deneyim'in önüne geçebilir.  
> **Not:** Dolu olmayan bölümler CV çıktısında **hiç gösterilmez** — boş başlık render edilmez.

---

## 8. İletişim Bloğu

### Yapı

```
[Ad Soyad]                          ← h1, 22-28pt, bold
[Hedef Pozisyon / Unvan]            ← h2 veya p, 12-14pt

[Şehir, Ülke]  |  [+90 5XX XXX XX XX]  |  [email@domain.com]
[linkedin.com/in/kullanici]  |  [github.com/kullanici]
```

### Kurallar

- **Gövde içinde** — header/footer DOM alanında asla
- Telefon: **uluslararası format (+90...)** zorunlu
- E-posta: link olabilir ama **görünen metin** de olmalı (href değil)
- LinkedIn/GitHub: görünür tam URL (ikon tek başına yeterli değil)
- Lokasyon: sadece **Şehir, Ülke** — sokak adresi eklenmez
- Fotoğraf: TR/AB opsiyonel; ABD/UK için **önerilmez** (ayrımcılık riski)

### İkon kullanımı

```html
<!-- YANLIŞ: ikon tek başına -->
<FaEnvelope />

<!-- DOĞRU: ikon + görünür metin -->
<FaEnvelope aria-hidden="true" /> ad@domain.com
```

---

## 9. İş Deneyimi Bloğu

### Her kayıt için zorunlu yapı

```
[Pozisyon Adı]                      ← bold, 11-12pt
[Şirket Adı]  |  [Şehir, Ülke]  |  [Başlangıç – Bitiş]
• [Aksiyon fiili] + [Eylem] + [Sonuç / Metrik]
• [Aksiyon fiili] + [Eylem] + [Sonuç / Metrik]
```

### HTML sırası önemli

Parser akışı yukarıdan aşağıya okur. Pozisyon-şirket-tarih görsel olarak hizalı olsa bile **DOM'da ayrı element** olmalı:

```html
<h3>Senior Software Engineer</h3>
← pozisyon önce
<p>Google | İstanbul, TR | 2022-01 – Günümüz</p>
<ul>
  <li>...</li>
</ul>
```

### Açıklama kuralları

- Her bullet **aksiyon fiiliyle** başlar: Geliştirdim, Yönettim, Tasarladım, Artırdım, Azalttım
- **Sayısal metrik** zorunlu: %, rakam, büyüklük ölçeği
  - İyi: "API yanıt süresini %40 azalttım"
  - Kötü: "API'yi iyileştirdim"
- Makul uzunluk: 3–6 bullet per pozisyon, her bullet 1–2 cümle

### Pozisyon adı kuralı

Standart sektör unvanı kullanılır:

- ✅ "Software Engineer", "Yazılım Geliştirici", "Ürün Müdürü"
- ❌ "Ninja Developer", "Code Wizard", "Rockstar Engineer"

---

## 10. Eğitim Bloğu

### Her kayıt için yapı

```
[Derece]  —  [Bölüm]
[Üniversite / Kurum Adı]
[Başlangıç – Mezuniyet]
```

### Standart derece ifadeleri

```
Türkçe: Lisans, Yüksek Lisans, Doktora, Ön Lisans
İngilizce: Bachelor's Degree, Master's Degree, PhD, Associate's Degree
```

— Kısaltmalar (BSc, MSc) kabul edilir ama açık formla birlikte yazılmalı.

### Kurallar

- Kronolojik sıra: **en yeniden en eskiye**
- GPA/Not ortalaması: 3.0+ ise eklenebilir, format: "GPA: 3.7/4.0"
- Sertifika kursları (Coursera, Udemy vb.) bu bölümde değil **Sertifikalar**'da

---

## 11. Beceriler

### Yapı

Virgülle ayrılmış liste veya küçük badge'ler (tek sütun akışında):

```
React · TypeScript · Node.js · PostgreSQL · AWS · Docker
Proje Yönetimi · Scrum · Takım Liderliği
```

### Kurallar

| Kural                   | Değer                                         |
| ----------------------- | --------------------------------------------- |
| İdeal sayı              | 10–15                                         |
| Maksimum                | 20                                            |
| Minimum                 | 5                                             |
| Keyword stuffing sınırı | 20+ beceri ATS tarafından şüpheli işaretlenir |

### Kısaltma kuralı

Her kısaltma **hem kısa hem açık** yazılır:

```
Arama Motoru Optimizasyonu (SEO)
Kullanıcı Deneyimi (UX)
Makine Öğrenmesi (ML)
```

— ATS sisteme göre bazen kısaltmayı bazen açık formu arar; her ikisini kapsamak zorunludur.

### İş ilanı eşleştirmesi

İş ilanındaki anahtar kelimeler **birebir** kullanılmalı. ATS fuzzy match yapmaz; "JavaScript" ile "JS" aynı değildir.

### Yasak gösterim biçimleri

- Progress bar (▓▓▓░░ %80)
- Yıldız derecelendirmesi (★★★☆☆)
- Çubuk grafik
- Skill seviyesi sayısal puan (8/10)

Bunlar ATS'de parse edilemez; boş alan olarak işlenir.

---

## 12. Sertifikalar

### Her kayıt için yapı

```
[Sertifika Tam Adı (KISALTMA)]
[Veren Kurum]  |  [Alınma Tarihi]  |  [Bitiş: YYYY-MM veya Süresiz]
[Doğrulama ID: XXXX]  ← opsiyonel
```

### Kurallar

- **Tam resmi ad** zorunlu: "AWS Certified Solutions Architect – Associate (SAA-C03)"
- Süresi dolmuş sertifikalar eklenip eklenmeyeceği kullanıcı kararı; **UI'da uyarı** gösterilir
- Doğrulama URL'si CV'de görünür metin olarak yer alır (sadece href değil)
- Coursera/Udemy gibi online kurslar da buraya girer ama kurumsal sertifikalardan daha düşük öncelikli

---

## 13. Projeler

### Her kayıt için yapı

```
[Proje Adı]  |  [Rol]  |  [Başlangıç – Bitiş]
Teknolojiler: React, Node.js, PostgreSQL, AWS
[URL]  ← opsiyonel, görünür metin
• [Aksiyon fiili] + eylem + metrik
```

### Kurallar

- Teknolojiler alanı ATS tarafından **skill olarak taranır** — iş ilanındaki teknolojilerle eşleştirilmelidir
- Açıklama bullet'ları deneyim bloğuyla aynı kurallara tabi: aksiyon fiili + sayısal metrik
- GitHub/canlı link görünür URL olmalı; ikon link'i yeterli değil

---

## 14. Diller

### Her kayıt için yapı

```
[Dil Adı]: [CEFR Seviyesi]

Örnek:
İngilizce: C1 (İleri)
Almanca: B2 (İyi)
Türkçe: Native (Anadil)
```

### CEFR seviyeleri (ATS tarafından tanınan tek standart)

| Kod    | Türkçe    | Açıklama           |
| ------ | --------- | ------------------ |
| A1     | Başlangıç | Temel ifadeler     |
| A2     | Temel     | Basit iletişim     |
| B1     | Orta      | Bağımsız kullanıcı |
| B2     | İyi       | Akıcı iletişim     |
| C1     | İleri     | Yetkin kullanıcı   |
| C2     | Üst Düzey | Uzman seviyesi     |
| Native | Anadil    | Anadil             |

### Yasak dil ifadeleri

- "Akıcı" — ATS bu kelimeyi tanımaz
- "İyi derecede" — belirsiz
- "Orta seviye" — CEFR karşılığı yok
- "Temel" — sadece başına dil adı koyarak kullanılamaz

---

## 15. Madde İşaretleri

### İzin verilen

```
•  (bullet — en güvenli)
-  (tire)
*  (yıldız)
–  (em dash, nadir)
```

### Yasak

```
✓ ✗ ★ ▸ ▪ ❯ ➢ ► ◆ ✦
Emoji (🚀 👨‍💻 ✅)
SVG checkmark
CSS ile üretilen custom list-style-image
```

### HTML implementasyonu

```html
<ul>
  <li>Bullet içeriği — güvenli, evrensel</li>
</ul>
```

CSS `list-style-type: disc` veya `none` + manuel `•` ile başlayan metin.

---

## 16. Tarih Formatı

### Depolama formatı (store) — ISO

```
"YYYY-MM"   →  "2023-01"  (Ocak 2023)
"present"   →  Günümüz / Present
""          →  Tarih girilmemiş
```

**Neden ISO?** String karşılaştırması ile sıralama çalışır. Tutarsızlık imkansız. Migration'la eski formatlar dönüştürülür.

### Görüntüleme formatı (render) — date-fns

```typescript
formatStoredDate("2023-01", "tr", "long")    → "Ocak 2023"
formatStoredDate("2023-01", "en", "long")    → "January 2023"
formatStoredDate("2023-01", "tr", "short")   → "Oca 2023"
formatStoredDate("2023-01", "tr", "numeric") → "01/2023"
formatStoredDate("present", "tr")            → "Günümüz"
```

### ATS çıktı formatı (PDF'te görünen)

```
Ocak 2023 – Günümüz        ← Türkçe long (önerilen)
01/2023 – Present           ← numeric (alternatif)
```

**Tüm tarihler CV genelinde aynı formatta.**

### Tarih seçici (UI)

- Serbest text input **yasak** — `MonthYearPicker` komponenti zorunlu
- Kullanıcı ay/yıl seçer; sistem ISO formatında saklar
- "Günümüz" butonu ayrı — devam eden pozisyonlar için

---

## 17. Kesinlikle Yasak Elemanlar

Bu elemanlar ATS parse'ını bozar veya tamamen siler.

### Yapısal

| Eleman                                | Neden Yasak                       |
| ------------------------------------- | --------------------------------- |
| `<table>` / `<tr>` / `<td>`           | Taleo/iCIMS hücreleri birleştirir |
| Text box (`position: absolute` metin) | Parser görmez                     |
| Çok sütunlu layout                    | Soldan sağa okunur, karışır       |
| Header/Footer DOM alanına veri        | Çoğu ATS okumaz                   |
| `display: grid` ile yan yana metin    | İki sütun yasağı                  |

### Görsel

| Eleman                           | Neden Yasak                                 |
| -------------------------------- | ------------------------------------------- |
| Fotoğraf olarak metin            | OCR gerektirir, ATS yapmaz                  |
| SVG ikonlar yerine metin         | İkon metni temsil edemez                    |
| Progress bar / skill bar         | Parse edilemez                              |
| Emoji                            | `[NULL]` veya random karakter olarak okunur |
| Watermark / filigran             | Parser karışıklığı                          |
| Arka plan resmi üzerine metin    | Kontrast + parse sorunu                     |
| Decorative large background text | Bazı PDF exporter'ları yakalar              |
| WordArt / dekoratif şekil metin  | Parse edilemez                              |

### Biçimlendirme

| Kural                          | Detay                                 |
| ------------------------------ | ------------------------------------- |
| Justify hizalama yasak         | Kelimeler arası boşluk → parse hatası |
| Letter-spacing > 0.05em yasak  | "YAZILIM" → "Y A Z I L I M" okunur    |
| Underline (link dışında) yasak | Link zanneder, hata üretir            |
| Strikethrough her zaman yasak  | —                                     |

---

## 18. Semantik HTML & Veri Etiketleri

### Zorunlu data attribute'lar (tema bileşenlerinde)

```html
<!-- Tüm CV kök elementi -->
<div data-ats-document="true">
  <!-- Her bölüm -->
  <section data-ats-section="work-experience">
    <h2>İş Deneyimi <span class="sr-only">Work Experience</span></h2>

    <!-- Her kayıt -->
    <article data-ats-entry="experience">
      <h3 data-ats-field="position">Senior Software Engineer</h3>
      <p>
        <span data-ats-field="company">Google</span>
        <span data-ats-field="location">İstanbul, TR</span>
        <span data-ats-field="date-range">Ocak 2022 – Günümüz</span>
      </p>
    </article>
  </section>
</div>
```

### sr-only dual-language pattern (tüm bölüm başlıkları için)

```html
<h2>
  İş Deneyimi
  <span class="sr-only">Work Experience</span>
</h2>
```

### Neden önemli?

- `data-ats-*` attribute'ları parser'a anlamsal ipucu verir
- `sr-only` İngilizce etiketler hem erişilebilirliği artırır hem İngilizce arama yapan ATS'lerde eşleşme sağlar
- Screen reader uyumluluğu (`aria-label`, `aria-hidden`) eklenebilir

---

## 19. Teknoloji Stack Kuralları

### Core

```
Next.js 15          App Router, RSC
TypeScript          Strict mode
Tailwind CSS 4      CSS variables, no config file
Zustand + persist   v5 key: "cv-storage-v5"
```

### Form & Validasyon

```
react-hook-form     useForm, useFieldArray, Controller
zod                 Schema-first, tek doğruluk kaynağı
@hookform/resolvers zodResolver
```

**Kural:** Her form alanının validasyonu `lib/schemas.ts`'tedir. Wizard adımları oradan import eder. Aynı validasyonu iki yerde yazmak yasak.

### UI Bileşenleri

```
shadcn/ui           Radix primitifleri üzerine
  - Form, FormField, FormItem, FormLabel, FormMessage
  - Input, Textarea, Select, Button
  - Popover, Calendar (MonthYearPicker için)
  - Alert, Badge
date-fns            Tarih format/parse, tr/enUS locale
lucide-react        İkonlar (sadece dekoratif — aria-hidden="true")
react-icons/fa      LinkedIn, GitHub brand ikonları (sadece iletişimde, yanında metin var)
```

### Dosya Yapısı

```
types/cv.ts                   → Tip tanımları (CVData, Experience, ...)
lib/schemas.ts                → Zod şemaları + export edilen TypeScript tipleri
lib/cv-helpers.ts             → Formatlama, normalizasyon, ATS analiz, sabitler
store/useCVStore.ts           → Zustand store (v5), migration dahil
components/ui/
  month-year-picker.tsx       → Özel ay/yıl seçici
  (+ shadcn otomatik kopyalananlar)
components/wizard/
  StepPersonalInfo.tsx        → useForm + zodResolver
  StepExperience.tsx          → useFieldArray
  StepEducation.tsx           → useFieldArray
  StepSkills.tsx              → inline zod.safeParse
  StepCertificates.tsx        → useFieldArray
  StepProjects.tsx            → useFieldArray
  StepLanguages.tsx           → useFieldArray + shadcn Select
components/themes/
  [ThemeName]Theme.tsx        → Sadece render, veriyi store'dan alır
components/InlineCV.tsx       → Layout + wizard + preview
```

### Anti-pattern'lar

```
❌ Manuel touched state (useState ile) → useForm mode: "onBlur" kullan
❌ Kopyalanmış validasyon mantığı     → lib/schemas.ts'e çek
❌ Doğrudan store'da tarih formatı    → ISO "YYYY-MM" zorunlu
❌ CSS içinde hard-coded renkler      → CSS variables kullan
❌ İkon tek başına iletişim bilgisi   → yanında görünür metin zorunlu
❌ Serbest text ile tarih girişi      → MonthYearPicker zorunlu
```

---

## 20. Validasyon Kuralları

### Zorunlu alanlar (\*)

| Alan                       | Kural                                           |
| -------------------------- | ----------------------------------------------- |
| Ad Soyad                   | Min 2 kelime, her biri 2+ karakter              |
| E-posta                    | RFC 5322 pratik alt küme — `z.string().email()` |
| Telefon                    | 10–15 rakam (uluslararası)                      |
| Hedef Pozisyon             | Min 2 karakter                                  |
| Pozisyon (deneyim)         | Min 2 karakter                                  |
| Şirket (deneyim)           | Min 2 karakter                                  |
| Başlangıç tarihi (deneyim) | Geçerli "YYYY-MM" veya "present"                |
| Bitiş tarihi (deneyim)     | Geçerli "YYYY-MM" veya "present"                |
| Okul (eğitim)              | Min 3 karakter                                  |
| Sertifika adı              | Min 3 karakter                                  |
| Veren kurum                | Min 2 karakter                                  |
| Proje adı                  | Min 3 karakter                                  |
| Dil adı                    | Min 2 karakter                                  |

### Tarih çapraz validasyonu

```
endDate >= startDate (ISO string karşılaştırması çalışır)
endDate === "present" → her zaman geçerli
```

### Uyarı eşikleri (hata değil, bilgi)

| Durum                    | Uyarı                              |
| ------------------------ | ---------------------------------- |
| Özet < 250 karakter      | "Biraz daha genişletin"            |
| Özet > 600 karakter      | "Çok uzun"                         |
| Beceri > 15              | "Keyword stuffing riski"           |
| Fotoğraf var             | "ATS uyarısı"                      |
| Sertifika süresi dolmuş  | "Kaldırmanızı öneririz"            |
| Açıklamada rakam yok     | "Sayısal metrik ekleyin"           |
| Açıklama pasif başlıyor  | "Aksiyon fiiliyle başlayın"        |
| Teknolojiler boş (proje) | "ATS skill taraması kaçırılabilir" |

### Normalizasyon (onBlur'da otomatik)

| Alan     | İşlem                                      |
| -------- | ------------------------------------------ |
| Telefon  | `+90 5XX XXX XX XX` formatı                |
| LinkedIn | `linkedin.com/in/xxx` normalize            |
| GitHub   | `github.com/xxx` normalize                 |
| URL'ler  | Protokol ve trailing slash temizle         |
| Beceri   | Trim, duplicate kontrol (case-insensitive) |

---

## 21. Tema Tasarım Sistemi

### Temalar için değişmez kurallar

1. **Veri store'dan gelir** — tema kendi state'i olmaz
2. **Tek sütun zorunlu** — görsel ikiye böler gibi tasarım olsa bile DOM akışı tek sütun
3. **Tüm metin seçilebilir** — `user-select: none` metin üzerinde yasak
4. **`data-ats-*` attribute'ları korunur** — tasarım değişse bile attribute'lar kalır
5. **`sr-only` etiketler korunur** — görsel olmayan ama parser'ın okuduğu metinler
6. **Boş bölümler render edilmez** — `if (!data.length) return null`
7. **Metin `position: absolute` ile konumlandırılmaz**
8. **Font embed garantisi** — özel font kullanılıyorsa Puppeteer'ın embed ettiği onaylanmalı

### CSS değişkeni sistemi (her tema için)

```css
:root {
  --cv-color-primary: #0052cc;
  --cv-color-text: #0a1930;
  --cv-color-muted: #8a9ebd;
  --cv-color-border: #e6f0fa;
  --cv-color-bg: #ffffff;
  --cv-font-heading: "Calibri", Arial, sans-serif;
  --cv-font-body: "Calibri", Arial, sans-serif;
}
```

### Tasarım öncelik sırası

```
1. ATS parse edilebilirliği    ← asla taviz yok
2. HR okunabilirliği            ← temiz hiyerarşi
3. Tipografik kalite            ← font seçimi, boşluklar
4. Görsel kimlik                ← renk, aksanlar
5. Animasyon/efekt              ← sadece preview'da, PDF'te yok
```

### Tema bileşeni temel iskelet

```tsx
export default function MyTheme() {
  const { cvData } = useCVStore();
  const {
    personalInfo,
    experiences,
    educations,
    skills,
    certificates,
    projects,
    languages,
  } = cvData;

  return (
    <div
      data-ats-document="true"
      className="w-[210mm] h-[297mm] bg-white font-[Calibri,Arial,sans-serif]
                 text-[#0A1930] text-[10.5pt] leading-[1.15]"
      style={{ fontFamily: "Calibri, Arial, sans-serif" }}
    >
      {/* İletişim — en üstte, header DOM'da değil */}
      <ContactBlock data={personalInfo} />

      {/* Özet — sadece doluysa */}
      {personalInfo.summary && <SummarySection data={personalInfo.summary} />}

      {/* Deneyim — sadece doluysa */}
      {experiences.length > 0 && <ExperienceSection data={experiences} />}

      {/* Eğitim — sadece doluysa */}
      {educations.length > 0 && <EducationSection data={educations} />}

      {/* Beceriler — sadece doluysa */}
      {skills.length > 0 && <SkillsSection data={skills} />}

      {/* Sertifikalar — sadece doluysa */}
      {certificates.length > 0 && <CertificatesSection data={certificates} />}

      {/* Projeler — sadece doluysa */}
      {projects.length > 0 && <ProjectsSection data={projects} />}

      {/* Diller — sadece doluysa */}
      {languages.length > 0 && <LanguagesSection data={languages} />}
    </div>
  );
}
```

---

## 22. PDF Çıktısı

### Puppeteer server-side render

```
Endpoint       : POST /api/generate-pdf
Format         : A4 (210mm × 297mm)
DPI            : 150 (ATS için yeterli, dosya boyutu dengeli)
Margin         : min 0.5in (1.27cm) her yönde
Font embed     : Otomatik (sayfa fontları Puppeteer tarafından yakalanır)
Print media    : @media print CSS kuralları aktif
```

### Font embed güvencesi

```javascript
// Puppeteer'da font yüklenmesini bekle
await page.evaluateHandle("document.fonts.ready");
```

### PDF meta verileri (SEO / erişilebilirlik)

```
Title    : "[Ad Soyad] — CV"
Language : tr (veya en)
Tagged   : true (erişilebilir PDF)
```

### Çıktı doğrulama kontrol listesi

```
☐ Metin seçilebilir (kopyalanabilir)
☐ Arama yapılabilir (Ctrl+F çalışır)
☐ Dosya boyutu < 5 MB
☐ Dosya adı Türkçe karakter içermez
☐ Sayfa kenar boşlukları yeterli
☐ Tüm fontlar embed edilmiş
☐ Link'ler tıklanabilir (href aktif)
```

---

## HIZLI BAŞVURU: Parse Edilebilirlik Testi

Herhangi bir CV tasarımını şu 5 soruyla test et:

```
1. CV metnini kopyalayıp .txt'e yapıştır.
   → Anlam kaybı var mı? Kelimeler karışık mı?
   → Hayır: ✅  /  Evet: ❌ Yapısal sorun var

2. Bölüm başlıklarını ara (Ctrl+F ile "Deneyim").
   → Bulunuyor mu?
   → Evet: ✅  /  Hayır: ❌ Başlık görsel-only

3. Tarihler tutarlı formatta mı?
   → Tek format: ✅  /  Karışık: ❌

4. İletişim bilgileri body'de mi?
   → Evet: ✅  /  Header/footer'da: ❌

5. Tüm ikonların yanında görünür metin var mı?
   → Evet: ✅  /  Hayır: ❌ Veri kaybolur
```

---

_Bu dosya projenin tek kural kaynağıdır. Son güncelleme: 2026-04_
