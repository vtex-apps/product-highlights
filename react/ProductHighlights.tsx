import type { FC, ReactNode } from 'react'
import React, { useContext, useMemo } from 'react'
import { defineMessages } from 'react-intl'
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
  React.createContext<ProductHighlightContextProviderProps | null>(null)

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

  const highlights = useMemo(() => {
    const clusterHighlights = product?.clusterHighlights ?? []
    const discountHighlights = seller?.commertialOffer?.discountHighlights ?? []
    const teasers = seller?.commertialOffer?.teasers ?? []

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
  }, [
    filter,
    product?.clusterHighlights,
    seller?.commertialOffer?.discountHighlights,
    seller?.commertialOffer?.teasers,
    type,
  ])

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

const messages = defineMessages({
  Filter: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.filter',
  },
  QueryType: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.type',
  },
  Collection: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.type.collection',
  },
  Promotion: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.type.promotion',
  },
  Teaser: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.type.teaser',
  },
  Type: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.filter.type',
  },
  Hide: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.filter.type.hide',
  },
  Show: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.filter.type.show',
  },
  HighlightNames: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.filter.highlight-names',
  },
  HighlightName: {
    defaultMessage: '',
    id: 'admin/editor.product-highlights.filter.highlight-names.item',
  },
})

ProductHighlights.schema = {
  title: 'Product Highlights',
  type: 'object',
  properties: {
    filter: {
      title: messages.Filter.id,
      type: 'object',
      properties: {
        type: {
          title: messages.Type.id,
          type: 'string',
          enum: ['hide', 'show'],
          enumNames: [messages.Hide.id, messages.Show.id],
        },
        highlightNames: {
          title: messages.HighlightNames.id,
          type: 'array',
          minItems: 0,
          maxItems: 5,
          items: {
            title: messages.HighlightName.id,
            type: 'string',
            default: '',
          },
        },
      },
    },
    type: {
      title: 'admin/editor.product-highlights.type',
      type: 'string',
      enum: ['collection', 'promotion', 'teaser'],
      enumNames: [
        messages.Collection.id,
        messages.Promotion.id,
        messages.Teaser.id,
      ],
    },
  },
}

export const useHighlight = () => {
  const group = useContext(ProductHighlightContext)

  return group
}

export default ProductHighlights
