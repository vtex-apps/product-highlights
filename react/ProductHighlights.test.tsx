import React from 'react'
import { render } from '@vtex/test-tools/react'
import type { ProductContext } from 'vtex.product-context'
import { useProduct } from 'vtex.product-context'

import ProductHighlights from './ProductHighlights'
import ProductHighlightText from './ProductHighlightText'
import tankTop from './__fixtures__/tankTop'

const mockUseProduct = useProduct as jest.Mock<ProductContext>

mockUseProduct.mockImplementation(() => ({ product: tankTop }))

test("render all collections' highlights", () => {
  const { queryByText, rerender } = render(
    <ProductHighlights>
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Top Sellers')).toBeInTheDocument()
  expect(queryByText('Summer')).toBeInTheDocument()

  rerender(
    <ProductHighlights type="collection">
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Top Sellers')).toBeInTheDocument()
  expect(queryByText('Summer')).toBeInTheDocument()
})

test("render all promotions' highlights", () => {
  const { queryByText } = render(
    <ProductHighlights type="promotion">
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Free Shipping')).toBeInTheDocument()
  expect(queryByText('10% Discount')).toBeInTheDocument()
})

test("render all teasers' highlights", () => {
  const { queryByText } = render(
    <ProductHighlights type="teaser">
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('8% Boleto')).toBeInTheDocument()
  expect(queryByText('5% Visa')).toBeInTheDocument()
})

test('render nothing if wrong type is passed', () => {
  const { container } = render(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <ProductHighlights type="">
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(container).toBeEmptyDOMElement()
})

test("render nothing if there's no product context", () => {
  mockUseProduct.mockImplementationOnce(() => ({ product: undefined }))

  const { container } = render(
    <ProductHighlights>
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(container).toBeEmptyDOMElement()
})

test('should filter highlights', () => {
  const { queryByText, rerender } = render(
    <ProductHighlights filter={{ type: 'hide', highlightNames: ['Summer'] }}>
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Top Sellers')).toBeInTheDocument()
  expect(queryByText('Summer')).not.toBeInTheDocument()

  rerender(
    <ProductHighlights filter={{ type: 'show', highlightNames: ['Summer'] }}>
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Top Sellers')).not.toBeInTheDocument()
  expect(queryByText('Summer')).toBeInTheDocument()

  rerender(
    <ProductHighlights
      filter={{
        type: 'hide',
        highlightNames: ['Summer', 'Top Sellers'],
      }}
    >
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Top Sellers')).not.toBeInTheDocument()
  expect(queryByText('Summer')).not.toBeInTheDocument()

  rerender(
    <ProductHighlights
      filter={{
        type: 'show',
        highlightNames: ['Summer', 'Top Sellers'],
      }}
    >
      <ProductHighlightText message="{highlightName}" />
    </ProductHighlights>
  )

  expect(queryByText('Top Sellers')).toBeInTheDocument()
  expect(queryByText('Summer')).toBeInTheDocument()
})
