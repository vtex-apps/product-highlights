import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useProduct } from 'vtex.product-context'

import ProductHighlights from './ProductHighlights'
import ProductHighlightWrapper from './ProductHighlightWrapper'
import tankTop from './__fixtures__/tankTop'

const mockUseProduct = useProduct as jest.Mock

mockUseProduct.mockImplementation(() => ({ product: tankTop }))

test('ProductHighlight should render data-attributes and CSS handles', () => {
  const { getByText } = render(
    <ProductHighlights
      filter={{ type: 'show', highlightNames: ['Top Sellers'] }}
    >
      <ProductHighlightWrapper>Hello World</ProductHighlightWrapper>
    </ProductHighlights>
  )

  const topSellers = getByText('Hello World')

  expect(topSellers).toHaveAttribute('data-highlight-id', '1182')
  expect(topSellers).toHaveAttribute('data-highlight-name', 'Top Sellers')
  expect(topSellers).toHaveAttribute('data-highlight-type', 'collection')
  expect(topSellers).toHaveClass('productHighlightWrapper')
})

test("ProductHighlight should render nothing if there's no context", () => {
  const { container } = render(
    <ProductHighlightWrapper>Hello World</ProductHighlightWrapper>
  )

  expect(container).toBeEmptyDOMElement()
})
