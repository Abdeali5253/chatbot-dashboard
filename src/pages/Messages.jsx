import React, { useState } from 'react'
import {
  Box,
  Input,
  Text,
  Tag,
  Button,
  Select
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import LoaderSpinner from '../components/LoaderSpinner'

const fetchMessages = async () => {
  const res = await api.get('/messages')
  return res.data
}

const isToday = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

const Messages = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [categoryFilter, setCategoryFilter] = useState('')

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
    retry: 3
  })

  const filteredMessages = (data || [])
    .filter(msg => msg.userNumber !== 'status@broadcast')
    .filter(msg =>
      (msg.userNumber.includes(search) ||
        msg.message.toLowerCase().includes(search.toLowerCase()) ||
        msg.messageType.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(msg => (categoryFilter ? msg.messageType === categoryFilter : true))

  const totalPages = Math.ceil(filteredMessages.length / pageSize)

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const categoryOptions = [...new Set((data || []).map((m) => m.messageType))]

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="6">Messages</Text>

      <Box display="flex" gap="4" flexWrap="wrap" mb="4">
        <Input
          placeholder="Search by user or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          w="300px"
        />
        <Select
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setCurrentPage(1)
          }}
          w="200px"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setCurrentPage(1)
          }}
          w="150px"
        >
          {[10, 50, 100].map((size) => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </Select>
      </Box>

      {isLoading && !data ? (
        <LoaderSpinner label="Loading messages..." />
      ) : isError ? (
        <Box bg="red.50" p="4" borderRadius="md">
          <Text color="red.500">Failed to load messages. Retrying...</Text>
        </Box>
      ) : (
        <>
          {isFetching && (
            <Text fontSize="sm" color="gray.500" mb="2">Refreshing messages...</Text>
          )}

          <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="md" p="4">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f7fafc' }}>
                <tr>
                  <th style={thStyle}>User Number</th>
                  <th style={thStyle}>Message</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    style={isToday(msg.timestamp)
                      ? { backgroundColor: '#f0f9ff' }
                      : {}
                    }
                  >
                    <td style={{ ...tdStyle, maxWidth: '120px', whiteSpace: 'nowrap' }}>
  {msg.userNumber}
</td>
                    <td style={{
  ...tdStyle,
  whiteSpace: 'normal',
  maxWidth: '600px',
  wordBreak: 'break-word'
}}>
  {msg.message}
</td>
                    <td style={tdStyle}>
                      <Tag colorScheme={
                        msg.messageType === 'product complaint' ? 'red'
                          : msg.messageType.includes('track') ? 'purple'
                          : msg.messageType.includes('price') || msg.messageType === 'general' ? 'blue'
                          : msg.messageType.includes('delivery') ? 'cyan'
                          : 'gray'
                      }>
                        {msg.messageType}
                      </Tag>
                    </td>
                    <td style={tdStyle}>
                      {new Date(msg.timestamp).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Box mt="4" display="flex" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm">Page {currentPage} of {totalPages}</Text>
            <Box display="flex" gap="8px">
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
        </>
      )}
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
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '250px',
}

export default Messages

