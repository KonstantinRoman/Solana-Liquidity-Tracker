import { Box, BoxProps } from '@chakra-ui/react'

export const Card = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      bg="gray.900"
      borderWidth="1px"
      borderColor="gray.800"
      borderRadius="xl"
      p={6}
      {...props}
    >
      {children}
    </Box>
  )
}