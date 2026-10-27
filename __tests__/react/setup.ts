import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

/**
 * Unmounts React trees mounted with `render()` after each test.
 *
 * @see https://testing-library.com/docs/react-testing-library/api#cleanup
 */
afterEach(() => cleanup())
