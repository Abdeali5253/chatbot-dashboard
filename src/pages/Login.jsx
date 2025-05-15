import React, { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username === 'admin' && password === 'password') {
      localStorage.setItem('token', 'dummy_token')
      localStorage.setItem('username', username)
      console.log('Login successful ✅')
      navigate('/')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="gray.50"
    >
      <Box bg="white" p="8" rounded="md" boxShadow="md" w="400px">
        <Heading mb="6" textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing="4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button colorScheme="teal" type="submit" width="100%">
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}

export default Login
