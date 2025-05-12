import React, { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Tag,
  IconButton
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import DashboardLayout from '../components/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'

const fetchTodos = async () => {
  const res = await api.get('/api/dashboard/todo')
  return res.data
}

const addTodo = async ({ text }) => {
  const res = await api.post('/api/dashboard/todo', { text })
  return res.data
}

const toggleTodo = async ({ id, done }) => {
  await api.patch(`/api/dashboard/todo/${id}`, { done })
}

const deleteTodo = async (id) => {
  await api.delete(`/api/dashboard/todo/${id}`)
}

const Todo = () => {
  const queryClient = useQueryClient()
  const [newTodo, setNewTodo] = useState('')

  const { data: todoList, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 3 * 60 * 1000,
  })

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setNewTodo('')
    }
  })

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const handleAdd = () => {
    if (!newTodo.trim()) return
    addMutation.mutate({ text: newTodo.trim() })
  }

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="4">To-Do List</Text>

      <HStack mb="4">
        <Input
          placeholder="New todo (e.g. Redeliver to 92300...)"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleAdd} isLoading={addMutation.isLoading}>
          Add
        </Button>
      </HStack>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <VStack align="stretch" spacing="3">
          {(todoList || []).map((item) => (
            <Box
              key={item._id}
              p="3"
              borderRadius="md"
              bg={item.done ? 'green.50' : 'gray.50'}
              border="1px solid"
              borderColor={item.done ? 'green.300' : 'gray.200'}
            >
              <HStack justifyContent="space-between">
                <Box>
                  <Text
                    textDecoration={item.done ? 'line-through' : 'none'}
                    color={item.done ? 'gray.500' : 'black'}
                  >
                    {item.text}
                  </Text>
                </Box>
                <HStack>
                  <Button
                    size="sm"
                    onClick={() => toggleMutation.mutate({ id: item._id, done: !item.done })}
                    colorScheme={item.done ? 'orange' : 'green'}
                  >
                    {item.done ? 'Undo' : 'Mark Done'}
                  </Button>
                  <IconButton
                    size="sm"
                    icon={<DeleteIcon />}
                    onClick={() => deleteMutation.mutate(item._id)}
                    aria-label="Delete"
                    colorScheme="red"
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </DashboardLayout>
  )
}

export default Todo
