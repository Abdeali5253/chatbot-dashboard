// pages/Messages.jsx
import React, { useState } from 'react'
import {
  Box,
  Input,
  Text,
  Tag
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
    queryFn: fetchMessages
  })
  
  const [search, setSearch] = useState('')

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

  const filteredMessages = (data || []).filter(
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
            {filteredMessages.map((msg) => (
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
  verticalAlign: 'top'
}

export default Messages
