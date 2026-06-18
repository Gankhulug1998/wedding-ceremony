# Хуримын урилга вэб сайт 💍

Болд & Оюун — нэг хуудаст хуримын урилга. Цэвэр HTML/CSS/JS, ямар ч framework шаардахгүй. GitHub Pages дээр шууд байршуулж болно.

## Юу багтсан вэ

- **Hero** — хосын нэр, огноо, "Ирэхээ батлах" товч
- **Countdown** — хуримд үлдсэн хугацааны бодит тоолуур
- **Бидний түүх** хэсэг
- **Ёслолын хөтөлбөр** — 3 картаар (ёслол / хүлээн авалт / үдэшлэг)
- **Галерей** — 6 зургийн grid
- **Газрын зураг** — Google Maps embed
- **RSVP форм** — ирэх эсэхийг бүртгэх (одоогоор браузерт localStorage-д хадгална)
- **Хөгжим** — баруун доод буланд тоглуулах товч
- Скролл дагасан анимэйшн, гар утсанд тохирсон (responsive)

## Хэрхэн засах вэ

| Юуг | Хаана |
|-----|-------|
| Хосын нэр, огноо, текст | `index.html` |
| Огноо/цаг (тоолуур) | `script.js` дотор `WEDDING_DATE` |
| Өнгө, фонт, загвар | `styles.css` дээд талын `:root` хувьсагчид |
| Галерейн зургууд | `assets/photo1.avif … photo6.avif` (4:5 босоо) |
| Hero дэвсгэр зураг | `assets/hero.avif` (хэвтээ) |
| Дурсамжийн зурвас 1 / 2 | `assets/story.avif` / `assets/vows.avif` (хэвтээ) |
| Дэлбээний хэлбэр | `assets/petal.svg` |
| Хөгжим | `assets/music.mp3` |
| Газрын зураг | `index.html` дотор `iframe` болон `btn-outline` линк |

> **Зураг солих:** дээрх файлуудыг ижил нэрээр (эсвэл `index.html`/`styles.css` доторх замыг
> зассанаар) сольно. Галерейн зураг **4:5 босоо**, hero болон зурвасын зураг **хэвтээ** байвал
> хамгийн сайхан тохирно. Галерейн `alt`/`data-caption` текстийг утгаар нь солихоо мартуузай.
>
> Зургууд нь орчин үеийн **AVIF** форматтай (жижиг, чанартай) — бараг бүх шинэ браузер дэмждэг.
> Хуучин браузерт ажиллуулах шаардлагатай бол `.jpg`/`.webp` болгон хувиргаж тавьж болно.

## Локалаар нээх

Зүгээр л `index.html`-г браузераар нээнэ, эсвэл:

```bash
cd wedding-ceremony
python3 -m http.server 8080
# дараа нь http://localhost:8080 руу орно
```

## GitHub Pages дээр тавих

```bash
git init && git add . && git commit -m "wedding site"
git branch -M main
git remote add origin https://github.com/<хэрэглэгч>/<repo>.git
git push -u origin main
```

Дараа нь GitHub → Settings → Pages → Branch: `main` / root → Save.

## RSVP-г жинхэнэ сервер рүү холбох

`script.js` дотор localStorage хадгалалтыг `fetch()`-ээр сольж болно. Хялбар хувилбарууд:
- **Google Forms / Sheets** (formresponse URL руу POST)
- **Formspree** эсвэл **Getform** (үнэгүй endpoint)
- Өөрийн backend (жишээ нь Edgebook маягийн Go API)
