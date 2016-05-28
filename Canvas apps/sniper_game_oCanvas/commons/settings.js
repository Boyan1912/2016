var Settings = {
    // general:
    RotationAngleAdjustment: 90,
    PlayFieldLength: 1000,
    PlayFieldWidth: 1800,
    DefaultSpriteDuration: 60,
    PointsNeededForNextStage: 120,
    GraveDisplayTimeDuration: 4500,
    MinModelCoordinateValue: 15,
    ClickOnPlayerBugFixValue: 20,

    // game performance:
    TravelDirectionRefreshTime: 2000,
    DetectBlastDamageRefreshTime: 100,
    DetectPlayerCollisionRefreshTime: 100,
    DetectFireIgnitionRefreshTime: 2500,

    // player:
    PlayerInitialHealth: 100,
    PlayerInitialGunShellsCount: 50,
    MaxTimeForPlayerToCrossField: 9000,
    DefaultSpeedSensitivity: 10,
    MaxTimeForRocketToCrossField: 2500,
    RocketExplosionDuration: 3000,
    DefaultExplosionDamageArea: 30,
    DefaultExplosionDamageWeight: 3,
    PlayerCollisionTolerance: 20,
    MaxCountShotsAtATime: 4,

    // enemies:
    InitialEnemyType: 'mummy',
    SecondaryEnemyType: 'jinn',
    ThirtiaryEnemyType: 'fire_demon',
    MummyTimeToCrossField: 70000,
    JinnTimeToCrossField: 20000,
    FireTimeToCrossField: 100 * 1000,
    FireDemonTimeToCrossField: 100 * 1000,
    DefaultEnemyTimeToCrossField: 35 * 1000,
    FireDemonRunAcceleration: 1.4,
    InitialEnemiesCount: 2,
    DefaultRadius: 350,
    RadiusMummiesDestinationAroundPlayer: 200,
    RadiusJinnsDestinationAroundPlace: 700,
    JinnsAboutPlace: {
        x: 200,
        y: 400
    },
    JinnsShotAroundPlace: 90,
    JinnsShootingChance: 0.4,
    JinnsShootingAttemptFrequency: 4000,
    DefaultInitialEnemyHealth: 100,
    DefaultInitialMummyDamageWeight: 2,
    InitialFireDemonDamageWeight: 10,
    InitialFireDamageWeight:1,
    DefaultInitialJinnDamageWeight: 5,
    FireBallExplosionDuration: 1800,
    MaxTimeForFireBallToCrossField: 4000,
    EnemiesShowUpMarginAroundUpperYAxis: 100,
    // kill values
    MummyKillValuePoints: 2,
    JinnKillValuePoints: 3,
    FireDemonKillValuePoints: 5,

    // options for fire on the ground
    MinCountInflamablesOnField: 3,
    MinDamageCausedToIgnite: 10,
    DefaultNumberNewFiresToAdd: 1,
    BurningRadius: 30,
    MinBurningTime: 2000,
    DefaultFireType: 'fire',
    MaxNumberOfFiresPossible: 20
};
