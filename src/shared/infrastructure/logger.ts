import pino from 'pino'
import { env } from '../../config/index.js'

const level = env.LOG_LEVEL || 'info'

const transport = pino.transport({
	target: 'pino-pretty',
	options:{
		colorize: true,
		translateTime: 'SYS:standard', 
    ignore: 'pid,hostname', 
	},
	level: level
})

export const logger = pino({
	level,
	base:{
		service: 'your-service-name',
    env: env.NODE_ENV || 'development', 
	},
	timestamp: pino.stdTimeFunctions.isoTime,
},
	transport
)