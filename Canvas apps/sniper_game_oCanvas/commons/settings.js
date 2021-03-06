var Settings = {

    General: {
        RotationAngleAdjustment: 90,
        PlayFieldLength: 600,
        PlayFieldWidth: 1400,
        DefaultSpriteDuration: 60,
        GraveDisplayTimeDuration: 6000,
        MinModelCoordinateValue: 15,
        ClickOnPlayerBugFixValue: 10,
        DefaultPlayerAudioVolume: 0.4,
        DefaultGameSoundsAudioVolume: 0.2,
        DefaultBgVideoUrlPrefix: 'https://www.youtube.com/embed/',
        DefaultBgVideoUrlOptionsSuffix: '?autoplay=1&controls=0&frameborder=0&cc_load_policy=0&enablejsapi=1&iv_load_policy=3&modestbranding=1&rel=0',
        DefaultBgVideoQuality: 'small' /*'tiny'*/,
        InitialBgVideoUrl: 'https://www.youtube.com/watch?v=yThwXoBYYP8?controls=0&autoplay=1&frameborder=0&cc_load_policy=0&enablejsapi=1&iv_load_policy=3&modestbranding=1&rel=0&vq=tiny'
    },

    Gameplay: {
        MinDeathsNeededForMegadeath: 3,
    },

    GamePerformance: {
        TravelDirectionRefreshTime: 2000,
        DetectBlastDamageRefreshTime: 100,
        DetectPlayerCollisionRefreshTime: 100,
        DetectFireIgnitionRefreshTime: 3000,
        DetectStaticObjectsCollisionRefreshTime: 150,
        UpdatePlayDurationInterval: 5000,

        Constraints: {
            MaxNumberFireBallsAllowed: 5,
            MaxNumberOfJinnsAllowed: 6,
            MaxPossibleNumberOfEnemies: 10,
            MaxLoopingObjectsAllowedToDisplayBackground: 12,
            MaxStaticItemsAllowed: 5,

        }
    },

    Player: {
        PlayerInitialHealth: 100,
        PlayerInitialGunShellsCount: 50,
        MaxTimeForPlayerToCrossField: 11 * 1000,
        DefaultSpeedSensitivity: 10,
        MaxTimeForRocketToCrossField: 2500,
        RocketExplosionDuration: 2000,
        DefaultExplosionDamageArea: 30,
        DefaultExplosionDamageWeight: 4,
        PlayerCollisionTolerance: 27,
        MaxCountShotsAtATime: 5
    },

    Enemies: {
        Mummy: 'mummy',
        Jinn: 'jinn',
        FireDemon: 'fire_demon',

        SpeedOptions: {
            MummyTimeToCrossField: 70 * 1000,
            JinnTimeToCrossField: 55 * 1000,
            FireTimeToCrossField: 85 * 1000,
            FireDemonTimeToCrossField: 60 * 1000,
            FireDemonMinTimeToCrossField: 20 * 1000,
            DefaultEnemyTimeToCrossField: 50 * 1000,
            MaxTimeForFireBallToCrossField: 5 * 1000
        },

        Positioning: {
            DefaultRadius: 350,
            RadiusMummiesDestinationAroundPlayer: 150,
            RadiusJinnsDestinationAroundPlace: 700,
            JinnsAboutPlace: {
                x: 300,
                y: 300
            },
            JinnsShotAroundPlace: 220
        },

        JinnsShootingAttemptFrequency: 13 * 1000,
        JinnsShootingChance: 0.05,

        FireDemonRunAcceleration: 1.5,
        DefaultInitialEnemyHealth: 100,
        FireBallExplosionDuration: 1900,

        Damage: {
            InitialMummyDamageWeight: 2,
            InitialFireDemonDamageWeight: 4,
            InitialFireDamageWeight: 8,
            InitialJinnDamageWeight: 5,
            InitialFireballDamageWeight: 6
        },

        RandomAppearance: {
            Counts: {
                MaxMummies: 4,
                MaxJinns: 2,
                MaxDemons: 2
            },
            InitialFrequency: 12 * 1000
        },

        KillValues: {
            MummyKillValuePoints: 2,
            JinnKillValuePoints: 4,
            FireDemonKillValuePoints: 5
        }
    },

    // static items
    StaticItems: {
        FirstAidKitHealValue: 20,
        AmmoGunShellsValue: 20,
        AmmoBagGunShellsValue: 50,
        SilverShieldProtection: 20 / 100,
        GoldenShieldProtection: 50 / 100,
        ShieldProtectionDuration: 30 * 1000,
        MaxTimeForStaticItemOnField: 30 * 1000,
        IceFreezeTime: 15 * 1000,

        RandomAppearance: {
            Counts: {
                MaxHealthKits: 3,
                MaxAmmoKits: 4,
                MaxAmmoBags: 2,
                MaxSilverArmours: 2,
                MaxGoldenArmours: 2,
                MaxIceBlocks: 3
            },
            Frequency: {
                InitialFrequency: 45 * 1000,
                TimeoutInterval: 20 * 1000
            }
        }
    },

    // options for fire on the ground
    FireOptions: {
        MinCountInflamablesOnField: 4,
        MinDamageCausedToIgnite: 15,
        DefaultNumberNewFiresToAdd: 1,
        BurningRadius: 40,
        MinBurningTime: 1500,
        DefaultFireType: 'fire',
        MaxNumberOfFiresPossible: 20
    }
};
