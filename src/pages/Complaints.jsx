import React from 'react'
import {
  Box,
  Button,
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const fetchComplaints = async () => {
  const res = await axios.get('/api/dashboard/complaints')
  return res.data
}

const updateComplaintStatus = async ({ id, status }) => {
  const res = await axios.patch(`/api/dashboard/complaint/${id}`, { status })
  return res.data
}

const Complaints = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery(['complaints'], fetchComplaints)

  const mutation = useMutation(updateComplaintStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['complaints'])
    },
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

      <Table variant="simple" bg="white">
        <Thead>
          <Tr>
            <Th>User Number</Th>
            <Th>Message</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((complaint) => (
            <Tr key={complaint._id}>
              <Td>{complaint.userNumber}</Td>
              <Td>{complaint.message}</Td>
              <Td>
                <Tag colorScheme={complaint.status === 'done' ? 'green' : 'red'}>
                  {complaint.status === 'done' ? 'Done' : 'Pending'}
                </Tag>
              </Td>
              <Td>
                <Button
                  size="sm"
                  onClick={() => handleToggleStatus(complaint)}
                  colorScheme={complaint.status === 'done' ? 'orange' : 'green'}
                >
                  Mark {complaint.status === 'done' ? 'Undone' : 'Done'}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </DashboardLayout>
  )
}

export default Complaints
