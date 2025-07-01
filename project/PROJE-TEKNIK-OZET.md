# EasyTradeTR Projesi - Teknik Altyapı ve Kullanılan Teknolojiler

## 1. Genel Mimari
- **Monorepo yapı:**  
  - `project/backend` (Laravel tabanlı API)
  - `project/frontend` (Next.js tabanlı modern arayüz)

---

## 2. Backend (API Sunucusu)

**Framework:**  
- **Laravel 12.x** (PHP 8.2+)

**Başlıca Paketler:**
- `laravel/sanctum` — API authentication (token tabanlı güvenlik)
- `phpoffice/phpspreadsheet` — Excel dosyası okuma/yazma (toplu ürün yükleme)
- `barryvdh/laravel-dompdf` — PDF çıktısı oluşturma
- `laravel/tinker`, `fakerphp/faker`, `phpunit/phpunit` — Geliştirici araçları ve testler

**Özellikler:**
- RESTful API mimarisi
- Eloquent ORM ile veritabanı işlemleri
- Migration, Seeder, Model, Controller yapısı
- Excel ile toplu ürün yükleme
- PDF teklif çıktısı
- Teklif ve ürün yönetimi
- Kullanıcı kayıt/giriş işlemleri

---

## 3. Frontend (Kullanıcı Arayüzü)

**Framework:**  
- **Next.js 15.x** (React 19, TypeScript)

**Başlıca Paketler ve Teknolojiler:**
- **shadcn/ui** — Modern, erişilebilir ve özelleştirilebilir React UI bileşenleri
- **Radix UI** — Erişilebilir primitive UI bileşenleri (shadcn altında)
- **Tailwind CSS** — Utility-first modern CSS framework
- **next-themes** — Dark/Light mod yönetimi
- **lucide-react** — Modern ikon seti
- **react-hook-form** — Form yönetimi ve validasyon
- **zod** — Şema tabanlı validasyon
- **date-fns** — Tarih işlemleri
- **recharts** — Grafikler ve veri görselleştirme
- **Context API** — Global state yönetimi (AuthContext, AppContext)
- **Custom Hooks** — useToast, useMobile vb.
- **Toast/Notification** — Kullanıcıya hata ve başarı mesajları göstermek için

**Özellikler:**
- Modern, responsive ve kart tabanlı arayüz
- Koyu/açık tema desteği (dark/light mod)
- Excel ile toplu ürün yükleme
- PDF önizleme ve çıktı
- Ürün ve teklif yönetimi
- Kayıt ol, giriş yap, şifre göster/gizle, kullanıcı dostu hata yönetimi
- API ile backend haberleşmesi (fetch ile)
- Animasyonlu ve kullanıcı dostu formlar

---

## 4. Örnek Bağımlılık Sürümleri

**Backend (composer.json):**
- laravel/framework: ^12.0
- laravel/sanctum: ^4.1
- phpoffice/phpspreadsheet: ^4.4
- barryvdh/laravel-dompdf: ^3.1

**Frontend (package.json):**
- next: 15.2.4
- react: ^19
- tailwindcss: ^3.4.17
- shadcn/ui (ve Radix UI bileşenleri)
- next-themes: ^0.4.4
- lucide-react: ^0.454.0
- react-hook-form: ^7.54.1
- zod: ^3.24.1

---

## 5. Klasör ve Kod Yapısı

- **Backend:**  
  - `app/Http/Controllers/`, `app/Models/`, `routes/`, `database/`
- **Frontend:**  
  - `app/`, `components/`, `hooks/`, `contexts/`, `public/`, `styles/`

---

## 6. Ekstra Notlar

- **Monorepo**: Hem backend hem frontend aynı proje altında yönetiliyor.
- **Geliştirici deneyimi**: Modern, ölçeklenebilir ve kolay bakım yapılabilir bir yapı.
- **Kullanıcı deneyimi**: Hızlı, responsive, modern ve kullanıcı dostu arayüzler. 