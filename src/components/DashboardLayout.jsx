import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout = ({ children }) => {
  return (
    <Flex>
      <Sidebar />
      <Box flex="1">
        <Header />
        <Box p="6">{children}</Box>
      </Box>
    </Flex>
  )
}

export default DashboardLayout
