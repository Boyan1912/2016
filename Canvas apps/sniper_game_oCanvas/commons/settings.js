var Settings = {
    // general:
    RotationAngleAdjustment: 90,
    PlayFieldLength: 1000,
    PlayFieldWidth: 1800,
    DefaultSpriteDuration: 60,
    PointsNeededForNextStage: 120,
    GraveDisplayTimeDuration: 4500,
    MinModelCoordinateValue: 15,
    ClickOnPlayerBugFixValue: 10,
    DefaultPlayerAudioVolume: 0.6,

    //gameplay
    MinDeathsNeededForMegadeath: 3,
    BonusForMegadeath: 10,


    // game performance:
    TravelDirectionRefreshTime: 2000,
    DetectBlastDamageRefreshTime: 100,
    DetectPlayerCollisionRefreshTime: 100,
    DetectFireIgnitionRefreshTime: 2500,
    DetectStaticObjectsCollisionRefreshTime: 200,

    // player:
    PlayerInitialHealth: 100,
    PlayerInitialGunShellsCount: 50,
    MaxTimeForPlayerToCrossField: 9000,
    DefaultSpeedSensitivity: 10,
    MaxTimeForRocketToCrossField: 2500,
    RocketExplosionDuration: 3000,
    DefaultExplosionDamageArea: 30,
    DefaultExplosionDamageWeight: 3,
    PlayerCollisionTolerance: 30,
    MaxCountShotsAtATime: 4,

    // enemies:
    InitialEnemyType: 'mummy',
    SecondaryEnemyType: 'jinn',
    ThirtiaryEnemyType: 'fire_demon',
    MummyTimeToCrossField: 70 * 1000,
    JinnTimeToCrossField: 35 * 1000,
    FireTimeToCrossField: 85 * 1000,
    FireDemonTimeToCrossField: 50 * 1000,
    FireDemonMinTimeToCrossField: 8 * 1000,
    DefaultEnemyTimeToCrossField: 35 * 1000,
    FireDemonRunAcceleration: 2,
    InitialEnemiesCount: 2,
    DefaultRadius: 350,
    RadiusMummiesDestinationAroundPlayer: 350,
    RadiusJinnsDestinationAroundPlace: 700,
    JinnsAboutPlace: {
        x: 200,
        y: 400
    },
    JinnsShotAroundPlace: 90,
    JinnsShootingChance: 0.3,
    JinnsShootingAttemptFrequency: 4000,
    DefaultInitialEnemyHealth: 100,
    DefaultInitialMummyDamageWeight: 2,
    InitialFireDemonDamageWeight: 4,
    InitialFireDamageWeight: 10,
    DefaultInitialJinnDamageWeight: 5,
    FireBallExplosionDuration: 1900,
    MaxTimeForFireBallToCrossField: 4000,
    EnemiesShowUpMarginAroundUpperYAxis: 100,
    // kill values
    MummyKillValuePoints: 2,
    JinnKillValuePoints: 4,
    FireDemonKillValuePoints: 5,

    // static items
    FirstAidKitHealValue: 20,
    AmmoGunShellsValue: 20,
    AmmoBagGunShellsValue: 50,

    // options for fire on the ground
    MinCountInflamablesOnField: 3,
    MinDamageCausedToIgnite: 10,
    DefaultNumberNewFiresToAdd: 1,
    BurningRadius: 40,
    MinBurningTime: 2000,
    DefaultFireType: 'fire',
    MaxNumberOfFiresPossible: 20
};
