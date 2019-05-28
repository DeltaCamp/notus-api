import { NotFoundException, UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { Network } from './Network'
import { NetworkName } from './NetworkName'
import { NetworkEntity } from './NetworkEntity'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

const debug = require('debug')('notus:NetworkResolver')

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => NetworkEntity)
export class NetworkResolver {

  @Query(returns => NetworkEntity)
  network(@Args('id') id: number): NetworkEntity {
    const networkEntity = this.buildNetworkEntity(id)
    if (!networkEntity.name) {
      throw new NotFoundException()
    }
    return networkEntity
  }

  @Query(returns => [NetworkEntity])
  networks(): NetworkEntity[] {
    return Object.values(Network).reduce((accumulator, id) => {
      if (typeof id === 'number') {
        accumulator.push(this.buildNetworkEntity(id))
      }
      return accumulator
    }, [])
  }

  buildNetworkEntity(id: number): NetworkEntity {
    const networkEntity = new NetworkEntity()
    networkEntity.id = id;
    networkEntity.name = NetworkName[id];
    return networkEntity
  }
}
