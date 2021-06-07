import type { FC, ReactNode } from 'react'
import React, { useContext, useMemo } from 'react'
import type { ProductTypes } from 'vtex.product-context'
import { useProduct } from 'vtex.product-context'

import { getSeller } from './modules/seller'

type HighlightType = 'collection' | 'promotion' | 'teaser'

interface Filter {
  type: 'hide' | 'show'
  highlightNames: string[]
}

interface ProductHighlightsProps {
  filter?: Filter
  type?: HighlightType
  children: NonNullable<ReactNode>
}

const defaultFilter: Filter = {
  type: 'hide',
  highlightNames: [],
}

interface Highlight {
  id?: string
  name: string
}

interface ProductHighlightContextProviderProps {
  highlight: Highlight
  type: HighlightType
}

function createFilterHighlight(filter: Filter) {
  return function filterHighlight(highlight: Highlight) {
    const hasHighlight = filter.highlightNames.includes(highlight.name)

    if (
      (filter.type === 'hide' && hasHighlight) ||
      (filter.type === 'show' && !hasHighlight)
    ) {
      return false
    }

    return true
  }
}

const ProductHighlightContext =
  React.createContext<ProductHighlightContextProviderProps | undefined>(
    undefined
  )

const ProductHighlightContextProvider: FC<ProductHighlightContextProviderProps> =
  ({ highlight, type, children }) => {
    const contextValue = useMemo(
      () => ({
        highlight,
        type,
      }),
      [highlight, type]
    )

    return (
      <ProductHighlightContext.Provider value={contextValue}>
        {children}
      </ProductHighlightContext.Provider>
    )
  }

// eslint-disable-next-line react/prop-types
function ProductHighlights({
  filter = defaultFilter,
  type = 'collection',
  children,
}: ProductHighlightsProps) {
  const { product, selectedItem } = useProduct() ?? {}
  const selectedSku = selectedItem ?? product?.items?.[0]
  const seller: ProductTypes.Seller | null = selectedSku
    ? getSeller(selectedSku)
    : null

  const clusterHighlights = product?.clusterHighlights ?? []
  const discountHighlights = seller?.commertialOffer?.discountHighlights ?? []
  const teasers = seller?.commertialOffer?.teasers ?? []

  const highlights = useMemo(() => {
    const filterHighlight = createFilterHighlight(filter)

    if (type === 'collection') {
      return clusterHighlights.filter(filterHighlight)
    }

    if (type === 'promotion') {
      return discountHighlights.filter(filterHighlight)
    }

    if (type === 'teaser') {
      return teasers.filter(filterHighlight)
    }

    return []
  }, [filter, type, teasers, clusterHighlights, discountHighlights])

  if (!product) {
    return null
  }

  return (
    <>
      {highlights.map((highlight, index) => (
        <ProductHighlightContextProvider
          key={index}
          type={type}
          highlight={highlight}
        >
          {children}
        </ProductHighlightContextProvider>
      ))}
    </>
  )
}

ProductHighlights.schema = {
  title: 'Product Highlights',
  type: 'object',
  properties: {
    filter: {
      title: 'Filter',
      type: 'object',
      properties: {
        type: {
          title: 'type',
          type: 'string',
          enum: ['hide', 'show'],
          enumNames: ['hide', 'show'],
        },
        highlightNames: {
          title: 'Highlight Names',
          type: 'array',
          minItems: 0,
          maxItems: 5,
          items: {
            title: 'Highlight name',
            type: 'string',
            default: '',
          },
        },
      },
    },
    type: {
      title: 'Query Type',
      type: 'string',
      enum: ['collection', 'promotion', 'teaser'],
      enumNames: ['collection', 'promotion', 'teaser'],
    },
  },
}

export const useHighlight = () => {
  const group = useContext(ProductHighlightContext)

  return group
}

export default ProductHighlights
