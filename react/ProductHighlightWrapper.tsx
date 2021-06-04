import type { FC, ReactNode } from 'react'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useHighlight } from './ProductHighlights'

interface Props {
  blockClass?: string
  children: ReactNode
}

const CSS_HANDLES = ['productHighlightWrapper'] as const

const ProductHighlightWrapper: FC<Props> = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()

  if (!value) {
    return null
  }

  return (
    <div
      data-highlight-name={value.highlight.name}
      data-highlight-id={value.highlight.id}
      data-highlight-type={value.type}
      className={handles.productHighlightWrapper}
    >
      {children}
    </div>
  )
}

export default ProductHighlightWrapper
