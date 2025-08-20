import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveValue(value: string | number | string[]): R
      toHaveClass(...classNames: string[]): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeRequired(): R
      toBeValid(): R
      toBeInvalid(): R
      toHaveFocus(): R
      toHaveFormValues(expectedValues: Record<string, any>): R
      toHaveDisplayValue(value: string | string[]): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveDescription(text: string | RegExp): R
    }
  }
}

export {}

