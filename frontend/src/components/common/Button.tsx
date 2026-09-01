import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react'

export const Button = ({ children, ...props }: ChakraButtonProps) => {
  return (
    <ChakraButton
      colorPalette="teal"
      variant="solid"
      borderRadius="lg"
      _hover={{ opacity: 0.9 }}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}