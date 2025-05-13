// components/LoaderSpinner.jsx
import React from 'react'
import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

const LoaderSpinner = ({ label = 'Loading data...' }) => (
  <Center minH="200px">
    <VStack spacing={3}>
      <Spinner size="xl" color="blue.500" />
      <Text fontSize="md" color="gray.500">{label}</Text>
    </VStack>
  </Center>
)

export default LoaderSpinner
