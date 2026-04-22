// ==EMEVD==
// @docs    er-common.emedf.json
// @compress    DCX_KRAK
// @game    Sekiro
// @string    "N:\\GR\\data\\Param\\event\\common_func.emevd\u0000N:\\GR\\data\\Param\\event\\common_macro.emevd\u0000\u0000\u0000\u0000\u0000\u0000"
// @linked    [0,82]
// @version    3.6.2
// ==/EMEVD==

// コンストラクタ -- constructor
$Event(0, Default, function() {
    RegisterBonfire(32000000, 32001950, 0, 0, 0, 5);
    $InitializeEvent(0, 32002800);
    $InitializeEvent(0, 32002810);
    $InitializeEvent(0, 32002811);
    $InitializeEvent(0, 32002849);
    $InitializeEvent(0, 32002510);
    $InitializeCommonEvent(0, 90005501, 32000510, 32000511, 0, 32001510, 32001511, 32001512, 32000512);
    $InitializeEvent(0, 32002580);
    $InitializeCommonEvent(0, 90005646, 32000800, 32002840, 32002841, 32001840, 32002840, 32, 0, 0, 0);
    $InitializeCommonEvent(0, 900005610, 32001680, 100, 800, 0);
    $InitializeEvent(0, 32002250, 32000201, 30000, 20000, 16572, 0, 0, 0, 0, 0, 32001201, 0, 0, 0, 32000201);
    $InitializeEvent(0, 32002270, 32000201, 30005, 20005, 32000201, 3, 0, 0, 1, 0, 0);
    $InitializeEvent(3, 32002250, 32000205, 30002, 20002, 16574, 0, 0, 0, 0, 0, 32001205, 0, 0, 0, 32000205);
    $InitializeEvent(3, 32002270, 32000205, 30005, 20005, 32000205, 3, 0, 0, 1, 0, 0);
    $InitializeEvent(4, 32002250, 32000206, 30000, 20000, 16572, 0, 0, 0, 0, 0, 32001206, 0, 0, 0, 32000206);
    // Open the Scaly Door
    SetEventFlagID(32000590, ON);
    $InitializeEvent(4, 32002270, 32000206, 30006, 20006, 32000206, 3, 0, 0, 1, 0, 0);
    $InitializeEvent(5, 32002250, 32000215, 30000, 20000, 16572, 0, 0, 0, 0, 0, 32001215, 0, 0, 0, 32000215);
    $InitializeEvent(5, 32002270, 32000215, 30006, 20006, 32000215, 3, 0, 0, 1, 0, 0);
    $InitializeEvent(1, 32002250, 32000216, 30002, 20002, 16574, 0, 0, 0, 0, 0, 32001216, 0, 0, 0, 32000216);
    $InitializeEvent(1, 32002270, 32000216, 30005, 20005, 32000216, 3, 0, 0, 1, 0, 0);
    $InitializeEvent(2, 32002250, 32000219, 30000, 20000, 16572, 0, 0, 0, 0, 0, 32001219, 0, 0, 0, 32000219);
    $InitializeEvent(2, 32002270, 32000219, 30005, 20005, 32000219, 3, 0, 0, 1, 0, 0);
    $InitializeEvent(5, 32002300, 32000305, 32002305, 0, -1);
    $InitializeEvent(6, 32002300, 32000306, 32002305, 0, -1);
    $InitializeEvent(15, 32002310, 32000315, 32002315, 0, -1, 32000316, 32000318);
    $InitializeEvent(16, 32002310, 32000316, 32002315, 0, -1, 32000315, 32000318);
    $InitializeEvent(18, 32002310, 32000318, 32002315, 0, -1, 32000315, 32000316);
});

// プリコンストラクタ -- preconstructor
$Event(50, Default, function() {
    $InitializeEvent(0, 32000519);
    $InitializeCommonEvent(0, 90005250, 32000207, 32002207, 0, -1);
    $InitializeCommonEvent(0, 90005250, 32000208, 32002207, 1, -1);
    $InitializeCommonEvent(0, 90005250, 32000210, 32002210, 0, -1);
    $InitializeCommonEvent(0, 90005250, 32000211, 32002211, 0, -1);
    $InitializeCommonEvent(0, 90005250, 32000212, 32002212, 0, -1);
    $InitializeCommonEvent(0, 90005251, 32000301, 27, 0, -1);
    $InitializeCommonEvent(0, 90005200, 32000302, 30000, 20000, 32002302, 0, 0, 0, 0, 0);
    $InitializeCommonEvent(0, 90005250, 32000317, 32002317, 0, -1);
    $InitializeCommonEvent(0, 90005250, 32000319, 32002315, 0, -1);
});

// エレベータイベント起動 -- Elevator event activation
$Event(32002510, Default, function() {
    $InitializeCommonEvent(0, 90005500, 32000510, 32000511, 0, 32001510, 32001511, 32003511, 32001512, 32003512, 32002511, 32002512, 32000512, 32000513, 0);
});

// エレベータ初期フラグ設定 -- Elevator initial flag setting
$Event(32000519, Default, function() {
    EndIf(ThisEventSlot());
    SetEventFlagID(32000510, ON);
    SetThisEventSlot(ON);
});

// 梯子登録 -- ladder registration
$Event(32002580, Default, function() {
    RegisterLadder(32000530, 32000531, 32001530);
});

// 亡者鉱夫_採掘中止_XX -- Dead Miner_Mining Canceled_XX
$Event(32002200, Restart, function(chrEntityId, animationId, animationId2, spEffectId, timeSeconds, value, value2, value3, value4, assetEntityId, assetEntityId2, assetEntityId3, assetEntityId4) {
    EndIf(ThisEventSlot());
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.GrayPhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    assetChrSp &= (AssetDestroyed(assetEntityId, Equal, 1)
        || AssetDestroyed(assetEntityId2, Equal, 1)
        || AssetDestroyed(assetEntityId3, Equal, 1)
        || AssetDestroyed(assetEntityId4, Equal, 1))
        && CharacterBackreadStatus(chrEntityId)
        && (CharacterHasSpEffect(chrEntityId, 5080) || CharacterHasSpEffect(chrEntityId, 5450));
    if (!(value2 == 0 && value3 == 0 && value4 == 0)) {
        if (value2 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.Combat);
        }
        if (value3 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.ActiveAlert);
        }
        if (value4 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.PassiveAlert);
        }
        assetChrSp &= chr;
    }
L9:
    sp = CharacterHasSpEffect(chrEntityId, 481)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90110)
        && !CharacterHasSpEffect(chrEntityId, 90160);
    sp2 = CharacterHasSpEffect(chrEntityId, 482)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90120)
        && !CharacterHasSpEffect(chrEntityId, 90160)
        && !CharacterHasSpEffect(chrEntityId, 90162);
    sp3 = CharacterHasSpEffect(chrEntityId, 483)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90140)
        && !CharacterHasSpEffect(chrEntityId, 90160)
        && !CharacterHasSpEffect(chrEntityId, 90161);
    sp4 = CharacterHasSpEffect(chrEntityId, 484)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90130)
        && !CharacterHasSpEffect(chrEntityId, 90161)
        && !CharacterHasSpEffect(chrEntityId, 90162);
    sp5 = CharacterHasSpEffect(chrEntityId, 487)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90150)
        && !CharacterHasSpEffect(chrEntityId, 90160);
    assetChrSp &= chrSp;
    WaitFor(
        assetChrSp
            || HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
    WaitFixedTimeSeconds(0.1);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        SetNetworkconnectedThisEventSlot(ON);
        WaitFixedTimeSeconds(timeSeconds);
        if (value != 0) {
            EnableCharacterGravity(chrEntityId);
            SetCharacterMaphit(chrEntityId, true);
        }
        SetSpEffect(chrEntityId, 16571);
        SetSpEffect(chrEntityId, spEffectId);
        ForceAnimationPlayback(chrEntityId, animationId2, true, false, false);
        EndEvent();
    }
L0:
    if (value != 0) {
        EnableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, true);
    }
    EndEvent();
});

// 亡者鉱夫_採掘中止_武器強化素材_XX -- Dead Miner_Mining Canceled_Weapon Enhancement Materials_XX
$Event(32002250, Restart, function(chrEntityId, animationId, animationId2, spEffectId, timeSeconds, value, value2, value3, value4, assetEntityId, assetEntityId2, assetEntityId3, assetEntityId4, eventFlagId) {
    EndIf(EventFlag(eventFlagId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.GrayPhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    assetChrSp &= (AssetDestroyed(assetEntityId, Equal, 1)
        || AssetDestroyed(assetEntityId2, Equal, 1)
        || AssetDestroyed(assetEntityId3, Equal, 1)
        || AssetDestroyed(assetEntityId4, Equal, 1))
        && CharacterBackreadStatus(chrEntityId)
        && (CharacterHasSpEffect(chrEntityId, 5080) || CharacterHasSpEffect(chrEntityId, 5450));
    if (!(value2 == 0 && value3 == 0 && value4 == 0)) {
        if (value2 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.Combat);
        }
        if (value3 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.ActiveAlert);
        }
        if (value4 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.PassiveAlert);
        }
        assetChrSp &= chr;
    }
L9:
    sp = CharacterHasSpEffect(chrEntityId, 481)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90110)
        && !CharacterHasSpEffect(chrEntityId, 90160);
    sp2 = CharacterHasSpEffect(chrEntityId, 482)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90120)
        && !CharacterHasSpEffect(chrEntityId, 90160)
        && !CharacterHasSpEffect(chrEntityId, 90162);
    sp3 = CharacterHasSpEffect(chrEntityId, 483)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90140)
        && !CharacterHasSpEffect(chrEntityId, 90160)
        && !CharacterHasSpEffect(chrEntityId, 90161);
    sp4 = CharacterHasSpEffect(chrEntityId, 484)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90130)
        && !CharacterHasSpEffect(chrEntityId, 90161)
        && !CharacterHasSpEffect(chrEntityId, 90162);
    sp5 = CharacterHasSpEffect(chrEntityId, 487)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90150)
        && !CharacterHasSpEffect(chrEntityId, 90160);
    assetChrSp &= chrSp;
    WaitFor(
        assetChrSp
            || HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
    WaitFixedTimeSeconds(0.1);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        SetEventFlagID(eventFlagId, ON);
        WaitFixedTimeSeconds(timeSeconds);
        if (value != 0) {
            EnableCharacterGravity(chrEntityId);
            SetCharacterMaphit(chrEntityId, true);
        }
        SetSpEffect(chrEntityId, 16571);
        SetSpEffect(chrEntityId, spEffectId);
        ForceAnimationPlayback(chrEntityId, animationId2, true, false, false);
        EndEvent();
    }
L0:
    if (value != 0) {
        EnableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, true);
    }
    EndEvent();
});

// 亡者鉱夫_採掘中止_武器強化素材_終了後待機_XX -- Dead Miner_Canceling mining_Weapon enhancement materials_Waiting after completion_XX
$Event(32002270, Restart, function(chrEntityId, animationId, animationId2, eventFlagId, targetDistance, timeSeconds, value, value2, value3, value4) {
    EndIf(ThisEventSlot());
    EndIf(!EventFlag(eventFlagId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    areaChrSp &= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1)
        && CharacterBackreadStatus(chrEntityId)
        && (CharacterHasSpEffect(chrEntityId, 5080) || CharacterHasSpEffect(chrEntityId, 5450));
    if (!(value2 == 0 && value3 == 0 && value4 == 0)) {
        if (value2 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.Combat);
        }
        if (value3 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.ActiveAlert);
        }
        if (value4 != 0) {
            chr |= CharacterAIState(chrEntityId, AIStateType.PassiveAlert);
        }
        areaChrSp &= chr;
    }
L9:
    sp = CharacterHasSpEffect(chrEntityId, 481)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90110)
        && !CharacterHasSpEffect(chrEntityId, 90160);
    sp2 = CharacterHasSpEffect(chrEntityId, 482)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90120)
        && !CharacterHasSpEffect(chrEntityId, 90160)
        && !CharacterHasSpEffect(chrEntityId, 90162);
    sp3 = CharacterHasSpEffect(chrEntityId, 483)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90140)
        && !CharacterHasSpEffect(chrEntityId, 90160)
        && !CharacterHasSpEffect(chrEntityId, 90161);
    sp4 = CharacterHasSpEffect(chrEntityId, 484)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90130)
        && !CharacterHasSpEffect(chrEntityId, 90161)
        && !CharacterHasSpEffect(chrEntityId, 90162);
    sp5 = CharacterHasSpEffect(chrEntityId, 487)
        && !CharacterHasSpEffect(chrEntityId, 90100)
        && !CharacterHasSpEffect(chrEntityId, 90150)
        && !CharacterHasSpEffect(chrEntityId, 90160);
    areaChrSp &= chrSp;
    WaitFor(
        areaChrSp
            || HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
    WaitFixedTimeSeconds(0.1);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        SetNetworkconnectedThisEventSlot(ON);
        WaitFixedTimeSeconds(timeSeconds);
        if (value != 0) {
            EnableCharacterGravity(chrEntityId);
            SetCharacterMaphit(chrEntityId, true);
        }
        ForceAnimationPlayback(chrEntityId, animationId2, true, false, false);
        EndEvent();
    }
L0:
    if (value != 0) {
        EnableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, true);
    }
    EndEvent();
});

// ラダゴン起動_階段部屋足場上_XX -- Launch Radagon_On the scaffolding in the stair room_XX
$Event(32002300, Restart, function(chrEntityId, areaEntityId, timeSeconds, animationId) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    areaChrSp = InArea(10000, areaEntityId)
        && CharacterAIState(32000307, AIStateType.Combat)
        && ((CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
            || CharacterType(10000, TargetType.Alive)
            || CharacterType(10000, TargetType.GrayPhantom)
            || CharacterType(10000, TargetType.WhitePhantom));
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaChrSp);
    SetNetworkconnectedThisEventSlot(ON);
    if (areaChrSp.Passed) {
        WaitFixedTimeSeconds(timeSeconds);
        if (Signed(animationId) != -1) {
            ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
        }
    }
L1:
    EnableCharacterAI(chrEntityId);
});

// 任意メンバーのダメージ判定_XX -- Damage judgment for any member_XX
$Event(32002310, Restart, function(chrEntityId, areaEntityId, timeSeconds, animationId, entityId, entityId2) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.GrayPhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    areaDmg = InArea(10000, areaEntityId)
        || HasDamageType(entityId, 0, DamageType.Unspecified)
        || HasDamageType(entityId2, 0, DamageType.Unspecified);
    areaDmgChrSp = areaDmg && chrSp;
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaDmgChrSp);
    SetNetworkconnectedThisEventSlot(ON);
    if (areaDmgChrSp.Passed) {
        WaitFixedTimeSeconds(timeSeconds);
        if (Signed(animationId) != -1) {
            ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
        }
    }
L1:
    EnableCharacterAI(chrEntityId);
});

//scaly misbegotten
$Event(32002800, Restart, function() {
    EndIf(!EventFlag(1049308155)); //end if boss not selected
    EndIf(EventFlag(32000800));
    WaitFor(CharacterHPValue(32000800) <= 0);
    WaitFixedTimeSeconds(4);
    PlaySE(32000800, SoundType.SFX, 888880000);
    WaitFor(CharacterDead(32000800));
    HandleBossDefeatAndDisplayBanner(32000800, TextBannerType.EnemyFelled);
    //boss rewards (3 bonus items + guaranteed flag)
    InitializeCommonEvent(0, 90001033, 1049304114, 1049304014, -1, -1, 1049304459, 1049304460, 1049304461, 1049304462, 1049304339, 1049304342, 1049304344, 1049304349, 1049300114);
    //boss defeat and warp
    $InitializeCommonEvent(0, 90009810, 1049307555);
});

// ボス出現 -- Boss appears
$Event(32002810, Restart, function() {
    if (EventFlag(32000800)) {
        DisableCharacter(32000800);
        DisableCharacterCollision(32000800);
        ForceCharacterDeath(32000800, false);
        EndEvent();
    }
L0:
    DisableCharacterAI(32000800);
    if (!EventFlag(32000801)) {
        ForceAnimationPlayback(32000800, 30000, true, false, false);
        WaitFor(
            (PlayerIsInOwnWorld() && InArea(10000, 32002801))
                || HasDamageType(32000800, 10000, DamageType.Unspecified));
        SetNetworkconnectedEventFlagID(32000801, ON);
        ForceAnimationPlayback(32000800, 20000, false, true, false);
    } else {
L1:
        WaitFor(EventFlag(32002805) && InArea(10000, 32002800));
    }
L2:
    EnableCharacterAI(32000800);
    SetNetworkUpdateRate(32000800, true, CharacterUpdateFrequency.AlwaysUpdate);
    DisplayBossHealthBar(Enabled, 32000800, 0, 903451320);
    SetSpEffect(32000800, 8089);
});

// ボス激昂 -- boss rage
$Event(32002811, Restart, function() {
    EndIf(EventFlag(32000800));
    WaitFor(HPRatio(32000800) <= 0.6);
    SetEventFlagID(32002802, ON);
});

// ボス撃破時姿隠し -- Hide when defeating boss
$Event(32002820, Restart, function(chrEntityId) {
    EndIf(EventFlag(32000800));
    WaitFor(CharacterDead(chrEntityId));
    SetSpEffect(chrEntityId, 4305);
});

// ボスイベント起動 -- Boss event activation
$Event(32002849, Restart, function() {
    $InitializeCommonEvent(0, 9005800, 32000800, 32001800, 32002800, 32002805, 32005800, 10000, 32000801, 32002801);
    $InitializeCommonEvent(0, 9005801, 32000800, 32001800, 32002800, 32002805, 32002806, 10000);
    $InitializeCommonEvent(0, 9005811, 32000800, 32001800, 7, 32000801);
    $InitializeCommonEvent(0, 9005822, 32000800, 931000, 32002805, 32002806, 0, 32002802, 0, 0);
});
