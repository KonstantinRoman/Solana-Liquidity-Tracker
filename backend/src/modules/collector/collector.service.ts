import { env } from '../../config/index.js'
import { logger } from '../../shared/infrastructure/logger.js'
import { fetchWithRetry } from '../../shared/utils/http.js'
import { apiMeteoraResponseSchema, MeteoraPool } from '../../types/meteora.shema.js'

export async function collectionMeteoraPools(): Promise<MeteoraPool[]> {
  try {
    const rawData = await fetchWithRetry(env.METEORA_URL)

    const parseData = apiMeteoraResponseSchema.parse(rawData)

    logger.info(
      { count: parseData.data.length, source: 'meteora-api', url: env.METEORA_URL },
      'Successfully received pools from Meteora API'
    )

    return parseData.data
  } catch (error) {	
    logger.error(
      { 
        err: error, 
        source: 'meteora-api', 
        url: env.METEORA_URL 
      },
      'Failed to fetch or parse pools from Meteora API'
    )
    throw error
  }
}