import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#e3f9f9',
      100: '#c8eef0',
      500: '#319795',
      700: '#285e61',
    },
  },
})

export default theme
