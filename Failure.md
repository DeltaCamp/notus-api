sequenceDiagram
    participant DappEntity
    participant DappUserEntity
    participant UserEntity
    participant DappUserEntity
    participant EventEntity
    participant EventMatcherEntity
    participant DappEntity
    participant EventTypeEntity
    DappEntity->>DappUserEntity: "const dappUserEntity = require"
    DappUserEntity->>UserEntity: "const userEntity = require"
    UserEntity->>DappUserEntity: "const dappUserEntity = require"
