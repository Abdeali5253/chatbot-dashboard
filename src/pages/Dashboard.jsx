import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Box, Text } from '@chakra-ui/react'

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="6">
        Welcome to the Chatbot Admin Dashboard
      </Text>
      <Box>
        <Text>Select from sidebar to manage Messages, Complaints and Analytics.</Text>
      </Box>
    </DashboardLayout>
  )
}

export default Dashboard
