# The Urlist

A modern web application for creating, managing, and sharing curated lists of URLs with custom slugs. Built with Astro, React, TypeScript, and PostgreSQL.

## 🌟 Features

✨ **Create URL Lists** - Build curated collections of URLs with custom titles and descriptions  
🔗 **Custom Slugs** - Share your lists with memorable URLs (urlist.co/your-slug)  
📝 **Rich Management** - Add, edit, delete, and reorder URLs within your lists  
🌍 **Public Sharing** - Publish lists to make them discoverable or keep them private  
📱 **Responsive Design** - Beautiful UI that works on all devices  
🔍 **SEO Optimized** - Proper meta tags and structured data for search engines  
⚡ **Fast & Modern** - Built with cutting-edge web technologies for optimal performance

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd UrlListWeb
```

2. **Start the database**
```bash
docker-compose up -d
```

3. **Install dependencies**
```bash
npm install
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser** to `http://localhost:4321`

## 📁 Project Structure

```text
/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── components/         # React components
│   │   ├── CreateUrlListForm.tsx
│   │   ├── DashboardGrid.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── UrlListGrid.tsx
│   │   ├── UrlManager.tsx
│   │   └── Welcome.astro
│   ├── layouts/           # Layout components
│   │   └── Layout.astro
│   ├── lib/              # Utility libraries
│   │   ├── database.ts
│   │   └── urlListService.ts
│   ├── pages/            # File-based routing
│   │   ├── api/          # API endpoints
│   │   │   ├── lists/
│   │   │   └── urls/
│   │   ├── lists/        # List detail pages
│   │   ├── share/        # Public sharing pages
│   │   ├── 404.astro
│   │   ├── create.astro
│   │   ├── dashboard.astro
│   │   └── index.astro
│   └── styles/           # Global styles
│       └── global.css
├── docker-compose.yml    # Database setup
├── tailwind.config.mjs   # Tailwind configuration
└── package.json
```

## 🛠 Tech Stack

### Frontend
- **[Astro](https://astro.build)** - Modern static site generator with islands architecture
- **[React](https://react.dev)** - UI components with TypeScript
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Nanostores](https://github.com/nanostores/nanostores)** - State management

### Backend
- **[PostgreSQL](https://postgresql.org)** - Robust relational database
- **REST API** - Built with Astro API routes

### Development
- **[Docker](https://docker.com)** - Containerized development environment
- **[pgAdmin](https://pgadmin.org)** - Database administration interface
- **TypeScript** - Type-safe development
- **ESLint & Prettier** - Code quality and formatting

## 📋 API Endpoints

### URL Lists
- `GET /api/lists` - Get all URL lists
- `POST /api/lists` - Create a new URL list
- `GET /api/lists/[id]` - Get a specific URL list
- `PUT /api/lists/[id]` - Update a URL list
- `DELETE /api/lists/[id]` - Delete a URL list
- `PATCH /api/lists/[id]/publish` - Publish/unpublish a URL list

### URLs within Lists
- `GET /api/lists/[id]/urls` - Get all URLs in a list
- `POST /api/lists/[id]/urls` - Add a URL to a list
- `GET /api/urls/[urlId]` - Get a specific URL
- `PUT /api/urls/[urlId]` - Update a URL
- `DELETE /api/urls/[urlId]` - Delete a URL

## 🗃 Database Schema

### `url_lists` Table
```sql
CREATE TABLE url_lists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `urls` Table
```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    url_list_id INTEGER REFERENCES url_lists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local dev server at `localhost:4321`      |
| `npm run build`           | Build production site to `./dist/`              |
| `npm run preview`         | Preview build locally before deploying          |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`|
| `npm run astro -- --help` | Get help using the Astro CLI                    |

### Docker Commands

| Command                              | Action                                    |
| :----------------------------------- | :---------------------------------------- |
| `docker-compose up -d`               | Start database services in background    |
| `docker-compose down`                | Stop all services                        |
| `docker-compose logs`                | View service logs                        |
| `docker-compose up --build -d`       | Rebuild and start services              |
| `docker-compose down -v`             | Stop services and remove volumes        |

## ⚙️ Development Setup

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://docker.com/get-started)

### Database Setup

1. **Start PostgreSQL and pgAdmin containers:**
```bash
docker-compose up -d
```

2. **Database will be automatically initialized** with schema and sample data

3. **Access pgAdmin** at http://localhost:8080:
   - **Email:** `admin@urlist.local`
   - **Password:** `admin123`
   - PostgreSQL server is pre-configured and available

4. **Database connection details:**
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `urlist_db`
   - **Username:** `urlist_user`
   - **Password:** `urlist_password`

### Application Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Copy environment variables:**
```bash
cp .env.example .env
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:4321`

## 📖 Usage Guide

### Creating Your First URL List

1. Visit the **Create** page (`/create`)
2. Fill in the form:
   - **Title:** Give your list a descriptive name
   - **Slug:** Choose a unique URL slug (e.g., "my-awesome-links")
   - **Description:** Optionally describe your list
3. Click **Create List**

### Managing URLs

1. Navigate to your list detail page (`/lists/[id]`)
2. Use the URL Manager to:
   - **Add URLs:** Click "Add New URL" and fill in the details
   - **Edit URLs:** Click the edit button on any URL
   - **Delete URLs:** Click the delete button to remove URLs
   - **Reorder:** URLs are automatically ordered by creation

### Publishing and Sharing

1. On the list detail page, click **Publish List**
2. Once published, your list will be available at `/share/[slug]`
3. Share the public URL with anyone
4. Toggle visibility with **Unpublish** to make it private again

### Dashboard Overview

Visit `/dashboard` to see:
- **Total Lists:** Count of all your URL lists
- **Published Lists:** Count of publicly visible lists
- **Total URLs:** Sum of all URLs across your lists
- **Grid View:** Quick access to all your lists with action buttons

## 🎨 Customization

### Styling
- **Tailwind CSS** is configured for rapid styling
- **Global styles** are in `src/styles/global.css`
- **Component-specific** styles use Tailwind utility classes

### Adding Features
- **API routes** follow RESTful conventions in `src/pages/api/`
- **React components** are in `src/components/`
- **Astro pages** handle routing and server-side rendering

## 🚀 Deployment

### Production Build

1. **Build the application:**
```bash
npm run build
```

2. **Preview locally:**
```bash
npm run preview
```

### Deployment Options

- **[Vercel](https://vercel.com)** - Zero-config deployment
- **[Netlify](https://netlify.com)** - Static site hosting
- **[Railway](https://railway.app)** - Full-stack deployment
- **[DigitalOcean App Platform](https://digitalocean.com)** - Managed hosting

### Environment Variables

Required for production:
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🧪 Testing

### API Testing

You can test the API endpoints using curl or any HTTP client:

```bash
# Create a new URL list
curl -X POST http://localhost:4321/api/lists \
  -H "Content-Type: application/json" \
  -d '{"title":"My Test List","slug":"test-list","description":"A test list"}'

# Add a URL to the list
curl -X POST http://localhost:4321/api/lists/1/urls \
  -H "Content-Type: application/json" \
  -d '{"title":"GitHub","url":"https://github.com","description":"Code hosting"}'
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow **TypeScript** best practices
- Use **Tailwind CSS** for styling
- Write **semantic HTML** with proper accessibility
- Test **API endpoints** before submitting
- Follow **conventional commit** messages

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Astro](https://astro.build)** for the amazing framework
- **[Tailwind CSS](https://tailwindcss.com)** for beautiful, responsive design
- **[PostgreSQL](https://postgresql.org)** for reliable data storage
- **[React](https://react.dev)** for powerful component architecture

## 📞 Support

If you have questions or need help:

1. Check the [documentation](https://docs.astro.build)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new)

---

Built with ❤️ using modern web technologies.
