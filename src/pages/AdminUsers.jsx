import React, { useState } from 'react'
import {
  Box, Text, Table, Thead, Tbody, Tr, Th, Td,
  Button, Input, VStack, HStack, useToast
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import DashboardLayout from '../components/DashboardLayout'

const fetchUsers = async () => {
  const res = await api.get('/api/dashboard/users')
  return res.data
}

const AdminUsers = () => {
  const [form, setForm] = useState({
    number: '',
    companyName: '',
    instanceId: '',
    username: '',
    password: '',
    isAdmin: false
  })

  const toast = useToast()
  const queryClient = useQueryClient()
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })

  const createUser = useMutation({
    mutationFn: (newUser) => api.post('/api/dashboard/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast({ title: 'User added', status: 'success', duration: 2000 })
      setForm({ number: '', companyName: '', instanceId: '', username: '', password: '', isAdmin: false })
    }
  })

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/api/dashboard/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast({ title: 'User deleted', status: 'info', duration: 2000 })
    }
  })

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="4">Admin: Manage Users</Text>

      <Box mb="6">
        <Text fontWeight="bold" mb="2">Add New User</Text>
        <VStack spacing="2" align="stretch">
          <HStack>
            <Input placeholder="Company Name" value={form.companyName} onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))} />
            <Input placeholder="Number" value={form.number} onChange={(e) => setForm(f => ({ ...f, number: e.target.value }))} />
          </HStack>
          <HStack>
            <Input placeholder="Instance ID" value={form.instanceId} onChange={(e) => setForm(f => ({ ...f, instanceId: e.target.value }))} />
            <Input placeholder="Username" value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} />
            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} />
          </HStack>
          <Button colorScheme="blue" onClick={() => createUser.mutate(form)}>Add User</Button>
        </VStack>
      </Box>

      <Text fontWeight="bold" mb="2">All Users</Text>
      <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="md" p="4">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Company</Th>
              <Th>Number</Th>
              <Th>Username</Th>
              <Th>Instance ID</Th>
              <Th>Admin</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u) => (
              <Tr key={u._id}>
                <Td>{u.companyName}</Td>
                <Td>{u.number}</Td>
                <Td>{u.loginCredentials?.username}</Td>
                <Td>{u.instanceId}</Td>
                <Td>{u.isAdmin ? 'Yes' : 'No'}</Td>
                <Td>
                  <Button size="sm" colorScheme="red" onClick={() => deleteUser.mutate(u._id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </DashboardLayout>
  )
}

export default AdminUsers
