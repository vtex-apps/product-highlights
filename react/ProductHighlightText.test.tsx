import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useProduct } from 'vtex.product-context'

import ProductHighlights from './ProductHighlights'
import ProductHighlightText from './ProductHighlightText'
import tankTop from './__fixtures__/tankTop'

const mockUseProduct = useProduct as jest.Mock

mockUseProduct.mockImplementation(() => ({ product: tankTop }))

test('ProductHighlightText should render data-attributes and CSS handles', () => {
  const { getByText } = render(
    <ProductHighlights>
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  const topSellers = getByText('Top Sellers')
  const summer = getByText('Summer')

  expect(topSellers).toHaveAttribute('data-highlight-id', '1182')
  expect(topSellers).toHaveAttribute('data-highlight-name', 'Top Sellers')
  expect(topSellers).toHaveAttribute('data-highlight-type', 'collection')
  expect(summer).toHaveClass('productHighlightText')

  expect(summer).toHaveAttribute('data-highlight-id', '1183')
  expect(summer).toHaveAttribute('data-highlight-name', 'Summer')
  expect(summer).toHaveAttribute('data-highlight-type', 'collection')
  expect(summer).toHaveClass('productHighlightText')
})

test('ProductHighlightText should render link if prop is passed', () => {
  const { getByText } = render(
    <ProductHighlights>
      <ProductHighlightText
        message="{highlightName}"
        link="/collection/{highlightName}/{highlightId}"
      />
    </ProductHighlights>
  )

  const topSellers = getByText('Top Sellers')
  const summer = getByText('Summer')

  expect(topSellers).toHaveAttribute('href', '/collection/Top Sellers/1182')
  expect(summer).toHaveAttribute('href', '/collection/Summer/1183')
})

test("ProductHighlightText should render nothing if there's no context", () => {
  const { container } = render(
    <ProductHighlightText message="{highlightName}" />
  )

  expect(container).toBeEmptyDOMElement()
})

test("ProductHighlightText should render nothing if there's no message", () => {
  const { container } = render(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <ProductHighlightText />
  )

  expect(container).toBeEmptyDOMElement()
})
