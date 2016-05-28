var Settings = {
    // general:
    RotationAngleAdjustment: 90,
    PlayFieldLength: 1000,
    PlayFieldWidth: 1800,
    DefaultSpriteDuration: 60,
    PointsNeededForNextStage: 120,
    GraveDisplayTimeDuration: 4500,
    MinModelCoordinateValue: 10,

    // player:
    PlayerInitialHealth: 100,
    PlayerInitialGunShellsCount: 50,
    MaxTimeForPlayerToCrossField: 9000,
    DefaultSpeedSensitivity: 10,
    MaxTimeForRocketToCrossField: 2500,
    RocketExplosionDuration: 3000,
    DefaultExplosionDamageArea: 60,
    DefaultExplosionDamageWeight: 3,
    PlayerCollisionTolerance: 20,
    ClickOnPlayerBugFixValue: 20,
    MaxCountShotsAtATime: 4,

    // enemies:
    InitialEnemyType: 'mummy',
    SecondaryEnemyType: 'jinn',
    ThirtiaryEnemyType: 'fire_demon',
    MummyTimeToCrossField: 70000,
    JinnTimeToCrossField: 20000,
    FireTimeToCrossField: 90000,
    FireDemonTimeToCrossField: 60000,
    DefaultEnemyTimeToCrossField: 35000,
    FireDemonRunAcceleration: 1.4,
    InitialEnemiesCount: 2,
    MummyKillValuePoints: 2,
    FireDemonKillValuePoints: 5,
    DefaultRadius: 350,
    RadiusMummiesDestinationAroundPlayer: 200,
    RadiusJinnsDestinationAroundPlace: 700,
    JinnsAboutPlace: {
        x: 200,
        y: 400
    },
    JinnsShotAroundPlace: 90,
    JinnsShootingChance: 0.2,
    JinnsShootingAttemptFrequency: 4000,
    DefaultInitialEnemyHealth: 100,
    DefaultInitialMummyDamageWeight: 10,
    InitialFireDemonDamageWeight: 20,
    InitialFireDamageWeight:20,
    DefaultInitialJinnDamageWeight: 15,
    JinnKillValuePoints: 5,
    SlowDownDamagedModelsRate: 2,
    JinnBulletExplosionDuration: 1700,
    MaxTimeForJinnBulletToCrossField: 4000,
    EnemiesShowUpMarginAroundUpperYAxis: 100,

    // game performance:
    TravelDirectionRefreshTime: 2000,
    DetectBlastDamageRefreshTime: 100,
    DetectPlayerCollisionRefreshTime: 100,
    DetectFireIgnitionRefreshTime: 2500,

    // options for fire on the ground
    MinCountInflamablesOnField: 3,
    MinDamageCausedToIgnite: 8,
    DefaultNumberNewFiresToAdd: 1,
    BurningRadius: 30,
    MinBurningTime: 3000,
    DefaultFireType: 'fire',
    MaxNumberOfFiresPossible: 20
};
