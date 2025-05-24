# Copilot Instructions for The Urlist

## Project Overview

**Application Name:** The Urlist  
**Description:** An application for sharing lists of links with a URL  
**Tech Stack:** Astro, React, Nanostores, Tailwind CSS, PostgreSQL

## Architecture & Technology Guidelines

### Astro Framework
- Use Astro for the main application framework and static site generation
- Leverage Astro's partial hydration - only hydrate components that need interactivity
- Use `.astro` components for static content and layouts
- Use React components only when client-side interactivity is required
- Follow Astro's file-based routing in `src/pages/`
- Use Astro's built-in image optimization for all images

### React Integration
- Use React components sparingly - only for interactive UI elements
- Prefer Astro components for static content
- Use React hooks appropriately (useState, useEffect, etc.)
- Implement proper error boundaries for React components
- Use TypeScript with React components for type safety

### State Management with Nanostores
- Use Nanostores for global state management across the application
- Create atomic stores for individual pieces of state
- Use computed stores for derived state
- Implement proper store cleanup and subscriptions
- Keep stores minimal and focused on specific domains
- Example store structure:
  ```typescript
  // stores/urlLists.ts
  import { atom, computed } from 'nanostores'
  
  export const urlLists = atom([])
  export const selectedList = atom(null)
  export const filteredLists = computed(...)
  ```

### Styling with Tailwind CSS
- Use Tailwind CSS utility classes for all styling
- Avoid custom CSS unless absolutely necessary
- Follow mobile-first responsive design principles
- Use Tailwind's design tokens for consistent spacing, colors, and typography
- Implement dark mode support using Tailwind's dark mode utilities
- Group related Tailwind classes logically:
  ```html
  <!-- Layout classes first, then appearance, then state -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  ```

### Database (PostgreSQL)
- Use proper database migrations for schema changes
- Implement database connection pooling
- Use parameterized queries to prevent SQL injection
- Follow proper indexing strategies for performance
- Implement proper error handling for database operations
- Use transactions for related operations

## File Structure & Organization

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements (Button, Input, etc.)
│   ├── forms/          # Form-specific components
│   └── features/       # Feature-specific components
├── layouts/            # Page layouts
├── pages/              # File-based routing
├── stores/             # Nanostores state management
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and Tailwind config
└── assets/             # Static assets
```

### Naming Conventions
- Use PascalCase for component files: `UrlListCard.astro`
- Use camelCase for utility functions and variables
- Use kebab-case for page routes: `url-lists.astro`
- Use SCREAMING_SNAKE_CASE for constants
- Use descriptive, meaningful names that indicate purpose

## Component Guidelines

### Astro Components
- Keep components focused and single-purpose
- Use props with proper TypeScript definitions
- Implement proper error handling
- Use slots for flexible content composition
- Example:
  ```astro
  ---
  interface Props {
    title: string;
    links: Link[];
    isPublic?: boolean;
  }
  
  const { title, links, isPublic = false } = Astro.props;
  ---
  ```

### React Components
- Use functional components with hooks
- Implement proper prop validation with TypeScript
- Use React.memo for performance optimization when appropriate
- Handle loading and error states properly
- Example:
  ```tsx
  interface UrlListProps {
    listId: string;
    onUpdate?: (list: UrlList) => void;
  }
  
  export const UrlListComponent: React.FC<UrlListProps> = ({ listId, onUpdate }) => {
    // Component implementation
  };
  ```

## Code Quality Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations for function parameters and return values
- Avoid `any` type - use proper typing or `unknown`
- Implement proper error types

### Error Handling
- Implement comprehensive error handling for all async operations
- Use proper error boundaries in React components
- Log errors appropriately for debugging
- Show user-friendly error messages
- Handle network failures gracefully

### Performance
- Optimize images and assets
- Implement proper caching strategies
- Use lazy loading for components and images
- Minimize bundle size with proper code splitting
- Implement proper SEO meta tags

### Security
- Validate all user inputs
- Sanitize data before database operations
- Implement proper authentication and authorization
- Use HTTPS in production
- Implement rate limiting for API endpoints

## API Design

### RESTful Endpoints
- Follow RESTful conventions for API design
- Use proper HTTP status codes
- Implement consistent error response format
- Use proper request/response validation
- Example endpoints:
  ```
  GET    /api/lists           # Get all lists
  GET    /api/lists/:id       # Get specific list
  POST   /api/lists           # Create new list
  PUT    /api/lists/:id       # Update list
  DELETE /api/lists/:id       # Delete list
  ```

### Data Validation
- Validate all incoming data
- Use schema validation libraries (Zod recommended)
- Return meaningful validation error messages
- Implement proper rate limiting

## Testing Strategy

### Unit Testing
- Write unit tests for utility functions
- Test React components with React Testing Library
- Mock external dependencies properly
- Aim for high test coverage on critical paths

### Integration Testing
- Test API endpoints thoroughly
- Test database operations
- Test user workflows end-to-end

## Development Workflow

### Git Practices
- Use conventional commit messages
- Create feature branches for new development
- Write descriptive pull request descriptions
- Keep commits atomic and focused

### Code Review
- Review for security vulnerabilities
- Check for performance implications
- Ensure TypeScript types are properly defined
- Verify accessibility compliance
- Check responsive design implementation

## Accessibility (a11y)

### Implementation Requirements
- Use semantic HTML elements
- Implement proper ARIA labels and roles
- Ensure keyboard navigation works properly
- Maintain proper color contrast ratios
- Add alt text for all images
- Test with screen readers

## SEO & Performance

### Meta Tags
- Implement proper Open Graph meta tags
- Use descriptive page titles and meta descriptions
- Implement proper canonical URLs
- Add structured data markup

### Performance Optimization
- Optimize images with proper formats and sizes
- Implement lazy loading
- Use proper caching headers
- Minimize JavaScript bundle size
- Optimize CSS delivery

## Environment Configuration

### Environment Variables
- Use proper environment variable management
- Never commit secrets to version control
- Use different configurations for development/staging/production
- Document all required environment variables

## Deployment

### Production Readiness
- Use proper environment configurations
- Implement health checks
- Set up proper logging and monitoring
- Use CDN for static assets
- Implement proper backup strategies

---

**Remember:** Always prioritize user experience, security, and maintainability when making development decisions. When in doubt, prefer explicit over implicit, and simple over complex solutions.