import React from 'react'
import { Flex, Text, Box } from '@chakra-ui/react'

const Header = () => {
  const username = localStorage.getItem('username') || 'Admin'

  return (
    <Flex
      justify="space-between"
      align="center"
      bg="gray.100"
      p="4"
      borderBottom="1px solid #ccc"
    >
      <Text fontSize="xl" fontWeight="bold">
        Chatbot Admin Panel
      </Text>
      <Box>
        <Text color="gray.600">Welcome, {username}</Text>
      </Box>
    </Flex>
  )
}

export default Header
