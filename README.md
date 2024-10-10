# Blog App
 
A full-stack blogging application that combines a serverless backend with a responsive frontend. This app allows users to create, edit, and view blog posts, with a seamless user experience powered by modern technologies.

## Live Demo

- https://medium-pearl-xi.vercel.app/


## Tech Stack

- **Backend**: [Hono](https://hono.dev/) for serverless backend, Cloudflare Workers, Prisma, PostgreSQL
- **Frontend**: [React](https://react.dev/) with [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/) for styling
- **Validation**: [Zod](https://zod.dev/) for input schema validation
- **Database**: PostgreSQL, managed by Prisma ORM

## Project Structure

The project is organized into three top-level folders:

- **backend**: Contains the Hono app for serverless backend services.
- **common**: Houses shared resources, such as Zod validation schemas.
- **frontend**: Holds the Vite project for the app’s frontend.

## Prerequisites

Before running the project, ensure you have the following:

- **Cloudflare Wrangler**: To deploy and manage the backend with Cloudflare Workers.
- **Node.js** and **npm**: For installing and running dependencies.

## Setup

### Clone the repository:
```bash
 git clone https://github.com/Error-Harry/Medium.git
 cd Medium
```
### Backend

1. **Configure Environment Variables**:
- Create an `.env` file in the backend folder with the following:
```plaintext
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

2. **Configure Wrangler**:
- In the `wrangler.toml` file, add your connection pool URL:
 
```toml
DATABASE_URL=your_connection_pool_url
JWT_SECRET=your_jwt_secret
```

3. **Install Dependencies and Start the Backend**:
```bash
cd backend
npm install
npm run dev
```

- The backend will be available at `http://127.0.0.1:8787`

### Frontend

1. **Set Backend URL**:
- In `config.ts`, update the backend URL:
```plaintext
export const BACKEND_URL = 'your_backend_url';
```

2. **Install Dependencies and Start the Backend**:
```bash
cd ../frontend
npm install
npm run dev
```

- The frontend should be available at the local development server provided by Vite, typically `http://localhost:5173`.

### Using Zod Validation

To utilize Zod validation schemas across both backend and frontend:

1. **Publish Zod Schemas to npm**:
   - Navigate to the `common` folder and publish your schemas as a package on npm.

2. **Install the Package**:
   - In both backend and frontend, install the Zod schemas from the npm registry.

## Additional Notes

- Make sure your [Cloudflare Worker](https://developers.cloudflare.com/workers/) has the necessary permissions to connect to your PostgreSQL instance.
- Use [Prisma's Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/connection-pooling) (Prisma Accelerate) to optimize database performance and scalability.
- Tailwind CSS is already set up in the frontend for quick and easy styling.

