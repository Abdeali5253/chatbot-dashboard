import React, { useState } from 'react'
import {
  Box,
  Text,
  Select,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import api from '../api'

import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const fetchAnalytics = async () => {
  const res = await api.get('/api/dashboard/analytics')
  return res.data
}

const Analytics = () => {
  const [range, setRange] = useState('all')
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', range],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <Text>Loading charts...</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box mb="6">
        <Text fontSize="2xl">Analytics Dashboard</Text>
        <Select mt="2" w="200px" value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="all">All Time</option>
          <option value="30">Last 30 Days</option>
          <option value="7">Last 7 Days</option>
        </Select>
      </Box>

      <SimpleGrid columns={[1, 2]} spacing="6">
        {/* Message Type Chart */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Messages by Type</Text>
          </CardHeader>
          <CardBody>
            <Bar
              data={{
                labels: ['Complaints', 'Inquiries', 'Modifications'],
                datasets: [
                  {
                    label: 'Count',
                    data: [
                      data.totalComplaints,
                      data.productInquiries,
                      data.orderModifications,
                    ],
                    backgroundColor: ['#E53E3E', '#3182CE', '#38A169'],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </CardBody>
        </Card>

        {/* Complaint Status Chart */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Complaint Status</Text>
          </CardHeader>
          <CardBody>
            <Pie
              data={{
                labels: ['Resolved', 'Unresolved'],
                datasets: [
                  {
                    data: [data.resolvedComplaints, data.unresolvedComplaints],
                    backgroundColor: ['#38A169', '#E53E3E'],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </CardBody>
        </Card>
      </SimpleGrid>
    </DashboardLayout>
  )
}

export default Analytics
