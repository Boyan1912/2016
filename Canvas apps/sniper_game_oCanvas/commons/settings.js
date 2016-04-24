var Settings = {
    // general:
    RotationAngleAdjustment: 90,
    PlayFieldLength: 1000,
    PlayFieldWidth: 1800,
    DefaultSpriteDuration: 60,
    PointsNeededForNextStage: 120,


    // player:
    PlayerInitialHealth: 100,
    PlayerInitialGunShellsCount: 50,
    MaxTimeForPlayerToCrossField: 9000,
    DefaultSpeedSensitivity: 10,
    MaxTimeForRocketToCrossField: 2500,
    DefaultExplosionDuration: 3000,
    DefaultExplosionDamageArea: 60,
    DefaultExplosionDamageWeight: 1,
    PlayerCollisionTolerance: 50,
    ClickOnPlayerBugFixValue: 20,


    // enemies:
    InitialEnemyType: 'mummy',
    SecondaryEnemyType: 'jinn',
    MummyTimeToCrossField: 50000,
    JinnTimeToCrossField: 40000,
    DefaultEnemyTimeToCrossField: 35000,
    InitialEnemiesCount: 5,
    MummyKillValuePoints: 2,
    RadiusEnemiesDestinationAroundPlayer: 150,
    DefaultInitialEnemyHealth: 100,
    DefaultInitialMummyDamageWeight: 10,
    MinViabilityHealthPoints: 40,
    DefaultInitialJinnDamageWeight: 15,
    JinnKillValuePoints: 5,
    SlowDownDamagedModelsRate: 2,


    // game performance:
    TravelDirectionRefreshTime: 3000,
    DetectBlastDamageRefreshTime: 300,
    DetectPlayerCollisionRefreshTime: 400,
    EnemiesShowUpMarginAroundUpperYAxis: 100

};