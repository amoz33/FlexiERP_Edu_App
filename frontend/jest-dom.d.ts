// Extends Jest's expect() types with jest-dom's custom matchers
// (toBeInTheDocument, toBeDisabled, toBeEmptyDOMElement, etc.) so
// tsc --noEmit doesn't flag them as unknown properties.
import '@testing-library/jest-dom'
