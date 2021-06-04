import type { FC, ReactNode } from 'react'
import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import type { ProductTypes } from 'vtex.product-context'
import { useProduct } from 'vtex.product-context'

import { getSeller } from './modules/seller'

type HighlightType = 'collection' | 'promotion' | 'teaser'

interface Filter {
  type: 'hide' | 'show'
  highlightNames: string[]
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

interface Highlight {
  id?: string
  name: string
}

const ProductHighlightContext =
  React.createContext<ProductHighlightContextProviderProps | undefined>(
    undefined
  )

interface ProductHighlightContextProviderProps {
  highlight: Highlight
  type: HighlightType
}

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

const ProductHighlights = (props: {
  filter: Filter
  type: HighlightType
  children: NonNullable<ReactNode>
}) => {
  const { product, selectedItem } = useProduct() ?? {}
  const selectedSku = selectedItem ?? product?.items?.[0]
  const seller: ProductTypes.Seller | null = selectedSku
    ? getSeller(selectedSku)
    : null

  const clusterHighlights = product?.clusterHighlights ?? []
  const discountHighlights = seller?.commertialOffer?.discountHighlights ?? []
  const teasers = seller?.commertialOffer?.teasers ?? []

  const highlights = useMemo(() => {
    const filterHighlight = createFilterHighlight(props.filter)

    if (props.type === 'collection') {
      return clusterHighlights.filter(filterHighlight)
    }

    if (props.type === 'promotion') {
      return discountHighlights.filter(filterHighlight)
    }

    if (props.type === 'teaser') {
      return teasers.filter(filterHighlight)
    }

    return []
  }, [props.filter, props.type, teasers, clusterHighlights, discountHighlights])

  if (!product) {
    return null
  }

  return (
    <>
      {highlights.map((highlight, index) => (
        <ProductHighlightContextProvider
          key={index}
          type={props.type}
          highlight={highlight}
        >
          {props.children}
        </ProductHighlightContextProvider>
      ))}
    </>
  )
}

ProductHighlights.propTypes = {
  filter: PropTypes.object,
  type: PropTypes.string,
}

ProductHighlights.defaultProps = {
  filter: {
    type: 'hide',
    highlightNames: [],
  },
  type: 'collection',
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
