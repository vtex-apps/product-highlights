declare module 'vtex.native-types' {
  import { FC, ReactElement, ReactNode, Component } from 'react'

  interface Props {
    message: string
    handleBase: string
    markers: string[]
    values: unknown
  }

  const IOMessageWithMarkers: FC<Props>
}
