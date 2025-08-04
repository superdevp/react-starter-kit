# React Starter Kit - Project Management App

A modern, full-featured React application built with TypeScript, Tailwind CSS, and React Router. This starter kit demonstrates best practices for building scalable React applications with authentication, state management, and responsive design.

## 🚀 Features

### Core Features
- **Authentication System** - JWT-like mock authentication with protected routes
- **Project Management** - Create, view, edit, and delete projects
- **Task Management** - Add tasks to projects with priority levels and due dates
- **Progress Tracking** - Visual progress indicators for project completion
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Dark Mode** - Toggle between light and dark themes
- **Form Validation** - Client-side validation with error handling
- **Local Storage** - Data persistence using browser storage

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **React Router v6** - Modern routing with protected routes
- **Context API** - Lightweight state management for auth and theme
- **Custom Hooks** - Reusable logic for API calls and form handling
- **Component Library** - Reusable UI components (Button, Input, Modal, etc.)
- **Mock API** - Simulated backend with localStorage persistence
- **Error Handling** - Comprehensive error states and loading indicators

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-starter-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Authentication

This app uses mock authentication for demonstration purposes:

- **Login**: Use any email and password combination
- **Demo User**: The app will automatically log you in as "Demo User"
- **Persistence**: Authentication state is saved in localStorage
- **Protected Routes**: Dashboard and project pages require authentication

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   ├── ProjectCard.tsx # Project display component
│   └── ProtectedRoute.tsx # Authentication wrapper
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── ThemeContext.tsx # Dark/light theme management
├── layout/             # Layout components
│   └── Header.tsx      # Navigation header
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   │   └── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectDetailsPage.tsx
│   └── NotFoundPage.tsx
├── services/           # API and data services
│   ├── api.ts          # Mock API functions
│   └── mockData.ts     # Sample data
├── types/              # TypeScript type definitions
│   └── index.ts
├── theme.js            # Design tokens and theme configuration
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎨 Design System

The app uses a consistent design system built with Tailwind CSS:

### Colors
- **Primary**: Blue color palette for main actions
- **Gray**: Neutral colors for text and backgrounds
- **Success**: Green for completed tasks
- **Warning**: Yellow for medium priority
- **Error**: Red for high priority and errors

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Input**: Form inputs with validation states
- **Modal**: Overlay dialogs for forms and confirmations
- **Card**: Content containers with hover effects

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interactions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Pages & Routes

### Public Routes
- `/login` - Authentication page

### Protected Routes
- `/dashboard` - Project overview and management
- `/project/:id` - Individual project details and task management

### Special Routes
- `/` - Redirects to dashboard
- `/*` - 404 Not Found page

## 🚀 How to Extend

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Import and use the `ProtectedRoute` wrapper if needed

### Adding New Components
1. Create reusable components in `src/components/`
2. Follow the existing naming conventions
3. Use TypeScript interfaces for props
4. Include proper error handling and loading states

### Adding New Features
1. **API Integration**: Extend `src/services/api.ts`
2. **State Management**: Use Context API or create custom hooks
3. **Styling**: Use Tailwind classes and extend the theme in `tailwind.config.js`
4. **Validation**: Add form validation using the existing patterns

### Customizing the Theme
1. Modify `src/theme.js` for design tokens
2. Update `tailwind.config.js` for custom utilities
3. Add new component variants in `src/index.css`

## 🎯 Learning Objectives

This starter kit demonstrates:

- **Modern React Patterns**: Hooks, Context, TypeScript
- **State Management**: Context API for global state
- **Routing**: Protected routes and navigation
- **Form Handling**: Controlled inputs and validation
- **API Integration**: Mock services with error handling
- **Responsive Design**: Mobile-first approach
- **Component Architecture**: Reusable, composable components
- **Type Safety**: Full TypeScript implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing documentation
2. Review the code comments
3. Open an issue on GitHub
4. Contact the maintainers

---

**Happy Coding! 🎉**
