// pages/Messages.jsx
import React, { useState } from 'react'
import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Text,
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchMessages = async () => {
  const res = await axios.get('/api/dashboard/messages')
  return res.data
}

const Messages = () => {
  const { data, isLoading } = useQuery(['messages'], fetchMessages)
  const [search, setSearch] = useState('')

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

  const filteredMessages = data.filter(
    (msg) =>
      msg.userNumber.includes(search) ||
      msg.message.toLowerCase().includes(search.toLowerCase()) ||
      msg.messageType.toLowerCase().includes(search.toLowerCase())
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
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table variant="simple" bg="white">
        <Thead>
          <Tr>
            <Th>User Number</Th>
            <Th>Message</Th>
            <Th>Category</Th>
            <Th>Timestamp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredMessages.map((msg) => (
            <Tr key={msg._id}>
              <Td>{msg.userNumber}</Td>
              <Td>{msg.message}</Td>
              <Td>
                <Tag colorScheme="blue">{msg.messageType}</Tag>
              </Td>
              <Td>{new Date(msg.timestamp).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </DashboardLayout>
  )
}

export default Messages
