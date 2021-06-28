export interface ProductContext {
  product: any
}

export const useProduct = jest.fn((): ProductContext => {
  return { product: {} }
})
