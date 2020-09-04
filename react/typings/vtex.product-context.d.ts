import { ProductContext } from '../__mocks__/vtex.product-context'

declare module 'vtex.product-context' {
  interface ProductContext {
    selectedItem?: Item | null
    product?: {
      items: Item[]
      productClusters: ProductCluster[]
    }
  }

  export interface Item {
    sellers: Seller[]
  }

  interface Seller {
    commertialOffer: CommertialOffer
  }

  interface CommertialOffer {
    discountHighlights: DiscountHighlights[]
    teasers: Teaser[]
    AvailableQuantity: number
  }

  interface DiscountHighlights {
    name: string
  }

  interface Teaser {
    name: string
  }

  interface ProductCluster {
    id: string
    name: string
  }

  export function useProduct(): ProductContext
}
