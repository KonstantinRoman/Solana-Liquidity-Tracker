import { Flex, Spinner, Text, VStack } from '@chakra-ui/react'

interface LoaderProps {
  label?: string
}

export const Loader = ({ label = 'Загрузка данных...' }: LoaderProps) => {
  return (
    <Flex justify="center" align="center" py={12}>
      <VStack spaceY={3}>
        <Spinner size="xl" color="teal.400" />
        <Text color="gray.400" fontSize="sm">{label}</Text>
      </VStack>
    </Flex>
  )
}