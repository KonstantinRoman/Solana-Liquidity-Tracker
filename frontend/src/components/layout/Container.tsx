import { Box, BoxProps } from '@chakra-ui/react'

export const Container = ({ children, ...props }: BoxProps) => {
  return (
    <Box maxW="1200px" mx="auto" px={4} {...props}>
      {children}
    </Box>
  )
}
