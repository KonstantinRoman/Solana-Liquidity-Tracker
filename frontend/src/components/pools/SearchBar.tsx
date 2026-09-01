import { Input } from '@chakra-ui/react'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <Input
      placeholder="Поиск пула по названию (SOL-USDC) или адресу..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="lg"
      bg="gray.900"
      borderColor="gray.800"
      _focus={{ borderColor: 'teal.400' }}
      mb={6}
    />
  )
}