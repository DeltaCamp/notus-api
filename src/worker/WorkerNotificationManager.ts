import { Injectable } from '@nestjs/common'
const Web3 = require('web3');

import { newSocket } from '../utils/newSocket'
import { NotificationService } from '../notifications/NotificationService'
import { NotificationEntity } from '../notifications/NotificationEntity'
import { LogManager } from './LogManager'
import { rollbar } from '../rollbar'
import { Trigger } from './types'
import { TriggerManager } from './TriggerManager'
import { TriggerListenerFactory } from './TriggerListenerFactory'

function notificationToTrigger(notification: NotificationEntity): Trigger {
  let trigger = {
    triggerType: 'EventTrigger',
    address: notification.address,
    topics: notification.topics
  }

  return trigger
}

@Injectable()
export class WorkerNotificationManager {
  private triggerManager: TriggerManager
  private web3: any

  constructor (
    private readonly notificationService: NotificationService,
    private readonly logManager: LogManager
  ) {
    this.triggerManager = new TriggerManager(
      new TriggerListenerFactory(
        new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER_WS_URI)),
        logManager
      )
    )
    console.log(`Connected to Ethereum network on ${process.env.WEB3_PROVIDER_WS_URI}`)
  }

  async start() {
    const notifications = await this.notificationService.findAll()
    console.log(`Found ${notifications.length} existing notifications`)
    notifications.forEach(notification => this.add(notification))

    const socket = newSocket()
    socket.on('/notifications/add', this.onAdd)
    socket.on('/notifications/remove', this.onRemove)

    socket.on('connect', () => {
      console.log('Connected to API server')
    })

    socket.on('connect_error', (error) => {
      console.error('Error connecting to API server: ', error)
    })

    socket.on('reconnect_attempt', () => {
      console.log('Retrying connection to API server...')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from API server')
    })
  }

  onAdd = (notificationId) => {
    this.notificationService.find(notificationId)
      .then((notification: NotificationEntity) => {
        this.add(notification)
      })
      .catch(error => {
        rollbar.error(error)
      })
  }

  onRemove = (notificationId) => {
    console.log(`Removing notification ${notificationId}`)
    this.triggerManager.remove(notificationId)
  }

  add (notification) {
    console.log(`Adding notification ${notification.id}`)
    let trigger = notificationToTrigger(notification)
    let triggerListener = this.triggerManager.add(notification.id, trigger)
    triggerListener.start(notification.id, trigger, (error, log) => {
      if (error) {
        rollbar.error(error)
      } else {
        console.log("NOTIFYYYYYING: ", log)
        this.notificationService.notify(notification, log)
      }
    })
  }
}
