import { Heading, Link, Text, VStack } from '@chakra-ui/react'

export const Header = () => {
  return (
    <VStack spaceY={2} textAlign="center" py={8}>
      <Heading size="3xl" fontWeight="bold" letterSpacing="tight">
        Solana Liquidity Tracker
      </Heading>
      <Text color="gray.400" fontSize="lg">
        Мониторинг TVL и объемов DLMM пулов Meteora
      </Text>
      <Link
        href="https://t.me/your_bot_username"
        target="_blank"
        color="teal.400"
        fontSize="sm"
        fontWeight="medium"
        _hover={{ textDecoration: 'underline' }}
      >
        🤖 Telegram Bot
      </Link>
    </VStack>
  )
}