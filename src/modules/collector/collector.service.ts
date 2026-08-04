import { apiMeteoraResponseSchema, MeteoraPool } from '../../types/meteora.shema.js'

const METEORA_URL = 'https://dlmm-api.meteora.ag/pair/all_with_pagination?page=0&limit=50'

async function fetchWithRetry(url: string, retries = 3, timeoutMs = 5000): Promise<unknown> {
	for(let attempt = 1;attempt <= retries; attempt++){
		try {
			const response = await fetch(url,{
				signal: AbortSignal.timeout(timeoutMs)
			})

			if(!response.ok){
				throw new Error(`MeteoraApi respondet witch status: ${response.status}`)
			}

			return await response.json()
		} catch (error) {
			console.warn(`[Attempt ${attempt}/${retries}] Error when requesting MeteraAPI:`, (error as Error).message)

			await new Promise((resolve) => setTimeout(resolve,1000))
		}
	}
}

export async function collectionMeteoraPools():Promise<MeteoraPool[]> {
	const rawData = await fetchWithRetry(METEORA_URL)

	const parseData = apiMeteoraResponseSchema.parse(rawData)

	console.log(`Successfully received pools: ${parseData.data.length}`)

	return parseData.data 
}


