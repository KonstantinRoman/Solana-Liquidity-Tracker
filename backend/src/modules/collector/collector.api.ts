import { logger } from '../../shared/infrastructure/logger.js'
import { saveCollectorData } from './collector.repository.js'
import { collectionMeteoraPools } from './collector.service.js'

export async function runCollector() {
	try {
		logger.info(`[Collector] connect to meteora api and starting data collection`)
		
		const startTime = performance.now()

		const meteoraPoolsData = await collectionMeteoraPools()
		
		const collectionTime = ((performance.now() - startTime) / 1000).toFixed(2)
		logger.info(`[Collector] succesfull data collection (took ${collectionTime}s)`)

		logger.info(`[Collector] saving collected data`)
		
		const saveStartTime = performance.now()

		await saveCollectorData(meteoraPoolsData)
		
		const saveTime = ((performance.now() - saveStartTime) / 1000).toFixed(2)
		logger.info(`[Collector] data saved successfully (took ${saveTime}s)`)
		
	} catch (error) {
		throw new Error(`Data acquisition module operation error: ${error}`)
	}
}


