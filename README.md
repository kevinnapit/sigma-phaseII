# Sigma Payroll Frontend

SvelteKit application dengan Clean Architecture untuk Sigma Payroll ERP system.

## Tech Stack

### Core Framework
- **SvelteKit 2** - Full-stack framework
- **Svelte 5** - UI framework with runes
- **TypeScript** - Type safety (strict mode)
- **Vite 7** - Build tool

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn-svelte** - Re-usable component library
- **bits-ui** - Headless UI components
- **Lucide Svelte** - Icon library
- **Embla Carousel** - Carousel component
- **Vaul Svelte** - Drawer component
- **LayerChart** - Chart library

### Data & State Management
- **TanStack Query** - Server state management
- **TanStack Table** - Powerful table component
- **Zod** - Schema validation
- **Formsnap** - Form handling
- **SvelteKit Superforms** - Advanced form management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **TypeScript ESLint** - TypeScript linting

## Architecture

Project ini menggunakan **Feature-Based Modular Architecture** dengan **Clean Architecture** principles:

1. **Feature Modules** (`src/lib/features/`) - Business domain modules dengan struktur lengkap
2. **Domain Layer** (`src/lib/domain/`) - Pure business logic, tidak ada dependency ke framework
3. **Data Layer** (`src/lib/data/`) - Implementation details (API calls, storage)
4. **Presentation Layer** (`src/routes/`, `src/lib/components/`) - UI components
5. **Dependency Injection** (`src/lib/di/`) - Wiring semua dependencies

### Clean Architecture Layers Explained

#### Domain Layer vs Data Layer - Repository Pattern

**Domain Repositories** (`src/lib/domain/repositories/`) adalah **interface/contract**:
- Mendefinisikan **apa yang bisa dilakukan** (what can be done)
- Pure TypeScript interfaces tanpa implementasi
- Tidak tahu bagaimana data diambil (dari API, localStorage, mock, dll)
- Contoh: `IEmployeeRepository` interface

**Data Repositories** (`src/lib/data/repositories/`) adalah **implementasi**:
- Mendefinisikan **bagaimana melakukannya** (how it's done)
- Implementasi konkret dari interface domain
- Bisa menggunakan HTTP client, localStorage, IndexedDB, dll
- Contoh: `EmployeeRepositoryImpl` class

**Kenapa dipisah?**
1. **Testability** - Mudah mock repository untuk testing
2. **Flexibility** - Ganti implementasi tanpa ubah business logic
3. **Dependency Inversion** - Domain tidak depend ke detail implementasi
4. **Multiple Implementations** - Bisa punya MockRepository, ApiRepository, LocalStorageRepository

**Contoh:**
```typescript
// Domain: Interface (contract)
// src/lib/domain/repositories/employee.repository.ts
export interface IEmployeeRepository {
  getEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee>;
}

// Data: Implementation (how)
// src/lib/data/repositories/people-functions/hrm/employee.repository.impl.ts
export class EmployeeRepositoryImpl implements IEmployeeRepository {
  async getEmployees() {
    return httpClient.get<Employee[]>('/hrm/api/employees');
  }
  
  async getEmployeeById(id: string) {
    return httpClient.get<Employee>(`/hrm/api/employees/${id}`);
  }
}

// Alternative: Mock Implementation (for testing)
export class EmployeeRepositoryMock implements IEmployeeRepository {
  async getEmployees() {
    return mockEmployees;
  }
  
  async getEmployeeById(id: string) {
    return mockEmployees.find(e => e.id === id);
  }
}
```

#### Use Cases (Business Logic)

Use cases berisi business logic dan orchestration:
- Validasi input
- Business rules
- Koordinasi antar repositories
- Error handling

```typescript
// src/lib/domain/usecases/people-functions/hrm/employee.usecase.ts
export class EmployeeUseCase {
  constructor(private employeeRepo: IEmployeeRepository) {}
  
  async getEmployeeById(id: string): Promise<Employee> {
    if (!id) {
      throw new Error('Employee ID is required');
    }
    return this.employeeRepo.getEmployeeById(id);
  }
}
```

#### Dependency Injection

DI Container menyatukan semua dependencies:

```typescript
// src/lib/di/container.client.ts
import { EmployeeRepositoryImpl } from '$lib/data/repositories/people-functions/hrm/employee.repository.impl';
import { EmployeeUseCase } from '$lib/domain/usecases/people-functions/hrm/employee.usecase';

const employeeRepository = new EmployeeRepositoryImpl();
export const employeeUseCase = new EmployeeUseCase(employeeRepository);
```

Untuk testing, ganti dengan mock:
```typescript
const employeeRepository = new EmployeeRepositoryMock();
export const employeeUseCase = new EmployeeUseCase(employeeRepository);
```

### Struktur Folder Lengkap

```
src/
├── routes/
│   ├── +layout.svelte               # Root layout (CSR only)
│   ├── +layout.ts                   # export const ssr = false
│   ├── layout.css                   # Global styles
│   │
│   ├── (public)/                    # Public routes (no auth)
│   │   ├── +layout.svelte           # Public layout
│   │   └── login/
│   │       └── +page.svelte         # Login page
│   │
│   └── (app)/                       # Protected routes (auth guard)
│       ├── +layout.ts               # Auth guard CSR
│       ├── +layout.svelte           # Dashboard shell (Sidebar + Topbar)
│       └── dashboard/
│           ├── +page.svelte         # Dashboard home
│           ├── people-function/     # HRM, Payroll, Clinic
│           │   └── hrm/
│           │       └── master/
│           │           └── pekerja/
│           │               ├── +page.svelte              # Employee list
│           │               └── detail/
│           │                   └── [id]/
│           │                       └── +page.svelte      # Employee detail
│           ├── material-management/ # Inventory
│           ├── agriculture-and-cultivation/ # Pembibitan
│           └── administration/      # Master data global
│
└── lib/
    ├── features/                    # Feature modules (modular architecture)
    │   └── hrm/                     # HRM feature module
    │       ├── components/          # Feature-specific components
    │       │   ├── EmployeeTable.svelte
    │       │   ├── EmployeeFilters.svelte
    │       │   └── EmployeeStats.svelte
    │       ├── types/               # Feature-specific types
    │       │   └── employee.types.ts
    │       ├── data/                # Mock data & constants
    │       │   ├── employee.data.ts
    │       │   └── employee-stats.data.ts
    │       ├── hooks/               # Feature-specific hooks (optional)
    │       ├── utils/               # Feature-specific utilities (optional)
    │       └── index.ts             # Public API exports
    │
    ├── components/
    │   ├── shared/                  # Reusable components across features
    │   │   ├── StatCard.svelte
    │   │   ├── PageHeader.svelte
    │   │   ├── TabsWithIcon.svelte
    │   │   ├── PaginationControls.svelte
    │   │   ├── Table.svelte
    │   │   └── index.ts
    │   ├── layout/                  # Layout components
    │   │   ├── Sidebar.svelte
    │   │   ├── Topbar.svelte
    │   │   ├── SearchModal.svelte
    │   │   └── EstateSelector.svelte
    │   └── ui/                      # shadcn-svelte components
    │       ├── button/
    │       ├── dialog/
    │       ├── input/
    │       ├── select/
    │       ├── tabs/
    │       └── ...
    │
    ├── config/
    │   └── menus/                   # Menu configuration
    │       ├── index.ts
    │       ├── dashboard-menu.ts
    │       ├── people-function-menu.ts
    │       └── ...
    │
    ├── domain/                      # Clean Architecture - Domain layer
    │   ├── entities/                # Business entities (pure TS classes)
    │   ├── repositories/            # Repository interfaces (contracts)
    │   │   ├── auth.repository.ts
    │   │   └── employee.repository.ts
    │   └── usecases/                # Business logic / use cases
    │       ├── auth.usecase.ts
    │       └── people-functions/
    │           └── hrm/
    │               └── employee.usecase.ts
    │
    ├── data/                        # Clean Architecture - Data layer
    │   ├── http/
    │   │   ├── http.client.ts       # Fetch wrapper with auth & error handling
    │   │   └── token.store.ts       # Token management (localStorage)
    │   └── repositories/            # Repository implementations
    │       ├── auth.repository.mock.ts
    │       └── people-functions/
    │           └── hrm/
    │               └── employee.repository.impl.ts
    │
    ├── di/                          # Dependency injection
    │   └── container.client.ts      # DI container (wiring)
    │
    ├── shared/                      # Shared utilities & types
    │   ├── types.ts                 # Shared types (User, ApiResponse, etc)
    │   ├── errors.ts                # AppError, HttpError, AuthError
    │   └── utils.ts                 # Utility functions (cn, formatDate, etc)
    │
    └── index.ts                     # Public API exports
```

### Feature Module Structure

Setiap feature module memiliki struktur lengkap dan independen:

```
features/[feature-name]/
├── components/           # UI components specific to this feature
├── types/               # TypeScript types & interfaces
├── data/                # Mock data, constants, fixtures
├── hooks/               # Svelte 5 runes hooks (optional)
├── utils/               # Feature-specific utilities (optional)
└── index.ts             # Public API - export everything
```

**Benefits:**
- **Scalability** - Easy to add new features
- **Maintainability** - Clear separation of concerns
- **Reusability** - Shared components reduce duplication
- **Testability** - Each feature can be tested independently
- **Team Collaboration** - Multiple developers can work on different features

## Features

### Authentication & Authorization
- ✅ Client-side auth guard
- ✅ Token-based authentication (localStorage)
- ✅ Mock authentication for development
- ✅ Role-based access control

### UI/UX
- ✅ Responsive sidebar with collapse/expand
- ✅ Search modal with keyboard shortcuts (⌘K)
- ✅ Recent pages tracking
- ✅ Menu navigation with breadcrumbs
- ✅ Dark mode support (via CSS variables)

### Menu Modules
- ✅ Dashboard
- ✅ Administrasi (Data Master Global)
- ✅ People Function (HRM, Payroll, Klinik)
- ✅ Material Management (Inventory)
- ✅ Budidaya & Agronomi (Pembibitan)

### Developer Experience
- ✅ Clean Architecture pattern
- ✅ Type-safe with TypeScript
- ✅ Component-driven development
- ✅ Hot module replacement
- ✅ ESLint + Prettier configured

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, pnpm, or bun

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd sigma-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=https://apisigma.iwkapps.com
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Default Login Credentials

```
Username: admin
Password: admin123

Username: user
Password: user123
```

## Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type check
npm run lint         # Lint code
npm run format       # Format code
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm test             # Run all tests
```

### API Integration Setup

Project ini menggunakan environment variable untuk API base URL:

**1. Environment Variables**

```env
# .env
VITE_API_BASE_URL=https://apisigma.iwkapps.com
```

**2. HTTP Client**

HTTP client otomatis inject Bearer token dari localStorage:

```typescript
// src/lib/data/http/http.client.ts
class HttpClient {
  private getHeaders(): Record<string, string> {
    const headers = { 'Content-Type': 'application/json' };
    const token = tokenStore.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}

export const httpClient = new HttpClient(import.meta.env.VITE_API_BASE_URL);
```

**3. Token Management**

Token disimpan di localStorage setelah login:

```typescript
// src/lib/data/http/token.store.ts
export const tokenStore = {
  setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  },
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },
  clear() {
    localStorage.removeItem('access_token');
  }
};
```

**Flow:**
1. User login → Token disimpan ke localStorage
2. Setiap API request → HTTP client auto-inject Bearer token
3. API calls menggunakan full URL dari environment variable
4. Contoh: `httpClient.get('/hrm/api/employees')` → `https://apisigma.iwkapps.com/hrm/api/employees`

### Adding New Feature Module

Follow the feature-based modular architecture:

#### 1. Create Feature Folder Structure
```bash
mkdir -p src/lib/features/[feature-name]/{components,types,data}
```

#### 2. Create Types
```typescript
// features/[feature-name]/types/[entity].types.ts
export type Entity = {
  id: string;
  name: string;
};
```

#### 3. Create Mock Data
```typescript
// features/[feature-name]/data/[entity].data.ts
import type { Entity } from '../types/[entity].types';

export const mockEntities: Entity[] = [
  { id: '1', name: 'Example' }
];
```

#### 4. Create Components
```svelte
<!-- features/[feature-name]/components/EntityTable.svelte -->
<script lang="ts">
  import type { Entity } from '../types/[entity].types';
  
  let { entities }: { entities: Entity[] } = $props();
</script>

<table>
  {#each entities as entity}
    <tr><td>{entity.name}</td></tr>
  {/each}
</table>
```

#### 5. Export Through index.ts
```typescript
// features/[feature-name]/index.ts
export { default as EntityTable } from './components/EntityTable.svelte';
export * from './types/[entity].types';
export * from './data/[entity].data';
```

#### 6. Use in Page
```svelte
<script lang="ts">
  import { EntityTable, mockEntities } from '$lib/features/[feature-name]';
  
  let entities = $state(mockEntities);
</script>

<EntityTable {entities} />
```

### Adding Feature with API Integration (Clean Architecture)

Untuk feature yang butuh API integration, gunakan Clean Architecture:

#### 1. Create Domain Layer

**Repository Interface (Contract)**:
```typescript
// src/lib/domain/repositories/employee.repository.ts
export interface IEmployeeRepository {
  getEmployees(params?: { size?: number; page?: number }): Promise<EmployeeApiResponse>;
  getEmployeeById(id: string): Promise<EmployeeDetailResponse>;
}
```

**Use Case (Business Logic)**:
```typescript
// src/lib/domain/usecases/people-functions/hrm/employee.usecase.ts
import type { IEmployeeRepository } from '../../../repositories/employee.repository';

export class EmployeeUseCase {
  constructor(private employeeRepo: IEmployeeRepository) {}
  
  async getEmployees(params?: { size?: number; page?: number }) {
    return this.employeeRepo.getEmployees(params);
  }
  
  async getEmployeeById(id: string) {
    if (!id) {
      throw new Error('Employee ID is required');
    }
    const response = await this.employeeRepo.getEmployeeById(id);
    return response.data;
  }
}
```

#### 2. Create Data Layer

**Repository Implementation**:
```typescript
// src/lib/data/repositories/people-functions/hrm/employee.repository.impl.ts
import type { IEmployeeRepository } from '$lib/domain/repositories/employee.repository';
import { httpClient } from '$lib/data/http/http.client';

export class EmployeeRepositoryImpl implements IEmployeeRepository {
  async getEmployees(params?: { size?: number; page?: number }) {
    return httpClient.get<EmployeeApiResponse>('/hrm/api/employees', {
      params: params as Record<string, string | number | boolean>
    });
  }
  
  async getEmployeeById(id: string) {
    return httpClient.get<EmployeeDetailResponse>(`/hrm/api/employees/${id}`);
  }
}
```

#### 3. Wire in DI Container

```typescript
// src/lib/di/container.client.ts
import { EmployeeRepositoryImpl } from '$lib/data/repositories/people-functions/hrm/employee.repository.impl';
import { EmployeeUseCase } from '$lib/domain/usecases/people-functions/hrm/employee.usecase';

const employeeRepository = new EmployeeRepositoryImpl();
export const employeeUseCase = new EmployeeUseCase(employeeRepository);

export const container = {
  employeeUseCase
} as const;
```

#### 4. Use in Component with TanStack Query

```svelte
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { employeeUseCase } from '$lib/di/container.client';
  import { page } from '$app/state';
  
  let pageNum = $derived(Number(page.url.searchParams.get('page')) || 1);
  let pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);
  
  const employeesQuery = createQuery({
    queryKey: ['employees', pageNum, pageSize],
    queryFn: () => employeeUseCase.getEmployees({ page: pageNum, size: pageSize })
  });
  
  let employees = $derived($employeesQuery.data?.data || []);
  let loading = $derived($employeesQuery.isLoading);
  let error = $derived($employeesQuery.error);
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error: {error.message}</p>
{:else}
  <EmployeeTable {employees} />
{/if}
```

**Benefits:**
- **Separation of Concerns** - Domain tidak tahu tentang HTTP/API
- **Testability** - Mudah mock repository untuk testing
- **Flexibility** - Ganti implementasi tanpa ubah business logic
- **Type Safety** - Full TypeScript support
- **State Management** - TanStack Query handle caching, loading, error

### Adding Shared Component

For components used across multiple features:

```bash
# Create in shared folder
src/lib/components/shared/ComponentName.svelte

# Export in index.ts
src/lib/components/shared/index.ts
```

Example:
```svelte
<!-- components/shared/DataTable.svelte -->
<script lang="ts">
  let { data, columns }: { data: any[]; columns: any[] } = $props();
</script>
```

### Adding New Route with Feature Module

1. **Create route**:
```bash
src/routes/(app)/dashboard/[module]/[page]/+page.svelte
```

2. **Import from feature module**:
```svelte
<script lang="ts">
  import { PageHeader } from '$lib/components/shared';
  import { EntityTable, mockEntities } from '$lib/features/[feature-name]';
  
  let entities = $state(mockEntities);
</script>

<div class="space-y-6">
  <PageHeader title="Page Title" description="Description" />
  <EntityTable {entities} />
</div>
```

### Feature Module Best Practices

**✅ DO:**
- Export everything through `index.ts`
- Import from feature module: `import { Component } from '$lib/features/hrm'`
- Keep components small and focused
- Use shared components for cross-feature UI
- Separate data from components

**❌ DON'T:**
- Import from internal paths: `import Component from '$lib/features/hrm/components/Component.svelte'`
- Put business logic in components (use domain layer)
- Create circular dependencies between features
- Mix feature-specific code with shared code

### Adding Domain Layer (Clean Architecture)

For complex business logic, use Clean Architecture layers:

### Adding Domain Layer (Clean Architecture)

For complex business logic, use Clean Architecture layers:

**1. Create domain layer**:
```typescript
// domain/entities/employee.entity.ts
export class EmployeeEntity { ... }

// domain/repositories/employee.repository.ts (interface)
export interface IEmployeeRepository {
  getEmployees(): Promise<Employee[]>;
}

// domain/usecases/people-functions/hrm/employee.usecase.ts
export class EmployeeUseCase {
  constructor(private employeeRepo: IEmployeeRepository) {}
  
  async getEmployees() {
    return this.employeeRepo.getEmployees();
  }
}
```

**2. Create data layer**:
```typescript
// data/repositories/people-functions/hrm/employee.repository.impl.ts
export class EmployeeRepositoryImpl implements IEmployeeRepository {
  async getEmployees() {
    return httpClient.get<Employee[]>('/hrm/api/employees');
  }
}
```

**3. Wire in DI container**:
```typescript
// di/container.client.ts
const employeeRepository = new EmployeeRepositoryImpl();
export const employeeUseCase = new EmployeeUseCase(employeeRepository);
```

**4. Use in component**:
```svelte
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { employeeUseCase } from '$lib/di/container.client';
  
  const employeesQuery = createQuery({
    queryKey: ['employees'],
    queryFn: () => employeeUseCase.getEmployees()
  });
  
  let employees = $derived($employeesQuery.data || []);
</script>
```

### Adding Menu Item

Edit menu configuration in `src/lib/config/menus/`:

```typescript
// people-function-menu.ts
export const peopleFunctionKeys = {
  NEW_MENU: 'new-menu-slug'
};

export const peopleFunctionMenu: GroupMenuItem = {
  title: 'People Function',
  kind: 'group',
  children: [
    {
      title: 'New Menu',
      kind: 'item',
      slug: K.NEW_MENU,
      url: '/dashboard/people-function/new-menu',
      icon: IconComponent
    }
  ]
};
```

### Using shadcn Components

Always use shadcn-svelte components when available:

```svelte
<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
    <Button>Click me</Button>
  </Dialog.Content>
</Dialog.Root>
```

Install new components:
```bash
npx shadcn@latest add [component-name]
```

Available components: button, dialog, input, select, tabs, table, card, badge, avatar, dropdown-menu, tooltip, accordion, alert, checkbox, radio-group, switch, textarea, label, separator, skeleton, scroll-area, sheet, drawer, calendar, form, pagination, sidebar, and more.

### Using TanStack Query for State Management

TanStack Query digunakan untuk server state management (API calls):

```svelte
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { employeeUseCase } from '$lib/di/container.client';
  
  const employeesQuery = createQuery({
    queryKey: ['employees', pageNum, pageSize],
    queryFn: () => employeeUseCase.getEmployees({ page: pageNum, size: pageSize })
  });
  
  let employees = $derived($employeesQuery.data?.data || []);
  let loading = $derived($employeesQuery.isLoading);
  let error = $derived($employeesQuery.error);
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error: {error.message}</p>
{:else}
  <EmployeeTable {employees} />
{/if}
```

**Benefits:**
- Automatic caching
- Background refetching
- Loading & error states
- Optimistic updates
- Pagination support
- Infinite scroll support

### URL Params Sync with Pagination

Gunakan URL params sebagai single source of truth untuk state:

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  
  let pageNum = $derived(Number(page.url.searchParams.get('page')) || 1);
  let pageSize = $derived(Number(page.url.searchParams.get('size')) || 10);
  
  function updateParams(newPage: number, newSize: number) {
    const params = new URLSearchParams(page.url.searchParams);
    params.set('page', String(newPage));
    params.set('size', String(newSize));
    goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
  }
</script>

<PaginationControls
  currentPage={pageNum}
  pageSize={pageSize}
  totalItems={total}
  onPageChange={(p) => updateParams(p, pageSize)}
  onPageSizeChange={(s) => updateParams(1, s)}
/>
```

**Benefits:**
- State preserved on navigation (back/forward)
- Shareable URLs
- Bookmarkable pages
- No need for local state management

## Testing

### Unit Tests (Vitest)
```bash
npm run test:unit
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### Writing Tests

Unit test example:
```typescript
// domain/usecases/auth.usecase.spec.ts
describe('AuthUseCase', () => {
  it('should throw error if username empty', async () => {
    const useCase = new AuthUseCase(mockRepo);
    await expect(useCase.login('', 'pass')).rejects.toThrow();
  });
});
```

E2E test example:
```typescript
// e2e/login.test.ts
test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="username"]', 'admin');
  await page.fill('[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Project Guidelines

### Code Style
- No comments in code (self-documenting code)
- Use Svelte 5 runes ($state, $props, $derived)
- TypeScript strict mode
- Prettier for formatting
- ESLint for linting

### Component Guidelines
- Use shadcn-svelte for UI components
- Keep components small and focused
- Props with $props(), state with $state()
- Use {@const Icon = icon} instead of <svelte:component>
- Use page from $app/state not $page from $app/stores

### Architecture Guidelines
- Use feature-based modules for new features
- Business logic in domain layer (use cases)
- API calls in data layer (repository implementations)
- UI in presentation layer (components)
- Dependency injection for wiring
- Export through index.ts for clean public API

### Feature Module Guidelines
- One feature = one business domain
- Keep feature modules independent
- Use shared components for cross-feature UI
- Separate types, data, and components
- Always export through index.ts

### Clean Architecture Guidelines
- Domain repositories = interfaces (what can be done)
- Data repositories = implementations (how it's done)
- Use cases contain business logic
- Repositories handle data access
- DI container wires everything together
- Easy to test and swap implementations

### State Management
- TanStack Query for server state (API calls)
- URL params for pagination/filters (single source of truth)
- $state for local component state
- localStorage for persistent data (tokens, preferences)

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `build/` directory.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables

Environment variables untuk API:
```env
VITE_API_BASE_URL=https://apisigma.iwkapps.com
```

Untuk production, ganti dengan URL production API.

## Contributing

1. Follow Clean Architecture principles
2. Write tests for new features
3. Use TypeScript strict mode
4. Follow code style guidelines
5. Update documentation

## License

Private - Sigma Payroll ERP System
