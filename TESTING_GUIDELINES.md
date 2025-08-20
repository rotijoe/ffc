# Testing Guidelines

This document outlines the testing standards and best practices for this React/Next.js project using Jest and React Testing Library.

## Table of Contents

- [Test Structure](#test-structure)
- [File Organization](#file-organization)
- [Component Testing](#component-testing)
- [Helper Function Testing](#helper-function-testing)
- [Test-Driven Development (TDD)](#test-driven-development-tdd)
- [Testing Best Practices](#testing-best-practices)
- [Accessibility Testing](#accessibility-testing)
- [Mocking Guidelines](#mocking-guidelines)
- [Coverage Requirements](#coverage-requirements)

## Test Structure

### Test File Naming

- Component tests: `index.spec.tsx` (co-located with component)
- Helper function tests: `[function-name].spec.ts` (co-located with helpers)
- Test files should be placed in a `tests/` directory within each component or page folder

### Test Organization

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from '../index'

describe('ComponentName', () => {
  const defaultProps = {
    // Define default props here
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test cases...
})
```

## File Organization

### Component Test Structure

```
src/components/component-name/
├── index.tsx
├── helpers.ts
├── constants.ts
├── types.ts
└── tests/
    ├── index.spec.tsx
    └── [helper-function-name].spec.ts
```

**Note**: README files are not necessary for test directories. Tests should be self-documenting through clear test names and organization.

### Test File Structure

1. **Imports**: React Testing Library, userEvent, component, constants
2. **Describe block**: Component name
3. **Default props**: Define reusable props object
4. **BeforeEach**: Clean up mocks
5. **Test cases**: Organized by functionality

## Component Testing

### Essential Test Cases

Every component should have tests for:

1. **User Behavior & Interactions** (Primary Focus)

   - **User-visible functionality**: Test what users can see and interact with
   - **User interactions**: Click events, form inputs, keyboard navigation
   - **User feedback**: Loading states, error messages, success confirmations
   - **User accessibility**: Screen reader announcements, keyboard navigation
   - **User experience**: Focus management, visual feedback, responsive behavior

2. **Props Handling** (When Relevant)

   - Only test these if the component uses these props for user-visible behavior
   - Do not test props that are simply passed to another component
   - Test props that affect user interaction or display
   - Test default values when they impact user experience

### What to Test vs What NOT to Test

**DO Test:**

- Custom business logic (e.g., placeholder fallback logic)
- Custom event handling that transforms data
- Custom accessibility attributes
- Custom validation or formatting
- Custom state management logic
- Integration between multiple components

**DON'T Test:**

- Basic React controlled component behavior (value display)
- Multiple keystroke events (test once is sufficient)
- Basic prop passing without custom logic
- "Renders without crashing" scenarios
- Internal implementation details
- Third-party component functionality (e.g., shadcn components)

3. **State Changes** (User-Impacting)

   - Component state updates that users can observe
   - Side effects (useEffect) that change user-visible behavior
   - Async operations that affect user experience
   - Loading states and transitions

4. **Accessibility** (Critical for User Experience)

   - ARIA attributes that assist screen readers
   - Semantic HTML that improves navigation
   - Keyboard navigation for all interactive elements
   - Screen reader compatibility and announcements

5. **Rendering** (Minimal Testing)

   - Only test rendering if it directly impacts user behavior
   - Avoid testing "renders without crashing" - this is not user-focused
   - Focus on testing that users can see and interact with the component
   - Test that loading states, error states, and success states are user-visible

### Example Component Test

```typescript
describe('MyComponent', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Default placeholder'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays search input that users can interact with', () => {
    render(<MyComponent {...defaultProps} />)

    const searchInput = screen.getByRole('searchbox', { name: /search/i })
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('placeholder', 'Default placeholder')
  })

  it('calls onChange when user types', async () => {
    const mockOnChange = jest.fn()

    render(<MyComponent {...defaultProps} onChange={mockOnChange} />)

    const input = screen.getByRole('searchbox', { name: /search/i })
    await userEvent.type(input, 'c')

    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith('c')
  })

  it('provides accessible loading state for screen readers', () => {
    render(<MyComponent {...defaultProps} isLoading={true} />)

    const loadingAnnouncement = screen.getByText(/loading/i)
    expect(loadingAnnouncement).toBeInTheDocument()
  })
})
```

## Helper Function Testing

```typescript
import { helperFunction } from '../helpers'

describe('helperFunction', () => {
  it('handles normal input', () => {
    expect(helperFunction('input')).toBe('expected output')
  })

  it('handles edge cases', () => {
    expect(helperFunction('')).toBe('')
    expect(helperFunction('   ')).toBe('')
  })

  it('handles special characters', () => {
    expect(helperFunction('KFC & Co.')).toBe('KFC & Co.')
  })
})
```

### Test Coverage for Helpers

- Normal/expected inputs
- Edge cases (empty, null, undefined)
- Special characters and formatting
- Error conditions
- Boundary values

## Testing Best Practices

### User-Focused Testing Principles

1. **Test User Behavior, Not Implementation**

   - Focus on what users can see, hear, and interact with
   - Test user workflows and interactions
   - Avoid testing internal implementation details
   - Test accessibility and screen reader compatibility

2. **Don't Test Basic React Functionality**

   - Do not test that controlled components display their value (React handles this)
   - Do not test that event handlers are called multiple times for multiple keystrokes (test once is sufficient)
   - Do not test basic prop passing unless it involves custom logic
   - Focus on testing your custom logic, not React's built-in functionality

3. **Test User-Visible Functionality**

   - Loading states that users can see
   - Error messages that users can read
   - Success confirmations that users can understand
   - Interactive elements that users can click/tap

4. **Test User Interactions**
   - Click events that users perform
   - Form inputs that users type into
   - Keyboard navigation that users rely on
   - Focus management for accessibility

### Query Priority (Guiding Principles)

1. **getByRole** - Most accessible and semantic (preferred)
2. **getByLabelText** - For form inputs with labels
3. **getByPlaceholderText** - For inputs without labels
4. **getByText** - For text content users can read
5. **getByDisplayValue** - For form inputs with values
6. **getByTestId** - Last resort, only for complex cases

### Avoid These Queries

- `getByTestId` (unless absolutely necessary)
- `querySelector` or `getElementById` (violates Testing Library principles)
- Direct DOM manipulation with `container.querySelector`
- Testing "renders without crashing" (not user-focused)

### User Event Testing

```typescript
// Use userEvent directly (no setup required)
await userEvent.click(button)
await userEvent.type(input, 'text')
await userEvent.keyboard('{Enter}')
await userEvent.clear(input)
await userEvent.tab()
```

### Async Testing

```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Updated content')).toBeInTheDocument()
})

// Use findBy queries for async elements
const element = await screen.findByText('Async content')
```

### Mocking

```typescript
// Mock functions
const mockOnChange = jest.fn()

// Mock modules
jest.mock('../api', () => ({
  fetchData: jest.fn()
}))

// Mock timers
jest.useFakeTimers()
jest.runAllTimers()
```

## Accessibility Testing

### Required Accessibility Tests

```typescript
it('has correct accessibility attributes', () => {
  render(<MyComponent />)

  const element = screen.getByRole('button', { name: /submit/i })
  expect(element).toHaveAttribute('aria-label', 'Submit form')
  expect(element).not.toHaveAttribute('aria-disabled')
})

it('supports keyboard navigation', async () => {
  render(<MyComponent />)

  const element = screen.getByRole('button')
  element.focus()
  await userEvent.keyboard('{Enter}')

  expect(mockOnClick).toHaveBeenCalled()
})
```

### Accessibility Checklist

- [ ] All interactive elements have proper ARIA labels
- [ ] Form inputs have associated labels
- [ ] Focus management works correctly
- [ ] Keyboard navigation is supported
- [ ] Color contrast meets WCAG guidelines
- [ ] Screen reader compatibility

## Mocking Guidelines

### When to Mock

- External API calls
- Browser APIs (localStorage, geolocation)
- Complex dependencies
- Timers and intervals

### Mock Implementation

```typescript
// Mock API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
}
Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation
})
```

## Coverage Requirements

### Minimum Coverage

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

### Coverage Exclusions

- Test files
- Type definition files
- Story files
- Configuration files

### Running Tests

```bash
# Run all tests (always with coverage)
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ComponentName.test.tsx
```

## Common Testing Patterns

### Form Testing

```typescript
it('submits form with correct data', async () => {
  const mockOnSubmit = jest.fn()

  render(<MyForm onSubmit={mockOnSubmit} />)

  await userEvent.type(screen.getByLabelText(/name/i), 'John')
  await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(mockOnSubmit).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@example.com'
  })
})
```

### Error Handling Testing

```typescript
it('displays error message when API fails', async () => {
  mockApi.fetchData.mockRejectedValue(new Error('API Error'))

  render(<MyComponent />)

  await waitFor(() => {
    expect(screen.getByText(/API Error/i)).toBeInTheDocument()
  })
})
```

### Loading State Testing

```typescript
it('shows loading state while fetching data', () => {
  render(<MyComponent />)

  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  expect(screen.queryByText(/data loaded/i)).not.toBeInTheDocument()
})
```

## Debugging Tests

### Common Issues

1. **Async operations not awaited**
2. **Mock functions not properly reset**
3. **Component not re-rendering after state changes**
4. **Incorrect query selectors**

### Debugging Tools

```typescript
// Debug screen contents
screen.debug()

// Debug specific element
screen.debug(element)

// Log all available queries
screen.logTestingPlaygroundURL()
```

---

**Remember**: Good tests are readable, maintainable, and provide confidence that your code works as expected. Write tests that focus on **user behavior and interactions** rather than implementation details. Test what users can see, hear, and interact with - not how the code is implemented internally.
