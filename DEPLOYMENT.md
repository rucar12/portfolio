# Інструкції для деплою портфоліо

## Environment Variables

Потрібні наступні змінні оточення:

- `NEXT_PUBLIC_STRAPI_URL` - URL вашого Strapi бекенду
- `NEXT_PUBLIC_SITE_URL` - URL вашого сайту (для SEO та метаданих)
- `REVALIDATE_SECRET` - Секретний ключ для API revalidate (згенеруйте випадковий рядок)

## Варіанти деплою

### 1. Vercel (Рекомендовано для Next.js)

Vercel - найпростіший варіант для Next.js проектів.

#### Кроки:

1. **Підготуйте репозиторій:**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Зареєструйтесь на Vercel:**
   - Перейдіть на [vercel.com](https://vercel.com)
   - Увійдіть через GitHub/GitLab/Bitbucket

3. **Імпортуйте проект:**
   - Натисніть "Add New Project"
   - Виберіть ваш репозиторій
   - Vercel автоматично визначить Next.js

4. **Налаштуйте Environment Variables:**
   - В налаштуваннях проекту знайдіть "Environment Variables"
   - Додайте:
     - `NEXT_PUBLIC_STRAPI_URL` = `https://your-strapi-backend.com`
     - `NEXT_PUBLIC_SITE_URL` = `https://your-portfolio.vercel.app` (або ваш домен)
     - `REVALIDATE_SECRET` = `your-random-secret-key`

5. **Деплой:**
   - Натисніть "Deploy"
   - Vercel автоматично збудує та задеплоїть проект

#### Налаштування Strapi для revalidate:

В Strapi додайте webhook для автоматичного revalidate:

- URL: `https://your-portfolio.vercel.app/api/revalidate`
- Method: POST
- Headers: `x-revalidate-secret: your-random-secret-key`

---

### 2. Netlify

#### Кроки:

1. **Підготуйте `netlify.toml`:**

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Зареєструйтесь на Netlify:**
   - Перейдіть на [netlify.com](https://netlify.com)
   - Увійдіть через GitHub

3. **Додайте проект:**
   - "Add new site" → "Import an existing project"
   - Виберіть репозиторій

4. **Налаштуйте Environment Variables:**
   - Site settings → Environment variables
   - Додайте всі необхідні змінні

5. **Деплой:**
   - Netlify автоматично задеплоїть проект

---

### 3. Self-hosted (VPS/Server)

#### Кроки:

1. **Підготуйте сервер:**

   ```bash
   # Встановіть Node.js та npm
   # Клонуйте репозиторій
   git clone your-repo-url
   cd portfolio
   ```

2. **Створіть `.env.local` файл:**

   ```bash
   cp .env.example .env.local
   # Відредагуйте .env.local з вашими значеннями
   ```

3. **Встановіть залежності та збудуйте:**

   ```bash
   npm install
   npm run build
   ```

4. **Запустіть production сервер:**

   ```bash
   npm start
   ```

5. **Налаштуйте Nginx (опціонально):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Налаштування Strapi Backend

Переконайтеся, що ваш Strapi бекенд:

1. **Доступний публічно** (якщо використовуєте хостинг)
2. **CORS налаштований** для вашого домену:

   ```javascript
   // config/middlewares.js
   module.exports = [
     'strapi::logger',
     'strapi::errors',
     {
       name: 'strapi::security',
       config: {
         contentSecurityPolicy: {
           useDefaults: true,
           directives: {
             'connect-src': ["'self'", 'https:'],
             'img-src': ["'self'", 'data:', 'blob:', 'https:'],
             'media-src': ["'self'", 'data:', 'blob:', 'https:'],
             upgradeInsecureRequests: null,
           },
         },
       },
     },
     {
       name: 'strapi::cors',
       config: {
         enabled: true,
         headers: '*',
         origin: ['http://localhost:3000', 'https://your-portfolio-domain.com'],
       },
     },
     'strapi::poweredBy',
     'strapi::query',
     'strapi::body',
     'strapi::session',
     'strapi::favicon',
     'strapi::public',
   ]
   ```

3. **Медіа файли доступні** через публічний URL

---

## Генерація REVALIDATE_SECRET

Згенеруйте випадковий секретний ключ:

```bash
# Linux/Mac
openssl rand -base64 32

# Або використайте онлайн генератор
```

---

## Перевірка після деплою

1. Перевірте, що сайт відкривається
2. Перевірте, що дані з Strapi завантажуються
3. Перевірте, що теми (світла/темна) працюють
4. Перевірте, що всі зображення завантажуються
5. Перевірте SEO метадані в інструментах розробника

---

## Troubleshooting

### Проблема: Зображення не завантажуються

- Перевірте `NEXT_PUBLIC_STRAPI_URL`
- Перевірте CORS налаштування в Strapi
- Перевірте `next.config.js` remotePatterns

### Проблема: Дані не завантажуються

- Перевірте, що Strapi доступний публічно
- Перевірте CORS налаштування
- Перевірте логи в консолі браузера

### Проблема: Revalidate не працює

- Перевірте `REVALIDATE_SECRET` в обох місцях (Vercel та Strapi webhook)
- Перевірте URL webhook в Strapi
