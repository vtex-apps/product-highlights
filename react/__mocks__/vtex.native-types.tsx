import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Props } from 'vtex.native-types'

export const IOMessageWithMarkers: FC<Props> = ({ message, values }) => {
  return <FormattedMessage id="foo" defaultMessage={message} values={values} />
}
