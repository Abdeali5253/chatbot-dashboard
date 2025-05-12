// // pages/Complaints.jsx
// import React from 'react'
// import {
//   Box,
//   Button,
//   Tag,
//   Text
// } from '@chakra-ui/react'
// import DashboardLayout from '../components/DashboardLayout'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import api from '../api'

// const fetchComplaints = async () => {
//   const res = await api.get('/api/dashboard/complaints')
//   return res.data
// }

// const updateComplaintStatus = async ({ id, status }) => {
//   const res = await api.patch(`/api/dashboard/complaint/${id}`, { status })
//   return res.data
// }

// const Complaints = () => {
//   const queryClient = useQueryClient()
//   const { data, isLoading } = useQuery({
//     queryKey: ['complaints'],
//     queryFn: fetchComplaints
//   })
  

//   const mutation = useMutation({
//     mutationFn: updateComplaintStatus,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['complaints'] })
//     }
//   })

//   const handleToggleStatus = (complaint) => {
//     mutation.mutate({
//       id: complaint._id,
//       status: complaint.status === 'done' ? 'pending' : 'done',
//     })
//   }

//   if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

//   return (
//     <DashboardLayout>
//       <Text fontSize="2xl" mb="6">
//         Complaints
//       </Text>

//       <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="md" p="4">
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead style={{ backgroundColor: '#f7fafc' }}>
//             <tr>
//               <th style={thStyle}>User Number</th>
//               <th style={thStyle}>Message</th>
//               <th style={thStyle}>Status</th>
//               <th style={thStyle}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((complaint) => (
//               <tr key={complaint._id}>
//                 <td style={tdStyle}>{complaint.userNumber}</td>
//                 <td style={tdStyle}>{complaint.message}</td>
//                 <td style={tdStyle}>
//                   <Tag
//                     colorScheme={
//                       complaint.status === 'done' ? 'green' : 'red'
//                     }
//                   >
//                     {complaint.status === 'done' ? 'Done' : 'Pending'}
//                   </Tag>
//                 </td>
//                 <td style={tdStyle}>
//                   <Button
//                     size="sm"
//                     onClick={() => handleToggleStatus(complaint)}
//                     colorScheme={
//                       complaint.status === 'done' ? 'orange' : 'green'
//                     }
//                   >
//                     Mark {complaint.status === 'done' ? 'Undone' : 'Done'}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Box>
//     </DashboardLayout>
//   )
// }

// const thStyle = {
//   textAlign: 'left',
//   padding: '10px',
//   fontWeight: 'bold',
//   borderBottom: '1px solid #E2E8F0'
// }

// const tdStyle = {
//   padding: '10px',
//   borderBottom: '1px solid #EDF2F7',
//   verticalAlign: 'top'
// }

// export default Complaints


import React, { useState } from 'react'
import {
  Box,
  Button,
  Tag,
  Text,
  Select
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
    queryFn: fetchComplaints,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  })

  const mutation = useMutation({
    mutationFn: updateComplaintStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    }
  })

  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>

  const filteredComplaints = (data || [])
  .filter((c) => {
    if (filterStatus === 'all') return true
    return (c.status || 'pending') === filterStatus
  })
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) 


  const totalPages = Math.ceil(filteredComplaints.length / pageSize)
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleToggleStatus = (complaint) => {
    mutation.mutate({
      id: complaint._id,
      status: complaint.status === 'done' ? 'pending' : 'done',
    })
  }

  return (
    <DashboardLayout>
      <Text fontSize="2xl" mb="4">
        Complaints
      </Text>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb="4">
        <Select
          w="200px"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </Select>

        <Select
          w="160px"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setCurrentPage(1)
          }}
        >
          {[10, 50, 100].map((size) => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </Select>
      </Box>

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
            {paginatedComplaints.map((complaint) => (
              <tr key={complaint._id}>
                <td style={tdStyle}>{complaint.userNumber}</td>
                <td style={tdStyle}>{complaint.message}</td>
                <td style={tdStyle}>
                  <Tag colorScheme={complaint.status === 'done' ? 'green' : 'red'}>
                    {complaint.status === 'done' ? 'Done' : 'Pending'}
                  </Tag>
                </td>
                <td style={tdStyle}>
  <Box display="flex" flexDirection="column" gap="2px">
    <Button
      size="sm"
      onClick={() => handleToggleStatus(complaint)}
      colorScheme={complaint.status === 'done' ? 'orange' : 'green'}
    >
      Mark {complaint.status === 'done' ? 'Undone' : 'Done'}
    </Button>
    <Button
      size="sm"
      colorScheme="blue"
      onClick={() => {
        const currentTodos = JSON.parse(localStorage.getItem('todoItems') || '[]')
        const message = `${complaint.userNumber}: ${complaint.message}`
        const updated = [...currentTodos, { text: message, done: false }]
        localStorage.setItem('todoItems', JSON.stringify(updated))
        window.open('/todo', '_blank')
      }}
    >
      Send to Todo
    </Button>
  </Box>
</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box mt="4" display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="sm">
          Page {currentPage} of {totalPages}
        </Text>
        <Box>
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            isDisabled={currentPage === 1}
            mr="2"
            size="sm"
          >
            Prev
          </Button>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            isDisabled={currentPage === totalPages}
            size="sm"
          >
            Next
          </Button>
        </Box>
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
  verticalAlign: 'top',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
}

export default Complaints
