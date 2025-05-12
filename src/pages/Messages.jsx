import React, { useState } from 'react'
import {
  Box,
  Input,
  Text,
  Tag,
  Button
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import api from '../api'

const fetchMessages = async () => {
  const res = await api.get('/api/dashboard/messages')
  return res.data
}

const Messages = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 5 * 60 * 1000,   // ✅ 5 min cache freshness
    cacheTime: 10 * 60 * 1000   // ✅ 10 min total memory cache
  })

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

  const filteredMessages = (data || []).filter(
    (msg) =>
      msg.userNumber.includes(search) ||
      msg.message.toLowerCase().includes(search.toLowerCase()) ||
      msg.messageType.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredMessages.length / pageSize)

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="6">
        Messages
      </Text>

      <Input
        placeholder="Search by user or category..."
        mb="6"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />

      <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="md" p="4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f7fafc' }}>
            <tr>
              <th style={thStyle}>User Number</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map((msg) => (
              <tr key={msg._id}>
                <td style={tdStyle}>{msg.userNumber}</td>
                <td style={tdStyle}>{msg.message}</td>
                <td style={tdStyle}>
                  <Tag colorScheme="blue">{msg.messageType}</Tag>
                </td>
                <td style={tdStyle}>
                  {new Date(msg.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      

      <Box mt="4" display="flex" alignItems="center" justifyContent="space-between">
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
          setCurrentPage(1)
        }}
      >
        {[10, 50, 100].map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>

      <Box display="flex" alignItems="center" gap="8px">
        <Text fontSize="sm">Page {currentPage} of {totalPages}</Text>
        <Button
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Prev
        </Button>
        <Button
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>

    </DashboardLayout>
  )
}

const thStyle = {
  textAlign: 'left',
  padding: '10px',
  fontWeight: 'bold',
  borderBottom: '1px solid #E2E8F0'
}

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #EDF2F7',
  verticalAlign: 'top',
  whiteSpace: 'normal',         
  wordBreak: 'break-word',       
}

export default Messages
