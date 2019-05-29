export function useLocalhostNotMainnet() {
  return process.env.USE_LOCALHOST_NOT_MAINNET === 'true'
}