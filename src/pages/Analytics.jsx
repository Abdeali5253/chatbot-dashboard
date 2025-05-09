import React from 'react'
import {
  SimpleGrid,
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from "@tanstack/react-query";
import axios from 'axios'

const fetchAnalytics = async () => {
  const res = await axios.get('/api/dashboard/analytics')
  return res.data
}

const Analytics = () => {
  const { data, isLoading } = useQuery('analytics', fetchAnalytics)

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="6">
        Analytics Overview
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing="6">
        <AnalyticsCard label="Total Messages" value={data.totalMessages} />
        <AnalyticsCard label="Total Complaints" value={data.totalComplaints} />
        <AnalyticsCard
          label="Resolved Complaints"
          value={data.resolvedComplaints}
        />
        <AnalyticsCard
          label="Unresolved Complaints"
          value={data.unresolvedComplaints}
        />
        <AnalyticsCard
          label="Product Inquiries"
          value={data.productInquiries}
        />
        <AnalyticsCard
          label="Order Modifications"
          value={data.orderModifications}
        />
      </SimpleGrid>
    </DashboardLayout>
  )
}

const AnalyticsCard = ({ label, value }) => {
  return (
    <Box bg="white" p="6" borderRadius="md" boxShadow="md">
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
      </Stat>
    </Box>
  )
}

export default Analytics