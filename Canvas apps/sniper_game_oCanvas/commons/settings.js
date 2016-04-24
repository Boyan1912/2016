var Settings = {
    // general:
    RotationAngleAdjustment: 90,
    PlayFieldLength: 1000,
    PlayFieldWidth: 1800,
    DefaultSpriteDuration: 60,
    PointsNeededForNextStage: 120,


    // player
    DefaultInitialRocketDamageWeight: 50,
    PlayerInitialHealth: 100,
    PlayerInitialGunShellsCount: 50,
    MaxTimeForPlayerToCrossField: 9000,
    DefaultSpeedSensitivity: 10,
    MaxTimeForRocketToCrossField: 2500,
    DefaultExplosionDuration: 3000,
    DefaultExplosionDamageArea: 60,
    DefaultExplosionDamageWeight: 1,
    PlayerCollisionTolerance: 50,
    //RocketCollisionTolerance: 60,
    ClickOnPlayerBugFixValue: 20,


    // enemies:
    InitialEnemyType: 'mummy',
    SecondaryEnemyType: 'jinn',
    MummyTimeToCrossField: 50000,
    JinnTimeToCrossField: 40000,
    DefaultEnemyTimeToCrossField: 35000,
    InitialEnemiesCount: 5,
    MummyKillValuePoints: 25,
    RadiusEnemiesDestinationAroundPlayer: 150,
    DefaultInitialEnemyHealth: 100,
    DefaultInitialMummyDamageWeight: 10,
    MinViabilityHealthPoints: 40,
    DefaultInitialJinnDamageWeight: 40,
    JinnKillValuePoints: 35,
    SlowDownDamagedModelsRate: 2,


    // game performance:
    TravelDirectionRefreshTime: 3000,
    DetectBlastDamageRefreshTime: 100,
    DetectPlayerCollisionRefreshTime: 800,
    DefaultModelFadeOutType: 'ease-in-out-bounce',
    DefaultModelFadeInType: 'ease-in-expo',
    EnemiesShowUpMarginAroundUpperYAxis: 100,
    MonitorPlayersAdvanceInterval: 7000

};