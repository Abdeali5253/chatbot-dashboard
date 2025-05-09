import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Flex, Icon, Text, VStack, Button } from '@chakra-ui/react'
import {
  FiHome,
  FiMessageCircle,
  FiAlertCircle,
  FiPieChart,
  FiLogOut,
} from 'react-icons/fi'

const Sidebar = () => {
  const location = useLocation()

  const links = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Messages', path: '/messages', icon: FiMessageCircle },
    { name: 'Complaints', path: '/complaints', icon: FiAlertCircle },
    { name: 'Analytics', path: '/analytics', icon: FiPieChart },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <Box w="250px" bg="gray.800" color="white" minH="100vh" p="20px">
      <Text fontSize="2xl" mb="10" fontWeight="bold">
        🧼 Chatbot Dashboard
      </Text>
      <VStack align="stretch" spacing="4">
        {links.map((link) => (
          <Link key={link.path} to={link.path}>
            <Flex
              align="center"
              p="2"
              borderRadius="md"
              bg={location.pathname === link.path ? 'gray.700' : 'transparent'}
              _hover={{ bg: 'gray.700' }}
            >
              <Icon as={link.icon} mr="3" />
              <Text>{link.name}</Text>
            </Flex>
          </Link>
        ))}
      </VStack>

      <Button mt="10" colorScheme="red" onClick={handleLogout}>
        <Icon as={FiLogOut} mr="2" />
        Logout
      </Button>
    </Box>
  )
}

export default Sidebar
