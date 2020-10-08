import React, { FC, useContext, ReactNode, useMemo } from 'react'
import { useProduct, ProductTypes } from 'vtex.product-context'

import { getSeller } from './modules/seller'

type HighlightType = 'collection' | 'promotion' | 'teaser'

interface ProductHighlightsProps {
  filter?: Filter
  type?: HighlightType
  children: NonNullable<ReactNode>
}

interface Filter {
  type: 'hide' | 'show'
  highlightNames: string[]
}

const defaultFilter: Filter = {
  type: 'hide',
  highlightNames: [],
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

const ProductHighlights: FC<ProductHighlightsProps> = ({
  filter = defaultFilter,
  type = 'collection',
  children,
}) => {
  const { product, selectedItem } = useProduct() ?? {}
  const selectedSku = selectedItem ?? product?.items[0]
  const seller: ProductTypes.Seller | null = selectedSku
    ? getSeller(selectedSku)
    : null

  const clusterHighlights = product?.clusterHighlights ?? []
  const discountHighlights = seller?.commertialOffer.discountHighlights ?? []
  const teasers = seller?.commertialOffer.teasers ?? []

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

interface Highlight {
  id?: string
  name: string
}

const ProductHighlightContext = React.createContext<
  ProductHighlightContextProviderProps | undefined
>(undefined)

interface ProductHighlightContextProviderProps {
  highlight: Highlight
  type: HighlightType
}

const ProductHighlightContextProvider: FC<ProductHighlightContextProviderProps> = ({
  highlight,
  type,
  children,
}) => {
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

export const useHighlight = () => {
  const group = useContext(ProductHighlightContext)

  return group
}

export default ProductHighlights
