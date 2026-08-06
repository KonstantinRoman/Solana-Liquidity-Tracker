export async function fetchWithRetry(url: string, retries = 3, timeoutMs = 5000): Promise<unknown> {
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