// pages/Complaints.jsx
import React from 'react'
import {
  Box,
  Button,
  Tag,
  Text
} from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'

const fetchComplaints = async () => {
  const res = await api.get('/api/dashboard/complaints')
  return res.data
}

const updateComplaintStatus = async ({ id, status }) => {
  const res = await api.patch(`/api/dashboard/complaint/${id}`, { status })
  return res.data
}

const Complaints = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: fetchComplaints
  })
  

  const mutation = useMutation({
    mutationFn: updateComplaintStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    }
  })

  const handleToggleStatus = (complaint) => {
    mutation.mutate({
      id: complaint._id,
      status: complaint.status === 'done' ? 'pending' : 'done',
    })
  }

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="6">
        Complaints
      </Text>

      <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="md" p="4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f7fafc' }}>
            <tr>
              <th style={thStyle}>User Number</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((complaint) => (
              <tr key={complaint._id}>
                <td style={tdStyle}>{complaint.userNumber}</td>
                <td style={tdStyle}>{complaint.message}</td>
                <td style={tdStyle}>
                  <Tag
                    colorScheme={
                      complaint.status === 'done' ? 'green' : 'red'
                    }
                  >
                    {complaint.status === 'done' ? 'Done' : 'Pending'}
                  </Tag>
                </td>
                <td style={tdStyle}>
                  <Button
                    size="sm"
                    onClick={() => handleToggleStatus(complaint)}
                    colorScheme={
                      complaint.status === 'done' ? 'orange' : 'green'
                    }
                  >
                    Mark {complaint.status === 'done' ? 'Undone' : 'Done'}
                  </Button>
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

export default Complaints
