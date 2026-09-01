import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Container } from './Container'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg="black" color="white">
      <Container pb={12}>
        <Header />
        {children}
      </Container>
    </Box>
  )
}