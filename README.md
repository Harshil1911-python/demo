# ✦ Serenia Portal

A form builder where you create login/register forms, get a shareable link, and embed them in any website.

---

## Project Structure

```
serenia-portal/
├── backend/    → Deploy on Render
└── frontend/   → Deploy on Netlify
```

---

## Deploy Backend on Render

1. Push the `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variable:
   - `JWT_SECRET` → any random string
6. Deploy! Note your URL: `https://your-app.onrender.com`

---

## Deploy Frontend on Netlify

1. Push the `frontend/` folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → New Site
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
5. Add environment variable:
   - `REACT_APP_API_URL` → `https://your-app.onrender.com/api`
6. Deploy!

---

## How It Works

1. Register on Serenia Portal
2. Create a form → choose fields
3. Get a unique link: `https://your-backend.onrender.com/form/abc123`
4. Share or embed that link in your website
5. Users register/login via that form
6. View all submissions in your Dashboard

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register portal user |
| POST | /api/auth/login | Login portal user |
| POST | /api/forms/create | Create a new form |
| GET | /api/forms/my-forms | Get all my forms |
| GET | /api/forms/:slug | Get form by slug |
| DELETE | /api/forms/:id | Delete a form |
| POST | /api/entries/:slug/register | End user registers |
| POST | /api/entries/:slug/login | End user logs in |
| GET | /api/entries/:formId | View all entries |
