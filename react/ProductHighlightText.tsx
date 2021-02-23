import React, { FC, useMemo, ReactNode } from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'

import { useHighlight } from './ProductHighlights'

interface Props {
  message: string
  markers?: string[]
  blockClass?: string
  link?: string
}

interface MessageValues {
  highlightName: ReactNode
}

const CSS_HANDLES = ['productHighlightText'] as const

const ProductHighlightText: FC<Props> = ({ message = '', markers = [], link = '' }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()

  const values = useMemo(() => {
    const result: MessageValues = {
      highlightName: '',
    }

    if (!value) {
      return result
    }

    result.highlightName =  link ? (
      <a
        href={`${link + value.highlight.id}`}
        key="highlightLink"
        data-highlight-name={value.highlight.name}
        data-highlight-id={value.highlight.id}
        data-highlight-type={value.type}
        className={handles.productHighlightText}
      >
        {value.highlight.name}
      </a>
    ) : (
      <span
        key="highlightName"
        data-highlight-name={value.highlight.name}
        data-highlight-id={value.highlight.id}
        data-highlight-type={value.type}
        className={handles.productHighlightText}
      >
        {value.highlight.name}
      </span>
    )

    return result
  }, [value, handles.productHighlightText, link])

  if (!value || !message) {
    return null
  }

  return (
    <IOMessageWithMarkers
      handleBase="productHighlightText"
      message={message}
      markers={markers}
      values={values}
    />
  )
}

export default ProductHighlightText
