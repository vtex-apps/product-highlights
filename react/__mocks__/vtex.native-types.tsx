import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { formatIOMessage as _formatIOMessage } from 'vtex.native-types'

interface Props {
  message: string
  handleBase: string
  markers: string[]
  values: Record<string, string>
}

export const IOMessageWithMarkers: FC<Props> = ({ message, values }) => {
  return <FormattedMessage id="foo" defaultMessage={message} values={values} />
}

export function formatIOMessage(
  { intl, id }: Parameters<typeof _formatIOMessage>[0],
  values: Parameters<typeof _formatIOMessage>[1]
) {
  return intl.formatMessage({ id, defaultMessage: id as string }, values)
}
