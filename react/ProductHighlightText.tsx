import type { FC, ReactNode } from 'react'
import React, { useMemo } from 'react'
import { IOMessageWithMarkers, formatIOMessage } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

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

const ProductHighlightText: FC<Props> = ({
  message = '',
  markers = [],
  link = '',
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()
  const intl = useIntl()

  const values = useMemo(() => {
    const result: MessageValues = {
      highlightName: '',
    }

    if (!value) {
      return result
    }

    if (link) {
      const href = formatIOMessage(
        {
          intl,
          id: link,
        },
        {
          highlightId: value.highlight.id ?? '',
          highlightName: value.highlight.name,
        }
      ) as string

      result.highlightName = (
        <a
          href={href}
          key="highlightLink"
          data-highlight-name={value.highlight.name}
          data-highlight-id={value.highlight.id}
          data-highlight-type={value.type}
          className={handles.productHighlightText}
        >
          {value.highlight.name}
        </a>
      )
    } else {
      result.highlightName = (
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
    }

    return result
  }, [value, link, intl, handles.productHighlightText])

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
