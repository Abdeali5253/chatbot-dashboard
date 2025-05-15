import React, { useState } from 'react'
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Button,
  Select,
  Input,
  Flex,
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import DashboardLayout from '../components/DashboardLayout'
import LoaderSpinner from '../components/LoaderSpinner'

const fetchComplaints = async () => {
  const res = await api.get('/complaints')
  return res.data
}

const isWithinDays = (timestamp, range) => {
  if (range === 'all') return true
  const now = new Date()
  const date = new Date(timestamp)

  if (range === 'today') {
    return now.toDateString() === date.toDateString()
  }

  const diff = (now - date) / (1000 * 60 * 60 * 24)
  return diff <= Number(range)
}

const Complaints = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortOrder, setSortOrder] = useState('desc')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/api/dashboard/complaint/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['complaints']),
  })

  const filtered = (data || [])
    .filter(c => statusFilter === 'all' || (c.status || 'pending') === statusFilter)
    .filter(c => isWithinDays(c.timestamp, dateRange))
    .filter(c =>
      c.message?.toLowerCase().includes(search.toLowerCase()) ||
      c.userNumber.includes(search)
    )
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    )

  const totalPages = Math.ceil(filtered.length / limit)
  const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit)

  return (
    <DashboardLayout>
      <Flex mb="4" align="center" justify="space-between" wrap="wrap" gap="4">
        <Text fontSize="2xl" fontWeight="bold">Complaints</Text>

        <Flex gap="3" wrap="wrap" justify={['flex-start', 'flex-end']}>
          <Select w="150px" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </Select>
          <Select w="150px" value={dateRange} onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1) }}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </Select>
          <Select w="150px" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Select>
          <Input
            placeholder="Search message or number"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            w="250px"
          />
          <Select w="150px" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1) }}>
            {[10, 50, 100].map(n => (
              <option key={n} value={n}>{n} per page</option>
            ))}
          </Select>
        </Flex>
      </Flex>

      {isLoading && !data ? (
        <LoaderSpinner label="Loading complaints..." />
      ) : isError ? (
        <Box bg="red.50" p="4" borderRadius="md">
          <Text color="red.500">Failed to load complaints. Retrying...</Text>
        </Box>
      ) : (
        <>
          {isFetching && (
            <Text fontSize="sm" color="gray.500" mb="2">Refreshing complaints...</Text>
          )}

          <Box overflowX="auto" borderRadius="md" bg="white" p="4" boxShadow="sm">
            <Table>
              <Thead bg="gray.50">
                <Tr>
                  <Th minW="140px" whiteSpace="nowrap">User Number</Th>
                  <Th minW="500px">Message</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginated.map((c) => (
                  <Tr key={c._id}>
                    <Td whiteSpace="nowrap">{c.userNumber}</Td>
                    <Td maxW="500px" whiteSpace="normal" wordBreak="break-word">{c.message}</Td>
                    <Td>
                      <Tag colorScheme={c.status === 'done' ? 'green' : 'red'}>
                        {c.status === 'done' ? 'Done' : 'Pending'}
                      </Tag>
                    </Td>
                    <Td>
                      <Flex flexDirection="column" gap="2px">
                        <Button
                          size="sm"
                          colorScheme={c.status === 'done' ? 'orange' : 'green'}
                          onClick={() => toggleStatus.mutate({
                            id: c._id,
                            status: c.status === 'done' ? 'pending' : 'done',
                          })}
                        >
                          Mark {c.status === 'done' ? 'Undone' : 'Done'}
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {
                            const todoItems = JSON.parse(localStorage.getItem('todoItems') || '[]')
                            const newItem = `${c.userNumber}: ${c.message}`
                            localStorage.setItem('todoItems', JSON.stringify([
                              ...todoItems,
                              { text: newItem, done: false }
                            ]))
                            window.open('/todo', '_blank')
                          }}
                        >
                          Send to Todo
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Flex mt="4" justify="space-between" align="center">
            <Text fontSize="sm">Page {currentPage} of {totalPages}</Text>
            <Flex gap="8px">
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
            </Flex>
          </Flex>
        </>
      )}
    </DashboardLayout>
  )
}

export default Complaints
