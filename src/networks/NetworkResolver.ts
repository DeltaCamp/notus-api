import { UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { Network } from './Network'
import { NetworkName } from './NetworkName'
import { NetworkEntity } from './NetworkEntity'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { useLocalhostNotMainnet } from '../utils/useLocalhostNotMainnet'
import { getLocalhostNetworkId } from '../utils/getLocalhostNetworkId'

const debug = require('debug')('notus:NetworkResolver')

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => NetworkEntity)
export class NetworkResolver {

  @Query(returns => NetworkEntity)
  network(@Args('id') id: number): NetworkEntity {
    return this.buildNetworkEntity(id)
  }

  @Query(returns => [NetworkEntity])
  async networks(): Promise<NetworkEntity[]> {
    if (useLocalhostNotMainnet()) {
      const localhostId = await getLocalhostNetworkId()
      return [this.buildNetworkEntity(localhostId)]
    } else {
      return Object.values(Network).reduce((accumulator, id) => {
        if (typeof id === 'number') {
          accumulator.push(this.buildNetworkEntity(id))
        }
        return accumulator
      }, [])
    }
  }

  buildNetworkEntity(id: number): NetworkEntity {
    const networkEntity = new NetworkEntity()
    networkEntity.id = id;
    networkEntity.name = NetworkName[id];
    if (!networkEntity.name) {
      networkEntity.name = 'unknown'
    }
    return networkEntity
  }
}
