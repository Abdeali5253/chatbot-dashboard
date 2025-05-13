// import React, { useState } from 'react'
// import {
//   Box,
//   Text,
//   Select,
//   SimpleGrid,
//   Card,
//   CardHeader,
//   CardBody,
// } from '@chakra-ui/react'
// import DashboardLayout from '../components/DashboardLayout'
// import { useQuery } from '@tanstack/react-query'
// import api from '../api'

// import { Bar, Pie } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   BarElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js'

// ChartJS.register(
//   BarElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// )

// const fetchAnalytics = async () => {
//   const res = await api.get('/api/dashboard/analytics')
//   return res.data
// }

// const Analytics = () => {
//   const [range, setRange] = useState('all')
//   const { data, isLoading } = useQuery({
//     queryKey: ['analytics', range],
//     queryFn: fetchAnalytics,
//     staleTime: 5 * 60 * 1000,
//   })

//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <Text>Loading charts...</Text>
//       </DashboardLayout>
//     )
//   }

//   return (
//     <DashboardLayout>
//       <Box mb="6">
//         <Text fontSize="2xl">Analytics Dashboard</Text>
//         <Select mt="2" w="200px" value={range} onChange={(e) => setRange(e.target.value)}>
//           <option value="all">All Time</option>
//           <option value="30">Last 30 Days</option>
//           <option value="7">Last 7 Days</option>
//         </Select>
//       </Box>

//       <SimpleGrid columns={[1, 2]} spacing="6">
//         {/* Message Type Chart */}
//         <Card>
//           <CardHeader>
//             <Text fontWeight="bold">Messages by Type</Text>
//           </CardHeader>
//           <CardBody>
//             <Bar
//               data={{
//                 labels: ['Complaints', 'Inquiries', 'Modifications'],
//                 datasets: [
//                   {
//                     label: 'Count',
//                     data: [
//                       data.totalComplaints,
//                       data.productInquiries,
//                       data.orderModifications,
//                     ],
//                     backgroundColor: ['#E53E3E', '#3182CE', '#38A169'],
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { display: false },
//                 },
//               }}
//             />
//           </CardBody>
//         </Card>

//         {/* Complaint Status Chart */}
//         <Card>
//           <CardHeader>
//             <Text fontWeight="bold">Complaint Status</Text>
//           </CardHeader>
//           <CardBody>
//             <Pie
//               data={{
//                 labels: ['Resolved', 'Unresolved'],
//                 datasets: [
//                   {
//                     data: [data.resolvedComplaints, data.unresolvedComplaints],
//                     backgroundColor: ['#38A169', '#E53E3E'],
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: 'bottom' },
//                 },
//               }}
//             />
//           </CardBody>
//         </Card>
//       </SimpleGrid>
//     </DashboardLayout>
//   )
// }

// export default Analytics


import React, { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement
)

const fetchMessages = async () => {
  const res = await api.get('/api/dashboard/messages')
  return res.data
}

const Analytics = () => {
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const filtered = messages.filter((m) => {
    const time = new Date(m.timestamp).getTime()
    return (!startDate || time >= startDate.getTime()) &&
           (!endDate || time <= endDate.getTime())
  })

  const typeCounts = {
    'product complaint': 0,
    'product inquiry': 0,
    'order modification': 0
  }

  const complaintStatus = { done: 0, pending: 0 }

  const dailyCounts = {}

  filtered.forEach((msg) => {
    const type = msg.messageType
    if (typeCounts[type] !== undefined) typeCounts[type] += 1

    if (type === 'product complaint') {
      const status = msg.status === 'done' ? 'done' : 'pending'
      complaintStatus[status]++
    }

    const day = new Date(msg.timestamp).toLocaleDateString()
    dailyCounts[day] = (dailyCounts[day] || 0) + 1
  })

  const barData = {
    labels: ['Complaints', 'Inquiries', 'Modifications'],
    datasets: [
      {
        label: 'Count',
        data: [
          typeCounts['product complaint'],
          typeCounts['product inquiry'],
          typeCounts['order modification'],
        ],
        backgroundColor: ['#E53E3E', '#3182CE', '#38A169'],
      },
    ],
  }

  const pieData = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [
      {
        data: [complaintStatus.done, complaintStatus.pending],
        backgroundColor: ['#38A169', '#E53E3E'],
      },
    ],
  }

  const trendData = {
    labels: Object.keys(dailyCounts),
    datasets: [
      {
        label: 'Messages per Day',
        data: Object.values(dailyCounts),
        borderColor: '#3182CE',
        backgroundColor: '#90CDF4',
        fill: true,
        tension: 0.3,
      },
    ],
  }

  return (
    <DashboardLayout>
      <Text fontSize="2xl" fontWeight="bold" mb="4">Analytics Dashboard</Text>

      <Flex gap="4" wrap="wrap" mb="6" align="center">
        <Box>
          <Text fontSize="sm" mb="1">Start Date</Text>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="From"
          />
        </Box>
        <Box>
          <Text fontSize="sm" mb="1">End Date</Text>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="To"
          />
        </Box>
      </Flex>

      <SimpleGrid columns={[1, null, 4]} spacing="6" mb="6">
        <Stat>
          <StatLabel>Total Messages</StatLabel>
          <StatNumber>{filtered.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Complaints</StatLabel>
          <StatNumber>{typeCounts['product complaint']}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Resolved</StatLabel>
          <StatNumber>{complaintStatus.done}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Unresolved</StatLabel>
          <StatNumber>{complaintStatus.pending}</StatNumber>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={[1, null, 2]} spacing="6" mb="8">
        <Box p="4" bg="white" rounded="md" shadow="md">
          <Text fontSize="lg" fontWeight="semibold" mb="2">Messages by Type</Text>
          <Bar data={barData} height={300} />
        </Box>

        <Box p="4" bg="white" rounded="md" shadow="md">
          <Text fontSize="lg" fontWeight="semibold" mb="2">Complaint Status</Text>
          <Pie data={pieData} height={300} />
        </Box>
      </SimpleGrid>

      <Box p="4" bg="white" rounded="md" shadow="md">
        <Text fontSize="lg" fontWeight="semibold" mb="4">Message Trend</Text>
        <Line data={trendData} height={300} />
      </Box>

      {startDate && endDate && (
        <Box mt="10">
          <Text fontSize="lg" mb="3" fontWeight="medium">
            Messages from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </Text>

          <Box overflowX="auto" bg="white" p="4" borderRadius="md" shadow="sm">
            <Table>
              <Thead bg="gray.50">
                <Tr>
                  <Th>User</Th>
                  <Th>Message</Th>
                  <Th>Type</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((m) => (
                  <Tr key={m._id}>
                    <Td>{m.userNumber}</Td>
                    <Td maxW="500px" whiteSpace="normal" wordBreak="break-word">{m.message}</Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        {m.messageType}
                      </Text>
                    </Td>
                    <Td>{new Date(m.timestamp).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </DashboardLayout>
  )
}

export default Analytics
