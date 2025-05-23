import React from 'react'
import {
  SimpleGrid,
  Box,
  Text
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import api from '../api'

const fetchAnalytics = async () => {
  const res = await api.get('/analytics')
  return res.data
}

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000
  })

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="6">Welcome to the Chatbot Admin Dashboard</Text>

      <Text mb="6">Select from sidebar to manage Messages, Complaints and To-Do.</Text>

      {!data || isLoading ? (
        <Text>Loading analytics...</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing="6">
          <AnalyticsCard label="Total Messages" value={data.totalMessages} />
          <AnalyticsCard label="Total Complaints" value={data.totalComplaints} />
          <AnalyticsCard label="Resolved Complaints" value={data.resolvedComplaints} />
          <AnalyticsCard label="Unresolved Complaints" value={data.unresolvedComplaints} />
          <AnalyticsCard label="Product Inquiries" value={data.productInquiries} />
          <AnalyticsCard label="Order Modifications" value={data.orderModifications} />
        </SimpleGrid>
      )}
    </DashboardLayout>
  )
}

const AnalyticsCard = ({ label, value }) => {
  return (
    <Box
      bg="white"
      p="6"
      borderRadius="md"
      boxShadow="md"
      textAlign="center"
    >
      <Text fontSize="md" color="gray.500">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
        {value}
      </Text>
    </Box>
  )
}

export default Dashboard
