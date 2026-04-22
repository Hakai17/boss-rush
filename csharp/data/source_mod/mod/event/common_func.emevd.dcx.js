// ==EMEVD==
// @docs    er-common.emedf.json
// @compress    DCX_KRAK
// @game    Sekiro
// @string    ""
// @linked    []
// @version    3.6.2
// ==/EMEVD==

//custom boss rush scripts
//custom boss rush slot 1
$Event(90009910, Default, function() {
    DisplayBlinkingMessage(2081024); //remove this line if you use this slot
    BatchSetEventFlags(1049308250, 1049308275, OFF); //remove this line if you use this slot
    SetEventFlagID(1049300060, OFF); //remove this line if you use this slot
});

//custom boss rush slot 2
$Event(90009911, Default, function() {
    DisplayBlinkingMessage(2081024); //remove this line if you use this slot
    BatchSetEventFlags(1049308250, 1049308275, OFF); //remove this line if you use this slot
    SetEventFlagID(1049300060, OFF); //remove this line if you use this slot
});

//custom boss rush slot 3
$Event(90009912, Default, function() {
    DisplayBlinkingMessage(2081024); //remove this line if you use this slot
    BatchSetEventFlags(1049308250, 1049308275, OFF); //remove this line if you use this slot
    SetEventFlagID(1049300060, OFF); //remove this line if you use this slot
});

//custom boss rush slot 4
$Event(90009913, Default, function() {
    DisplayBlinkingMessage(2081024); //remove this line if you use this slot
    BatchSetEventFlags(1049308250, 1049308275, OFF); //remove this line if you use this slot
    SetEventFlagID(1049300060, OFF); //remove this line if you use this slot
});

//custom boss rush slot 5
$Event(90009914, Default, function() {
    DisplayBlinkingMessage(2081024); //remove this line if you use this slot
    BatchSetEventFlags(1049308250, 1049308275, OFF); //remove this line if you use this slot
    SetEventFlagID(1049300060, OFF); //remove this line if you use this slot
});

//random modes
//random - all bosses
$Event(90009831, Default, function() {
    if (AllBatchEventFlags(1049307400, 1049307412) && AllBatchEventFlags(1049307415, 1049307608) && EventFlag(6951)
        || AllBatchEventFlags(1049307400, 1049307412) && AllBatchEventFlags(1049307415, 1049307566) && !EventFlag(6951)
        || EventFlag(1049302264)) { //if all bosses in pool defeated
        SetEventFlagID(1049300060, OFF); //sequential mode off
        SetEventFlagID(1049302264, OFF); //timeout trigger off
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(1049300004);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(1049300005);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (!EventFlag(1049302263)) //if timeout event is not running
        $InitializeCommonEvent(0, 90009990); //start time limit
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    if (EventFlag(6951)) //if dlc is installed
        RandomlySetEventFlagInRange(1049302000, 1049302208, ON);
    else
        RandomlySetEventFlagInRange(1049302000, 1049302166, ON);
    //exclusions start
    if (EventFlag(99999999) //exclude bosses by replacing 99999999 with their warp flags
    || EventFlag(99999999)
    || EventFlag(99999999)
    || EventFlag(1049302013) //radagon only
    || EventFlag(1049302014)) //elden beast only
    //exclusions end
        RestartEvent();
    if (EventFlag(1049300056)) { //if sequential mode
        BatchSetEventFlags(1049302640, 1049302653, OFF); //reset filter flags
        SetEventFlagID(1049302262, OFF); //reset restart signal
        $InitializeCommonEvent(0, 90009970);
        $InitializeCommonEvent(0, 90009971);
        $InitializeCommonEvent(0, 90009972);
        $InitializeCommonEvent(0, 90009973);
        $InitializeCommonEvent(0, 90009974);
        $InitializeCommonEvent(0, 90009975);
        $InitializeCommonEvent(0, 90009976);
        $InitializeCommonEvent(0, 90009977);
        $InitializeCommonEvent(0, 90009978);
        $InitializeCommonEvent(0, 90009979);
        $InitializeCommonEvent(0, 90009980);
        $InitializeCommonEvent(0, 90009981);
        $InitializeCommonEvent(0, 90009982);
        $InitializeCommonEvent(0, 90009983);
        WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302640, 1049302653)); //wait for restart signal or all filter events to finish
        if (EventFlag(1049302262)) { //if restart signal
            SetEventFlagID(1049302262, OFF);
            RestartEvent();
        }
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//random - remembrance bosses (base game)
$Event(90009832, Default, function() {
    if (AllBatchEventFlags(1049307400, 1049307412) && AllBatchEventFlags(1049307415, 1049307416)
    || EventFlag(1049302264)) { //if all bosses in pool defeated
        SetEventFlagID(1049300060, OFF); //sequential mode off
        SetEventFlagID(1049302264, OFF); //timeout trigger off
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(1049300004);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(1049300005);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (!EventFlag(1049302263)) //if timeout event is not running
        $InitializeCommonEvent(0, 90009990); //start time limit
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302000, 1049302016, ON);
    //exclusions start
    if (EventFlag(99999999) //exclude bosses by replacing 99999999 with their warp flags
    || EventFlag(99999999)
    || EventFlag(99999999)
    || EventFlag(1049302013) //radagon only
    || EventFlag(1049302014)) //elden beast only
    //exclusions end
        RestartEvent();
    if (EventFlag(1049300056)) { //if sequential mode
        BatchSetEventFlags(1049302640, 1049302653, OFF); //reset filter flags
        SetEventFlagID(1049302262, OFF); //reset restart signal
        $InitializeCommonEvent(0, 90009970);
        $InitializeCommonEvent(0, 90009971);
        WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302640, 1049302641)); //wait for restart signal or all filter events to finish
        if (EventFlag(1049302262)) { //if restart signal
            SetEventFlagID(1049302262, OFF);
            RestartEvent();
        }
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//random - great enemies (base game)
$Event(90009833, Default, function() {
    if (AllBatchEventFlags(1049307417, 1049307449) || EventFlag(1049302264)) { //if all bosses in pool defeated
        SetEventFlagID(1049300060, OFF); //sequential mode off
        SetEventFlagID(1049302264, OFF); //timeout trigger off
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(1049300004);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(1049300005);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (!EventFlag(1049302263)) //if timeout event is not running
        $InitializeCommonEvent(0, 90009990); //start time limit
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302017, 1049302049, ON);
    //exclusions start
    if (EventFlag(99999999) //exclude bosses by replacing 99999999 with their warp flags
    || EventFlag(99999999) 
    || EventFlag(99999999))
    //exclusions end
        RestartEvent();
    if (EventFlag(1049300056)) { //if sequential mode
        BatchSetEventFlags(1049302640, 1049302653, OFF); //reset filter flags
        SetEventFlagID(1049302262, OFF); //reset restart signal
        $InitializeCommonEvent(0, 90009971);
        $InitializeCommonEvent(0, 90009972);
        $InitializeCommonEvent(0, 90009973);
        WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302641, 1049302643)); //wait for restart signal or all filter events to finish
        if (EventFlag(1049302262)) { //if restart signal
            SetEventFlagID(1049302262, OFF);
            RestartEvent();
        }
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//random - minor bosses (base game)
$Event(90009834, Default, function() {
    if (AllBatchEventFlags(1049307450, 1049307566) || EventFlag(1049302264)) { //if all bosses in pool defeated
        SetEventFlagID(1049300060, OFF); //sequential mode off
        SetEventFlagID(1049302264, OFF); //timeout trigger off
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(1049300004);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(1049300005);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (!EventFlag(1049302263)) //if timeout event is not running
        $InitializeCommonEvent(0, 90009990); //start time limit
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302050, 1049302166, ON);
    //exclusions start
    if (EventFlag(99999999) //exclude bosses by replacing 99999999 with their warp flags
    || EventFlag(99999999) 
    || EventFlag(99999999))
    //exclusions end
        RestartEvent();
    if (EventFlag(1049300056)) { //if sequential mode
        BatchSetEventFlags(1049302640, 1049302653, OFF); //reset filter flags
        SetEventFlagID(1049302262, OFF); //reset restart signal
        $InitializeCommonEvent(0, 90009973);
        $InitializeCommonEvent(0, 90009974);
        $InitializeCommonEvent(0, 90009975);
        $InitializeCommonEvent(0, 90009976);
        $InitializeCommonEvent(0, 90009977);
        $InitializeCommonEvent(0, 90009978);
        $InitializeCommonEvent(0, 90009979);
        $InitializeCommonEvent(0, 90009980);
        $InitializeCommonEvent(0, 90009981);
        WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302643, 1049302651)); //wait for restart signal or all filter events to finish
        if (EventFlag(1049302262)) { //if restart signal
            SetEventFlagID(1049302262, OFF);
            RestartEvent();
        }
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//random - dlc main bosses
$Event(90009835, Default, function() {
    if (AllBatchEventFlags(1049307567, 1049307578) || EventFlag(1049302264)) { //if all bosses in pool defeated
        SetEventFlagID(1049300060, OFF); //sequential mode off
        SetEventFlagID(1049302264, OFF); //timeout trigger off
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(1049300004);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(1049300005);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (!EventFlag(1049302263)) //if timeout event is not running
        $InitializeCommonEvent(0, 90009990); //start time limit
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302167, 1049302178, ON);
    //exclusions start
    if (EventFlag(99999999) //exclude bosses by replacing 99999999 with their warp flags
    || EventFlag(99999999) 
    || EventFlag(99999999))
    //exclusions end
        RestartEvent();
    if (EventFlag(1049300056)) { //if sequential mode
        BatchSetEventFlags(1049302640, 1049302653, OFF); //reset filter flags
        SetEventFlagID(1049302262, OFF); //reset restart signal
        $InitializeCommonEvent(0, 90009981);
        WaitFor(EventFlag(1049302262) || EventFlag(1049302651)); //wait for restart signal or all filter events to finish
        if (EventFlag(1049302262)) { //if restart signal
            SetEventFlagID(1049302262, OFF);
            RestartEvent();
        }
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//random - dlc minor bosses
$Event(90009836, Default, function() {
    if (AllBatchEventFlags(1049307579, 1049307608) || EventFlag(1049302264)) { //if all bosses in pool defeated
        SetEventFlagID(1049300060, OFF); //sequential mode off
        SetEventFlagID(1049302264, OFF); //timeout trigger off
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(1049300004);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(1049300005);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (!EventFlag(1049302263)) //if timeout event is not running
        $InitializeCommonEvent(0, 90009990); //start time limit
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302179, 1049302208, ON);
    //exclusions start
    if (EventFlag(99999999) //exclude bosses by replacing 99999999 with their warp flags
    || EventFlag(99999999) 
    || EventFlag(99999999))
    //exclusions end
        RestartEvent();
    if (EventFlag(1049300056)) { //if sequential mode
        BatchSetEventFlags(1049302640, 1049302653, OFF); //reset filter flags
        SetEventFlagID(1049302262, OFF); //reset restart signal
        $InitializeCommonEvent(0, 90009981);
        $InitializeCommonEvent(0, 90009982);
        $InitializeCommonEvent(0, 90009983);
        WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302651, 1049302653)); //wait for restart signal or all filter events to finish
        if (EventFlag(1049302262)) { //if restart signal
            SetEventFlagID(1049302262, OFF);
            RestartEvent();
        }
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//30 second time limit for rando sequential
$Event(90009990, Default, function() {
    SetEventFlagID(1049302263, ON); //rando timeout event is running
    WaitFixedTimeSeconds(30);
    SetEventFlagID(1049302264, ON); //timeout trigger
    SetEventFlagID(1049302263, OFF);
});

//boss rush: remembrance + dlc main bosses
$Event(90009900, Default, function() {
    //Godrick the Grafted
    if (EventFlag(1049307399)) { //fixed flag to signal first boss in sequence
        SetEventFlagID(1049302000, ON); //godrick warp flag
    //Rennala, Queen of the Full Moon
    } else if (EventFlag(1049307400)) { //previous boss (godrick) defeat flag
        SetEventFlagID(1049302001, ON); //rennala warp flag
    //Regal Ancestor Spirit
    } else if (EventFlag(1049307401)) { //previous boss (rennala) defeat flag
        SetEventFlagID(1049302002, ON); //regal ancestor warp flag
    //Starscourge Radahn
    } else if (EventFlag(1049307402)) { //previous boss (regal ancestor) defeat flag
        SetEventFlagID(1049302003, ON); //radahn warp flag
    //Astel, Naturalborn of the Void
    } else if (EventFlag(1049307403)) { //etc
        SetEventFlagID(1049302004, ON);
    //Lichdragon Fortissax
    } else if (EventFlag(1049307404)) {
        SetEventFlagID(1049302005, ON);
    //Morgott, the Omen King
    } else if (EventFlag(1049307405)) {
        SetEventFlagID(1049302006, ON);
    //Rykard, Lord of Blasphemy
    } else if (EventFlag(1049307406)) {
        SetEventFlagID(1049302007, ON);
    //Fire Giant
    } else if (EventFlag(1049307407)) {
        SetEventFlagID(1049302008, ON);
    //Beast Clergyman / Maliketh
    } else if (EventFlag(1049307408)) {
        SetEventFlagID(1049302009, ON);
    //Godfrey / Hoarah Loux
    } else if (EventFlag(1049307409)) {
        SetEventFlagID(1049302010, ON);
    //Dragonlord Placidusax
    } else if (EventFlag(1049307410)) {
        SetEventFlagID(1049302011, ON);
    //Radagon / Elden Beast
    } else if (EventFlag(1049307411)) {
        SetEventFlagID(1049302012, ON);
    //Mohg, Lord of Blood
    } else if (EventFlag(1049307412)) {
        SetEventFlagID(1049302015, ON);
    //Malenia, Blade of Miquella
    } else if (EventFlag(1049307415)) {
        SetEventFlagID(1049302016, ON);
    //Divine Beast Dancing Lion
    } else if (EventFlag(1049307416)) {
        SetEventFlagID(1049302167, ON);
    //Rellana, Twin Moon Knight
    } else if (EventFlag(1049307567)) {
        SetEventFlagID(1049302168, ON);
    //Golden Hippopotamus
    } else if (EventFlag(1049307568)) {
        SetEventFlagID(1049302169, ON);
    //Putrescent Knight
    } else if (EventFlag(1049307569)) {
        SetEventFlagID(1049302170, ON);
    //Scadutree Avatar
    } else if (EventFlag(1049307570)) {
        SetEventFlagID(1049302171, ON);
    //Commander Gaius
    } else if (EventFlag(1049307571)) {
        SetEventFlagID(1049302172, ON);
    //Messmer the Impaler
    } else if (EventFlag(1049307572)) {
        SetEventFlagID(1049302173, ON);
    //Midra, Lord of Frenzied Flame
    } else if (EventFlag(1049307573)) {
        SetEventFlagID(1049302175, ON);
    //Romina, Saint of the Bud
    } else if (EventFlag(1049307575)) {
        SetEventFlagID(1049302176, ON);
    //Metyr, Mother of Fingers
    } else if (EventFlag(1049307576)) {
        SetEventFlagID(1049302174, ON);
    //Radahn, Consort of Miquella
    } else if (EventFlag(1049307574)) {
        SetEventFlagID(1049302177, ON);
    //Bayle the Dread
    } else if (EventFlag(1049307577)) {
        SetEventFlagID(1049302178, ON);
    } else {
        //if no matches found, sequence end has been reached, warp to roundtable
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801); //to boss selector and warp events
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//boss rush: remembrance bosses (base game only)
$Event(90009901, Default, function() {
    //Godrick the Grafted
    if (EventFlag(1049307399)) {
        SetEventFlagID(1049302000, ON);
    //Rennala, Queen of the Full Moon
    } else if (EventFlag(1049307400)) {
        SetEventFlagID(1049302001, ON);
    //Regal Ancestor Spirit
    } else if (EventFlag(1049307401)) {
        SetEventFlagID(1049302002, ON);
    //Starscourge Radahn
    } else if (EventFlag(1049307402)) {
        SetEventFlagID(1049302003, ON);
    //Astel, Naturalborn of the Void
    } else if (EventFlag(1049307403)) {
        SetEventFlagID(1049302004, ON);
    //Lichdragon Fortissax
    } else if (EventFlag(1049307404)) {
        SetEventFlagID(1049302005, ON);
    //Morgott, the Omen King
    } else if (EventFlag(1049307405)) {
        SetEventFlagID(1049302006, ON);
    //Rykard, Lord of Blasphemy
    } else if (EventFlag(1049307406)) {
        SetEventFlagID(1049302007, ON);
    //Fire Giant
    } else if (EventFlag(1049307407)) {
        SetEventFlagID(1049302008, ON);
    //Beast Clergyman / Maliketh
    } else if (EventFlag(1049307408)) {
        SetEventFlagID(1049302009, ON);
    //Godfrey / Hoarah Loux
    } else if (EventFlag(1049307409)) {
        SetEventFlagID(1049302010, ON);
    //Dragonlord Placidusax
    } else if (EventFlag(1049307410)) {
        SetEventFlagID(1049302011, ON);
    //Radagon / Elden Beast
    } else if (EventFlag(1049307411)) {
        SetEventFlagID(1049302012, ON);
    //Mohg, Lord of Blood
    } else if (EventFlag(1049307412)) {
        SetEventFlagID(1049302015, ON);
    //Malenia, Blade of Miquella
    } else if (EventFlag(1049307415)) {
        SetEventFlagID(1049302016, ON);
    } else {
        //if no matches found, sequence end has been reached, warp to roundtable
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801); //to boss selector and warp events
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//boss rush: dlc main bosses
$Event(90009902, Default, function() {
    //Divine Beast Dancing Lion
    if (EventFlag(1049307399)) {
        SetEventFlagID(1049302167, ON);
    //Rellana, Twin Moon Knight
    } else if (EventFlag(1049307567)) {
        SetEventFlagID(1049302168, ON);
    //Golden Hippopotamus
    } else if (EventFlag(1049307568)) {
        SetEventFlagID(1049302169, ON);
    //Putrescent Knight
    } else if (EventFlag(1049307569)) {
        SetEventFlagID(1049302170, ON);
    //Scadutree Avatar
    } else if (EventFlag(1049307570)) {
        SetEventFlagID(1049302171, ON);
    //Commander Gaius
    } else if (EventFlag(1049307571)) {
        SetEventFlagID(1049302172, ON);
    //Messmer the Impaler
    } else if (EventFlag(1049307572)) {
        SetEventFlagID(1049302173, ON);
    //Midra, Lord of Frenzied Flame
    } else if (EventFlag(1049307573)) {
        SetEventFlagID(1049302175, ON);
    //Romina, Saint of the Bud
    } else if (EventFlag(1049307575)) {
        SetEventFlagID(1049302176, ON);
    //Metyr, Mother of Fingers
    } else if (EventFlag(1049307576)) {
        SetEventFlagID(1049302174, ON);
    //Radahn, Consort of Miquella
    } else if (EventFlag(1049307574)) {
        SetEventFlagID(1049302177, ON);
    //Bayle the Dread
    } else if (EventFlag(1049307577)) {
        SetEventFlagID(1049302178, ON);
    } else {
        //if no matches found, sequence end has been reached, warp to roundtable
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801); //to boss selector and warp events
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
    $InitializeCommonEvent(0, 90009805);
});

//random initialization
$Event(90009830, Default, function() {
    //all bosses
    if (EventFlag(1049308280)) {
        $InitializeCommonEvent(0, 90009831);
    } //remembrance
    else if (EventFlag(1049308281)) {
        $InitializeCommonEvent(0, 90009832);
    } //great enemies
    else if (EventFlag(1049308282)) {
        $InitializeCommonEvent(0, 90009833);
    } //minor bosses
    else if (EventFlag(1049308283)) {
        $InitializeCommonEvent(0, 90009834);
    } //dlc main
    else if (EventFlag(1049308284)) {
        $InitializeCommonEvent(0, 90009835);
    } //dlc minor
    else if (EventFlag(1049308285)) {
        $InitializeCommonEvent(0, 90009836);
    } //all undefeated bosses (dlc included)
    else if (EventFlag(1049308286)) {
        $InitializeCommonEvent(0, 90009837);
    } //all bosses with unobtained items (dlc included)
    else if (EventFlag(1049308287)) {
        $InitializeCommonEvent(0, 90009838);
    } //all undefeated bosses (dlc excluded)
    else if (EventFlag(1049308288)) {
        $InitializeCommonEvent(0, 90009839);
    } //all bosses with unobtained items (dlc excluded)
    else if (EventFlag(1049308289)) {
        $InitializeCommonEvent(0, 90009850);
    }
});

//boss rush initialization
$Event(90009920, Default, function() {
    //remembrance + dlc main
    if (EventFlag(1049308250)) {
        $InitializeCommonEvent(0, 90009900);
    //remembrance (base game)
    } else if (EventFlag(1049308251)) {
        $InitializeCommonEvent(0, 90009901);
    //dlc main
    } else if (EventFlag(1049308252)) {
        $InitializeCommonEvent(0, 90009902);
    //custom 1
    } else if (EventFlag(1049308260)) {
        $InitializeCommonEvent(0, 90009910);
    //custom 2
    } else if (EventFlag(1049308261)) {
        $InitializeCommonEvent(0, 90009911);
    //custom 3
    } else if (EventFlag(1049308262)) {
        $InitializeCommonEvent(0, 90009912);
    }
    //custom 4
    else if (EventFlag(1049308263))
        $InitializeCommonEvent(0, 90009913);
    //custom 5
    else if (EventFlag(1049308264))
        $InitializeCommonEvent(0, 90009914);
});

//boss rush end handling
$Event(90009921, Default, function() {
    SetEventFlagID(1049300060, OFF); //sequential mode off
    
    if (!PlayerInMap(11, 10, 0, 0)) {
        //DisplayFullScreenMessage(2081027);
        WaitFixedTimeSeconds(2);
        $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
    }
    else {
        DisplayFullScreenMessage(2081033);
    }
});

//random (prog) - all undefeated bosses (dlc included)
$Event(90009837, Default, function() {
    if (EventFlag(1049300042)) {//if all bosses have been defeated
        SetEventFlagID(1049300060, OFF); //disable resume sequence
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(2081032);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(2081037);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302000, 1049302208, ON);
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (EventFlag(1049302013) || EventFlag(1049302014)) //radagon only/elden beast only
        RestartEvent();
    BatchSetEventFlags(1049302600, 1049302614, OFF); //reset filter event flags
    $InitializeCommonEvent(0, 90009860); //filter events
    $InitializeCommonEvent(0, 90009861);
    $InitializeCommonEvent(0, 90009862);
    $InitializeCommonEvent(0, 90009863);
    $InitializeCommonEvent(0, 90009864);
    $InitializeCommonEvent(0, 90009865);
    $InitializeCommonEvent(0, 90009866);
    $InitializeCommonEvent(0, 90009867);
    $InitializeCommonEvent(0, 90009868);
    $InitializeCommonEvent(0, 90009869);
    $InitializeCommonEvent(0, 90009870);
    $InitializeCommonEvent(0, 90009871);
    $InitializeCommonEvent(0, 90009872);
    $InitializeCommonEvent(0, 90009873);
    $InitializeCommonEvent(0, 90009874);
    WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302600, 1049302614)); //wait for restart signal or all filter events to have run
    if (EventFlag(1049302262)) { //if selected flag is not valid, restart randomization
        SetEventFlagID(1049302262, OFF);
        RestartEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//random (prog) - all bosses with unobtained items (dlc included)
$Event(90009838, Default, function() {
    if (EventFlag(1049300043)) {//if all items have been obtained
        SetEventFlagID(1049300060, OFF); //disable resume sequence
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(2081029);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(2081034);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302000, 1049302208, ON);
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (EventFlag(1049302013) || EventFlag(1049302014)) //radagon only/elden beast only
        RestartEvent();
    BatchSetEventFlags(1049302600, 1049302614, OFF); //reset filter event flags
    $InitializeCommonEvent(0, 90009880); //filter events
    $InitializeCommonEvent(0, 90009881);
    $InitializeCommonEvent(0, 90009882);
    $InitializeCommonEvent(0, 90009883);
    $InitializeCommonEvent(0, 90009884);
    $InitializeCommonEvent(0, 90009885);
    $InitializeCommonEvent(0, 90009886);
    $InitializeCommonEvent(0, 90009887);
    $InitializeCommonEvent(0, 90009888);
    $InitializeCommonEvent(0, 90009889);
    $InitializeCommonEvent(0, 90009890);
    $InitializeCommonEvent(0, 90009891);
    $InitializeCommonEvent(0, 90009892);
    $InitializeCommonEvent(0, 90009893);
    $InitializeCommonEvent(0, 90009894);
    WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302600, 1049302614)); //wait for restart signal or all filter events to have run
    if (EventFlag(1049302262)) { //if selected flag is not valid, restart randomization
        SetEventFlagID(1049302262, OFF);
        RestartEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//random (prog) - all undefeated bosses (dlc excluded)
$Event(90009839, Default, function() {
    if (EventFlag(1049304331)) {//if all base game bosses have been defeated
        SetEventFlagID(1049300060, OFF); //disable resume sequence
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(2081030);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(2081035);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302000, 1049302166, ON);
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (EventFlag(1049302013) || EventFlag(1049302014)) //radagon only/elden beast only
        RestartEvent();
    BatchSetEventFlags(1049302600, 1049302614, OFF); //reset filter event flags
    $InitializeCommonEvent(0, 90009860); //filter events
    $InitializeCommonEvent(0, 90009861);
    $InitializeCommonEvent(0, 90009862);
    $InitializeCommonEvent(0, 90009863);
    $InitializeCommonEvent(0, 90009864);
    $InitializeCommonEvent(0, 90009865);
    $InitializeCommonEvent(0, 90009866);
    $InitializeCommonEvent(0, 90009867);
    $InitializeCommonEvent(0, 90009868);
    $InitializeCommonEvent(0, 90009869);
    $InitializeCommonEvent(0, 90009870);
    $InitializeCommonEvent(0, 90009871);
    WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302600, 1049302611)); //wait for restart signal or all filter events to have run
    if (EventFlag(1049302262)) { //if selected flag is not valid, restart randomization
        SetEventFlagID(1049302262, OFF);
        RestartEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//random (prog) - all bosses with unobtained items (dlc excluded)
$Event(90009850, Default, function() {
    if (EventFlag(1049304334)) {//if all base game items have been obtained
        SetEventFlagID(1049300060, OFF); //disable resume sequence
        if (!PlayerInMap(11, 10, 0, 0)) {
            DisplayFullScreenMessage(2081031);
            WaitFixedTimeSeconds(5);
            $InitializeCommonEvent(0, 90009820, 0); //roundtable warp
            EndEvent();
        }
        else {
            DisplayFullScreenMessage(2081036);
            DisplayBlinkingMessageWithPriority(1049300007, 0, true);
            EndEvent();
        }
    }
    BatchSetEventFlags(1049302000, 1049302227, OFF);
    RandomlySetEventFlagInRange(1049302000, 1049302166, ON);
    DisplayBlinkingMessage(2081026); //warping to a random boss
    if (EventFlag(1049302013) || EventFlag(1049302014)) //radagon only/elden beast only
        RestartEvent();
    BatchSetEventFlags(1049302600, 1049302614, OFF); //reset filter event flags
    $InitializeCommonEvent(0, 90009880); //filter events
    $InitializeCommonEvent(0, 90009881);
    $InitializeCommonEvent(0, 90009882);
    $InitializeCommonEvent(0, 90009883);
    $InitializeCommonEvent(0, 90009884);
    $InitializeCommonEvent(0, 90009885);
    $InitializeCommonEvent(0, 90009886);
    $InitializeCommonEvent(0, 90009887);
    $InitializeCommonEvent(0, 90009888);
    $InitializeCommonEvent(0, 90009889);
    $InitializeCommonEvent(0, 90009890);
    $InitializeCommonEvent(0, 90009891);
    WaitFor(EventFlag(1049302262) || AllBatchEventFlags(1049302600, 1049302611)); //wait for restart signal or all filter events to have run
    if (EventFlag(1049302262)) { //if selected flag is not valid, restart randomization
        SetEventFlagID(1049302262, OFF);
        RestartEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog rando filter (undefeated bosses 1)
$Event(90009860, Default, function() {
    //Soldier of Godrick
    if (EventFlag(1049302131) && EventFlag(1049304100))
        SetEventFlagID(1049302262, ON);
    //Beastman of Farum Azula
    else if (EventFlag(1049302132) && EventFlag(1049304101))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Limgrave)
    else if (EventFlag(1049302107) && EventFlag(1049304102))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Limgrave)
    else if (EventFlag(1049302108) && EventFlag(1049304103))
        SetEventFlagID(1049302262, ON);
    //Grave Warden Duelist (Limgrave)
    else if (EventFlag(1049302109) && EventFlag(1049304104))
        SetEventFlagID(1049302262, ON);
    //Guardian Golem
    else if (EventFlag(1049302134) && EventFlag(1049304105))
        SetEventFlagID(1049302262, ON);
    //Mad Pumpkin Head
    else if (EventFlag(1049302153) && EventFlag(1049304106))
        SetEventFlagID(1049302262, ON);
    //Patches
    else if (EventFlag(1049302135) && EventFlag(1049304107))
        SetEventFlagID(1049302262, ON);
    //Stonedigger Troll (Limgrave)
    else if (EventFlag(1049302154) && EventFlag(1049304108))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Chief x2
    else if (EventFlag(1049302133) && EventFlag(1049304109))
        SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Weeping Peninsula)
    else if (EventFlag(1049302110) && EventFlag(1049304110))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Weeping Peninsula)
    else if (EventFlag(1049302111) && EventFlag(1049304111))
        SetEventFlagID(1049302262, ON);
    //Miranda the Blighted Bloom
    else if (EventFlag(1049302136) && EventFlag(1049304112))
        SetEventFlagID(1049302262, ON);
    //Runebear
    else if (EventFlag(1049302137) && EventFlag(1049304113))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302600, ON);
});

//prog rando filter (undefeated bosses 2)
$Event(90009861, Default, function() {
    //Scaly Misbegotten
    if (EventFlag(1049302155) && EventFlag(1049304114))
        SetEventFlagID(1049302262, ON);
    //Leonine Misbegotten
    else if (EventFlag(1049302017) && EventFlag(1049304115))
        SetEventFlagID(1049302262, ON);
    //Bloodhound Knight Darriwil
    else if (EventFlag(1049302097) && EventFlag(1049304117))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Limgrave)
    else if (EventFlag(1049302051) && EventFlag(1049304118))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Limgrave)
    else if (EventFlag(1049302052) && EventFlag(1049304119))
        SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Limgrave)
    else if (EventFlag(1049302053) && EventFlag(1049304120))
        SetEventFlagID(1049302262, ON);
    //Tree Sentinel (Limgrave)
    else if (EventFlag(1049302054) && EventFlag(1049304121))
        SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Weeping Peninsula)
    else if (EventFlag(1049302098) && EventFlag(1049304122))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Limgrave)
    else if (EventFlag(1049302050) && EventFlag(1049304116))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Weeping Peninsula)
    else if (EventFlag(1049302055) && EventFlag(1049304123))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Weeping Peninsula)
    else if (EventFlag(1049302056) && EventFlag(1049304124))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Weeping Peninsula)
    else if (EventFlag(1049302057) && EventFlag(1049304125))
        SetEventFlagID(1049302262, ON);
    //Margit, the Fell Omen
    else if (EventFlag(1049302018) && EventFlag(1049304126))
        SetEventFlagID(1049302262, ON);
    //Godrick the Grafted
    else if (EventFlag(1049302000) && EventFlag(1049304127))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302601, ON);
});

//prog rando filter (undefeated bosses 3)
$Event(90009862, Default, function() {
    //Crucible Knight (Limgrave)
    if (EventFlag(1049302099) && EventFlag(1049304128))
        SetEventFlagID(1049302262, ON);
    //Flying Dragon Agheel
    else if (EventFlag(1049302020) && EventFlag(1049304130))
        SetEventFlagID(1049302262, ON);
    //Ancestor Spirit
    else if (EventFlag(1049302021) && EventFlag(1049304131))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Liurnia)
    else if (EventFlag(1049302112) && EventFlag(1049304132))
        SetEventFlagID(1049302262, ON);
    //Bloodhound Knight
    else if (EventFlag(1049302138) && EventFlag(1049304133))
        SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Liurnia)
    else if (EventFlag(1049302113) && EventFlag(1049304134))
        SetEventFlagID(1049302262, ON);
    //Cleanrot Knight
    else if (EventFlag(1049302139) && EventFlag(1049304135))
        SetEventFlagID(1049302262, ON);
    //Crystalian
    else if (EventFlag(1049302156) && EventFlag(1049304136))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Liurnia)
    else if (EventFlag(1049302114) && EventFlag(1049304138))
        SetEventFlagID(1049302262, ON);
    //Grafted Scion
    else if (EventFlag(1049302058) && EventFlag(1049304137))
        SetEventFlagID(1049302262, ON);
    //Omenkiller (Albinauric Village)
    else if (EventFlag(1049302066) && EventFlag(1049304167))
        SetEventFlagID(1049302262, ON);
    //Royal Revenant
    else if (EventFlag(1049302157) && EventFlag(1049304139))
        SetEventFlagID(1049302262, ON);
    //Spiritcaller Snail (Liurnia)
    else if (EventFlag(1049302115) && EventFlag(1049304140))
        SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Limgrave)
    else if (EventFlag(1049302116) && EventFlag(1049304141))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302602, ON);
});

//prog rando filter (undefeated bosses 4)
$Event(90009863, Default, function() {
    //Dragonkin Soldier of Nokstella
    if (EventFlag(1049302019) && EventFlag(1049304129))
        SetEventFlagID(1049302262, ON);
    //Red Wolf of Radagon
    else if (EventFlag(1049302022) && EventFlag(1049304142))
        SetEventFlagID(1049302262, ON);
    //Royal Knight Loretta
    else if (EventFlag(1049302023) && EventFlag(1049304143))
        SetEventFlagID(1049302262, ON);
    //Adan, Thief of Fire
    else if (EventFlag(1049302100) && EventFlag(1049304144))
        SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Caelid)
    else if (EventFlag(1049302117) && EventFlag(1049304145))
        SetEventFlagID(1049302262, ON);
    //Cleanrot Knight x2
    else if (EventFlag(1049302140) && EventFlag(1049304146))
        SetEventFlagID(1049302262, ON);
    //Crystalian x2 (Liurnia)
    else if (EventFlag(1049302141) && EventFlag(1049304147))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Liurnia)
    else if (EventFlag(1049302061) && EventFlag(1049304160))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Gilika
    else if (EventFlag(1049302161) && EventFlag(1049304162))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog x2
    else if (EventFlag(1049302118) && EventFlag(1049304148))
        SetEventFlagID(1049302262, ON);
    //Frenzied Duelist
    else if (EventFlag(1049302142) && EventFlag(1049304150))
        SetEventFlagID(1049302262, ON);
    //Mad Pumpkin Head x2
    else if (EventFlag(1049302159) && EventFlag(1049304151))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Liurnia East)
    else if (EventFlag(1049302070) && EventFlag(1049304165))
        SetEventFlagID(1049302262, ON);
    //Nox Swordstress & Nox Monk
    else if (EventFlag(1049302059) && EventFlag(1049304153))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302603, ON);
});

//prog rando filter (undefeated bosses 5)
$Event(90009864, Default, function() {
    //Magma Wyrm Makar
    if (EventFlag(1049302024) && EventFlag(1049304154))
        SetEventFlagID(1049302262, ON);
    //Rennala, Queen of the Full Moon
    else if (EventFlag(1049302001) && EventFlag(1049304155))
        SetEventFlagID(1049302262, ON);
    //Abductor Virgins
    else if (EventFlag(1049302143) && EventFlag(1049304156))
        SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Altus)
    else if (EventFlag(1049302119) && EventFlag(1049304157))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Liurnia)
    else if (EventFlag(1049302060) && EventFlag(1049304158))
        SetEventFlagID(1049302262, ON);
    //Bols, Carian Knight
    else if (EventFlag(1049302101) && EventFlag(1049304159))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Liurnia)
    else if (EventFlag(1049302062) && EventFlag(1049304161))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Margot
    else if (EventFlag(1049302144) && EventFlag(1049304178))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Liurnia East)
    else if (EventFlag(1049302064) && EventFlag(1049304163))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Liurnia West)
    else if (EventFlag(1049302063) && EventFlag(1049304164))
        SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Caelid)
    else if (EventFlag(1049302158) && EventFlag(1049304149))
        SetEventFlagID(1049302262, ON);
    //Kindred of Rot x2
    else if (EventFlag(1049302145) && EventFlag(1049304182))
        SetEventFlagID(1049302262, ON);
    //Magma Wyrm (Caelid)
    else if (EventFlag(1049302160) && EventFlag(1049304152))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Liurnia North)
    else if (EventFlag(1049302065) && EventFlag(1049304166))
        SetEventFlagID(1049302262, ON);
    //Onyx Lord (Liurnia)
    else if (EventFlag(1049302102) && EventFlag(1049304168))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302604, ON);
});

//prog rando filter (undefeated bosses 6)
$Event(90009865, Default, function() {
    //Perfumer Tricia & Misbegotten Warrior
    if (EventFlag(1049302120) && EventFlag(1049304169))
        SetEventFlagID(1049302262, ON);
    //Red Wolf of the Champion
    else if (EventFlag(1049302123) && EventFlag(1049304186))
        SetEventFlagID(1049302262, ON);
    //Sanguine Noble
    else if (EventFlag(1049302162) && EventFlag(1049304170))
        SetEventFlagID(1049302262, ON);
    //Stonedigger Troll (Altus)
    else if (EventFlag(1049302163) && EventFlag(1049304171))
        SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Liurnia)
    else if (EventFlag(1049302067) && EventFlag(1049304172))
        SetEventFlagID(1049302262, ON);
    //Elemer of the Briar
    else if (EventFlag(1049302027) && EventFlag(1049304187))
        SetEventFlagID(1049302262, ON);
    //Battlemage Hugues
    else if (EventFlag(1049302103) && EventFlag(1049304174))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Invisible)
    else if (EventFlag(1049302146) && EventFlag(1049304190))
        SetEventFlagID(1049302262, ON);
    //Commander O'Neil
    else if (EventFlag(1049302026) && EventFlag(1049304175))
        SetEventFlagID(1049302262, ON);
    //Crystalian x2 (Altus)
    else if (EventFlag(1049302164) && EventFlag(1049304176))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Caelid)
    else if (EventFlag(1049302068) && EventFlag(1049304177))
        SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier (Siofra)
    else if (EventFlag(1049302031) && EventFlag(1049304208))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Altus)
    else if (EventFlag(1049302121) && EventFlag(1049304179))
        SetEventFlagID(1049302262, ON);
    //Glintstone Dragon Smarag
    else if (EventFlag(1049302028) && EventFlag(1049304180))
        SetEventFlagID(1049302262, ON);
    //Grave Warden Duelist (Capital Outskirts)
    else if (EventFlag(1049302122) && EventFlag(1049304181))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302605, ON);
});

//prog rando filter (undefeated bosses 7)
$Event(90009866, Default, function() {
    //Night's Cavalary (Caelid)
    if (EventFlag(1049302069) && EventFlag(1049304183))
        SetEventFlagID(1049302262, ON);
    //Omenkiller & Miranda
    else if (EventFlag(1049302149) && EventFlag(1049304199))
        SetEventFlagID(1049302262, ON);
    //Onyx Lord (Capital Outskirts)
    else if (EventFlag(1049302165) && EventFlag(1049304184))
        SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Caelid)
    else if (EventFlag(1049302071) && EventFlag(1049304185))
        SetEventFlagID(1049302262, ON);
    //Misbegotten Warrior & Crucible Knight
    else if (EventFlag(1049302025) && EventFlag(1049304173))
        SetEventFlagID(1049302262, ON);
    //Regal Ancestor Spirit
    else if (EventFlag(1049302002) && EventFlag(1049304188))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Altus)
    else if (EventFlag(1049302072) && EventFlag(1049304189))
        SetEventFlagID(1049302262, ON);
    //Crystalian x3
    else if (EventFlag(1049302147) && EventFlag(1049304191))
        SetEventFlagID(1049302262, ON);
    //Giant Wormface
    else if (EventFlag(1049302075) && EventFlag(1049304193))
        SetEventFlagID(1049302262, ON);
    //Godfrey, First Elden Lord (Golden Shade)
    else if (EventFlag(1049302033) && EventFlag(1049304210))
        SetEventFlagID(1049302262, ON);
    //Godskin Apostle (Altus)
    else if (EventFlag(1049302074) && EventFlag(1049304195))
        SetEventFlagID(1049302262, ON);
    //Mimic Tear
    else if (EventFlag(1049302029) && EventFlag(1049304196))
        SetEventFlagID(1049302262, ON);
    //Necromancer Garris
    else if (EventFlag(1049302148) && EventFlag(1049304197))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Altus)
    else if (EventFlag(1049302076) && EventFlag(1049304198))
        SetEventFlagID(1049302262, ON);
    //Tree Sentinel x2 (Altus)
    else if (EventFlag(1049302077) && EventFlag(1049304200))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302606, ON);
});

//prog rando filter (undefeated bosses 8)
$Event(90009867, Default, function() {
    //Godskin Noble (Volcano Manor)
    if (EventFlag(1049302034) && EventFlag(1049304215))
        SetEventFlagID(1049302262, ON);
    //Starscourge Radahn
    else if (EventFlag(1049302003) && EventFlag(1049304201))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Capital Outskirts)
    else if (EventFlag(1049302078) && EventFlag(1049304202))
        SetEventFlagID(1049302262, ON);
    //Crucible Knight Siluria
    else if (EventFlag(1049302041) && EventFlag(1049304225))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Capital Outskirts)
    else if (EventFlag(1049302079) && EventFlag(1049304204))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Maggie
    else if (EventFlag(1049302080) && EventFlag(1049304206))
        SetEventFlagID(1049302262, ON);
    //Draconic Tree Sentinel
    else if (EventFlag(1049302081) && EventFlag(1049304207))
        SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Altus)
    else if (EventFlag(1049302073) && EventFlag(1049304192))
        SetEventFlagID(1049302262, ON);
    //Fia's Champions
    else if (EventFlag(1049302032) && EventFlag(1049304209))
        SetEventFlagID(1049302262, ON);
    //Godefroy the Grafted
    else if (EventFlag(1049302105) && EventFlag(1049304194))
        SetEventFlagID(1049302262, ON);
    //Magma Wyrm (Mt. Gelmir)
    else if (EventFlag(1049302035) && EventFlag(1049304211))
        SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Altus)
    else if (EventFlag(1049302082) && EventFlag(1049304212))
        SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Mt. Gelmir)
    else if (EventFlag(1049302083) && EventFlag(1049304213))
        SetEventFlagID(1049302262, ON);
    //Valiant Gargoyles
    else if (EventFlag(1049302036) && EventFlag(1049304214))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302607, ON);
});

//prog rando filter (undefeated bosses 9)
$Event(90009868, Default, function() {
    //Astel, Naturalborn of the Void
    if (EventFlag(1049302004) && EventFlag(1049304216))
        SetEventFlagID(1049302262, ON);
    //Lichdragon Fortissax
    else if (EventFlag(1049302005) && EventFlag(1049304217))
        SetEventFlagID(1049302262, ON);
    //Morgott, the Omen King
    else if (EventFlag(1049302006) && EventFlag(1049304218))
        SetEventFlagID(1049302262, ON);
    //Ancient Dragon Lansseax
    else if (EventFlag(1049302037) && EventFlag(1049304219))
        SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Mountaintops)
    else if (EventFlag(1049302125) && EventFlag(1049304220))
        SetEventFlagID(1049302262, ON);
    //Black Blade Kindred (Forbidden Lands)
    else if (EventFlag(1049302084) && EventFlag(1049304221))
        SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier (Lake of Rot)
    else if (EventFlag(1049302038) && EventFlag(1049304226))
        SetEventFlagID(1049302262, ON);
    //Esgar, Priest of Blood
    else if (EventFlag(1049302127) && EventFlag(1049304227))
        SetEventFlagID(1049302262, ON);
    //Fell Twins
    else if (EventFlag(1049302085) && EventFlag(1049304222))
        SetEventFlagID(1049302262, ON);
    //Spiritcaller Snail (Mountaintops)
    else if (EventFlag(1049302150) && EventFlag(1049304223))
        SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Mountaintops)
    else if (EventFlag(1049302126) && EventFlag(1049304224))
        SetEventFlagID(1049302262, ON);
    //Crucible Knight Ordovis
    else if (EventFlag(1049302124) && EventFlag(1049304203))
        SetEventFlagID(1049302262, ON);
    //Decaying Ekzykes
    else if (EventFlag(1049302030) && EventFlag(1049304205))
        SetEventFlagID(1049302262, ON);
    //Mohg, the Omen
    else if (EventFlag(1049302039) && EventFlag(1049304229))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302608, ON);
});

//prog rando filter (undefeated bosses 10)
$Event(90009869, Default, function() {
    //Roundtable Knight Vyke
    if (EventFlag(1049302104) && EventFlag(1049304230))
        SetEventFlagID(1049302262, ON);
    //Rykard, Lord of Blasphemy
    else if (EventFlag(1049302007) && EventFlag(1049304231))
        SetEventFlagID(1049302262, ON);
    //Commander Niall
    else if (EventFlag(1049302040) && EventFlag(1049304232))
        SetEventFlagID(1049302262, ON);
    //Beastman of Farum Azula x2
    else if (EventFlag(1049302151) && EventFlag(1049304238))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Mountaintops)
    else if (EventFlag(1049302087) && EventFlag(1049304233))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Mountaintops)
    else if (EventFlag(1049302088) && EventFlag(1049304234))
        SetEventFlagID(1049302262, ON);
    //Full-Grown Fallingstar Beast
    else if (EventFlag(1049302086) && EventFlag(1049304228))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Forbidden Lands)
    else if (EventFlag(1049302089) && EventFlag(1049304236))
        SetEventFlagID(1049302262, ON);
    //Flying Dragon Greyll
    else if (EventFlag(1049302046) && EventFlag(1049304252))
        SetEventFlagID(1049302262, ON);
    //Glintstone Dragon Adula
    else if (EventFlag(1049302047) && EventFlag(1049304253))
        SetEventFlagID(1049302262, ON);
    //Godskin Duo
    else if (EventFlag(1049302042) && EventFlag(1049304235))
        SetEventFlagID(1049302262, ON);
    //Misbegotten Crusader
    else if (EventFlag(1049302152) && EventFlag(1049304244))
        SetEventFlagID(1049302262, ON);
    //Putrid Grave Warden Duelist
    else if (EventFlag(1049302130) && EventFlag(1049304245))
        SetEventFlagID(1049302262, ON);
    //Putrid Tree Spirit (Caelid)
    else if (EventFlag(1049302128) && EventFlag(1049304239))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302609, ON);
});

//prog rando filter (undefeated bosses 11)
$Event(90009870, Default, function() {
    //Stray Mimic
    if (EventFlag(1049302129) && EventFlag(1049304241))
        SetEventFlagID(1049302262, ON);
    //Alecto, Black Knife Ringleader
    else if (EventFlag(1049302106) && EventFlag(1049304237))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Dragonbarrow)
    else if (EventFlag(1049302090) && EventFlag(1049304250))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Dragonbarrow)
    else if (EventFlag(1049302092) && EventFlag(1049304254))
        SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Dragonbarrow)
    else if (EventFlag(1049302093) && EventFlag(1049304255))
        SetEventFlagID(1049302262, ON);
    //Sir Gideon Ofnir, the All-Knowing
    else if (EventFlag(1049302044) && EventFlag(1049304240))
        SetEventFlagID(1049302262, ON);
    //Godskin Apostle (Caelid)
    else if (EventFlag(1049302043) && EventFlag(1049304247))
        SetEventFlagID(1049302262, ON);
    //Fire Giant
    else if (EventFlag(1049302008) && EventFlag(1049304246))
        SetEventFlagID(1049302262, ON);
    //Beast Clergyman / Maliketh
    else if (EventFlag(1049302009) && EventFlag(1049304248))
        SetEventFlagID(1049302262, ON);
    //Godfrey / Hoarah Loux
    else if (EventFlag(1049302010) && EventFlag(1049304249))
        SetEventFlagID(1049302262, ON);
    //Astel, Stars of Darkness
    else if (EventFlag(1049302166) && EventFlag(1049304242))
        SetEventFlagID(1049302262, ON);
    //Black Blade Kindred (Dragonbarrow)
    else if (EventFlag(1049302091) && EventFlag(1049304251))
        SetEventFlagID(1049302262, ON);
    //Borealis, the Freezing Fog
    else if (EventFlag(1049302045) && EventFlag(1049304243))
        SetEventFlagID(1049302262, ON);
    //Loretta, Knight of the Haligtree
    else if (EventFlag(1049302048) && EventFlag(1049304258))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302610, ON);
});

//prog rando filter (undefeated bosses 12)
$Event(90009871, Default, function() {
    //Night's Cavalry x2
    if (EventFlag(1049302095) && EventFlag(1049304259))
        SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Consecrated Snowfield)
    else if (EventFlag(1049302096) && EventFlag(1049304260))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Consecrated Snowfield)
    else if (EventFlag(1049302094) && EventFlag(1049304256))
        SetEventFlagID(1049302262, ON);
    //Great Wyrm Theodorix
    else if (EventFlag(1049302049) && EventFlag(1049304257))
        SetEventFlagID(1049302262, ON);
    //Malenia, Blade of Miquella
    else if (EventFlag(1049302016) && EventFlag(1049304261))
        SetEventFlagID(1049302262, ON);
    //Dragonlord Placidusax
    else if (EventFlag(1049302011) && EventFlag(1049304262))
        SetEventFlagID(1049302262, ON);
    //Radagon / Elden Beast
    else if (EventFlag(1049302012) && EventFlag(1049304263))
        SetEventFlagID(1049302262, ON);
    //Mohg, Lord of Blood
    else if (EventFlag(1049302015) && EventFlag(1049304264))
        SetEventFlagID(1049302262, ON);
    //Curseblade Labirith
    else if (EventFlag(1049302184) && EventFlag(1049304265))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Marigga
    else if (EventFlag(1049302187) && EventFlag(1049304266))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Swordmaster Onze
    else if (EventFlag(1049302179) && EventFlag(1049304267))
        SetEventFlagID(1049302262, ON);
    //Chief Bloodfiend
    else if (EventFlag(1049302183) && EventFlag(1049304268))
        SetEventFlagID(1049302262, ON);
    //Dancer of Ranah
    else if (EventFlag(1049302182) && EventFlag(1049304269))
        SetEventFlagID(1049302262, ON);
    //Death Knight (Gravesite Plain)
    else if (EventFlag(1049302180) && EventFlag(1049304270))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302611, ON);
});

//prog rando filter (undefeated bosses 13)
$Event(90009872, Default, function() {
    //Divine Beast Dancing Lion
    if (EventFlag(1049302167) && EventFlag(1049304271))
        SetEventFlagID(1049302262, ON);
    //Ancient Dragon-Man
    else if (EventFlag(1049302200) && EventFlag(1049304272))
        SetEventFlagID(1049302262, ON);
    //Black Knight Edredd
    else if (EventFlag(1049302190) && EventFlag(1049304273))
        SetEventFlagID(1049302262, ON);
    //Dryleaf Dane
    else if (EventFlag(1049302195) && EventFlag(1049304275))
        SetEventFlagID(1049302262, ON);
    //Knight of the Solitary Gaol
    else if (EventFlag(1049302198) && EventFlag(1049304276))
        SetEventFlagID(1049302262, ON);
    //Black Knight Garrew
    else if (EventFlag(1049302191) && EventFlag(1049304277))
        SetEventFlagID(1049302262, ON);
    //Red Bear
    else if (EventFlag(1049302185) && EventFlag(1049304278))
        SetEventFlagID(1049302262, ON);
    //Count Ymir, Mother of Fingers
    else if (EventFlag(1049302207) && EventFlag(1049304274))
        SetEventFlagID(1049302262, ON);
    //Crucible Knight Devonia
    else if (EventFlag(1049302208) && EventFlag(1049304279))
        SetEventFlagID(1049302262, ON);
    //Death Knight (Rauh Base)
    else if (EventFlag(1049302186) && EventFlag(1049304280))
        SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Gravesite Plain)
    else if (EventFlag(1049302181) && EventFlag(1049304281))
        SetEventFlagID(1049302262, ON);
    //Ralva the Great Red Bear
    else if (EventFlag(1049302193) && EventFlag(1049304282))
        SetEventFlagID(1049302262, ON);
    //Rellana, Twin Moon Knight
    else if (EventFlag(1049302168) && EventFlag(1049304283))
        SetEventFlagID(1049302262, ON);
    //Golden Hippopotamus
    else if (EventFlag(1049302169) && EventFlag(1049304284))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302612, ON);
});

//prog rando filter (undefeated bosses 14)
$Event(90009873, Default, function() {
    //Jagged Peak Drake
    if (EventFlag(1049302196) && EventFlag(1049304285))
        SetEventFlagID(1049302262, ON);
    //Rugalea, the Great Red Bear
    else if (EventFlag(1049302197) && EventFlag(1049304286))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Charo's Hidden Grave)
    else if (EventFlag(1049302194) && EventFlag(1049304287))
        SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Cerulean Coast)
    else if (EventFlag(1049302188) && EventFlag(1049304288))
        SetEventFlagID(1049302262, ON);
    //Jori, Elder Inquisitor
    else if (EventFlag(1049302199) && EventFlag(1049304289))
        SetEventFlagID(1049302262, ON);
    //Lamenter
    else if (EventFlag(1049302189) && EventFlag(1049304290))
        SetEventFlagID(1049302262, ON);
    //Rakshasa
    else if (EventFlag(1049302206) && EventFlag(1049304291))
        SetEventFlagID(1049302262, ON);
    //Putrescent Knight
    else if (EventFlag(1049302170) && EventFlag(1049304292))
        SetEventFlagID(1049302262, ON);
    //Scadutree Avatar
    else if (EventFlag(1049302171) && EventFlag(1049304293))
        SetEventFlagID(1049302262, ON);
    //Commander Gaius
    else if (EventFlag(1049302172) && EventFlag(1049304294))
        SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Hinterland)
    else if (EventFlag(1049302202) && EventFlag(1049304295))
        SetEventFlagID(1049302262, ON);
    //Tree Sentinel x2 (Hinterland)
    else if (EventFlag(1049302204) && EventFlag(1049304296))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302613, ON);
});

//prog rando filter (undefeated bosses 15)
$Event(90009874, Default, function() {
    //Divine Beast Dancing Lion (Rauh)
    if (EventFlag(1049302201) && EventFlag(1049304297))
        SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Scadu Altus)
    else if (EventFlag(1049302192) && EventFlag(1049304298))
        SetEventFlagID(1049302262, ON);
    //Jagged Peak Drake x2
    else if (EventFlag(1049302203) && EventFlag(1049304299))
        SetEventFlagID(1049302262, ON);
    //Messmer the Impaler
    else if (EventFlag(1049302173) && EventFlag(1049304300))
        SetEventFlagID(1049302262, ON);
    //Midra, Lord of Frenzied Flame
    else if (EventFlag(1049302175) && EventFlag(1049304301))
        SetEventFlagID(1049302262, ON);
    //Romina, Saint of the Bud
    else if (EventFlag(1049302176) && EventFlag(1049304302))
        SetEventFlagID(1049302262, ON);
    //Metyr, Mother of Fingers
    else if (EventFlag(1049302174) && EventFlag(1049304303))
        SetEventFlagID(1049302262, ON);
    //Ancient Dragon Senessax
    else if (EventFlag(1049302205) && EventFlag(1049304304))
        SetEventFlagID(1049302262, ON);
    //Radahn, Consort of Miquella
    else if (EventFlag(1049302177) && EventFlag(1049304305))
        SetEventFlagID(1049302262, ON);
    //Bayle the Dread
    else if (EventFlag(1049302178) && EventFlag(1049304306))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302614, ON);
});

//prog rando filter (unobtained items 1)
$Event(90009880, Default, function() {
    //Soldier of Godrick
    if (EventFlag(1049302131) && EventFlag(1049300100))
        SetEventFlagID(1049302262, ON);
    //Beastman of Farum Azula
    else if (EventFlag(1049302132) && EventFlag(1049300101))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Limgrave)
    else if (EventFlag(1049302107) && EventFlag(1049300102))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Limgrave)
    else if (EventFlag(1049302108) && EventFlag(1049300103))
        SetEventFlagID(1049302262, ON);
    //Grave Warden Duelist (Limgrave)
    else if (EventFlag(1049302109) && EventFlag(1049300104))
        SetEventFlagID(1049302262, ON);
    //Guardian Golem
    else if (EventFlag(1049302134) && EventFlag(1049300105))
        SetEventFlagID(1049302262, ON);
    //Mad Pumpkin Head
    else if (EventFlag(1049302153) && EventFlag(1049300106))
        SetEventFlagID(1049302262, ON);
    //Patches
    else if (EventFlag(1049302135) && EventFlag(1049300107))
        SetEventFlagID(1049302262, ON);
    //Stonedigger Troll (Limgrave)
    else if (EventFlag(1049302154) && EventFlag(1049300108))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Chief x2
    else if (EventFlag(1049302133) && EventFlag(1049300109))
        SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Weeping Peninsula)
    else if (EventFlag(1049302110) && EventFlag(1049300110))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Weeping Peninsula)
    else if (EventFlag(1049302111) && EventFlag(1049300111))
        SetEventFlagID(1049302262, ON);
    //Miranda the Blighted Bloom
    else if (EventFlag(1049302136) && EventFlag(1049300112))
        SetEventFlagID(1049302262, ON);
    //Runebear
    else if (EventFlag(1049302137) && EventFlag(1049300113))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302600, ON);
});

//prog rando filter (unobtained items 2)
$Event(90009881, Default, function() {
    //Scaly Misbegotten
    if (EventFlag(1049302155) && EventFlag(1049300114))
        SetEventFlagID(1049302262, ON);
    //Leonine Misbegotten
    else if (EventFlag(1049302017) && EventFlag(1049300115))
        SetEventFlagID(1049302262, ON);
    //Bloodhound Knight Darriwil
    else if (EventFlag(1049302097) && EventFlag(1049300117))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Limgrave)
    else if (EventFlag(1049302051) && EventFlag(1049300118))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Limgrave)
    else if (EventFlag(1049302052) && EventFlag(1049300119))
        SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Limgrave)
    else if (EventFlag(1049302053) && EventFlag(1049300120))
        SetEventFlagID(1049302262, ON);
    //Tree Sentinel (Limgrave)
    else if (EventFlag(1049302054) && EventFlag(1049300121))
        SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Weeping Peninsula)
    else if (EventFlag(1049302098) && EventFlag(1049300122))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Limgrave)
    else if (EventFlag(1049302050) && EventFlag(1049300116))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Weeping Peninsula)
    else if (EventFlag(1049302055) && EventFlag(1049300123))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Weeping Peninsula)
    else if (EventFlag(1049302056) && EventFlag(1049300124))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Weeping Peninsula)
    else if (EventFlag(1049302057) && EventFlag(1049300125))
        SetEventFlagID(1049302262, ON);
    //Margit, the Fell Omen
    else if (EventFlag(1049302018) && EventFlag(1049300126))
        SetEventFlagID(1049302262, ON);
    //Godrick the Grafted
    else if (EventFlag(1049302000) && EventFlag(1049300127))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302601, ON);
});

//prog rando filter (unobtained items 3)
$Event(90009882, Default, function() {
    //Crucible Knight (Limgrave)
    if (EventFlag(1049302099) && EventFlag(1049300128))
        SetEventFlagID(1049302262, ON);
    //Flying Dragon Agheel
    else if (EventFlag(1049302020) && EventFlag(1049300130))
        SetEventFlagID(1049302262, ON);
    //Ancestor Spirit
    else if (EventFlag(1049302021) && EventFlag(1049300131))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Liurnia)
    else if (EventFlag(1049302112) && EventFlag(1049300132))
        SetEventFlagID(1049302262, ON);
    //Bloodhound Knight
    else if (EventFlag(1049302138) && EventFlag(1049300133))
        SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Liurnia)
    else if (EventFlag(1049302113) && EventFlag(1049300134))
        SetEventFlagID(1049302262, ON);
    //Cleanrot Knight
    else if (EventFlag(1049302139) && EventFlag(1049300135))
        SetEventFlagID(1049302262, ON);
    //Crystalian
    else if (EventFlag(1049302156) && EventFlag(1049300136))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Liurnia)
    else if (EventFlag(1049302114) && EventFlag(1049300138))
        SetEventFlagID(1049302262, ON);
    //Grafted Scion
    else if (EventFlag(1049302058) && EventFlag(1049300137))
        SetEventFlagID(1049302262, ON);
    //Omenkiller (Albinauric Village)
    else if (EventFlag(1049302066) && EventFlag(1049300167))
        SetEventFlagID(1049302262, ON);
    //Royal Revenant
    else if (EventFlag(1049302157) && EventFlag(1049300139))
        SetEventFlagID(1049302262, ON);
    //Spiritcaller Snail (Liurnia)
    else if (EventFlag(1049302115) && EventFlag(1049300140))
        SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Limgrave)
    else if (EventFlag(1049302116) && EventFlag(1049300141))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302602, ON);
});

//prog rando filter (unobtained items 4)
$Event(90009883, Default, function() {
    //Dragonkin Soldier of Nokstella
    if (EventFlag(1049302019) && EventFlag(1049300129))
        SetEventFlagID(1049302262, ON);
    //Red Wolf of Radagon
    else if (EventFlag(1049302022) && EventFlag(1049300142))
        SetEventFlagID(1049302262, ON);
    //Royal Knight Loretta
    else if (EventFlag(1049302023) && EventFlag(1049300143))
        SetEventFlagID(1049302262, ON);
    //Adan, Thief of Fire
    else if (EventFlag(1049302100) && EventFlag(1049300144))
        SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Caelid)
    else if (EventFlag(1049302117) && EventFlag(1049300145))
        SetEventFlagID(1049302262, ON);
    //Cleanrot Knight x2
    else if (EventFlag(1049302140) && EventFlag(1049300146))
        SetEventFlagID(1049302262, ON);
    //Crystalian x2 (Liurnia)
    else if (EventFlag(1049302141) && EventFlag(1049300147))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Liurnia)
    else if (EventFlag(1049302061) && EventFlag(1049300160))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Gilika
    else if (EventFlag(1049302161) && EventFlag(1049300162))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog x2
    else if (EventFlag(1049302118) && EventFlag(1049300148))
        SetEventFlagID(1049302262, ON);
    //Frenzied Duelist
    else if (EventFlag(1049302142) && EventFlag(1049300150))
        SetEventFlagID(1049302262, ON);
    //Mad Pumpkin Head x2
    else if (EventFlag(1049302159) && EventFlag(1049300151))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Liurnia East)
    else if (EventFlag(1049302070) && EventFlag(1049300165))
        SetEventFlagID(1049302262, ON);
    //Nox Swordstress & Nox Monk
    else if (EventFlag(1049302059) && EventFlag(1049300153))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302603, ON);
});

//prog rando filter (unobtained items 5)
$Event(90009884, Default, function() {
    //Magma Wyrm Makar
    if (EventFlag(1049302024) && EventFlag(1049300154))
        SetEventFlagID(1049302262, ON);
    //Rennala, Queen of the Full Moon
    else if (EventFlag(1049302001) && EventFlag(1049300155))
        SetEventFlagID(1049302262, ON);
    //Abductor Virgins
    else if (EventFlag(1049302143) && EventFlag(1049300156))
        SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Altus)
    else if (EventFlag(1049302119) && EventFlag(1049300157))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Liurnia)
    else if (EventFlag(1049302060) && EventFlag(1049300158))
        SetEventFlagID(1049302262, ON);
    //Bols, Carian Knight
    else if (EventFlag(1049302101) && EventFlag(1049300159))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Liurnia)
    else if (EventFlag(1049302062) && EventFlag(1049300161))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Margot
    else if (EventFlag(1049302144) && EventFlag(1049300178))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Liurnia East)
    else if (EventFlag(1049302064) && EventFlag(1049300163))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Liurnia West)
    else if (EventFlag(1049302063) && EventFlag(1049300164))
        SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Caelid)
    else if (EventFlag(1049302158) && EventFlag(1049300149))
        SetEventFlagID(1049302262, ON);
    //Kindred of Rot x2
    else if (EventFlag(1049302145) && EventFlag(1049300182))
        SetEventFlagID(1049302262, ON);
    //Magma Wyrm (Caelid)
    else if (EventFlag(1049302160) && EventFlag(1049300152))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Liurnia North)
    else if (EventFlag(1049302065) && EventFlag(1049300166))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302604, ON);
});

//prog rando filter (unobtained items 6)
$Event(90009885, Default, function() {
    //Onyx Lord (Liurnia)
    if (EventFlag(1049302102) && EventFlag(1049300168))
        SetEventFlagID(1049302262, ON);
    //Perfumer Tricia & Misbegotten Warrior
    else if (EventFlag(1049302120) && EventFlag(1049300169))
        SetEventFlagID(1049302262, ON);
    //Red Wolf of the Champion
    else if (EventFlag(1049302123) && EventFlag(1049300186))
        SetEventFlagID(1049302262, ON);
    //Sanguine Noble
    else if (EventFlag(1049302162) && EventFlag(1049300170))
        SetEventFlagID(1049302262, ON);
    //Stonedigger Troll (Altus)
    else if (EventFlag(1049302163) && EventFlag(1049300171))
        SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Liurnia)
    else if (EventFlag(1049302067) && EventFlag(1049300172))
        SetEventFlagID(1049302262, ON);
    //Elemer of the Briar
    else if (EventFlag(1049302027) && EventFlag(1049300187))
        SetEventFlagID(1049302262, ON);
    //Battlemage Hugues
    else if (EventFlag(1049302103) && EventFlag(1049300174))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Invisible)
    else if (EventFlag(1049302146) && EventFlag(1049300190))
        SetEventFlagID(1049302262, ON);
    //Commander O'Neil
    else if (EventFlag(1049302026) && EventFlag(1049300175))
        SetEventFlagID(1049302262, ON);
    //Crystalian x2 (Altus)
    else if (EventFlag(1049302164) && EventFlag(1049300176))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Caelid)
    else if (EventFlag(1049302068) && EventFlag(1049300177))
        SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier (Siofra)
    else if (EventFlag(1049302031) && EventFlag(1049300208))
        SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Altus)
    else if (EventFlag(1049302121) && EventFlag(1049300179))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302605, ON);
});

//prog rando filter (unobtained items 7)
$Event(90009886, Default, function() {
    //Glintstone Dragon Smarag
    if (EventFlag(1049302028) && EventFlag(1049300180))
        SetEventFlagID(1049302262, ON);
    //Grave Warden Duelist (Capital Outskirts)
    else if (EventFlag(1049302122) && EventFlag(1049300181))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalary (Caelid)
    else if (EventFlag(1049302069) && EventFlag(1049300183))
        SetEventFlagID(1049302262, ON);
    //Omenkiller & Miranda
    else if (EventFlag(1049302149) && EventFlag(1049300199))
        SetEventFlagID(1049302262, ON);
    //Onyx Lord (Capital Outskirts)
    else if (EventFlag(1049302165) && EventFlag(1049300184))
        SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Caelid)
    else if (EventFlag(1049302071) && EventFlag(1049300185))
        SetEventFlagID(1049302262, ON);
    //Misbegotten Warrior & Crucible Knight
    else if (EventFlag(1049302025) && EventFlag(1049300173))
        SetEventFlagID(1049302262, ON);
    //Regal Ancestor Spirit
    else if (EventFlag(1049302002) && EventFlag(1049300188))
        SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Altus)
    else if (EventFlag(1049302072) && EventFlag(1049300189))
        SetEventFlagID(1049302262, ON);
    //Crystalian x3
    else if (EventFlag(1049302147) && EventFlag(1049300191))
        SetEventFlagID(1049302262, ON);
    //Giant Wormface
    else if (EventFlag(1049302075) && EventFlag(1049300193))
        SetEventFlagID(1049302262, ON);
    //Godfrey, First Elden Lord (Golden Shade)
    else if (EventFlag(1049302033) && EventFlag(1049300210))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302606, ON);
});

//prog rando filter (unobtained items 8)
$Event(90009887, Default, function() {
    //Godskin Apostle (Altus)
    if (EventFlag(1049302074) && EventFlag(1049300195))
        SetEventFlagID(1049302262, ON);
    //Mimic Tear
    else if (EventFlag(1049302029) && EventFlag(1049300196))
        SetEventFlagID(1049302262, ON);
    //Necromancer Garris
    else if (EventFlag(1049302148) && EventFlag(1049300197))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Altus)
    else if (EventFlag(1049302076) && EventFlag(1049300198))
        SetEventFlagID(1049302262, ON);
    //Tree Sentinel x2 (Altus)
    else if (EventFlag(1049302077) && EventFlag(1049300200))
        SetEventFlagID(1049302262, ON);
    //Godskin Noble (Volcano Manor)
    else if (EventFlag(1049302034) && EventFlag(1049300215))
        SetEventFlagID(1049302262, ON);
    //Starscourge Radahn
    else if (EventFlag(1049302003) && EventFlag(1049300201))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Capital Outskirts)
    else if (EventFlag(1049302078) && EventFlag(1049300202))
        SetEventFlagID(1049302262, ON);
    //Crucible Knight Siluria
    else if (EventFlag(1049302041) && EventFlag(1049300225))
        SetEventFlagID(1049302262, ON);
    //Deathbird (Capital Outskirts)
    else if (EventFlag(1049302079) && EventFlag(1049300204))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Maggie
    else if (EventFlag(1049302080) && EventFlag(1049300206))
        SetEventFlagID(1049302262, ON);
    //Draconic Tree Sentinel
    else if (EventFlag(1049302081) && EventFlag(1049300207))
        SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Altus)
    else if (EventFlag(1049302073) && EventFlag(1049300192))
        SetEventFlagID(1049302262, ON);
    //Fia's Champions
    else if (EventFlag(1049302032) && EventFlag(1049300209))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302607, ON);
});

//prog rando filter (unobtained items 9)
$Event(90009888, Default, function() {
    //Godefroy the Grafted
    if (EventFlag(1049302105) && EventFlag(1049300194))
        SetEventFlagID(1049302262, ON);
    //Magma Wyrm (Mt. Gelmir)
    else if (EventFlag(1049302035) && EventFlag(1049300211))
        SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Altus)
    else if (EventFlag(1049302082) && EventFlag(1049300212))
        SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Mt. Gelmir)
    else if (EventFlag(1049302083) && EventFlag(1049300213))
        SetEventFlagID(1049302262, ON);
    //Valiant Gargoyles
    else if (EventFlag(1049302036) && EventFlag(1049300214))
        SetEventFlagID(1049302262, ON);
    //Astel, Naturalborn of the Void
    else if (EventFlag(1049302004) && EventFlag(1049300216))
        SetEventFlagID(1049302262, ON);
    //Lichdragon Fortissax
    else if (EventFlag(1049302005) && EventFlag(1049300217))
        SetEventFlagID(1049302262, ON);
    //Morgott, the Omen King
    else if (EventFlag(1049302006) && EventFlag(1049300218))
        SetEventFlagID(1049302262, ON);
    //Ancient Dragon Lansseax
    else if (EventFlag(1049302037) && EventFlag(1049300219))
        SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Mountaintops)
    else if (EventFlag(1049302125) && EventFlag(1049300220))
        SetEventFlagID(1049302262, ON);
    //Black Blade Kindred (Forbidden Lands)
    else if (EventFlag(1049302084) && EventFlag(1049300221))
        SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier (Lake of Rot)
    else if (EventFlag(1049302038) && EventFlag(1049300226))
        SetEventFlagID(1049302262, ON);
    //Esgar, Priest of Blood
    else if (EventFlag(1049302127) && EventFlag(1049300227))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302608, ON);
});

//prog rando filter (unobtained items 10)
$Event(90009889, Default, function() {
    //Fell Twins
    if (EventFlag(1049302085) && EventFlag(1049300222))
        SetEventFlagID(1049302262, ON);
    //Spiritcaller Snail (Mountaintops)
    else if (EventFlag(1049302150) && EventFlag(1049300223))
        SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Mountaintops)
    else if (EventFlag(1049302126) && EventFlag(1049300224))
        SetEventFlagID(1049302262, ON);
    //Crucible Knight Ordovis
    else if (EventFlag(1049302124) && EventFlag(1049300203))
        SetEventFlagID(1049302262, ON);
    //Decaying Ekzykes
    else if (EventFlag(1049302030) && EventFlag(1049300205))
        SetEventFlagID(1049302262, ON);
    //Mohg, the Omen
    else if (EventFlag(1049302039) && EventFlag(1049300229))
        SetEventFlagID(1049302262, ON);
    //Roundtable Knight Vyke
    else if (EventFlag(1049302104) && EventFlag(1049300230))
        SetEventFlagID(1049302262, ON);
    //Rykard, Lord of Blasphemy
    else if (EventFlag(1049302007) && EventFlag(1049300231))
        SetEventFlagID(1049302262, ON);
    //Commander Niall
    else if (EventFlag(1049302040) && EventFlag(1049300232))
        SetEventFlagID(1049302262, ON);
    //Beastman of Farum Azula x2
    else if (EventFlag(1049302151) && EventFlag(1049300238))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Mountaintops)
    else if (EventFlag(1049302087) && EventFlag(1049300233))
        SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Mountaintops)
    else if (EventFlag(1049302088) && EventFlag(1049300234))
        SetEventFlagID(1049302262, ON);
    //Full-Grown Fallingstar Beast
    else if (EventFlag(1049302086) && EventFlag(1049300228))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Forbidden Lands)
    else if (EventFlag(1049302089) && EventFlag(1049300236))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302609, ON);
});

//prog rando filter (unobtained items 11)
$Event(90009890, Default, function() {
    //Flying Dragon Greyll
    if (EventFlag(1049302046) && EventFlag(1049300252))
        SetEventFlagID(1049302262, ON);
    //Glintstone Dragon Adula
    else if (EventFlag(1049302047) && EventFlag(1049300253))
        SetEventFlagID(1049302262, ON);
    //Godskin Duo
    else if (EventFlag(1049302042) && EventFlag(1049300235))
        SetEventFlagID(1049302262, ON);
    //Misbegotten Crusader
    else if (EventFlag(1049302152) && EventFlag(1049300244))
        SetEventFlagID(1049302262, ON);
    //Putrid Grave Warden Duelist
    else if (EventFlag(1049302130) && EventFlag(1049300245))
        SetEventFlagID(1049302262, ON);
    //Putrid Tree Spirit (Caelid)
    else if (EventFlag(1049302128) && EventFlag(1049300239))
        SetEventFlagID(1049302262, ON);
    //Stray Mimic
    else if (EventFlag(1049302129) && EventFlag(1049300241))
        SetEventFlagID(1049302262, ON);
    //Alecto, Black Knife Ringleader
    else if (EventFlag(1049302106) && EventFlag(1049300237))
        SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Dragonbarrow)
    else if (EventFlag(1049302090) && EventFlag(1049300250))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Dragonbarrow)
    else if (EventFlag(1049302092) && EventFlag(1049300254))
        SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Dragonbarrow)
    else if (EventFlag(1049302093) && EventFlag(1049300255))
        SetEventFlagID(1049302262, ON);
    //Sir Gideon Ofnir, the All-Knowing
    else if (EventFlag(1049302044) && EventFlag(1049300240))
        SetEventFlagID(1049302262, ON);
    //Godskin Apostle (Caelid)
    else if (EventFlag(1049302043) && EventFlag(1049300247))
        SetEventFlagID(1049302262, ON);
    //Fire Giant
    else if (EventFlag(1049302008) && EventFlag(1049300246))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302610, ON);
});

//prog rando filter (unobtained items 12)
$Event(90009891, Default, function() {
    //Beast Clergyman / Maliketh
    if (EventFlag(1049302009) && EventFlag(1049300248))
        SetEventFlagID(1049302262, ON);
    //Godfrey / Hoarah Loux
    else if (EventFlag(1049302010) && EventFlag(1049300249))
        SetEventFlagID(1049302262, ON);
    //Astel, Stars of Darkness
    else if (EventFlag(1049302166) && EventFlag(1049300242))
        SetEventFlagID(1049302262, ON);
    //Black Blade Kindred (Dragonbarrow)
    else if (EventFlag(1049302091) && EventFlag(1049300251))
        SetEventFlagID(1049302262, ON);
    //Borealis, the Freezing Fog
    else if (EventFlag(1049302045) && EventFlag(1049300243))
        SetEventFlagID(1049302262, ON);
    //Loretta, Knight of the Haligtree
    else if (EventFlag(1049302048) && EventFlag(1049300258))
        SetEventFlagID(1049302262, ON);
    //Night's Cavalry x2
    else if (EventFlag(1049302095) && EventFlag(1049300259))
        SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Consecrated Snowfield)
    else if (EventFlag(1049302096) && EventFlag(1049300260))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Consecrated Snowfield)
    else if (EventFlag(1049302094) && EventFlag(1049300256))
        SetEventFlagID(1049302262, ON);
    //Great Wyrm Theodorix
    else if (EventFlag(1049302049) && EventFlag(1049300257))
        SetEventFlagID(1049302262, ON);
    //Malenia, Blade of Miquella
    else if (EventFlag(1049302016) && EventFlag(1049300261))
        SetEventFlagID(1049302262, ON);
    //Dragonlord Placidusax
    else if (EventFlag(1049302011) && EventFlag(1049300262))
        SetEventFlagID(1049302262, ON);
    //Radagon / Elden Beast
    else if (EventFlag(1049302012) && EventFlag(1049300263))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302611, ON);
});

//prog rando filter (unobtained items 13)
$Event(90009892, Default, function() {
    //Mohg, Lord of Blood
    if (EventFlag(1049302015) && EventFlag(1049300264))
        SetEventFlagID(1049302262, ON);
    //Curseblade Labirith
    else if (EventFlag(1049302184) && EventFlag(1049300265))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Marigga
    else if (EventFlag(1049302187) && EventFlag(1049300266))
        SetEventFlagID(1049302262, ON);
    //Demi-Human Swordmaster Onze
    else if (EventFlag(1049302179) && EventFlag(1049300267))
        SetEventFlagID(1049302262, ON);
    //Chief Bloodfiend
    else if (EventFlag(1049302183) && EventFlag(1049300268))
        SetEventFlagID(1049302262, ON);
    //Dancer of Ranah
    else if (EventFlag(1049302182) && EventFlag(1049300269))
        SetEventFlagID(1049302262, ON);
    //Death Knight (Gravesite Plain)
    else if (EventFlag(1049302180) && EventFlag(1049300270))
        SetEventFlagID(1049302262, ON);
    //Divine Beast Dancing Lion
    else if (EventFlag(1049302167) && EventFlag(1049300271))
        SetEventFlagID(1049302262, ON);
    //Ancient Dragon-Man
    else if (EventFlag(1049302200) && EventFlag(1049300272))
        SetEventFlagID(1049302262, ON);
    //Black Knight Edredd
    else if (EventFlag(1049302190) && EventFlag(1049300273))
        SetEventFlagID(1049302262, ON);
    //Dryleaf Dane
    else if (EventFlag(1049302195) && EventFlag(1049300275))
        SetEventFlagID(1049302262, ON);
    //Knight of the Solitary Gaol
    else if (EventFlag(1049302198) && EventFlag(1049300276))
        SetEventFlagID(1049302262, ON);
    //Black Knight Garrew
    else if (EventFlag(1049302191) && EventFlag(1049300277))
        SetEventFlagID(1049302262, ON);
    //Red Bear
    else if (EventFlag(1049302185) && EventFlag(1049300278))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302612, ON);
});

//prog rando filter (unobtained items 14)
$Event(90009893, Default, function() {
    //Count Ymir, Mother of Fingers
    if (EventFlag(1049302207) && EventFlag(1049300274))
        SetEventFlagID(1049302262, ON);
    //Crucible Knight Devonia
    else if (EventFlag(1049302208) && EventFlag(1049300279))
        SetEventFlagID(1049302262, ON);
    //Death Knight (Rauh Base)
    else if (EventFlag(1049302186) && EventFlag(1049300280))
        SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Gravesite Plain)
    else if (EventFlag(1049302181) && EventFlag(1049300281))
        SetEventFlagID(1049302262, ON);
    //Ralva the Great Red Bear
    else if (EventFlag(1049302193) && EventFlag(1049300282))
        SetEventFlagID(1049302262, ON);
    //Rellana, Twin Moon Knight
    else if (EventFlag(1049302168) && EventFlag(1049300283))
        SetEventFlagID(1049302262, ON);
    //Golden Hippopotamus
    else if (EventFlag(1049302169) && EventFlag(1049300284))
        SetEventFlagID(1049302262, ON);
    //Jagged Peak Drake
    else if (EventFlag(1049302196) && EventFlag(1049300285))
        SetEventFlagID(1049302262, ON);
    //Rugalea, the Great Red Bear
    else if (EventFlag(1049302197) && EventFlag(1049300286))
        SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Charo's Hidden Grave)
    else if (EventFlag(1049302194) && EventFlag(1049300287))
        SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Cerulean Coast)
    else if (EventFlag(1049302188) && EventFlag(1049300288))
        SetEventFlagID(1049302262, ON);
    //Jori, Elder Inquisitor
    else if (EventFlag(1049302199) && EventFlag(1049300289))
        SetEventFlagID(1049302262, ON);
    //Lamenter
    else if (EventFlag(1049302189) && EventFlag(1049300290))
        SetEventFlagID(1049302262, ON);
    //Rakshasa
    else if (EventFlag(1049302206) && EventFlag(1049300291))
        SetEventFlagID(1049302262, ON);
    //Putrescent Knight
    else if (EventFlag(1049302170) && EventFlag(1049300292))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302613, ON);
});

//prog rando filter (unobtained items 15)
$Event(90009894, Default, function() {
    //Scadutree Avatar
    if (EventFlag(1049302171) && EventFlag(1049300293))
        SetEventFlagID(1049302262, ON);
    //Commander Gaius
    else if (EventFlag(1049302172) && EventFlag(1049300294))
        SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Hinterland)
    else if (EventFlag(1049302202) && EventFlag(1049300295))
        SetEventFlagID(1049302262, ON);
    //Tree Sentinel x2 (Hinterland)
    else if (EventFlag(1049302204) && EventFlag(1049300296))
        SetEventFlagID(1049302262, ON);
    //Divine Beast Dancing Lion (Rauh)
    else if (EventFlag(1049302201) && EventFlag(1049300297))
        SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Scadu Altus)
    else if (EventFlag(1049302192) && EventFlag(1049300298))
        SetEventFlagID(1049302262, ON);
    //Jagged Peak Drake x2
    else if (EventFlag(1049302203) && EventFlag(1049300299))
        SetEventFlagID(1049302262, ON);
    //Messmer the Impaler
    else if (EventFlag(1049302173) && EventFlag(1049300300))
        SetEventFlagID(1049302262, ON);
    //Midra, Lord of Frenzied Flame
    else if (EventFlag(1049302175) && EventFlag(1049300301))
        SetEventFlagID(1049302262, ON);
    //Romina, Saint of the Bud
    else if (EventFlag(1049302176) && EventFlag(1049300302))
        SetEventFlagID(1049302262, ON);
    //Metyr, Mother of Fingers
    else if (EventFlag(1049302174) && EventFlag(1049300303))
        SetEventFlagID(1049302262, ON);
    //Ancient Dragon Senessax
    else if (EventFlag(1049302205) && EventFlag(1049300304))
        SetEventFlagID(1049302262, ON);
    //Radahn, Consort of Miquella
    else if (EventFlag(1049302177) && EventFlag(1049300305))
        SetEventFlagID(1049302262, ON);
    //Bayle the Dread
    else if (EventFlag(1049302178) && EventFlag(1049300306))
        SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302614, ON);
});

//prog sequential mode tier selection (undefeated bosses)
$Event(90009930, Default, function() {
    if (EventFlag(1049308301)) //tier 1
        $InitializeCommonEvent(0, 90009931);
    else if (EventFlag(1049308302))
        $InitializeCommonEvent(0, 90009932);
    else if (EventFlag(1049308303))
        $InitializeCommonEvent(0, 90009933);
    else if (EventFlag(1049308304))
        $InitializeCommonEvent(0, 90009934);
    else if (EventFlag(1049308305))
        $InitializeCommonEvent(0, 90009935);
    else if (EventFlag(1049308306))
        $InitializeCommonEvent(0, 90009936);
    else if (EventFlag(1049308307))
        $InitializeCommonEvent(0, 90009937);
    else if (EventFlag(1049308308))
        $InitializeCommonEvent(0, 90009938);
    else if (EventFlag(1049308309))
        $InitializeCommonEvent(0, 90009939);
    else if (EventFlag(1049308310))
        $InitializeCommonEvent(0, 90009940);
    else if (EventFlag(1049308311))
        $InitializeCommonEvent(0, 90009941);
    else if (EventFlag(1049308312)) //tier dlc1
        $InitializeCommonEvent(0, 90009942);
    else if (EventFlag(1049308313))
        $InitializeCommonEvent(0, 90009943);
    else if (EventFlag(1049308314))
        $InitializeCommonEvent(0, 90009944);
    else if (EventFlag(1049308315))
        $InitializeCommonEvent(0, 90009945);
    else if (EventFlag(1049308316))
        $InitializeCommonEvent(0, 90009946);
});


//prog sequential mode tier 1 (undefeated bosses)
$Event(90009931, Default, function() {
    //Soldier of Godrick
    if (!EventFlag(1049304100))
        SetEventFlagID(1049302131, ON);
    
    //Guardian Golem
    else if (!EventFlag(1049304105))
        SetEventFlagID(1049302134, ON);
    

    
    
    //Cemetery Shade (Weeping Peninsula)
    else if (!EventFlag(1049304110))
        SetEventFlagID(1049302110, ON);
    
    
    
    //Scaly Misbegotten
    else if (!EventFlag(1049304114))
        SetEventFlagID(1049302155, ON);
    

    
    //Tibia Mariner (Limgrave)
    else if (!EventFlag(1049304120)) {
        SetEventFlagID(1049302053, ON);
    }
    
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 2 (undefeated bosses)
$Event(90009932, Default, function() {

    
    //Erdtree Avatar (Weeping Peninsula)
    if (!EventFlag(1049304124))
        SetEventFlagID(1049302056, ON);

    //Night's Cavalry (Weeping Peninsula)
    else if (!EventFlag(1049304125))
        SetEventFlagID(1049302057, ON);

    
    //Dragonkin Soldier of Nokstella
    else if (!EventFlag(1049304129))
        SetEventFlagID(1049302019, ON);
    
    //Crystalian
    else if (!EventFlag(1049304136))
        SetEventFlagID(1049302156, ON);
    
    
    //Ancestor Spirit
    else if (!EventFlag(1049304131))
        SetEventFlagID(1049302021, ON);    

    
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 3 (undefeated bosses)
$Event(90009933, Default, function() {
    
        
     //Crystalian x2 (Liurnia)
    if (!EventFlag(1049304147))
        SetEventFlagID(1049302141, ON);
    

    //Erdtree Burial Watchdog (Liurnia)
    else if (!EventFlag(1049304138))
        SetEventFlagID(1049302114, ON);

    //Royal Knight Loretta
    else if (!EventFlag(1049304143))
        SetEventFlagID(1049302023, ON);
    
        //Magma Wyrm Makar
    else if (!EventFlag(1049304154))
        SetEventFlagID(1049302024, ON);
    
    //Rennala, Queen of the Full Moon
    else if (!EventFlag(1049304155))
        SetEventFlagID(1049302001, ON);
    
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 4 (undefeated bosses)
$Event(90009934, Default, function() {

        
    //Frenzied Duelist
    if (!EventFlag(1049304150))
        SetEventFlagID(1049302142, ON);
    
    //Fallingstar Beast (Caelid)
    else if (!EventFlag(1049304149))
        SetEventFlagID(1049302158, ON);
    
    //Death Rite Bird (Liurnia)
    else if (!EventFlag(1049304161))
        SetEventFlagID(1049302062, ON);
    
    //Valiant Gargoyles
    else if (!EventFlag(1049304214))
        SetEventFlagID(1049302036, ON);
    
    //Regal Ancestor Spirit
    else if (!EventFlag(1049304188))
        SetEventFlagID(1049302002, ON);
    

    else { //no undefeated bosses left
           $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 5 (undefeated bosses)
$Event(90009935, Default, function() {
    
    //Glintstone Dragon Smarag
    if (!EventFlag(1049304180))
        SetEventFlagID(1049302028, ON);


    //Onyx Lord (Capital Outskirts)
    else if (!EventFlag(1049304184))
        SetEventFlagID(1049302165, ON);
    
    //Morgott, the Omen King
    else if (!EventFlag(1049304218))
        SetEventFlagID(1049302006, ON);

    //Astel, Naturalborn of the Void
    else if (!EventFlag(1049304216))
        SetEventFlagID(1049302004, ON);
    
    //Lichdragon Fortissax
    else if (!EventFlag(1049304217))
        SetEventFlagID(1049302005, ON);

    

    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 6 (undefeated bosses)
$Event(90009936, Default, function() {

    
    //Dragonkin Soldier (Siofra)
    if (!EventFlag(1049304208))
        SetEventFlagID(1049302031, ON);
    
        //Decaying Ekzykes
    else if (!EventFlag(1049304205))
        SetEventFlagID(1049302030, ON);
    
        //Fell Twins
    else if (!EventFlag(1049304222))
        SetEventFlagID(1049302085, ON);
    
    //Spiritcaller Snail (Mountaintops)
    else if (!EventFlag(1049304223))
        SetEventFlagID(1049302150, ON);
    
    //Rykard, Lord of Blasphemy
    else if (!EventFlag(1049304231))
        SetEventFlagID(1049302007, ON);
    
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 7 (undefeated bosses)
$Event(90009937, Default, function() {
    
    //Esgar, Priest of Blood
    if (!EventFlag(1049304227))
        SetEventFlagID(1049302127, ON);
    
    //Crucible Knight Siluria
    else if (!EventFlag(1049304225))
        SetEventFlagID(1049302041, ON);
    
    //Erdtree Avatar (Mountaintops)
    else if (!EventFlag(1049304234))
        SetEventFlagID(1049302088, ON);
    
    //Beastman of Farum Azula x2
    else if (!EventFlag(1049304238))
        SetEventFlagID(1049302151, ON);
    
    //Beast Clergyman / Maliketh
    else if (!EventFlag(1049304248))
        SetEventFlagID(1049302009, ON);
    
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 8 (undefeated bosses)
$Event(90009938, Default, function() {
    
        //Godskin Apostle (Caelid)
    if (!EventFlag(1049304247))
        SetEventFlagID(1049302043, ON);
    
        //Putrid Tree Spirit (Caelid)
    else if (!EventFlag(1049304239))
        SetEventFlagID(1049302128, ON);
    
        //Misbegotten Crusader
    else if (!EventFlag(1049304244))
        SetEventFlagID(1049302152, ON);
    
       //Astel, Stars of Darkness
    else if (!EventFlag(1049304242))
        SetEventFlagID(1049302166, ON);
       
        //Godfrey / Hoarah Loux
    else if (!EventFlag(1049304249))
        SetEventFlagID(1049302010, ON);
    

    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 9 (undefeated bosses)
$Event(90009939, Default, function() {
    
        //Glintstone Dragon Adula
    if (!EventFlag(1049304253))
        SetEventFlagID(1049302047, ON);
    
        //Dragonlord Placidusax
    else if (!EventFlag(1049304262))
        SetEventFlagID(1049302011, ON);
    
    
        //Mohg, Lord of Blood
    else if (!EventFlag(1049304264))
        SetEventFlagID(1049302015, ON);
    
    //Malenia, Blade of Miquella
    else if (!EventFlag(1049304261))
        SetEventFlagID(1049302016, ON);    
    
    //Radagon / Elden Beast
    else if (!EventFlag(1049304263))
        SetEventFlagID(1049302012, ON);    
    

    else { //no undefeated bosses left
        DisplayBanner(TextBannerType.Victory);   // gold swipe + your "BOSS RUSH COMPLETE! GG!"
        WaitFixedTimeSeconds(5);                 // let the banner land
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 10 (undefeated bosses)
$Event(90009940, Default, function() {
    //Beastman of Farum Azula x2
    if (!EventFlag(1049304238))
        SetEventFlagID(1049302151, ON);
    //Death Rite Bird (Mountaintops)
    else if (!EventFlag(1049304233))
        SetEventFlagID(1049302087, ON);
    //Erdtree Avatar (Mountaintops)
    else if (!EventFlag(1049304234))
        SetEventFlagID(1049302088, ON);
    //Full-Grown Fallingstar Beast
    else if (!EventFlag(1049304228))
        SetEventFlagID(1049302086, ON);
    //Night's Cavalry (Forbidden Lands)
    else if (!EventFlag(1049304236))
        SetEventFlagID(1049302089, ON);
    //Flying Dragon Greyll
    else if (!EventFlag(1049304252))
        SetEventFlagID(1049302046, ON);
    //Glintstone Dragon Adula
    else if (!EventFlag(1049304253))
        SetEventFlagID(1049302047, ON);
    //Godskin Duo
    else if (!EventFlag(1049304235))
        SetEventFlagID(1049302042, ON);
    //Misbegotten Crusader
    else if (!EventFlag(1049304244))
        SetEventFlagID(1049302152, ON);
    //Putrid Grave Warden Duelist
    else if (!EventFlag(1049304245))
        SetEventFlagID(1049302130, ON);
    //Putrid Tree Spirit (Caelid)
    else if (!EventFlag(1049304239))
        SetEventFlagID(1049302128, ON);
    //Stray Mimic
    else if (!EventFlag(1049304241))
        SetEventFlagID(1049302129, ON);
    //Alecto, Black Knife Ringleader
    else if (!EventFlag(1049304237))
        SetEventFlagID(1049302106, ON);
    //Bell Bearing Hunter (Dragonbarrow)
    else if (!EventFlag(1049304250))
        SetEventFlagID(1049302090, ON);
    //Night's Cavalry (Dragonbarrow)
    else if (!EventFlag(1049304254))
        SetEventFlagID(1049302092, ON);
    //Putrid Avatar (Dragonbarrow)
    else if (!EventFlag(1049304255))
        SetEventFlagID(1049302093, ON);
    //Sir Gideon Ofnir, the All-Knowing
    else if (!EventFlag(1049304240))
        SetEventFlagID(1049302044, ON);
    //Godskin Apostle (Caelid)
    else if (!EventFlag(1049304247))
        SetEventFlagID(1049302043, ON);
    //Fire Giant
    else if (!EventFlag(1049304246))
        SetEventFlagID(1049302008, ON);
    //Beast Clergyman / Maliketh
    else if (!EventFlag(1049304248))
        SetEventFlagID(1049302009, ON);
    //Godfrey / Hoarah Loux
    else if (!EventFlag(1049304249))
        SetEventFlagID(1049302010, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 11 (undefeated bosses)
$Event(90009941, Default, function() {
    //Astel, Stars of Darkness
    if (!EventFlag(1049304242))
        SetEventFlagID(1049302166, ON);
    //Black Blade Kindred (Dragonbarrow)
    else if (!EventFlag(1049304251))
        SetEventFlagID(1049302091, ON);
    //Borealis, the Freezing Fog
    else if (!EventFlag(1049304243))
        SetEventFlagID(1049302045, ON);
    //Loretta, Knight of the Haligtree
    else if (!EventFlag(1049304258))
        SetEventFlagID(1049302048, ON);
    //Night's Cavalry x2
    else if (!EventFlag(1049304259))
        SetEventFlagID(1049302095, ON);
    //Putrid Avatar (Consecrated Snowfield)
    else if (!EventFlag(1049304260))
        SetEventFlagID(1049302096, ON);
    //Death Rite Bird (Consecrated Snowfield)
    else if (!EventFlag(1049304256))
        SetEventFlagID(1049302094, ON);
    //Great Wyrm Theodorix
    else if (!EventFlag(1049304257))
        SetEventFlagID(1049302049, ON);
    //Malenia, Blade of Miquella
    else if (!EventFlag(1049304261))
        SetEventFlagID(1049302016, ON);
    //Dragonlord Placidusax
    else if (!EventFlag(1049304262))
        SetEventFlagID(1049302011, ON);
    //Radagon / Elden Beast
    else if (!EventFlag(1049304263))
        SetEventFlagID(1049302012, ON);
    //Mohg, Lord of Blood
    else if (!EventFlag(1049304264))
        SetEventFlagID(1049302015, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc1 (undefeated bosses)
$Event(90009942, Default, function() {
    //Curseblade Labirith
    if (!EventFlag(1049304265))
        SetEventFlagID(1049302184, ON);
    //Demi-Human Queen Marigga
    else if (!EventFlag(1049304266))
        SetEventFlagID(1049302187, ON);
    //Demi-Human Swordmaster Onze
    else if (!EventFlag(1049304267))
        SetEventFlagID(1049302179, ON);
    //Chief Bloodfiend
    else if (!EventFlag(1049304268))
        SetEventFlagID(1049302183, ON);
    //Dancer of Ranah
    else if (!EventFlag(1049304269))
        SetEventFlagID(1049302182, ON);
    //Death Knight (Gravesite Plain)
    else if (!EventFlag(1049304270))
        SetEventFlagID(1049302180, ON);
    //Divine Beast Dancing Lion
    else if (!EventFlag(1049304271))
        SetEventFlagID(1049302167, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc2 (undefeated bosses)
$Event(90009943, Default, function() {
    //Ancient Dragon-Man
    if (!EventFlag(1049304272))
        SetEventFlagID(1049302200, ON);
    //Black Knight Edredd
    else if (!EventFlag(1049304273))
        SetEventFlagID(1049302190, ON);
    //Dryleaf Dane
    else if (!EventFlag(1049304275))
        SetEventFlagID(1049302195, ON);
    //Knight of the Solitary Gaol
    else if (!EventFlag(1049304276))
        SetEventFlagID(1049302198, ON);
    //Black Knight Garrew
    else if (!EventFlag(1049304277))
        SetEventFlagID(1049302191, ON);
    //Red Bear
    else if (!EventFlag(1049304278))
        SetEventFlagID(1049302185, ON);
    //Count Ymir, Mother of Fingers
    else if (!EventFlag(1049304274))
        SetEventFlagID(1049302207, ON);
    //Crucible Knight Devonia
    else if (!EventFlag(1049304279))
        SetEventFlagID(1049302208, ON);
    //Death Knight (Rauh Base)
    else if (!EventFlag(1049304280))
        SetEventFlagID(1049302186, ON);
    //Ghostflame Dragon (Gravesite Plain)
    else if (!EventFlag(1049304281))
        SetEventFlagID(1049302181, ON);
    //Ralva the Great Red Bear
    else if (!EventFlag(1049304282))
        SetEventFlagID(1049302193, ON);
    //Rellana, Twin Moon Knight
    else if (!EventFlag(1049304283))
        SetEventFlagID(1049302168, ON);
    //Golden Hippopotamus
    else if (!EventFlag(1049304284))
        SetEventFlagID(1049302169, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc3 (undefeated bosses)
$Event(90009944, Default, function() {
    //Jagged Peak Drake
    if (!EventFlag(1049304285))
        SetEventFlagID(1049302196, ON);
    //Rugalea, the Great Red Bear
    else if (!EventFlag(1049304286))
        SetEventFlagID(1049302197, ON);
    //Death Rite Bird (Charo's Hidden Grave)
    else if (!EventFlag(1049304287))
        SetEventFlagID(1049302194, ON);
    //Ghostflame Dragon (Cerulean Coast)
    else if (!EventFlag(1049304288))
        SetEventFlagID(1049302188, ON);
    //Jori, Elder Inquisitor
    else if (!EventFlag(1049304289))
        SetEventFlagID(1049302199, ON);
    //Lamenter
    else if (!EventFlag(1049304290))
        SetEventFlagID(1049302189, ON);
    //Rakshasa
    else if (!EventFlag(1049304291))
        SetEventFlagID(1049302206, ON);
    //Putrescent Knight
    else if (!EventFlag(1049304292))
        SetEventFlagID(1049302170, ON);
    //Scadutree Avatar
    else if (!EventFlag(1049304293))
        SetEventFlagID(1049302171, ON);
    //Commander Gaius
    else if (!EventFlag(1049304294))
        SetEventFlagID(1049302172, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc4 (undefeated bosses)
$Event(90009945, Default, function() {
    //Fallingstar Beast (Hinterland)
    if (!EventFlag(1049304295))
        SetEventFlagID(1049302202, ON);
    //Tree Sentinel x2 (Hinterland)
    else if (!EventFlag(1049304296))
        SetEventFlagID(1049302204, ON);
    //Divine Beast Dancing Lion (Rauh)
    else if (!EventFlag(1049304297))
        SetEventFlagID(1049302201, ON);
    //Ghostflame Dragon (Scadu Altus)
    else if (!EventFlag(1049304298))
        SetEventFlagID(1049302192, ON);
    //Jagged Peak Drake x2
    else if (!EventFlag(1049304299))
        SetEventFlagID(1049302203, ON);
    //Messmer the Impaler
    else if (!EventFlag(1049304300))
        SetEventFlagID(1049302173, ON);
    //Midra, Lord of Frenzied Flame
    else if (!EventFlag(1049304301))
        SetEventFlagID(1049302175, ON);
    //Romina, Saint of the Bud
    else if (!EventFlag(1049304302))
        SetEventFlagID(1049302176, ON);
    //Metyr, Mother of Fingers
    else if (!EventFlag(1049304303))
        SetEventFlagID(1049302174, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc5 (undefeated bosses)
$Event(90009946, Default, function() {
    //Ancient Dragon Senessax
    if (!EventFlag(1049304304))
        SetEventFlagID(1049302205, ON);
    //Radahn, Consort of Miquella
    else if (!EventFlag(1049304305))
        SetEventFlagID(1049302177, ON);
    //Bayle the Dread
    else if (!EventFlag(1049304306))
        SetEventFlagID(1049302178, ON);
    else { //no undefeated bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier selection (all bosses)
$Event(90009950, Default, function() {
    if (EventFlag(1049308321)) //tier 1
        $InitializeCommonEvent(0, 90009951);
    else if (EventFlag(1049308322))
        $InitializeCommonEvent(0, 90009952);
    else if (EventFlag(1049308323))
        $InitializeCommonEvent(0, 90009953);
    else if (EventFlag(1049308324))
        $InitializeCommonEvent(0, 90009954);
    else if (EventFlag(1049308325))
        $InitializeCommonEvent(0, 90009955);
    else if (EventFlag(1049308326))
        $InitializeCommonEvent(0, 90009956);
    else if (EventFlag(1049308327))
        $InitializeCommonEvent(0, 90009957);
    else if (EventFlag(1049308328))
        $InitializeCommonEvent(0, 90009958);
    else if (EventFlag(1049308329))
        $InitializeCommonEvent(0, 90009959);
    else if (EventFlag(1049308330))
        $InitializeCommonEvent(0, 90009960);
    else if (EventFlag(1049308331))
        $InitializeCommonEvent(0, 90009961);
    else if (EventFlag(1049308332)) //tier dlc1
        $InitializeCommonEvent(0, 90009962);
    else if (EventFlag(1049308333))
        $InitializeCommonEvent(0, 90009963);
    else if (EventFlag(1049308334))
        $InitializeCommonEvent(0, 90009964);
    else if (EventFlag(1049308335))
        $InitializeCommonEvent(0, 90009965);
    else if (EventFlag(1049308336))
        $InitializeCommonEvent(0, 90009966);
});

//prog sequential mode tier 1 (all bosses) - 5-boss tier (Ignite Rush)
$Event(90009951, Default, function() {
    //Soldier of Godrick
    if (!EventFlag(1049304100))
        SetEventFlagID(1049302131, ON);

    //Guardian Golem
    else if (!EventFlag(1049304105))
        SetEventFlagID(1049302134, ON);

    //Cemetery Shade (Weeping Peninsula)
    else if (!EventFlag(1049304110))
        SetEventFlagID(1049302110, ON);

    //Scaly Misbegotten
    else if (!EventFlag(1049304114))
        SetEventFlagID(1049302155, ON);

    //Tibia Mariner (Limgrave)
    else if (!EventFlag(1049304120)){
        SetEventFlagID(1049302053, ON);
    }

    else { //no bosses left
        //$InitializeCommonEvent(0, 90009991); //OnTierClear tier 1 (Amber Shard award + shop progression)
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 2 (all bosses)
$Event(90009952, Default, function() {
    //Bloodhound Knight Darriwil
    if (EventFlag(1049307399))
        SetEventFlagID(1049302097, ON);
    //Deathbird (Limgrave)
    else if (EventFlag(1049307497))
        SetEventFlagID(1049302051, ON);
    //Night's Cavalry (Limgrave)
    else if (EventFlag(1049307451))
        SetEventFlagID(1049302052, ON);
    //Tibia Mariner (Limgrave)
    else if (EventFlag(1049307452))
        SetEventFlagID(1049302053, ON);
    //Tree Sentinel (Limgrave)
    else if (EventFlag(1049307453))
        SetEventFlagID(1049302054, ON);
    //Ancient Hero of Zamor (Weeping Peninsula)
    else if (EventFlag(1049307454))
        SetEventFlagID(1049302098, ON);
    //Bell Bearing Hunter (Limgrave)
    else if (EventFlag(1049307498))
        SetEventFlagID(1049302050, ON);
    //Deathbird (Weeping Peninsula)
    else if (EventFlag(1049307450))
        SetEventFlagID(1049302055, ON);
    //Erdtree Avatar (Weeping Peninsula)
    else if (EventFlag(1049307455))
        SetEventFlagID(1049302056, ON);
    //Night's Cavalry (Weeping Peninsula)
    else if (EventFlag(1049307456))
        SetEventFlagID(1049302057, ON);
    //Margit, the Fell Omen
    else if (EventFlag(1049307457))
        SetEventFlagID(1049302018, ON);
    //Godrick the Grafted
    else if (EventFlag(1049307418))
        SetEventFlagID(1049302000, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 3 (all bosses)
$Event(90009953, Default, function() {
    //Crucible Knight (Limgrave)
    if (EventFlag(1049307399))
        SetEventFlagID(1049302099, ON);
    //Flying Dragon Agheel
    else if (EventFlag(1049307499))
        SetEventFlagID(1049302020, ON);
    //Ancestor Spirit
    else if (EventFlag(1049307420))
        SetEventFlagID(1049302021, ON);
    //Black Knife Assassin (Liurnia)
    else if (EventFlag(1049307421))
        SetEventFlagID(1049302112, ON);
    //Bloodhound Knight
    else if (EventFlag(1049307512))
        SetEventFlagID(1049302138, ON);
    //Cemetery Shade (Liurnia)
    else if (EventFlag(1049307538))
        SetEventFlagID(1049302113, ON);
    //Cleanrot Knight
    else if (EventFlag(1049307513))
        SetEventFlagID(1049302139, ON);
    //Crystalian
    else if (EventFlag(1049307539))
        SetEventFlagID(1049302156, ON);
    //Erdtree Burial Watchdog (Liurnia)
    else if (EventFlag(1049307556))
        SetEventFlagID(1049302114, ON);
    //Grafted Scion
    else if (EventFlag(1049307514))
        SetEventFlagID(1049302058, ON);
    //Omenkiller (Albinauric Village)
    else if (EventFlag(1049307458))
        SetEventFlagID(1049302066, ON);
    //Royal Revenant
    else if (EventFlag(1049307466))
        SetEventFlagID(1049302157, ON);
    //Spiritcaller Snail (Liurnia)
    else if (EventFlag(1049307557))
        SetEventFlagID(1049302115, ON);
    //Ulcerated Tree Spirit (Limgrave)
    else if (EventFlag(1049307515))
        SetEventFlagID(1049302116, ON);
    //Dragonkin Soldier of Nokstella
    else if (EventFlag(1049307516))
        SetEventFlagID(1049302019, ON);
    //Red Wolf of Radagon
    else if (EventFlag(1049307419))
        SetEventFlagID(1049302022, ON);
    //Royal Knight Loretta
    else if (EventFlag(1049307422))
        SetEventFlagID(1049302023, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 4 (all bosses)
$Event(90009954, Default, function() {
    //Adan, Thief of Fire
    if (EventFlag(1049307399))
        SetEventFlagID(1049302100, ON);
    //Cemetery Shade (Caelid)
    else if (EventFlag(1049307500))
        SetEventFlagID(1049302117, ON);
    //Cleanrot Knight x2
    else if (EventFlag(1049307517))
        SetEventFlagID(1049302140, ON);
    //Crystalian x2 (Liurnia)
    else if (EventFlag(1049307540))
        SetEventFlagID(1049302141, ON);
    //Deathbird (Liurnia)
    else if (EventFlag(1049307541))
        SetEventFlagID(1049302061, ON);
    //Demi-Human Queen Gilika
    else if (EventFlag(1049307461))
        SetEventFlagID(1049302161, ON);
    //Erdtree Burial Watchdog x2
    else if (EventFlag(1049307561))
        SetEventFlagID(1049302118, ON);
    //Frenzied Duelist
    else if (EventFlag(1049307518))
        SetEventFlagID(1049302142, ON);
    //Mad Pumpkin Head x2
    else if (EventFlag(1049307542))
        SetEventFlagID(1049302159, ON);
    //Night's Cavalry (Liurnia East)
    else if (EventFlag(1049307559))
        SetEventFlagID(1049302070, ON);
    //Nox Swordstress & Nox Monk
    else if (EventFlag(1049307470))
        SetEventFlagID(1049302059, ON);
    //Magma Wyrm Makar
    else if (EventFlag(1049307459))
        SetEventFlagID(1049302024, ON);
    //Rennala, Queen of the Full Moon
    else if (EventFlag(1049307424))
        SetEventFlagID(1049302001, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 5 (all bosses)
$Event(90009955, Default, function() {
    //Abductor Virgins
    if (EventFlag(1049307399))
        SetEventFlagID(1049302143, ON);
    //Ancient Hero of Zamor (Altus)
    else if (EventFlag(1049307543))
        SetEventFlagID(1049302119, ON);
    //Bell Bearing Hunter (Liurnia)
    else if (EventFlag(1049307519))
        SetEventFlagID(1049302060, ON);
    //Bols, Carian Knight
    else if (EventFlag(1049307460))
        SetEventFlagID(1049302101, ON);
    //Death Rite Bird (Liurnia)
    else if (EventFlag(1049307501))
        SetEventFlagID(1049302062, ON);
    //Demi-Human Queen Margot
    else if (EventFlag(1049307462))
        SetEventFlagID(1049302144, ON);
    //Erdtree Avatar (Liurnia East)
    else if (EventFlag(1049307544))
        SetEventFlagID(1049302064, ON);
    //Erdtree Avatar (Liurnia West)
    else if (EventFlag(1049307464))
        SetEventFlagID(1049302063, ON);
    //Fallingstar Beast (Caelid)
    else if (EventFlag(1049307463))
        SetEventFlagID(1049302158, ON);
    //Kindred of Rot x2
    else if (EventFlag(1049307558))
        SetEventFlagID(1049302145, ON);
    //Magma Wyrm (Caelid)
    else if (EventFlag(1049307545))
        SetEventFlagID(1049302160, ON);
    //Night's Cavalry (Liurnia North)
    else if (EventFlag(1049307560))
        SetEventFlagID(1049302065, ON);
    //Onyx Lord (Liurnia)
    else if (EventFlag(1049307465))
        SetEventFlagID(1049302102, ON);
    //Perfumer Tricia & Misbegotten Warrior
    else if (EventFlag(1049307502))
        SetEventFlagID(1049302120, ON);
    //Red Wolf of the Champion
    else if (EventFlag(1049307520))
        SetEventFlagID(1049302123, ON);
    //Sanguine Noble
    else if (EventFlag(1049307523))
        SetEventFlagID(1049302162, ON);
    //Stonedigger Troll (Altus)
    else if (EventFlag(1049307562))
        SetEventFlagID(1049302163, ON);
    //Tibia Mariner (Liurnia)
    else if (EventFlag(1049307563))
        SetEventFlagID(1049302067, ON);
    //Elemer of the Briar
    else if (EventFlag(1049307467))
        SetEventFlagID(1049302027, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 6 (all bosses)
$Event(90009956, Default, function() {
    //Battlemage Hugues
    if (EventFlag(1049307399))
        SetEventFlagID(1049302103, ON);
    //Black Knife Assassin (Invisible)
    else if (EventFlag(1049307503))
        SetEventFlagID(1049302146, ON);
    //Commander O'Neil
    else if (EventFlag(1049307546))
        SetEventFlagID(1049302026, ON);
    //Crystalian x2 (Altus)
    else if (EventFlag(1049307426))
        SetEventFlagID(1049302164, ON);
    //Death Rite Bird (Caelid)
    else if (EventFlag(1049307564))
        SetEventFlagID(1049302068, ON);
    //Dragonkin Soldier (Siofra)
    else if (EventFlag(1049307468))
        SetEventFlagID(1049302031, ON);
    //Erdtree Burial Watchdog (Altus)
    else if (EventFlag(1049307431))
        SetEventFlagID(1049302121, ON);
    //Glintstone Dragon Smarag
    else if (EventFlag(1049307521))
        SetEventFlagID(1049302028, ON);
    //Grave Warden Duelist (Capital Outskirts)
    else if (EventFlag(1049307428))
        SetEventFlagID(1049302122, ON);
    //Night's Cavalary (Caelid)
    else if (EventFlag(1049307522))
        SetEventFlagID(1049302069, ON);
    //Omenkiller & Miranda
    else if (EventFlag(1049307469))
        SetEventFlagID(1049302149, ON);
    //Onyx Lord (Capital Outskirts)
    else if (EventFlag(1049307549))
        SetEventFlagID(1049302165, ON);
    //Putrid Avatar (Caelid)
    else if (EventFlag(1049307565))
        SetEventFlagID(1049302071, ON);
    //Misbegotten Warrior & Crucible Knight
    else if (EventFlag(1049307471))
        SetEventFlagID(1049302025, ON);
    //Regal Ancestor Spirit
    else if (EventFlag(1049307425))
        SetEventFlagID(1049302002, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 7 (all bosses)
$Event(90009957, Default, function() {
    //Black Knife Assassin (Altus)
    if (EventFlag(1049307399))
        SetEventFlagID(1049302072, ON);
    //Crystalian x3
    else if (EventFlag(1049307472))
        SetEventFlagID(1049302147, ON);
    //Giant Wormface
    else if (EventFlag(1049307547))
        SetEventFlagID(1049302075, ON);
    //Godfrey, First Elden Lord (Golden Shade)
    else if (EventFlag(1049307475))
        SetEventFlagID(1049302033, ON);
    //Godskin Apostle (Altus)
    else if (EventFlag(1049307433))
        SetEventFlagID(1049302074, ON);
    //Mimic Tear
    else if (EventFlag(1049307474))
        SetEventFlagID(1049302029, ON);
    //Necromancer Garris
    else if (EventFlag(1049307429))
        SetEventFlagID(1049302148, ON);
    //Night's Cavalry (Altus)
    else if (EventFlag(1049307548))
        SetEventFlagID(1049302076, ON);
    //Tree Sentinel x2 (Altus)
    else if (EventFlag(1049307476))
        SetEventFlagID(1049302077, ON);
    //Godskin Noble (Volcano Manor)
    else if (EventFlag(1049307477))
        SetEventFlagID(1049302034, ON);
    //Starscourge Radahn
    else if (EventFlag(1049307434))
        SetEventFlagID(1049302003, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 8 (all bosses)
$Event(90009958, Default, function() {
    //Bell Bearing Hunter (Capital Outskirts)
    if (EventFlag(1049307399))
        SetEventFlagID(1049302078, ON);
    //Crucible Knight Siluria
    else if (EventFlag(1049307478))
        SetEventFlagID(1049302041, ON);
    //Deathbird (Capital Outskirts)
    else if (EventFlag(1049307441))
        SetEventFlagID(1049302079, ON);
    //Demi-Human Queen Maggie
    else if (EventFlag(1049307479))
        SetEventFlagID(1049302080, ON);
    //Draconic Tree Sentinel
    else if (EventFlag(1049307480))
        SetEventFlagID(1049302081, ON);
    //Fallingstar Beast (Altus)
    else if (EventFlag(1049307481))
        SetEventFlagID(1049302073, ON);
    //Fia's Champions
    else if (EventFlag(1049307473))
        SetEventFlagID(1049302032, ON);
    //Godefroy the Grafted
    else if (EventFlag(1049307432))
        SetEventFlagID(1049302105, ON);
    //Magma Wyrm (Mt. Gelmir)
    else if (EventFlag(1049307505))
        SetEventFlagID(1049302035, ON);
    //Tibia Mariner (Altus)
    else if (EventFlag(1049307435))
        SetEventFlagID(1049302082, ON);
    //Ulcerated Tree Spirit (Mt. Gelmir)
    else if (EventFlag(1049307482))
        SetEventFlagID(1049302083, ON);
    //Valiant Gargoyles
    else if (EventFlag(1049307483))
        SetEventFlagID(1049302036, ON);
    //Astel, Naturalborn of the Void
    else if (EventFlag(1049307436))
        SetEventFlagID(1049302004, ON);
    //Lichdragon Fortissax
    else if (EventFlag(1049307404))
        SetEventFlagID(1049302005, ON);
    //Morgott, the Omen King
    else if (EventFlag(1049307405))
        SetEventFlagID(1049302006, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 9 (all bosses)
$Event(90009959, Default, function() {
    //Ancient Dragon Lansseax
    if (EventFlag(1049307399))
        SetEventFlagID(1049302037, ON);
    //Ancient Hero of Zamor (Mountaintops)
    else if (EventFlag(1049307437))
        SetEventFlagID(1049302125, ON);
    //Black Blade Kindred (Forbidden Lands)
    else if (EventFlag(1049307525))
        SetEventFlagID(1049302084, ON);
    //Dragonkin Soldier (Lake of Rot)
    else if (EventFlag(1049307484))
        SetEventFlagID(1049302038, ON);
    //Esgar, Priest of Blood
    else if (EventFlag(1049307438))
        SetEventFlagID(1049302127, ON);
    //Fell Twins
    else if (EventFlag(1049307527))
        SetEventFlagID(1049302085, ON);
    //Spiritcaller Snail (Mountaintops)
    else if (EventFlag(1049307485))
        SetEventFlagID(1049302150, ON);
    //Ulcerated Tree Spirit (Mountaintops)
    else if (EventFlag(1049307550))
        SetEventFlagID(1049302126, ON);
    //Crucible Knight Ordovis
    else if (EventFlag(1049307526))
        SetEventFlagID(1049302124, ON);
    //Decaying Ekzykes
    else if (EventFlag(1049307524))
        SetEventFlagID(1049302030, ON);
    //Mohg, the Omen
    else if (EventFlag(1049307430))
        SetEventFlagID(1049302039, ON);
    //Roundtable Knight Vyke
    else if (EventFlag(1049307439))
        SetEventFlagID(1049302104, ON);
    //Rykard, Lord of Blasphemy
    else if (EventFlag(1049307504))
        SetEventFlagID(1049302007, ON);
    //Commander Niall
    else if (EventFlag(1049307407))
        SetEventFlagID(1049302040, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 10 (all bosses)
$Event(90009960, Default, function() {
    //Beastman of Farum Azula x2
    if (EventFlag(1049307399))
        SetEventFlagID(1049302151, ON);
    //Death Rite Bird (Mountaintops)
    else if (EventFlag(1049307551))
        SetEventFlagID(1049302087, ON);
    //Erdtree Avatar (Mountaintops)
    else if (EventFlag(1049307487))
        SetEventFlagID(1049302088, ON);
    //Full-Grown Fallingstar Beast
    else if (EventFlag(1049307488))
        SetEventFlagID(1049302086, ON);
    //Night's Cavalry (Forbidden Lands)
    else if (EventFlag(1049307486))
        SetEventFlagID(1049302089, ON);
    //Flying Dragon Greyll
    else if (EventFlag(1049307489))
        SetEventFlagID(1049302046, ON);
    //Glintstone Dragon Adula
    else if (EventFlag(1049307446))
        SetEventFlagID(1049302047, ON);
    //Godskin Duo
    else if (EventFlag(1049307447))
        SetEventFlagID(1049302042, ON);
    //Misbegotten Crusader
    else if (EventFlag(1049307442))
        SetEventFlagID(1049302152, ON);
    //Putrid Grave Warden Duelist
    else if (EventFlag(1049307552))
        SetEventFlagID(1049302130, ON);
    //Putrid Tree Spirit (Caelid)
    else if (EventFlag(1049307530))
        SetEventFlagID(1049302128, ON);
    //Stray Mimic
    else if (EventFlag(1049307528))
        SetEventFlagID(1049302129, ON);
    //Alecto, Black Knife Ringleader
    else if (EventFlag(1049307529))
        SetEventFlagID(1049302106, ON);
    //Bell Bearing Hunter (Dragonbarrow)
    else if (EventFlag(1049307506))
        SetEventFlagID(1049302090, ON);
    //Night's Cavalry (Dragonbarrow)
    else if (EventFlag(1049307490))
        SetEventFlagID(1049302092, ON);
    //Putrid Avatar (Dragonbarrow)
    else if (EventFlag(1049307492))
        SetEventFlagID(1049302093, ON);
    //Sir Gideon Ofnir, the All-Knowing
    else if (EventFlag(1049307493))
        SetEventFlagID(1049302044, ON);
    //Godskin Apostle (Caelid)
    else if (EventFlag(1049307444))
        SetEventFlagID(1049302043, ON);
    //Fire Giant
    else if (EventFlag(1049307443))
        SetEventFlagID(1049302008, ON);
    //Beast Clergyman / Maliketh
    else if (EventFlag(1049307408))
        SetEventFlagID(1049302009, ON);
    //Godfrey / Hoarah Loux
    else if (EventFlag(1049307409))
        SetEventFlagID(1049302010, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier 11 (all bosses)
$Event(90009961, Default, function() {
    //Astel, Stars of Darkness
    if (EventFlag(1049307399))
        SetEventFlagID(1049302166, ON);
    //Black Blade Kindred (Dragonbarrow)
    else if (EventFlag(1049307566))
        SetEventFlagID(1049302091, ON);
    //Borealis, the Freezing Fog
    else if (EventFlag(1049307491))
        SetEventFlagID(1049302045, ON);
    //Loretta, Knight of the Haligtree
    else if (EventFlag(1049307445))
        SetEventFlagID(1049302048, ON);
    //Night's Cavalry x2
    else if (EventFlag(1049307448))
        SetEventFlagID(1049302095, ON);
    //Putrid Avatar (Consecrated Snowfield)
    else if (EventFlag(1049307495))
        SetEventFlagID(1049302096, ON);
    //Death Rite Bird (Consecrated Snowfield)
    else if (EventFlag(1049307496))
        SetEventFlagID(1049302094, ON);
    //Great Wyrm Theodorix
    else if (EventFlag(1049307494))
        SetEventFlagID(1049302049, ON);
    //Malenia, Blade of Miquella
    else if (EventFlag(1049307449))
        SetEventFlagID(1049302016, ON);
    //Dragonlord Placidusax
    else if (EventFlag(1049307416))
        SetEventFlagID(1049302011, ON);
    //Radagon / Elden Beast
    else if (EventFlag(1049307411))
        SetEventFlagID(1049302012, ON);
    //Mohg, Lord of Blood
    else if (EventFlag(1049307412))
        SetEventFlagID(1049302015, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc1 (all bosses)
$Event(90009962, Default, function() {
    //Curseblade Labirith
    if (EventFlag(1049307399))
        SetEventFlagID(1049302184, ON);
    //Demi-Human Queen Marigga
    else if (EventFlag(1049307584))
        SetEventFlagID(1049302187, ON);
    //Demi-Human Swordmaster Onze
    else if (EventFlag(1049307587))
        SetEventFlagID(1049302179, ON);
    //Chief Bloodfiend
    else if (EventFlag(1049307579))
        SetEventFlagID(1049302183, ON);
    //Dancer of Ranah
    else if (EventFlag(1049307583))
        SetEventFlagID(1049302182, ON);
    //Death Knight (Gravesite Plain)
    else if (EventFlag(1049307582))
        SetEventFlagID(1049302180, ON);
    //Divine Beast Dancing Lion
    else if (EventFlag(1049307580))
        SetEventFlagID(1049302167, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc2 (all bosses)
$Event(90009963, Default, function() {
    //Ancient Dragon-Man
    if (EventFlag(1049307399))
        SetEventFlagID(1049302200, ON);
    //Black Knight Edredd
    else if (EventFlag(1049307600))
        SetEventFlagID(1049302190, ON);
    //Dryleaf Dane
    else if (EventFlag(1049307590))
        SetEventFlagID(1049302195, ON);
    //Knight of the Solitary Gaol
    else if (EventFlag(1049307595))
        SetEventFlagID(1049302198, ON);
    //Black Knight Garrew
    else if (EventFlag(1049307598))
        SetEventFlagID(1049302191, ON);
    //Red Bear
    else if (EventFlag(1049307591))
        SetEventFlagID(1049302185, ON);
    //Count Ymir, Mother of Fingers
    else if (EventFlag(1049307585))
        SetEventFlagID(1049302207, ON);
    //Crucible Knight Devonia
    else if (EventFlag(1049307607))
        SetEventFlagID(1049302208, ON);
    //Death Knight (Rauh Base)
    else if (EventFlag(1049307608))
        SetEventFlagID(1049302186, ON);
    //Ghostflame Dragon (Gravesite Plain)
    else if (EventFlag(1049307586))
        SetEventFlagID(1049302181, ON);
    //Ralva the Great Red Bear
    else if (EventFlag(1049307581))
        SetEventFlagID(1049302193, ON);
    //Rellana, Twin Moon Knight
    else if (EventFlag(1049307593))
        SetEventFlagID(1049302168, ON);
    //Golden Hippopotamus
    else if (EventFlag(1049307568))
        SetEventFlagID(1049302169, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc3 (all bosses)
$Event(90009964, Default, function() {
    //Jagged Peak Drake
    if (EventFlag(1049307399))
        SetEventFlagID(1049302196, ON);
    //Rugalea, the Great Red Bear
    else if (EventFlag(1049307596))
        SetEventFlagID(1049302197, ON);
    //Death Rite Bird (Charo's Hidden Grave)
    else if (EventFlag(1049307597))
        SetEventFlagID(1049302194, ON);
    //Ghostflame Dragon (Cerulean Coast)
    else if (EventFlag(1049307594))
        SetEventFlagID(1049302188, ON);
    //Jori, Elder Inquisitor
    else if (EventFlag(1049307588))
        SetEventFlagID(1049302199, ON);
    //Lamenter
    else if (EventFlag(1049307599))
        SetEventFlagID(1049302189, ON);
    //Rakshasa
    else if (EventFlag(1049307589))
        SetEventFlagID(1049302206, ON);
    //Putrescent Knight
    else if (EventFlag(1049307606))
        SetEventFlagID(1049302170, ON);
    //Scadutree Avatar
    else if (EventFlag(1049307570))
        SetEventFlagID(1049302171, ON);
    //Commander Gaius
    else if (EventFlag(1049307571))
        SetEventFlagID(1049302172, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc4 (all bosses)
$Event(90009965, Default, function() {
    //Fallingstar Beast (Hinterland)
    if (EventFlag(1049307399))
        SetEventFlagID(1049302202, ON);
    //Tree Sentinel x2 (Hinterland)
    else if (EventFlag(1049307602))
        SetEventFlagID(1049302204, ON);
    //Divine Beast Dancing Lion (Rauh)
    else if (EventFlag(1049307604))
        SetEventFlagID(1049302201, ON);
    //Ghostflame Dragon (Scadu Altus)
    else if (EventFlag(1049307601))
        SetEventFlagID(1049302192, ON);
    //Jagged Peak Drake x2
    else if (EventFlag(1049307592))
        SetEventFlagID(1049302203, ON);
    //Messmer the Impaler
    else if (EventFlag(1049307603))
        SetEventFlagID(1049302173, ON);
    //Midra, Lord of Frenzied Flame
    else if (EventFlag(1049307573))
        SetEventFlagID(1049302175, ON);
    //Romina, Saint of the Bud
    else if (EventFlag(1049307575))
        SetEventFlagID(1049302176, ON);
    //Metyr, Mother of Fingers
    else if (EventFlag(1049307576))
        SetEventFlagID(1049302174, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//prog sequential mode tier dlc5 (all bosses)
$Event(90009966, Default, function() {
    //Ancient Dragon Senessax
    if (EventFlag(1049307399))
        SetEventFlagID(1049302205, ON);
    //Radahn, Consort of Miquella
    else if (EventFlag(1049307605))
        SetEventFlagID(1049302177, ON);
    //Bayle the Dread
    else if (EventFlag(1049307577))
        SetEventFlagID(1049302178, ON);
    else { //no bosses left
        $InitializeCommonEvent(0, 90009921);
        EndEvent();
    }
    $InitializeCommonEvent(0, 90009801);
    $InitializeCommonEvent(0, 90009802);
    $InitializeCommonEvent(0, 90009803);
    $InitializeCommonEvent(0, 90009804);
});

//rando sequential filter 1
$Event(90009970, Default, function() {
    //Godrick the Grafted
    if (EventFlag(1049302000) && EventFlag(1049307400))
         SetEventFlagID(1049302262, ON);
    //Rennala, Queen of the Full Moon
    else if (EventFlag(1049302001) && EventFlag(1049307401))
         SetEventFlagID(1049302262, ON);
    //Regal Ancestor Spirit
    else if (EventFlag(1049302002) && EventFlag(1049307402))
         SetEventFlagID(1049302262, ON);
    //Starscourge Radahn
    else if (EventFlag(1049302003) && EventFlag(1049307403))
         SetEventFlagID(1049302262, ON);
    //Astel, Naturalborn of the Void
    else if (EventFlag(1049302004) && EventFlag(1049307404))
         SetEventFlagID(1049302262, ON);
    //Lichdragon Fortissax
    else if (EventFlag(1049302005) && EventFlag(1049307405))
         SetEventFlagID(1049302262, ON);
    //Morgott, the Omen King
    else if (EventFlag(1049302006) && EventFlag(1049307406))
         SetEventFlagID(1049302262, ON);
    //Rykard, Lord of Blasphemy
    else if (EventFlag(1049302007) && EventFlag(1049307407))
         SetEventFlagID(1049302262, ON);
    //Fire Giant
    else if (EventFlag(1049302008) && EventFlag(1049307408))
         SetEventFlagID(1049302262, ON);
    //Beast Clergyman / Maliketh
    else if (EventFlag(1049302009) && EventFlag(1049307409))
         SetEventFlagID(1049302262, ON);
    //Godfrey / Hoarah Loux
    else if (EventFlag(1049302010) && EventFlag(1049307410))
         SetEventFlagID(1049302262, ON);
    //Dragonlord Placidusax
    else if (EventFlag(1049302011) && EventFlag(1049307411))
         SetEventFlagID(1049302262, ON);
    //Radagon / Elden Beast
    else if (EventFlag(1049302012) && EventFlag(1049307412))
         SetEventFlagID(1049302262, ON);
    //Radagon of the Golden Order
    else if (EventFlag(1049302013) && EventFlag(1049307413))
         SetEventFlagID(1049302262, ON);
    //Elden Beast
    else if (EventFlag(1049302014) && EventFlag(1049307414))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302640, ON);
});

//rando sequential filter 2
$Event(90009971, Default, function() {
    //Mohg, Lord of Blood
    if (EventFlag(1049302015) && EventFlag(1049307415))
         SetEventFlagID(1049302262, ON);
    //Malenia, Blade of Miquella
    else if (EventFlag(1049302016) && EventFlag(1049307416))
         SetEventFlagID(1049302262, ON);
    //Leonine Misbegotten
    else if (EventFlag(1049302017) && EventFlag(1049307417))
         SetEventFlagID(1049302262, ON);
    //Margit, the Fell Omen
    else if (EventFlag(1049302018) && EventFlag(1049307418))
         SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier of Nokstella
    else if (EventFlag(1049302019) && EventFlag(1049307419))
         SetEventFlagID(1049302262, ON);
    //Flying Dragon Agheel
    else if (EventFlag(1049302020) && EventFlag(1049307420))
         SetEventFlagID(1049302262, ON);
    //Ancestor Spirit
    else if (EventFlag(1049302021) && EventFlag(1049307421))
         SetEventFlagID(1049302262, ON);
    //Red Wolf of Radagon
    else if (EventFlag(1049302022) && EventFlag(1049307422))
         SetEventFlagID(1049302262, ON);
    //Royal Knight Loretta
    else if (EventFlag(1049302023) && EventFlag(1049307423))
         SetEventFlagID(1049302262, ON);
    //Magma Wyrm Makar
    else if (EventFlag(1049302024) && EventFlag(1049307424))
         SetEventFlagID(1049302262, ON);
    //Misbegotten Warrior + Crucible Knight
    else if (EventFlag(1049302025) && EventFlag(1049307425))
         SetEventFlagID(1049302262, ON);
    //Commander O'Neil
    else if (EventFlag(1049302026) && EventFlag(1049307426))
         SetEventFlagID(1049302262, ON);
    //Elemer of the Briar
    else if (EventFlag(1049302027) && EventFlag(1049307427))
         SetEventFlagID(1049302262, ON);
    //Glintstone Dragon Smarag
    else if (EventFlag(1049302028) && EventFlag(1049307428))
         SetEventFlagID(1049302262, ON);
    //Mimic Tear
    else if (EventFlag(1049302029) && EventFlag(1049307429))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302641, ON);
});

//rando sequential filter 3
$Event(90009972, Default, function() {
    //Decaying Ekzykes
    if (EventFlag(1049302030) && EventFlag(1049307430))
         SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier (Siofra)
    else if (EventFlag(1049302031) && EventFlag(1049307431))
         SetEventFlagID(1049302262, ON);
    //Fia's Champions
    else if (EventFlag(1049302032) && EventFlag(1049307432))
         SetEventFlagID(1049302262, ON);
    //Godfrey (Golden Shade)
    else if (EventFlag(1049302033) && EventFlag(1049307433))
         SetEventFlagID(1049302262, ON);
    //Godskin Noble (Volcano Manor)
    else if (EventFlag(1049302034) && EventFlag(1049307434))
         SetEventFlagID(1049302262, ON);
    //Magma Wyrm (Mt. Gelmir)
    else if (EventFlag(1049302035) && EventFlag(1049307435))
         SetEventFlagID(1049302262, ON);
    //Valiant Gargoyles
    else if (EventFlag(1049302036) && EventFlag(1049307436))
         SetEventFlagID(1049302262, ON);
    //Ancient Dragon Lansseax
    else if (EventFlag(1049302037) && EventFlag(1049307437))
         SetEventFlagID(1049302262, ON);
    //Dragonkin Soldier (Lake of Rot)
    else if (EventFlag(1049302038) && EventFlag(1049307438))
         SetEventFlagID(1049302262, ON);
    //Mohg, the Omen
    else if (EventFlag(1049302039) && EventFlag(1049307439))
         SetEventFlagID(1049302262, ON);
    //Commander Niall
    else if (EventFlag(1049302040) && EventFlag(1049307440))
         SetEventFlagID(1049302262, ON);
    //Crucible Knight Siluria
    else if (EventFlag(1049302041) && EventFlag(1049307441))
         SetEventFlagID(1049302262, ON);
    //Godskin Duo
    else if (EventFlag(1049302042) && EventFlag(1049307442))
         SetEventFlagID(1049302262, ON);
    //Godskin Apostle (Caelid)
    else if (EventFlag(1049302043) && EventFlag(1049307443))
         SetEventFlagID(1049302262, ON);
    //Sir Gideon Ofnir, the All-Knowing
    else if (EventFlag(1049302044) && EventFlag(1049307444))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302642, ON);
});

//rando sequential filter 4
$Event(90009973, Default, function() {
    //Borealis, the Freezing Fog
    if (EventFlag(1049302045) && EventFlag(1049307445))
         SetEventFlagID(1049302262, ON);
    //Flying Dragon Greyll
    else if (EventFlag(1049302046) && EventFlag(1049307446))
         SetEventFlagID(1049302262, ON);
    //Glintstone Dragon Adula
    else if (EventFlag(1049302047) && EventFlag(1049307447))
         SetEventFlagID(1049302262, ON);
    //Loretta, Knight of the Haligtree
    else if (EventFlag(1049302048) && EventFlag(1049307448))
         SetEventFlagID(1049302262, ON);
    //Great Wyrm Theodorix
    else if (EventFlag(1049302049) && EventFlag(1049307449))
         SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Limgrave)
    else if (EventFlag(1049302050) && EventFlag(1049307450))
         SetEventFlagID(1049302262, ON);
    //Deathbird (Limgrave)
    else if (EventFlag(1049302051) && EventFlag(1049307451))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Limgrave)
    else if (EventFlag(1049302052) && EventFlag(1049307452))
         SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Limgrave)
    else if (EventFlag(1049302053) && EventFlag(1049307453))
         SetEventFlagID(1049302262, ON);
    //Tree Sentinel (Limgrave)
    else if (EventFlag(1049302054) && EventFlag(1049307454))
         SetEventFlagID(1049302262, ON);
    //Deathbird (Weeping Peninsula)
    else if (EventFlag(1049302055) && EventFlag(1049307455))
         SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Weeping Peninsula)
    else if (EventFlag(1049302056) && EventFlag(1049307456))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Weeping Peninsula)
    else if (EventFlag(1049302057) && EventFlag(1049307457))
         SetEventFlagID(1049302262, ON);
    //Grafted Scion
    else if (EventFlag(1049302058) && EventFlag(1049307458))
         SetEventFlagID(1049302262, ON);
    //Nox Swordstress & Nox Monk
    else if (EventFlag(1049302059) && EventFlag(1049307459))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302643, ON);
});

//rando sequential filter 5
$Event(90009974, Default, function() {
    //Bell Bearing Hunter (Liurnia)
    if (EventFlag(1049302060) && EventFlag(1049307460))
         SetEventFlagID(1049302262, ON);
    //Deathbird (Liurnia)
    else if (EventFlag(1049302061) && EventFlag(1049307461))
         SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Liurnia)
    else if (EventFlag(1049302062) && EventFlag(1049307462))
         SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Liurnia West)
    else if (EventFlag(1049302063) && EventFlag(1049307463))
         SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Liurnia East)
    else if (EventFlag(1049302064) && EventFlag(1049307464))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Liurnia North)
    else if (EventFlag(1049302065) && EventFlag(1049307465))
         SetEventFlagID(1049302262, ON);
    //Omenkiller (Liurnia)
    else if (EventFlag(1049302066) && EventFlag(1049307466))
         SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Liurnia)
    else if (EventFlag(1049302067) && EventFlag(1049307467))
         SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Caelid)
    else if (EventFlag(1049302068) && EventFlag(1049307468))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Caelid)
    else if (EventFlag(1049302069) && EventFlag(1049307469))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Liurnia East)
    else if (EventFlag(1049302070) && EventFlag(1049307470))
         SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Caelid)
    else if (EventFlag(1049302071) && EventFlag(1049307471))
         SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Altus)
    else if (EventFlag(1049302072) && EventFlag(1049307472))
         SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Altus)
    else if (EventFlag(1049302073) && EventFlag(1049307473))
         SetEventFlagID(1049302262, ON);
    //Godskin Apostle (Altus)
    else if (EventFlag(1049302074) && EventFlag(1049307474))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302644, ON);
});

//rando sequential filter 6
$Event(90009975, Default, function() {
    //Giant Wormface
    if (EventFlag(1049302075) && EventFlag(1049307475))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Altus)
    else if (EventFlag(1049302076) && EventFlag(1049307476))
         SetEventFlagID(1049302262, ON);
    //Tree Sentinel x2 (Altus)
    else if (EventFlag(1049302077) && EventFlag(1049307477))
         SetEventFlagID(1049302262, ON);
    //Bell Bearing Hunter (Capital Outskirts)
    else if (EventFlag(1049302078) && EventFlag(1049307478))
         SetEventFlagID(1049302262, ON);
    //Deathbird (Capital Outskirts)
    else if (EventFlag(1049302079) && EventFlag(1049307479))
         SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Maggie
    else if (EventFlag(1049302080) && EventFlag(1049307480))
         SetEventFlagID(1049302262, ON);
    //Draconic Tree Sentinel
    else if (EventFlag(1049302081) && EventFlag(1049307481))
         SetEventFlagID(1049302262, ON);
    //Tibia Mariner (Altus)
    else if (EventFlag(1049302082) && EventFlag(1049307482))
         SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Mt. Gelmir)
    else if (EventFlag(1049302083) && EventFlag(1049307483))
         SetEventFlagID(1049302262, ON);
    //Black Blade Kindred (Forbidden Lands)
    else if (EventFlag(1049302084) && EventFlag(1049307484))
         SetEventFlagID(1049302262, ON);
    //Fell Twins
    else if (EventFlag(1049302085) && EventFlag(1049307485))
         SetEventFlagID(1049302262, ON);
    //Full-Grown Fallingstar Beast
    else if (EventFlag(1049302086) && EventFlag(1049307486))
         SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Mountaintops)
    else if (EventFlag(1049302087) && EventFlag(1049307487))
         SetEventFlagID(1049302262, ON);
    //Erdtree Avatar (Mountaintops)
    else if (EventFlag(1049302088) && EventFlag(1049307488))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Forbidden Lands)
    else if (EventFlag(1049302089) && EventFlag(1049307489))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302645, ON);
});

//rando sequential filter 7
$Event(90009976, Default, function() {
    //Bell Bearing Hunter (Dragonbarrow)
    if (EventFlag(1049302090) && EventFlag(1049307490))
         SetEventFlagID(1049302262, ON);
    //Black Blade Kindred (Dragonbarrow)
    else if (EventFlag(1049302091) && EventFlag(1049307491))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry (Dragonbarrow)
    else if (EventFlag(1049302092) && EventFlag(1049307492))
         SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Dragonbarrow)
    else if (EventFlag(1049302093) && EventFlag(1049307493))
         SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Snowfield)
    else if (EventFlag(1049302094) && EventFlag(1049307494))
         SetEventFlagID(1049302262, ON);
    //Night's Cavalry x2
    else if (EventFlag(1049302095) && EventFlag(1049307495))
         SetEventFlagID(1049302262, ON);
    //Putrid Avatar (Snowfield)
    else if (EventFlag(1049302096) && EventFlag(1049307496))
         SetEventFlagID(1049302262, ON);
    //Bloodhound Knight Darriwil
    else if (EventFlag(1049302097) && EventFlag(1049307497))
         SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Weeping Peninsula)
    else if (EventFlag(1049302098) && EventFlag(1049307498))
         SetEventFlagID(1049302262, ON);
    //Crucible Knight
    else if (EventFlag(1049302099) && EventFlag(1049307499))
         SetEventFlagID(1049302262, ON);
    //Adan, Thief of Fire
    else if (EventFlag(1049302100) && EventFlag(1049307500))
         SetEventFlagID(1049302262, ON);
    //Bols, Carian Knight
    else if (EventFlag(1049302101) && EventFlag(1049307501))
         SetEventFlagID(1049302262, ON);
    //Onyx Lord (Liurnia)
    else if (EventFlag(1049302102) && EventFlag(1049307502))
         SetEventFlagID(1049302262, ON);
    //Battlemage Hugues
    else if (EventFlag(1049302103) && EventFlag(1049307503))
         SetEventFlagID(1049302262, ON);
    //Roundtable Knight Vyke
    else if (EventFlag(1049302104) && EventFlag(1049307504))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302646, ON);
});

//rando sequential filter 8
$Event(90009977, Default, function() {
    //Godefroy the Grafted
    if (EventFlag(1049302105) && EventFlag(1049307505))
         SetEventFlagID(1049302262, ON);
    //Alecto, Black Knife Ringleader
    else if (EventFlag(1049302106) && EventFlag(1049307506))
         SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Limgrave)
    else if (EventFlag(1049302107) && EventFlag(1049307507))
         SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Limgrave)
    else if (EventFlag(1049302108) && EventFlag(1049307508))
         SetEventFlagID(1049302262, ON);
    //Grave Warden Duelist (Limgrave)
    else if (EventFlag(1049302109) && EventFlag(1049307509))
         SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Weeping Peninsula)
    else if (EventFlag(1049302110) && EventFlag(1049307510))
         SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Weeping Peninsula)
    else if (EventFlag(1049302111) && EventFlag(1049307511))
         SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Liurnia)
    else if (EventFlag(1049302112) && EventFlag(1049307512))
         SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Liurnia)
    else if (EventFlag(1049302113) && EventFlag(1049307513))
         SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Liurnia)
    else if (EventFlag(1049302114) && EventFlag(1049307514))
         SetEventFlagID(1049302262, ON);
    //Spiritcaller Snail (Liurnia)
    else if (EventFlag(1049302115) && EventFlag(1049307515))
         SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Limgrave)
    else if (EventFlag(1049302116) && EventFlag(1049307516))
         SetEventFlagID(1049302262, ON);
    //Cemetery Shade (Caelid)
    else if (EventFlag(1049302117) && EventFlag(1049307517))
         SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog x2
    else if (EventFlag(1049302118) && EventFlag(1049307518))
         SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Altus)
    else if (EventFlag(1049302119) && EventFlag(1049307519))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302647, ON);
});

//rando sequential filter 9
$Event(90009978, Default, function() {
    //Perfumer Tricia + Misbegotten Warrior
    if (EventFlag(1049302120) && EventFlag(1049307520))
         SetEventFlagID(1049302262, ON);
    //Erdtree Burial Watchdog (Altus)
    else if (EventFlag(1049302121) && EventFlag(1049307521))
         SetEventFlagID(1049302262, ON);
    //Grave Warden Duelist (Capital Outskirts)
    else if (EventFlag(1049302122) && EventFlag(1049307522))
         SetEventFlagID(1049302262, ON);
    //Red Wolf of the Champion
    else if (EventFlag(1049302123) && EventFlag(1049307523))
         SetEventFlagID(1049302262, ON);
    //Crucible Knight Ordovis
    else if (EventFlag(1049302124) && EventFlag(1049307524))
         SetEventFlagID(1049302262, ON);
    //Ancient Hero of Zamor (Mountaintops)
    else if (EventFlag(1049302125) && EventFlag(1049307525))
         SetEventFlagID(1049302262, ON);
    //Ulcerated Tree Spirit (Mountaintops)
    else if (EventFlag(1049302126) && EventFlag(1049307526))
         SetEventFlagID(1049302262, ON);
    //Esgar, Priest of Blood
    else if (EventFlag(1049302127) && EventFlag(1049307527))
         SetEventFlagID(1049302262, ON);
    //Putrid Tree Spirit (Caelid)
    else if (EventFlag(1049302128) && EventFlag(1049307528))
         SetEventFlagID(1049302262, ON);
    //Stray Mimic Tear
    else if (EventFlag(1049302129) && EventFlag(1049307529))
         SetEventFlagID(1049302262, ON);
    //Putrid Grave Warden Duelist
    else if (EventFlag(1049302130) && EventFlag(1049307530))
         SetEventFlagID(1049302262, ON);
    //Soldier of Godrick
    else if (EventFlag(1049302131) && EventFlag(1049307531))
         SetEventFlagID(1049302262, ON);
    //Beastman of Farum Azula (Limgrave)
    else if (EventFlag(1049302132) && EventFlag(1049307532))
         SetEventFlagID(1049302262, ON);
    //Demi-Human Chief x2
    else if (EventFlag(1049302133) && EventFlag(1049307533))
         SetEventFlagID(1049302262, ON);
    //Guardian Golem
    else if (EventFlag(1049302134) && EventFlag(1049307534))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302648, ON);
});

//rando sequential filter 10
$Event(90009979, Default, function() {
    //Patches
    if (EventFlag(1049302135) && EventFlag(1049307535))
         SetEventFlagID(1049302262, ON);
    //Miranda the Blighted Bloom
    else if (EventFlag(1049302136) && EventFlag(1049307536))
         SetEventFlagID(1049302262, ON);
    //Runebear
    else if (EventFlag(1049302137) && EventFlag(1049307537))
         SetEventFlagID(1049302262, ON);
    //Bloodhound Knight (Liurnia)
    else if (EventFlag(1049302138) && EventFlag(1049307538))
         SetEventFlagID(1049302262, ON);
    //Cleanrot Knight
    else if (EventFlag(1049302139) && EventFlag(1049307539))
         SetEventFlagID(1049302262, ON);
    //Cleanrot Knight x2
    else if (EventFlag(1049302140) && EventFlag(1049307540))
         SetEventFlagID(1049302262, ON);
    //Crystalian x2 (Liurnia)
    else if (EventFlag(1049302141) && EventFlag(1049307541))
         SetEventFlagID(1049302262, ON);
    //Frenzied Duelist
    else if (EventFlag(1049302142) && EventFlag(1049307542))
         SetEventFlagID(1049302262, ON);
    //Abductor Virgins
    else if (EventFlag(1049302143) && EventFlag(1049307543))
         SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Margot
    else if (EventFlag(1049302144) && EventFlag(1049307544))
         SetEventFlagID(1049302262, ON);
    //Kindred of Rot x2
    else if (EventFlag(1049302145) && EventFlag(1049307545))
         SetEventFlagID(1049302262, ON);
    //Black Knife Assassin (Invisible)
    else if (EventFlag(1049302146) && EventFlag(1049307546))
         SetEventFlagID(1049302262, ON);
    //Putrid Crystalian x3
    else if (EventFlag(1049302147) && EventFlag(1049307547))
         SetEventFlagID(1049302262, ON);
    //Necromancer Garris
    else if (EventFlag(1049302148) && EventFlag(1049307548))
         SetEventFlagID(1049302262, ON);
    //Omenkiller + Miranda
    else if (EventFlag(1049302149) && EventFlag(1049307549))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302649, ON);
});

//rando sequential filter 11
$Event(90009980, Default, function() {
    //Spiritcaller Snail (Mountaintops)
    if (EventFlag(1049302150) && EventFlag(1049307550))
         SetEventFlagID(1049302262, ON);
    //Beastman of Farum Azula x2
    else if (EventFlag(1049302151) && EventFlag(1049307551))
         SetEventFlagID(1049302262, ON);
    //Misbegotten Crusader
    else if (EventFlag(1049302152) && EventFlag(1049307552))
         SetEventFlagID(1049302262, ON);
    //Mad Pumpkin Head
    else if (EventFlag(1049302153) && EventFlag(1049307553))
         SetEventFlagID(1049302262, ON);
    //Stonedigger Troll (Limgrave)
    else if (EventFlag(1049302154) && EventFlag(1049307554))
         SetEventFlagID(1049302262, ON);
    //Scaly Misbegotten
    else if (EventFlag(1049302155) && EventFlag(1049307555))
         SetEventFlagID(1049302262, ON);
    //Crystalian (Liurnia)
    else if (EventFlag(1049302156) && EventFlag(1049307556))
         SetEventFlagID(1049302262, ON);
    //Royal Revenant
    else if (EventFlag(1049302157) && EventFlag(1049307557))
         SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Caelid)
    else if (EventFlag(1049302158) && EventFlag(1049307558))
         SetEventFlagID(1049302262, ON);
    //Mad Pumpkin Head x2
    else if (EventFlag(1049302159) && EventFlag(1049307559))
         SetEventFlagID(1049302262, ON);
    //Magma Wyrm (Caelid)
    else if (EventFlag(1049302160) && EventFlag(1049307560))
         SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Gilika
    else if (EventFlag(1049302161) && EventFlag(1049307561))
         SetEventFlagID(1049302262, ON);
    //Sanguine Noble
    else if (EventFlag(1049302162) && EventFlag(1049307562))
         SetEventFlagID(1049302262, ON);
    //Stonedigger Troll (Altus)
    else if (EventFlag(1049302163) && EventFlag(1049307563))
         SetEventFlagID(1049302262, ON);
    //Crystalian x2 (Altus)
    else if (EventFlag(1049302164) && EventFlag(1049307564))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302650, ON);
});

//rando sequential filter 12
$Event(90009981, Default, function() {
    //Onyx Lord (Capital Outskirts)
    if (EventFlag(1049302165) && EventFlag(1049307565))
         SetEventFlagID(1049302262, ON);
    //Astel, Stars of Darkness
    else if (EventFlag(1049302166) && EventFlag(1049307566))
         SetEventFlagID(1049302262, ON);
    //Divine Beast Dancing Lion
    else if (EventFlag(1049302167) && EventFlag(1049307567))
         SetEventFlagID(1049302262, ON);
    //Rellana, Twin Moon Knight
    else if (EventFlag(1049302168) && EventFlag(1049307568))
         SetEventFlagID(1049302262, ON);
    //Golden Hippopotamus
    else if (EventFlag(1049302169) && EventFlag(1049307569))
         SetEventFlagID(1049302262, ON);
    //Putrescent Knight
    else if (EventFlag(1049302170) && EventFlag(1049307570))
         SetEventFlagID(1049302262, ON);
    //Scadutree Avatar
    else if (EventFlag(1049302171) && EventFlag(1049307571))
         SetEventFlagID(1049302262, ON);
    //Commander Gaius
    else if (EventFlag(1049302172) && EventFlag(1049307572))
         SetEventFlagID(1049302262, ON);
    //Messmer the Impaler
    else if (EventFlag(1049302173) && EventFlag(1049307573))
         SetEventFlagID(1049302262, ON);
    //Metyr, Mother of Fingers
    else if (EventFlag(1049302174) && EventFlag(1049307574))
         SetEventFlagID(1049302262, ON);
    //Midra, Lord of Frenzied Flame
    else if (EventFlag(1049302175) && EventFlag(1049307575))
         SetEventFlagID(1049302262, ON);
    //Romina, Saint of the Bud
    else if (EventFlag(1049302176) && EventFlag(1049307576))
         SetEventFlagID(1049302262, ON);
    //Promised Consort Radahn
    else if (EventFlag(1049302177) && EventFlag(1049307577))
         SetEventFlagID(1049302262, ON);
    //Bayle the Dread
    else if (EventFlag(1049302178) && EventFlag(1049307578))
         SetEventFlagID(1049302262, ON);
    //Demi-Human Swordmaster Onze
    else if (EventFlag(1049302179) && EventFlag(1049307579))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302651, ON);
});

//rando sequential filter 13
$Event(90009982, Default, function() {
    //Death Knight (Gravesite Plain)
    if (EventFlag(1049302180) && EventFlag(1049307580))
         SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Gravesite Plain)
    else if (EventFlag(1049302181) && EventFlag(1049307581))
         SetEventFlagID(1049302262, ON);
    //Dancer of Ranah
    else if (EventFlag(1049302182) && EventFlag(1049307582))
         SetEventFlagID(1049302262, ON);
    //Chief Bloodfiend
    else if (EventFlag(1049302183) && EventFlag(1049307583))
         SetEventFlagID(1049302262, ON);
    //Curseblade Labirith
    else if (EventFlag(1049302184) && EventFlag(1049307584))
         SetEventFlagID(1049302262, ON);
    //Red Bear
    else if (EventFlag(1049302185) && EventFlag(1049307585))
         SetEventFlagID(1049302262, ON);
    //Death Knight (Rauh Base)
    else if (EventFlag(1049302186) && EventFlag(1049307586))
         SetEventFlagID(1049302262, ON);
    //Demi-Human Queen Marigga
    else if (EventFlag(1049302187) && EventFlag(1049307587))
         SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Cerulean Coast)
    else if (EventFlag(1049302188) && EventFlag(1049307588))
         SetEventFlagID(1049302262, ON);
    //Lamenter
    else if (EventFlag(1049302189) && EventFlag(1049307589))
         SetEventFlagID(1049302262, ON);
    //Black Knight Edredd
    else if (EventFlag(1049302190) && EventFlag(1049307590))
         SetEventFlagID(1049302262, ON);
    //Black Knight Garrew
    else if (EventFlag(1049302191) && EventFlag(1049307591))
         SetEventFlagID(1049302262, ON);
    //Ghostflame Dragon (Scadu Altus)
    else if (EventFlag(1049302192) && EventFlag(1049307592))
         SetEventFlagID(1049302262, ON);
    //Ralva the Great Red Bear
    else if (EventFlag(1049302193) && EventFlag(1049307593))
         SetEventFlagID(1049302262, ON);
    //Death Rite Bird (Charo's Hidden Grave)
    else if (EventFlag(1049302194) && EventFlag(1049307594))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302652, ON);
});

//rando sequential filter 14
$Event(90009983, Default, function() {
    //Dryleaf Dane
    if (EventFlag(1049302195) && EventFlag(1049307595))
         SetEventFlagID(1049302262, ON);
    //Jagged Peak Drake
    else if (EventFlag(1049302196) && EventFlag(1049307596))
         SetEventFlagID(1049302262, ON);
    //Rugalea the Great Red Bear
    else if (EventFlag(1049302197) && EventFlag(1049307597))
         SetEventFlagID(1049302262, ON);
    //Knight of the Solitary Gaol
    else if (EventFlag(1049302198) && EventFlag(1049307598))
         SetEventFlagID(1049302262, ON);
    //Jori, Elder Inquisitor
    else if (EventFlag(1049302199) && EventFlag(1049307599))
         SetEventFlagID(1049302262, ON);
    //Ancient Dragon-Man
    else if (EventFlag(1049302200) && EventFlag(1049307600))
         SetEventFlagID(1049302262, ON);
    //Divine Beast Dancing Lion (Rauh)
    else if (EventFlag(1049302201) && EventFlag(1049307601))
         SetEventFlagID(1049302262, ON);
    //Fallingstar Beast (Hinterland)
    else if (EventFlag(1049302202) && EventFlag(1049307602))
         SetEventFlagID(1049302262, ON);
    //Jagged Peak Drake x2
    else if (EventFlag(1049302203) && EventFlag(1049307603))
         SetEventFlagID(1049302262, ON);
    //Tree Sentinel x2 (Hinterland)
    else if (EventFlag(1049302204) && EventFlag(1049307604))
         SetEventFlagID(1049302262, ON);
    //Ancient Dragon Senessax
    else if (EventFlag(1049302205) && EventFlag(1049307605))
         SetEventFlagID(1049302262, ON);
    //Rakshasa
    else if (EventFlag(1049302206) && EventFlag(1049307606))
         SetEventFlagID(1049302262, ON);
    //Count Ymir, Mother of Fingers
    else if (EventFlag(1049302207) && EventFlag(1049307607))
         SetEventFlagID(1049302262, ON);
    //Crucible Knight Devonia
    else if (EventFlag(1049302208) && EventFlag(1049307608))
         SetEventFlagID(1049302262, ON);
    SetEventFlagID(1049302653, ON);
});

//boss selection 1 (remembrance + great enemies)
//(90009800, currentboss, bossdead, map1, map2, map3, map4, map5, stake)
$Event(90009801, Default, function() {
    //Astel, Naturalborn of the Void
    if (EventFlag(1049302004)) {
        $InitializeCommonEvent(0, 90009800, 1049308004, 12040800, 12, 4, 0, 0, 12040099, 1);
    //Beast Clergyman / Maliketh
    } else if (EventFlag(1049302009)) {
        $InitializeCommonEvent(0, 90009800, 1049308009, 13000800, 13, 0, 0, 0, 13000099, 0);
    //Dragonlord Placidusax
    } else if (EventFlag(1049302011)) {
        $InitializeCommonEvent(0, 90009800, 1049308011, 13000830, 13, 0, 0, 0, 13000098, 0);
    //Elden Beast
    } else if (EventFlag(1049302014)) {
        $InitializeCommonEvent(0, 90009800, 1049308014, 19000800, 19, 0, 0, 0, 19000097, 0);
    //Fire Giant
    } else if (EventFlag(1049302008)) {
        $InitializeCommonEvent(0, 90009800, 1049308008, 1252520800, 60, 52, 53, 0, 1052530099, 0);
    //Godfrey / Hoarah Loux
    } else if (EventFlag(1049302010)) {
        $InitializeCommonEvent(0, 90009800, 1049308010, 11050800, 11, 5, 0, 0, 11050099, 0);
    //Godrick the Grafted
    } else if (EventFlag(1049302000)) {
        $InitializeCommonEvent(0, 90009800, 1049308000, 10000800, 10, 0, 0, 0, 10002899, 0);
    //Lichdragon Fortissax
    } else if (EventFlag(1049302005)) {
        SetEventFlagID(12030800, ON);
        $InitializeCommonEvent(0, 90009800, 1049308005, 12030850, 12, 3, 0, 0, 12030099, 0);
    //Malenia, Blade of Miquella
    } else if (EventFlag(1049302016)) {
        $InitializeCommonEvent(0, 90009800, 1049308016, 15000800, 15, 0, 0, 0, 15000099, 0);
    //Mohg, Lord of Blood
    } else if (EventFlag(1049302015)) {
        $InitializeCommonEvent(0, 90009800, 1049308015, 12050800, 12, 5, 0, 0, 12050099, 1);
    //Morgott, the Omen King
    } else if (EventFlag(1049302006)) {
        $InitializeCommonEvent(0, 90009800, 1049308006, 11000800, 11, 0, 0, 0, 11000099, 0);
    //Radagon / Elden Beast
    } else if (EventFlag(1049302012)) {
        $InitializeCommonEvent(0, 90009800, 1049308012, 19000800, 19, 0, 0, 0, 19000097, 0);
    //Radagon of the Golden Order
    } else if (EventFlag(1049302013)) {
        $InitializeCommonEvent(0, 90009800, 1049308013, 19000800, 19, 0, 0, 0, 19000097, 0);
    //Regal Ancestor Spirit
    } else if (EventFlag(1049302002)) {
        $InitializeCommonEvent(0, 90009800, 1049308002, 12090800, 12, 9, 0, 0, 12090099, 1);
    //Rennala, Queen of the Full Moon
    } else if (EventFlag(1049302001)) {
        $InitializeCommonEvent(0, 90009800, 1049308001, 14000800, 14, 0, 0, 0, 14000099, 0);
    //Rykard, Lord of Blasphemy
    } else if (EventFlag(1049302007)) {
        $InitializeCommonEvent(0, 90009800, 1049308007, 16000800, 16, 0, 0, 0, 16000099, 0);
    //Starscourge Radahn
    } else if (EventFlag(1049302003)) {
        $InitializeCommonEvent(0, 90009800, 1049308003, 1252380800, 60, 51, 37, 0, 60513799, 1);
    //Ancestor Spirit
    } else if (EventFlag(1049302021)) {
        $InitializeCommonEvent(0, 90009800, 1049308021, 12080800, 12, 8, 0, 0, 12080099, 1);
    //Ancient Dragon Lansseax
    } else if (EventFlag(1049302037)) {
        $InitializeCommonEvent(0, 90009800, 1049308037, 1041520800, 60, 41, 52, 0, 1041522099, 0);
    //Borealis, the Freezing Fog
    } else if (EventFlag(1049302045)) {
        $InitializeCommonEvent(0, 90009800, 1049308045, 1254560800, 60, 54, 56, 0, 1054562099, 0);
    //Commander Niall
    } else if (EventFlag(1049302040)) {
        $InitializeCommonEvent(0, 90009800, 1049308040, 1051570800, 60, 51, 57, 0, 1051570099, 0);
    //Commander O'Neil
    } else if (EventFlag(1049302026)) {
        $InitializeCommonEvent(0, 90009800, 1049308026, 1049380800, 60, 49, 38, 0, 1038400970, 1);
    //Crucible Knight Siluria
    } else if (EventFlag(1049302041)) {
        SetEventFlagID(12030850, ON);
        SetEventFlagID(12030800, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308041, 12030390, 12, 3, 0, 0, 12030092, 0);
    //Decaying Ekzykes
    } else if (EventFlag(1049302030)) {
        $InitializeCommonEvent(0, 90009800, 1049308030, 1048370800, 60, 48, 37, 0, 1048372099, 0);
    //Dragonkin Soldier (Lake of Rot)
    } else if (EventFlag(1049302038)) {
        SetEventFlagID(12010595, ON);
        $InitializeCommonEvent(0, 90009800, 1049308038, 12010850, 12, 1, 0, 0, 12010091, 1);
    //Dragonkin Soldier (Siofra)
    } else if (EventFlag(1049302031)) {
        $InitializeCommonEvent(0, 90009800, 1049308031, 12020830, 12, 2, 0, 0, 12020096, 1);
    //Dragonkin Soldier of Nokstella
    } else if (EventFlag(1049302019)) {
        $InitializeCommonEvent(0, 90009800, 1049308019, 12010800, 12, 1, 0, 0, 12010098, 1);
    //Elemer of the Briar
    } else if (EventFlag(1049302027)) {
        $InitializeCommonEvent(0, 90009800, 1049308027, 1039540800, 60, 39, 54, 0, 60395499, 1);
    //Fia's Champions
    } else if (EventFlag(1049302032)) {
        SetEventFlagID(12030850, ON);
        $InitializeCommonEvent(0, 90009800, 1049308032, 12030800, 12, 3, 0, 0, 12030099, 0);
    //Flying Dragon Agheel
    } else if (EventFlag(1049302020)) {
        $InitializeCommonEvent(0, 90009800, 1049308020, 1043360800, 60, 43, 36, 0, 1043360971, 1);
    //Flying Dragon Greyll
    } else if (EventFlag(1049302046)) {
        $InitializeCommonEvent(0, 90009800, 1049308046, 1052410800, 60, 52, 41, 0, 1052412099, 0);
    //Glintstone Dragon Adula
    } else if (EventFlag(1049302047)) {
        $InitializeCommonEvent(0, 90009800, 1049308047, 1034420800, 60, 34, 41, 0, 1034412001, 0);
    //Glintstone Dragon Smarag
    } else if (EventFlag(1049302028)) {
        $InitializeCommonEvent(0, 90009800, 1049308028, 1034450800, 60, 34, 45, 0, 1034452099, 0);
    //Godfrey (Golden Shade)
    } else if (EventFlag(1049302033)) {
        $InitializeCommonEvent(0, 90009800, 1049308033, 11000850, 11, 0, 0, 0, 11000091, 1);
    //Godskin Apostle (Caelid)
    } else if (EventFlag(1049302043)) {
        $InitializeCommonEvent(0, 90009800, 1049308043, 34130800, 34, 13, 0, 0, 34130099, 0);
    //Godskin Duo
    } else if (EventFlag(1049302042)) {
        $InitializeCommonEvent(0, 90009800, 1049308042, 13000850, 13, 0, 0, 0, 13000095, 0);
    //Godskin Noble (Volcano Manor)
    } else if (EventFlag(1049302034)) {
        $InitializeCommonEvent(0, 90009800, 1049308034, 16000850, 16, 0, 0, 0, 16000091, 0);
    //Great Wyrm Theodorix
    } else if (EventFlag(1049302049)) {
        $InitializeCommonEvent(0, 90009800, 1049308049, 1050560800, 60, 50, 56, 0, 1050562099, 0);
    //Leonine Misbegotten
    } else if (EventFlag(1049302017)) {
        $InitializeCommonEvent(0, 90009800, 1049308017, 1043300800, 60, 43, 30, 0, 1043300099, 0);
    //Loretta, Knight of the Haligtree
    } else if (EventFlag(1049302048)) {
        $InitializeCommonEvent(0, 90009800, 1049308048, 15000850, 15, 0, 0, 0, 15000097, 0);
    //Magma Wyrm (Mt. Gelmir)
    } else if (EventFlag(1049302035)) {
        $InitializeCommonEvent(0, 90009800, 1049308035, 1035530800, 60, 35, 53, 0, 1035532001, 1);
    //Magma Wyrm Makar
    } else if (EventFlag(1049302024)) {
        $InitializeCommonEvent(0, 90009800, 1049308024, 39200800, 39, 20, 0, 0, 39200099, 0);
    //Margit, the Fell Omen
    } else if (EventFlag(1049302018)) {
        $InitializeCommonEvent(0, 90009800, 1049308018, 10000850, 10, 0, 0, 0, 10000091, 0);
    //Mimic Tear
    } else if (EventFlag(1049302029)) {
        $InitializeCommonEvent(0, 90009800, 1049308029, 12020850, 12, 2, 0, 0, 12020099, 1);
    //Misbegotten Warrior + Crucible Knight
    } else if (EventFlag(1049302025)) {
        SetEventFlagID(9410, OFF);
        SetEventFlagID(9413, ON);
        $InitializeCommonEvent(0, 90009800, 1049308025, 1051360800, 60, 51, 36, 0, 1051362001, 0);
    //Mohg, the Omen
    } else if (EventFlag(1049302039)) {
        $InitializeCommonEvent(0, 90009800, 1049308039, 35000800, 35, 0, 0, 0, 35000094, 0);
    //Red Wolf of Radagon
    } else if (EventFlag(1049302022)) {
        $InitializeCommonEvent(0, 90009800, 1049308022, 14000850, 14, 0, 0, 0, 14000092, 0);
    //Royal Knight Loretta
    } else if (EventFlag(1049302023)) {
        $InitializeCommonEvent(0, 90009800, 1049308023, 1035500800, 60, 35, 50, 0, 60355099, 1);
    //Sir Gideon Ofnir, the All-Knowing
    } else if (EventFlag(1049302044)) {
        SetEventFlagID(11050850, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308044, 11050800, 11, 5, 0, 0, 11050971, 1);
    //Valiant Gargoyles
    } else if (EventFlag(1049302036)) {
        SetEventFlagID(12030850, ON);
        $InitializeCommonEvent(0, 90009800, 1049308036, 12020800, 12, 2, 0, 0, 12020971, 1);
    }
});

//boss selection 2 (overworld)
//(90009800, currentboss, bossdead, map1, map2, map3, map4, map5, stake)
$Event(90009802, Default, function() {
    //Bell Bearing Hunter (Capital Outskirts)
    if (EventFlag(1049302078)) {
        SetEventFlagID(1043530701, ON);
        $InitializeCommonEvent(0, 90009800, 1049308078, 1043530800, 60, 43, 53, 0, 1043532001, 0);
    //Bell Bearing Hunter (Dragonbarrow)
    } else if (EventFlag(1049302090)) {
        SetEventFlagID(1048410701, ON);
        $InitializeCommonEvent(0, 90009800, 1049308090, 1048410800, 60, 48, 41, 0, 1048412001, 0);
    //Bell Bearing Hunter (Limgrave)
    } else if (EventFlag(1049302050)) {
        SetEventFlagID(1042380701, ON);
        $InitializeCommonEvent(0, 90009800, 1049308050, 1042380850, 60, 42, 38, 0, 1042382001, 0);
    //Bell Bearing Hunter (Liurnia)
    } else if (EventFlag(1049302060)) {
        SetEventFlagID(1037460701, ON);
        $InitializeCommonEvent(0, 90009800, 1049308060, 1037460800, 60, 37, 46, 0, 1037462650, 1);
    //Black Blade Kindred (Dragonbarrow)
    } else if (EventFlag(1049302091)) {
        $InitializeCommonEvent(0, 90009800, 1049308091, 1051430800, 60, 51, 43, 0, 1051432001, 0);
    //Black Blade Kindred (Forbidden Lands)
    } else if (EventFlag(1049302084)) {
        $InitializeCommonEvent(0, 90009800, 1049308084, 1049520800, 60, 49, 52, 0, 1049520970, 1);
    //Black Knife Assassin (Altus)
    } else if (EventFlag(1049302072)) {
        $InitializeCommonEvent(0, 90009800, 1049308072, 1040520800, 60, 40, 52, 0, 1040522001, 0);
    //Death Rite Bird (Caelid)
    } else if (EventFlag(1049302068)) {
        $InitializeCommonEvent(0, 90009800, 1049308068, 1049370850, 60, 49, 37, 0, 1049372001, 0);
    //Death Rite Bird (Liurnia)
    } else if (EventFlag(1049302062)) {
        $InitializeCommonEvent(0, 90009800, 1049308062, 1036450800, 60, 36, 45, 0, 1036452001, 0);
    //Death Rite Bird (Mountaintops)
    } else if (EventFlag(1049302087)) {
        $InitializeCommonEvent(0, 90009800, 1049308087, 1050570800, 60, 50, 57, 0, 1050570970, 1);
    //Death Rite Bird (Snowfield)
    } else if (EventFlag(1049302094)) {
        $InitializeCommonEvent(0, 90009800, 1049308094, 1048570800, 60, 48, 57, 0, 1048572099, 0);
    //Deathbird (Capital Outskirts)
    } else if (EventFlag(1049302079)) {
        $InitializeCommonEvent(0, 90009800, 1049308079, 1044530800, 60, 44, 53, 0, 1044532001, 0);
    //Deathbird (Limgrave)
    } else if (EventFlag(1049302051)) {
        $InitializeCommonEvent(0, 90009800, 1049308051, 1042380800, 60, 42, 38, 0, 1042382002, 0);
    //Deathbird (Liurnia)
    } else if (EventFlag(1049302061)) {
        $InitializeCommonEvent(0, 90009800, 1049308061, 1037420800, 60, 37, 42, 0, 1037422001, 0);
    //Deathbird (Weeping Peninsula)
    } else if (EventFlag(1049302055)) {
        $InitializeCommonEvent(0, 90009800, 1049308055, 1044320800, 60, 44, 32, 0, 1044322099, 0);
    //Demi-Human Queen Maggie
    } else if (EventFlag(1049302080)) {
        $InitializeCommonEvent(0, 90009800, 1049308080, 1037530800, 60, 37, 53, 0, 1037532001, 0);
    //Draconic Tree Sentinel
    } else if (EventFlag(1049302081)) {
        $InitializeCommonEvent(0, 90009800, 1049308081, 1045520800, 60, 45, 52, 0, 1045520970, 1);
    //Erdtree Avatar (Liurnia East)
    } else if (EventFlag(1049302064)) {
        $InitializeCommonEvent(0, 90009800, 1049308064, 1038480800, 60, 38, 48, 0, 603848001, 1);
    //Erdtree Avatar (Liurnia West)
    } else if (EventFlag(1049302063)) {
        $InitializeCommonEvent(0, 90009800, 1049308063, 1033430800, 60, 33, 43, 0, 60334399, 1);
    //Erdtree Avatar (Mountaintops)
    } else if (EventFlag(1049302088)) {
        $InitializeCommonEvent(0, 90009800, 1049308088, 1052560800, 60, 52, 56, 0, 1052562099, 0);
    //Erdtree Avatar (Weeping Peninsula)
    } else if (EventFlag(1049302056)) {
        $InitializeCommonEvent(0, 90009800, 1049308056, 1043330800, 60, 43, 33, 0, 1043330972, 1);
    //Fallingstar Beast (Altus)
    } else if (EventFlag(1049302073)) {
        $InitializeCommonEvent(0, 90009800, 1049308073, 1041500800, 60, 41, 50, 0, 60415001, 1);
    //Fell Twins
    } else if (EventFlag(1049302085)) {
        $InitializeCommonEvent(0, 90009800, 1049308085, 34140850, 34, 14, 0, 0, 34140001, 0);
    //Full-Grown Fallingstar Beast
    } else if (EventFlag(1049302086)) {
        $InitializeCommonEvent(0, 90009800, 1049308086, 1036540800, 60, 36, 54, 0, 1036542001, 0);
    //Giant Wormface
    } else if (EventFlag(1049302075)) {
        $InitializeCommonEvent(0, 90009800, 1049308075, 1041530800, 60, 41, 53, 0, 60415399, 1);
    //Godskin Apostle (Altus)
    } else if (EventFlag(1049302074)) {
        $InitializeCommonEvent(0, 90009800, 1049308074, 1042550800, 60, 42, 55, 0, 1042550970, 1);
    //Grafted Scion
    } else if (EventFlag(1049302058)) {
        $InitializeCommonEvent(0, 90009800, 1049308058, 10010800, 10, 1, 0, 0, 10010099, 0);
    //Night's Cavalry (Altus)
    } else if (EventFlag(1049302076)) {
        $InitializeCommonEvent(0, 90009800, 1049308076, 1039510800, 60, 39, 51, 0, 1039512001, 0);
    //Night's Cavalry (Caelid)
    } else if (EventFlag(1049302069)) {
        $InitializeCommonEvent(0, 90009800, 1049308069, 1049370800, 60, 49, 37, 0, 1049372002, 0);
    //Night's Cavalry (Dragonbarrow)
    } else if (EventFlag(1049302092)) {
        $InitializeCommonEvent(0, 90009800, 1049308092, 1052410850, 60, 52, 41, 0, 1052412098, 0);
    //Night's Cavalry (Forbidden Lands)
    } else if (EventFlag(1049302089)) {
        $InitializeCommonEvent(0, 90009800, 1049308089, 1048510800, 60, 48, 51, 0, 1048512099, 0);
    //Night's Cavalry (Limgrave)
    } else if (EventFlag(1049302052)) {
        $InitializeCommonEvent(0, 90009800, 1049308052, 1043370800, 60, 43, 37, 0, 1043370971, 1);
    //Night's Cavalry (Liurnia East)
    } else if (EventFlag(1049302070)) {
        $InitializeCommonEvent(0, 90009800, 1049308070, 1039430800, 60, 39, 43, 0, 1039432099, 0);
    //Night's Cavalry (Liurnia North)
    } else if (EventFlag(1049302065)) {
        $InitializeCommonEvent(0, 90009800, 1049308065, 1036480800, 60, 36, 48, 0, 1036482001, 0);
    //Night's Cavalry (Weeping Peninsula)
    } else if (EventFlag(1049302057)) {
        $InitializeCommonEvent(0, 90009800, 1049308057, 1044320850, 60, 44, 33, 0, 1044332001, 0);
    //Night's Cavalry x2
    } else if (EventFlag(1049302095)) {
        $InitializeCommonEvent(0, 90009800, 1049308095, 1248550800, 60, 48, 55, 0, 1048552001, 0);
    //Nox Swordstress & Nox Monk
    } else if (EventFlag(1049302059)) {
        SetEventFlagID(1049390200, ON);
        SetEventFlagID(1049390201, ON);
        $InitializeCommonEvent(0, 90009800, 1049308059, 1049390800, 60, 49, 39, 0, 1049390981, 1);
    //Omenkiller (Liurnia)
    } else if (EventFlag(1049302066)) {
        $InitializeCommonEvent(0, 90009800, 1049308066, 1035420800, 60, 35, 42, 0, 1035422098, 0);
    //Putrid Avatar (Caelid)
    } else if (EventFlag(1049302071)) {
        $InitializeCommonEvent(0, 90009800, 1049308071, 1047400800, 60, 46, 40, 0, 1046400970, 1);
    //Putrid Avatar (Dragonbarrow)
    } else if (EventFlag(1049302093)) {
        $InitializeCommonEvent(0, 90009800, 1049308093, 1051400800, 60, 51, 40, 0, 1051400970, 1);
    //Putrid Avatar (Snowfield)
    } else if (EventFlag(1049302096)) {
        $InitializeCommonEvent(0, 90009800, 1049308096, 1050570850, 60, 50, 57, 0, 60505799, 1);
    //Tibia Mariner (Altus)
    } else if (EventFlag(1049302082)) {
        SetEventFlagID(1038520340, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308082, 1038520800, 60, 38, 52, 0, 1038522099, 0);
    //Tibia Mariner (Limgrave)
    } else if (EventFlag(1049302053)) {
        $InitializeCommonEvent(0, 90009800, 1049308053, 1045390800, 60, 45, 39, 0, 1045392099, 0);
    //Tibia Mariner (Liurnia)
    } else if (EventFlag(1049302067)) {
        $InitializeCommonEvent(0, 90009800, 1049308067, 1039440800, 60, 39, 44, 0, 60394499, 1);
    //Tree Sentinel (Limgrave)
    } else if (EventFlag(1049302054)) {
        $InitializeCommonEvent(0, 90009800, 1049308054, 1042360800, 60, 42, 36, 0, 1042362099, 0);
    //Tree Sentinel x2 (Altus)
    } else if (EventFlag(1049302077)) {
        $InitializeCommonEvent(0, 90009800, 1049308077, 1041510800, 60, 41, 51, 0, 1041512099, 0);
    //Ulcerated Tree Spirit (Mt. Gelmir)
    } else if (EventFlag(1049302083)) {
        $InitializeCommonEvent(0, 90009800, 1049308083, 1037540810, 60, 37, 54, 0, 1037542099, 0);
    }
});

//boss selection 3 (evergaols + side dungeons)
//(90009800, currentboss, bossdead, map1, map2, map3, map4, map5, stake)
$Event(90009803, Default, function() {
    //Adan, Thief of Fire
    if (EventFlag(1049302100)) {
        $InitializeCommonEvent(0, 90009800, 1049308100, 1038410800, 60, 38, 41, 0, 60384199, 1);
    //Alecto, Black Knife Ringleader
    } else if (EventFlag(1049302106)) {
        $InitializeCommonEvent(0, 90009800, 1049308106, 1033420800, 60, 33, 42, 0, 60334299, 1);
    //Ancient Hero of Zamor (Weeping Peninsula)
    } else if (EventFlag(1049302098)) {
        SetEventFlagID(1042330570, ON);
        $InitializeCommonEvent(0, 90009800, 1049308098, 1042330800, 60, 42, 33, 0, 60423399, 1);
    //Battlemage Hugues
    } else if (EventFlag(1049302103)) {
        $InitializeCommonEvent(0, 90009800, 1049308103, 1049390850, 60, 49, 39, 0, 60493999, 1);
    //Bloodhound Knight Darriwil
    } else if (EventFlag(1049302097)) {
        $InitializeCommonEvent(0, 90009800, 1049308097, 1044350800, 60, 44, 35, 0, 1044350971, 1);
    //Bols, Carian Knight
    } else if (EventFlag(1049302101)) {
        $InitializeCommonEvent(0, 90009800, 1049308101, 1033450800, 60, 33, 45, 0, 60334599, 1);
    //Crucible Knight
    } else if (EventFlag(1049302099)) {
        $InitializeCommonEvent(0, 90009800, 1049308099, 1042370800, 60, 42, 37, 0, 60423799, 1);
    //Godefroy the Grafted
    } else if (EventFlag(1049302105)) {
        SetEventFlagID(1039500570, ON);
        $InitializeCommonEvent(0, 90009800, 1049308105, 1039500800, 60, 39, 50, 0, 60395099, 1);
    //Onyx Lord (Liurnia)
    } else if (EventFlag(1049302102)) {
        $InitializeCommonEvent(0, 90009800, 1049308102, 1036500800, 60, 36, 50, 0, 1036502099, 0);
    //Roundtable Knight Vyke
    } else if (EventFlag(1049302104)) {
        $InitializeCommonEvent(0, 90009800, 1049308104, 1053560800, 60, 53, 56, 0, 60535699, 1);
    //Ancient Hero of Zamor (Altus)
    } else if (EventFlag(1049302119)) {
        $InitializeCommonEvent(0, 90009800, 1049308119, 30080800, 30, 8, 0, 0, 30080099, 1);
    //Ancient Hero of Zamor (Mountaintops)
    } else if (EventFlag(1049302125)) {
        $InitializeCommonEvent(0, 90009800, 1049308125, 30170800, 30, 17, 0, 0, 30170099, 1);
    //Black Knife Assassin (Limgrave)
    } else if (EventFlag(1049302107)) {
        $InitializeCommonEvent(0, 90009800, 1049308107, 30110800, 30, 11, 0, 0, 30110099, 0);
    //Black Knife Assassin (Liurnia)
    } else if (EventFlag(1049302112)) {
        $InitializeCommonEvent(0, 90009800, 1049308112, 30050850, 30, 5, 0, 0, 30050099, 0);
    //Cemetery Shade (Caelid)
    } else if (EventFlag(1049302117)) {
        $InitializeCommonEvent(0, 90009800, 1049308117, 30150800, 30, 15, 0, 0, 30150099, 1);
    //Cemetery Shade (Liurnia)
    } else if (EventFlag(1049302113)) {
        $InitializeCommonEvent(0, 90009800, 1049308113, 30050800, 30, 5, 0, 0, 30050096, 0);
    //Cemetery Shade (Weeping Peninsula)
    } else if (EventFlag(1049302110)) {
        $InitializeCommonEvent(0, 90009800, 1049308110, 30000800, 30, 0, 0, 0, 30000094, 0);
    //Crucible Knight Ordovis
    } else if (EventFlag(1049302124)) {
        $InitializeCommonEvent(0, 90009800, 1049308124, 30100800, 30, 10, 0, 0, 30100099, 1);
    //Erdtree Burial Watchdog (Altus)
    } else if (EventFlag(1049302121)) {
        $InitializeCommonEvent(0, 90009800, 1049308121, 30070800, 30, 7, 0, 0, 30070099, 0);
    //Erdtree Burial Watchdog (Limgrave)
    } else if (EventFlag(1049302108)) {
        $InitializeCommonEvent(0, 90009800, 1049308108, 30020800, 30, 2, 0, 0, 30020099, 0);
    //Erdtree Burial Watchdog (Liurnia)
    } else if (EventFlag(1049302114)) {
        $InitializeCommonEvent(0, 90009800, 1049308114, 30060800, 30, 6, 0, 0, 30060099, 0);
    //Erdtree Burial Watchdog (Weeping Peninsula)
    } else if (EventFlag(1049302111)) {
        $InitializeCommonEvent(0, 90009800, 1049308111, 30010800, 30, 1, 0, 0, 30010099, 0);
    //Erdtree Burial Watchdog x2
    } else if (EventFlag(1049302118)) {
        $InitializeCommonEvent(0, 90009800, 1049308118, 30140800, 30, 14, 0, 0, 30140099, 1);
    //Esgar, Priest of Blood
    } else if (EventFlag(1049302127)) {
        $InitializeCommonEvent(0, 90009800, 1049308127, 35000850, 35, 0, 0, 0, 35000099, 0);
    //Grave Warden Duelist (Capital Outskirts)
    } else if (EventFlag(1049302122)) {
        $InitializeCommonEvent(0, 90009800, 1049308122, 30130800, 30, 13, 0, 0, 30130099, 0);
    //Grave Warden Duelist (Limgrave)
    } else if (EventFlag(1049302109)) {
        $InitializeCommonEvent(0, 90009800, 1049308109, 30040800, 30, 4, 0, 0, 30040099, 0);
    //Perfumer Tricia + Misbegotten Warrior
    } else if (EventFlag(1049302120)) {
        $InitializeCommonEvent(0, 90009800, 1049308120, 30120800, 30, 12, 0, 0, 30120099, 0);
    //Putrid Grave Warden Duelist
    } else if (EventFlag(1049302130)) {
        $InitializeCommonEvent(0, 90009800, 1049308130, 30190800, 30, 19, 0, 0, 30190099, 1);
    //Putrid Tree Spirit (Caelid)
    } else if (EventFlag(1049302128)) {
        $InitializeCommonEvent(0, 90009800, 1049308128, 30160800, 30, 16, 0, 0, 30160099, 0);
    //Red Wolf of the Champion
    } else if (EventFlag(1049302123)) {
        $InitializeCommonEvent(0, 90009800, 1049308123, 30090800, 30, 9, 0, 0, 30090099, 1);
    //Spiritcaller Snail (Liurnia)
    } else if (EventFlag(1049302115)) {
        $InitializeCommonEvent(0, 90009800, 1049308115, 30030800, 30, 3, 0, 0, 30030099, 1);
    //Stray Mimic
    } else if (EventFlag(1049302129)) {
        $InitializeCommonEvent(0, 90009800, 1049308129, 30200800, 30, 20, 0, 0, 30200099, 1);
    //Ulcerated Tree Spirit (Limgrave)
    } else if (EventFlag(1049302116)) {
        $InitializeCommonEvent(0, 90009800, 1049308116, 18000800, 18, 0, 0, 0, 18000098, 1);
    //Ulcerated Tree Spirit (Mountaintops)
    } else if (EventFlag(1049302126)) {
        $InitializeCommonEvent(0, 90009800, 1049308126, 30180800, 30, 18, 0, 0, 30180099, 0);
    //Abductor Virgins
    } else if (EventFlag(1049302143)) {
        $InitializeCommonEvent(0, 90009800, 1049308143, 16000860, 16, 0, 0, 0, 16000089, 0);
    //Beastman of Farum Azula (Limgrave)
    } else if (EventFlag(1049302132)) {
        $InitializeCommonEvent(0, 90009800, 1049308132, 31030800, 31, 3, 0, 0, 31030096, 0);
    //Beastman of Farum Azula x2
    } else if (EventFlag(1049302151)) {
        $InitializeCommonEvent(0, 90009800, 1049308151, 31100800, 31, 10, 0, 0, 31100099, 0);
    //Black Knife Assassin (Invisible)
    } else if (EventFlag(1049302146)) {
        $InitializeCommonEvent(0, 90009800, 1049308146, 31190800, 31, 19, 0, 0, 31190093, 0);
    //Bloodhound Knight
    } else if (EventFlag(1049302138)) {
        $InitializeCommonEvent(0, 90009800, 1049308138, 31050800, 31, 5, 0, 0, 31050099, 0);
    //Cleanrot Knight
    } else if (EventFlag(1049302139)) {
        $InitializeCommonEvent(0, 90009800, 1049308139, 31040800, 31, 4, 0, 0, 31040099, 1);
    //Cleanrot Knight x2
    } else if (EventFlag(1049302140)) {
        $InitializeCommonEvent(0, 90009800, 1049308140, 31200800, 31, 20, 0, 0, 31200099, 0);
    //Crystalian x2 (Liurnia)
    } else if (EventFlag(1049302141)) {
        $InitializeCommonEvent(0, 90009800, 1049308141, 31060800, 31, 6, 0, 0, 31060097, 0);
    //Demi-Human Chief x2
    } else if (EventFlag(1049302133)) {
        $InitializeCommonEvent(0, 90009800, 1049308133, 31150800, 31, 15, 0, 0, 31150099, 0);
    //Demi-Human Queen Margot
    } else if (EventFlag(1049302144)) {
        $InitializeCommonEvent(0, 90009800, 1049308144, 31090800, 31, 9, 0, 0, 31090099, 0);
    //Frenzied Duelist
    } else if (EventFlag(1049302142)) {
        $InitializeCommonEvent(0, 90009800, 1049308142, 31210800, 31, 21, 0, 0, 31210099, 1);
    //Guardian Golem
    } else if (EventFlag(1049302134)) {
        $InitializeCommonEvent(0, 90009800, 1049308134, 31170800, 31, 17, 0, 0, 31170099, 1);
    //Kindred of Rot x2
    } else if (EventFlag(1049302145)) {
        $InitializeCommonEvent(0, 90009800, 1049308145, 31070800, 31, 7, 0, 0, 31070099, 1);
    //Miranda the Blighted Bloom
    } else if (EventFlag(1049302136)) {
        $InitializeCommonEvent(0, 90009800, 1049308136, 31020800, 31, 2, 0, 0, 31020099, 0);
    //Misbegotten Crusader
    } else if (EventFlag(1049302152)) {
        $InitializeCommonEvent(0, 90009800, 1049308152, 31120800, 31, 12, 0, 0, 31120099, 1);
    //Necromancer Garris
    } else if (EventFlag(1049302148)) {
        $InitializeCommonEvent(0, 90009800, 1049308148, 31190850, 31, 19, 0, 0, 31190098, 0);
    //Omenkiller + Miranda
    } else if (EventFlag(1049302149)) {
        $InitializeCommonEvent(0, 90009800, 1049308149, 31180800, 31, 18, 0, 0, 31180099, 0);
    //Patches
    } else if (EventFlag(1049302135)) {
        SetEventFlagID(3683, OFF);
        SetEventFlagID(3691, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308135, 31000800, 31, 0, 0, 0, 31000097, 0);
    //Putrid Crystalian x3
    } else if (EventFlag(1049302147)) {
        $InitializeCommonEvent(0, 90009800, 1049308147, 31110800, 31, 11, 0, 0, 31110099, 1);
    //Runebear
    } else if (EventFlag(1049302137)) {
        $InitializeCommonEvent(0, 90009800, 1049308137, 31010800, 31, 1, 0, 0, 31010099, 0);
    //Soldier of Godrick
    } else if (EventFlag(1049302131)) {
        $InitializeCommonEvent(0, 90009800, 1049308131, 18000850, 18, 0, 0, 0, 18000095, 1);
    //Spiritcaller Snail (Mountaintops)
    } else if (EventFlag(1049302150)) {
        $InitializeCommonEvent(0, 90009800, 1049308150, 31220800, 31, 22, 0, 0, 31220099, 0);
    //Astel, Stars of Darkness
    } else if (EventFlag(1049302166)) {
        $InitializeCommonEvent(0, 90009800, 1049308166, 32110800, 32, 11, 0, 0, 32110099, 0);
    //Crystalian (Liurnia)
    } else if (EventFlag(1049302156)) {
        $InitializeCommonEvent(0, 90009800, 1049308156, 32020800, 32, 2, 0, 0, 32020095, 0);
    //Crystalian x2 (Altus)
    } else if (EventFlag(1049302164)) {
        $InitializeCommonEvent(0, 90009800, 1049308164, 32050800, 32, 5, 0, 0, 32050099, 0);
    //Demi-Human Queen Gilika
    } else if (EventFlag(1049302161)) {
        SetEventFlagID(1038520340, OFF);
        SetEventFlagID(1038520800, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308161, 1038510800, 60, 38, 51, 0, 60385199, 1);
    //Fallingstar Beast (Caelid)
    } else if (EventFlag(1049302158)) {
        $InitializeCommonEvent(0, 90009800, 1049308158, 32080800, 32, 8, 0, 0, 32080099, 0);
    //Mad Pumpkin Head
    } else if (EventFlag(1049302153)) {
        $InitializeCommonEvent(0, 90009800, 1049308153, 1044360800, 60, 44, 36, 0, 60443699, 1);
    //Mad Pumpkin Head x2
    } else if (EventFlag(1049302159)) {
        $InitializeCommonEvent(0, 90009800, 1049308159, 1048400800, 60, 48, 40, 0, 1048402099, 0);
    //Magma Wyrm (Caelid)
    } else if (EventFlag(1049302160)) {
        $InitializeCommonEvent(0, 90009800, 1049308160, 32070800, 32, 7, 0, 0, 32070099, 0);
    //Onyx Lord (Capital Outskirts)
    } else if (EventFlag(1049302165)) {
        $InitializeCommonEvent(0, 90009800, 1049308165, 34120800, 34, 12, 0, 0, 34120099, 1);
    //Royal Revenant
    } else if (EventFlag(1049302157)) {
        $InitializeCommonEvent(0, 90009800, 1049308157, 1034480800, 60, 34, 48, 0, 60344899, 1);
    //Sanguine Noble
    } else if (EventFlag(1049302162)) {
        $InitializeCommonEvent(0, 90009800, 1049308162, 1040530800, 60, 40, 53, 0, 60405399, 1);
    //Scaly Misbegotten
    } else if (EventFlag(1049302155)) {
        $InitializeCommonEvent(0, 90009800, 1049308155, 32000800, 32, 0, 0, 0, 32000097, 0);
    //Stonedigger Troll (Altus)
    } else if (EventFlag(1049302163)) {
        $InitializeCommonEvent(0, 90009800, 1049308163, 32040800, 32, 4, 0, 0, 32040099, 0);
    //Stonedigger Troll (Limgrave)
    } else if (EventFlag(1049302154)) {
        $InitializeCommonEvent(0, 90009800, 1049308154, 32010800, 32, 1, 0, 0, 32010099, 1);
    }
});

//boss selection 4 (dlc)
//(90009800, currentboss, bossdead, map1, map2, map3, map4, map5, stake)
$Event(90009804, Default, function() {
    //Bayle the Dread
    if (EventFlag(1049302178)) {
        $InitializeCommonEvent(0, 90009800, 1049308178, 2054390800, 61, 54, 39, 0, 2054392099, 0);
    //Commander Gaius
    } else if (EventFlag(1049302172)) {
        $InitializeCommonEvent(0, 90009800, 1049308172, 2049480800, 61, 49, 48, 0, 2049482099, 0);
    //Divine Beast Dancing Lion
    } else if (EventFlag(1049302167)) {
        $InitializeCommonEvent(0, 90009800, 1049308167, 20000800, 20, 0, 0, 0, 20000099, 0);
    //Golden Hippopotamus
    } else if (EventFlag(1049302169)) {
        $InitializeCommonEvent(0, 90009800, 1049308169, 21000850, 21, 0, 0, 0, 21000099, 0);
    //Messmer the Impaler
    } else if (EventFlag(1049302173)) {
        $InitializeCommonEvent(0, 90009800, 1049308173, 21010800, 21, 1, 0, 0, 21010099, 0);
    //Metyr, Mother of Fingers
    } else if (EventFlag(1049302174)) {
        $InitializeCommonEvent(0, 90009800, 1049308174, 25000800, 25, 0, 0, 0, 25000099, 0);
    //Midra, Lord of Frenzied Flame
    } else if (EventFlag(1049302175)) {
        $InitializeCommonEvent(0, 90009800, 1049308175, 28000800, 28, 0, 0, 0, 28000099, 0);
    //Putrescent Knight
    } else if (EventFlag(1049302170)) {
        $InitializeCommonEvent(0, 90009800, 1049308170, 22000800, 22, 0, 0, 0, 22000099, 0);
    //Radahn, Consort of Miquella
    } else if (EventFlag(1049302177)) {
        $InitializeCommonEvent(0, 90009800, 1049308177, 20010800, 20, 1, 0, 0, 20010099, 0);
    //Rellana, Twin Moon Knight
    } else if (EventFlag(1049302168)) {
        $InitializeCommonEvent(0, 90009800, 1049308168, 2048440800, 61, 48, 44, 0, 2048442099, 0);
    //Romina, Saint of the Bud
    } else if (EventFlag(1049302176)) {
        SetEventFlagID(330, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308176, 2044450800, 61, 44, 46, 0, 2044462099, 0);
    //Scadutree Avatar
    } else if (EventFlag(1049302171)) {
        $InitializeCommonEvent(0, 90009800, 1049308171, 2050480800, 21, 0, 0, 0, 21000098, 0);
    //Ancient Dragon Senessax
    } else if (EventFlag(1049302205)) {
        $InitializeCommonEvent(0, 90009800, 1049308205, 2054390850, 61, 54, 39, 0, 2054392098, 1);
    //Ancient Dragon-Man
    } else if (EventFlag(1049302200)) {
        $InitializeCommonEvent(0, 90009800, 1049308200, 43010800, 43, 1, 0, 0, 430100001, 1);
    //Black Knight Edredd
    } else if (EventFlag(1049302190)) {
        $InitializeCommonEvent(0, 90009800, 1049308190, 2049430850, 61, 49, 43, 0, 2049432099, 0);
    //Black Knight Garrew
    } else if (EventFlag(1049302191)) {
        $InitializeCommonEvent(0, 90009800, 1049308191, 2047450800, 61, 47, 45, 0, 2047452099, 0);
    //Chief Bloodfiend
    } else if (EventFlag(1049302183)) {
        $InitializeCommonEvent(0, 90009800, 1049308183, 43000800, 43, 0, 0, 0, 430000001, 1);
    //Count Ymir, Mother of Fingers
    } else if (EventFlag(1049302207)) {
        SetEventFlagID(25000800, ON);
        $InitializeCommonEvent(0, 90009800, 1049308207, 2051450800, 61, 51, 45, 0, 2051452099, 0);
    //Crucible Knight Devonia
    } else if (EventFlag(1049302208)) {
        $InitializeCommonEvent(0, 90009800, 1049308208, 2045470200, 61, 45, 47, 0, 2045470970, 1);
    //Curseblade Labirith
    } else if (EventFlag(1049302184)) {
        $InitializeCommonEvent(0, 90009800, 1049308184, 41010800, 41, 1, 0, 0, 410100001, 1);
    //Dancer of Ranah
    } else if (EventFlag(1049302182)) {
        $InitializeCommonEvent(0, 90009800, 1049308182, 2046380800, 61, 46, 38, 0, 614638001, 1);
    //Death Knight (Gravesite Plain)
    } else if (EventFlag(1049302180)) {
        $InitializeCommonEvent(0, 90009800, 1049308180, 40000800, 40, 0, 0, 0, 400000001, 1);
    //Death Knight (Rauh Base)
    } else if (EventFlag(1049302186)) {
        $InitializeCommonEvent(0, 90009800, 1049308186, 40010800, 40, 1, 0, 0, 400100001, 1);
    //Death Rite Bird (Charo's Hidden Grave)
    } else if (EventFlag(1049302194)) {
        $InitializeCommonEvent(0, 90009800, 1049308194, 2047390800, 61, 47, 39, 0, 2047392099, 0);
    //Demi-Human Queen Marigga
    } else if (EventFlag(1049302187)) {
        $InitializeCommonEvent(0, 90009800, 1049308187, 2046400800, 61, 46, 40, 0, 614640001, 1);
    //Demi-Human Swordmaster Onze
    } else if (EventFlag(1049302179)) {
        $InitializeCommonEvent(0, 90009800, 1049308179, 41000800, 41, 0, 0, 0, 41000099, 1);
    //Divine Beast Dancing Lion (Rauh)
    } else if (EventFlag(1049302201)) {
        $InitializeCommonEvent(0, 90009800, 1049308201, 2046460800, 61, 46, 46, 0, 2046462099, 0);
    //Dryleaf Dane
    } else if (EventFlag(1049302195)) {
        SetEventFlagID(2049440700, OFF);
        SetEventFlagID(2049449211, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308195, 2049440800, 61, 49, 44, 0, 2049442099, 0);
    //Fallingstar Beast (Hinterland)
    } else if (EventFlag(1049302202)) {
        $InitializeCommonEvent(0, 90009800, 1049308202, 2052480800, 61, 52, 48, 0, 615248001, 1);
    //Ghostflame Dragon (Cerulean Coast)
    } else if (EventFlag(1049302188)) {
        $InitializeCommonEvent(0, 90009800, 1049308188, 2048380850, 61, 48, 38, 0, 2048382099, 0);
    //Ghostflame Dragon (Gravesite Plain)
    } else if (EventFlag(1049302181)) {
        $InitializeCommonEvent(0, 90009800, 1049308181, 2045440800, 61, 45, 44, 0, 2045442099, 0);
    //Ghostflame Dragon (Scadu Altus)
    } else if (EventFlag(1049302192)) {
        $InitializeCommonEvent(0, 90009800, 1049308192, 2049430800, 61, 49, 43, 0, 2049432098, 0);
    //Jagged Peak Drake
    } else if (EventFlag(1049302196)) {
        $InitializeCommonEvent(0, 90009800, 1049308196, 2049410800, 61, 49, 41, 0, 2049412099, 0);
    //Jagged Peak Drake x2
    } else if (EventFlag(1049302203)) {
        SetEventFlagID(2052400200, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308203, 2052400800, 61, 52, 40, 0, 2052402099, 0);
    //Jori, Elder Inquisitor
    } else if (EventFlag(1049302199)) {
        SetEventFlagID(2052432848, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308199, 2052430800, 40, 2, 0, 0, 400200001, 1);
    //Knight of the Solitary Gaol
    } else if (EventFlag(1049302198)) {
        $InitializeCommonEvent(0, 90009800, 1049308198, 2046410800, 61, 46, 41, 0, 614641001, 1);
    //Lamenter
    } else if (EventFlag(1049302189)) {
        $InitializeCommonEvent(0, 90009800, 1049308189, 41020800, 41, 2, 0, 0, 410200001, 1);
    //Rakshasa
    } else if (EventFlag(1049302206)) {
        $InitializeCommonEvent(0, 90009800, 1049308206, 2051440800, 61, 51, 44, 0, 615144001, 1);
    //Ralva the Great Red Bear
    } else if (EventFlag(1049302193)) {
        $InitializeCommonEvent(0, 90009800, 1049308193, 2049450800, 61, 49, 45, 0, 2049450971, 1);
    //Red Bear
    } else if (EventFlag(1049302185)) {
        $InitializeCommonEvent(0, 90009800, 1049308185, 2046450800, 61, 46, 45, 0, 614645101, 1);
    //Rugalea the Great Red Bear
    } else if (EventFlag(1049302197)) {
        $InitializeCommonEvent(0, 90009800, 1049308197, 2044470800, 61, 44, 47, 0, 2044472099, 0);
    //Tree Sentinel x2 (Hinterland)
    } else if (EventFlag(1049302204)) {
        SetEventFlagID(2050480860, OFF);
        $InitializeCommonEvent(0, 90009800, 1049308204, 2050470800, 61, 50, 47, 0, 2050472099, 0);
    }
});

//boss selection 5 (phase 2 bosses)
//(90009800, currentboss, bossdead, map1, map2, map3, map4, map5, stake)
$Event(90009805, Default, function() {
    //Bayle the Dread (phase 2) (restore HP)
    if (EventFlag(1049302700))
        $InitializeCommonEvent(0, 90009800, 1049309700, 2054390800, 61, 54, 39, 0, 2054392099, 0);
    //Bayle the Dread (phase 2) (normal HP)
    else if (EventFlag(1049302701))
        $InitializeCommonEvent(0, 90009800, 1049309701, 2054390800, 61, 54, 39, 0, 2054392099, 0);
    //Beast Clergyman / Maliketh (p2) (restore HP)
    else if (EventFlag(1049302702))
        $InitializeCommonEvent(0, 90009800, 1049309702, 13000800, 13, 0, 0, 0, 13000099, 0);
    //Beast Clergyman / Maliketh (p2) (normal HP)
    else if (EventFlag(1049302703))
        $InitializeCommonEvent(0, 90009800, 1049309703, 13000800, 13, 0, 0, 0, 13000099, 0);
    //Commander Gaius (p2) (restore HP)
    else if (EventFlag(1049302704))
        $InitializeCommonEvent(0, 90009800, 1049309704, 20000800, 61, 49, 48, 0, 2049482099, 0);
    //Commander Gaius (p2) (normal HP)
    else if (EventFlag(1049302705))
        $InitializeCommonEvent(0, 90009800, 1049309705, 20000800, 61, 49, 48, 0, 2049482099, 0);
    //Divine Beast Dancing Lion (p2) (restore HP)
    else if (EventFlag(1049302706))
        $InitializeCommonEvent(0, 90009800, 1049309706, 2049480800, 20, 0, 0, 0, 20000099, 0);
    //Divine Beast Dancing Lion (p2) (normal HP)
    else if (EventFlag(1049302707))
        $InitializeCommonEvent(0, 90009800, 1049309707, 2049480800, 20, 0, 0, 0, 20000099, 0);
    //Dragonkin Soldier of Nokstella (p2) (restore HP)
    else if (EventFlag(1049302708))
        $InitializeCommonEvent(0, 90009800, 1049309708, 12010800, 12, 1, 0, 0, 12010098, 1);
    //Dragonkin Soldier of Nokstella (p2) (normal HP)
    else if (EventFlag(1049302709))
        $InitializeCommonEvent(0, 90009800, 1049309709, 12010800, 12, 1, 0, 0, 12010098, 1);
    //Dragonlord Placidusax (p2) (restore HP)
    else if (EventFlag(1049302710))
        $InitializeCommonEvent(0, 90009800, 1049309710, 13000830, 13, 0, 0, 0, 13000098, 0);
    //Dragonlord Placidusax (p2) (normal HP)
    else if (EventFlag(1049302711))
        $InitializeCommonEvent(0, 90009800, 1049309711, 13000830, 13, 0, 0, 0, 13000098, 0);
    //Fire Giant (p2) (restore HP)
    else if (EventFlag(1049302712))
        $InitializeCommonEvent(0, 90009800, 1049309712, 1252520800, 60, 52, 53, 0, 1052530099, 0);
    //Fire Giant (p2) (normal HP)
    else if (EventFlag(1049302713))
        $InitializeCommonEvent(0, 90009800, 1049309713, 1252520800, 60, 52, 53, 0, 1052530099, 0);
    //Godfrey / Hoarah Loux (p2) (restore HP)
    else if (EventFlag(1049302714))
        $InitializeCommonEvent(0, 90009800, 1049309714, 11050800, 11, 5, 0, 0, 11050099, 0);
    //Godfrey / Hoarah Loux (p2) (normal HP)
    else if (EventFlag(1049302715))
        $InitializeCommonEvent(0, 90009800, 1049309715, 11050800, 11, 5, 0, 0, 11050099, 0);
    //Godrick the Grafted (p2) (restore HP)
    else if (EventFlag(1049302716))
        $InitializeCommonEvent(0, 90009800, 1049309716, 10000800, 10, 0, 0, 0, 10002899, 0);
    //Godrick the Grafted (p2) (normal HP)
    else if (EventFlag(1049302717))
        $InitializeCommonEvent(0, 90009800, 1049309717, 10000800, 10, 0, 0, 0, 10002899, 0);
    //Golden Hippopotamus (p2) (restore HP)
    else if (EventFlag(1049302718))
        $InitializeCommonEvent(0, 90009800, 1049309718, 21000850, 21, 0, 0, 0, 21000099, 0);
    //Golden Hippopotamus (p2) (normal HP)
    else if (EventFlag(1049302719))
        $InitializeCommonEvent(0, 90009800, 1049309719, 21000850, 21, 0, 0, 0, 21000099, 0);
    //Lichdragon Fortissax (p2) (restore HP)
    else if (EventFlag(1049302720)) {
        SetEventFlagID(12030800, ON);
        $InitializeCommonEvent(0, 90009800, 1049309720, 12030850, 12, 3, 0, 0, 12030099, 0);
    }
    //Lichdragon Fortissax (p2) (normal HP)
    else if (EventFlag(1049302721)) {
        SetEventFlagID(12030800, ON);
        $InitializeCommonEvent(0, 90009800, 1049309721, 12030850, 12, 3, 0, 0, 12030099, 0);
    }
    //Malenia, Blade of Miquella (p2) (restore HP)
    else if (EventFlag(1049302722))
        $InitializeCommonEvent(0, 90009800, 1049309722, 15000800, 15, 0, 0, 0, 15000099, 0);
    //Malenia, Blade of Miquella (p2) (normal HP)
    else if (EventFlag(1049302723))
        $InitializeCommonEvent(0, 90009800, 1049309723, 15000800, 15, 0, 0, 0, 15000099, 0);
    //Margit, the Fell Omen (p2) (restore HP)
    else if (EventFlag(1049302724))
        $InitializeCommonEvent(0, 90009800, 1049309724, 10000850, 10, 0, 0, 0, 10000091, 0);
    //Margit, the Fell Omen (p2) (normal HP)
    else if (EventFlag(1049302725))
        $InitializeCommonEvent(0, 90009800, 1049309725, 10000850, 10, 0, 0, 0, 10000091, 0);
    //Messmer the Impaler (p2) (restore HP)
    else if (EventFlag(1049302726))
        $InitializeCommonEvent(0, 90009800, 1049309726, 21010800, 21, 1, 0, 0, 21010099, 0);
    //Messmer the Impaler (p2) (normal HP)
    else if (EventFlag(1049302727))
        $InitializeCommonEvent(0, 90009800, 1049309727, 21010800, 21, 1, 0, 0, 21010099, 0);
    //Metyr, Mother of Fingers (p2) (restore HP)
    else if (EventFlag(1049302728))
        $InitializeCommonEvent(0, 90009800, 1049309728, 25000800, 25, 0, 0, 0, 25000099, 0);
    //Metyr, Mother of Fingers (p2) (normal HP)
    else if (EventFlag(1049302729))
        $InitializeCommonEvent(0, 90009800, 1049309729, 25000800, 25, 0, 0, 0, 25000099, 0);
    //Midra, Lord of Frenzied Flame (p2) (restore HP)
    else if (EventFlag(1049302730))
        $InitializeCommonEvent(0, 90009800, 1049309730, 28000800, 28, 0, 0, 0, 28000099, 0);
    //Midra, Lord of Frenzied Flame (p2) (normal HP)
    else if (EventFlag(1049302731))
        $InitializeCommonEvent(0, 90009800, 1049309731, 28000800, 28, 0, 0, 0, 28000099, 0);
    //Mohg, Lord of Blood (p2) (restore HP)
    else if (EventFlag(1049302732))
        $InitializeCommonEvent(0, 90009800, 1049309732, 12050800, 12, 5, 0, 0, 12050099, 1);
    //Mohg, Lord of Blood (p2) (normal HP)
    else if (EventFlag(1049302733))
        $InitializeCommonEvent(0, 90009800, 1049309733, 12050800, 12, 5, 0, 0, 12050099, 1);
    //Morgott, the Omen King (p2) (restore HP)
    else if (EventFlag(1049302734))
        $InitializeCommonEvent(0, 90009800, 1049309734, 11000800, 11, 0, 0, 0, 11000099, 0);
    //Morgott, the Omen King (p2) (normal HP)
    else if (EventFlag(1049302735))
        $InitializeCommonEvent(0, 90009800, 1049309735, 11000800, 11, 0, 0, 0, 11000099, 0);
    //Promised Consort Radahn (p2) (restore HP)
    else if (EventFlag(1049302736))
        $InitializeCommonEvent(0, 90009800, 1049309736, 20010800, 20, 1, 0, 0, 20010099, 0);
    //Promised Consort Radahn (p2) (normal HP)
    else if (EventFlag(1049302737))
        $InitializeCommonEvent(0, 90009800, 1049309737, 20010800, 20, 1, 0, 0, 20010099, 0);
    //Putrescent Knight (p2) (restore HP)
    else if (EventFlag(1049302738))
        $InitializeCommonEvent(0, 90009800, 1049309738, 22000800, 22, 0, 0, 0, 22000099, 0);
    //Putrescent Knight (p2) (normal HP)
    else if (EventFlag(1049302739))
        $InitializeCommonEvent(0, 90009800, 1049309739, 22000800, 22, 0, 0, 0, 22000099, 0);
    //Rellana, Twin Moon Knight (p2) (restore HP)
    else if (EventFlag(1049302740))
        $InitializeCommonEvent(0, 90009800, 1049309740, 2048440800, 61, 48, 44, 0, 2048442099, 0);
    //Rellana, Twin Moon Knight (p2) (normal HP)
    else if (EventFlag(1049302741))
        $InitializeCommonEvent(0, 90009800, 1049309741, 2048440800, 61, 48, 44, 0, 2048442099, 0);
    //Rennala, Queen of the Full Moon (p2) (buff HP)
    else if (EventFlag(1049302742))
        $InitializeCommonEvent(0, 90009800, 1049309742, 14000800, 14, 0, 0, 0, 14000099, 0);
    //Rennala, Queen of the Full Moon (p2) (normal HP)
    else if (EventFlag(1049302743))
        $InitializeCommonEvent(0, 90009800, 1049309743, 14000800, 14, 0, 0, 0, 14000099, 0);
    //Romina, Saint of the Bud (p2) (restore HP)
    else if (EventFlag(1049302744)) {
        SetEventFlagID(330, OFF);
        $InitializeCommonEvent(0, 90009800, 1049309744, 2044450800, 61, 44, 46, 0, 2044462099, 0);
    }
    //Romina, Saint of the Bud (p2) (normal HP)
    else if (EventFlag(1049302745)) {
        SetEventFlagID(330, OFF);
        $InitializeCommonEvent(0, 90009800, 1049309745, 2044450800, 61, 44, 46, 0, 2044462099, 0);
    }
    //Rykard, Lord of Blasphemy (p2) (buff HP)
    else if (EventFlag(1049302746))
        $InitializeCommonEvent(0, 90009800, 1049309746, 16000800, 16, 0, 0, 0, 16000099, 0);
    //Rykard, Lord of Blasphemy (p2) (normal HP)
    else if (EventFlag(1049302747))
        $InitializeCommonEvent(0, 90009800, 1049309747, 16000800, 16, 0, 0, 0, 16000099, 0);
    //Starscourge Radahn (p2) (restore HP)
    else if (EventFlag(1049302748))
        $InitializeCommonEvent(0, 90009800, 1049309748, 1252380800, 60, 51, 37, 0, 60513799, 1);
    //Starscourge Radahn (p2) (normal HP)
    else if (EventFlag(1049302749))
        $InitializeCommonEvent(0, 90009800, 1049309749, 1252380800, 60, 51, 37, 0, 60513799, 1);
});

//warp to boss
$Event(90009800, Default, function(currentBoss, vanillaDefeat, map1, map2, map3, map4, map5, stake) {
    if (CharacterHPValue(10000) == 0) { //if player is dead, set failsafe roundtable respawn
        SetEventFlagID(1049300408, ON);
        EndEvent();
    }
    BatchSetEventFlags(1049302000, 1049302227, OFF); //set boss selection triggers off
    BatchSetEventFlags(1049302700, 1049302799, OFF); //set boss selection triggers off
    BatchSetEventFlags(1049308000, 1049308219, OFF); //set current boss flags off
    BatchSetEventFlags(1049309700, 1049309799, OFF); //set current boss flags off
    SetEventFlagID(currentBoss, ON);
    SetEventFlagID(vanillaDefeat, OFF);
    if (stake == 1) //if boss has stake of marika
        SetEventFlagID(1049300404, ON); //signal flag for respawn point event
    else
        SetEventFlagID(1049300404, OFF);
    SetEventFlagID(1049300091, ON); //allow rematch again
    WarpPlayer(map1, map2, map3, map4, map5, -1);
});

//boss defeat
$Event(90009810, Default, function(bossrushDefeat) {
    playerDead = CharacterHPValue(10000) == 0
    SuppressSE(SoundType.BGM, 0, true);
    if (EventFlag(1049300057)) { //if progression mode
        if (!EventFlag(1049304330)) //if boss replay not unlocked, disable boss rematch
            SetEventFlagID(1049300091, OFF);
        WaitFixedTimeFrames(5); //delay to ensure rewards event has run
        if (AllBatchEventFlags(1049304100, 1049304306)) //if all bosses defeated
            SetEventFlagID(1049300042, ON);
        if (AllBatchEventFlags(1049304100, 1049304264)) //if all base game bosses defeated
            SetEventFlagID(1049304331, ON);
        if (AllBatchEventFlags(1049304400, 1049304996) && AllBatchEventFlags(1049307000, 1049307353)) //if all items obtained
            SetEventFlagID(1049300043, ON);
        if (AllBatchEventFlags(1049304400, 1049304996) && AllBatchEventFlags(1049307000, 1049307135)) //if all base game items obtained
            SetEventFlagID(1049304334, ON);
    }
    //boss rush
    if (AnyBatchEventFlags(1049308250, 1049308275)) {
        BatchSetEventFlags(1049307399, 1049307799, OFF); //set sequential defeat flags off
        SetEventFlagID(bossrushDefeat, ON); //turn on sequential defeat flag
        if (!EventFlag(1049300093)) { //if warp choice disabled, continue to next boss
            //WaitFixedTimeSeconds(2);
            //DisplayBlinkingMessage(2081025);
            //WaitFixedTimeSeconds(4);
            $InitializeCommonEvent(0, 90009920);
        }
        else { //if warp choice enabled
            WaitFixedTimeSeconds(4);
            DisplayGenericDialogAndSetEventFlags(1049300001, PromptType.YESNO, NumberofOptions.TwoButtons, 0, 100, 1049302431, 1049302432, 1049302432);
            WaitFor(EventFlag(1049302431) || EventFlag(1049302432) || playerDead);
            if (playerDead.Passed) { //if player is dead, set failsafe roundtable respawn
                SetEventFlagID(1049300408, ON);
                EndEvent();
            }           
            else if (EventFlag(1049302431)) //if yes, warp to roundtable
                $InitializeCommonEvent(0, 90009820, 0);
            else //continue to next boss
                $InitializeCommonEvent(0, 90009920);
        }
    }
    //random sequential
    else if (EventFlag(1049300056) && AnyBatchEventFlags(1049308280, 1049308299)) {
        SetEventFlagID(bossrushDefeat, ON); //turn on sequential defeat flag
        if (!EventFlag(1049300095)) { //if warp choice disabled, continue to next boss
            WaitFixedTimeSeconds(2);
            DisplayBlinkingMessage(2081026);
            WaitFixedTimeSeconds(4);
            $InitializeCommonEvent(0, 90009830);
        }
        else { //if warp choice enabled
            WaitFixedTimeSeconds(4);
            DisplayGenericDialogAndSetEventFlags(1049300001, PromptType.YESNO, NumberofOptions.TwoButtons, 0, 100, 1049302431, 1049302432, 1049302432);
            WaitFor(EventFlag(1049302431) || EventFlag(1049302432) || playerDead);
            if (playerDead.Passed) { //if player is dead, set failsafe roundtable respawn
                SetEventFlagID(1049300408, ON);
                EndEvent();
            }           
            else if (EventFlag(1049302431)) //if yes, warp to roundtable
                $InitializeCommonEvent(0, 90009820, 0);
            else //continue to next boss
                $InitializeCommonEvent(0, 90009830);
        }
    } 
    //progression sequential mode (undefeated bosses)
    else if (AnyBatchEventFlags(1049308301, 1049308319)) {
        if (!EventFlag(1049300094)) { //if warp choice disabled, continue to next boss
            //WaitFixedTimeSeconds(2);
            //DisplayBlinkingMessage(2081025);
            //WaitFixedTimeSeconds(4);
            $InitializeCommonEvent(0, 90009930);
        }
        else { //if warp choice enabled
            WaitFixedTimeSeconds(4);
            DisplayGenericDialogAndSetEventFlags(1049300001, PromptType.YESNO, NumberofOptions.TwoButtons, 0, 100, 1049302431, 1049302432, 1049302432);
            WaitFor(EventFlag(1049302431) || EventFlag(1049302432) || playerDead);
            if (playerDead.Passed) { //if player is dead, set failsafe roundtable respawn
                SetEventFlagID(1049300408, ON);
                EndEvent();
            }           
            else if (EventFlag(1049302431)) //if yes, warp to roundtable
                $InitializeCommonEvent(0, 90009820, 0);
            else //continue to next boss
                $InitializeCommonEvent(0, 90009930);
        }
    }
    //progression sequential mode (all bosses)
    else if (AnyBatchEventFlags(1049308321, 1049308339)) {
        BatchSetEventFlags(1049307399, 1049307799, OFF); //set sequential defeat flags off
        SetEventFlagID(bossrushDefeat, ON); //turn on sequential defeat flag
        if (!EventFlag(1049300094)) { //if warp choice disabled, continue to next boss
            //WaitFixedTimeSeconds(2);
            //DisplayBlinkingMessage(2081025);
            //WaitFixedTimeSeconds(4);
            $InitializeCommonEvent(0, 90009950);
        }
        else { //if warp choice enabled
            WaitFixedTimeSeconds(4);
            DisplayGenericDialogAndSetEventFlags(1049300001, PromptType.YESNO, NumberofOptions.TwoButtons, 0, 100, 1049302431, 1049302432, 1049302432);
            WaitFor(EventFlag(1049302431) || EventFlag(1049302432) || playerDead);
            if (playerDead.Passed) { //if player is dead, set failsafe roundtable respawn
                SetEventFlagID(1049300408, ON);
                EndEvent();
            }           
            else if (EventFlag(1049302431)) //if yes, warp to roundtable
                $InitializeCommonEvent(0, 90009820, 0);
            else //continue to next boss
                $InitializeCommonEvent(0, 90009950);
        }
    }
    //roundtable warp (manual selection, random single)
    else {
        WaitFixedTimeSeconds(2);
        DisplayBlinkingMessage(2081027);
        WaitFixedTimeSeconds(4);
        $InitializeCommonEvent(0, 90009820, 0);
    }
});

//roundtable warp
$Event(90009820, Default, function(unused) {
    if (CharacterHPValue(10000) == 0) { //if player is dead, set failsafe roundtable respawn
        SetEventFlagID(1049300408, ON);
        EndEvent();
    }
    WarpPlayer(11, 10, 0, 0, 11100000, -1);
});

//last boss selected (remembrance + great enemies)
$Event(90009840, Default, function() {
    if (EventFlag(1049308000)) {
        SetEventFlagID(1049302000, ON);
    } else if (EventFlag(1049308001)) {
        SetEventFlagID(1049302001, ON);
    } else if (EventFlag(1049308002)) {
        SetEventFlagID(1049302002, ON);
    } else if (EventFlag(1049308003)) {
        SetEventFlagID(1049302003, ON);
    } else if (EventFlag(1049308004)) {
        SetEventFlagID(1049302004, ON);
    } else if (EventFlag(1049308005)) {
        SetEventFlagID(1049302005, ON);
    } else if (EventFlag(1049308006)) {
        SetEventFlagID(1049302006, ON);
    } else if (EventFlag(1049308007)) {
        SetEventFlagID(1049302007, ON);
    } else if (EventFlag(1049308008)) {
        SetEventFlagID(1049302008, ON);
    } else if (EventFlag(1049308009)) {
        SetEventFlagID(1049302009, ON);
    } else if (EventFlag(1049308010)) {
        SetEventFlagID(1049302010, ON);
    } else if (EventFlag(1049308011)) {
        SetEventFlagID(1049302011, ON);
    } else if (EventFlag(1049308012)) {
        SetEventFlagID(1049302012, ON);
    } else if (EventFlag(1049308013)) {
        SetEventFlagID(1049302013, ON);
    } else if (EventFlag(1049308014)) {
        SetEventFlagID(1049302014, ON);
    } else if (EventFlag(1049308015)) {
        SetEventFlagID(1049302015, ON);
    } else if (EventFlag(1049308016)) {
        SetEventFlagID(1049302016, ON);
    } else if (EventFlag(1049308017)) {
        SetEventFlagID(1049302017, ON);
    } else if (EventFlag(1049308018)) {
        SetEventFlagID(1049302018, ON);
    } else if (EventFlag(1049308019)) {
        SetEventFlagID(1049302019, ON);
    } else if (EventFlag(1049308020)) {
        SetEventFlagID(1049302020, ON);
    } else if (EventFlag(1049308021)) {
        SetEventFlagID(1049302021, ON);
    } else if (EventFlag(1049308022)) {
        SetEventFlagID(1049302022, ON);
    } else if (EventFlag(1049308023)) {
        SetEventFlagID(1049302023, ON);
    } else if (EventFlag(1049308024)) {
        SetEventFlagID(1049302024, ON);
    } else if (EventFlag(1049308025)) {
        SetEventFlagID(1049302025, ON);
    } else if (EventFlag(1049308026)) {
        SetEventFlagID(1049302026, ON);
    } else if (EventFlag(1049308027)) {
        SetEventFlagID(1049302027, ON);
    } else if (EventFlag(1049308028)) {
        SetEventFlagID(1049302028, ON);
    } else if (EventFlag(1049308029)) {
        SetEventFlagID(1049302029, ON);
    } else if (EventFlag(1049308030)) {
        SetEventFlagID(1049302030, ON);
    } else if (EventFlag(1049308031)) {
        SetEventFlagID(1049302031, ON);
    } else if (EventFlag(1049308032)) {
        SetEventFlagID(1049302032, ON);
    } else if (EventFlag(1049308033)) {
        SetEventFlagID(1049302033, ON);
    } else if (EventFlag(1049308034)) {
        SetEventFlagID(1049302034, ON);
    } else if (EventFlag(1049308035)) {
        SetEventFlagID(1049302035, ON);
    } else if (EventFlag(1049308036)) {
        SetEventFlagID(1049302036, ON);
    } else if (EventFlag(1049308037)) {
        SetEventFlagID(1049302037, ON);
    } else if (EventFlag(1049308038)) {
        SetEventFlagID(1049302038, ON);
    } else if (EventFlag(1049308039)) {
        SetEventFlagID(1049302039, ON);
    } else if (EventFlag(1049308040)) {
        SetEventFlagID(1049302040, ON);
    } else if (EventFlag(1049308041)) {
        SetEventFlagID(1049302041, ON);
    } else if (EventFlag(1049308042)) {
        SetEventFlagID(1049302042, ON);
    } else if (EventFlag(1049308043)) {
        SetEventFlagID(1049302043, ON);
    } else if (EventFlag(1049308044)) {
        SetEventFlagID(1049302044, ON);
    } else if (EventFlag(1049308045)) {
        SetEventFlagID(1049302045, ON);
    } else if (EventFlag(1049308046)) {
        SetEventFlagID(1049302046, ON);
    } else if (EventFlag(1049308047)) {
        SetEventFlagID(1049302047, ON);
    } else if (EventFlag(1049308048)) {
        SetEventFlagID(1049302048, ON);
    } else if (EventFlag(1049308049)) {
        SetEventFlagID(1049302049, ON);
    }
    $InitializeCommonEvent(0, 90009801);
});

//last boss selected (overworld)
$Event(90009841, Default, function() {
    if (EventFlag(1049308050)) {
        SetEventFlagID(1049302050, ON);
    } else if (EventFlag(1049308051)) {
        SetEventFlagID(1049302051, ON);
    } else if (EventFlag(1049308052)) {
        SetEventFlagID(1049302052, ON);
    } else if (EventFlag(1049308053)) {
        SetEventFlagID(1049302053, ON);
    } else if (EventFlag(1049308054)) {
        SetEventFlagID(1049302054, ON);
    } else if (EventFlag(1049308055)) {
        SetEventFlagID(1049302055, ON);
    } else if (EventFlag(1049308056)) {
        SetEventFlagID(1049302056, ON);
    } else if (EventFlag(1049308057)) {
        SetEventFlagID(1049302057, ON);
    } else if (EventFlag(1049308058)) {
        SetEventFlagID(1049302058, ON);
    } else if (EventFlag(1049308059)) {
        SetEventFlagID(1049302059, ON);
    } else if (EventFlag(1049308060)) {
        SetEventFlagID(1049302060, ON);
    } else if (EventFlag(1049308061)) {
        SetEventFlagID(1049302061, ON);
    } else if (EventFlag(1049308062)) {
        SetEventFlagID(1049302062, ON);
    } else if (EventFlag(1049308063)) {
        SetEventFlagID(1049302063, ON);
    } else if (EventFlag(1049308064)) {
        SetEventFlagID(1049302064, ON);
    } else if (EventFlag(1049308065)) {
        SetEventFlagID(1049302065, ON);
    } else if (EventFlag(1049308066)) {
        SetEventFlagID(1049302066, ON);
    } else if (EventFlag(1049308067)) {
        SetEventFlagID(1049302067, ON);
    } else if (EventFlag(1049308068)) {
        SetEventFlagID(1049302068, ON);
    } else if (EventFlag(1049308069)) {
        SetEventFlagID(1049302069, ON);
    } else if (EventFlag(1049308070)) {
        SetEventFlagID(1049302070, ON);
    } else if (EventFlag(1049308071)) {
        SetEventFlagID(1049302071, ON);
    } else if (EventFlag(1049308072)) {
        SetEventFlagID(1049302072, ON);
    } else if (EventFlag(1049308073)) {
        SetEventFlagID(1049302073, ON);
    } else if (EventFlag(1049308074)) {
        SetEventFlagID(1049302074, ON);
    } else if (EventFlag(1049308075)) {
        SetEventFlagID(1049302075, ON);
    } else if (EventFlag(1049308076)) {
        SetEventFlagID(1049302076, ON);
    } else if (EventFlag(1049308077)) {
        SetEventFlagID(1049302077, ON);
    } else if (EventFlag(1049308078)) {
        SetEventFlagID(1049302078, ON);
    } else if (EventFlag(1049308079)) {
        SetEventFlagID(1049302079, ON);
    } else if (EventFlag(1049308080)) {
        SetEventFlagID(1049302080, ON);
    } else if (EventFlag(1049308081)) {
        SetEventFlagID(1049302081, ON);
    } else if (EventFlag(1049308082)) {
        SetEventFlagID(1049302082, ON);
    } else if (EventFlag(1049308083)) {
        SetEventFlagID(1049302083, ON);
    } else if (EventFlag(1049308084)) {
        SetEventFlagID(1049302084, ON);
    } else if (EventFlag(1049308085)) {
        SetEventFlagID(1049302085, ON);
    } else if (EventFlag(1049308086)) {
        SetEventFlagID(1049302086, ON);
    } else if (EventFlag(1049308087)) {
        SetEventFlagID(1049302087, ON);
    } else if (EventFlag(1049308088)) {
        SetEventFlagID(1049302088, ON);
    } else if (EventFlag(1049308089)) {
        SetEventFlagID(1049302089, ON);
    } else if (EventFlag(1049308090)) {
        SetEventFlagID(1049302090, ON);
    } else if (EventFlag(1049308091)) {
        SetEventFlagID(1049302091, ON);
    } else if (EventFlag(1049308092)) {
        SetEventFlagID(1049302092, ON);
    } else if (EventFlag(1049308093)) {
        SetEventFlagID(1049302093, ON);
    } else if (EventFlag(1049308094)) {
        SetEventFlagID(1049302094, ON);
    } else if (EventFlag(1049308095)) {
        SetEventFlagID(1049302095, ON);
    } else if (EventFlag(1049308096)) {
        SetEventFlagID(1049302096, ON);
    }
    $InitializeCommonEvent(0, 90009802);
});

//last boss selected (evergaols + side dungeons)
$Event(90009842, Default, function() {
    if (EventFlag(1049308097)) {
        SetEventFlagID(1049302097, ON);
    } else if (EventFlag(1049308098)) {
        SetEventFlagID(1049302098, ON);
    } else if (EventFlag(1049308099)) {
        SetEventFlagID(1049302099, ON);
    } else if (EventFlag(1049308100)) {
        SetEventFlagID(1049302100, ON);
    } else if (EventFlag(1049308101)) {
        SetEventFlagID(1049302101, ON);
    } else if (EventFlag(1049308102)) {
        SetEventFlagID(1049302102, ON);
    } else if (EventFlag(1049308103)) {
        SetEventFlagID(1049302103, ON);
    } else if (EventFlag(1049308104)) {
        SetEventFlagID(1049302104, ON);
    } else if (EventFlag(1049308105)) {
        SetEventFlagID(1049302105, ON);
    } else if (EventFlag(1049308106)) {
        SetEventFlagID(1049302106, ON);
    } else if (EventFlag(1049308107)) {
        SetEventFlagID(1049302107, ON);
    } else if (EventFlag(1049308108)) {
        SetEventFlagID(1049302108, ON);
    } else if (EventFlag(1049308109)) {
        SetEventFlagID(1049302109, ON);
    } else if (EventFlag(1049308110)) {
        SetEventFlagID(1049302110, ON);
    } else if (EventFlag(1049308111)) {
        SetEventFlagID(1049302111, ON);
    } else if (EventFlag(1049308112)) {
        SetEventFlagID(1049302112, ON);
    } else if (EventFlag(1049308113)) {
        SetEventFlagID(1049302113, ON);
    } else if (EventFlag(1049308114)) {
        SetEventFlagID(1049302114, ON);
    } else if (EventFlag(1049308115)) {
        SetEventFlagID(1049302115, ON);
    } else if (EventFlag(1049308116)) {
        SetEventFlagID(1049302116, ON);
    } else if (EventFlag(1049308117)) {
        SetEventFlagID(1049302117, ON);
    } else if (EventFlag(1049308118)) {
        SetEventFlagID(1049302118, ON);
    } else if (EventFlag(1049308119)) {
        SetEventFlagID(1049302119, ON);
    } else if (EventFlag(1049308120)) {
        SetEventFlagID(1049302120, ON);
    } else if (EventFlag(1049308121)) {
        SetEventFlagID(1049302121, ON);
    } else if (EventFlag(1049308122)) {
        SetEventFlagID(1049302122, ON);
    } else if (EventFlag(1049308123)) {
        SetEventFlagID(1049302123, ON);
    } else if (EventFlag(1049308124)) {
        SetEventFlagID(1049302124, ON);
    } else if (EventFlag(1049308125)) {
        SetEventFlagID(1049302125, ON);
    } else if (EventFlag(1049308126)) {
        SetEventFlagID(1049302126, ON);
    } else if (EventFlag(1049308127)) {
        SetEventFlagID(1049302127, ON);
    } else if (EventFlag(1049308128)) {
        SetEventFlagID(1049302128, ON);
    } else if (EventFlag(1049308129)) {
        SetEventFlagID(1049302129, ON);
    } else if (EventFlag(1049308130)) {
        SetEventFlagID(1049302130, ON);
    } else if (EventFlag(1049308131)) {
        SetEventFlagID(1049302131, ON);
    } else if (EventFlag(1049308132)) {
        SetEventFlagID(1049302132, ON);
    } else if (EventFlag(1049308133)) {
        SetEventFlagID(1049302133, ON);
    } else if (EventFlag(1049308134)) {
        SetEventFlagID(1049302134, ON);
    } else if (EventFlag(1049308135)) {
        SetEventFlagID(1049302135, ON);
    } else if (EventFlag(1049308136)) {
        SetEventFlagID(1049302136, ON);
    } else if (EventFlag(1049308137)) {
        SetEventFlagID(1049302137, ON);
    } else if (EventFlag(1049308138)) {
        SetEventFlagID(1049302138, ON);
    } else if (EventFlag(1049308139)) {
        SetEventFlagID(1049302139, ON);
    } else if (EventFlag(1049308140)) {
        SetEventFlagID(1049302140, ON);
    } else if (EventFlag(1049308141)) {
        SetEventFlagID(1049302141, ON);
    } else if (EventFlag(1049308142)) {
        SetEventFlagID(1049302142, ON);
    } else if (EventFlag(1049308143)) {
        SetEventFlagID(1049302143, ON);
    } else if (EventFlag(1049308144)) {
        SetEventFlagID(1049302144, ON);
    } else if (EventFlag(1049308145)) {
        SetEventFlagID(1049302145, ON);
    } else if (EventFlag(1049308146)) {
        SetEventFlagID(1049302146, ON);
    } else if (EventFlag(1049308147)) {
        SetEventFlagID(1049302147, ON);
    } else if (EventFlag(1049308148)) {
        SetEventFlagID(1049302148, ON);
    } else if (EventFlag(1049308149)) {
        SetEventFlagID(1049302149, ON);
    } else if (EventFlag(1049308150)) {
        SetEventFlagID(1049302150, ON);
    } else if (EventFlag(1049308151)) {
        SetEventFlagID(1049302151, ON);
    } else if (EventFlag(1049308152)) {
        SetEventFlagID(1049302152, ON);
    } else if (EventFlag(1049308153)) {
        SetEventFlagID(1049302153, ON);
    } else if (EventFlag(1049308154)) {
        SetEventFlagID(1049302154, ON);
    } else if (EventFlag(1049308155)) {
        SetEventFlagID(1049302155, ON);
    } else if (EventFlag(1049308156)) {
        SetEventFlagID(1049302156, ON);
    } else if (EventFlag(1049308157)) {
        SetEventFlagID(1049302157, ON);
    } else if (EventFlag(1049308158)) {
        SetEventFlagID(1049302158, ON);
    } else if (EventFlag(1049308159)) {
        SetEventFlagID(1049302159, ON);
    } else if (EventFlag(1049308160)) {
        SetEventFlagID(1049302160, ON);
    } else if (EventFlag(1049308161)) {
        SetEventFlagID(1049302161, ON);
    } else if (EventFlag(1049308162)) {
        SetEventFlagID(1049302162, ON);
    } else if (EventFlag(1049308163)) {
        SetEventFlagID(1049302163, ON);
    } else if (EventFlag(1049308164)) {
        SetEventFlagID(1049302164, ON);
    } else if (EventFlag(1049308165)) {
        SetEventFlagID(1049302165, ON);
    } else if (EventFlag(1049308166)) {
        SetEventFlagID(1049302166, ON);
    }
    $InitializeCommonEvent(0, 90009803);
});

//last boss selected (dlc)
$Event(90009843, Restart, function() {
    if (EventFlag(1049308167)) {
        SetEventFlagID(1049302167, ON);
    } else if (EventFlag(1049308168)) {
        SetEventFlagID(1049302168, ON);
    } else if (EventFlag(1049308169)) {
        SetEventFlagID(1049302169, ON);
    } else if (EventFlag(1049308170)) {
        SetEventFlagID(1049302170, ON);
    } else if (EventFlag(1049308171)) {
        SetEventFlagID(1049302171, ON);
    } else if (EventFlag(1049308172)) {
        SetEventFlagID(1049302172, ON);
    } else if (EventFlag(1049308173)) {
        SetEventFlagID(1049302173, ON);
    } else if (EventFlag(1049308174)) {
        SetEventFlagID(1049302174, ON);
    } else if (EventFlag(1049308175)) {
        SetEventFlagID(1049302175, ON);
    } else if (EventFlag(1049308176)) {
        SetEventFlagID(1049302176, ON);
    } else if (EventFlag(1049308177)) {
        SetEventFlagID(1049302177, ON);
    } else if (EventFlag(1049308178)) {
        SetEventFlagID(1049302178, ON);
    } else if (EventFlag(1049308179)) {
        SetEventFlagID(1049302179, ON);
    } else if (EventFlag(1049308180)) {
        SetEventFlagID(1049302180, ON);
    } else if (EventFlag(1049308181)) {
        SetEventFlagID(1049302181, ON);
    } else if (EventFlag(1049308182)) {
        SetEventFlagID(1049302182, ON);
    } else if (EventFlag(1049308183)) {
        SetEventFlagID(1049302183, ON);
    } else if (EventFlag(1049308184)) {
        SetEventFlagID(1049302184, ON);
    } else if (EventFlag(1049308185)) {
        SetEventFlagID(1049302185, ON);
    } else if (EventFlag(1049308186)) {
        SetEventFlagID(1049302186, ON);
    } else if (EventFlag(1049308187)) {
        SetEventFlagID(1049302187, ON);
    } else if (EventFlag(1049308188)) {
        SetEventFlagID(1049302188, ON);
    } else if (EventFlag(1049308189)) {
        SetEventFlagID(1049302189, ON);
    } else if (EventFlag(1049308190)) {
        SetEventFlagID(1049302190, ON);
    } else if (EventFlag(1049308191)) {
        SetEventFlagID(1049302191, ON);
    } else if (EventFlag(1049308192)) {
        SetEventFlagID(1049302192, ON);
    } else if (EventFlag(1049308193)) {
        SetEventFlagID(1049302193, ON);
    } else if (EventFlag(1049308194)) {
        SetEventFlagID(1049302194, ON);
    } else if (EventFlag(1049308195)) {
        SetEventFlagID(1049302195, ON);
    } else if (EventFlag(1049308196)) {
        SetEventFlagID(1049302196, ON);
    } else if (EventFlag(1049308197)) {
        SetEventFlagID(1049302197, ON);
    } else if (EventFlag(1049308198)) {
        SetEventFlagID(1049302198, ON);
    } else if (EventFlag(1049308199)) {
        SetEventFlagID(1049302199, ON);
    } else if (EventFlag(1049308200)) {
        SetEventFlagID(1049302200, ON);
    } else if (EventFlag(1049308201)) {
        SetEventFlagID(1049302201, ON);
    } else if (EventFlag(1049308202)) {
        SetEventFlagID(1049302202, ON);
    } else if (EventFlag(1049308203)) {
        SetEventFlagID(1049302203, ON);
    } else if (EventFlag(1049308204)) {
        SetEventFlagID(1049302204, ON);
    } else if (EventFlag(1049308205)) {
        SetEventFlagID(1049302205, ON);
    } else if (EventFlag(1049308206)) {
        SetEventFlagID(1049302206, ON);
    } else if (EventFlag(1049308207)) {
        SetEventFlagID(1049302207, ON);
    } else if (EventFlag(1049308208)) {
        SetEventFlagID(1049302208, ON);
    }
    $InitializeCommonEvent(0, 90009804);
});

//last boss selected (phase 2)
$Event(90009844, Restart, function() {
    if (EventFlag(1049309700))
        SetEventFlagID(1049302700, ON);
    else if (EventFlag(1049309701))
        SetEventFlagID(1049302701, ON);
    else if (EventFlag(1049309702))
        SetEventFlagID(1049302702, ON);
    else if (EventFlag(1049309703))
        SetEventFlagID(1049302703, ON);
    else if (EventFlag(1049309704))
        SetEventFlagID(1049302704, ON);
    else if (EventFlag(1049309705))
        SetEventFlagID(1049302705, ON);
    else if (EventFlag(1049309706))
        SetEventFlagID(1049302706, ON);
    else if (EventFlag(1049309707))
        SetEventFlagID(1049302707, ON);
    else if (EventFlag(1049309708))
        SetEventFlagID(1049302708, ON);
    else if (EventFlag(1049309709))
        SetEventFlagID(1049302709, ON);
    else if (EventFlag(1049309710))
        SetEventFlagID(1049302710, ON);
    else if (EventFlag(1049309711))
        SetEventFlagID(1049302711, ON);
    else if (EventFlag(1049309712))
        SetEventFlagID(1049302712, ON);
    else if (EventFlag(1049309713))
        SetEventFlagID(1049302713, ON);
    else if (EventFlag(1049309714))
        SetEventFlagID(1049302714, ON);
    else if (EventFlag(1049309715))
        SetEventFlagID(1049302715, ON);
    else if (EventFlag(1049309716))
        SetEventFlagID(1049302716, ON);
    else if (EventFlag(1049309717))
        SetEventFlagID(1049302717, ON);
    else if (EventFlag(1049309718))
        SetEventFlagID(1049302718, ON);
    else if (EventFlag(1049309719))
        SetEventFlagID(1049302719, ON);
    else if (EventFlag(1049309720))
        SetEventFlagID(1049302720, ON);
    else if (EventFlag(1049309721))
        SetEventFlagID(1049302721, ON);
    else if (EventFlag(1049309722))
        SetEventFlagID(1049302722, ON);
    else if (EventFlag(1049309723))
        SetEventFlagID(1049302723, ON);
    else if (EventFlag(1049309724))
        SetEventFlagID(1049302724, ON);
    else if (EventFlag(1049309725))
        SetEventFlagID(1049302725, ON);
    else if (EventFlag(1049309726))
        SetEventFlagID(1049302726, ON);
    else if (EventFlag(1049309727))
        SetEventFlagID(1049302727, ON);
    else if (EventFlag(1049309728))
        SetEventFlagID(1049302728, ON);
    else if (EventFlag(1049309729))
        SetEventFlagID(1049302729, ON);
    else if (EventFlag(1049309730))
        SetEventFlagID(1049302730, ON);
    else if (EventFlag(1049309731))
        SetEventFlagID(1049302731, ON);
    else if (EventFlag(1049309732))
        SetEventFlagID(1049302732, ON);
    else if (EventFlag(1049309733))
        SetEventFlagID(1049302733, ON);
    else if (EventFlag(1049309734))
        SetEventFlagID(1049302734, ON);
    else if (EventFlag(1049309735))
        SetEventFlagID(1049302735, ON);
    else if (EventFlag(1049309736))
        SetEventFlagID(1049302736, ON);
    else if (EventFlag(1049309737))
        SetEventFlagID(1049302737, ON);
    else if (EventFlag(1049309738))
        SetEventFlagID(1049302738, ON);
    else if (EventFlag(1049309739))
        SetEventFlagID(1049302739, ON);
    else if (EventFlag(1049309740))
        SetEventFlagID(1049302740, ON);
    else if (EventFlag(1049309741))
        SetEventFlagID(1049302741, ON);
    else if (EventFlag(1049309742))
        SetEventFlagID(1049302742, ON);
    else if (EventFlag(1049309743))
        SetEventFlagID(1049302743, ON);
    else if (EventFlag(1049309744))
        SetEventFlagID(1049302744, ON);
    else if (EventFlag(1049309745))
        SetEventFlagID(1049302745, ON);
    else if (EventFlag(1049309746))
        SetEventFlagID(1049302746, ON);
    else if (EventFlag(1049309747))
        SetEventFlagID(1049302747, ON);
    else if (EventFlag(1049309748))
        SetEventFlagID(1049302748, ON);
    else if (EventFlag(1049309749))
        SetEventFlagID(1049302749, ON);
    $InitializeCommonEvent(0, 90009805);
});

//character initialization
$Event(10010001, Default, function() {
    EndIf(EventFlag(1049300000)); //end if init already run
    SetEventFlagID(100, ON);
    SetEventFlagID(9021, ON);
    SetEventFlagID(10010500, ON);
    SetEventFlagID(10010502, ON);
    SetEventFlagID(10018560, ON);
    SetEventFlagID(710000, ON);
    SetEventFlagID(10012802, ON);
    SetEventFlagID(66150, ON);
    SetEventFlagID(66170, ON);
    SetEventFlagID(66180, ON);
    SetEventFlagID(10019200, ON);
    SetEventFlagID(1041389412, ON);
    SetEventFlagID(1041389406, ON);
    SetEventFlagID(60835, ON);
    SetEventFlagID(1041389407, ON);
    SetEventFlagID(1041389411, ON);
    SetEventFlagID(1041382735, ON);
    SetEventFlagID(1041389408, ON);
    SetEventFlagID(11109258, ON);
    SetEventFlagID(11109260, ON);
    SetEventFlagID(11109261, ON);
    SetEventFlagID(11109262, ON);
    SetEventFlagID(11109263, ON);
    SetEventFlagID(30102455, OFF);
    SetEventFlagID(3063, ON);
    SetEventFlagID(11109268, ON);
    SetEventFlagID(35009306, ON);
    SetEventFlagID(4247, ON);
    SetEventFlagID(11109270, ON);
    SetEventFlagID(4248, ON);
    SetEventFlagID(11109272, ON);
    SetEventFlagID(4249, ON);
    SetEventFlagID(11109271, ON);
    SetEventFlagID(1041382732, ON);
    SetEventFlagID(1041389409, ON);
    SetEventFlagID(1041389413, ON);
    SetEventFlagID(3700, ON);
    SetEventFlagID(11102710, ON);
    SetEventFlagID(11109207, ON);
    SetEventFlagID(11109210, ON);
    SetEventFlagID(11109213, ON);
    SetEventFlagID(1041382735, ON);
    SetEventFlagID(11109255, ON);
    SetEventFlagID(11109256, ON);
    SetEventFlagID(60835, ON);
    SetEventFlagID(11109265, ON);
    SetEventFlagID(60803, ON);
    SetEventFlagID(11109267, ON);
    SetEventFlagID(1049300094, OFF); 
    SetEventFlagID(1041389411, ON);
    SetEventFlagID(951, ON);
    SetEventFlagID(953, ON);
    SetEventFlagID(4680, ON);
    SetEventFlagID(4681, ON);
    //torrent whistle
    AwardItemLot(100000);
    //flask of tears
    AwardItemLot(2000);
    //spirit calling bell
    AwardItemLot(103900);
    //physick flask
    DirectlyGivePlayerItem(ItemType.Goods, 250, 951, 1);
    //finger severer
    AwardItemLot(18000081);
    //whetstones
    DirectlyGivePlayerItem(ItemType.Goods, 8590, 951, 1);
    SetEventFlagID(60130, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 8970, 951, 1);
    SetEventFlagID(65610, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 8971, 951, 1);
    SetEventFlagID(65660, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 8972, 951, 1);
    SetEventFlagID(65720, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 8973, 951, 1);
    SetEventFlagID(65680, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 8974, 951, 1);
    SetEventFlagID(65640, ON);

    AwardItemLot(1049304271); // kick
    AwardItemLot(1049304038); // tali pouches
    AwardItemLot(1049304064); // tali pouches
    AwardItemLot(1049304101); // tali pouches
    
    //maps
    AwardItemLot(1042370200);
    AwardItemLot(1044320000);
    AwardItemLot(1045370020);
    AwardItemLot(1049400500);
    AwardItemLot(1049370500);
    AwardItemLot(1038410200);
    AwardItemLot(1037440210);
    AwardItemLot(1034480200);
    AwardItemLot(1040520500);
    AwardItemLot(1042510500);
    AwardItemLot(1036540500);
    AwardItemLot(1049530700);
    AwardItemLot(1052540700);
    AwardItemLot(1048560700);
    AwardItemLot(12010000);
    AwardItemLot(12010010);
    AwardItemLot(12020060);
    AwardItemLot(12030000);
    AwardItemLot(12050000);
    AwardItemLot(50070);
    //crafting kit
    DirectlyGivePlayerItem(ItemType.Goods, 8500, 951, 1);
    SetEventFlagID(60120, ON);
    //cookbooks
    DirectlyGivePlayerItem(ItemType.Goods, 9300, 951, 1);
    SetEventFlagID(67000, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9311, 951, 1);
    SetEventFlagID(67110, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9301, 951, 1);
    SetEventFlagID(67010, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9380, 951, 1);
    SetEventFlagID(67800, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9383, 951, 1);
    SetEventFlagID(67830, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9302, 951, 1);
    SetEventFlagID(67020, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9305, 951, 1);
    SetEventFlagID(67050, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9388, 951, 1);
    SetEventFlagID(67880, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9343, 951, 1);
    SetEventFlagID(67430, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9303, 951, 1);
    SetEventFlagID(67030, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9322, 951, 1);
    SetEventFlagID(67220, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9306, 951, 1);
    SetEventFlagID(67060, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9308, 951, 1);
    SetEventFlagID(67080, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9387, 951, 1);
    SetEventFlagID(67870, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9390, 951, 1);
    SetEventFlagID(67900, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9329, 951, 1);
    SetEventFlagID(67290, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9310, 951, 1);
    SetEventFlagID(67100, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9327, 951, 1);
    SetEventFlagID(67270, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9307, 951, 1);
    SetEventFlagID(67070, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9323, 951, 1);
    SetEventFlagID(67230, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9312, 951, 1);
    SetEventFlagID(67120, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9389, 951, 1);
    SetEventFlagID(67890, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9309, 951, 1);
    SetEventFlagID(67090, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9391, 951, 1);
    SetEventFlagID(67910, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9361, 951, 1);
    SetEventFlagID(67610, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9360, 951, 1);
    SetEventFlagID(67600, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9365, 951, 1);
    SetEventFlagID(67650, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9364, 951, 1);
    SetEventFlagID(67640, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9363, 951, 1);
    SetEventFlagID(67630, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9313, 951, 1);
    SetEventFlagID(67130, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9423, 951, 1);
    SetEventFlagID(68230, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9320, 951, 1);
    SetEventFlagID(67200, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9321, 951, 1);
    SetEventFlagID(67210, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9328, 951, 1);
    SetEventFlagID(67280, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9326, 951, 1);
    SetEventFlagID(67260, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9331, 951, 1);
    SetEventFlagID(67310, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9330, 951, 1);
    SetEventFlagID(67300, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9325, 951, 1);
    SetEventFlagID(67250, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9341, 951, 1);
    SetEventFlagID(67410, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9345, 951, 1);
    SetEventFlagID(67450, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9348, 951, 1);
    SetEventFlagID(67480, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9340, 951, 1);
    SetEventFlagID(67400, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9342, 951, 1);
    SetEventFlagID(67420, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9346, 951, 1);
    SetEventFlagID(67460, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9347, 951, 1);
    SetEventFlagID(67470, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9344, 951, 1);
    SetEventFlagID(67440, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9384, 951, 1);
    SetEventFlagID(67840, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9385, 951, 1);
    SetEventFlagID(67850, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9386, 951, 1);
    SetEventFlagID(67860, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9392, 951, 1);
    SetEventFlagID(67920, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9400, 951, 1);
    SetEventFlagID(68000, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9401, 951, 1);
    SetEventFlagID(68010, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9403, 951, 1);
    SetEventFlagID(68030, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9402, 951, 1);
    SetEventFlagID(68020, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9420, 951, 1);
    SetEventFlagID(68200, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9422, 951, 1);
    SetEventFlagID(68220, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9421, 951, 1);
    SetEventFlagID(68210, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9440, 951, 1);
    SetEventFlagID(68400, ON);
    DirectlyGivePlayerItem(ItemType.Goods, 9441, 951, 1);
    SetEventFlagID(68410, ON);
    if (!EventFlag(1049300057)) { //if sandbox mode
        //30 golden seeds
        AwardItemLot(1035460105);
        //12 sacred tears
        AwardItemLot(1036490005);
        //8 memory stones
        AwardItemLot(1034430105);
        //3 talisman pouch
        AwardItemLot(10005);
        //great runes
        DirectlyGivePlayerItem(ItemType.Goods, 191, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 192, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 193, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 194, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 195, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 196, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 10080, 951, 1);
        //crystal tears
        DirectlyGivePlayerItem(ItemType.Goods, 11000, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11001, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11002, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11003, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11004, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11005, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11006, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11007, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11008, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11009, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11010, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11011, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11012, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11013, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11014, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11015, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11016, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11017, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11018, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11019, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11020, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11021, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11022, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11023, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11024, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11025, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11026, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11027, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11028, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11029, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11030, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 11031, 951, 1);
        //sewing items
        DirectlyGivePlayerItem(ItemType.Goods, 8163, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 8188, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 8161, 951, 1);
        DirectlyGivePlayerItem(ItemType.Goods, 8162, 951, 1);
        //enable armor alteration
        SetEventFlagID(60140, ON);
        SetEventFlagID(60150, ON);
        //cracked pots and perfume bottles
        EventValueOperation(1049300460, 4, 10, 0, 0, 5);
        DirectlyGivePlayerItem(3, 9501, 1049300460, 4);
        DirectlyGivePlayerItem(3, 9510, 1049300460, 4);
        EventValueOperation(1049300460, 5, 20, 0, 0, 5);
        DirectlyGivePlayerItem(3, 9500, 1049300460, 5);
        SetEventFlagID(1049300076, ON);
    }
    //give dlc items if dlc is installed
    if (EventFlag(6951)) {
        //dlc cookbooks
        AwardItemLot(2044460100);
        AwardItemLot(2045480700);
        AwardItemLot(2046380060);
        AwardItemLot(2046400010);
        AwardItemLot(2046430030);
        AwardItemLot(2046440040);
        AwardItemLot(2046480011);
        AwardItemLot(2047350010);
        AwardItemLot(2047390030);
        AwardItemLot(2047410050);
        AwardItemLot(2047420020);
        AwardItemLot(2047440000);
        AwardItemLot(2047440810);
        AwardItemLot(2047450030);
        AwardItemLot(2048370060);
        AwardItemLot(2048380020);
        AwardItemLot(2048420010);
        AwardItemLot(2048460020);
        AwardItemLot(2049380040);
        AwardItemLot(2049380050);
        AwardItemLot(2049390010);
        AwardItemLot(2049430400);
        AwardItemLot(2049430510);
        AwardItemLot(2049440000);
        AwardItemLot(2050410000);
        AwardItemLot(2051410010);
        AwardItemLot(2051450010);
        AwardItemLot(2051460010);
        AwardItemLot(2054400000);
        AwardItemLot(107525);
        AwardItemLot(107505);
        AwardItemLot(107515);
        AwardItemLot(107535);
        AwardItemLot(107545);
        AwardItemLot(107555);
        AwardItemLot(41000240);
        AwardItemLot(42000120);
        AwardItemLot(40000010);
        AwardItemLot(40010900);
        AwardItemLot(21000660);
        AwardItemLot(106400);
        AwardItemLot(22000010);
        AwardItemLot(28000060);
        AwardItemLot(21020030);
        AwardItemLot(524095715);
        DirectlyGivePlayerItem(ItemType.Goods, 2009341, 951, 1);
        SetEventFlagID(68910, ON);
        //give dlc maps
        AwardItemLot(2046450710);
        AwardItemLot(2047410900);
        AwardItemLot(2048370040);
        AwardItemLot(2048450500);
        AwardItemLot(2052410600);
        if (!EventFlag(1049300057)) { //if sandbox mode
            //give dlc crystal tears
            AwardItemLot(2045460501);
            AwardItemLot(2046390061);
            AwardItemLot(2046420981);
            AwardItemLot(2048400021);
            AwardItemLot(2048460705);
            AwardItemLot(2050460501);
            AwardItemLot(2050460511);
            AwardItemLot(2051450701);
            //scadutree fragments and revered spirit ash
            AwardItemLot(10445);
            AwardItemLot(20000175);
            //hefty cracked pots
            EventValueOperation(1049300460, 4, 10, 0, 0, 5);
            DirectlyGivePlayerItem(3, 2009500, 1049300460, 4);
            //igon's finger
            DirectlyGivePlayerItem(3, 2008003, 6001, 1);
            SetEventFlagID(1049300076, ON);
        }
        //dlc items obtained flag
        SetEventFlagID(1049300054, ON);
    }
    //set all item award and acquisition flags off
    BatchSetEventFlags(1049304400, 1049304999, OFF);
    BatchSetEventFlags(1049308400, 1049308999, OFF);
    BatchSetEventFlags(1049307000, 1049307499, OFF);
    BatchSetEventFlags(1049309000, 1049309499, OFF);
    //set all tier unlock flags off
    BatchSetEventFlags(1049304315, 1049304330, OFF);
    //set initialization flag on
    SetEventFlagID(1049300000, ON);
    TriggerAreaReload(false);
});

//boss rewards and defeat handling 1 (overworld, base game)
$Event(90001010, Default, function() {
    //alecto
    if (EventFlag(1049308106) && CharacterDead(1033420800)) {
        InitializeCommonEvent(0, 90001033, 1049304237, 1049304134, 1049304140, -1, 1049307016, 1049307017, 1049307018, 1049307019, 1049305810, 1049305812, 1049305814, 1049305819, 1049300237);
        $InitializeCommonEvent(0, 90009810, 1049307506);
    }
    //erdtree avatar (liurnia west)
    else if (EventFlag(1049308063) && CharacterDead(1033430800)) {
        InitializeCommonEvent(0, 90001033, 1049304164, 1049304056, 1049304069, -1, 1049304691, 1049304692, 1049304693, 1049304694, -1, 1049304955, 1049304958, 1049304960, 1049300164);
        $InitializeCommonEvent(0, 90009810, 1049307463);
    }
    //bols
    else if (EventFlag(1049308101) && CharacterDead(1033450800)) {
        InitializeCommonEvent(0, 90001034, 1049304159, 1049304058, -1, 1049304004, 1049304666, 1049304667, 1049304668, 1049304669, 1049304670, -1, 1049304891, 1049304893, 1049304896, 1049304898, 1049300159);
        $InitializeCommonEvent(0, 90009810, 1049307501);
    }
    //smarag
    else if (EventFlag(1049308028) && CharacterDead(1034450800)) {
        InitializeCommonEvent(0, 90001033, 1049304180, 1049304085, -1, 1049304004, 1049304763, 1049304764, 1049304765, 1049304766, 1049305140, 1049305143, 1049305146, 1049305149, 1049300180);
        $InitializeCommonEvent(0, 90009810, 1049307428);
    }
    //omenkiller
    else if (EventFlag(1049308066) && CharacterDead(1035420800)) {
        InitializeCommonEvent(0, 90001034, 1049304167, 1049304047, -1, -1, 1049304704, 1049304705, 1049304706, 1049304707, 1049304708, 1049304986, 1049304988, 1049304991, 1049304996, 1049304998, 1049300167);
        $InitializeCommonEvent(0, 90009810, 1049307466);
    }
    //adula
    else if (EventFlag(1049308047) && CharacterDead(1034420800)) {
        InitializeCommonEvent(0, 90001033, 1049304253, 1049304130, -1, -1, 1049307083, 1049307084, 1049307085, 1049307086, 1049305995, 1049305997, 1049305999, 1049306001, 1049300253);
        $InitializeCommonEvent(0, 90009810, 1049307447);
    }
    //magma wyrm (gelmir)
    else if (EventFlag(1049308035) && CharacterDead(1035530800)) {
        InitializeCommonEvent(0, 90001033, 1049304211, 1049304106, 1049304114, -1, 1049304899, 1049304900, 1049304901, 1049304902, 1049305506, 1049305508, 1049305510, 1049305513, 1049300211);
        $InitializeCommonEvent(0, 90009810, 1049307435);
    }
    //death rite bird (liurnia)
    else if (EventFlag(1049308062) && CharacterDead(1036450340)) {
        InitializeCommonEvent(0, 90001034, 1049304161, 1049304058, 1049304071, -1, 1049304676, 1049304677, 1049304678, 1049304679, 1049304680, -1, 1049304914, 1049304916, 1049304919, 1049304921, 1049300161);
        $InitializeCommonEvent(0, 90009810, 1049307462);
    }
    //night's cavalry (liurnia north)
    else if (EventFlag(1049308065) && CharacterDead(1036480340)) {
        InitializeCommonEvent(0, 90001033, 1049304166, 1049304056, 1049304069, -1, 1049304700, 1049304701, 1049304702, 1049304703, 1049304974, 1049304977, 1049304979, 1049304984, 1049300166);
        $InitializeCommonEvent(0, 90009810, 1049307465);
    }
    //onyx lord
    else if (EventFlag(1049308102) && CharacterDead(1036500800)) {
        InitializeCommonEvent(0, 90001033, 1049304168, 1049304073, -1, -1, 1049304709, 1049304710, 1049304711, 1049304712, 1049305000, 1049305002, 1049305004, 1049305007, 1049300168);
        $InitializeCommonEvent(0, 90009810, 1049307502);
    }
    //full-grown fallingstar beast
    else if (EventFlag(1049308086) && CharacterDead(1036540800)) {
        InitializeCommonEvent(0, 90001033, 1049304228, 1049304130, 1049304140, -1, 1049304975, 1049304976, 1049304977, 1049304978, 1049305709, 1049305712, 1049305714, 1049305716, 1049300228);
        $InitializeCommonEvent(0, 90009810, 1049307486);
    }
    //deathbird (liurnia)
    else if (EventFlag(1049308061) && CharacterDead(1037420340)) {
        InitializeCommonEvent(0, 90001034, 1049304160, 1049304047, -1, -1, 1049304671, 1049304672, 1049304673, 1049304674, 1049304675, -1, 1049304902, 1049304905, 1049304908, 1049304910, 1049300160);
        $InitializeCommonEvent(0, 90009810, 1049307461);
    }
    //bell bearing hunter (liurnia)
    else if (EventFlag(1049308060) && CharacterDead(1037460800)) {
        InitializeCommonEvent(0, 90001034, 1049304158, 1049304056, 1049304071, -1, 1049304661, 1049304662, 1049304663, 1049304664, 1049304665, -1, 1049304877, 1049304880, 1049304885, 1049304887, 1049300158);
        $InitializeCommonEvent(0, 90009810, 1049307460);
    }
    //demi-human queen maggie
    else if (EventFlag(1049308080) && CharacterDead(1037530800)) {
        InitializeCommonEvent(0, 90001033, 1049304206, 1049304104, 1049304112, -1, 1049304879, 1049304880, 1049304881, 1049304882, 1049305455, 1049305457, 1049305459, 1049305461, 1049300206);
        $InitializeCommonEvent(0, 90009810, 1049307480);
    }
    //ulcerated tree spirit (gelmir)
    else if (EventFlag(1049308083) && CharacterDead(1037540810)) {
        InitializeCommonEvent(0, 90001033, 1049304213, 1049304106, -1, -1, 1049304907, 1049304908, 1049304909, 1049304910, 1049305530, 1049305533, 1049305536, 1049305538, 1049300213);
        $InitializeCommonEvent(0, 90009810, 1049307483);
    }
    else
        $InitializeCommonEvent(0, 90001011); //next event
});

//boss rewards and defeat handling 2 (overworld, base game)
$Event(90001011, Default, function() {
    //adan
    if (EventFlag(1049308100) && CharacterDead(1038410800)) {
        InitializeCommonEvent(0, 90001034, 1049304144, 1049304043, 1049304047, -1, 1049304597, 1049304598, 1049304599, 1049304600, 1049304601, -1, 1049304708, 1049304710, 1049304713, 1049304716, 1049300144);
        $InitializeCommonEvent(0, 90009810, 1049307500);
    }
    //erdtree avatar (liurnia east)
    else if (EventFlag(1049308064) && CharacterDead(1038480800)) {
        InitializeCommonEvent(0, 90001034, 1049304163, 1049304058, -1, -1, 1049304686, 1049304687, 1049304688, 1049304689, 1049304690, -1, 1049304940, 1049304943, 1049304948, 1049304950, 1049300163);
        $InitializeCommonEvent(0, 90009810, 1049307464);
    }
    //tibia mariner (altus)
    else if (EventFlag(1049308082) && CharacterDead(1038520340)) {
        InitializeCommonEvent(0, 90001033, 1049304212, 1049304104, -1, -1, 1049304903, 1049304904, 1049304905, 1049304906, 1049305518, 1049305520, 1049305523, 1049305528, 1049300212);
        $InitializeCommonEvent(0, 90009810, 1049307482);
    }
    //night's cavalry (liurnia east)
    else if (EventFlag(1049308070) && CharacterDead(1039430340)) {
        InitializeCommonEvent(0, 90001034, 1049304165, 1049304056, -1, -1, 1049304695, 1049304696, 1049304697, 1049304698, 1049304699, 1049304962, 1049304964, 1049304966, 1049304969, 1049304972, 1049300165);
        $InitializeCommonEvent(0, 90009810, 1049307470);
    }
    //tibia mariner (liurnia)
    else if (EventFlag(1049308067) && CharacterDead(1039440800)) {
        InitializeCommonEvent(0, 90001033, 1049304172, 1049304073, -1, -1, 1049304727, 1049304728, 1049304729, 1049304730, 1049305049, 1049305052, 1049305054, 1049305056, 1049300172);
        $InitializeCommonEvent(0, 90009810, 1049307467);
    }
    //night's cavalry (altus)
    else if (EventFlag(1049308076) && CharacterDead(1039510800)) {
        InitializeCommonEvent(0, 90001033, 1049304198, 1049304097, 1049304099, -1, 1049304845, 1049304846, 1049304847, 1049304848, 1049305361, 1049305363, 1049305365, 1049305368, 1049300198);
        $InitializeCommonEvent(0, 90009810, 1049307476);
    }
    //black knife assassin (altus)
    else if (EventFlag(1049308072) && CharacterDead(1040520800)) {
        InitializeCommonEvent(0, 90001033, 1049304189, 1049304093, 1049304075, -1, 1049304806, 1049304807, 1049304808, 1049304809, 1049305255, 1049305258, 1049305260, 1049305265, 1049300189);
        $InitializeCommonEvent(0, 90009810, 1049307472);
    }
    //fallingstar beast (altus)
    else if (EventFlag(1049308073) && CharacterDead(1041500800)) {
        InitializeCommonEvent(0, 90001033, 1049304192, 1049304110, -1, -1, 1049304818, 1049304819, 1049304820, 1049304821, 1049305290, 1049305292, 1049305295, 1049305300, 1049300192);
        $InitializeCommonEvent(0, 90009810, 1049307473);
    }
    //lansseax
    else if (EventFlag(1049308037) && CharacterDead(1041520800)) {
        InitializeCommonEvent(0, 90001033, 1049304219, 1049304118, -1, -1, 1049304939, 1049304940, 1049304941, 1049304942, 1049305611, 1049305613, 1049305616, 1049305621, 1049300219);
        $InitializeCommonEvent(0, 90009810, 1049307437);
    }
    //wormface
    else if (EventFlag(1049308075) && CharacterDead(1041530800)) {
        InitializeCommonEvent(0, 90001033, 1049304193, 1049304075, -1, 1049304004, 1049304822, 1049304823, 1049304824, 1049304825, 1049305302, 1049305305, 1049305308, 1049305310, 1049300193);
        $InitializeCommonEvent(0, 90009810, 1049307475);
    }
    //ancient hero of zamor
    else if (EventFlag(1049308098) && CharacterDead(1042330800)) {
        InitializeCommonEvent(0, 90001034, 1049304122, 1049304026, 1049304091, -1, 1049304494, 1049304495, 1049304496, 1049304497, 1049304498, -1, 1049304429, 1049304432, 1049304437, 1049304439, 1049300122);
        $InitializeCommonEvent(0, 90009810, 1049307498);
    }
    //tree sentinel
    else if (EventFlag(1049308054) && CharacterDead(1042360800)) {
        InitializeCommonEvent(0, 90001033, 1049304121, 1049304034, -1, -1, 1049304490, 1049304491, 1049304492, 1049304493, -1, 1049304421, 1049304423, 1049304425, 1049300121);
        $InitializeCommonEvent(0, 90009810, 1049307454);
    }
    //crucible knight
    else if (EventFlag(1049308099) && CharacterDead(1042370800)) {
        InitializeCommonEvent(0, 90001033, 1049304128, 1049304041, -1, -1, 1049304523, 1049304524, 1049304525, 1049304526, -1, 1049304504, 1049304506, 1049304509, 1049300128);
        $InitializeCommonEvent(0, 90009810, 1049307499);
    }
    //bell bearing hunter (limgrave)
    else if (EventFlag(1049308050) && CharacterDead(1042380850)) {
        InitializeCommonEvent(0, 90001033, 1049304116, 1049304026, 1049304028, -1, 1049304468, 1049304469, 1049304470, 1049304471, -1, 1049304364, 1049304367, 1049304372, 1049300116);
        $InitializeCommonEvent(0, 90009810, 1049307450);
    }
    //deathbird (limgrave)
    else if (EventFlag(1049308051) && CharacterDead(1042380800)) {
        InitializeCommonEvent(0, 90001033, 1049304118, 1049304028, -1, 1049304004, 1049304476, 1049304477, 1049304478, 1049304479, -1, 1049304388, 1049304391, 1049304395, 1049300118);
        $InitializeCommonEvent(0, 90009810, 1049307451);
    }
    else
        $InitializeCommonEvent(0, 90001012); //next event
});

//boss rewards and defeat handling 3 (overworld, base game)
$Event(90001012, Default, function() {
    //godskin apostle
    if (EventFlag(1049308074) && CharacterDead(1042550800)) {
        InitializeCommonEvent(0, 90001034, 1049304195, 1049304093, 1049304075, -1, 1049304830, 1049304831, 1049304832, 1049304833, 1049304834, 1049305324, 1049305326, 1049305329, 1049305331, 1049305333, 1049300195);
        $InitializeCommonEvent(0, 90009810, 1049307474);
    }
    //erdtree avatar (weeping peninsula)
    else if (EventFlag(1049308056) && CharacterDead(1043330800)) {
        InitializeCommonEvent(0, 90001033, 1049304124, 1049304036, -1, 1049304004, 1049304504, 1049304505, 1049304506, 1049304507, -1, 1049304455, 1049304458, 1049304463, 1049300124);
        $InitializeCommonEvent(0, 90009810, 1049307456);
    }
    //agheel
    else if (EventFlag(1049308020) && CharacterDead(1043360800)) {
        InitializeCommonEvent(0, 90001033, 1049304130, 1049304041, 1049304049, -1, 1049304531, 1049304532, 1049304533, 1049304534, -1, 1049304527, 1049304529, 1049304532, 1049300130);
        $InitializeCommonEvent(0, 90009810, 1049307420);
    }
    //night's cavalry (limgrave)
    else if (EventFlag(1049308052) && CharacterDead(1043370340)) {
        InitializeCommonEvent(0, 90001033, 1049304119, 1049304032, 1049304034, -1, 1049304481, 1049304482, 1049304483, 1049304484, -1, 1049304399, 1049304401, 1049304404, 1049300119);
        $InitializeCommonEvent(0, 90009810, 1049307452);
    }
    //bell bearing hunter (capital outskirts)
    else if (EventFlag(1049308078) && CharacterDead(1043530800)) {
        InitializeCommonEvent(0, 90001033, 1049304202, 1049304104, 1049304112, -1, 1049304863, 1049304864, 1049304865, 1049304866, 1049305414, 1049305416, 1049305418, 1049305420, 1049300202);
        $InitializeCommonEvent(0, 90009810, 1049307478);
    }
    //deathbird (weeping peninsula)
    else if (EventFlag(1049308055) && CharacterDead(1044320340)) {
        InitializeCommonEvent(0, 90001034, 1049304123, 1049304034, 1049304032, -1, 1049304499, 1049304500, 1049304501, 1049304502, 1049304503, -1, 1049304444, 1049304446, 1049304448, 1049304450, 1049300123);
        $InitializeCommonEvent(0, 90009810, 1049307455);
    }
    //night's cavalry (weeping peninsula)
    else if (EventFlag(1049308057) && CharacterDead(1044320342)) {
        InitializeCommonEvent(0, 90001033, 1049304125, 1049304032, 1049304034, -1, 1049304508, 1049304509, 1049304510, 1049304511, -1, 1049304468, 1049304470, 1049304472, 1049300125);
        $InitializeCommonEvent(0, 90009810, 1049307457);
    }
    //darriwil
    else if (EventFlag(1049308097) && CharacterDead(1044350800)) {
        InitializeCommonEvent(0, 90001033, 1049304117, 1049304034, -1, 1049304008, 1049304472, 1049304473, 1049304474, 1049304475, -1, 1049304377, 1049304379, 1049304384, 1049300117);
        $InitializeCommonEvent(0, 90009810, 1049307497);
    }
    //deathbird (capital outskirts)
    else if (EventFlag(1049308079) && CharacterDead(1044530800)) {
        InitializeCommonEvent(0, 90001033, 1049304204, 1049304110, -1, -1, 1049304871, 1049304872, 1049304873, 1049304874, 1049305432, 1049305434, 1049305436, 1049305441, 1049300204);
        $InitializeCommonEvent(0, 90009810, 1049307479);
    }
    //tibia mariner
    else if (EventFlag(1049308053) && CharacterDead(1045390800)) {
        InitializeCommonEvent(0, 90001033, 1049304120, 1049307000, 1049304091, -1, 1049304486, 1049304487, 1049304488, 1049304489, -1, 1049304411, 1049304413, 1049304416, 1049300120);
        $InitializeCommonEvent(0, 90009810, 1049307453);
    }
    //draconic tree sentinel
    else if (EventFlag(1049308081) && CharacterDead(1045520800)) {
        InitializeCommonEvent(0, 90001033, 1049304207, 1049304106, -1, -1, 1049304883, 1049304884, 1049304885, 1049304886, 1049305465, 1049305468, 1049305470, 1049305475, 1049300207);
        $InitializeCommonEvent(0, 90009810, 1049307481);
    }
    //putrid avatar (caelid)
    else if (EventFlag(1049308071) && CharacterDead(1047400800)) {
        InitializeCommonEvent(0, 90001033, 1049304185, 1049304081, 1049304083, -1, 1049304786, 1049304787, 1049304788, 1049304789, 1049305202, 1049305205, 1049305208, 1049305213, 1049300185);
        $InitializeCommonEvent(0, 90009810, 1049307471);
    }
    //ekzykes
    else if (EventFlag(1049308030) && CharacterDead(1048370800)) {
        InitializeCommonEvent(0, 90001033, 1049304205, 1049304120, -1, -1, 1049304875, 1049304876, 1049304877, 1049304878, 1049305443, 1049305446, 1049305449, 1049305453, 1049300205);
        $InitializeCommonEvent(0, 90009810, 1049307430);
    }
    //bell bearing hunter (dragonbarrow)
    else if (EventFlag(1049308090) && CharacterDead(1048410800)) {
        InitializeCommonEvent(0, 90001033, 1049304250, 1049304130, -1, -1, 1049307071, 1049307072, 1049307073, 1049307074, 1049305961, 1049305966, 1049305968, 1049305971, 1049300250);
        $InitializeCommonEvent(0, 90009810, 1049307490);
    }
    //death rite bird (snowfield)
    else if (EventFlag(1049308094) && CharacterDead(1048570800)) {
        InitializeCommonEvent(0, 90001033, 1049304256, 1049304144, -1, -1, 1049307095, 1049307096, 1049307097, 1049307098, 1049306030, 1049306032, 1049306034, 1049306036, 1049300256);
        $InitializeCommonEvent(0, 90009810, 1049307494);
    }
    else
        $InitializeCommonEvent(0, 90001013); //next event
});

//boss rewards and defeat handling 4 (overworld, base game)
$Event(90001013, Default, function() {
    //death rite bird (caelid)
    if (EventFlag(1049308068) && CharacterDead(1049370850)) {
        InitializeCommonEvent(0, 90001033, 1049304177, 1049304083, 1049304077, -1, 1049304749, 1049304750, 1049304751, 1049304752, 1049305108, 1049305097, 1049305113, 1049305116, 1049300177);
        $InitializeCommonEvent(0, 90009810, 1049307468);
    }
    //night's cavalry (caelid)
    else if (EventFlag(1049308069) && CharacterDead(1049370800)) {
        InitializeCommonEvent(0, 90001034, 1049304183, 1049304083, 1049304077, -1, 1049304776, 1049304777, 1049304778, 1049304779, 1049304780, 1049305177, 1049305179, 1049305181, 1049305184, 1049305188, 1049300183);
        $InitializeCommonEvent(0, 90009810, 1049307469);
    }
    //o'neil
    else if (EventFlag(1049308026) && CharacterDead(1049380800)) {
        InitializeCommonEvent(0, 90001033, 1049304175, 1049304079, -1, 1049304004, 1049304741, 1049304742, 1049304743, 1049304744, 1049305086, 1049305088, 1049305090, 1049305092, 1049300175);
        $InitializeCommonEvent(0, 90009810, 1049307426);
    }
    //hugues
    else if (EventFlag(1049308103) && CharacterDead(1049390850)) {
        InitializeCommonEvent(0, 90001034, 1049304174, 1049304077, 1049304075, -1, 1049304736, 1049304737, 1049304738, 1049304739, 1049304740, 1049305072, 1049305074, 1049305077, 1049305082, 1049305084, 1049300174);
        $InitializeCommonEvent(0, 90009810, 1049307503);
    }
    //black blade kindred (forbidden lands)
    else if (EventFlag(1049308084) && CharacterDead(1049520800)) {
        InitializeCommonEvent(0, 90001033, 1049304221, 1049304118, -1, 1049304004, 1049304947, 1049304948, 1049304949, 1049304950, 1049305635, 1049305638, 1049305640, 1049305642, 1049300221);
        $InitializeCommonEvent(0, 90009810, 1049307484);
    }
    //theodorix
    else if (EventFlag(1049308049) && CharacterDead(1050560800)) {
        InitializeCommonEvent(0, 90001033, 1049304257, 1049304142, -1, -1, 1049307099, 1049307100, 1049307101, 1049307102, 1049306038, 1049306040, 1049306042, 1049306044, 1049300257);
        $InitializeCommonEvent(0, 90009810, 1049307449);
    }
    //death rite bird (mountaintops)
    else if (EventFlag(1049308087) && CharacterDead(1050570800)) {
        InitializeCommonEvent(0, 90001033, 1049304233, 1049304138, 1049304166, -1, 1049307000, 1049307001, 1049307002, 1049307003, 1049305767, 1049305769, 1049305771, 1049305774, 1049300233);
        $InitializeCommonEvent(0, 90009810, 1049307487);
    }
    //putrid avatar (snowfield)
    else if (EventFlag(1049308096) && CharacterDead(1050570850)) {
        InitializeCommonEvent(0, 90001032, 1049304260, -1, -1, -1, 1049307111, 1049307112, 1049307113, 1049306068, 1049306071, 1049306073, 1049300260);
        $InitializeCommonEvent(0, 90009810, 1049307496);
    }
    //putrid avatar (dragonbarrow)
    else if (EventFlag(1049308093) && CharacterDead(1051400800)) {
        InitializeCommonEvent(0, 90001033, 1049304255, 1049304130, -1, -1, 1049307091, 1049307092, 1049307093, 1049307094, 1049306018, 1049306021, 1049306023, 1049306028, 1049300255);
        $InitializeCommonEvent(0, 90009810, 1049307493);
    }
    //black blade kindred (dragonbarrow)
    else if (EventFlag(1049308091) && CharacterDead(1051430800)) {
        InitializeCommonEvent(0, 90001033, 1049304251, 1049304146, -1, -1, 1049307075, 1049307076, 1049307077, 1049307078, 1049305973, 1049305975, 1049305977, 1049305979, 1049300251);
        $InitializeCommonEvent(0, 90009810, 1049307491); 
    }
    //greyll
    else if (EventFlag(1049308046) && CharacterDead(1052410800)) {
        InitializeCommonEvent(0, 90001033, 1049304252, 1049304134, -1, 1049304004, 1049307079, 1049307080, 1049307081, 1049307082, 1049305984, 1049305986, 1049305988, 1049305990, 1049300252);
        $InitializeCommonEvent(0, 90009810, 1049307446);
    }
    //night's cavalry (dragonbarrow)
    else if (EventFlag(1049308092) && CharacterDead(1052410850)) {
        InitializeCommonEvent(0, 90001033, 1049304254, 1049304134, 1049304138, -1, 1049307087, 1049307088, 1049307089, 1049307090, 1049306006, 1049306008, 1049306011, 1049306016, 1049300254);
        $InitializeCommonEvent(0, 90009810, 1049307492);
    }
    //erdtree avatar (mountaintops)
    else if (EventFlag(1049308088) && CharacterDead(1052560800)) {
        InitializeCommonEvent(0, 90001033, 1049304234, 1049304134, -1, -1, 1049307004, 1049307005, 1049307006, 1049307007, 1049305779, 1049305782, 1049305785, 1049305790, 1049300234);
        $InitializeCommonEvent(0, 90009810, 1049307488);
    }
    //vyke
    else if (EventFlag(1049308104) && CharacterDead(1053560800)) {
        InitializeCommonEvent(0, 90001033, 1049304230, 1049304124, 1049304126, -1, 1049304984, 1049304985, 1049304986, 1049304987, 1049305730, 1049305735, 1049305737, 1049305739, 1049300230);
        $InitializeCommonEvent(0, 90009810, 1049307504);
    }
    //borealis
    else if (EventFlag(1049308045) && CharacterDead(1054560800)) {
        InitializeCommonEvent(0, 90001033, 1049304243, 1049304148, -1, -1, 1049307040, 1049307041, 1049307042, 1049307043, 1049305870, 1049305873, 1049305875, 1049305877, 1049300243);
        $InitializeCommonEvent(0, 90009810, 1049307445);
    }
    else //go to next event
        $InitializeCommonEvent(0, 90001014);
});

//boss rewards and defeat handling 5 (overworld, dlc)
$Event(90001014, Default, function() {
    //rugalea
    if (EventFlag(1049308197) && CharacterDead(2044470800)) {
        InitializeCommonEvent(0, 90001034, 1049304286, -1, -1, 1049304152, 1049307241, 1049307242, 1049307243, 1049307244, 1049307245, 1049306426, 1049306428, 1049306430, 1049306433, 1049306436, 1049300286);
        $InitializeCommonEvent(0, 90009810, 1049307597);
    }
    //ghostflame dragon (gravesite plain)
    else if (EventFlag(1049308181) && CharacterDead(2045440800)) {
        InitializeCommonEvent(0, 90001033, 1049304281, -1, -1, 1049304158, 1049307151, 1049307152, 1049307153, 1049307154, 1049306174, 1049306176, 1049306178, 1049306181, 1049300281);
        $InitializeCommonEvent(0, 90009810, 1049307581);
    }
    //marigga
    else if (EventFlag(1049308187) && CharacterDead(2046400800)) {
        InitializeCommonEvent(0, 90001034, 1049304266, -1, -1, 1049304152, 1049307184, 1049307185, 1049307186, 1049307187, 1049307188, 1049306268, 1049306271, 1049306273, 1049306278, 1049306280, 1049300266);
        $InitializeCommonEvent(0, 90009810, 1049307587);
    }
    //divine beast dancing lion (rauh)
    else if (EventFlag(1049308201) && CharacterDead(2046460800)) {
        InitializeCommonEvent(0, 90001043, 1049304297, 1049304154, -1, 1049307293, 1049307294, 1049307295, 1049307296, 1049306555, 1049306557, 1049306575, 1049306561, 1049300297);
        $InitializeCommonEvent(0, 90009810, 1049307601);
    }
    //death rite bird (charo's hidden grave)
    else if (EventFlag(1049308194) && CharacterDead(2047390800)) {
        InitializeCommonEvent(0, 90001043, 1049304287, 1049304158, -1, 1049307227, 1049307228, 1049307229, 1049307230, 1049306386, 1049306388, 1049306390, 1049306393, 1049300287);
        $InitializeCommonEvent(0, 90009810, 1049307594);
    }
    //black knight garrew
    else if (EventFlag(1049308191) && CharacterDead(2047450800)) {
        InitializeCommonEvent(0, 90001034, 1049304277, -1, -1, 1049304158, 1049307199, 1049307200, 1049307201, 1049307202, 1049307203, 1049306310, 1049306313, 1049306315, 1049306320, 1049306322, 1049300277);
        $InitializeCommonEvent(0, 90009810, 1049307591);
    }
    //ghostflame dragon (cerulean coast)
    else if (EventFlag(1049308188) && CharacterDead(2048380850)) {
        InitializeCommonEvent(0, 90001043, 1049304288, 1049304152, 1049304158, 1049307223, 1049307224, 1049307225, 1049307226, 1049306373, 1049306375, 1049306379, 1049306384, 1049300288);
        $InitializeCommonEvent(0, 90009810, 1049307588);
    }
    //jagged peak drake
    else if (EventFlag(1049308196) && CharacterDead(2049410800)) {
        InitializeCommonEvent(0, 90001034, 1049304285, -1, -1, 1049304152, 1049307236, 1049307237, 1049307238, 1049307239, 1049307240, 1049306411, 1049306413, 1049306417, 1049306422, 1049306424, 1049300285);
        $InitializeCommonEvent(0, 90009810, 1049307596);
    }
    //ralva
    else if (EventFlag(1049308193) && CharacterDead(2049450800)) {
        InitializeCommonEvent(0, 90001034, 1049304282, -1, -1, 1049304152, 1049307204, 1049307205, 1049307206, 1049307207, 1049307208, 1049306324, 1049306326, 1049306328, 1049306331, 1049306333, 1049300282);
        $InitializeCommonEvent(0, 90009810, 1049307593);
    }
    //jagged peak drake x2
    else if (EventFlag(1049308203) && CharacterDead(2052400800)) {
        InitializeCommonEvent(0, 90001043, 1049304299, 1049304152, -1, 1049307301, 1049307302, 1049307303, 1049307304, 1049306580, 1049306582, 1049306585, 1049306587, 1049300299);
        $InitializeCommonEvent(0, 90009810, 1049307603);
    }
    //fallingstar beast (hinterland)
    else if (EventFlag(1049308202) && CharacterDead(2052480800)) {
        InitializeCommonEvent(0, 90001043, 1049304295, 1049304152, 1049304158, 1049307297, 1049307298, 1049307299, 1049307300, 1049306566, 1049306568, 1049306570, 1049306572, 1049300295);
        $InitializeCommonEvent(0, 90009810, 1049307602);
    }
    //senessax
    else if (EventFlag(1049308205) && CharacterDead(2054390850)) {
        InitializeCommonEvent(0, 90001043, 1049304304, 1049304156, 1049304160, 1049307337, 1049307338, 1049307339, 1049307340, 1049306676, 1049306678, 1049306680, 1049306683, 1049300304);
        $InitializeCommonEvent(0, 90009810, 1049307605);
    }
    //edredd
    else if (EventFlag(1049308190) && CharacterDead(2049430850)) {
        InitializeEvent(0, 90001034, 1049304273, -1, -1, -1, 1049307194, 1049307195, 1049307196, 1049307197, 1049307198, 1049306296, 1049306298, 1049306301, 1049306306, 1049306308, 1049300273);
        $InitializeEvent(0, 90009810, 1049307590);
    }
    //ghostflame dragon (scadu altus)
    else if (EventFlag(1049308192) && CharacterDead(2049430800)) {
        InitializeEvent(0, 90001042, 1049304298, 1049304152, 1049304158, 1049307280, 1049307281, 1049307282, 1049306525, 1049306527, 1049306530, 1049300298);
        $InitializeEvent(0, 90009810, 1049307592);
    }
});

//boss rewards system (2 bonus itemlots + guaranteed flag)
//X0_4: boss defeat flag
//X4_4: upgrade materials itemlot 1
//X8_4: upgrade materials itemlot 2
//X12_4: upgrade tools itemlot
//X16_4: guaranteed flag
//X20_4: bonus itemlot 1 flag (also flag range start)
//X24_4: bonus itemlot 2 flag (also flag range end)
//X28_4: guaranteed itemlot
//X32_4: bonus itemlot 1 ID
//X36_4: bonus itemlot 2 ID
//X40_4: all items obtained flag
$Event(90001032, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X16_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 1
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 2
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 3
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 4
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 5
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 6
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 7
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 8
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X24_4, ON); //roll 9
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards (2 bonus items, DLC version)
//X0_4: boss defeat flag
//X4_4: upgrade tools itemlot 1
//X8_4: upgrade tools itemlot 2
//X12_4: guaranteed flag
//X16_4: bonus itemlot 1 flag (also flag range start)
//X20_4: bonus itemlot 2 flag (also flag range end)
//X24_4: guaranteed itemlot
//X28_4: bonus itemlot 1 ID
//X32_4: bonus itemlot 2 ID
//X36_4: all items obtained flag
$Event(90001042, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X12_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X20_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (3 bonus itemlots + guaranteed flag)
//X0_4: boss defeat flag
//X4_4: upgrade materials itemlot 1
//X8_4: upgrade materials itemlot 2
//X12_4: upgrade tools itemlot
//X16_4: guaranteed flag
//X20_4: bonus itemlot 1 flag (also flag range start)
//X24_4: bonus itemlot 2 flag
//X28_4: bonus itemlot 3 flag (also flag range end)
//X32_4: guaranteed itemlot
//X36_4: bonus itemlot 1 ID
//X40_4: bonus itemlot 2 ID
//X44_4: bonus itemlot 3 ID
//X48_4: all items obtained flag
$Event(90001033, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X16_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X28_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (3 bonus itemlots, DLC version)
//X0_4: boss defeat flag
//X4_4: upgrade tools itemlot 1
//X8_4: upgrade tools itemlot 2
//X12_4: guaranteed flag
//X16_4: bonus itemlot 1 flag (also flag range start)
//X20_4: bonus itemlot 2 flag
//X24_4: bonus itemlot 3 flag (also flag range end)
//X28_4: guaranteed itemlot ID
//X32_4: bonus itemlot 1 ID
//X36_4: bonus itemlot 2 ID
//X40_4: bonus itemlot 3 ID
//X44_4: all items obtained flag
$Event(90001043, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X12_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X24_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (4 bonus itemlots + guaranteed flag)
//X0_4: boss defeat flag
//X4_4: upgrade materials itemlot 1
//X8_4: upgrade materials itemlot 2
//X12_4: upgrade tools itemlot
//X16_4: guaranteed flag
//X20_4: bonus itemlot 1 flag (also flag range start)
//X24_4: bonus itemlot 2 flag
//X28_4: bonus itemlot 3 flag
//X32_4: bonus itemlot 4 flag (also flag range end)
//X36_4: guaranteed itemlot ID
//X40_4: bonus itemlot 1 ID
//X44_4: bonus itemlot 2 ID
//X48_4: bonus itemlot 3 ID
//X52_4: bonus itemlot 4 ID
//X56_4: all items obtained flag
$Event(90001034, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4, X52_4, X56_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X16_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (dragonkin nokstella fix, X16_4 not contiguous with rest)
//X0_4: boss defeat flag
//X4_4: upgrade materials itemlot 1
//X8_4: upgrade materials itemlot 2
//X12_4: upgrade tools itemlot
//X16_4: guaranteed flag
//X20_4: bonus itemlot 1 flag (also flag range start)
//X24_4: bonus itemlot 2 flag
//X28_4: bonus itemlot 3 flag
//X32_4: bonus itemlot 4 flag (also flag range end)
//X36_4: guaranteed itemlot ID
//X40_4: bonus itemlot 1 ID
//X44_4: bonus itemlot 2 ID
//X48_4: bonus itemlot 3 ID
//X52_4: bonus itemlot 4 ID
//X56_4: all items obtained flag
$Event(90001080, Default, function(X0_4,X4_4,X8_4,X12_4,X16_4,X20_4,X24_4,X28_4,X32_4,X36_4,X40_4,X44_4,X48_4,X52_4,X56_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X16_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X32_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (4 bonus itemlots, DLC version)
//X0_4: boss defeat flag
//X4_4: upgrade tools itemlot 1
//X8_4: upgrade tools itemlot 2
//X12_4: guaranteed flag
//X16_4: bonus itemlot 1 flag (also flag range start)
//X20_4: bonus itemlot 2 flag
//X24_4: bonus itemlot 3 flag
//X28_4: bonus itemlot 4 flag (also flag range end)
//X32_4: guaranteed itemlot ID
//X36_4: bonus itemlot 1 ID
//X40_4: bonus itemlot 2 ID
//X44_4: bonus itemlot 3 ID
//X48_4: bonus itemlot 4 ID
//X52_4: all items obtained flag
$Event(90001044, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4, X52_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X12_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X28_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (5 bonus itemlots + guaranteed flag)
//X0_4: boss defeat flag
//X4_4: upgrade materials itemlot 1
//X8_4: upgrade materials itemlot 2
//X12_4: upgrade tools itemlot
//X16_4: guaranteed flag
//X20_4: bonus itemlot 1 flag (also flag range start)
//X24_4: bonus itemlot 2 flag
//X28_4: bonus itemlot 3 flag
//X32_4: bonus itemlot 4 flag
//X36_4: bonus itemlot 5 flag (also flag range end)
//X40_4: guaranteed itemlot ID
//X44_4: bonus itemlot 1 ID
//X48_4: bonus itemlot 2 ID
//X52_4: bonus itemlot 3 ID
//X56_4: bonus itemlot 4 ID
//X60_4: bonus itemlot 5 ID
//X64_4: all items obtained flag
$Event(90001035, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4, X52_4, X56_4, X60_4, X64_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X16_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X20_4, X36_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (5 bonus itemlots, DLC version)
//X0_4: boss defeat flag
//X4_4: upgrade tools itemlot 1
//X8_4: upgrade tools itemlot 2
//X12_4: guaranteed flag
//X16_4: bonus itemlot 1 flag (also flag range start)
//X20_4: bonus itemlot 2 flag
//X24_4: bonus itemlot 3 flag
//X28_4: bonus itemlot 4 flag
//X32_4: bonus itemlot 5 flag (also flag range end)
//X36_4: guaranteed itemlot ID
//X40_4: bonus itemlot 1 ID
//X44_4: bonus itemlot 2 ID
//X48_4: bonus itemlot 3 ID
//X52_4: bonus itemlot 4 ID
//X56_4: bonus itemlot 5 ID
//X60_4: all items obtained flag
$Event(90001045, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4, X52_4, X56_4, X60_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X12_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X32_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (6 bonus itemlots, no upgrade mats, guaranteed flag)
//X0_4: boss defeat flag
//X4_4: upgrade tools itemlot
//X8_4: guaranteed flag
//X12_4: bonus itemlot 1 flag (also flag range start)
//X16_4: bonus itemlot 2 flag
//X20_4: bonus itemlot 3 flag
//X24_4: bonus itemlot 4 flag
//X28_4: bonus itemlot 5 flag
//X32_4: bonus itemlot 6 flag (also flag range end)
//X36_4: guaranteed itemlot ID
//X40_4: bonus itemlot 1 ID
//X44_4: bonus itemlot 2 ID
//X48_4: bonus itemlot 3 ID
//X52_4: bonus itemlot 4 ID
//X56_4: bonus itemlot 5 ID
//X60_4: bonus itemlot 6 ID
//X64_4: all items obtained flag
$Event(90001036, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4, X52_4, X56_4, X60_4, X64_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //enable guaranteed flag
        SetEventFlagID(X8_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X12_4, X32_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//boss rewards system (6 bonus itemlots, DLC version)
//X0_4: boss defeat flag
//X4_4: upgrade tools itemlot 1
//X8_4: upgrade tools itemlot 2
//X12_4: guaranteed flag
//X16_4: bonus itemlot 1 flag (also flag range start)
//X20_4: bonus itemlot 2 flag
//X24_4: bonus itemlot 3 flag
//X28_4: bonus itemlot 4 flag
//X32_4: bonus itemlot 5 flag
//X36_4: bonus itemlot 6 flag (also flag range end)
//X40_4: guaranteed itemlot ID
//X44_4: bonus itemlot 1 ID
//X48_4: bonus itemlot 2 ID
//X52_4: bonus itemlot 3 ID
//X56_4: bonus itemlot 4 ID
//X60_4: bonus itemlot 5 ID
//X64_4: bonus itemlot 6 ID
//X68_4: all items obtained flag
$Event(90001046, Default, function(X0_4, X4_4, X8_4, X12_4, X16_4, X20_4, X24_4, X28_4, X32_4, X36_4, X40_4, X44_4, X48_4, X52_4, X56_4, X60_4, X64_4, X68_4) {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    //normal drops
    if (EventFlag(1049300062)) {
        //turn on guaranteed flag
        SetEventFlagID(X12_4, ON);
        //bonus item rolls
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() == 0) //break if ng
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() <=1) //break if ng+1
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() <=2) //break if ng+2
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() <=3) //break if ng+3
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() <=4) //break if ng+4
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() <=5) //break if ng+5
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
        if (GameCycle() <=6) //break if ng+6
            Goto(S0);
        RandomlySetEventFlagInRange(X16_4, X36_4, ON);
    }
S0:
    //enable boss defeated flag
    SetEventFlagID(X0_4, ON);
});

//award random crafting materials
$Event(90001003, Default, function() {
    //end if not in progression mode
    EndIf(!EventFlag(1049300057));
    BatchSetEventFlags(1049302300, 1049302326, OFF);
    if (EventFlag(6951) || EventFlag(1049300064)) //if dlc drops enabled
        RandomlySetEventFlagInRange(1049302300, 1049302326, ON);
    else
        RandomlySetEventFlagInRange(1049302300, 1049302316, ON);
    if (EventFlag(1049302300))
        AwardItemLot(1049302000);
    else if (EventFlag(1049302301))
        AwardItemLot(1049302005);
    else if (EventFlag(1049302302))
        AwardItemLot(1049302010);
    else if (EventFlag(1049302303))
        AwardItemLot(1049302015);
    else if (EventFlag(1049302304))
        AwardItemLot(1049302020);
    else if (EventFlag(1049302305))
        AwardItemLot(1049302025);
    else if (EventFlag(1049302306))
        AwardItemLot(1049302030);
    else if (EventFlag(1049302307))
        AwardItemLot(1049302035);
    else if (EventFlag(1049302308))
        AwardItemLot(1049302040);
    else if (EventFlag(1049302309))
        AwardItemLot(1049302045);
    else if (EventFlag(1049302310))
        AwardItemLot(1049302050);
    else if (EventFlag(1049302311))
        AwardItemLot(1049302055);
    else if (EventFlag(1049302312))
        AwardItemLot(1049302060);
    else if (EventFlag(1049302313))
        AwardItemLot(1049302065);
    else if (EventFlag(1049302314))
        AwardItemLot(1049302070);
    else if (EventFlag(1049302315))
        AwardItemLot(1049302075);
    else if (EventFlag(1049302316))
        AwardItemLot(1049302080);
    else if (EventFlag(1049302317))
        AwardItemLot(1049302100);
    else if (EventFlag(1049302318))
        AwardItemLot(1049302105);
    else if (EventFlag(1049302319))
        AwardItemLot(1049302110);
    else if (EventFlag(1049302320))
        AwardItemLot(1049302115);
    else if (EventFlag(1049302321))
        AwardItemLot(1049302120);
    else if (EventFlag(1049302322))
        AwardItemLot(1049302125);
    else if (EventFlag(1049302323))
        AwardItemLot(1049302130);
    else if (EventFlag(1049302324))
        AwardItemLot(1049302135);
    else if (EventFlag(1049302325))
        AwardItemLot(1049302140);
    else if (EventFlag(1049302326))
        AwardItemLot(1049302145);
});

//fully rando drops: determine dlc and rando type
$Event(90001050, Default, function() {
    //dlc drops enabled
    if (EventFlag(6951) || EventFlag(1049300064)) {
        if (EventFlag(1049300055)) //single pool
            $InitializeCommonEvent(0, 90001051);
        else if (EventFlag(1049300061)) //per-type pools
            $InitializeCommonEvent(0, 90001100);
    }
    //dlc drops disabled
    else {
        if (EventFlag(1049300055)) //single pool
            $InitializeCommonEvent(0, 90001053);
        else if (EventFlag(1049300061)) //per-type pools
            $InitializeCommonEvent(0, 90001101);
    }
});

//fully rando drops: RNG rolls (DLC drops enabled)
$Event(90001051, Default, function() {
    //roll 1
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
    //roll 2
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
    //roll 3
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
    if (GameCycle() == 0) //end event if ng
        Goto(S0);
    //roll 4
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
    if (GameCycle() <= 2) //end event if ng+1 or 2
        Goto(S0);
    //roll 5
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
    if (GameCycle() <= 4) //end event if ng+3 or 4
        Goto(S0);
    //roll 6
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
    if (GameCycle() <= 6) //end event if ng+5 or 6
        Goto(S0);
    //roll 7
    BatchSetEventFlags(1049302350, 1049302352, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302352, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304699, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304700, 1049304996, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049307000, 1049307353, ON);
S0:
    SetEventFlagID(1049302620, ON);
});

//fully rando drops: RNG rolls (DLC drops disabled)
$Event(90001053, Default, function() {
    //roll 1
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
    //roll 2
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
    //roll 3
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
    if (GameCycle() == 0) //end event if ng
        Goto(S0);
    //roll 4
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
    if (GameCycle() <= 2) //end event if ng+ or 2
        Goto(S0);
    //roll 5
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
    if (GameCycle() <= 4) //end event if ng+3 or 4
        Goto(S0);
    //roll 6
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
    if (GameCycle() <= 6) //end event if ng+5 or 6
        Goto(S0);
    //roll 7
    BatchSetEventFlags(1049302350, 1049302354, OFF);
    RandomlySetEventFlagInRange(1049302350, 1049302354, ON);
    if (EventFlag(1049302350))
        RandomlySetEventFlagInRange(1049304400, 1049304549, ON);
    else if (EventFlag(1049302351))
        RandomlySetEventFlagInRange(1049304550, 1049304699, ON);
    else if (EventFlag(1049302352))
        RandomlySetEventFlagInRange(1049304700, 1049304849, ON);
    else if (EventFlag(1049302353))
        RandomlySetEventFlagInRange(1049304850, 1049304996, ON);
    else if (EventFlag(1049302354))
        RandomlySetEventFlagInRange(1049307000, 1049307135, ON);
S0:
    SetEventFlagID(1049302620, ON);
});

//fully rando drops (one of each type, dlc enabled)
$Event(90001100, Default, function() {
    //weapons roll 1 (dlc on)
    RandomlySetEventFlagInRange(1049290000, 1049290242, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S1);
    //weapons roll 2 (dlc on)
    RandomlySetEventFlagInRange(1049290000, 1049290242, ON);
    if (GameCycle() <= 2) //break if ng+ or 2
        Goto(S1);
    //weapons roll 3 (dlc on)
    RandomlySetEventFlagInRange(1049290000, 1049290242, ON);
    if (GameCycle() <= 4) //break if ng+3 or 4
        Goto(S1);
    //weapons roll 4 (dlc on)
    RandomlySetEventFlagInRange(1049290000, 1049290242, ON);
    if (GameCycle() <= 6) //break if ng+5 or 6
        Goto(S1);
    //weapons roll 5 (dlc on)
    RandomlySetEventFlagInRange(1049290000, 1049290242, ON);
S1:
    //armor roll 1 (dlc on)
    RandomlySetEventFlagInRange(1049290300, 1049290475, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S2);
    //armor roll 2 (dlc on)
    RandomlySetEventFlagInRange(1049290300, 1049290475, ON);
    if (GameCycle() <= 3) //break if ng+, 2 or 3
        Goto(S2);
    //armor roll 3 (dlc on)
    RandomlySetEventFlagInRange(1049290300, 1049290475, ON);
    if (GameCycle() <= 6) //break if ng+4, 5 or 6
        Goto(S2);
    //armor roll 4 (dlc on)
    RandomlySetEventFlagInRange(1049290300, 1049290475, ON);
S2:
    //talisman roll 1 (dlc on)
    RandomlySetEventFlagInRange(1049290500, 1049290649, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S3);
    //talisman roll 2 (dlc on)
    RandomlySetEventFlagInRange(1049290500, 1049290649, ON);
    if (GameCycle() <= 3) //break if ng+, 2 or 3
        Goto(S3);
    //talisman roll 3 (dlc on)
    RandomlySetEventFlagInRange(1049290500, 1049290649, ON);
    if (GameCycle() <= 6) //break if ng+4, 5 or 6
        Goto(S3);
    //talisman roll 4 (dlc on)
    RandomlySetEventFlagInRange(1049290500, 1049290649, ON);
S3:
    //spell roll 1 (dlc on)
    RandomlySetEventFlagInRange(1049290699, 1049290857, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S4);
    //spell roll 2 (dlc on)
    RandomlySetEventFlagInRange(1049290699, 1049290857, ON);
    if (GameCycle() <= 3) //break if ng+, 2 or 3
        Goto(S4);
    //spell roll 3 (dlc on)
    RandomlySetEventFlagInRange(1049290699, 1049290857, ON);
    if (GameCycle() <= 6) //break if ng+4, 5 or 6
        Goto(S4);
    //spell roll 4 (dlc on)
    RandomlySetEventFlagInRange(1049290699, 1049290857, ON);
S4:
    //aow/tools roll 1 (dlc on)
    RandomlySetEventFlagInRange(1049294000, 1049294110, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S5);
    //aow/tools roll 2 (dlc on)
    RandomlySetEventFlagInRange(1049294000, 1049294110, ON);
    if (GameCycle() <= 3) //break if ng+, 2, or 3
        Goto(S5);
    //aow/tools roll 3 (dlc on)
    RandomlySetEventFlagInRange(1049294000, 1049294110, ON);
S5:
    //ashes/tears roll 1 (dlc on)
    RandomlySetEventFlagInRange(1049294200, 1049294308, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S6);
    //ashes/tears roll 2 (dlc on)
    RandomlySetEventFlagInRange(1049294200, 1049294308, ON);
    if (GameCycle() <= 3) //break if ng+, 2, or 3
        Goto(S6);
    //ashes/tears roll 3 (dlc on)
    RandomlySetEventFlagInRange(1049294200, 1049294308, ON);
S6:
    //flag conversion
    $InitializeCommonEvent(0, 90001110);
});

//fully rando drops (one of each type, dlc disabled)
$Event(90001101, Default, function() {
    //weapons roll 1 (dlc off)
    RandomlySetEventFlagInRange(1049290000, 1049290186, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S11);
    //weapons roll 2 (dlc off)
    RandomlySetEventFlagInRange(1049290000, 1049290186, ON);
    if (GameCycle() <= 2) //break if ng+ or 2
        Goto(S11);
    //weapons roll 3 (dlc off)
    RandomlySetEventFlagInRange(1049290000, 1049290186, ON);
    if (GameCycle() <= 4) //break if ng+3 or 4
        Goto(S11);
    //weapons roll 4 (dlc off)
    RandomlySetEventFlagInRange(1049290000, 1049290186, ON);
    if (GameCycle() <= 6) //break if ng+5 or 6
        Goto(S11);
    //weapons roll 5 (dlc off)
    RandomlySetEventFlagInRange(1049290000, 1049290186, ON);
S11:
    //armor roll 1 (dlc off)
    RandomlySetEventFlagInRange(1049290300, 1049290440, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S12);
    //armor roll 2 (dlc off)
    RandomlySetEventFlagInRange(1049290300, 1049290440, ON);
    if (GameCycle() <= 3) //break if ng+, 2 or 3
        Goto(S12);
    //armor roll 3 (dlc off)
    RandomlySetEventFlagInRange(1049290300, 1049290440, ON);
    if (GameCycle() <= 6) //break if ng+4, 5 or 6
        Goto(S12);
    //armor roll 4 (dlc off)
    RandomlySetEventFlagInRange(1049290300, 1049290440, ON);
S12:
    //talisman roll 1 (dlc off)
    RandomlySetEventFlagInRange(1049290500, 1049290610, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S13);
    //talisman roll 2 (dlc off)
    RandomlySetEventFlagInRange(1049290500, 1049290610, ON);
    if (GameCycle() <= 3) //break if ng+, 2 or 3
        Goto(S13);
    //talisman roll 3 (dlc off)
    RandomlySetEventFlagInRange(1049290500, 1049290610, ON);
    if (GameCycle() <= 6) //break if ng+4, 5 or 6
        Goto(S13);
    //talisman roll 4 (dlc off)
    RandomlySetEventFlagInRange(1049290500, 1049290610, ON);
S13:
    //spell roll 1 (dlc off)
    RandomlySetEventFlagInRange(1049290699, 1049290824, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S14);
    //spell roll 2 (dlc off)
    RandomlySetEventFlagInRange(1049290699, 1049290824, ON);
    if (GameCycle() <= 3) //break if ng+, 2 or 3
        Goto(S14);
    //spell roll 3 (dlc off)
    RandomlySetEventFlagInRange(1049290699, 1049290824, ON);
    if (GameCycle() <= 6) //break if ng+4, 5 or 6
        Goto(S14);
    //spell roll 4 (dlc off)
    RandomlySetEventFlagInRange(1049290699, 1049290824, ON);
S14:
    //aow/tools roll 1 (dlc off)
    RandomlySetEventFlagInRange(1049294000, 1049294080, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S15);
    //aow/tools roll 2 (dlc off)
    RandomlySetEventFlagInRange(1049294000, 1049294080, ON);
    if (GameCycle() <= 3) //break if ng+, 2, or 3
        Goto(S15);
    //aow/tools roll 3 (dlc off)
    RandomlySetEventFlagInRange(1049294000, 1049294080, ON);
S15:
    //ashes/tears roll 1 (dlc off)
    RandomlySetEventFlagInRange(1049294200, 1049294281, ON);
    if (GameCycle() == 0) //break if ng
        Goto(S16);
    //ashes/tears roll 2 (dlc off)
    RandomlySetEventFlagInRange(1049294200, 1049294281, ON);
    if (GameCycle() <= 3) //break if ng+, 2, or 3
        Goto(S16);
    //ashes/tears roll 3 (dlc off)
    RandomlySetEventFlagInRange(1049294200, 1049294281, ON);
S16:
    $InitializeCommonEvent(0, 90001110); //flag conversion
});

//flag conversion for fully rando drops (per item type) 1
$Event(90001110, Default, function() {
    if (EventFlag(1049290000))
        SetEventFlagID(1049304401, ON);
    if (EventFlag(1049290001))
        SetEventFlagID(1049304405, ON);
    if (EventFlag(1049290002))
        SetEventFlagID(1049304409, ON);
    if (EventFlag(1049290003))
        SetEventFlagID(1049304413, ON);
    if (EventFlag(1049290004))
        SetEventFlagID(1049304418, ON);
    if (EventFlag(1049290005))
        SetEventFlagID(1049304421, ON);
    if (EventFlag(1049290006))
        SetEventFlagID(1049304426, ON);
    if (EventFlag(1049290007))
        SetEventFlagID(1049304431, ON);
    if (EventFlag(1049290008))
        SetEventFlagID(1049304435, ON);
    if (EventFlag(1049290009))
        SetEventFlagID(1049304439, ON);
    if (EventFlag(1049290010))
        SetEventFlagID(1049304444, ON);
    if (EventFlag(1049290011))
        SetEventFlagID(1049304449, ON);
    if (EventFlag(1049290012))
        SetEventFlagID(1049304452, ON);
    if (EventFlag(1049290013))
        SetEventFlagID(1049304456, ON);
    if (EventFlag(1049290014))
        SetEventFlagID(1049304459, ON);
    if (EventFlag(1049290015))
        SetEventFlagID(1049304463, ON);
    if (EventFlag(1049290016))
        SetEventFlagID(1049304469, ON);
    if (EventFlag(1049290017))
        SetEventFlagID(1049304472, ON);
    if (EventFlag(1049290018))
        SetEventFlagID(1049304477, ON);
    if (EventFlag(1049290019))
        SetEventFlagID(1049304483, ON);
    if (EventFlag(1049290020))
        SetEventFlagID(1049304488, ON);
    if (EventFlag(1049290021))
        SetEventFlagID(1049304490, ON);
    if (EventFlag(1049290022))
        SetEventFlagID(1049304495, ON);
    if (EventFlag(1049290023))
        SetEventFlagID(1049304499, ON);
    if (EventFlag(1049290024))
        SetEventFlagID(1049304505, ON);
    if (EventFlag(1049290025))
        SetEventFlagID(1049304508, ON);
    if (EventFlag(1049290026))
        SetEventFlagID(1049304510, ON);
    if (EventFlag(1049290027))
        SetEventFlagID(1049304513, ON);
    if (EventFlag(1049290028))
        SetEventFlagID(1049304525, ON);
    if (EventFlag(1049290029))
        SetEventFlagID(1049304528, ON);
    if (EventFlag(1049290030))
        SetEventFlagID(1049304533, ON);
    if (EventFlag(1049290031))
        SetEventFlagID(1049304536, ON);
    if (EventFlag(1049290032))
        SetEventFlagID(1049304541, ON);
    if (EventFlag(1049290033))
        SetEventFlagID(1049304546, ON);
    if (EventFlag(1049290034))
        SetEventFlagID(1049304551, ON);
    if (EventFlag(1049290035))
        SetEventFlagID(1049304555, ON);
    if (EventFlag(1049290036))
        SetEventFlagID(1049304561, ON);
    if (EventFlag(1049290037))
        SetEventFlagID(1049304571, ON);
    if (EventFlag(1049290038))
        SetEventFlagID(1049304564, ON);
    if (EventFlag(1049290039))
        SetEventFlagID(1049304573, ON);
    if (EventFlag(1049290040))
        SetEventFlagID(1049304579, ON);
    if (EventFlag(1049290041))
        SetEventFlagID(1049304584, ON);
    if (EventFlag(1049290042))
        SetEventFlagID(1049304588, ON);
    if (EventFlag(1049290043))
        SetEventFlagID(1049304591, ON);
    if (EventFlag(1049290044))
        SetEventFlagID(1049304592, ON);
    if (EventFlag(1049290045))
        SetEventFlagID(1049304599, ON);
    if (EventFlag(1049290046))
        SetEventFlagID(1049304603, ON);
    if (EventFlag(1049290047))
        SetEventFlagID(1049304607, ON);
    if (EventFlag(1049290048))
        SetEventFlagID(1049304612, ON);
    if (EventFlag(1049290049))
        SetEventFlagID(1049304614, ON);
    if (EventFlag(1049290050))
        SetEventFlagID(1049304618, ON);
    if (EventFlag(1049290051))
        SetEventFlagID(1049304622, ON);
    if (EventFlag(1049290052))
        SetEventFlagID(1049304623, ON);
    if (EventFlag(1049290053))
        SetEventFlagID(1049304628, ON);
    if (EventFlag(1049290054))
        SetEventFlagID(1049304631, ON);
    if (EventFlag(1049290055))
        SetEventFlagID(1049304635, ON);
    if (EventFlag(1049290056))
        SetEventFlagID(1049304639, ON);
    if (EventFlag(1049290057))
        SetEventFlagID(1049304644, ON);
    if (EventFlag(1049290058))
        SetEventFlagID(1049304646, ON);
    if (EventFlag(1049290059))
        SetEventFlagID(1049304651, ON);
    if (EventFlag(1049290060))
        SetEventFlagID(1049304658, ON);
    if (EventFlag(1049290061))
        SetEventFlagID(1049304662, ON);
    if (EventFlag(1049290062))
        SetEventFlagID(1049304668, ON);
    if (EventFlag(1049290063))
        SetEventFlagID(1049304672, ON);
    if (EventFlag(1049290064))
        SetEventFlagID(1049304678, ON);
    if (EventFlag(1049290065))
        SetEventFlagID(1049304682, ON);
    if (EventFlag(1049290066))
        SetEventFlagID(1049304687, ON);
    if (EventFlag(1049290067))
        SetEventFlagID(1049304692, ON);
    if (EventFlag(1049290068))
        SetEventFlagID(1049304697, ON);
    if (EventFlag(1049290069))
        SetEventFlagID(1049304700, ON);
    if (EventFlag(1049290070))
        SetEventFlagID(1049304701, ON);
    if (EventFlag(1049290071))
        SetEventFlagID(1049304705, ON);
    if (EventFlag(1049290072))
        SetEventFlagID(1049304711, ON);
    if (EventFlag(1049290073))
        SetEventFlagID(1049304715, ON);
    if (EventFlag(1049290074))
        SetEventFlagID(1049304718, ON);
    if (EventFlag(1049290075))
        SetEventFlagID(1049304719, ON);
    if (EventFlag(1049290076))
        SetEventFlagID(1049304723, ON);
    if (EventFlag(1049290077))
        SetEventFlagID(1049304728, ON);
    if (EventFlag(1049290078))
        SetEventFlagID(1049304731, ON);
    if (EventFlag(1049290079))
        SetEventFlagID(1049304737, ON);
    if (EventFlag(1049290080))
        SetEventFlagID(1049304741, ON);
    if (EventFlag(1049290081))
        SetEventFlagID(1049304742, ON);
    if (EventFlag(1049290082))
        SetEventFlagID(1049304746, ON);
    if (EventFlag(1049290083))
        SetEventFlagID(1049304749, ON);
    if (EventFlag(1049290084))
        SetEventFlagID(1049304753, ON);
    if (EventFlag(1049290085))
        SetEventFlagID(1049304759, ON);
    if (EventFlag(1049290086))
        SetEventFlagID(1049304764, ON);
    if (EventFlag(1049290087))
        SetEventFlagID(1049304769, ON);
    if (EventFlag(1049290088))
        SetEventFlagID(1049304773, ON);
    if (EventFlag(1049290089))
        SetEventFlagID(1049304778, ON);
    if (EventFlag(1049290090))
        SetEventFlagID(1049304781, ON);
    if (EventFlag(1049290091))
        SetEventFlagID(1049304787, ON);
    if (EventFlag(1049290092))
        SetEventFlagID(1049304793, ON);
    if (EventFlag(1049290093))
        SetEventFlagID(1049304795, ON);
    if (EventFlag(1049290094))
        SetEventFlagID(1049304806, ON);
    if (EventFlag(1049290095))
        SetEventFlagID(1049304811, ON);
    if (EventFlag(1049290096))
        SetEventFlagID(1049304815, ON);
    if (EventFlag(1049290097))
        SetEventFlagID(1049304819, ON);
    if (EventFlag(1049290098))
        SetEventFlagID(1049304823, ON);
    if (EventFlag(1049290099))
        SetEventFlagID(1049304827, ON);
    if (EventFlag(1049290100))
        SetEventFlagID(1049304830, ON);
    if (EventFlag(1049290101))
        SetEventFlagID(1049304831, ON);
    if (EventFlag(1049290102))
        SetEventFlagID(1049304837, ON);
    if (EventFlag(1049290103))
        SetEventFlagID(1049304840, ON);
    if (EventFlag(1049290104))
        SetEventFlagID(1049304841, ON);
    if (EventFlag(1049290105))
        SetEventFlagID(1049304847, ON);
    if (EventFlag(1049290106))
        SetEventFlagID(1049304849, ON);
    if (EventFlag(1049290107))
        SetEventFlagID(1049304850, ON);
    if (EventFlag(1049290108))
        SetEventFlagID(1049304853, ON);
    if (EventFlag(1049290109))
        SetEventFlagID(1049304854, ON);
    if (EventFlag(1049290110))
        SetEventFlagID(1049304864, ON);
    if (EventFlag(1049290111))
        SetEventFlagID(1049304865, ON);
    if (EventFlag(1049290112))
        SetEventFlagID(1049304869, ON);
    if (EventFlag(1049290113))
        SetEventFlagID(1049304871, ON);
    if (EventFlag(1049290114))
        SetEventFlagID(1049304872, ON);
    if (EventFlag(1049290115))
        SetEventFlagID(1049304876, ON);
    if (EventFlag(1049290116))
        SetEventFlagID(1049304880, ON);
    if (EventFlag(1049290117))
        SetEventFlagID(1049304881, ON);
    if (EventFlag(1049290118))
        SetEventFlagID(1049304883, ON);
    if (EventFlag(1049290119))
        SetEventFlagID(1049304887, ON);
    if (EventFlag(1049290120))
        SetEventFlagID(1049304892, ON);
    if (EventFlag(1049290121))
        SetEventFlagID(1049304897, ON);
    if (EventFlag(1049290122))
        SetEventFlagID(1049304898, ON);
    if (EventFlag(1049290123))
        SetEventFlagID(1049304901, ON);
    if (EventFlag(1049290124))
        SetEventFlagID(1049304904, ON);
    if (EventFlag(1049290125))
        SetEventFlagID(1049304908, ON);
    if (EventFlag(1049290126))
        SetEventFlagID(1049304911, ON);
    if (EventFlag(1049290127))
        SetEventFlagID(1049304912, ON);
    if (EventFlag(1049290128))
        SetEventFlagID(1049304915, ON);
    if (EventFlag(1049290129))
        SetEventFlagID(1049304921, ON);
    if (EventFlag(1049290130))
        SetEventFlagID(1049304927, ON);
    if (EventFlag(1049290131))
        SetEventFlagID(1049304934, ON);
    if (EventFlag(1049290132))
        SetEventFlagID(1049304940, ON);
    if (EventFlag(1049290133))
        SetEventFlagID(1049304943, ON);
    if (EventFlag(1049290134))
        SetEventFlagID(1049304944, ON);
    if (EventFlag(1049290135))
        SetEventFlagID(1049304947, ON);
    if (EventFlag(1049290136))
        SetEventFlagID(1049304952, ON);
    if (EventFlag(1049290137))
        SetEventFlagID(1049304956, ON);
    if (EventFlag(1049290138))
        SetEventFlagID(1049304957, ON);
    if (EventFlag(1049290139))
        SetEventFlagID(1049304959, ON);
    if (EventFlag(1049290140))
        SetEventFlagID(1049304963, ON);
    if (EventFlag(1049290141))
        SetEventFlagID(1049304967, ON);
    if (EventFlag(1049290142))
        SetEventFlagID(1049304972, ON);
    if (EventFlag(1049290143))
        SetEventFlagID(1049304975, ON);
    if (EventFlag(1049290144))
        SetEventFlagID(1049304981, ON);
    if (EventFlag(1049290145))
        SetEventFlagID(1049304982, ON);
    if (EventFlag(1049290146))
        SetEventFlagID(1049304985, ON);
    if (EventFlag(1049290147))
        SetEventFlagID(1049304990, ON);
    if (EventFlag(1049290148))
        SetEventFlagID(1049304992, ON);
    if (EventFlag(1049290149))
        SetEventFlagID(1049307000, ON);
    if (EventFlag(1049290150))
        SetEventFlagID(1049307002, ON);
    if (EventFlag(1049290151))
        SetEventFlagID(1049307005, ON);
    if (EventFlag(1049290152))
        SetEventFlagID(1049307011, ON);
    if (EventFlag(1049290153))
        SetEventFlagID(1049307013, ON);
    if (EventFlag(1049290154))
        SetEventFlagID(1049307017, ON);
    if (EventFlag(1049290155))
        SetEventFlagID(1049307021, ON);
    if (EventFlag(1049290156))
        SetEventFlagID(1049307025, ON);
    if (EventFlag(1049290157))
        SetEventFlagID(1049307030, ON);
    if (EventFlag(1049290158))
        SetEventFlagID(1049307038, ON);
    if (EventFlag(1049290159))
        SetEventFlagID(1049307041, ON);
    if (EventFlag(1049290160))
        SetEventFlagID(1049307044, ON);
    if (EventFlag(1049290161))
        SetEventFlagID(1049307049, ON);
    if (EventFlag(1049290162))
        SetEventFlagID(1049307052, ON);
    if (EventFlag(1049290163))
        SetEventFlagID(1049307054, ON);
    if (EventFlag(1049290164))
        SetEventFlagID(1049307059, ON);
    if (EventFlag(1049290165))
        SetEventFlagID(1049307061, ON);
    if (EventFlag(1049290166))
        SetEventFlagID(1049307066, ON);
    if (EventFlag(1049290167))
        SetEventFlagID(1049307073, ON);
    if (EventFlag(1049290168))
        SetEventFlagID(1049307075, ON);
    if (EventFlag(1049290169))
        SetEventFlagID(1049307076, ON);
    if (EventFlag(1049290170))
        SetEventFlagID(1049307081, ON);
    if (EventFlag(1049290171))
        SetEventFlagID(1049307084, ON);
    if (EventFlag(1049290172))
        SetEventFlagID(1049307088, ON);
    if (EventFlag(1049290173))
        SetEventFlagID(1049307092, ON);
    if (EventFlag(1049290174))
        SetEventFlagID(1049307097, ON);
    if (EventFlag(1049290175))
        SetEventFlagID(1049307098, ON);
    if (EventFlag(1049290176))
        SetEventFlagID(1049307101, ON);
    if (EventFlag(1049290177))
        SetEventFlagID(1049307102, ON);
    if (EventFlag(1049290178))
        SetEventFlagID(1049307104, ON);
    if (EventFlag(1049290179))
        SetEventFlagID(1049307106, ON);
    if (EventFlag(1049290180))
        SetEventFlagID(1049307110, ON);
    if (EventFlag(1049290181))
        SetEventFlagID(1049307112, ON);
    if (EventFlag(1049290182))
        SetEventFlagID(1049307120, ON);
    if (EventFlag(1049290183))
        SetEventFlagID(1049307122, ON);
    if (EventFlag(1049290184))
        SetEventFlagID(1049307126, ON);
    if (EventFlag(1049290185))
        SetEventFlagID(1049307131, ON);
    if (EventFlag(1049290186))
        SetEventFlagID(1049307085, ON);
    if (EventFlag(1049290187))
        SetEventFlagID(1049307138, ON);
    if (EventFlag(1049290188))
        SetEventFlagID(1049307142, ON);
    if (EventFlag(1049290189))
        SetEventFlagID(1049307146, ON);
    if (EventFlag(1049290190))
        SetEventFlagID(1049307148, ON);
    if (EventFlag(1049290191))
        SetEventFlagID(1049307153, ON);
    if (EventFlag(1049290192))
        SetEventFlagID(1049307157, ON);
    if (EventFlag(1049290193))
        SetEventFlagID(1049307162, ON);
    if (EventFlag(1049290194))
        SetEventFlagID(1049307165, ON);
    if (EventFlag(1049290195))
        SetEventFlagID(1049307167, ON);
    if (EventFlag(1049290196))
        SetEventFlagID(1049307170, ON);
    if (EventFlag(1049290197))
        SetEventFlagID(1049307175, ON);
    if (EventFlag(1049290198))
        SetEventFlagID(1049307177, ON);
    if (EventFlag(1049290199))
        SetEventFlagID(1049307181, ON);
    if (EventFlag(1049290200))
        SetEventFlagID(1049307184, ON);
    if (EventFlag(1049290201))
        SetEventFlagID(1049307191, ON);
    if (EventFlag(1049290202))
        SetEventFlagID(1049307195, ON);
    if (EventFlag(1049290203))
        SetEventFlagID(1049307199, ON);
    if (EventFlag(1049290204))
        SetEventFlagID(1049307206, ON);
    if (EventFlag(1049290205))
        SetEventFlagID(1049307209, ON);
    if (EventFlag(1049290206))
        SetEventFlagID(1049307211, ON);
    if (EventFlag(1049290207))
        SetEventFlagID(1049307218, ON);
    if (EventFlag(1049290208))
        SetEventFlagID(1049307224, ON);
    if (EventFlag(1049290209))
        SetEventFlagID(1049307229, ON);
    if (EventFlag(1049290210))
        SetEventFlagID(1049307233, ON);
    if (EventFlag(1049290211))
        SetEventFlagID(1049307237, ON);
    if (EventFlag(1049290212))
        SetEventFlagID(1049307243, ON);
    if (EventFlag(1049290213))
        SetEventFlagID(1049307246, ON);
    if (EventFlag(1049290214))
        SetEventFlagID(1049307248, ON);
    if (EventFlag(1049290215))
        SetEventFlagID(1049307251, ON);
    if (EventFlag(1049290216))
        SetEventFlagID(1049307253, ON);
    if (EventFlag(1049290217))
        SetEventFlagID(1049307258, ON);
    if (EventFlag(1049290218))
        SetEventFlagID(1049307260, ON);
    if (EventFlag(1049290219))
        SetEventFlagID(1049307264, ON);
    if (EventFlag(1049290220))
        SetEventFlagID(1049307266, ON);
    if (EventFlag(1049290221))
        SetEventFlagID(1049307271, ON);
    if (EventFlag(1049290222))
        SetEventFlagID(1049307273, ON);
    if (EventFlag(1049290223))
        SetEventFlagID(1049307276, ON);
    if (EventFlag(1049290224))
        SetEventFlagID(1049307281, ON);
    if (EventFlag(1049290225))
        SetEventFlagID(1049307283, ON);
    if (EventFlag(1049290226))
        SetEventFlagID(1049307288, ON);
    if (EventFlag(1049290227))
        SetEventFlagID(1049307290, ON);
    if (EventFlag(1049290228))
        SetEventFlagID(1049307295, ON);
    if (EventFlag(1049290229))
        SetEventFlagID(1049307298, ON);
    if (EventFlag(1049290230))
        SetEventFlagID(1049307299, ON);
    if (EventFlag(1049290231))
        SetEventFlagID(1049307302, ON);
    if (EventFlag(1049290232))
        SetEventFlagID(1049307306, ON);
    if (EventFlag(1049290233))
        SetEventFlagID(1049307309, ON);
    if (EventFlag(1049290234))
        SetEventFlagID(1049307311, ON);
    if (EventFlag(1049290235))
        SetEventFlagID(1049307316, ON);
    if (EventFlag(1049290236))
        SetEventFlagID(1049307323, ON);
    if (EventFlag(1049290237))
        SetEventFlagID(1049307325, ON);
    if (EventFlag(1049290238))
        SetEventFlagID(1049307330, ON);
    if (EventFlag(1049290239))
        SetEventFlagID(1049307332, ON);
    if (EventFlag(1049290240))
        SetEventFlagID(1049307339, ON);
    if (EventFlag(1049290241))
        SetEventFlagID(1049307341, ON);
    if (EventFlag(1049290242))
        SetEventFlagID(1049307349, ON);
    if (EventFlag(1049290300))
        SetEventFlagID(1049304402, ON);
    if (EventFlag(1049290301))
        SetEventFlagID(1049304410, ON);
    if (EventFlag(1049290302))
        SetEventFlagID(1049304414, ON);
    if (EventFlag(1049290303))
        SetEventFlagID(1049304422, ON);
    if (EventFlag(1049290304))
        SetEventFlagID(1049304427, ON);
    if (EventFlag(1049290305))
        SetEventFlagID(1049304432, ON);
    if (EventFlag(1049290306))
        SetEventFlagID(1049304440, ON);
    if (EventFlag(1049290307))
        SetEventFlagID(1049304450, ON);
    if (EventFlag(1049290308))
        SetEventFlagID(1049304461, ON);
    if (EventFlag(1049290309))
        SetEventFlagID(1049304470, ON);
    if (EventFlag(1049290310))
        SetEventFlagID(1049304474, ON);
    if (EventFlag(1049290311))
        SetEventFlagID(1049304484, ON);
    if (EventFlag(1049290312))
        SetEventFlagID(1049304489, ON);
    if (EventFlag(1049290313))
        SetEventFlagID(1049304496, ON);
    if (EventFlag(1049290314))
        SetEventFlagID(1049304501, ON);
    if (EventFlag(1049290315))
        SetEventFlagID(1049304506, ON);
    if (EventFlag(1049290316))
        SetEventFlagID(1049304519, ON);
    if (EventFlag(1049290317))
        SetEventFlagID(1049304529, ON);
    if (EventFlag(1049290318))
        SetEventFlagID(1049304537, ON);
    if (EventFlag(1049290319))
        SetEventFlagID(1049304542, ON);
    if (EventFlag(1049290320))
        SetEventFlagID(1049304547, ON);
    if (EventFlag(1049290321))
        SetEventFlagID(1049304552, ON);
    if (EventFlag(1049290322))
        SetEventFlagID(1049304556, ON);
    if (EventFlag(1049290323))
        SetEventFlagID(1049304562, ON);
    if (EventFlag(1049290324))
        SetEventFlagID(1049304572, ON);
    if (EventFlag(1049290325))
        SetEventFlagID(1049304575, ON);
    if (EventFlag(1049290326))
        SetEventFlagID(1049304580, ON);
    if (EventFlag(1049290327))
        SetEventFlagID(1049304589, ON);
    if (EventFlag(1049290328))
        SetEventFlagID(1049304593, ON);
    if (EventFlag(1049290329))
        SetEventFlagID(1049304600, ON);
    if (EventFlag(1049290330))
        SetEventFlagID(1049304604, ON);
    if (EventFlag(1049290331))
        SetEventFlagID(1049304608, ON);
    if (EventFlag(1049290332))
        SetEventFlagID(1049304613, ON);
    if (EventFlag(1049290333))
        SetEventFlagID(1049304615, ON);
    if (EventFlag(1049290334))
        SetEventFlagID(1049304620, ON);
    if (EventFlag(1049290335))
        SetEventFlagID(1049304624, ON);
    if (EventFlag(1049290336))
        SetEventFlagID(1049304629, ON);
    if (EventFlag(1049290337))
        SetEventFlagID(1049304637, ON);
    if (EventFlag(1049290338))
        SetEventFlagID(1049304641, ON);
    if (EventFlag(1049290339))
        SetEventFlagID(1049304647, ON);
    if (EventFlag(1049290340))
        SetEventFlagID(1049304653, ON);
    if (EventFlag(1049290341))
        SetEventFlagID(1049304659, ON);
    if (EventFlag(1049290342))
        SetEventFlagID(1049304663, ON);
    if (EventFlag(1049290343))
        SetEventFlagID(1049304669, ON);
    if (EventFlag(1049290344))
        SetEventFlagID(1049304673, ON);
    if (EventFlag(1049290345))
        SetEventFlagID(1049304679, ON);
    if (EventFlag(1049290346))
        SetEventFlagID(1049304683, ON);
    if (EventFlag(1049290347))
        SetEventFlagID(1049304688, ON);
    if (EventFlag(1049290348))
        SetEventFlagID(1049304698, ON);
    if (EventFlag(1049290349))
        SetEventFlagID(1049304702, ON);
    if (EventFlag(1049290350))
        SetEventFlagID(1049304706, ON);
    if (EventFlag(1049290351))
        SetEventFlagID(1049304712, ON);
    if (EventFlag(1049290352))
        SetEventFlagID(1049304716, ON);
    if (EventFlag(1049290353))
        SetEventFlagID(1049304720, ON);
    if (EventFlag(1049290354))
        SetEventFlagID(1049304725, ON);
    if (EventFlag(1049290355))
        SetEventFlagID(1049304729, ON);
    if (EventFlag(1049290356))
        SetEventFlagID(1049304733, ON);
    if (EventFlag(1049290357))
        SetEventFlagID(1049304738, ON);
    if (EventFlag(1049290358))
        SetEventFlagID(1049304744, ON);
    if (EventFlag(1049290359))
        SetEventFlagID(1049304747, ON);
    if (EventFlag(1049290360))
        SetEventFlagID(1049304751, ON);
    if (EventFlag(1049290361))
        SetEventFlagID(1049304755, ON);
    if (EventFlag(1049290362))
        SetEventFlagID(1049304760, ON);
    if (EventFlag(1049290363))
        SetEventFlagID(1049304765, ON);
    if (EventFlag(1049290364))
        SetEventFlagID(1049304770, ON);
    if (EventFlag(1049290365))
        SetEventFlagID(1049304774, ON);
    if (EventFlag(1049290366))
        SetEventFlagID(1049304779, ON);
    if (EventFlag(1049290367))
        SetEventFlagID(1049304783, ON);
    if (EventFlag(1049290368))
        SetEventFlagID(1049304788, ON);
    if (EventFlag(1049290369))
        SetEventFlagID(1049304794, ON);
    if (EventFlag(1049290370))
        SetEventFlagID(1049304797, ON);
    if (EventFlag(1049290371))
        SetEventFlagID(1049304801, ON);
    if (EventFlag(1049290372))
        SetEventFlagID(1049304808, ON);
    if (EventFlag(1049290373))
        SetEventFlagID(1049304812, ON);
    if (EventFlag(1049290374))
        SetEventFlagID(1049304816, ON);
    if (EventFlag(1049290375))
        SetEventFlagID(1049304820, ON);
    if (EventFlag(1049290376))
        SetEventFlagID(1049304824, ON);
    if (EventFlag(1049290377))
        SetEventFlagID(1049304828, ON);
    if (EventFlag(1049290378))
        SetEventFlagID(1049304835, ON);
    if (EventFlag(1049290379))
        SetEventFlagID(1049304836, ON);
    if (EventFlag(1049290380))
        SetEventFlagID(1049304843, ON);
    if (EventFlag(1049290381))
        SetEventFlagID(1049304848, ON);
    if (EventFlag(1049290382))
        SetEventFlagID(1049304851, ON);
    if (EventFlag(1049290383))
        SetEventFlagID(1049304855, ON);
    if (EventFlag(1049290384))
        SetEventFlagID(1049304859, ON);
    if (EventFlag(1049290385))
        SetEventFlagID(1049304866, ON);
    if (EventFlag(1049290386))
        SetEventFlagID(1049304867, ON);
    if (EventFlag(1049290387))
        SetEventFlagID(1049304873, ON);
    if (EventFlag(1049290388))
        SetEventFlagID(1049304877, ON);
    if (EventFlag(1049290389))
        SetEventFlagID(1049304882, ON);
    if (EventFlag(1049290390))
        SetEventFlagID(1049304885, ON);
    if (EventFlag(1049290391))
        SetEventFlagID(1049304889, ON);
    if (EventFlag(1049290392))
        SetEventFlagID(1049304893, ON);
    if (EventFlag(1049290393))
        SetEventFlagID(1049304902, ON);
    if (EventFlag(1049290394))
        SetEventFlagID(1049304905, ON);
    if (EventFlag(1049290395))
        SetEventFlagID(1049304909, ON);
    if (EventFlag(1049290396))
        SetEventFlagID(1049304913, ON);
    if (EventFlag(1049290397))
        SetEventFlagID(1049304916, ON);
    if (EventFlag(1049290398))
        SetEventFlagID(1049304922, ON);
    if (EventFlag(1049290399))
        SetEventFlagID(1049304928, ON);
    if (EventFlag(1049290400))
        SetEventFlagID(1049304935, ON);
    if (EventFlag(1049290401))
        SetEventFlagID(1049304941, ON);
    if (EventFlag(1049290402))
        SetEventFlagID(1049304953, ON);
    if (EventFlag(1049290403))
        SetEventFlagID(1049304958, ON);
    if (EventFlag(1049290404))
        SetEventFlagID(1049304961, ON);
    if (EventFlag(1049290405))
        SetEventFlagID(1049304965, ON);
    if (EventFlag(1049290406))
        SetEventFlagID(1049304983, ON);
    if (EventFlag(1049290407))
        SetEventFlagID(1049304984, ON);
    if (EventFlag(1049290408))
        SetEventFlagID(1049304991, ON);
    if (EventFlag(1049290409))
        SetEventFlagID(1049304994, ON);
    if (EventFlag(1049290410))
        SetEventFlagID(1049307003, ON);
    if (EventFlag(1049290411))
        SetEventFlagID(1049307006, ON);
    if (EventFlag(1049290412))
        SetEventFlagID(1049307014, ON);
    if (EventFlag(1049290413))
        SetEventFlagID(1049307018, ON);
    if (EventFlag(1049290414))
        SetEventFlagID(1049307022, ON);
    if (EventFlag(1049290415))
        SetEventFlagID(1049307026, ON);
    if (EventFlag(1049290416))
        SetEventFlagID(1049307028, ON);
    if (EventFlag(1049290417))
        SetEventFlagID(1049307034, ON);
    if (EventFlag(1049290418))
        SetEventFlagID(1049307042, ON);
    if (EventFlag(1049290419))
        SetEventFlagID(1049307043, ON);
    if (EventFlag(1049290420))
        SetEventFlagID(1049307046, ON);
    if (EventFlag(1049290421))
        SetEventFlagID(1049307048, ON);
    if (EventFlag(1049290422))
        SetEventFlagID(1049307055, ON);
    if (EventFlag(1049290423))
        SetEventFlagID(1049307057, ON);
    if (EventFlag(1049290424))
        SetEventFlagID(1049307063, ON);
    if (EventFlag(1049290425))
        SetEventFlagID(1049307068, ON);
    if (EventFlag(1049290426))
        SetEventFlagID(1049307071, ON);
    if (EventFlag(1049290427))
        SetEventFlagID(1049307078, ON);
    if (EventFlag(1049290428))
        SetEventFlagID(1049307082, ON);
    if (EventFlag(1049290429))
        SetEventFlagID(1049307086, ON);
    if (EventFlag(1049290430))
        SetEventFlagID(1049307089, ON);
    if (EventFlag(1049290431))
        SetEventFlagID(1049307093, ON);
    if (EventFlag(1049290432))
        SetEventFlagID(1049307107, ON);
    if (EventFlag(1049290433))
        SetEventFlagID(1049307108, ON);
    if (EventFlag(1049290434))
        SetEventFlagID(1049307113, ON);
    if (EventFlag(1049290435))
        SetEventFlagID(1049307116, ON);
    if (EventFlag(1049290436))
        SetEventFlagID(1049307117, ON);
    if (EventFlag(1049290437))
        SetEventFlagID(1049307123, ON);
    if (EventFlag(1049290438))
        SetEventFlagID(1049307128, ON);
    if (EventFlag(1049290439))
        SetEventFlagID(1049307133, ON);
    if (EventFlag(1049290440))
        SetEventFlagID(1049304857, ON);
    if (EventFlag(1049290441))
        SetEventFlagID(1049307139, ON);
    if (EventFlag(1049290442))
        SetEventFlagID(1049307143, ON);
    if (EventFlag(1049290443))
        SetEventFlagID(1049307154, ON);
    if (EventFlag(1049290444))
        SetEventFlagID(1049307154, ON);
    if (EventFlag(1049290445))
        SetEventFlagID(1049307158, ON);
    if (EventFlag(1049290446))
        SetEventFlagID(1049307163, ON);
    if (EventFlag(1049290447))
        SetEventFlagID(1049307172, ON);
    if (EventFlag(1049290448))
        SetEventFlagID(1049307182, ON);
    if (EventFlag(1049290449))
        SetEventFlagID(1049307186, ON);
    if (EventFlag(1049290450))
        SetEventFlagID(1049307192, ON);
    if (EventFlag(1049290451))
        SetEventFlagID(1049307196, ON);
    if (EventFlag(1049290452))
        SetEventFlagID(1049307201, ON);
    if (EventFlag(1049290453))
        SetEventFlagID(1049307204, ON);
    if (EventFlag(1049290454))
        SetEventFlagID(1049307212, ON);
    if (EventFlag(1049290455))
        SetEventFlagID(1049307219, ON);
    if (EventFlag(1049290456))
        SetEventFlagID(1049307225, ON);
    if (EventFlag(1049290457))
        SetEventFlagID(1049307231, ON);
    if (EventFlag(1049290458))
        SetEventFlagID(1049307238, ON);
    if (EventFlag(1049290459))
        SetEventFlagID(1049307244, ON);
    if (EventFlag(1049290460))
        SetEventFlagID(1049307254, ON);
    if (EventFlag(1049290461))
        SetEventFlagID(1049307261, ON);
    if (EventFlag(1049290462))
        SetEventFlagID(1049307267, ON);
    if (EventFlag(1049290463))
        SetEventFlagID(1049307277, ON);
    if (EventFlag(1049290464))
        SetEventFlagID(1049307291, ON);
    if (EventFlag(1049290465))
        SetEventFlagID(1049307296, ON);
    if (EventFlag(1049290466))
        SetEventFlagID(1049307300, ON);
    if (EventFlag(1049290467))
        SetEventFlagID(1049307303, ON);
    if (EventFlag(1049290468))
        SetEventFlagID(1049307307, ON);
    if (EventFlag(1049290469))
        SetEventFlagID(1049307312, ON);
    if (EventFlag(1049290470))
        SetEventFlagID(1049307318, ON);
    if (EventFlag(1049290471))
        SetEventFlagID(1049307326, ON);
    if (EventFlag(1049290472))
        SetEventFlagID(1049307333, ON);
    if (EventFlag(1049290473))
        SetEventFlagID(1049307340, ON);
    if (EventFlag(1049290474))
        SetEventFlagID(1049307344, ON);
    if (EventFlag(1049290475))
        SetEventFlagID(1049307350, ON);
    if (EventFlag(1049290500))
        SetEventFlagID(1049304404, ON);
    if (EventFlag(1049290501))
        SetEventFlagID(1049304408, ON);
    if (EventFlag(1049290502))
        SetEventFlagID(1049304417, ON);
    if (EventFlag(1049290503))
        SetEventFlagID(1049304420, ON);
    if (EventFlag(1049290504))
        SetEventFlagID(1049304425, ON);
    if (EventFlag(1049290505))
        SetEventFlagID(1049304434, ON);
    if (EventFlag(1049290506))
        SetEventFlagID(1049304443, ON);
    if (EventFlag(1049290507))
        SetEventFlagID(1049304448, ON);
    if (EventFlag(1049290508))
        SetEventFlagID(1049304451, ON);
    if (EventFlag(1049290509))
        SetEventFlagID(1049304455, ON);
    if (EventFlag(1049290510))
        SetEventFlagID(1049304460, ON);
    if (EventFlag(1049290511))
        SetEventFlagID(1049304467, ON);
    if (EventFlag(1049290512))
        SetEventFlagID(1049304468, ON);
    if (EventFlag(1049290513))
        SetEventFlagID(1049304473, ON);
    if (EventFlag(1049290514))
        SetEventFlagID(1049304476, ON);
    if (EventFlag(1049290515))
        SetEventFlagID(1049304482, ON);
    if (EventFlag(1049290516))
        SetEventFlagID(1049304487, ON);
    if (EventFlag(1049290517))
        SetEventFlagID(1049304491, ON);
    if (EventFlag(1049290518))
        SetEventFlagID(1049304494, ON);
    if (EventFlag(1049290519))
        SetEventFlagID(1049304500, ON);
    if (EventFlag(1049290520))
        SetEventFlagID(1049304509, ON);
    if (EventFlag(1049290521))
        SetEventFlagID(1049304512, ON);
    if (EventFlag(1049290522))
        SetEventFlagID(1049304518, ON);
    if (EventFlag(1049290523))
        SetEventFlagID(1049304524, ON);
    if (EventFlag(1049290524))
        SetEventFlagID(1049304527, ON);
    if (EventFlag(1049290525))
        SetEventFlagID(1049304532, ON);
    if (EventFlag(1049290526))
        SetEventFlagID(1049304540, ON);
    if (EventFlag(1049290527))
        SetEventFlagID(1049304545, ON);
    if (EventFlag(1049290528))
        SetEventFlagID(1049304554, ON);
    if (EventFlag(1049290529))
        SetEventFlagID(1049304560, ON);
    if (EventFlag(1049290530))
        SetEventFlagID(1049304570, ON);
    if (EventFlag(1049290531))
        SetEventFlagID(1049304565, ON);
    if (EventFlag(1049290532))
        SetEventFlagID(1049304574, ON);
    if (EventFlag(1049290533))
        SetEventFlagID(1049304583, ON);
    if (EventFlag(1049290534))
        SetEventFlagID(1049304587, ON);
    if (EventFlag(1049290535))
        SetEventFlagID(1049304595, ON);
    if (EventFlag(1049290536))
        SetEventFlagID(1049304598, ON);
    if (EventFlag(1049290537))
        SetEventFlagID(1049304606, ON);
    if (EventFlag(1049290538))
        SetEventFlagID(1049304611, ON);
    if (EventFlag(1049290539))
        SetEventFlagID(1049304619, ON);
    if (EventFlag(1049290540))
        SetEventFlagID(1049304626, ON);
    if (EventFlag(1049290541))
        SetEventFlagID(1049304636, ON);
    if (EventFlag(1049290542))
        SetEventFlagID(1049304640, ON);
    if (EventFlag(1049290543))
        SetEventFlagID(1049304645, ON);
    if (EventFlag(1049290544))
        SetEventFlagID(1049304652, ON);
    if (EventFlag(1049290545))
        SetEventFlagID(1049304657, ON);
    if (EventFlag(1049290546))
        SetEventFlagID(1049304667, ON);
    if (EventFlag(1049290547))
        SetEventFlagID(1049304671, ON);
    if (EventFlag(1049290548))
        SetEventFlagID(1049304677, ON);
    if (EventFlag(1049290549))
        SetEventFlagID(1049304681, ON);
    if (EventFlag(1049290550))
        SetEventFlagID(1049304696, ON);
    if (EventFlag(1049290551))
        SetEventFlagID(1049304704, ON);
    if (EventFlag(1049290552))
        SetEventFlagID(1049304710, ON);
    if (EventFlag(1049290553))
        SetEventFlagID(1049304714, ON);
    if (EventFlag(1049290554))
        SetEventFlagID(1049304724, ON);
    if (EventFlag(1049290555))
        SetEventFlagID(1049304732, ON);
    if (EventFlag(1049290556))
        SetEventFlagID(1049304743, ON);
    if (EventFlag(1049290557))
        SetEventFlagID(1049304754, ON);
    if (EventFlag(1049290558))
        SetEventFlagID(1049304758, ON);
    if (EventFlag(1049290559))
        SetEventFlagID(1049304772, ON);
    if (EventFlag(1049290560))
        SetEventFlagID(1049304777, ON);
    if (EventFlag(1049290561))
        SetEventFlagID(1049304782, ON);
    if (EventFlag(1049290562))
        SetEventFlagID(1049304796, ON);
    if (EventFlag(1049290563))
        SetEventFlagID(1049304800, ON);
    if (EventFlag(1049290564))
        SetEventFlagID(1049304807, ON);
    if (EventFlag(1049290565))
        SetEventFlagID(1049304810, ON);
    if (EventFlag(1049290566))
        SetEventFlagID(1049304818, ON);
    if (EventFlag(1049290567))
        SetEventFlagID(1049304826, ON);
    if (EventFlag(1049290568))
        SetEventFlagID(1049304832, ON);
    if (EventFlag(1049290569))
        SetEventFlagID(1049304842, ON);
    if (EventFlag(1049290570))
        SetEventFlagID(1049304846, ON);
    if (EventFlag(1049290571))
        SetEventFlagID(1049304858, ON);
    if (EventFlag(1049290572))
        SetEventFlagID(1049304868, ON);
    if (EventFlag(1049290573))
        SetEventFlagID(1049304884, ON);
    if (EventFlag(1049290574))
        SetEventFlagID(1049304888, ON);
    if (EventFlag(1049290575))
        SetEventFlagID(1049304896, ON);
    if (EventFlag(1049290576))
        SetEventFlagID(1049304900, ON);
    if (EventFlag(1049290577))
        SetEventFlagID(1049304920, ON);
    if (EventFlag(1049290578))
        SetEventFlagID(1049304926, ON);
    if (EventFlag(1049290579))
        SetEventFlagID(1049304933, ON);
    if (EventFlag(1049290580))
        SetEventFlagID(1049304948, ON);
    if (EventFlag(1049290581))
        SetEventFlagID(1049304955, ON);
    if (EventFlag(1049290582))
        SetEventFlagID(1049304964, ON);
    if (EventFlag(1049290583))
        SetEventFlagID(1049304968, ON);
    if (EventFlag(1049290584))
        SetEventFlagID(1049304971, ON);
    if (EventFlag(1049290585))
        SetEventFlagID(1049304980, ON);
    if (EventFlag(1049290586))
        SetEventFlagID(1049304989, ON);
    if (EventFlag(1049290587))
        SetEventFlagID(1049304993, ON);
    if (EventFlag(1049290588))
        SetEventFlagID(1049307001, ON);
    if (EventFlag(1049290589))
        SetEventFlagID(1049307010, ON);
    if (EventFlag(1049290590))
        SetEventFlagID(1049307020, ON);
    if (EventFlag(1049290591))
        SetEventFlagID(1049307029, ON);
    if (EventFlag(1049290592))
        SetEventFlagID(1049307033, ON);
    if (EventFlag(1049290593))
        SetEventFlagID(1049307037, ON);
    if (EventFlag(1049290594))
        SetEventFlagID(1049307045, ON);
    if (EventFlag(1049290595))
        SetEventFlagID(1049307050, ON);
    if (EventFlag(1049290596))
        SetEventFlagID(1049307053, ON);
    if (EventFlag(1049290597))
        SetEventFlagID(1049307058, ON);
    if (EventFlag(1049290598))
        SetEventFlagID(1049307062, ON);
    if (EventFlag(1049290599))
        SetEventFlagID(1049307067, ON);
    if (EventFlag(1049290600))
        SetEventFlagID(1049307072, ON);
    if (EventFlag(1049290601))
        SetEventFlagID(1049307077, ON);
    if (EventFlag(1049290602))
        SetEventFlagID(1049307096, ON);
    if (EventFlag(1049290603))
        SetEventFlagID(1049307100, ON);
    if (EventFlag(1049290604))
        SetEventFlagID(1049307105, ON);
    if (EventFlag(1049290605))
        SetEventFlagID(1049307109, ON);
    if (EventFlag(1049290606))
        SetEventFlagID(1049307115, ON);
    if (EventFlag(1049290607))
        SetEventFlagID(1049307121, ON);
    if (EventFlag(1049290608))
        SetEventFlagID(1049307127, ON);
    if (EventFlag(1049290609))
        SetEventFlagID(1049307132, ON);
    if (EventFlag(1049290610))
        SetEventFlagID(1049307114, ON);
    if (EventFlag(1049290611))
        SetEventFlagID(1049307137, ON);
    if (EventFlag(1049290612))
        SetEventFlagID(1049307141, ON);
    if (EventFlag(1049290613))
        SetEventFlagID(1049307147, ON);
    if (EventFlag(1049290614))
        SetEventFlagID(1049307152, ON);
    if (EventFlag(1049290615))
        SetEventFlagID(1049307156, ON);
    if (EventFlag(1049290616))
        SetEventFlagID(1049307161, ON);
    if (EventFlag(1049290617))
        SetEventFlagID(1049307166, ON);
    if (EventFlag(1049290618))
        SetEventFlagID(1049307169, ON);
    if (EventFlag(1049290619))
        SetEventFlagID(1049307176, ON);
    if (EventFlag(1049290620))
        SetEventFlagID(1049307180, ON);
    if (EventFlag(1049290621))
        SetEventFlagID(1049307185, ON);
    if (EventFlag(1049290622))
        SetEventFlagID(1049307190, ON);
    if (EventFlag(1049290623))
        SetEventFlagID(1049307200, ON);
    if (EventFlag(1049290624))
        SetEventFlagID(1049307205, ON);
    if (EventFlag(1049290625))
        SetEventFlagID(1049307210, ON);
    if (EventFlag(1049290626))
        SetEventFlagID(1049307217, ON);
    if (EventFlag(1049290627))
        SetEventFlagID(1049307223, ON);
    if (EventFlag(1049290628))
        SetEventFlagID(1049307228, ON);
    if (EventFlag(1049290629))
        SetEventFlagID(1049307232, ON);
    if (EventFlag(1049290630))
        SetEventFlagID(1049307236, ON);
    if (EventFlag(1049290631))
        SetEventFlagID(1049307242, ON);
    if (EventFlag(1049290632))
        SetEventFlagID(1049307247, ON);
    if (EventFlag(1049290633))
        SetEventFlagID(1049307252, ON);
    if (EventFlag(1049290634))
        SetEventFlagID(1049307259, ON);
    if (EventFlag(1049290635))
        SetEventFlagID(1049307265, ON);
    if (EventFlag(1049290636))
        SetEventFlagID(1049307272, ON);
    if (EventFlag(1049290637))
        SetEventFlagID(1049307278, ON);
    if (EventFlag(1049290638))
        SetEventFlagID(1049307280, ON);
    if (EventFlag(1049290639))
        SetEventFlagID(1049307284, ON);
    if (EventFlag(1049290640))
        SetEventFlagID(1049307289, ON);
    if (EventFlag(1049290641))
        SetEventFlagID(1049307294, ON);
    if (EventFlag(1049290642))
        SetEventFlagID(1049307305, ON);
    if (EventFlag(1049290643))
        SetEventFlagID(1049307310, ON);
    if (EventFlag(1049290644))
        SetEventFlagID(1049307317, ON);
    if (EventFlag(1049290645))
        SetEventFlagID(1049307324, ON);
    if (EventFlag(1049290646))
        SetEventFlagID(1049307331, ON);
    if (EventFlag(1049290647))
        SetEventFlagID(1049307338, ON);
    if (EventFlag(1049290648))
        SetEventFlagID(1049307343, ON);
    if (EventFlag(1049290649))
        SetEventFlagID(1049307348, ON);
    if (EventFlag(1049290699))
        SetEventFlagID(1049307080, ON);
    if (EventFlag(1049290700))
        SetEventFlagID(1049304411, ON);
    if (EventFlag(1049290701))
        SetEventFlagID(1049304423, ON);
    if (EventFlag(1049290702))
        SetEventFlagID(1049304428, ON);
    if (EventFlag(1049290703))
        SetEventFlagID(1049304433, ON);
    if (EventFlag(1049290704))
        SetEventFlagID(1049304441, ON);
    if (EventFlag(1049290705))
        SetEventFlagID(1049304445, ON);
    if (EventFlag(1049290706))
        SetEventFlagID(1049304453, ON);
    if (EventFlag(1049290707))
        SetEventFlagID(1049304457, ON);
    if (EventFlag(1049290708))
        SetEventFlagID(1049304462, ON);
    if (EventFlag(1049290709))
        SetEventFlagID(1049304464, ON);
    if (EventFlag(1049290710))
        SetEventFlagID(1049304478, ON);
    if (EventFlag(1049290711))
        SetEventFlagID(1049304486, ON);
    if (EventFlag(1049290712))
        SetEventFlagID(1049304492, ON);
    if (EventFlag(1049290713))
        SetEventFlagID(1049304502, ON);
    if (EventFlag(1049290714))
        SetEventFlagID(1049304511, ON);
    if (EventFlag(1049290715))
        SetEventFlagID(1049304514, ON);
    if (EventFlag(1049290716))
        SetEventFlagID(1049304520, ON);
    if (EventFlag(1049290717))
        SetEventFlagID(1049304523, ON);
    if (EventFlag(1049290718))
        SetEventFlagID(1049304596, ON);
    if (EventFlag(1049290719))
        SetEventFlagID(1049304531, ON);
    if (EventFlag(1049290720))
        SetEventFlagID(1049304538, ON);
    if (EventFlag(1049290721))
        SetEventFlagID(1049304543, ON);
    if (EventFlag(1049290722))
        SetEventFlagID(1049304548, ON);
    if (EventFlag(1049290723))
        SetEventFlagID(1049304553, ON);
    if (EventFlag(1049290724))
        SetEventFlagID(1049304557, ON);
    if (EventFlag(1049290725))
        SetEventFlagID(1049304559, ON);
    if (EventFlag(1049290726))
        SetEventFlagID(1049304566, ON);
    if (EventFlag(1049290727))
        SetEventFlagID(1049304576, ON);
    if (EventFlag(1049290728))
        SetEventFlagID(1049304581, ON);
    if (EventFlag(1049290729))
        SetEventFlagID(1049304585, ON);
    if (EventFlag(1049290730))
        SetEventFlagID(1049304590, ON);
    if (EventFlag(1049290731))
        SetEventFlagID(1049304597, ON);
    if (EventFlag(1049290732))
        SetEventFlagID(1049304605, ON);
    if (EventFlag(1049290733))
        SetEventFlagID(1049304610, ON);
    if (EventFlag(1049290734))
        SetEventFlagID(1049304616, ON);
    if (EventFlag(1049290735))
        SetEventFlagID(1049304621, ON);
    if (EventFlag(1049290736))
        SetEventFlagID(1049304625, ON);
    if (EventFlag(1049290737))
        SetEventFlagID(1049304630, ON);
    if (EventFlag(1049290738))
        SetEventFlagID(1049304632, ON);
    if (EventFlag(1049290739))
        SetEventFlagID(1049304638, ON);
    if (EventFlag(1049290740))
        SetEventFlagID(1049304642, ON);
    if (EventFlag(1049290741))
        SetEventFlagID(1049304664, ON);
    if (EventFlag(1049290742))
        SetEventFlagID(1049304666, ON);
    if (EventFlag(1049290743))
        SetEventFlagID(1049304674, ON);
    if (EventFlag(1049290744))
        SetEventFlagID(1049304676, ON);
    if (EventFlag(1049290745))
        SetEventFlagID(1049304684, ON);
    if (EventFlag(1049290746))
        SetEventFlagID(1049304689, ON);
    if (EventFlag(1049290747))
        SetEventFlagID(1049304693, ON);
    if (EventFlag(1049290748))
        SetEventFlagID(1049304699, ON);
    if (EventFlag(1049290749))
        SetEventFlagID(1049304703, ON);
    if (EventFlag(1049290750))
        SetEventFlagID(1049304707, ON);
    if (EventFlag(1049290751))
        SetEventFlagID(1049304709, ON);
    if (EventFlag(1049290752))
        SetEventFlagID(1049304721, ON);
    if (EventFlag(1049290753))
        SetEventFlagID(1049304730, ON);
    if (EventFlag(1049290754))
        SetEventFlagID(1049304739, ON);
    if (EventFlag(1049290755))
        SetEventFlagID(1049304740, ON);
    if (EventFlag(1049290756))
        SetEventFlagID(1049304745, ON);
    if (EventFlag(1049290757))
        SetEventFlagID(1049304750, ON);
    if (EventFlag(1049290758))
        SetEventFlagID(1049304756, ON);
    if (EventFlag(1049290759))
        SetEventFlagID(1049304761, ON);
    if (EventFlag(1049290760))
        SetEventFlagID(1049304763, ON);
    if (EventFlag(1049290761))
        SetEventFlagID(1049304775, ON);
    if (EventFlag(1049290762))
        SetEventFlagID(1049304780, ON);
    if (EventFlag(1049290763))
        SetEventFlagID(1049304784, ON);
    if (EventFlag(1049290764))
        SetEventFlagID(1049304789, ON);
    if (EventFlag(1049290765))
        SetEventFlagID(1049304792, ON);
    if (EventFlag(1049290766))
        SetEventFlagID(1049304802, ON);
    if (EventFlag(1049290767))
        SetEventFlagID(1049304813, ON);
    if (EventFlag(1049290768))
        SetEventFlagID(1049304814, ON);
    if (EventFlag(1049290769))
        SetEventFlagID(1049304825, ON);
    if (EventFlag(1049290770))
        SetEventFlagID(1049304833, ON);
    if (EventFlag(1049290771))
        SetEventFlagID(1049304844, ON);
    if (EventFlag(1049290772))
        SetEventFlagID(1049304856, ON);
    if (EventFlag(1049290773))
        SetEventFlagID(1049304860, ON);
    if (EventFlag(1049290774))
        SetEventFlagID(1049304870, ON);
    if (EventFlag(1049290775))
        SetEventFlagID(1049304875, ON);
    if (EventFlag(1049290776))
        SetEventFlagID(1049304879, ON);
    if (EventFlag(1049290777))
        SetEventFlagID(1049304886, ON);
    if (EventFlag(1049290778))
        SetEventFlagID(1049304890, ON);
    if (EventFlag(1049290779))
        SetEventFlagID(1049304891, ON);
    if (EventFlag(1049290780))
        SetEventFlagID(1049304895, ON);
    if (EventFlag(1049290781))
        SetEventFlagID(1049304899, ON);
    if (EventFlag(1049290782))
        SetEventFlagID(1049304903, ON);
    if (EventFlag(1049290783))
        SetEventFlagID(1049304906, ON);
    if (EventFlag(1049290784))
        SetEventFlagID(1049304910, ON);
    if (EventFlag(1049290785))
        SetEventFlagID(1049304923, ON);
    if (EventFlag(1049290786))
        SetEventFlagID(1049304925, ON);
    if (EventFlag(1049290787))
        SetEventFlagID(1049304936, ON);
    if (EventFlag(1049290788))
        SetEventFlagID(1049304939, ON);
    if (EventFlag(1049290789))
        SetEventFlagID(1049304942, ON);
    if (EventFlag(1049290790))
        SetEventFlagID(1049304945, ON);
    if (EventFlag(1049290791))
        SetEventFlagID(1049304949, ON);
    if (EventFlag(1049290792))
        SetEventFlagID(1049304962, ON);
    if (EventFlag(1049290793))
        SetEventFlagID(1049304969, ON);
    if (EventFlag(1049290794))
        SetEventFlagID(1049304973, ON);
    if (EventFlag(1049290795))
        SetEventFlagID(1049304976, ON);
    if (EventFlag(1049290796))
        SetEventFlagID(1049304979, ON);
    if (EventFlag(1049290797))
        SetEventFlagID(1049304986, ON);
    if (EventFlag(1049290798))
        SetEventFlagID(1049304995, ON);
    if (EventFlag(1049290799))
        SetEventFlagID(1049307007, ON);
    if (EventFlag(1049290800))
        SetEventFlagID(1049307009, ON);
    if (EventFlag(1049290801))
        SetEventFlagID(1049307015, ON);
    if (EventFlag(1049290802))
        SetEventFlagID(1049307019, ON);
    if (EventFlag(1049290803))
        SetEventFlagID(1049307023, ON);
    if (EventFlag(1049290804))
        SetEventFlagID(1049307027, ON);
    if (EventFlag(1049290805))
        SetEventFlagID(1049307031, ON);
    if (EventFlag(1049290806))
        SetEventFlagID(1049307035, ON);
    if (EventFlag(1049290807))
        SetEventFlagID(1049307036, ON);
    if (EventFlag(1049290808))
        SetEventFlagID(1049307040, ON);
    if (EventFlag(1049290809))
        SetEventFlagID(1049307047, ON);
    if (EventFlag(1049290810))
        SetEventFlagID(1049307051, ON);
    if (EventFlag(1049290811))
        SetEventFlagID(1049307060, ON);
    if (EventFlag(1049290812))
        SetEventFlagID(1049307069, ON);
    if (EventFlag(1049290813))
        SetEventFlagID(1049307074, ON);
    if (EventFlag(1049290814))
        SetEventFlagID(1049307079, ON);
    if (EventFlag(1049290815))
        SetEventFlagID(1049307083, ON);
    if (EventFlag(1049290816))
        SetEventFlagID(1049307090, ON);
    if (EventFlag(1049290817))
        SetEventFlagID(1049307094, ON);
    if (EventFlag(1049290818))
        SetEventFlagID(1049307095, ON);
    if (EventFlag(1049290819))
        SetEventFlagID(1049307099, ON);
    if (EventFlag(1049290820))
        SetEventFlagID(1049307103, ON);
    if (EventFlag(1049290821))
        SetEventFlagID(1049307118, ON);
    if (EventFlag(1049290822))
        SetEventFlagID(1049307129, ON);
    if (EventFlag(1049290823))
        SetEventFlagID(1049307134, ON);
    if (EventFlag(1049290824))
        SetEventFlagID(1049304932, ON);
    if (EventFlag(1049290825))
        SetEventFlagID(1049307144, ON);
    if (EventFlag(1049290826))
        SetEventFlagID(1049307151, ON);
    if (EventFlag(1049290827))
        SetEventFlagID(1049307159, ON);
    if (EventFlag(1049290828))
        SetEventFlagID(1049307168, ON);
    if (EventFlag(1049290829))
        SetEventFlagID(1049307171, ON);
    if (EventFlag(1049290830))
        SetEventFlagID(1049307178, ON);
    if (EventFlag(1049290831))
        SetEventFlagID(1049307183, ON);
    if (EventFlag(1049290832))
        SetEventFlagID(1049307187, ON);
    if (EventFlag(1049290833))
        SetEventFlagID(1049307197, ON);
    if (EventFlag(1049290834))
        SetEventFlagID(1049307202, ON);
    if (EventFlag(1049290835))
        SetEventFlagID(1049307207, ON);
    if (EventFlag(1049290836))
        SetEventFlagID(1049307213, ON);
    if (EventFlag(1049290837))
        SetEventFlagID(1049307216, ON);
    if (EventFlag(1049290838))
        SetEventFlagID(1049307226, ON);
    if (EventFlag(1049290839))
        SetEventFlagID(1049307227, ON);
    if (EventFlag(1049290840))
        SetEventFlagID(1049307230, ON);
    if (EventFlag(1049290841))
        SetEventFlagID(1049307234, ON);
    if (EventFlag(1049290842))
        SetEventFlagID(1049307239, ON);
    if (EventFlag(1049290843))
        SetEventFlagID(1049307241, ON);
    if (EventFlag(1049290844))
        SetEventFlagID(1049307249, ON);
    if (EventFlag(1049290845))
        SetEventFlagID(1049307274, ON);
    if (EventFlag(1049290846))
        SetEventFlagID(1049307282, ON);
    if (EventFlag(1049290847))
        SetEventFlagID(1049307285, ON);
    if (EventFlag(1049290848))
        SetEventFlagID(1049307286, ON);
    if (EventFlag(1049290849))
        SetEventFlagID(1049307292, ON);
    if (EventFlag(1049290850))
        SetEventFlagID(1049307293, ON);
    if (EventFlag(1049290851))
        SetEventFlagID(1049307297, ON);
    if (EventFlag(1049290852))
        SetEventFlagID(1049307304, ON);
    if (EventFlag(1049290853))
        SetEventFlagID(1049307308, ON);
    if (EventFlag(1049290854))
        SetEventFlagID(1049307319, ON);
    if (EventFlag(1049290855))
        SetEventFlagID(1049307337, ON);
    if (EventFlag(1049290856))
        SetEventFlagID(1049307342, ON);
    if (EventFlag(1049290857))
        SetEventFlagID(1049307347, ON);
    if (EventFlag(1049294000))
        SetEventFlagID(1049304400, ON);
    if (EventFlag(1049294001))
        SetEventFlagID(1049304406, ON);
    if (EventFlag(1049294002))
        SetEventFlagID(1049304415, ON);
    if (EventFlag(1049294003))
        SetEventFlagID(1049304419, ON);
    if (EventFlag(1049294004))
        SetEventFlagID(1049304424, ON);
    if (EventFlag(1049294005))
        SetEventFlagID(1049304429, ON);
    if (EventFlag(1049294006))
        SetEventFlagID(1049304430, ON);
    if (EventFlag(1049294007))
        SetEventFlagID(1049304436, ON);
    if (EventFlag(1049294008))
        SetEventFlagID(1049304446, ON);
    if (EventFlag(1049294009))
        SetEventFlagID(1049304458, ON);
    if (EventFlag(1049294010))
        SetEventFlagID(1049304465, ON);
    if (EventFlag(1049294011))
        SetEventFlagID(1049304471, ON);
    if (EventFlag(1049294012))
        SetEventFlagID(1049304481, ON);
    if (EventFlag(1049294013))
        SetEventFlagID(1049304493, ON);
    if (EventFlag(1049294014))
        SetEventFlagID(1049304497, ON);
    if (EventFlag(1049294015))
        SetEventFlagID(1049304507, ON);
    if (EventFlag(1049294016))
        SetEventFlagID(1049304515, ON);
    if (EventFlag(1049294017))
        SetEventFlagID(1049304521, ON);
    if (EventFlag(1049294018))
        SetEventFlagID(1049304526, ON);
    if (EventFlag(1049294019))
        SetEventFlagID(1049304530, ON);
    if (EventFlag(1049294020))
        SetEventFlagID(1049304539, ON);
    if (EventFlag(1049294021))
        SetEventFlagID(1049304549, ON);
    if (EventFlag(1049294022))
        SetEventFlagID(1049304558, ON);
    if (EventFlag(1049294023))
        SetEventFlagID(1049304567, ON);
    if (EventFlag(1049294024))
        SetEventFlagID(1049304586, ON);
    if (EventFlag(1049294025))
        SetEventFlagID(1049304601, ON);
    if (EventFlag(1049294026))
        SetEventFlagID(1049304609, ON);
    if (EventFlag(1049294027))
        SetEventFlagID(1049304617, ON);
    if (EventFlag(1049294028))
        SetEventFlagID(1049304633, ON);
    if (EventFlag(1049294029))
        SetEventFlagID(1049304643, ON);
    if (EventFlag(1049294030))
        SetEventFlagID(1049304648, ON);
    if (EventFlag(1049294031))
        SetEventFlagID(1049304654, ON);
    if (EventFlag(1049294032))
        SetEventFlagID(1049304660, ON);
    if (EventFlag(1049294033))
        SetEventFlagID(1049304670, ON);
    if (EventFlag(1049294034))
        SetEventFlagID(1049304675, ON);
    if (EventFlag(1049294035))
        SetEventFlagID(1049304685, ON);
    if (EventFlag(1049294036))
        SetEventFlagID(1049304690, ON);
    if (EventFlag(1049294037))
        SetEventFlagID(1049304694, ON);
    if (EventFlag(1049294038))
        SetEventFlagID(1049304695, ON);
    if (EventFlag(1049294039))
        SetEventFlagID(1049304717, ON);
    if (EventFlag(1049294040))
        SetEventFlagID(1049304734, ON);
    if (EventFlag(1049294041))
        SetEventFlagID(1049304752, ON);
    if (EventFlag(1049294042))
        SetEventFlagID(1049304762, ON);
    if (EventFlag(1049294043))
        SetEventFlagID(1049304771, ON);
    if (EventFlag(1049294044))
        SetEventFlagID(1049304776, ON);
    if (EventFlag(1049294045))
        SetEventFlagID(1049304785, ON);
    if (EventFlag(1049294046))
        SetEventFlagID(1049304798, ON);
    if (EventFlag(1049294047))
        SetEventFlagID(1049304809, ON);
    if (EventFlag(1049294048))
        SetEventFlagID(1049304821, ON);
    if (EventFlag(1049294049))
        SetEventFlagID(1049304829, ON);
    if (EventFlag(1049294050))
        SetEventFlagID(1049304834, ON);
    if (EventFlag(1049294051))
        SetEventFlagID(1049304838, ON);
    if (EventFlag(1049294052))
        SetEventFlagID(1049304845, ON);
    if (EventFlag(1049294053))
        SetEventFlagID(1049304861, ON);
    if (EventFlag(1049294054))
        SetEventFlagID(1049304863, ON);
    if (EventFlag(1049294055))
        SetEventFlagID(1049304878, ON);
    if (EventFlag(1049294056))
        SetEventFlagID(1049304914, ON);
    if (EventFlag(1049294057))
        SetEventFlagID(1049304917, ON);
    if (EventFlag(1049294058))
        SetEventFlagID(1049304919, ON);
    if (EventFlag(1049294059))
        SetEventFlagID(1049304929, ON);
    if (EventFlag(1049294060))
        SetEventFlagID(1049304937, ON);
    if (EventFlag(1049294061))
        SetEventFlagID(1049304946, ON);
    if (EventFlag(1049294062))
        SetEventFlagID(1049304966, ON);
    if (EventFlag(1049294063))
        SetEventFlagID(1049304977, ON);
    if (EventFlag(1049294064))
        SetEventFlagID(1049304987, ON);
    if (EventFlag(1049294065))
        SetEventFlagID(1049304996, ON);
    if (EventFlag(1049294066))
        SetEventFlagID(1049307009, ON);
    if (EventFlag(1049294067))
        SetEventFlagID(1049307012, ON);
    if (EventFlag(1049294068))
        SetEventFlagID(1049307039, ON);
    if (EventFlag(1049294069))
        SetEventFlagID(1049307064, ON);
    if (EventFlag(1049294070))
        SetEventFlagID(1049307087, ON);
    if (EventFlag(1049294071))
        SetEventFlagID(1049307124, ON);
    if (EventFlag(1049294072))
        SetEventFlagID(1049307135, ON);
    if (EventFlag(1049294073))
        SetEventFlagID(1049304438, ON);
    if (EventFlag(1049294074))
        SetEventFlagID(1049304577, ON);
    if (EventFlag(1049294075))
        SetEventFlagID(1049304661, ON);
    if (EventFlag(1049294076))
        SetEventFlagID(1049304803, ON);
    if (EventFlag(1049294077))
        SetEventFlagID(1049304954, ON);
    if (EventFlag(1049294078))
        SetEventFlagID(1049304974, ON);
    if (EventFlag(1049294079))
        SetEventFlagID(1049307008, ON);
    if (EventFlag(1049294080))
        SetEventFlagID(1049304988, ON);
    if (EventFlag(1049294081))
        SetEventFlagID(1049307140, ON);
    if (EventFlag(1049294082))
        SetEventFlagID(1049307145, ON);
    if (EventFlag(1049294083))
        SetEventFlagID(1049307149, ON);
    if (EventFlag(1049294084))
        SetEventFlagID(1049307164, ON);
    if (EventFlag(1049294085))
        SetEventFlagID(1049307188, ON);
    if (EventFlag(1049294086))
        SetEventFlagID(1049307193, ON);
    if (EventFlag(1049294087))
        SetEventFlagID(1049307194, ON);
    if (EventFlag(1049294088))
        SetEventFlagID(1049307208, ON);
    if (EventFlag(1049294089))
        SetEventFlagID(1049307220, ON);
    if (EventFlag(1049294090))
        SetEventFlagID(1049307227, ON);
    if (EventFlag(1049294091))
        SetEventFlagID(1049307235, ON);
    if (EventFlag(1049294092))
        SetEventFlagID(1049307240, ON);
    if (EventFlag(1049294093))
        SetEventFlagID(1049307250, ON);
    if (EventFlag(1049294094))
        SetEventFlagID(1049307255, ON);
    if (EventFlag(1049294095))
        SetEventFlagID(1049307262, ON);
    if (EventFlag(1049294096))
        SetEventFlagID(1049307268, ON);
    if (EventFlag(1049294097))
        SetEventFlagID(1049307279, ON);
    if (EventFlag(1049294098))
        SetEventFlagID(1049307313, ON);
    if (EventFlag(1049294099))
        SetEventFlagID(1049307320, ON);
    if (EventFlag(1049294100))
        SetEventFlagID(1049307327, ON);
    if (EventFlag(1049294101))
        SetEventFlagID(1049307334, ON);
    if (EventFlag(1049294102))
        SetEventFlagID(1049307345, ON);
    if (EventFlag(1049294103))
        SetEventFlagID(1049307351, ON);
    if (EventFlag(1049294104))
        SetEventFlagID(1049307150, ON);
    if (EventFlag(1049294105))
        SetEventFlagID(1049307189, ON);
    if (EventFlag(1049294106))
        SetEventFlagID(1049307275, ON);
    if (EventFlag(1049294107))
        SetEventFlagID(1049307301, ON);
    if (EventFlag(1049294108))
        SetEventFlagID(1049307329, ON);
    if (EventFlag(1049294109))
        SetEventFlagID(1049307336, ON);
    if (EventFlag(1049294110))
        SetEventFlagID(1049307353, ON);
    if (EventFlag(1049294200))
        SetEventFlagID(1049304403, ON);
    if (EventFlag(1049294201))
        SetEventFlagID(1049304412, ON);
    if (EventFlag(1049294202))
        SetEventFlagID(1049304416, ON);
    if (EventFlag(1049294203))
        SetEventFlagID(1049304437, ON);
    if (EventFlag(1049294204))
        SetEventFlagID(1049304442, ON);
    if (EventFlag(1049294205))
        SetEventFlagID(1049304447, ON);
    if (EventFlag(1049294206))
        SetEventFlagID(1049304475, ON);
    if (EventFlag(1049294207))
        SetEventFlagID(1049304503, ON);
    if (EventFlag(1049294208))
        SetEventFlagID(1049304522, ON);
    if (EventFlag(1049294209))
        SetEventFlagID(1049304534, ON);
    if (EventFlag(1049294210))
        SetEventFlagID(1049304535, ON);
    if (EventFlag(1049294211))
        SetEventFlagID(1049304544, ON);
    if (EventFlag(1049294212))
        SetEventFlagID(1049304550, ON);
    if (EventFlag(1049294213))
        SetEventFlagID(1049304563, ON);
    if (EventFlag(1049294214))
        SetEventFlagID(1049304569, ON);
    if (EventFlag(1049294215))
        SetEventFlagID(1049304568, ON);
    if (EventFlag(1049294216))
        SetEventFlagID(1049304578, ON);
    if (EventFlag(1049294217))
        SetEventFlagID(1049304582, ON);
    if (EventFlag(1049294218))
        SetEventFlagID(1049304594, ON);
    if (EventFlag(1049294219))
        SetEventFlagID(1049304602, ON);
    if (EventFlag(1049294220))
        SetEventFlagID(1049304627, ON);
    if (EventFlag(1049294221))
        SetEventFlagID(1049304634, ON);
    if (EventFlag(1049294222))
        SetEventFlagID(1049304649, ON);
    if (EventFlag(1049294223))
        SetEventFlagID(1049304655, ON);
    if (EventFlag(1049294224))
        SetEventFlagID(1049304656, ON);
    if (EventFlag(1049294225))
        SetEventFlagID(1049304665, ON);
    if (EventFlag(1049294226))
        SetEventFlagID(1049304680, ON);
    if (EventFlag(1049294227))
        SetEventFlagID(1049304708, ON);
    if (EventFlag(1049294228))
        SetEventFlagID(1049304713, ON);
    if (EventFlag(1049294229))
        SetEventFlagID(1049304722, ON);
    if (EventFlag(1049294230))
        SetEventFlagID(1049304726, ON);
    if (EventFlag(1049294231))
        SetEventFlagID(1049304727, ON);
    if (EventFlag(1049294232))
        SetEventFlagID(1049304736, ON);
    if (EventFlag(1049294233))
        SetEventFlagID(1049304748, ON);
    if (EventFlag(1049294234))
        SetEventFlagID(1049304757, ON);
    if (EventFlag(1049294235))
        SetEventFlagID(1049304766, ON);
    if (EventFlag(1049294236))
        SetEventFlagID(1049304767, ON);
    if (EventFlag(1049294237))
        SetEventFlagID(1049304791, ON);
    if (EventFlag(1049294238))
        SetEventFlagID(1049304817, ON);
    if (EventFlag(1049294239))
        SetEventFlagID(1049304839, ON);
    if (EventFlag(1049294240))
        SetEventFlagID(1049304852, ON);
    if (EventFlag(1049294241))
        SetEventFlagID(1049304862, ON);
    if (EventFlag(1049294242))
        SetEventFlagID(1049304874, ON);
    if (EventFlag(1049294243))
        SetEventFlagID(1049304894, ON);
    if (EventFlag(1049294244))
        SetEventFlagID(1049304918, ON);
    if (EventFlag(1049294245))
        SetEventFlagID(1049304924, ON);
    if (EventFlag(1049294246))
        SetEventFlagID(1049304930, ON);
    if (EventFlag(1049294247))
        SetEventFlagID(1049304938, ON);
    if (EventFlag(1049294248))
        SetEventFlagID(1049304950, ON);
    if (EventFlag(1049294249))
        SetEventFlagID(1049304951, ON);
    if (EventFlag(1049294250))
        SetEventFlagID(1049304960, ON);
    if (EventFlag(1049294251))
        SetEventFlagID(1049304970, ON);
    if (EventFlag(1049294252))
        SetEventFlagID(1049304978, ON);
    if (EventFlag(1049294253))
        SetEventFlagID(1049307016, ON);
    if (EventFlag(1049294254))
        SetEventFlagID(1049307024, ON);
    if (EventFlag(1049294255))
        SetEventFlagID(1049307032, ON);
    if (EventFlag(1049294256))
        SetEventFlagID(1049307056, ON);
    if (EventFlag(1049294257))
        SetEventFlagID(1049307065, ON);
    if (EventFlag(1049294258))
        SetEventFlagID(1049307070, ON);
    if (EventFlag(1049294259))
        SetEventFlagID(1049307119, ON);
    if (EventFlag(1049294260))
        SetEventFlagID(1049307125, ON);
    if (EventFlag(1049294261))
        SetEventFlagID(1049304407, ON);
    if (EventFlag(1049294262))
        SetEventFlagID(1049304454, ON);
    if (EventFlag(1049294263))
        SetEventFlagID(1049304466, ON);
    if (EventFlag(1049294264))
        SetEventFlagID(1049304479, ON);
    if (EventFlag(1049294265))
        SetEventFlagID(1049304498, ON);
    if (EventFlag(1049294266))
        SetEventFlagID(1049304504, ON);
    if (EventFlag(1049294267))
        SetEventFlagID(1049304516, ON);
    if (EventFlag(1049294268))
        SetEventFlagID(1049304650, ON);
    if (EventFlag(1049294269))
        SetEventFlagID(1049304686, ON);
    if (EventFlag(1049294270))
        SetEventFlagID(1049304691, ON);
    if (EventFlag(1049294271))
        SetEventFlagID(1049304735, ON);
    if (EventFlag(1049294272))
        SetEventFlagID(1049304786, ON);
    if (EventFlag(1049294273))
        SetEventFlagID(1049304799, ON);
    if (EventFlag(1049294274))
        SetEventFlagID(1049304822, ON);
    if (EventFlag(1049294275))
        SetEventFlagID(1049304907, ON);
    if (EventFlag(1049294276))
        SetEventFlagID(1049304931, ON);
    if (EventFlag(1049294277))
        SetEventFlagID(1049307004, ON);
    if (EventFlag(1049294278))
        SetEventFlagID(1049307091, ON);
    if (EventFlag(1049294279))
        SetEventFlagID(1049307111, ON);
    if (EventFlag(1049294280))
        SetEventFlagID(1049307130, ON);
    if (EventFlag(1049294281))
        SetEventFlagID(1049304517, ON);
    if (EventFlag(1049294282))
        SetEventFlagID(1049307136, ON);
    if (EventFlag(1049294283))
        SetEventFlagID(1049307155, ON);
    if (EventFlag(1049294284))
        SetEventFlagID(1049307160, ON);
    if (EventFlag(1049294285))
        SetEventFlagID(1049307173, ON);
    if (EventFlag(1049294286))
        SetEventFlagID(1049307179, ON);
    if (EventFlag(1049294287))
        SetEventFlagID(1049307198, ON);
    if (EventFlag(1049294288))
        SetEventFlagID(1049307203, ON);
    if (EventFlag(1049294289))
        SetEventFlagID(1049307214, ON);
    if (EventFlag(1049294290))
        SetEventFlagID(1049307221, ON);
    if (EventFlag(1049294291))
        SetEventFlagID(1049307245, ON);
    if (EventFlag(1049294292))
        SetEventFlagID(1049307256, ON);
    if (EventFlag(1049294293))
        SetEventFlagID(1049307263, ON);
    if (EventFlag(1049294294))
        SetEventFlagID(1049307269, ON);
    if (EventFlag(1049294295))
        SetEventFlagID(1049307287, ON);
    if (EventFlag(1049294296))
        SetEventFlagID(1049307314, ON);
    if (EventFlag(1049294297))
        SetEventFlagID(1049307321, ON);
    if (EventFlag(1049294298))
        SetEventFlagID(1049307328, ON);
    if (EventFlag(1049294299))
        SetEventFlagID(1049307335, ON);
    if (EventFlag(1049294300))
        SetEventFlagID(1049307352, ON);
    if (EventFlag(1049294301))
        SetEventFlagID(1049307174, ON);
    if (EventFlag(1049294302))
        SetEventFlagID(1049307215, ON);
    if (EventFlag(1049294303))
        SetEventFlagID(1049307222, ON);
    if (EventFlag(1049294304))
        SetEventFlagID(1049307257, ON);
    if (EventFlag(1049294305))
        SetEventFlagID(1049307270, ON);
    if (EventFlag(1049294306))
        SetEventFlagID(1049307315, ON);
    if (EventFlag(1049294307))
        SetEventFlagID(1049307322, ON);
    if (EventFlag(1049294308))
        SetEventFlagID(1049307346, ON);
    SetEventFlagID(1049302620, ON);
});

//talisman upgrade handling for fully rando drops (2 items)
$Event(90001092, Default, function(awardFlag0, awardFlag1, itemlot0, itemlot1, newFlag0, newFlag1) {
    EndIf(AllBatchEventFlags(newFlag0, newFlag1)); //end if all items awarded
    if (!EventFlag(1049300055) && !EventFlag(1049300061)) { //if not using full randomization, give items directly
        if (EventFlag(awardFlag0))
            AwardItemLot(itemlot0);
        if (EventFlag(awardFlag1))
            AwardItemLot(itemlot1);
    }
    else {
        if (EventFlag(awardFlag0)) 
            SetEventFlagID(newFlag0, ON);
        if (EventFlag(awardFlag1))
            SetEventFlagID(newFlag1, ON);
        if (CountEventFlags(0, newFlag0, newFlag1) >= 1)
            AwardItemLot(itemlot0);
        if (CountEventFlags(0, newFlag0, newFlag1) >= 2)
            AwardItemLot(itemlot1);
    }
});

//talisman upgrade handling for fully rando drops (3 items)
$Event(90001093, Default, function(awardFlag0, awardFlag1, awardFlag2, itemlot0, itemlot1, itemlot2, newFlag0, newFlag1, newFlag2) {
    EndIf(AllBatchEventFlags(newFlag0, newFlag2)); //end if all items awarded
    if (!EventFlag(1049300055) && !EventFlag(1049300061)) { //if not using full randomization, give items directly
        if (EventFlag(awardFlag0))
            AwardItemLot(itemlot0);
        if (EventFlag(awardFlag1))
            AwardItemLot(itemlot1);
        if (EventFlag(awardFlag2))
            AwardItemLot(itemlot2);
    }
    else {
        if (EventFlag(awardFlag0)) 
            SetEventFlagID(newFlag0, ON);
        if (EventFlag(awardFlag1))
            SetEventFlagID(newFlag1, ON);
        if (EventFlag(awardFlag2))
            SetEventFlagID(newFlag2, ON);
        if (CountEventFlags(0, newFlag0, newFlag2) >= 1)
            AwardItemLot(itemlot0);
        if (CountEventFlags(0, newFlag0, newFlag2) >= 2)
            AwardItemLot(itemlot1);
        if (CountEventFlags(0, newFlag0, newFlag2) >= 3)
            AwardItemLot(itemlot2);
    }
});

//talisman upgrade handling for fully rando drops (4 items)
$Event(90001094, Default, function(awardFlag0, awardFlag1, awardFlag2, awardFlag3, itemlot0, itemlot1, itemlot2, itemlot3, newFlag0, newFlag1, newFlag2, newFlag3) {
    EndIf(AllBatchEventFlags(newFlag0, newFlag3)); //end if all items awarded
    if (!EventFlag(1049300055) && !EventFlag(1049300061)) { //if not using full randomization, give items directly
        if (EventFlag(awardFlag0))
            AwardItemLot(itemlot0);
        if (EventFlag(awardFlag1))
            AwardItemLot(itemlot1);
        if (EventFlag(awardFlag2))
            AwardItemLot(itemlot2);
        if (EventFlag(awardFlag3))
            AwardItemLot(itemlot3);
    }
    else { //if full randomization, set new flag range and count flags
        if (EventFlag(awardFlag0)) 
            SetEventFlagID(newFlag0, ON);
        if (EventFlag(awardFlag1))
            SetEventFlagID(newFlag1, ON);
        if (EventFlag(awardFlag2))
            SetEventFlagID(newFlag2, ON);
        if (EventFlag(awardFlag3))
            SetEventFlagID(newFlag3, ON);
        if (CountEventFlags(0, newFlag0, newFlag3) >= 1)
            AwardItemLot(itemlot0);
        if (CountEventFlags(0, newFlag0, newFlag3) >= 2)
            AwardItemLot(itemlot1);
        if (CountEventFlags(0, newFlag0, newFlag3) >= 3)
            AwardItemLot(itemlot2);
        if (CountEventFlags(0, newFlag0, newFlag3) == 4)
            AwardItemLot(itemlot3);
    }
});
    
//evaluate award flags
$Event(90001052, Default, function() {
    SetEventFlagID(1049302620, OFF); //reset rng events flag
    if (EventFlag(1049304400))
    AwardItemLot(1049304208);
    if (EventFlag(1049304401))
    AwardItemLot(1049304200);
    if (EventFlag(1049304402))
    AwardItemLot(1049304203);
    if (EventFlag(1049304403))
    AwardItemLot(1049304210);
    if (EventFlag(1049304405))
    AwardItemLot(1049304214);
    if (EventFlag(1049304406))
    AwardItemLot(1049304217);
    if (EventFlag(1049304407))
    AwardItemLot(1049304219);
    if (EventFlag(1049304408))
    AwardItemLot(1049304221);
    if (EventFlag(1049304409))
    AwardItemLot(1049304223);
    if (EventFlag(1049304410))
    AwardItemLot(1049304226);
    if (EventFlag(1049304411))
    AwardItemLot(1049304229);
    if (EventFlag(1049304412))
    AwardItemLot(1049304238);
    if (EventFlag(1049304413))
    AwardItemLot(1049304231);
    if (EventFlag(1049304414))
    AwardItemLot(1049304234);
    if (EventFlag(1049304415))
    AwardItemLot(1049304236);
    if (EventFlag(1049304416))
    AwardItemLot(1049304240);
    if (EventFlag(1049304417))
    AwardItemLot(1049304242);
    if (EventFlag(1049304418))
    AwardItemLot(1049304244);
    if (EventFlag(1049304419))
    AwardItemLot(1049304247);
    if (EventFlag(1049304420))
    AwardItemLot(1049304249);
    if (EventFlag(1049304421))
    AwardItemLot(1049304251);
    if (EventFlag(1049304422))
    AwardItemLot(1049304254);
    if (EventFlag(1049304423))
    AwardItemLot(1049304256);
    if (EventFlag(1049304424))
    AwardItemLot(1049304258);
    if (EventFlag(1049304425))
    AwardItemLot(1049304260);
    if (EventFlag(1049304426))
    AwardItemLot(1049304262);
    if (EventFlag(1049304427))
    AwardItemLot(1049304265);
    if (EventFlag(1049304428))
    AwardItemLot(1049304267);
    if (EventFlag(1049304429))
    AwardItemLot(1049304269);
    if (EventFlag(1049304430))
    AwardItemLot(1049304271);
    if (EventFlag(1049304431))
    AwardItemLot(1049304273);
    if (EventFlag(1049304432))
    AwardItemLot(1049304276);
    if (EventFlag(1049304433))
    AwardItemLot(1049304281);
    if (EventFlag(1049304434))
    AwardItemLot(1049304283);
    if (EventFlag(1049304435))
    AwardItemLot(1049304285);
    if (EventFlag(1049304436))
    AwardItemLot(1049304288);
    if (EventFlag(1049304437))
    AwardItemLot(1049304290);
    if (EventFlag(1049304438))
    AwardItemLot(1049304292);
    if (EventFlag(1049304439))
    AwardItemLot(1049304294);
    if (EventFlag(1049304440))
    AwardItemLot(1049304297);
    if (EventFlag(1049304441))
    AwardItemLot(1049304299);
    if (EventFlag(1049304442))
    AwardItemLot(1049304301);
    if (EventFlag(1049304444))
    AwardItemLot(1049304305);
    if (EventFlag(1049304445))
    AwardItemLot(1049304308);
    if (EventFlag(1049304446))
    AwardItemLot(1049304310);
    if (EventFlag(1049304447))
    AwardItemLot(1049304312);
    if (EventFlag(1049304449))
    AwardItemLot(1049304316);
    if (EventFlag(1049304450))
    AwardItemLot(1049304319);
    if (EventFlag(1049304452))
    AwardItemLot(1049304323);
    if (EventFlag(1049304453))
    AwardItemLot(1049304326);
    if (EventFlag(1049304454))
    AwardItemLot(1049304328);
    if (EventFlag(1049304456))
    AwardItemLot(1049304332);
    if (EventFlag(1049304457))
    AwardItemLot(1049304335);
    if (EventFlag(1049304458))
    AwardItemLot(1049304337);
    if (EventFlag(1049304459))
    AwardItemLot(1049304339);
    if (EventFlag(1049304462))
    AwardItemLot(1049304349);
    if (EventFlag(1049304463))
    AwardItemLot(1049304351);
    if (EventFlag(1049304464))
    AwardItemLot(1049304354);
    if (EventFlag(1049304465))
    AwardItemLot(1049304356);
    if (EventFlag(1049304466))
    AwardItemLot(1049304358);
    if (EventFlag(1049304467))
    AwardItemLot(1049304360);
    if (EventFlag(1049304468))
    AwardItemLot(1049304362);
    if (EventFlag(1049304469))
    AwardItemLot(1049304364);
    if (EventFlag(1049304470))
    AwardItemLot(1049304367);
    if (EventFlag(1049304471))
    AwardItemLot(1049304372);
    if (EventFlag(1049304472))
    AwardItemLot(1049304374);
    if (EventFlag(1049304474))
    AwardItemLot(1049304379);
    if (EventFlag(1049304475))
    AwardItemLot(1049304384);
    if (EventFlag(1049304476))
    AwardItemLot(1049304386);
    if (EventFlag(1049304477))
    AwardItemLot(1049304388);
    if (EventFlag(1049304478))
    AwardItemLot(1049304391);
    if (EventFlag(1049304479))
    AwardItemLot(1049304395);
    if (EventFlag(1049304481))
    AwardItemLot(1049304397);
    if (EventFlag(1049304482))
    AwardItemLot(1049304399);
    if (EventFlag(1049304483))
    AwardItemLot(1049304401);
    if (EventFlag(1049304484))
    AwardItemLot(1049304404);
    if (EventFlag(1049304486))
    AwardItemLot(1049304499);
    if (EventFlag(1049304488))
    AwardItemLot(1049304413);
    if (EventFlag(1049304489))
    AwardItemLot(1049304416);
    if (EventFlag(1049304490))
    AwardItemLot(1049304418);
    if (EventFlag(1049304492))
    AwardItemLot(1049304423);
    if (EventFlag(1049304493))
    AwardItemLot(1049304425);
    if (EventFlag(1049304495))
    AwardItemLot(1049304429);
    if (EventFlag(1049304496))
    AwardItemLot(1049304432);
    if (EventFlag(1049304497))
    AwardItemLot(1049304437);
    if (EventFlag(1049304498))
    AwardItemLot(1049304439);
    if (EventFlag(1049304499))
    AwardItemLot(1049304441);
    if (EventFlag(1049304501))
    AwardItemLot(1049304446);
    if (EventFlag(1049304502))
    AwardItemLot(1049304448);
    if (EventFlag(1049304503))
    AwardItemLot(1049304450);
    if (EventFlag(1049304504))
    AwardItemLot(1049304452);
    if (EventFlag(1049304505))
    AwardItemLot(1049304455);
    if (EventFlag(1049304506))
    AwardItemLot(1049304458);
    if (EventFlag(1049304507))
    AwardItemLot(1049304463);
    if (EventFlag(1049304508))
    AwardItemLot(1049304465);
    if (EventFlag(1049304510))
    AwardItemLot(1049304470);
    if (EventFlag(1049304511))
    AwardItemLot(1049304472);
    if (EventFlag(1049304512))
    AwardItemLot(1049304474);
    if (EventFlag(1049304513))
    AwardItemLot(1049304476);
    if (EventFlag(1049304514))
    AwardItemLot(1049304478);
    if (EventFlag(1049304515))
    AwardItemLot(1049304480);
    if (EventFlag(1049304516))
    AwardItemLot(1049304482);
    if (EventFlag(1049304517))
    AwardItemLot(1049304484);
    if (EventFlag(1049304519))
    AwardItemLot(1049304490);
    if (EventFlag(1049304520))
    AwardItemLot(1049304495);
    if (EventFlag(1049304521))
    AwardItemLot(1049304497);
    if (EventFlag(1049304522))
    AwardItemLot(1049304407);
    if (EventFlag(1049304523))
    AwardItemLot(1049304502);
    if (EventFlag(1049304524))
    AwardItemLot(1049304504);
    if (EventFlag(1049304525))
    AwardItemLot(1049304506);
    if (EventFlag(1049304526))
    AwardItemLot(1049304509);
    if (EventFlag(1049304527))
    AwardItemLot(1049304513);
    if (EventFlag(1049304528))
    AwardItemLot(1049304515);
    if (EventFlag(1049304529))
    AwardItemLot(1049304518);
    if (EventFlag(1049304530))
    AwardItemLot(1049304522);
    if (EventFlag(1049304531))
    AwardItemLot(1049304524);
    if (EventFlag(1049304533))
    AwardItemLot(1049304529);
    if (EventFlag(1049304534))
    AwardItemLot(1049304532);
    if (EventFlag(1049304535))
    AwardItemLot(1049304534);
    if (EventFlag(1049304536))
    AwardItemLot(1049304536);
    if (EventFlag(1049304537))
    AwardItemLot(1049304539);
    if (EventFlag(1049304538))
    AwardItemLot(1049304543);
    if (EventFlag(1049304539))
    AwardItemLot(1049304545);
    if (EventFlag(1049304540))
    AwardItemLot(1049304547);
    if (EventFlag(1049304541))
    AwardItemLot(1049304549);
    if (EventFlag(1049304542))
    AwardItemLot(1049304552);
    if (EventFlag(1049304543))
    AwardItemLot(1049304557);
    if (EventFlag(1049304544))
    AwardItemLot(1049304559);
    if (EventFlag(1049304546))
    AwardItemLot(1049304563);
    if (EventFlag(1049304547))
    AwardItemLot(1049304566);
    if (EventFlag(1049304548))
    AwardItemLot(1049304571);
    if (EventFlag(1049304549))
    AwardItemLot(1049304573);
    if (EventFlag(1049304550))
    AwardItemLot(1049304575);
    if (EventFlag(1049304551))
    AwardItemLot(1049304577);
    if (EventFlag(1049304552))
    AwardItemLot(1049304580);
    if (EventFlag(1049304553))
    AwardItemLot(1049304584);
    if (EventFlag(1049304555))
    AwardItemLot(1049304588);
    if (EventFlag(1049304556))
    AwardItemLot(1049304591);
    if (EventFlag(1049304557))
    AwardItemLot(1049304595);
    if (EventFlag(1049304558))
    AwardItemLot(1049304597);
    if (EventFlag(1049304559))
    AwardItemLot(1049304599);
    if (EventFlag(1049304561))
    AwardItemLot(1049304603);
    if (EventFlag(1049304562))
    AwardItemLot(1049304606);
    if (EventFlag(1049304563))
    AwardItemLot(1049304608);
    if (EventFlag(1049304564))
    AwardItemLot(1049304610);
    if (EventFlag(1049304565))
    AwardItemLot(1049304613);
    if (EventFlag(1049304566))
    AwardItemLot(1049304615);
    if (EventFlag(1049304567))
    AwardItemLot(1049304617);
    if (EventFlag(1049304568))
    AwardItemLot(1049304619);
    if (EventFlag(1049304569))
    AwardItemLot(1049304621);
    if (EventFlag(1049304570))
    AwardItemLot(1049304623);
    if (EventFlag(1049304571))
    AwardItemLot(1049304625);
    if (EventFlag(1049304572))
    AwardItemLot(1049304628);
    if (EventFlag(1049304573))
    AwardItemLot(1049304632);
    if (EventFlag(1049304575))
    AwardItemLot(1049304637);
    if (EventFlag(1049304576))
    AwardItemLot(1049304641);
    if (EventFlag(1049304577))
    AwardItemLot(1049304643);
    if (EventFlag(1049304578))
    AwardItemLot(1049304645);
    if (EventFlag(1049304579))
    AwardItemLot(1049304649);
    if (EventFlag(1049304580))
    AwardItemLot(1049304652);
    if (EventFlag(1049304581))
    AwardItemLot(1049304657);
    if (EventFlag(1049304582))
    AwardItemLot(1049304659);
    if (EventFlag(1049304584))
    AwardItemLot(1049304673);
    if (EventFlag(1049304585))
    AwardItemLot(1049304676);
    if (EventFlag(1049304586))
    AwardItemLot(1049304678);
    if (EventFlag(1049304587))
    AwardItemLot(1049304680);
    if (EventFlag(1049304588))
    AwardItemLot(1049304682);
    if (EventFlag(1049304589))
    AwardItemLot(1049304685);
    if (EventFlag(1049304590))
    AwardItemLot(1049304690);
    if (EventFlag(1049304591))
    AwardItemLot(1049304692);
    if (EventFlag(1049304592))
    AwardItemLot(1049304695);
    if (EventFlag(1049304593))
    AwardItemLot(1049304698);
    if (EventFlag(1049304594))
    AwardItemLot(1049304704);
    if (EventFlag(1049304595))
    AwardItemLot(1049304647);
    if (EventFlag(1049304596))
    AwardItemLot(1049304511);
    if (EventFlag(1049304597))
    AwardItemLot(1049304706);
    if (EventFlag(1049304598))
    AwardItemLot(1049304708);
    if (EventFlag(1049304599))
    AwardItemLot(1049304710);
    if (EventFlag(1049304600))
    AwardItemLot(1049304713);
    if (EventFlag(1049304601))
    AwardItemLot(1049304716);
    if (EventFlag(1049304602))
    AwardItemLot(1049304718);
    if (EventFlag(1049304603))
    AwardItemLot(1049304720);
    if (EventFlag(1049304604))
    AwardItemLot(1049304723);
    if (EventFlag(1049304605))
    AwardItemLot(1049304727);
    if (EventFlag(1049304606))
    AwardItemLot(1049304729);
    if (EventFlag(1049304607))
    AwardItemLot(1049304731);
    if (EventFlag(1049304608))
    AwardItemLot(1049304734);
    if (EventFlag(1049304609))
    AwardItemLot(1049304739);
    if (EventFlag(1049304610))
    AwardItemLot(1049304741);
    if (EventFlag(1049304612))
    AwardItemLot(1049304746);
    if (EventFlag(1049304613))
    AwardItemLot(1049304749);
    if (EventFlag(1049304614))
    AwardItemLot(1049304753);
    if (EventFlag(1049304615))
    AwardItemLot(1049304756);
    if (EventFlag(1049304616))
    AwardItemLot(1049304758);
    if (EventFlag(1049304617))
    AwardItemLot(1049304760);
    if (EventFlag(1049304618))
    AwardItemLot(1049304762);
    if (EventFlag(1049304619))
    AwardItemLot(1049304765);
    if (EventFlag(1049304620))
    AwardItemLot(1049304767);
    if (EventFlag(1049304621))
    AwardItemLot(1049304770);
    if (EventFlag(1049304622))
    AwardItemLot(1049304772);
    if (EventFlag(1049304623))
    AwardItemLot(1049304775);
    if (EventFlag(1049304624))
    AwardItemLot(1049304777);
    if (EventFlag(1049304625))
    AwardItemLot(1049304782);
    if (EventFlag(1049304627))
    AwardItemLot(1049304786);
    if (EventFlag(1049304628))
    AwardItemLot(1049304788);
    if (EventFlag(1049304629))
    AwardItemLot(1049304791);
    if (EventFlag(1049304630))
    AwardItemLot(1049304795);
    if (EventFlag(1049304631))
    AwardItemLot(1049304797);
    if (EventFlag(1049304632))
    AwardItemLot(1049304800);
    if (EventFlag(1049304633))
    AwardItemLot(1049304802);
    if (EventFlag(1049304634))
    AwardItemLot(1049304804);
    if (EventFlag(1049304635))
    AwardItemLot(1049304806);
    if (EventFlag(1049304637))
    AwardItemLot(1049304811);
    if (EventFlag(1049304638))
    AwardItemLot(1049304816);
    if (EventFlag(1049304639))
    AwardItemLot(1049304818);
    if (EventFlag(1049304640))
    AwardItemLot(1049304821);
    if (EventFlag(1049304641))
    AwardItemLot(1049304823);
    if (EventFlag(1049304642))
    AwardItemLot(1049304828);
    if (EventFlag(1049304643))
    AwardItemLot(1049304830);
    if (EventFlag(1049304644))
    AwardItemLot(1049304832);
    if (EventFlag(1049304645))
    AwardItemLot(1049304835);
    if (EventFlag(1049304646))
    AwardItemLot(1049304837);
    if (EventFlag(1049304647))
    AwardItemLot(1049304839);
    if (EventFlag(1049304648))
    AwardItemLot(1049304846);
    if (EventFlag(1049304649))
    AwardItemLot(1049304848);
    if (EventFlag(1049304650))
    AwardItemLot(1049304850);
    if (EventFlag(1049304651))
    AwardItemLot(1049304852);
    if (EventFlag(1049304652))
    AwardItemLot(1049304855);
    if (EventFlag(1049304653))
    AwardItemLot(1049304857);
    if (EventFlag(1049304654))
    AwardItemLot(1049304859);
    if (EventFlag(1049304655))
    AwardItemLot(1049304861);
    if (EventFlag(1049304656))
    AwardItemLot(1049304863);
    if (EventFlag(1049304658))
    AwardItemLot(1049304867);
    if (EventFlag(1049304659))
    AwardItemLot(1049304870);
    if (EventFlag(1049304660))
    AwardItemLot(1049304873);
    if (EventFlag(1049304661))
    AwardItemLot(1049304875);
    if (EventFlag(1049304662))
    AwardItemLot(1049304877);
    if (EventFlag(1049304663))
    AwardItemLot(1049304880);
    if (EventFlag(1049304664))
    AwardItemLot(1049304885);
    if (EventFlag(1049304665))
    AwardItemLot(1049304887);
    if (EventFlag(1049304666))
    AwardItemLot(1049304889);
    if (EventFlag(1049304667))
    AwardItemLot(1049304891);
    if (EventFlag(1049304668))
    AwardItemLot(1049304893);
    if (EventFlag(1049304669))
    AwardItemLot(1049304896);
    if (EventFlag(1049304670))
    AwardItemLot(1049304898);
    if (EventFlag(1049304671))
    AwardItemLot(1049304900);
    if (EventFlag(1049304672))
    AwardItemLot(1049304902);
    if (EventFlag(1049304673))
    AwardItemLot(1049304905);
    if (EventFlag(1049304674))
    AwardItemLot(1049304908);
    if (EventFlag(1049304675))
    AwardItemLot(1049304910);
    if (EventFlag(1049304676))
    AwardItemLot(1049304912);
    if (EventFlag(1049304678))
    AwardItemLot(1049304916);
    if (EventFlag(1049304679))
    AwardItemLot(1049304919);
    if (EventFlag(1049304680))
    AwardItemLot(1049304921);
    if (EventFlag(1049304681))
    AwardItemLot(1049304923);
    if (EventFlag(1049304682))
    AwardItemLot(1049304925);
    if (EventFlag(1049304683))
    AwardItemLot(1049304928);
    if (EventFlag(1049304684))
    AwardItemLot(1049304932);
    if (EventFlag(1049304685))
    AwardItemLot(1049304934);
    if (EventFlag(1049304686))
    AwardItemLot(1049304936);
    if (EventFlag(1049304687))
    AwardItemLot(1049304940);
    if (EventFlag(1049304688))
    AwardItemLot(1049304943);
    if (EventFlag(1049304689))
    AwardItemLot(1049304948);
    if (EventFlag(1049304690))
    AwardItemLot(1049304950);
    if (EventFlag(1049304691))
    AwardItemLot(1049304952);
    if (EventFlag(1049304692))
    AwardItemLot(1049304955);
    if (EventFlag(1049304693))
    AwardItemLot(1049304958);
    if (EventFlag(1049304694))
    AwardItemLot(1049304960);
    if (EventFlag(1049304695))
    AwardItemLot(1049304962);
    if (EventFlag(1049304696))
    AwardItemLot(1049304964);
    if (EventFlag(1049304697))
    AwardItemLot(1049304966);
    if (EventFlag(1049304698))
    AwardItemLot(1049304969);
    if (EventFlag(1049304699))
    AwardItemLot(1049304972);
    if (EventFlag(1049304700))
    AwardItemLot(1049304974);
    if (EventFlag(1049304701))
    AwardItemLot(1049304977);
    if (EventFlag(1049304702))
    AwardItemLot(1049304979);
    if (EventFlag(1049304703))
    AwardItemLot(1049304984);
    if (EventFlag(1049304704))
    AwardItemLot(1049304986);
    if (EventFlag(1049304705))
    AwardItemLot(1049304988);
    if (EventFlag(1049304706))
    AwardItemLot(1049304991);
    if (EventFlag(1049304707))
    AwardItemLot(1049304996);
    if (EventFlag(1049304708))
    AwardItemLot(1049304998);
    if (EventFlag(1049304709))
    AwardItemLot(1049305000);
    if (EventFlag(1049304710))
    AwardItemLot(1049305002);
    if (EventFlag(1049304711))
    AwardItemLot(1049305004);
    if (EventFlag(1049304712))
    AwardItemLot(1049305007);
    if (EventFlag(1049304713))
    AwardItemLot(1049305009);
    if (EventFlag(1049304714))
    AwardItemLot(1049305011);
    if (EventFlag(1049304715))
    AwardItemLot(1049305013);
    if (EventFlag(1049304716))
    AwardItemLot(1049305016);
    if (EventFlag(1049304717))
    AwardItemLot(1049305021);
    if (EventFlag(1049304718))
    AwardItemLot(1049305023);
    if (EventFlag(1049304719))
    AwardItemLot(1049305026);
    if (EventFlag(1049304720))
    AwardItemLot(1049305028);
    if (EventFlag(1049304721))
    AwardItemLot(1049305032);
    if (EventFlag(1049304722))
    AwardItemLot(1049305034);
    if (EventFlag(1049304723))
    AwardItemLot(1049305036);
    if (EventFlag(1049304725))
    AwardItemLot(1049305041);
    if (EventFlag(1049304726))
    AwardItemLot(1049305047);
    if (EventFlag(1049304727))
    AwardItemLot(1049305049);
    if (EventFlag(1049304728))
    AwardItemLot(1049305052);
    if (EventFlag(1049304729))
    AwardItemLot(1049305054);
    if (EventFlag(1049304730))
    AwardItemLot(1049305056);
    if (EventFlag(1049304731))
    AwardItemLot(1049305058);
    if (EventFlag(1049304733))
    AwardItemLot(1049305063);
    if (EventFlag(1049304734))
    AwardItemLot(1049305068);
    if (EventFlag(1049304735))
    AwardItemLot(1049305070);
    if (EventFlag(1049304736))
    AwardItemLot(1049305072);
    if (EventFlag(1049304737))
    AwardItemLot(1049305074);
    if (EventFlag(1049304738))
    AwardItemLot(1049305077);
    if (EventFlag(1049304739))
    AwardItemLot(1049305082);
    if (EventFlag(1049304740))
    AwardItemLot(1049305084);
    if (EventFlag(1049304741))
    AwardItemLot(1049305086);
    if (EventFlag(1049304742))
    AwardItemLot(1049305088);
    if (EventFlag(1049304743))
    AwardItemLot(1049305090);
    if (EventFlag(1049304744))
    AwardItemLot(1049305092);
    if (EventFlag(1049304745))
    AwardItemLot(1049305099);
    if (EventFlag(1049304746))
    AwardItemLot(1049305101);
    if (EventFlag(1049304747))
    AwardItemLot(1049305104);
    if (EventFlag(1049304748))
    AwardItemLot(1049305106);
    if (EventFlag(1049304749))
    AwardItemLot(1049305108);
    if (EventFlag(1049304750))
    AwardItemLot(1049305097);
    if (EventFlag(1049304751))
    AwardItemLot(1049305113);
    if (EventFlag(1049304752))
    AwardItemLot(1049305116);
    if (EventFlag(1049304753))
    AwardItemLot(1049305118);
    if (EventFlag(1049304754))
    AwardItemLot(1049305121);
    if (EventFlag(1049304755))
    AwardItemLot(1049305123);
    if (EventFlag(1049304756))
    AwardItemLot(1049305125);
    if (EventFlag(1049304757))
    AwardItemLot(1049305127);
    if (EventFlag(1049304758))
    AwardItemLot(1049305129);
    if (EventFlag(1049304759))
    AwardItemLot(1049305131);
    if (EventFlag(1049304760))
    AwardItemLot(1049305134);
    if (EventFlag(1049304761))
    AwardItemLot(1049305136);
    if (EventFlag(1049304762))
    AwardItemLot(1049305138);
    if (EventFlag(1049304763))
    AwardItemLot(1049305140);
    if (EventFlag(1049304764))
    AwardItemLot(1049305143);
    if (EventFlag(1049304765))
    AwardItemLot(1049305146);
    if (EventFlag(1049304766))
    AwardItemLot(1049305149);
    if (EventFlag(1049304767))
    AwardItemLot(1049305151);
    if (EventFlag(1049304769))
    AwardItemLot(1049305155);
    if (EventFlag(1049304770))
    AwardItemLot(1049305158);
    if (EventFlag(1049304771))
    AwardItemLot(1049305162);
    if (EventFlag(1049304772))
    AwardItemLot(1049305164);
    if (EventFlag(1049304773))
    AwardItemLot(1049305166);
    if (EventFlag(1049304774))
    AwardItemLot(1049305169);
    if (EventFlag(1049304775))
    AwardItemLot(1049305175);
    if (EventFlag(1049304776))
    AwardItemLot(1049305177);
    if (EventFlag(1049304778))
    AwardItemLot(1049305181);
    if (EventFlag(1049304779))
    AwardItemLot(1049305184);
    if (EventFlag(1049304780))
    AwardItemLot(1049305188);
    if (EventFlag(1049304781))
    AwardItemLot(1049305190);
    if (EventFlag(1049304782))
    AwardItemLot(1049305193);
    if (EventFlag(1049304783))
    AwardItemLot(1049305195);
    if (EventFlag(1049304784))
    AwardItemLot(1049305198);
    if (EventFlag(1049304785))
    AwardItemLot(1049305200);
    if (EventFlag(1049304786))
    AwardItemLot(1049305202);
    if (EventFlag(1049304787))
    AwardItemLot(1049305205);
    if (EventFlag(1049304788))
    AwardItemLot(1049305208);
    if (EventFlag(1049304789))
    AwardItemLot(1049305213);
    if (EventFlag(1049304791))
    AwardItemLot(1049305217);
    if (EventFlag(1049304792))
    AwardItemLot(1049305219);
    if (EventFlag(1049304793))
    AwardItemLot(1049305221);
    if (EventFlag(1049304794))
    AwardItemLot(1049305224);
    if (EventFlag(1049304795))
    AwardItemLot(1049305229);
    if (EventFlag(1049304797))
    AwardItemLot(1049305234);
    if (EventFlag(1049304798))
    AwardItemLot(1049305237);
    if (EventFlag(1049304799))
    AwardItemLot(1049305239);
    if (EventFlag(1049304800))
    AwardItemLot(1049305241);
    if (EventFlag(1049304801))
    AwardItemLot(1049305246);
    if (EventFlag(1049304802))
    AwardItemLot(1049305251);
    if (EventFlag(1049304803))
    AwardItemLot(1049305253);
    if (EventFlag(1049304806))
    AwardItemLot(1049305255);
    if (EventFlag(1049304808))
    AwardItemLot(1049305260);
    if (EventFlag(1049304809))
    AwardItemLot(1049305265);
    if (EventFlag(1049304810))
    AwardItemLot(1049305267);
    if (EventFlag(1049304811))
    AwardItemLot(1049305269);
    if (EventFlag(1049304812))
    AwardItemLot(1049305272);
    if (EventFlag(1049304813))
    AwardItemLot(1049305275);
    if (EventFlag(1049304814))
    AwardItemLot(1049305278);
    if (EventFlag(1049304815))
    AwardItemLot(1049305280);
    if (EventFlag(1049304816))
    AwardItemLot(1049305283);
    if (EventFlag(1049304817))
    AwardItemLot(1049305288);
    if (EventFlag(1049304819))
    AwardItemLot(1049305292);
    if (EventFlag(1049304820))
    AwardItemLot(1049305295);
    if (EventFlag(1049304821))
    AwardItemLot(1049305300);
    if (EventFlag(1049304822))
    AwardItemLot(1049305302);
    if (EventFlag(1049304823))
    AwardItemLot(1049305305);
    if (EventFlag(1049304824))
    AwardItemLot(1049305308);
    if (EventFlag(1049304825))
    AwardItemLot(1049305310);
    if (EventFlag(1049304826))
    AwardItemLot(1049305312);
    if (EventFlag(1049304827))
    AwardItemLot(1049305314);
    if (EventFlag(1049304828))
    AwardItemLot(1049305317);
    if (EventFlag(1049304829))
    AwardItemLot(1049305322);
    if (EventFlag(1049304830))
    AwardItemLot(1049305324);
    if (EventFlag(1049304831))
    AwardItemLot(1049305326);
    if (EventFlag(1049304832))
    AwardItemLot(1049305329);
    if (EventFlag(1049304833))
    AwardItemLot(1049305331);
    if (EventFlag(1049304834))
    AwardItemLot(1049305333);
    if (EventFlag(1049304835))
    AwardItemLot(1049305335);
    if (EventFlag(1049304836))
    AwardItemLot(1049305337);
    if (EventFlag(1049304837))
    AwardItemLot(1049305342);
    if (EventFlag(1049304838))
    AwardItemLot(1049305345);
    if (EventFlag(1049304839))
    AwardItemLot(1049305347);
    if (EventFlag(1049304840))
    AwardItemLot(1049305349);
    if (EventFlag(1049304841))
    AwardItemLot(1049305351);
    if (EventFlag(1049304843))
    AwardItemLot(1049305355);
    if (EventFlag(1049304844))
    AwardItemLot(1049305359);
    if (EventFlag(1049304845))
    AwardItemLot(1049305361);
    if (EventFlag(1049304846))
    AwardItemLot(1049305363);
    if (EventFlag(1049304847))
    AwardItemLot(1049305365);
    if (EventFlag(1049304848))
    AwardItemLot(1049305368);
    if (EventFlag(1049304849))
    AwardItemLot(1049305373);
    if (EventFlag(1049304850))
    AwardItemLot(1049305376);
    if (EventFlag(1049304851))
    AwardItemLot(1049305378);
    if (EventFlag(1049304852))
    AwardItemLot(1049305384);
    if (EventFlag(1049304853))
    AwardItemLot(1049305386);
    if (EventFlag(1049304854))
    AwardItemLot(1049305388);
    if (EventFlag(1049304855))
    AwardItemLot(1049305390);
    if (EventFlag(1049304856))
    AwardItemLot(1049305395);
    if (EventFlag(1049304857))
    AwardItemLot(1049305397);
    if (EventFlag(1049304859))
    AwardItemLot(1049305403);
    if (EventFlag(1049304860))
    AwardItemLot(1049305408);
    if (EventFlag(1049304861))
    AwardItemLot(1049305410);
    if (EventFlag(1049304862))
    AwardItemLot(1049305412);
    if (EventFlag(1049304863))
    AwardItemLot(1049305414);
    if (EventFlag(1049304864))
    AwardItemLot(1049305416);
    if (EventFlag(1049304865))
    AwardItemLot(1049305418);
    if (EventFlag(1049304866))
    AwardItemLot(1049305420);
    if (EventFlag(1049304867))
    AwardItemLot(1049305422);
    if (EventFlag(1049304868))
    AwardItemLot(1049305425);
    if (EventFlag(1049304869))
    AwardItemLot(1049305427);
    if (EventFlag(1049304870))
    AwardItemLot(1049305430);
    if (EventFlag(1049304871))
    AwardItemLot(1049305432);
    if (EventFlag(1049304872))
    AwardItemLot(1049305434);
    if (EventFlag(1049304873))
    AwardItemLot(1049305436);
    if (EventFlag(1049304874))
    AwardItemLot(1049305441);
    if (EventFlag(1049304875))
    AwardItemLot(1049305443);
    if (EventFlag(1049304876))
    AwardItemLot(1049305446);
    if (EventFlag(1049304877))
    AwardItemLot(1049305449);
    if (EventFlag(1049304878))
    AwardItemLot(1049305453);
    if (EventFlag(1049304879))
    AwardItemLot(1049305455);
    if (EventFlag(1049304880))
    AwardItemLot(1049305457);
    if (EventFlag(1049304881))
    AwardItemLot(1049305459);
    if (EventFlag(1049304882))
    AwardItemLot(1049305461);
    if (EventFlag(1049304883))
    AwardItemLot(1049305465);
    if (EventFlag(1049304885))
    AwardItemLot(1049305470);
    if (EventFlag(1049304886))
    AwardItemLot(1049305475);
    if (EventFlag(1049304887))
    AwardItemLot(1049305477);
    if (EventFlag(1049304889))
    AwardItemLot(1049305482);
    if (EventFlag(1049304890))
    AwardItemLot(1049305484);
    if (EventFlag(1049304891))
    AwardItemLot(1049305486);
    if (EventFlag(1049304892))
    AwardItemLot(1049305488);
    if (EventFlag(1049304893))
    AwardItemLot(1049305491);
    if (EventFlag(1049304894))
    AwardItemLot(1049305496);
    if (EventFlag(1049304895))
    AwardItemLot(1049305498);
    if (EventFlag(1049304897))
    AwardItemLot(1049305502);
    if (EventFlag(1049304898))
    AwardItemLot(1049305504);
    if (EventFlag(1049304899))
    AwardItemLot(1049305506);
    if (EventFlag(1049304900))
    AwardItemLot(1049305508);
    if (EventFlag(1049304901))
    AwardItemLot(1049305510);
    if (EventFlag(1049304902))
    AwardItemLot(1049305513);
    if (EventFlag(1049304903))
    AwardItemLot(1049305518);
    if (EventFlag(1049304904))
    AwardItemLot(1049305520);
    if (EventFlag(1049304905))
    AwardItemLot(1049305523);
    if (EventFlag(1049304906))
    AwardItemLot(1049305528);
    if (EventFlag(1049304907))
    AwardItemLot(1049305530);
    if (EventFlag(1049304908))
    AwardItemLot(1049305533);
    if (EventFlag(1049304909))
    AwardItemLot(1049305536);
    if (EventFlag(1049304910))
    AwardItemLot(1049305538);
    if (EventFlag(1049304911))
    AwardItemLot(1049305540);
    if (EventFlag(1049304912))
    AwardItemLot(1049305542);
    if (EventFlag(1049304913))
    AwardItemLot(1049305544);
    if (EventFlag(1049304914))
    AwardItemLot(1049305549);
    if (EventFlag(1049304915))
    AwardItemLot(1049305551);
    if (EventFlag(1049304916))
    AwardItemLot(1049305554);
    if (EventFlag(1049304917))
    AwardItemLot(1049305559);
    if (EventFlag(1049304918))
    AwardItemLot(1049305561);
    if (EventFlag(1049304919))
    AwardItemLot(1049305563);
    if (EventFlag(1049304921))
    AwardItemLot(1049305568);
    if (EventFlag(1049304922))
    AwardItemLot(1049305570);
    if (EventFlag(1049304923))
    AwardItemLot(1049305574);
    if (EventFlag(1049304924))
    AwardItemLot(1049305576);
    if (EventFlag(1049304925))
    AwardItemLot(1049305578);
    if (EventFlag(1049304927))
    AwardItemLot(1049305583);
    if (EventFlag(1049304928))
    AwardItemLot(1049305585);
    if (EventFlag(1049304929))
    AwardItemLot(1049305589);
    if (EventFlag(1049304930))
    AwardItemLot(1049305591);
    if (EventFlag(1049304931))
    AwardItemLot(1049305593);
    if (EventFlag(1049304932))
    AwardItemLot(1049305595);
    if (EventFlag(1049304934))
    AwardItemLot(1049305601);
    if (EventFlag(1049304935))
    AwardItemLot(1049305603);
    if (EventFlag(1049304936))
    AwardItemLot(1049305605);
    if (EventFlag(1049304937))
    AwardItemLot(1049305607);
    if (EventFlag(1049304938))
    AwardItemLot(1049305609);
    if (EventFlag(1049304939))
    AwardItemLot(1049305611);
    if (EventFlag(1049304940))
    AwardItemLot(1049305613);
    if (EventFlag(1049304941))
    AwardItemLot(1049305616);
    if (EventFlag(1049304942))
    AwardItemLot(1049305621);
    if (EventFlag(1049304943))
    AwardItemLot(1049305623);
    if (EventFlag(1049304944))
    AwardItemLot(1049305629);
    if (EventFlag(1049304945))
    AwardItemLot(1049305631);
    if (EventFlag(1049304946))
    AwardItemLot(1049305633);
    if (EventFlag(1049304947))
    AwardItemLot(1049305635);
    if (EventFlag(1049304949))
    AwardItemLot(1049305640);
    if (EventFlag(1049304950))
    AwardItemLot(1049305642);
    if (EventFlag(1049304951))
    AwardItemLot(1049305644);
    if (EventFlag(1049304952))
    AwardItemLot(1049305646);
    if (EventFlag(1049304953))
    AwardItemLot(1049305649);
    if (EventFlag(1049304954))
    AwardItemLot(1049305654);
    if (EventFlag(1049304955))
    AwardItemLot(1049305656);
    if (EventFlag(1049304956))
    AwardItemLot(1049305659);
    if (EventFlag(1049304957))
    AwardItemLot(1049305661);
    if (EventFlag(1049304958))
    AwardItemLot(1049305663);
    if (EventFlag(1049304959))
    AwardItemLot(1049305668);
    if (EventFlag(1049304960))
    AwardItemLot(1049305671);
    if (EventFlag(1049304961))
    AwardItemLot(1049305673);
    if (EventFlag(1049304962))
    AwardItemLot(1049305678);
    if (EventFlag(1049304963))
    AwardItemLot(1049305680);
    if (EventFlag(1049304964))
    AwardItemLot(1049305683);
    if (EventFlag(1049304965))
    AwardItemLot(1049305685);
    if (EventFlag(1049304966))
    AwardItemLot(1049305690);
    if (EventFlag(1049304967))
    AwardItemLot(1049305692);
    if (EventFlag(1049304969))
    AwardItemLot(1049305697);
    if (EventFlag(1049304970))
    AwardItemLot(1049305699);
    if (EventFlag(1049304971))
    AwardItemLot(1049305701);
    if (EventFlag(1049304972))
    AwardItemLot(1049305703);
    if (EventFlag(1049304973))
    AwardItemLot(1049305705);
    if (EventFlag(1049304974))
    AwardItemLot(1049305707);
    if (EventFlag(1049304975))
    AwardItemLot(1049305709);
    if (EventFlag(1049304976))
    AwardItemLot(1049305712);
    if (EventFlag(1049304977))
    AwardItemLot(1049305714);
    if (EventFlag(1049304978))
    AwardItemLot(1049305716);
    if (EventFlag(1049304979))
    AwardItemLot(1049305718);
    if (EventFlag(1049304981))
    AwardItemLot(1049305722);
    if (EventFlag(1049304982))
    AwardItemLot(1049305724);
    if (EventFlag(1049304983))
    AwardItemLot(1049305726);
    if (EventFlag(1049304984))
    AwardItemLot(1049305730);
    if (EventFlag(1049304985))
    AwardItemLot(1049305735);
    if (EventFlag(1049304986))
    AwardItemLot(1049305737);
    if (EventFlag(1049304987))
    AwardItemLot(1049305739);
    if (EventFlag(1049304988))
    AwardItemLot(1049305741);
    if (EventFlag(1049304989))
    AwardItemLot(1049305745);
    if (EventFlag(1049304990))
    AwardItemLot(1049305747);
    if (EventFlag(1049304991))
    AwardItemLot(1049305749);
    if (EventFlag(1049304992))
    AwardItemLot(1049305753);
    if (EventFlag(1049304994))
    AwardItemLot(1049305758);
    if (EventFlag(1049304995))
    AwardItemLot(1049305763);
    if (EventFlag(1049304996))
    AwardItemLot(1049305765);
    if (EventFlag(1049307000))
    AwardItemLot(1049305767);
    if (EventFlag(1049307001))
    AwardItemLot(1049305769);
    if (EventFlag(1049307002))
    AwardItemLot(1049305771);
    if (EventFlag(1049307003))
    AwardItemLot(1049305774);
    if (EventFlag(1049307004))
    AwardItemLot(1049305779);
    if (EventFlag(1049307005))
    AwardItemLot(1049305782);
    if (EventFlag(1049307006))
    AwardItemLot(1049305785);
    if (EventFlag(1049307007))
    AwardItemLot(1049305790);
    if (EventFlag(1049307008))
    AwardItemLot(1049305792);
    if (EventFlag(1049307009))
    AwardItemLot(1049305794);
    if (EventFlag(1049307011))
    AwardItemLot(1049305798);
    if (EventFlag(1049307012))
    AwardItemLot(1049305800);
    if (EventFlag(1049307013))
    AwardItemLot(1049305802);
    if (EventFlag(1049307014))
    AwardItemLot(1049305804);
    if (EventFlag(1049307015))
    AwardItemLot(1049305808);
    if (EventFlag(1049307016))
    AwardItemLot(1049305810);
    if (EventFlag(1049307017))
    AwardItemLot(1049305812);
    if (EventFlag(1049307018))
    AwardItemLot(1049305814);
    if (EventFlag(1049307019))
    AwardItemLot(1049305819);
    if (EventFlag(1049307021))
    AwardItemLot(1049305823);
    if (EventFlag(1049307022))
    AwardItemLot(1049305826);
    if (EventFlag(1049307023))
    AwardItemLot(1049305829);
    if (EventFlag(1049307024))
    AwardItemLot(1049305831);
    if (EventFlag(1049307025))
    AwardItemLot(1049305833);
    if (EventFlag(1049307026))
    AwardItemLot(1049305835);
    if (EventFlag(1049307027))
    AwardItemLot(1049305837);
    if (EventFlag(1049307028))
    AwardItemLot(1049305839);
    if (EventFlag(1049307030))
    AwardItemLot(1049305846);
    if (EventFlag(1049307031))
    AwardItemLot(1049305848);
    if (EventFlag(1049307032))
    AwardItemLot(1049305850);
    if (EventFlag(1049307033))
    AwardItemLot(1049305852);
    if (EventFlag(1049307034))
    AwardItemLot(1049305854);
    if (EventFlag(1049307035))
    AwardItemLot(1049305859);
    if (EventFlag(1049307036))
    AwardItemLot(1049305861);
    if (EventFlag(1049307038))
    AwardItemLot(1049305865);
    if (EventFlag(1049307039))
    AwardItemLot(1049305868);
    if (EventFlag(1049307040))
    AwardItemLot(1049305870);
    if (EventFlag(1049307041))
    AwardItemLot(1049305873);
    if (EventFlag(1049307042))
    AwardItemLot(1049305875);
    if (EventFlag(1049307043))
    AwardItemLot(1049305877);
    if (EventFlag(1049307044))
    AwardItemLot(1049305882);
    if (EventFlag(1049307046))
    AwardItemLot(1049305887);
    if (EventFlag(1049307047))
    AwardItemLot(1049305893);
    if (EventFlag(1049307048))
    AwardItemLot(1049305895);
    if (EventFlag(1049307049))
    AwardItemLot(1049305899);
    if (EventFlag(1049307051))
    AwardItemLot(1049305904);
    if (EventFlag(1049307052))
    AwardItemLot(1049305906);
    if (EventFlag(1049307054))
    AwardItemLot(1049305911);
    if (EventFlag(1049307055))
    AwardItemLot(1049305913);
    if (EventFlag(1049307056))
    AwardItemLot(1049305918);
    if (EventFlag(1049307057))
    AwardItemLot(1049305920);
    if (EventFlag(1049307059))
    AwardItemLot(1049305927);
    if (EventFlag(1049307060))
    AwardItemLot(1049305929);
    if (EventFlag(1049307061))
    AwardItemLot(1049305931);
    if (EventFlag(1049307063))
    AwardItemLot(1049305936);
    if (EventFlag(1049307064))
    AwardItemLot(1049305941);
    if (EventFlag(1049307065))
    AwardItemLot(1049305943);
    if (EventFlag(1049307066))
    AwardItemLot(1049305945);
    if (EventFlag(1049307068))
    AwardItemLot(1049305950);
    if (EventFlag(1049307069))
    AwardItemLot(1049305957);
    if (EventFlag(1049307070))
    AwardItemLot(1049305959);
    if (EventFlag(1049307071))
    AwardItemLot(1049305961);
    if (EventFlag(1049307073))
    AwardItemLot(1049305968);
    if (EventFlag(1049307074))
    AwardItemLot(1049305971);
    if (EventFlag(1049307075))
    AwardItemLot(1049305973);
    if (EventFlag(1049307076))
    AwardItemLot(1049305975);
    if (EventFlag(1049307078))
    AwardItemLot(1049305979);
    if (EventFlag(1049307079))
    AwardItemLot(1049305984);
    if (EventFlag(1049307080))
    AwardItemLot(1049305986);
    if (EventFlag(1049307081))
    AwardItemLot(1049305988);
    if (EventFlag(1049307082))
    AwardItemLot(1049305990);
    if (EventFlag(1049307083))
    AwardItemLot(1049305995);
    if (EventFlag(1049307084))
    AwardItemLot(1049305997);
    if (EventFlag(1049307085))
    AwardItemLot(1049305999);
    if (EventFlag(1049307086))
    AwardItemLot(1049306001);
    if (EventFlag(1049307087))
    AwardItemLot(1049306006);
    if (EventFlag(1049307088))
    AwardItemLot(1049306008);
    if (EventFlag(1049307089))
    AwardItemLot(1049306011);
    if (EventFlag(1049307090))
    AwardItemLot(1049306016);
    if (EventFlag(1049307091))
    AwardItemLot(1049306018);
    if (EventFlag(1049307092))
    AwardItemLot(1049306021);
    if (EventFlag(1049307093))
    AwardItemLot(1049306023);
    if (EventFlag(1049307094))
    AwardItemLot(1049306028);
    if (EventFlag(1049307095))
    AwardItemLot(1049306030);
    if (EventFlag(1049307097))
    AwardItemLot(1049306034);
    if (EventFlag(1049307098))
    AwardItemLot(1049306036);
    if (EventFlag(1049307099))
    AwardItemLot(1049306038);
    if (EventFlag(1049307101))
    AwardItemLot(1049306042);
    if (EventFlag(1049307102))
    AwardItemLot(1049306044);
    if (EventFlag(1049307103))
    AwardItemLot(1049306046);
    if (EventFlag(1049307104))
    AwardItemLot(1049306048);
    if (EventFlag(1049307106))
    AwardItemLot(1049306052);
    if (EventFlag(1049307107))
    AwardItemLot(1049306054);
    if (EventFlag(1049307108))
    AwardItemLot(1049306059);
    if (EventFlag(1049307109))
    AwardItemLot(1049306064);
    if (EventFlag(1049307110))
    AwardItemLot(1049306066);
    if (EventFlag(1049307111))
    AwardItemLot(1049306068);
    if (EventFlag(1049307112))
    AwardItemLot(1049306071);
    if (EventFlag(1049307113))
    AwardItemLot(1049306073);
    if (EventFlag(1049307114))
    AwardItemLot(1049306078);
    if (EventFlag(1049307116))
    AwardItemLot(1049306084);
    if (EventFlag(1049307117))
    AwardItemLot(1049306086);
    if (EventFlag(1049307118))
    AwardItemLot(1049306091);
    if (EventFlag(1049307119))
    AwardItemLot(1049306093);
    if (EventFlag(1049307120))
    AwardItemLot(1049306095);
    if (EventFlag(1049307121))
    AwardItemLot(1049306098);
    if (EventFlag(1049307122))
    AwardItemLot(1049306100);
    if (EventFlag(1049307123))
    AwardItemLot(1049306102);
    if (EventFlag(1049307124))
    AwardItemLot(1049306107);
    if (EventFlag(1049307125))
    AwardItemLot(1049306109);
    if (EventFlag(1049307126))
    AwardItemLot(1049306111);
    if (EventFlag(1049307128))
    AwardItemLot(1049306116);
    if (EventFlag(1049307129))
    AwardItemLot(1049306118);
    if (EventFlag(1049307130))
    AwardItemLot(1049306120);
    if (EventFlag(1049307131))
    AwardItemLot(1049306122);
    if (EventFlag(1049307133))
    AwardItemLot(1049306128);
    if (EventFlag(1049307134))
    AwardItemLot(1049306130);
    if (EventFlag(1049307135))
    AwardItemLot(1049306132);
    if (EventFlag(1049307136))
    AwardItemLot(1049306134);
    if (EventFlag(1049307137))
    AwardItemLot(1049306136);
    if (EventFlag(1049307138))
    AwardItemLot(1049306138);
    if (EventFlag(1049307139))
    AwardItemLot(1049306142);
    if (EventFlag(1049307140))
    AwardItemLot(1049306144);
    if (EventFlag(1049307142))
    AwardItemLot(1049306149);
    if (EventFlag(1049307143))
    AwardItemLot(1049306151);
    if (EventFlag(1049307144))
    AwardItemLot(1049306156);
    if (EventFlag(1049307145))
    AwardItemLot(1049306158);
    if (EventFlag(1049307146))
    AwardItemLot(1049306160);
    if (EventFlag(1049307147))
    AwardItemLot(1049306166);
    if (EventFlag(1049307148))
    AwardItemLot(1049306168);
    if (EventFlag(1049307149))
    AwardItemLot(1049306170);
    if (EventFlag(1049307150))
    AwardItemLot(1049306172);
    if (EventFlag(1049307151))
    AwardItemLot(1049306174);
    if (EventFlag(1049307152))
    AwardItemLot(1049306176);
    if (EventFlag(1049307153))
    AwardItemLot(1049306178);
    if (EventFlag(1049307154))
    AwardItemLot(1049306181);
    if (EventFlag(1049307155))
    AwardItemLot(1049306187);
    if (EventFlag(1049307156))
    AwardItemLot(1049306189);
    if (EventFlag(1049307157))
    AwardItemLot(1049306191);
    if (EventFlag(1049307158))
    AwardItemLot(1049306195);
    if (EventFlag(1049307159))
    AwardItemLot(1049306200);
    if (EventFlag(1049307160))
    AwardItemLot(1049306202);
    if (EventFlag(1049307162))
    AwardItemLot(1049306206);
    if (EventFlag(1049307163))
    AwardItemLot(1049306209);
    if (EventFlag(1049307164))
    AwardItemLot(1049306214);
    if (EventFlag(1049307165))
    AwardItemLot(1049306216);
    if (EventFlag(1049307167))
    AwardItemLot(1049306224);
    if (EventFlag(1049307168))
    AwardItemLot(1049306226);
    if (EventFlag(1049307169))
    AwardItemLot(1049306228);
    if (EventFlag(1049307170))
    AwardItemLot(1049306232);
    if (EventFlag(1049307171))
    AwardItemLot(1049306235);
    if (EventFlag(1049307172))
    AwardItemLot(1049306237);
    if (EventFlag(1049307173))
    AwardItemLot(1049306240);
    if (EventFlag(1049307174))
    AwardItemLot(1049306242);
    if (EventFlag(1049307175))
    AwardItemLot(1049306244);
    if (EventFlag(1049307177))
    AwardItemLot(1049306252);
    if (EventFlag(1049307178))
    AwardItemLot(1049306254);
    if (EventFlag(1049307179))
    AwardItemLot(1049306257);
    if (EventFlag(1049307181))
    AwardItemLot(1049306262);
    if (EventFlag(1049307182))
    AwardItemLot(1049306264);
    if (EventFlag(1049307183))
    AwardItemLot(1049306266);
    if (EventFlag(1049307184))
    AwardItemLot(1049306268);
    if (EventFlag(1049307185))
    AwardItemLot(1049306271);
    if (EventFlag(1049307186))
    AwardItemLot(1049306273);
    if (EventFlag(1049307187))
    AwardItemLot(1049306278);
    if (EventFlag(1049307188))
    AwardItemLot(1049306280);
    if (EventFlag(1049307189))
    AwardItemLot(1049306282);
    if (EventFlag(1049307191))
    AwardItemLot(1049306286);
    if (EventFlag(1049307192))
    AwardItemLot(1049306289);
    if (EventFlag(1049307193))
    AwardItemLot(1049306294);
    if (EventFlag(1049307194))
    AwardItemLot(1049306296);
    if (EventFlag(1049307195))
    AwardItemLot(1049306298);
    if (EventFlag(1049307196))
    AwardItemLot(1049306301);
    if (EventFlag(1049307197))
    AwardItemLot(1049306306);
    if (EventFlag(1049307198))
    AwardItemLot(1049306308);
    if (EventFlag(1049307199))
    AwardItemLot(1049306310);
    if (EventFlag(1049307201))
    AwardItemLot(1049306315);
    if (EventFlag(1049307202))
    AwardItemLot(1049306320);
    if (EventFlag(1049307203))
    AwardItemLot(1049306322);
    if (EventFlag(1049307204))
    AwardItemLot(1049306324);
    if (EventFlag(1049307205))
    AwardItemLot(1049306326);
    if (EventFlag(1049307206))
    AwardItemLot(1049306328);
    if (EventFlag(1049307207))
    AwardItemLot(1049306331);
    if (EventFlag(1049307208))
    AwardItemLot(1049306333);
    if (EventFlag(1049307209))
    AwardItemLot(1049306335);
    if (EventFlag(1049307210))
    AwardItemLot(1049306338);
    if (EventFlag(1049307211))
    AwardItemLot(1049306340);
    if (EventFlag(1049307212))
    AwardItemLot(1049306343);
    if (EventFlag(1049307213))
    AwardItemLot(1049306348);
    if (EventFlag(1049307214))
    AwardItemLot(1049306350);
    if (EventFlag(1049307215))
    AwardItemLot(1049306352);
    if (EventFlag(1049307216))
    AwardItemLot(1049306354);
    if (EventFlag(1049307217))
    AwardItemLot(1049306356);
    if (EventFlag(1049307218))
    AwardItemLot(1049306358);
    if (EventFlag(1049307219))
    AwardItemLot(1049306362);
    if (EventFlag(1049307220))
    AwardItemLot(1049306367);
    if (EventFlag(1049307221))
    AwardItemLot(1049306369);
    if (EventFlag(1049307222))
    AwardItemLot(1049306371);
    if (EventFlag(1049307224))
    AwardItemLot(1049306375);
    if (EventFlag(1049307225))
    AwardItemLot(1049306379);
    if (EventFlag(1049307226))
    AwardItemLot(1049306384);
    if (EventFlag(1049307227))
    AwardItemLot(1049306386);
    if (EventFlag(1049307229))
    AwardItemLot(1049306390);
    if (EventFlag(1049307230))
    AwardItemLot(1049306393);
    if (EventFlag(1049307231))
    AwardItemLot(1049306395);
    if (EventFlag(1049307232))
    AwardItemLot(1049306401);
    if (EventFlag(1049307233))
    AwardItemLot(1049306403);
    if (EventFlag(1049307234))
    AwardItemLot(1049306406);
    if (EventFlag(1049307235))
    AwardItemLot(1049306408);
    if (EventFlag(1049307237))
    AwardItemLot(1049306413);
    if (EventFlag(1049307238))
    AwardItemLot(1049306417);
    if (EventFlag(1049307239))
    AwardItemLot(1049306422);
    if (EventFlag(1049307240))
    AwardItemLot(1049306424);
    if (EventFlag(1049307241))
    AwardItemLot(1049306426);
    if (EventFlag(1049307242))
    AwardItemLot(1049306428);
    if (EventFlag(1049307243))
    AwardItemLot(1049306430);
    if (EventFlag(1049307244))
    AwardItemLot(1049306433);
    if (EventFlag(1049307245))
    AwardItemLot(1049306436);
    if (EventFlag(1049307246))
    AwardItemLot(1049306438);
    if (EventFlag(1049307248))
    AwardItemLot(1049306446);
    if (EventFlag(1049307249))
    AwardItemLot(1049306449);
    if (EventFlag(1049307250))
    AwardItemLot(1049306451);
    if (EventFlag(1049307251))
    AwardItemLot(1049306453);
    if (EventFlag(1049307252))
    AwardItemLot(1049306456);
    if (EventFlag(1049307253))
    AwardItemLot(1049306458);
    if (EventFlag(1049307254))
    AwardItemLot(1049306460);
    if (EventFlag(1049307255))
    AwardItemLot(1049306466);
    if (EventFlag(1049307256))
    AwardItemLot(1049306468);
    if (EventFlag(1049307257))
    AwardItemLot(1049306470);
    if (EventFlag(1049307258))
    AwardItemLot(1049306472);
    if (EventFlag(1049307259))
    AwardItemLot(1049306476);
    if (EventFlag(1049307260))
    AwardItemLot(1049306478);
    if (EventFlag(1049307261))
    AwardItemLot(1049306480);
    if (EventFlag(1049307262))
    AwardItemLot(1049306485);
    if (EventFlag(1049307263))
    AwardItemLot(1049306487);
    if (EventFlag(1049307264))
    AwardItemLot(1049306489);
    if (EventFlag(1049307265))
    AwardItemLot(1049306492);
    if (EventFlag(1049307266))
    AwardItemLot(1049306494);
    if (EventFlag(1049307267))
    AwardItemLot(1049306496);
    if (EventFlag(1049307268))
    AwardItemLot(1049306501);
    if (EventFlag(1049307269))
    AwardItemLot(1049306503);
    if (EventFlag(1049307270))
    AwardItemLot(1049306505);
    if (EventFlag(1049307271))
    AwardItemLot(1049306507);
    if (EventFlag(1049307272))
    AwardItemLot(1049306509);
    if (EventFlag(1049307273))
    AwardItemLot(1049306511);
    if (EventFlag(1049307274))
    AwardItemLot(1049306513);
    if (EventFlag(1049307275))
    AwardItemLot(1049306515);
    if (EventFlag(1049307276)) {
    AwardItemLot(1049306517);
    AwardItemLot(1049306721); //messmer soldier shield
}
    if (EventFlag(1049307277))
    AwardItemLot(1049306519);
    if (EventFlag(1049307279))
    AwardItemLot(1049306523);
    if (EventFlag(1049307280))
    AwardItemLot(1049306525);
    if (EventFlag(1049307281))
    AwardItemLot(1049306527);
    if (EventFlag(1049307282))
    AwardItemLot(1049306530);
    if (EventFlag(1049307283))
    AwardItemLot(1049306532);
    if (EventFlag(1049307285))
    AwardItemLot(1049306536);
    if (EventFlag(1049307286))
    AwardItemLot(1049306538);
    if (EventFlag(1049307287))
    AwardItemLot(1049306540);
    if (EventFlag(1049307288))
    AwardItemLot(1049306542);
    if (EventFlag(1049307289))
    AwardItemLot(1049306544);
    if (EventFlag(1049307290))
    AwardItemLot(1049306546);
    if (EventFlag(1049307291))
    AwardItemLot(1049306548);
    if (EventFlag(1049307292))
    AwardItemLot(1049306553);
    if (EventFlag(1049307293))
    AwardItemLot(1049306555);
    if (EventFlag(1049307294))
    AwardItemLot(1049306557);
    if (EventFlag(1049307295))
    AwardItemLot(1049306575);
    if (EventFlag(1049307296))
    AwardItemLot(1049306561);
    if (EventFlag(1049307297))
    AwardItemLot(1049306566);
    if (EventFlag(1049307298))
    AwardItemLot(1049306568);
    if (EventFlag(1049307299))
    AwardItemLot(1049306570);
    if (EventFlag(1049307300))
    AwardItemLot(1049306572);
    if (EventFlag(1049307301)) //igon's finger
    AwardItemLot(1049306580);
    if (EventFlag(1049307302))
    AwardItemLot(1049306582);
    if (EventFlag(1049307303))
    AwardItemLot(1049306585);
    if (EventFlag(1049307304))
    AwardItemLot(1049306587);
    if (EventFlag(1049307306))
    AwardItemLot(1049306591);
    if (EventFlag(1049307307))
    AwardItemLot(1049306594);
    if (EventFlag(1049307308))
    AwardItemLot(1049306599);
    if (EventFlag(1049307309))
    AwardItemLot(1049306601);
    if (EventFlag(1049307310))
    AwardItemLot(1049306604);
    if (EventFlag(1049307311))
    AwardItemLot(1049306606);
    if (EventFlag(1049307312))
    AwardItemLot(1049306608);
    if (EventFlag(1049307313))
    AwardItemLot(1049306613);
    if (EventFlag(1049307314))
    AwardItemLot(1049306615);
    if (EventFlag(1049307315))
    AwardItemLot(1049306617);
    if (EventFlag(1049307316))
    AwardItemLot(1049306619);
    if (EventFlag(1049307317))
    AwardItemLot(1049306623);
    if (EventFlag(1049307318))
    AwardItemLot(1049306626);
    if (EventFlag(1049307319))
    AwardItemLot(1049306631);
    if (EventFlag(1049307320))
    AwardItemLot(1049306633);
    if (EventFlag(1049307321))
    AwardItemLot(1049306635);
    if (EventFlag(1049307322))
    AwardItemLot(1049306637);
    if (EventFlag(1049307323))
    AwardItemLot(1049306639);
    if (EventFlag(1049307324))
    AwardItemLot(1049306642);
    if (EventFlag(1049307325))
    AwardItemLot(1049306644);
    if (EventFlag(1049307326))
    AwardItemLot(1049306647);
    if (EventFlag(1049307327))
    AwardItemLot(1049306652);
    if (EventFlag(1049307328))
    AwardItemLot(1049306654);
    if (EventFlag(1049307329))
    AwardItemLot(1049306656);
    if (EventFlag(1049307330))
    AwardItemLot(1049306658);
    if (EventFlag(1049307332))
    AwardItemLot(1049306663);
    if (EventFlag(1049307333))
    AwardItemLot(1049306665);
    if (EventFlag(1049307334))
    AwardItemLot(1049306670);
    if (EventFlag(1049307335))
    AwardItemLot(1049306672);
    if (EventFlag(1049307336))
    AwardItemLot(1049306674);
    if (EventFlag(1049307337))
    AwardItemLot(1049306676);
    if (EventFlag(1049307339))
    AwardItemLot(1049306680);
    if (EventFlag(1049307340))
    AwardItemLot(1049306683);
    if (EventFlag(1049307341))
    AwardItemLot(1049306685);
    if (EventFlag(1049307342))
    AwardItemLot(1049306688);
    if (EventFlag(1049307343))
    AwardItemLot(1049306690);
    if (EventFlag(1049307344))
    AwardItemLot(1049306692);
    if (EventFlag(1049307345))
    AwardItemLot(1049306698);
    if (EventFlag(1049307346))
    AwardItemLot(1049306700);
    if (EventFlag(1049307347))
    AwardItemLot(1049306702);
    if (EventFlag(1049307348))
    AwardItemLot(1049306705);
    if (EventFlag(1049307349))
    AwardItemLot(1049306707);
    if (EventFlag(1049307350))
    AwardItemLot(1049306710);
    if (EventFlag(1049307351))
    AwardItemLot(1049306715);
    if (EventFlag(1049307352))
    AwardItemLot(1049306717);
    if (EventFlag(1049307353))
    AwardItemLot(1049306719);
});

//evaluate award flags: tiered talismans 1
$Event(90001054, Default, function() {
    if (EventFlag(1049304404) || EventFlag(1049304948) || EventFlag(1049307020) || EventFlag(1049307236)) //Flamedrake Talisman
        $InitializeCommonEvent(0, 90001094, 1049304404, 1049304948, 1049307020, 1049307236, 1049304212, 1049305638, 1049305821, 1049306411, 1049307800, 1049307801, 1049307802, 1049307803);
    if (EventFlag(1049304443) || EventFlag(1049304926)) //Prince of Death's Pustule
        $InitializeCommonEvent(0, 90001092, 1049304443, 1049304926, 1049304303, 1049305581, 1049307804, 1049307805);
    if (EventFlag(1049304448) || EventFlag(1049304732) || EventFlag(1049307127)) //Arsenal Charm
        $InitializeCommonEvent(0, 90001093, 1049304448, 1049304732, 1049307127, 1049304314, 1049305061, 1049306114, 1049307806, 1049307807, 1049307808);
    if (EventFlag(1049304451) || EventFlag(1049304896) || EventFlag(1049307096) || EventFlag(1049307284)) //Viridian Amber Medallion
        $InitializeCommonEvent(0, 90001094, 1049304451, 1049304896, 1049307096, 1049307284, 1049304321, 1049305500, 1049306032, 1049306534, 1049307809, 1049307810, 1049307811, 1049307812);
    if (EventFlag(1049304455) || EventFlag(1049304796) || EventFlag(1049307050) || EventFlag(1049307228)) //Spelldrake Talisman
        $InitializeCommonEvent(0, 90001094, 1049304455, 1049304796, 1049307050, 1049307228, 1049304330, 1049305232, 1049305902, 1049306388, 1049307813, 1049307814, 1049307815, 1049307816);
    if (EventFlag(1049304460) || EventFlag(1049304724) || EventFlag(1049307062) || EventFlag(1049307338)) //Boltdrake Talisman
        $InitializeCommonEvent(0, 90001094, 1049304460, 1049304724, 1049307062, 1049307338, 1049304342, 1049305039, 1049305934, 1049306678, 1049307817, 1049307818, 1049307819, 1049307820);
    if (EventFlag(1049304473) || EventFlag(1049304657) || EventFlag(1049307053) || EventFlag(1049307105)) //Dragoncrest Shield Talisman
        $InitializeCommonEvent(0, 90001094, 1049304473, 1049304657, 1049307053, 1049307105, 1049304377, 1049304865, 1049305909, 1049306050, 1049307821, 1049307822, 1049307823, 1049307824);
    if (EventFlag(1049304491) || EventFlag(1049304884) || EventFlag(1049307058) || EventFlag(1049307305)) //Haligdrake Talisman
        $InitializeCommonEvent(0, 90001094, 1049304491, 1049304884, 1049307058, 1049307305, 1049304421, 1049305468, 1049305925, 1049306589, 1049307825, 1049307826, 1049307827, 1049307828);
    if (EventFlag(1049304494) || EventFlag(1049304858)) //Radagon's Scarseal
        $InitializeCommonEvent(0, 90001092, 1049304494, 1049304858, 1049304427, 1049305401, 1049307829, 1049307830);
    if (EventFlag(1049304500) || EventFlag(1049304920) || EventFlag(1049307190)) //Clarifying Horn Charm
        $InitializeCommonEvent(0, 90001093, 1049304500, 1049304920, 1049307190, 1049304444, 1049305566, 1049306284, 1049307831, 1049307832, 1049307833);
    if (EventFlag(1049304509) || EventFlag(1049304818) || EventFlag(1049307029) || EventFlag(1049307141)) //Crimson Amber Medallion
        $InitializeCommonEvent(0, 90001094, 1049304509, 1049304818, 1049307029, 1049307141, 1049304468, 1049305290, 1049305844, 1049306146, 1049307834, 1049307835, 1049307836, 1049307837);
    if (EventFlag(1049304518) || EventFlag(1049304933) || EventFlag(1049307166)) //Mottled Necklace
        $InitializeCommonEvent(0, 90001093, 1049304518, 1049304933, 1049307166, 1049304488, 1049305599, 1049306222, 1049307838, 1049307839, 1049307840);
});

//evaluate award flags: tiered talismans 2
$Event(90001055, Default, function() {
    if (EventFlag(1049304532) || EventFlag(1049304842) || EventFlag(1049307077) || EventFlag(1049307223)) //Pearldrake Talisman
        $InitializeCommonEvent(0, 90001094, 1049304532, 1049304842, 1049307077, 1049307223, 1049304527, 1049305353, 1049305977, 1049306373, 1049307841, 1049307842, 1049307843, 1049307844);
    if (EventFlag(1049304545) || EventFlag(1049304993) || EventFlag(1049307132) || EventFlag(1049307180)) //Cerulean Amber Medallion
        $InitializeCommonEvent(0, 90001094, 1049304545, 1049304993, 1049307132, 1049307180, 1049304561, 1049305756, 1049306126, 1049306259, 1049307845, 1049307846, 1049307847, 1049307848);
    if (EventFlag(1049304554) || EventFlag(1049307115)) //Winged Sword Insignia
        $InitializeCommonEvent(0, 90001092, 1049304554, 1049307115, 1049304586, 1049306082, 1049307849, 1049307850);
    if (EventFlag(1049304560) || EventFlag(1049307037) || EventFlag(1049307161)) //Stalwart Horn Charm
        $InitializeCommonEvent(0, 90001093, 1049304560, 1049307037, 1049307161, 1049304601, 1049305863, 1049306204, 1049307851, 1049307852, 1049307853);
    if (EventFlag(1049304574) || EventFlag(1049307100)) //Graven-School Talisman
        $InitializeCommonEvent(0, 90001092, 1049304574, 1049307100, 1049304635, 1049306040, 1049307854, 1049307855);
    if (EventFlag(1049304583) || EventFlag(1049304980) || EventFlag(1049307067)) //Erdtree's Favor
        $InitializeCommonEvent(0, 90001093, 1049304583, 1049304980, 1049307067, 1049304671, 1049305720, 1049305948, 1049307856, 1049307857, 1049307858);
    if (EventFlag(1049304611) || EventFlag(1049304968) || EventFlag(1049307331)) //Immunizing Horn Charm
        $InitializeCommonEvent(0, 90001093, 1049304611, 1049304968, 1049307331, 1049304744, 1049305695, 1049306661, 1049307859, 1049307860, 1049307861);
    if (EventFlag(1049304626) || EventFlag(1049307010)) //Warrior Jar Shard
        $InitializeCommonEvent(0, 90001092, 1049304626, 1049307010, 1049304784, 1049305796, 1049307862, 1049307863);
    if (EventFlag(1049304636) || EventFlag(1049307072)) //Faithful's Canvas Talisman
        $InitializeCommonEvent(0, 90001092, 1049304636, 1049307072, 1049304809, 1049305966, 1049307864, 1049307865);
    if (EventFlag(1049304677) || EventFlag(1049307278)) //Cerulean Seed Talisman
        $InitializeCommonEvent(0, 90001092, 1049304677, 1049307278, 1049304914, 1049306521, 1049307866, 1049307867);
    if (EventFlag(1049304888) || EventFlag(1049307045)) //Marika's Scarseal
        $InitializeCommonEvent(0, 90001092, 1049304888, 1049307045, 1049305480, 1049305885, 1049307868, 1049307869);
    if (EventFlag(1049304777) || EventFlag(1049307200)) //Arrow's Sting Talisman
        $InitializeCommonEvent(0, 90001092, 1049304777, 1049307200, 1049305179, 1049306313, 1049307870, 1049307871);
    if (EventFlag(1049304807) || EventFlag(1049307176)) //Crimson Seed Talisman
        $InitializeCommonEvent(0, 90001092, 1049304807, 1049307176, 1049305258, 1049306250, 1049307872, 1049307873);
    if (EventFlag(1049304487) || EventFlag(1049307247)) //Green Turtle Talisman
        $InitializeCommonEvent(0, 90001092, 1049304487, 1049307247, 1049304411, 1049306444, 1049307874, 1049307875);
});

// 【共通】特殊待機_領域判定 -- [Common] Special standby_Area judgment
$Event(90005200, Restart, function(chrEntityId, animationId, animationId2, areaEntityId, timeSeconds, value, value2, value3, value4) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    areaChrSp &= InArea(10000, areaEntityId)
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
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

// 【共通】特殊待機_距離判定 -- [Common] Special standby_Distance judgment
$Event(90005201, Restart, function(chrEntityId, animationId, animationId2, targetDistance, timeSeconds, value, value2, value3, value4) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
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

// 【共通】特殊待機_領域＋距離判定 -- [Common] Special standby_area + distance judgment
$Event(90005210, Restart, function(chrEntityId, animationId, animationId2, areaEntityId, targetDistance, timeSeconds, value, value2, value3, value4) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    areaChrSp &= InArea(10000, areaEntityId)
        && EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1)
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
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

// 【共通】特殊待機_領域／距離判定 -- [Common] Special standby_area/distance judgment
$Event(90005211, Restart, function(chrEntityId, animationId, animationId2, areaEntityId, targetDistance, timeSeconds, value, value2, value3, value4) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    if (0 != areaEntityId) {
        area |= InArea(10000, areaEntityId);
    }
    area |= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    areaChrSp &= area
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
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

// 【共通】特殊待機_領域／距離判定Ver2 -- [Common] Special standby_area/distance judgment Ver2
$Event(90005213, Restart, function(chrEntityId, animationId, animationId2, areaEntityId, targetDistance, timeSeconds, value, value2, value3, value4, chrEntityId2, timeSeconds2) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    if (0 != areaEntityId) {
        area |= InArea(10000, areaEntityId);
    }
    cond = SpecialStandbyEndedFlag(chrEntityId2);
    area |= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1) || cond;
    areaChrSp &= area
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        if (!cond.Passed) {
            WaitFixedTimeSeconds(timeSeconds);
        } else {
            WaitFixedTimeSeconds(timeSeconds2);
        }
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

// 【共通】特殊待機_戦闘状態判定 -- [Common] Special standby_Combat status determination
$Event(90005220, Restart, function(chrEntityId, animationId, animationId2, timeSeconds, value, value2, value3) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp &= CharacterBackreadStatus(chrEntityId)
        && (CharacterHasSpEffect(chrEntityId, 5080) || CharacterHasSpEffect(chrEntityId, 5450));
    chr |= CharacterAIState(chrEntityId, AIStateType.Combat);
    if (value2 != 0) {
        chr |= CharacterAIState(chrEntityId, AIStateType.ActiveAlert);
    }
    if (value3 != 0) {
        chr |= CharacterAIState(chrEntityId, AIStateType.PassiveAlert);
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
    chrSp &= chr && cond;
    WaitFor(
        chrSp
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
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

// 【共通】特殊待機_ダメージ判定 -- [Common] Special standby_Damage judgment
$Event(90005221, Restart, function(chrEntityId, animationId, animationId2, timeSeconds, value) {
    EndIf(SpecialStandbyEndedFlag(chrEntityId));
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || (CharacterHasSpEffect(chrEntityId, 481)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90110)
                && !CharacterHasSpEffect(chrEntityId, 90160))
            || (CharacterHasSpEffect(chrEntityId, 482)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90120)
                && !CharacterHasSpEffect(chrEntityId, 90160)
                && !CharacterHasSpEffect(chrEntityId, 90162))
            || (CharacterHasSpEffect(chrEntityId, 483)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90140)
                && !CharacterHasSpEffect(chrEntityId, 90160)
                && !CharacterHasSpEffect(chrEntityId, 90161))
            || (CharacterHasSpEffect(chrEntityId, 484)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90130)
                && !CharacterHasSpEffect(chrEntityId, 90161)
                && !CharacterHasSpEffect(chrEntityId, 90162))
            || (CharacterHasSpEffect(chrEntityId, 487)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90150)
                && !CharacterHasSpEffect(chrEntityId, 90160)));
    WaitFixedTimeSeconds(0.1);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        SetNetworkconnectedThisEventSlot(ON);
        SetSpecialStandbyEndedFlag(chrEntityId, ON);
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

// 【共通】思考ロジック有効化_領域判定 -- [Common] Enabling thinking logic_Area determination
$Event(90005250, Restart, function(chrEntityId, areaEntityId, timeSeconds, animationId) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
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
    areaChrSp = InArea(10000, areaEntityId) && chrSp;
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaChrSp
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
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

// 【共通】思考ロジック有効化_距離判定 -- [Common] Enabling thought logic_Distance judgment
$Event(90005251, Restart, function(chrEntityId, targetDistance, timeSeconds, animationId) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
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
    areaChrSp = EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1) && chrSp;
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaChrSp
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
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

// 【共通】思考ロジック有効化_領域＋距離判定 -- [Common] Enabling thinking logic_Area + Distance Judgment
$Event(90005260, Restart, function(chrEntityId, areaEntityId, targetDistance, timeSeconds, animationId) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    area = InArea(10000, areaEntityId) && EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
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
    areaChrSp = area && chrSp;
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaChrSp
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
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

// 【共通】思考ロジック有効化_領域／距離判定 -- [Common] Enabling thinking logic_area/distance judgment
$Event(90005261, Restart, function(chrEntityId, areaEntityId, targetDistance, timeSeconds, animationId) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
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
    area = InArea(10000, areaEntityId) || EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    areaChrSp = area && chrSp;
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaChrSp
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
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

$Event(90005263, Restart, function(chrEntityId, areaEntityId, targetDistance, timeSeconds, animationId, areaEntityId2) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
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
    area |= InArea(10000, areaEntityId);
    if (areaEntityId2 != 0) {
        area |= InArea(10000, areaEntityId2);
    }
    area |= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    areaChrSp = area && chrSp;
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || areaChrSp
            || sp
            || sp2
            || sp3
            || sp4
            || sp5);
    SetNetworkconnectedThisEventSlot(ON);
    if (areaChrSp.Passed) {
        WaitFixedTimeSeconds(timeSeconds);
        area |= InArea(10000, areaEntityId);
        if (area) {
            ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
        }
    }
L1:
    EnableCharacterAI(chrEntityId);
});

// 【共通】思考ロジック有効化_ダメージ判定 -- [Common] Activate thought logic_Damage judgment
$Event(90005271, Restart, function(chrEntityId, timeSeconds, animationId) {
    EndIf(ThisEventSlot());
    DisableCharacterAI(chrEntityId);
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasStateInfo(chrEntityId, 436)
            || CharacterHasStateInfo(chrEntityId, 2)
            || CharacterHasStateInfo(chrEntityId, 5)
            || CharacterHasStateInfo(chrEntityId, 6)
            || CharacterHasStateInfo(chrEntityId, 260)
            || (CharacterHasSpEffect(chrEntityId, 481)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90110)
                && !CharacterHasSpEffect(chrEntityId, 90160))
            || (CharacterHasSpEffect(chrEntityId, 482)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90120)
                && !CharacterHasSpEffect(chrEntityId, 90160)
                && !CharacterHasSpEffect(chrEntityId, 90162))
            || (CharacterHasSpEffect(chrEntityId, 483)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90140)
                && !CharacterHasSpEffect(chrEntityId, 90160)
                && !CharacterHasSpEffect(chrEntityId, 90161))
            || (CharacterHasSpEffect(chrEntityId, 484)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90130)
                && !CharacterHasSpEffect(chrEntityId, 90161)
                && !CharacterHasSpEffect(chrEntityId, 90162))
            || (CharacterHasSpEffect(chrEntityId, 487)
                && !CharacterHasSpEffect(chrEntityId, 90100)
                && !CharacterHasSpEffect(chrEntityId, 90150)
                && !CharacterHasSpEffect(chrEntityId, 90160)));
    SetNetworkconnectedThisEventSlot(ON);
    if (and1.Passed) {
        WaitFixedTimeSeconds(timeSeconds);
        if (Signed(animationId) != -1) {
            ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
        }
    }
L1:
    EnableCharacterAI(chrEntityId);
});

// 【共通】強敵リスポン処理 -- [Common] Strong enemy respawn processing
$Event(90005300, Restart, function(eventFlagId, chrEntityId, itemLotId, timeSeconds, value) {
    if (EventFlag(eventFlagId)) {
        if (Signed(value) != 0) {
            DisableCharacter(chrEntityId);
            ForceCharacterTreasure(chrEntityId);
            EndEvent();
        }
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndEvent();
    }
L0:
    WaitFor(CharacterRatioDead(chrEntityId));
    WaitFixedTimeSeconds(timeSeconds);
    SetEventFlagID(eventFlagId, ON);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(Signed(value) == 1);
    EndIf(Signed(itemLotId) == 0);
    AwardItemsIncludingClients(itemLotId);
    EndEvent();
});

//DLC generic boss event
$Event(90005301, Restart, function(eventFlagId, chrEntityId, itemLotId, timeSeconds, value) {
    if (EventFlag(eventFlagId)) {
        if (SignedAlt(value) != 0) {
            DisableCharacter(chrEntityId);
            ForceCharacterTreasure(chrEntityId);
            EndEvent();
        }
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndEvent();
    }
L0:
    WaitFor(EventFlag(6000)); //infinite wait
    WaitFor(CharacterRatioDead(chrEntityId));
    WaitFixedTimeSeconds(timeSeconds);
    SetEventFlagID(eventFlagId, ON);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(SignedAlt(value) == 1);
    EndIf(SignedAlt(itemLotId) == 0);
    AwardItemsIncludingClients(itemLotId);
    EndEvent();
});

// 【共通】制圧リスポン処理 -- [Common] Suppression response processing
$Event(90005360, Restart, function(eventFlagId, chrEntityId, itemLotId) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        EndEvent();
    }
L0:
    WaitFor(EventFlag(eventFlagId));
    DisplayBanner(TextBannerType.Unknown14);
    EndIf(!PlayerIsInOwnWorld());
    AwardItemsIncludingClients(itemLotId);
});

// 【共通】変身スライム_撃破 -- [Common] Transformation slime_defeat
$Event(90005390, Restart, function(eventFlagId, eventFlagId2, entityId, chrEntityId, value, itemLotId) {
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId2) && CharacterDead(chrEntityId));
    WaitFixedTimeSeconds(1);
    if (Signed(value) != 0) {
        SpawnOneshotSFX(TargetEntityType.Character, entityId, 960, 601111);
    } else {
L2:
        SpawnOneshotSFX(TargetEntityType.Character, entityId, 960, 601110);
    }
L3:
    WaitFixedTimeSeconds(3);
    DisableCharacter(chrEntityId);
    EndIf(!PlayerIsInOwnWorld());
    if (Signed(itemLotId) != 0) {
        AwardItemsIncludingClients(itemLotId);
    }
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
});

// 【共通】変身スライム_変身 -- [Common] Transformation slime_Transformation
$Event(90005391, Restart, function(eventFlagId, eventFlagId2, chrEntityId, chrEntityId2, value) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        DisableCharacter(chrEntityId2);
        DisableCharacterCollision(chrEntityId2);
        EndEvent();
    }
L0:
    if (EventFlag(eventFlagId2)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        EndEvent();
    }
L1:
    DisableCharacter(chrEntityId2);
    DisableCharacterCollision(chrEntityId2);
    DisableCharacterGravity(chrEntityId2);
    DisableCharacterAI(chrEntityId2);
    EnableCharacterFadeOnEnable(chrEntityId2);
    WaitFor(CharacterDead(chrEntityId));
    EnableCharacterDefaultBackread(chrEntityId);
    EnableCharacterDefaultBackread(chrEntityId2);
    WaitFixedTimeSeconds(0.5);
    WarpCharacterAndCopyFloor(chrEntityId2, TargetEntityType.Character, chrEntityId, 900, chrEntityId);
    WaitFixedTimeSeconds(0.5);
    if (Signed(value) != 0) {
        SpawnOneshotSFX(TargetEntityType.Character, chrEntityId, 900, 601101);
    } else {
L2:
        SpawnOneshotSFX(TargetEntityType.Character, chrEntityId, 900, 601100);
    }
L3:
    EnableCharacter(chrEntityId2);
    EnableCharacterGravity(chrEntityId2);
    EnableCharacterCollision(chrEntityId2);
    EnableCharacterAI(chrEntityId2);
    DisableCharacter(chrEntityId);
    DisableCharacterDefaultBackread(chrEntityId);
    DisableCharacterDefaultBackread(chrEntityId2);
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId2, ON);
    }
});

// 【共通】ネムリコレクト_ネムリ待機 -- [Common] Nemuri collect_Nemuri standby
$Event(90005400, Restart, function(chrEntityId, spEffectId, timeSeconds, timeSeconds2, value) {
    EndIf(ThisEventSlot());
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    if (Signed(spEffectId) != 0) {
        SetSpEffect(chrEntityId, spEffectId);
    } else {
        SetSpEffect(chrEntityId, 4421);
    }
    ForceAnimationPlayback(chrEntityId, 14100, true, false, false);
    WaitFor(
        HasDamageType(chrEntityId, 0, DamageType.Unspecified)
            || CharacterHasSpEffect(chrEntityId, 5112));
    WaitFixedTimeFrames(1);
    if (CharacterHasSpEffect(chrEntityId, 5111)) {
        SetNetworkconnectedThisEventSlot(ON);
        if (!CharacterHasSpEffect(chrEntityId, 5112)) {
            WaitFixedTimeSeconds(timeSeconds2);
        } else {
            WaitFixedTimeSeconds(timeSeconds);
        }
        if (value != 0) {
            EnableCharacterGravity(chrEntityId);
            SetCharacterMaphit(chrEntityId, true);
        }
        ForceAnimationPlayback(chrEntityId, 14102, true, false, false);
        EndEvent();
    }
L0:
    if (value != 0) {
        EnableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, true);
    }
    EndEvent();
});

// 【共通】ネムリコレクト_ネムリ取得 -- [Common] Nemuri collect_Nemuri acquisition
$Event(90005401, Restart, function(eventFlagId, chrEntityId) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    SetSpEffect(chrEntityId, 4430);
    WaitFor(PlayerIsInOwnWorld() && CharacterHasSpEffect(chrEntityId, 4431));
    SetEventFlagID(eventFlagId, ON);
});

// 【共通】バディ召喚_撃破対象リスト設定 -- [Common] Buddy summon_defeat target list setting
$Event(90005410, Restart, function(eventFlagId, chrEntityId, chrEntityId2) {
    if (!EventFlag(eventFlagId)) {
        WaitFor(
            (PlayerIsInOwnWorld() && CharacterHasSpEffect(chrEntityId, 9500))
                || EventFlag(eventFlagId));
        if (PlayerIsInOwnWorld()) {
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
    }
L0:
    Unknown200471(0, 0, chrEntityId2);
    WaitFor((PlayerIsInOwnWorld() && CharacterHasSpEffect(20000, 202)) || !EventFlag(eventFlagId));
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    }
    RestartEvent();
});

// 【共通】バディ召喚_石碑SFX対応 -- [Common] Buddy summon_stone monument SFX compatible
$Event(90005411, Restart, function(assetEntityId, chrEntityId, value) {
    DisableNetworkSync();
    EndIf(!PlayerIsInOwnWorld());
    if (value == 0) {
        WaitFixedTimeFrames(1);
    }
    CreateAssetfollowingSFX(assetEntityId, 200, 620);
    WaitFor(CharacterHasSpEffect(chrEntityId, 9502));
    DeleteAssetfollowingSFX(assetEntityId, true);
    WaitFor(CharacterHasSpEffect(chrEntityId, 9503));
    RestartEvent();
});

// 【共通】馬車_初期設定 -- [Common] Horse carriage_Initial settings
$Event(90005420, Restart, function(chrEntityId, assetEntityId, assetEntityId2, chrEntityId2, chrEntityId3, chrEntityId4, timeSeconds) {
    DisableCharacterCollision(chrEntityId);
    AttachCaravanToController(assetEntityId, chrEntityId);
    AttachAssetToAsset(assetEntityId2, assetEntityId, 151);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
    SetNetworkUpdateRate(chrEntityId2, true, CharacterUpdateFrequency.AtLeastEvery5Frames);
    SetNetworkUpdateRate(chrEntityId3, true, CharacterUpdateFrequency.AlwaysUpdate);
    SetNetworkUpdateRate(chrEntityId4, true, CharacterUpdateFrequency.AlwaysUpdate);
    ConnectCharacterToCaravan(chrEntityId3, assetEntityId);
    ConnectCharacterToCaravan(chrEntityId4, assetEntityId);
    EndEvent();
    WaitFixedTimeSeconds(timeSeconds);
});

// 【共通】馬車_宝扉制御 -- [Common] Carriage_Treasure door control
$Event(90005421, Restart, function(eventFlagId, assetEntityId, eventFlagId2) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId2));
    DisableObjAct(assetEntityId, -1);
    WaitFor(CharacterHasSpEffect(eventFlagId, 11500) && !EventFlag(eventFlagId));
    EnableObjAct(assetEntityId, -1);
    WaitFor(!CharacterHasSpEffect(eventFlagId, 11500));
    RestartEvent();
});

// 【共通】馬車_宝入手 -- [Common] Carriage_Treasure acquisition
$Event(90005422, Restart, function(eventFlagId, assetEntityId, objactEventFlag) {
    if (EventFlag(eventFlagId)) {
        EnableAssetTreasure(assetEntityId);
        EndEvent();
    }
L0:
    DisableAssetTreasure(assetEntityId);
    WaitFor(
        (PlayerIsInOwnWorld() && ObjActEventFlag(objactEventFlag))
            || AssetDestroyed(assetEntityId, Equal, 1));
    WaitFixedTimeSeconds(3.2);
    EnableAssetTreasure(assetEntityId);
});

// 【共通】馬車_牽引解除_XX -- [Common] Horse carriage_traction release_XX
$Event(90005423, Restart, function(chrEntityId) {
    WaitFor(CharacterHasSpEffect(chrEntityId, 5551));
    ConnectCharacterToCaravan(chrEntityId, 0);
    ChangeCharactersCloth(chrEntityId, 20, 2);
});

// 【共通】馬車_破壊挙動 -- [Common] Horse carriage_destruction behavior
$Event(90005424, Restart, function(assetEntityId, chrEntityId, chrEntityId2, chrEntityId3, assetEntityId2) {
    WaitFor(AssetDestroyed(assetEntityId, Equal, 1));
    ChangeCharactersCloth(chrEntityId, 20, 2);
    ChangeCharactersCloth(chrEntityId2, 20, 2);
    SetSpEffect(chrEntityId, 5551);
    SetSpEffect(chrEntityId2, 5551);
    ForceCharacterDeath(chrEntityId3, true);
    DisableAsset(assetEntityId2);
    DisableObjAct(assetEntityId2, -1);
    EnableAssetTreasure(assetEntityId);
});

$Event(90005430, Restart, function(chrEntityId) {
    EnableCharacterDefaultBackread(chrEntityId);
    SetCharacterEnableDistance(chrEntityId, 2000);
    DisableCharacterDisableOnHitUnload(chrEntityId);
    EnableDistancebasedNetworkUpdateAuthority(chrEntityId);
    DisableLockOnPoint(chrEntityId, 223);
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 560, 1, 1, false, false);
    CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 560, 1, 1, false, false);
    SetNetworkconnectedThisEventSlot(ON);
    EndEvent();
});

$Event(90005431, Restart, function(chrEntityId) {
    EnableCharacterDefaultBackread(chrEntityId);
    SetCharacterEnableDistance(chrEntityId, 2000);
    DisableCharacterDisableOnHitUnload(chrEntityId);
    EnableDistancebasedNetworkUpdateAuthority(chrEntityId);
    DisableLockOnPoint(chrEntityId, 221);
    DisableLockOnPoint(chrEntityId, 222);
    if (!ThisEventSlot()) {
        CreateNPCPart(chrEntityId, 30, NPCPartType.Part1, 99999, 1, 1, false, false);
    }
    SetNPCPartSEAndSFX(chrEntityId, 30, -1, 120, -1, 120, 112);
    SetNetworkconnectedThisEventSlot(ON);
    EndEvent();
});

$Event(90005432, Restart, function(chrEntityId, eventFlagId) {
    if (!EventFlag(eventFlagId)) {
        DisableCharacterGravity(chrEntityId);
        SetSpEffect(chrEntityId, 5005);
        RequestCharacterAIReplan(chrEntityId);
        WaitFixedTimeRealFrames(1);
        if (!CharacterHasSpEffect(chrEntityId, 19627)) {
            ForceAnimationPlayback(chrEntityId, 30010, true, false, false);
        }
        WaitFor(EntityInRadiusOfEntity(chrEntityId, 10000, 200, 1) || EventFlag(eventFlagId));
        if (!CharacterHasSpEffect(chrEntityId, 19627)) {
            ForceAnimationPlayback(chrEntityId, 20010, true, false, false);
        }
    }
L0:
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    EnableCharacterGravity(chrEntityId);
    SetSpEffect(chrEntityId, 5006);
    RequestCharacterAIReplan(chrEntityId);
L1:
    WaitFor(
        (!EntityInRadiusOfEntity(chrEntityId, 10000, 220, 1)
            && !EntityInRadiusOfEntity(chrEntityId, 10001, 220, 1)
            && !EntityInRadiusOfEntity(chrEntityId, 10002, 220, 1)
            && !EntityInRadiusOfEntity(chrEntityId, 10003, 220, 1)
            && !EntityInRadiusOfEntity(chrEntityId, 10004, 220, 1)
            && !EntityInRadiusOfEntity(chrEntityId, 10005, 220, 1))
            || !EventFlag(eventFlagId));
    SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    RestartEvent();
});

$Event(90005433, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3) {
    WaitFixedTimeRealFrames(1);
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && (NPCPartHP(chrEntityId, 30) <= 0 || CharacterHasSpEffect(chrEntityId, 20011126)));
    if (!CharacterHasSpEffect(chrEntityId, 20011126)) {
        if (NPCPartHP(chrEntityId, 30) <= 0) {
            if (!EventFlag(eventFlagId3)) {
                if (!EventFlag(eventFlagId2)) {
                    if (!EventFlag(eventFlagId)) {
L0:
                        SetNetworkconnectedEventFlagID(eventFlagId, ON);
                        ForceAnimationPlayback(chrEntityId, 20003, false, true, false);
                        CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 560, 1, 1, false, false);
                        WaitFixedTimeSeconds(1);
                        RestartEvent();
                    }
L1:
                    SetNetworkconnectedEventFlagID(eventFlagId2, ON);
                    ForceAnimationPlayback(chrEntityId, 20003, false, true, false);
                    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 560, 1, 1, false, false);
                    WaitFixedTimeSeconds(1);
                    RestartEvent();
                }
L2:
                SetNetworkconnectedEventFlagID(eventFlagId3, ON);
                CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 560, 1, 1, false, false);
                WaitFixedTimeSeconds(0.1);
                RestartEvent();
            }
L3:
            ForceAnimationPlayback(chrEntityId, 20000, false, true, false);
            CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 560, 1, 1, false, false);
            SetNetworkconnectedEventFlagID(eventFlagId, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
            WaitFixedTimeSeconds(1);
            RestartEvent();
        }
    }
L4:
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 9999, 1, 1, false, false);
    WaitFor(!CharacterHasSpEffect(chrEntityId, 20011126));
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 560, 1, 1, false, false);
    RestartEvent();
});

$Event(90005434, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3) {
    WaitFixedTimeRealFrames(1);
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && (NPCPartHP(chrEntityId, 31) <= 0 || CharacterHasSpEffect(chrEntityId, 20011126)));
    if (!CharacterHasSpEffect(chrEntityId, 20011126)) {
        if (NPCPartHP(chrEntityId, 31) <= 0) {
            if (!EventFlag(eventFlagId3)) {
                if (!EventFlag(eventFlagId2)) {
                    if (!EventFlag(eventFlagId)) {
L0:
                        SetNetworkconnectedEventFlagID(eventFlagId, ON);
                        ForceAnimationPlayback(chrEntityId, 20005, false, true, false);
                        CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 560, 1, 1, false, false);
                        WaitFixedTimeSeconds(1);
                        RestartEvent();
                    }
L1:
                    SetNetworkconnectedEventFlagID(eventFlagId2, ON);
                    ForceAnimationPlayback(chrEntityId, 20005, false, true, false);
                    CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 560, 1, 1, false, false);
                    WaitFixedTimeSeconds(1);
                    RestartEvent();
                }
L2:
                SetNetworkconnectedEventFlagID(eventFlagId3, ON);
                CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 560, 1, 1, false, false);
                WaitFixedTimeSeconds(0.1);
                RestartEvent();
            }
L3:
            ForceAnimationPlayback(chrEntityId, 20001, false, true, false);
            CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 560, 1, 1, false, false);
            SetNetworkconnectedEventFlagID(eventFlagId, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
            WaitFixedTimeSeconds(1);
            RestartEvent();
        }
    }
L4:
    CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 9999, 1, 1, false, false);
    WaitFor(!CharacterHasSpEffect(chrEntityId, 20011126));
    CreateNPCPart(chrEntityId, 31, NPCPartType.Part4, 560, 1, 1, false, false);
    RestartEvent();
});

$Event(90005435, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4) {
    WaitFor(CharacterBackreadStatus(chrEntityId) && CharacterHasSpEffect(chrEntityId, 20011113));
    if (!EventFlag(eventFlagId4)) {
        if (!EventFlag(eventFlagId3)) {
            if (!EventFlag(eventFlagId2)) {
                if (!EventFlag(eventFlagId)) {
L0:
                    SetNetworkconnectedEventFlagID(eventFlagId, ON);
                    WaitFixedTimeRealFrames(1);
                    RestartEvent();
                }
L1:
                SetNetworkconnectedEventFlagID(eventFlagId2, ON);
                ForceAnimationPlayback(chrEntityId, 20006, false, false, false);
                WaitFixedTimeRealFrames(1);
                RestartEvent();
            }
L2:
            SetNetworkconnectedEventFlagID(eventFlagId3, ON);
            WaitFixedTimeRealFrames(1);
            RestartEvent();
        }
L3:
        SetNetworkconnectedEventFlagID(eventFlagId4, ON);
        ForceAnimationPlayback(chrEntityId, 20006, false, false, false);
        WaitFixedTimeRealFrames(1);
        RestartEvent();
    }
L4:
    ForceAnimationPlayback(chrEntityId, 20009, false, true, false);
    SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
    SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
    SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
    WaitFixedTimeRealFrames(1);
    RestartEvent();
});

$Event(90005436, Restart, function(entityId, areaEntityId, areaEntityId2) {
    DisableNetworkSync();
    WaitFor(InArea(10000, areaEntityId) && InArea(entityId, areaEntityId2));
    SetSpEffect(10000, 20011132);
    WaitFor(!InArea(10000, areaEntityId) || !InArea(entityId, areaEntityId2));
    ClearSpEffect(10000, 20011132);
    RestartEvent();
});

$Event(90005437, Restart, function(chrEntityId, eventFlagId, eventFlagId2) {
    WaitFor(CharacterBackreadStatus(chrEntityId) && CharacterHasSpEffect(chrEntityId, 20011135));
    if (!EventFlag(eventFlagId2)) {
        if (!EventFlag(eventFlagId)) {
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
            ForceAnimationPlayback(chrEntityId, 20006, false, false, false);
            WaitFixedTimeRealFrames(1);
            RestartEvent();
        }
L2:
        SetNetworkconnectedEventFlagID(eventFlagId2, ON);
        ForceAnimationPlayback(chrEntityId, 20006, false, false, false);
        WaitFixedTimeRealFrames(1);
        RestartEvent();
    }
L3:
    ForceAnimationPlayback(chrEntityId, 20009, false, true, false);
    SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
    WaitFixedTimeRealFrames(1);
    RestartEvent();
});

// 【共通】黒き刃の末裔_ステルス -- [Common] Descendants of the Black Blade_Stealth
$Event(90005440, Default, function(eventFlagId, chrEntityId) {
    SetSpEffect(chrEntityId, 14500);
    DisableCharacterHPBarDisplay(chrEntityId);
    DisableLockOnPoint(eventFlagId, 220);
    WaitFor(
        PlayerIsInOwnWorld()
            && CharacterHasSpEffect(10000, 3245)
            && EntityInRadiusOfEntity(chrEntityId, 10000, 6, 1));
    SetEventFlagID(eventFlagId, ON);
L0:
    SetSpEffect(chrEntityId, 14501);
    SetSpEffect(chrEntityId, 14502);
    EnableCharacterHPBarDisplay(chrEntityId);
    EnableLockOnPoint(chrEntityId, 220);
    WaitFor(
        (!CharacterHasSpEffect(10000, 3245) || !EntityInRadiusOfEntity(chrEntityId, 10000, 6, 1))
            && !CharacterHasSpEffect(chrEntityId, 14503)
            && PlayerIsInOwnWorld());
    RestartEvent();
    RequestCharacterAICommand(0, 0, 0);
    EzstateInstructionRequest(0, 0, 0);
});

$Event(90005445, Restart, function(chrEntityId, animationId, animationId2, areaEntityId, timeSeconds, value, value2, value3, value4, assetEntityId) {
    if (AssetDestroyed(assetEntityId, Equal, 1)) {
        DisableAsset(assetEntityId);
        EndEvent();
    }
    if (SpecialStandbyEndedFlag(chrEntityId)) {
        DisableAsset(assetEntityId);
        EndEvent();
    }
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    EnableAssetInvunerability(assetEntityId);
    ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    chrSp = (CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
        || CharacterType(10000, TargetType.Alive)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.WhitePhantom);
    areaChrSp &= InArea(10000, areaEntityId)
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        WaitFixedTimeSeconds(timeSeconds);
        if (value != 0) {
            EnableCharacterGravity(chrEntityId);
            SetCharacterMaphit(chrEntityId, true);
        }
        DisableAssetInvunerability(assetEntityId);
        RequestAssetDestruction(assetEntityId, 1);
        ForceAnimationPlayback(chrEntityId, animationId2, true, false, false);
        EndEvent();
    }
L0:
    DisableAssetInvunerability(assetEntityId);
    RequestAssetDestruction(assetEntityId, 1);
    if (value != 0) {
        EnableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, true);
    }
    EndEvent();
});

$Event(90005446, Restart, function(chrEntityId, animationId, animationId2, targetDistance, timeSeconds, value, value2, value3, value4, assetEntityId) {
    if (AssetDestroyed(assetEntityId, Equal, 1)) {
        DisableAsset(assetEntityId);
        EndEvent();
    }
    if (SpecialStandbyEndedFlag(chrEntityId)) {
        DisableAsset(assetEntityId);
        EndEvent();
    }
    if (value != 0) {
        DisableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
    EnableAssetInvunerability(assetEntityId);
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
    SetNetworkconnectedThisEventSlot(ON);
    SetSpecialStandbyEndedFlag(chrEntityId, ON);
    if (!(!CharacterHasSpEffect(chrEntityId, 5080) && !CharacterHasSpEffect(chrEntityId, 5450))) {
        WaitFixedTimeSeconds(timeSeconds);
        if (value != 0) {
            EnableCharacterGravity(chrEntityId);
            SetCharacterMaphit(chrEntityId, true);
        }
        DisableAssetInvunerability(assetEntityId);
        RequestAssetDestruction(assetEntityId, 1);
        ForceAnimationPlayback(chrEntityId, animationId2, true, false, false);
        EndEvent();
    }
L0:
    DisableAssetInvunerability(assetEntityId);
    RequestAssetDestruction(assetEntityId, 1);
    if (value != 0) {
        EnableCharacterGravity(chrEntityId);
        SetCharacterMaphit(chrEntityId, true);
    }
    EndEvent();
});

// 【共通】歩く霊廟_初期設定 -- [Common] Walking Mausoleum_Initial Settings
$Event(90005450, Restart, function(chrEntityId, assetEntityId, assetEntityId2, assetEntityId3) {
    EnableCharacterDefaultBackread(chrEntityId);
    EnableCharacterImmortality(chrEntityId);
    SetCharacterEnableDistance(chrEntityId, 2000);
    DisableCharacterDisableOnHitUnload(chrEntityId);
    EnableDistancebasedNetworkUpdateAuthority(chrEntityId);
    DisableCharacterHPBarDisplay(chrEntityId);
    AttachAssetToCharacter(chrEntityId, 100, assetEntityId);
    AttachAssetToCharacter(chrEntityId, 80, assetEntityId2);
    AttachAssetToCharacter(chrEntityId, 165, assetEntityId3);
});

// 【共通】歩く霊廟_胡坐判定 -- [Common] Walking Mausoleum_Sitting with Crossed Legs Judgment
$Event(90005451, Restart, function(chrEntityId, assetEntityId) {
    if (!ThisEventSlot()) {
        WaitFor(AssetRatioDestroyed(DestructionState.Destroyed, assetEntityId) >= 0.45);
    }
L0:
    SetSpEffect(chrEntityId, 12450);
});

// 【共通】歩く霊廟_胡坐完了判定 -- [Common] Walking Mausoleum_Sitting with Crossed Crossed Completion Judgment
$Event(90005452, Restart, function(chrEntityId, eventFlagId) {
    EndIf(EventFlag(eventFlagId));
    WaitFor(CharacterHasSpEffect(chrEntityId, 12455));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
});

// 【共通】歩く霊廟_破壊素材対応 -- [Common] Walking Mausoleum_Destructible material compatible
$Event(90005453, Restart, function(assetEntityId, assetEntityId2, dummypolyId, timeSeconds) {
    EndIf(AssetDestroyed(assetEntityId2, Equal, 1));
    AttachAssetToCharacter(assetEntityId, dummypolyId, assetEntityId2);
    if (CharacterType(10000, TargetType.WhitePhantom)
        || CharacterType(10000, TargetType.GrayPhantom)
        || CharacterType(10000, TargetType.BluePhantom)
        || CharacterType(10000, TargetType.BlackPhantom)
        || CharacterType(10000, TargetType.Invader)
        || CharacterType(10000, TargetType.Invader2)
        || CharacterType(10000, TargetType.Invader3)) {
        EnableAssetInvunerability(assetEntityId2);
    }
L10:
    WaitFor(AssetDestroyed(assetEntityId, Equal, 1) || CharacterHasSpEffect(assetEntityId, 12460));
    EndIf(AssetDestroyed(assetEntityId2, Equal, 1));
    EnableAssetInvunerability(assetEntityId2);
    WaitFixedTimeSeconds(timeSeconds);
    RequestAssetDestruction(assetEntityId2, 0);
});

// 【共通】歩く霊廟_遠方待機 -- [Common] Walking Mausoleum_Long distance standby
$Event(90005454, Restart, function(chrEntityId, eventFlagId, eventFlagId2) {
    if (EventFlag(eventFlagId2)) {
        ForceAnimationPlayback(chrEntityId, 30001, true, false, false);
    }
    if (!EventFlag(eventFlagId)) {
        SetSpEffect(chrEntityId, 5005);
        RequestCharacterAIReplan(chrEntityId);
        DisableCharacterGravity(chrEntityId);
        WaitFixedTimeFrames(1);
        if (EventFlag(eventFlagId2)) {
            ForceAnimationPlayback(chrEntityId, 30001, true, false, false);
        } else {
            ForceAnimationPlayback(chrEntityId, 0, true, false, false);
        }
        WaitFor(
            EventFlag(eventFlagId)
                || (PlayerIsInOwnWorld() && EntityInRadiusOfEntity(chrEntityId, 10000, 200, 1)));
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
L0:
    SetSpEffect(chrEntityId, 5006);
    RequestCharacterAIReplan(chrEntityId);
    EnableCharacterGravity(chrEntityId);
    WaitFor(
        (PlayerIsInOwnWorld() && !EntityInRadiusOfEntity(chrEntityId, 10000, 220, 1))
            || !EventFlag(eventFlagId));
    SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    RestartEvent();
});

// 【共通】歩く霊廟_歩行時開閉禁止 -- [Common] Walking mausoleum_Do not open or close while walking
$Event(90005456, Restart, function(chrEntityId, assetEntityId, assetEntityId2, eventFlagId) {
    if (EventFlag(eventFlagId)) {
        EndEvent();
    }
L0:
    DisableObjAct(assetEntityId, -1);
    DisableObjAct(assetEntityId2, -1);
    WaitFor(CharacterHasSpEffect(chrEntityId, 12455));
    EnableObjAct(assetEntityId, -1);
    EnableObjAct(assetEntityId2, -1);
});

// 【共通】歩く霊廟_天井蓋対応 -- [Common] Walking mausoleum_Ceiling cover compatible
$Event(90005457, Restart, function(chrEntityId, assetEntityId, assetEntityId2, assetEntityId3) {
    if (CharacterHasSpEffect(chrEntityId, 12455)) {
        DisableAsset(assetEntityId);
        DisableObjAct(assetEntityId2, -1);
        ReproduceAssetAnimation(assetEntityId2, 1);
        EndEvent();
    }
L0:
    AttachAssetToCharacter(chrEntityId, 100, assetEntityId);
    ReproduceAssetAnimation(assetEntityId2, 1);
    DisableObjAct(assetEntityId2, -1);
    DisableObjAct(assetEntityId3, -1);
    WaitFor(CharacterHasSpEffect(chrEntityId, 12455));
    DisableAsset(assetEntityId);
    EnableObjAct(assetEntityId3, -1);
});

// 【共通】歩く霊廟_土台安定対応 -- [Common] Walking mausoleum_Foundation stability support
$Event(90005458, Restart, function(chrEntityId, assetEntityId) {
    if (!ThisEventSlot()) {
        AttachAssetToCharacter(chrEntityId, 166, assetEntityId);
        DisableAsset(assetEntityId);
        WaitFor(CharacterHasSpEffect(chrEntityId, 12465));
    }
L0:
    EnableAsset(assetEntityId);
    SetNetworkconnectedThisEventSlot(ON);
    EndEvent();
});

// 【共通】歩く霊廟_ボスソウル複製 -- [Common] Walking Mausoleum_Boss Soul Duplication
$Event(90005459, Restart, function(chrEntityId, eventFlagId, chrEntityId2) {
    DisableCharacter(chrEntityId2);
    DisableCharacterCollision(chrEntityId2);
    DisableCharacterGravity(chrEntityId2);
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(PlayerIsInOwnWorld() && EventFlag(eventFlagId));
    EnableCharacter(chrEntityId2);
    WarpCharacterAndCopyFloor(chrEntityId2, TargetEntityType.Character, chrEntityId, 270, chrEntityId);
});

// 【共通】陸ダコ_初期設定 -- [Common] Land octopus_Initial settings
$Event(90005460, Restart, function(chrEntityId) {
    WaitFor(CharacterBackreadStatus(chrEntityId));
    CreateNPCPart(chrEntityId, 60, NPCPartType.Part6, 999999999, 1, 1, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 60, 124, 124, -1, -1, -1);
});

// 【共通】陸ダコ_左触手破壊 -- [Common] Land Octopus_Left Tentacle Destruction
$Event(90005461, Restart, function(chrEntityId) {
    WaitFor(CharacterBackreadStatus(chrEntityId) && !CharacterHasSpEffect(chrEntityId, 11753));
    CreateNPCPart(chrEntityId, 10, NPCPartType.Part1, 11, 1, 1, false, false);
    CreateNPCPart(chrEntityId, 20, NPCPartType.Part2, 11, 1, 1, false, false);
    cond = cond2;
    WaitFor(
        NPCPartHP(chrEntityId, 10) <= 0
            || NPCPartHP(chrEntityId, 20) <= 0
            || (NPCPartHP(chrEntityId, 10) <= 10 && NPCPartHP(chrEntityId, 20) <= 1)
            || (NPCPartHP(chrEntityId, 10) <= 9 && NPCPartHP(chrEntityId, 20) <= 2)
            || (NPCPartHP(chrEntityId, 10) <= 8 && NPCPartHP(chrEntityId, 20) <= 3)
            || (NPCPartHP(chrEntityId, 10) <= 7 && NPCPartHP(chrEntityId, 20) <= 4)
            || (NPCPartHP(chrEntityId, 10) <= 6 && NPCPartHP(chrEntityId, 20) <= 5)
            || (NPCPartHP(chrEntityId, 10) <= 5 && NPCPartHP(chrEntityId, 20) <= 6)
            || (NPCPartHP(chrEntityId, 10) <= 4 && NPCPartHP(chrEntityId, 20) <= 7)
            || (NPCPartHP(chrEntityId, 10) <= 3 && NPCPartHP(chrEntityId, 20) <= 8)
            || (NPCPartHP(chrEntityId, 10) <= 2 && NPCPartHP(chrEntityId, 20) <= 9)
            || (NPCPartHP(chrEntityId, 10) <= 1 && NPCPartHP(chrEntityId, 20) <= 10)
            || CharacterHasSpEffect(chrEntityId, 11753));
    SetNPCPartHP(chrEntityId, 10, 0, false);
    SetNPCPartHP(chrEntityId, 20, 0, false);
    if (!CharacterHasSpEffect(chrEntityId, 11753)) {
        ForceAnimationPlayback(chrEntityId, 20001, false, false, false);
    }
    WaitFixedTimeSeconds(2);
    RestartEvent();
});

// 【共通】陸ダコ_右触手破壊 -- [Common] Land octopus_Right tentacle destroyed
$Event(90005462, Restart, function(chrEntityId) {
    WaitFor(CharacterBackreadStatus(chrEntityId) && !CharacterHasSpEffect(chrEntityId, 11752));
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 11, 1, 1, false, false);
    CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 11, 1, 1, false, false);
    WaitFor(
        NPCPartHP(chrEntityId, 30) <= 0
            || NPCPartHP(chrEntityId, 50) <= 0
            || (NPCPartHP(chrEntityId, 30) <= 10 && NPCPartHP(chrEntityId, 50) <= 1)
            || (NPCPartHP(chrEntityId, 30) <= 9 && NPCPartHP(chrEntityId, 50) <= 2)
            || (NPCPartHP(chrEntityId, 30) <= 8 && NPCPartHP(chrEntityId, 50) <= 3)
            || (NPCPartHP(chrEntityId, 30) <= 7 && NPCPartHP(chrEntityId, 50) <= 4)
            || (NPCPartHP(chrEntityId, 30) <= 6 && NPCPartHP(chrEntityId, 50) <= 5)
            || (NPCPartHP(chrEntityId, 30) <= 5 && NPCPartHP(chrEntityId, 50) <= 6)
            || (NPCPartHP(chrEntityId, 30) <= 4 && NPCPartHP(chrEntityId, 50) <= 7)
            || (NPCPartHP(chrEntityId, 30) <= 3 && NPCPartHP(chrEntityId, 50) <= 8)
            || (NPCPartHP(chrEntityId, 30) <= 2 && NPCPartHP(chrEntityId, 50) <= 9)
            || (NPCPartHP(chrEntityId, 30) <= 1 && NPCPartHP(chrEntityId, 50) <= 10));
    SetNPCPartHP(chrEntityId, 30, 0, false);
    SetNPCPartHP(chrEntityId, 50, 0, false);
    ForceAnimationPlayback(chrEntityId, 20000, false, false, false);
    WaitFixedTimeSeconds(2);
    RestartEvent();
});

// 【共通】陸ダコ_出産停止 -- [Common] Land octopus_Stop giving birth
$Event(90005463, Restart, function(eventFlagId, chrEntityId) {
    if (!ThisEventSlot()) {
        WaitFor(
            EventValue(eventFlagId, 3) >= 5
                || (HasDamageType(chrEntityId, 0, DamageType.Unspecified)
                    && !CharacterHasSpEffect(eventFlagId, 11757)));
    }
L0:
    SetSpEffect(chrEntityId, 11757);
});

// 【共通】陸ダコ_出産 -- [Common] Land octopus_birth
$Event(90005464, Restart, function(eventFlagId, chrEntityId, chrEntityId2, thresholdValue) {
    EndIf(EventValue(eventFlagId, 3) > thresholdValue);
    DisableCharacter(chrEntityId2);
    DisableCharacterCollision(chrEntityId2);
    DisableCharacterAI(chrEntityId2);
    WaitFor(
        CharacterHasSpEffect(chrEntityId, 11771)
            && EventValue(eventFlagId, 3) == thresholdValue
            && !CharacterDead(chrEntityId));
    WaitFixedTimeFrames(1);
    IncrementEventValue(eventFlagId, 3, 5);
    EnableCharacter(chrEntityId2);
    ForceAnimationPlayback(chrEntityId2, 20000, false, false, false);
    WarpCharacterAndCopyFloor(chrEntityId2, TargetEntityType.Character, chrEntityId, 70, chrEntityId);
    WaitFixedTimeSeconds(3);
    EnableCharacterCollision(chrEntityId2);
    EnableCharacterAI(chrEntityId2);
});

// 【共通】高路ガーディアン_部位破壊 -- [Common] Takaji Guardian_Part Destruction
$Event(90005470, Restart, function(chrEntityId) {
    WaitFor(CharacterBackreadStatus(chrEntityId));
    if (!ThisEventSlot()) {
        if (CharacterHasSpEffect(chrEntityId, 12160)) {
            CreateNPCPart(chrEntityId, 20, NPCPartType.Part2, 80, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 20, 120, 120, -1, -1, -1);
        }
        if (CharacterHasSpEffect(chrEntityId, 12161)) {
            CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 80, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 30, 120, 120, -1, -1, -1);
        }
        if (CharacterHasSpEffect(chrEntityId, 12162)) {
            CreateNPCPart(chrEntityId, 40, NPCPartType.Part4, 75, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 40, 120, 120, -1, -1, -1);
        }
        if (CharacterHasSpEffect(chrEntityId, 12163)) {
            CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 75, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 50, 120, 120, -1, -1, -1);
        }
    }
L1:
    if (CharacterHasSpEffect(chrEntityId, 12160)) {
        hpSp = NPCPartHP(chrEntityId, 20) <= 0
            && CharacterHasSpEffect(chrEntityId, 12156)
            && CharacterHasSpEffect(chrEntityId, 12168)
            && !CharacterHasSpEffect(chrEntityId, 12170)
            && !CharacterHasSpEffect(chrEntityId, 12171);
    }
    if (CharacterHasSpEffect(chrEntityId, 12161)) {
        hpSp2 = NPCPartHP(chrEntityId, 30) <= 0
            && CharacterHasSpEffect(chrEntityId, 12156)
            && CharacterHasSpEffect(chrEntityId, 12169)
            && !CharacterHasSpEffect(chrEntityId, 12170)
            && !CharacterHasSpEffect(chrEntityId, 12171);
    }
    if (CharacterHasSpEffect(chrEntityId, 12162)) {
        hpSp3 = NPCPartHP(chrEntityId, 40) <= 0
            && !CharacterHasSpEffect(chrEntityId, 12170)
            && !CharacterHasSpEffect(chrEntityId, 12171);
    }
    if (CharacterHasSpEffect(chrEntityId, 12163)) {
        hpSp4 = NPCPartHP(chrEntityId, 50) <= 0
            && !CharacterHasSpEffect(chrEntityId, 12170)
            && !CharacterHasSpEffect(chrEntityId, 12171);
    }
    WaitFor(hpSp || hpSp2 || hpSp3 || hpSp4);
    GotoIf(L5, hpSp4.Passed);
    GotoIf(L4, hpSp3.Passed);
    GotoIf(L3, hpSp2.Passed);
    GotoIf(L2, hpSp.Passed);
    Goto(L9);
L2:
    ForceAnimationPlayback(chrEntityId, 20011, false, true, false);
    CreateNPCPart(chrEntityId, 20, NPCPartType.Part2, 80, 1, 3, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 20, 120, 120, -1, -1, -1);
    Goto(L9);
L3:
    ForceAnimationPlayback(chrEntityId, 20008, false, true, false);
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 80, 1, 3, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 20, 120, 120, -1, -1, -1);
    Goto(L9);
L4:
    if (!CharacterHasSpEffect(chrEntityId, 12156)) {
        ForceAnimationPlayback(chrEntityId, 20006, false, true, false);
    } else {
        ForceAnimationPlayback(chrEntityId, 20010, false, true, false);
    }
    CreateNPCPart(chrEntityId, 40, NPCPartType.Part4, 75, 1, 3, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 40, 120, 120, -1, -1, -1);
    Goto(L9);
L5:
    if (!CharacterHasSpEffect(chrEntityId, 12156)) {
        ForceAnimationPlayback(chrEntityId, 20007, false, true, false);
    } else {
        ForceAnimationPlayback(chrEntityId, 2009, false, true, false);
    }
    CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 75, 1, 3, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 50, 120, 120, -1, -1, -1);
    Goto(L9);
    if (CharacterHasSpEffect(chrEntityId, 12160)) {
        SetNPCPartHP(chrEntityId, 20, 9999999, false);
    }
    if (CharacterHasSpEffect(chrEntityId, 12161)) {
        SetNPCPartHP(chrEntityId, 30, 9999999, false);
    }
    if (CharacterHasSpEffect(chrEntityId, 12162)) {
        SetNPCPartHP(chrEntityId, 40, 9999999, false);
    }
    if (CharacterHasSpEffect(chrEntityId, 12163)) {
        SetNPCPartHP(chrEntityId, 50, 9999999, false);
    }
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】高路ガーディアン_左腕部位破壊 -- [Common] Takaji Guardian_Left arm part destroyed
$Event(90005471, Restart, function(chrEntityId) {
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && CharacterHasSpEffect(chrEntityId, 12160)
            && !CharacterHasSpEffect(chrEntityId, 12170));
    if (ThisEventSlot()) {
        SetNPCPartHP(chrEntityId, 20, 9999999, false);
    } else {
        CreateNPCPart(chrEntityId, 20, NPCPartType.Part2, 80, 1, 3, false, false);
        SetNPCPartSEAndSFX(chrEntityId, 20, 120, 120, -1, -1, -1);
    }
L0:
    WaitFor(
        (NPCPartHP(chrEntityId, 20) <= 0
            && CharacterHasSpEffect(chrEntityId, 12156)
            && CharacterHasSpEffect(chrEntityId, 12168)
            && !CharacterHasSpEffect(chrEntityId, 12171))
            || CharacterHasSpEffect(chrEntityId, 12170));
    if (!CharacterHasSpEffect(chrEntityId, 12170)) {
        ForceAnimationPlayback(chrEntityId, 20011, false, true, false);
    }
    CreateNPCPart(chrEntityId, 20, NPCPartType.Part2, 80, 1, 3, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 20, 120, 120, -1, -1, -1);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】高路ガーディアン_右腕部位破壊 -- [Common] Takaji Guardian_Right arm part destroyed
$Event(90005472, Restart, function(chrEntityId) {
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && CharacterHasSpEffect(chrEntityId, 12161)
            && !CharacterHasSpEffect(chrEntityId, 12170));
    if (ThisEventSlot()) {
        SetNPCPartHP(chrEntityId, 30, 9999999, false);
    } else {
        CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 80, 1, 3, false, false);
        SetNPCPartSEAndSFX(chrEntityId, 30, 120, 120, -1, -1, -1);
    }
L0:
    WaitFor(
        (NPCPartHP(chrEntityId, 30) <= 0
            && CharacterHasSpEffect(chrEntityId, 12156)
            && CharacterHasSpEffect(chrEntityId, 12169)
            && !CharacterHasSpEffect(chrEntityId, 12171))
            || CharacterHasSpEffect(chrEntityId, 12170));
    if (!CharacterHasSpEffect(chrEntityId, 12170)) {
        ForceAnimationPlayback(chrEntityId, 20008, false, true, false);
    }
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 80, 1, 3, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 30, 120, 120, -1, -1, -1);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】高路ガーディアン_左脚部位破壊 -- [Common] Takaji Guardian_Left leg part destroyed
$Event(90004473, Restart, function(chrEntityId) {
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && CharacterHasSpEffect(chrEntityId, 12162)
            && !CharacterHasSpEffect(chrEntityId, 12170));
    if (ThisEventSlot()) {
        SetNPCPartHP(chrEntityId, 40, 9999999, false);
    } else {
        CreateNPCPart(chrEntityId, 40, NPCPartType.Part4, 75, 1, 3, false, false);
        SetNPCPartSEAndSFX(chrEntityId, 40, 120, 120, -1, -1, -1);
    }
L0:
    WaitFor(
        (NPCPartHP(chrEntityId, 40) <= 0 && !CharacterHasSpEffect(chrEntityId, 12171))
            || CharacterHasSpEffect(chrEntityId, 12170));
    if (!CharacterHasSpEffect(chrEntityId, 12170)) {
        if (!CharacterHasSpEffect(chrEntityId, 12156)) {
            ForceAnimationPlayback(chrEntityId, 20006, false, true, false);
            CreateNPCPart(chrEntityId, 40, NPCPartType.Part4, 75, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 40, 120, 120, -1, -1, -1);
        } else {
L1:
            ForceAnimationPlayback(chrEntityId, 20010, false, true, false);
            CreateNPCPart(chrEntityId, 40, NPCPartType.Part4, 75, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 40, 120, 120, -1, -1, -1);
            Goto(L9);
        }
    }
L9:
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】高路ガーディアン_右脚部位破壊 -- [Common] Takaji Guardian_Right leg part destroyed
$Event(90005474, Restart, function(chrEntityId) {
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && CharacterHasSpEffect(chrEntityId, 12163)
            && !CharacterHasSpEffect(chrEntityId, 12170));
    if (ThisEventSlot()) {
        SetNPCPartHP(chrEntityId, 50, 9999999, false);
    } else {
        CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 75, 1, 3, false, false);
        SetNPCPartSEAndSFX(chrEntityId, 50, 120, 120, -1, -1, -1);
    }
L0:
    WaitFor(
        (NPCPartHP(chrEntityId, 50) <= 0 && !CharacterHasSpEffect(chrEntityId, 12171))
            || CharacterHasSpEffect(chrEntityId, 12170));
    if (!CharacterHasSpEffect(chrEntityId, 12170)) {
        if (!CharacterHasSpEffect(chrEntityId, 12156)) {
            ForceAnimationPlayback(chrEntityId, 20007, false, true, false);
            CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 75, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 50, 120, 120, -1, -1, -1);
        } else {
L1:
            ForceAnimationPlayback(chrEntityId, 20009, false, true, false);
            CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 75, 1, 3, false, false);
            SetNPCPartSEAndSFX(chrEntityId, 50, 120, 120, -1, -1, -1);
            Goto(L9);
        }
    }
L9:
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】ルーン狩りの騎士_騎乗イベント -- [Common] Rune Hunting Knight_Riding Event
$Event(90005476, Default, function(chrEntityId, chrEntityId2) {
    if (CharacterDead(chrEntityId)) {
        DisableCharacter(chrEntityId2);
        DisableCharacterCollision(chrEntityId2);
        EndEvent();
    }
L0:
    WaitFor(CharacterHasSpEffect(chrEntityId, 11805));
    WarpCharacterAndCopyFloor(chrEntityId2, TargetEntityType.Character, chrEntityId, 230, chrEntityId2);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】隕鉄の獣_部位破壊 -- [Common] Meteor Beast_Part Destruction
$Event(90005480, Restart, function(chrEntityId) {
    WaitFor(
        CharacterBackreadStatus(chrEntityId)
            && !CharacterHasSpEffect(chrEntityId, 16472)
            && !CharacterHasSpEffect(chrEntityId, 16473)
            && !CharacterHasSpEffect(chrEntityId, 16474)
            && !CharacterHasSpEffect(chrEntityId, 16475));
    GotoIf(S0, !ThisEventSlot());
    GotoIf(S1, NPCPartHP(chrEntityId, 30) != 0);
S0:
    SetSpEffect(chrEntityId, 16498);
    CreateNPCPart(chrEntityId, 30, NPCPartType.Part3, 61, 1, 1, false, false);
    ChangeCharacterDispmask(chrEntityId, 10, ON);
S1:
    GotoIf(S2, !ThisEventSlot());
    GotoIf(S3, NPCPartHP(chrEntityId, 40) != 0);
S2:
    SetSpEffect(chrEntityId, 16498);
    CreateNPCPart(chrEntityId, 40, NPCPartType.Part4, 61, 1, 1, false, false);
    ChangeCharacterDispmask(chrEntityId, 11, ON);
S3:
    GotoIf(S4, !ThisEventSlot());
    GotoIf(S5, NPCPartHP(chrEntityId, 50) != 0);
S4:
    SetSpEffect(chrEntityId, 16498);
    CreateNPCPart(chrEntityId, 50, NPCPartType.Part5, 61, 1, 1, false, false);
    ChangeCharacterDispmask(chrEntityId, 12, ON);
S5:
    GotoIf(S6, !ThisEventSlot());
    GotoIf(S7, NPCPartHP(chrEntityId, 60) != 0);
S6:
    SetSpEffect(chrEntityId, 16498);
    CreateNPCPart(chrEntityId, 60, NPCPartType.Part6, 61, 1, 1, false, false);
    ChangeCharacterDispmask(chrEntityId, 13, ON);
S7:
L0:
    hp = NPCPartHP(chrEntityId, 30) <= 0;
    hp2 = NPCPartHP(chrEntityId, 40) <= 0;
    hp3 = NPCPartHP(chrEntityId, 50) <= 0;
    hp4 = NPCPartHP(chrEntityId, 60) <= 0;
    WaitFor(hp || hp2 || hp3 || hp4);
    GotoIf(L3, hp.Passed);
    GotoIf(L4, hp2.Passed);
    GotoIf(L5, hp3.Passed);
    GotoIf(L6, hp4.Passed);
L3:
    SetSpEffect(chrEntityId, 16497);
    SetSpEffect(chrEntityId, 16484);
    SetSpEffect(chrEntityId, 16472);
    ChangeCharacterDispmask(chrEntityId, 10, OFF);
    WaitFixedTimeFrames(2);
    if (!CharacterHasSpEffect(chrEntityId, 16485)) {
        ForceAnimationPlayback(chrEntityId, 20000, false, true, false);
    }
    Goto(L9);
L4:
    SetSpEffect(chrEntityId, 16497);
    SetSpEffect(chrEntityId, 16484);
    SetSpEffect(chrEntityId, 16473);
    ChangeCharacterDispmask(chrEntityId, 11, OFF);
    WaitFixedTimeFrames(2);
    if (!CharacterHasSpEffect(chrEntityId, 16485)) {
        ForceAnimationPlayback(chrEntityId, 20001, false, true, false);
    }
    Goto(L9);
L5:
    SetSpEffect(chrEntityId, 16497);
    SetSpEffect(chrEntityId, 16484);
    SetSpEffect(chrEntityId, 16474);
    ChangeCharacterDispmask(chrEntityId, 12, OFF);
    WaitFixedTimeFrames(2);
    if (!CharacterHasSpEffect(chrEntityId, 16485)) {
        ForceAnimationPlayback(chrEntityId, 20002, false, true, false);
    }
    Goto(L9);
L6:
    SetSpEffect(chrEntityId, 16497);
    SetSpEffect(chrEntityId, 16484);
    SetSpEffect(chrEntityId, 16475);
    ChangeCharacterDispmask(chrEntityId, 13, OFF);
    WaitFixedTimeFrames(2);
    if (!CharacterHasSpEffect(chrEntityId, 16485)) {
        ForceAnimationPlayback(chrEntityId, 20003, false, true, false);
    }
    Goto(L9);
L9:
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】隕鉄の獣_突進転倒 -- [Common] Meteor Beast_Charge fall
$Event(90005481, Restart, function(chrEntityId) {
    CreateNPCPart(chrEntityId, 10, NPCPartType.Part1, 9999, 1, 1, false, false);
    SetNPCPartSEAndSFX(chrEntityId, 0, 110, 110, -1, -1, -1);
    WaitFor(
        CharacterHasSpEffect(chrEntityId, 16499)
            && NPCPartAttributeDamage(chrEntityId, 10, 0, DamageType.Unspecified));
    ForceAnimationPlayback(chrEntityId, 20007, false, false, false);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】遠距離敵_セットアップ -- [Common] Long range enemy_Setup
$Event(90005485, Restart, function(chrEntityId) {
    DisableNetworkSync();
    if (!ThisEventSlot()) {
        EnableCharacterDefaultBackread(chrEntityId);
        SetCharacterEnableDistance(chrEntityId, 2000);
        DisableCharacterDisableOnHitUnload(chrEntityId);
        EnableDistancebasedNetworkUpdateAuthority(chrEntityId);
    }
L0:
    DisableCharacterGravity(chrEntityId);
    WaitFor(EntityInRadiusOfEntity(chrEntityId, 10000, 200, 1));
    EnableCharacterGravity(chrEntityId);
    WaitFor(EntityInRadiusOfEntity(chrEntityId, 10000, 220, 1));
    RestartEvent();
});

// 【共通】カタパルト -- [Common] Catapult
$Event(90005490, Restart, function(chrEntityId, chrEntityId2, assetEntityId, assetEntityId2, objactEventFlag, areaEntityId, value) {
    DisableCharacterGravity(chrEntityId);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery5Frames);
    DisableCharacterDisableOnHitUnload(chrEntityId);
    SetCharacterEnableDistance(chrEntityId, 2000);
    IssueShortWarpRequest(chrEntityId, TargetEntityType.Asset, assetEntityId, 100);
    ReproduceAssetAnimation(assetEntityId, 0);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
    }
    WaitFor(
        (((CharacterType(10000, TargetType.BlackPhantom) && CharacterHasSpEffect(10000, 3710))
            || CharacterType(10000, TargetType.Alive)
            || CharacterType(10000, TargetType.GrayPhantom)
            || CharacterType(10000, TargetType.WhitePhantom)
            || CharacterType(10000, TargetType.BluePhantom))
            && InArea(10000, areaEntityId)
            && CharacterAIState(chrEntityId, AIStateType.Combat)
            && !CharacterDead(chrEntityId2))
            || ObjActEventFlag(objactEventFlag));
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AlwaysUpdate);
    SetSpEffect(chrEntityId, 16601);
    if (value != 0) {
        RequestCharacterAICommand(chrEntityId, 20, 0);
    } else {
        RequestCharacterAICommand(chrEntityId, 10, 0);
    }
    RequestCharacterAIReplan(chrEntityId);
    ForceAnimationPlayback(assetEntityId, 0, false, true, true);
    EnableObjAct(assetEntityId2, -1);
    RequestCharacterAICommand(chrEntityId, -1, 0);
    RequestCharacterAIReplan(chrEntityId);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery5Frames);
    RestartEvent();
});

// 【共通】カタパルト_射手 -- [Common] Catapult_Archer
$Event(90005491, Restart, function(chrEntityId, assetEntityId, areaEntityId) {
    WaitFor(
        !CharacterDead(chrEntityId, GreaterOrEqual, 1)
            && EntityInRadiusOfEntity(chrEntityId, assetEntityId, 2, 1)
            && InArea(10000, areaEntityId));
    InitializeObjAct(assetEntityId, -1, -1);
    WaitFixedTimeSeconds(0.5);
    RestartEvent();
});

// 【共通】2フロア移動エレベータ -- [Common] 2-floor moving elevator
$Event(90005500, Default, function(eventFlagId, eventFlagId2, value, assetEntityId, assetEntityId2, objactEventFlag, assetEntityId3, objactEventFlag2, areaEntityId, areaEntityId2, eventFlagId3, eventFlagId4, eventFlagId5) {
    if (!(((EventFlag(eventFlagId) && EventFlag(eventFlagId2))
        || (!EventFlag(eventFlagId) && !EventFlag(eventFlagId2)))
        && EventFlag(eventFlagId3))) {
        if (EventFlag(eventFlagId2)) {
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                EnableObjAct(assetEntityId3, -1);
                DisableObjAct(assetEntityId2, -1);
            }
            obj = ObjActEventFlag(objactEventFlag2);
            flag = !EventFlag(eventFlagId);
            areaFlag &= InArea(10000, areaEntityId);
            if (eventFlagId5 != 0) {
                areaFlag &= EventFlag(eventFlagId5);
            }
            WaitFor(obj || flag || areaFlag);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                DisableObjAct(assetEntityId3, -1);
            }
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId3, ON);
                SetNetworkconnectedEventFlagID(eventFlagId, OFF);
            }
            SetEventFlagID(eventFlagId2, OFF);
            if (!obj.Passed) {
                GotoIf(L1, EventFlag(eventFlagId4));
                GotoIf(S9, value == 10);
                GotoIf(S8, value == 9);
                GotoIf(S7, value == 8);
                GotoIf(S6, value == 7);
                GotoIf(S5, value == 6);
                GotoIf(S4, value == 5);
                GotoIf(S3, value == 4);
                GotoIf(S2, value == 3);
                GotoIf(S1, value == 2);
                GotoIf(S0, value == 1);
                ForceAnimationPlayback(assetEntityId, 21, false, true, true);
                Goto(L2);
S0:
                ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
                Goto(L2);
S1:
                ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
                Goto(L2);
S2:
                ForceAnimationPlayback(assetEntityId, 3000021, false, true, true);
                Goto(L2);
S3:
                ForceAnimationPlayback(assetEntityId, 4000021, false, true, true);
                Goto(L2);
S4:
                ForceAnimationPlayback(assetEntityId, 5000021, false, true, true);
                Goto(L2);
S5:
                ForceAnimationPlayback(assetEntityId, 6000021, false, true, true);
                Goto(L2);
S6:
                ForceAnimationPlayback(assetEntityId, 7000021, false, true, true);
                Goto(L2);
S7:
                ForceAnimationPlayback(assetEntityId, 8000021, false, true, true);
                Goto(L2);
S8:
                ForceAnimationPlayback(assetEntityId, 9000021, false, true, true);
                Goto(L2);
S9:
                ForceAnimationPlayback(assetEntityId, 10000021, false, true, true);
            } else {
L1:
                if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                    SetNetworkconnectedEventFlagID(eventFlagId4, ON);
                }
                WaitFixedTimeSeconds(2);
                GotoIf(S19, value == 10);
                GotoIf(S18, value == 9);
                GotoIf(S17, value == 8);
                GotoIf(S16, value == 7);
                GotoIf(S15, value == 6);
                GotoIf(S14, value == 5);
                GotoIf(S13, value == 4);
                GotoIf(S12, value == 3);
                GotoIf(S11, value == 2);
                GotoIf(S10, value == 1);
                ForceAnimationPlayback(assetEntityId, 21, false, true, true);
                Goto(L11);
S10:
                ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
                Goto(L11);
S11:
                ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
                Goto(L11);
S12:
                ForceAnimationPlayback(assetEntityId, 3000021, false, true, true);
                Goto(L11);
S13:
                ForceAnimationPlayback(assetEntityId, 4000021, false, true, true);
                Goto(L11);
S14:
                ForceAnimationPlayback(assetEntityId, 5000021, false, true, true);
                Goto(L11);
S15:
                ForceAnimationPlayback(assetEntityId, 6000021, false, true, true);
                Goto(L11);
S16:
                ForceAnimationPlayback(assetEntityId, 7000021, false, true, true);
                Goto(L11);
S17:
                ForceAnimationPlayback(assetEntityId, 8000021, false, true, true);
                Goto(L11);
S18:
                ForceAnimationPlayback(assetEntityId, 9000021, false, true, true);
                Goto(L11);
S19:
                ForceAnimationPlayback(assetEntityId, 10000021, false, true, true);
L11:
                ForceAnimationPlayback(assetEntityId3, 3, false, false, true);
                if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                    SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
                }
            }
L2:
            WaitFor(
                AssetBackread(assetEntityId, Equal, 1)
                    && (!AllPlayersInArea(areaEntityId2) || EventFlag(eventFlagId)));
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
                GotoIf(S29, value == 10);
                GotoIf(S28, value == 9);
                GotoIf(S27, value == 8);
                GotoIf(S26, value == 7);
                GotoIf(S25, value == 6);
                GotoIf(S24, value == 5);
                GotoIf(S23, value == 4);
                GotoIf(S22, value == 3);
                GotoIf(S21, value == 2);
                GotoIf(S20, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, false, true);
                Goto(L12);
S20:
                ForceAnimationPlayback(assetEntityId, 1000110, false, false, true);
                Goto(L12);
S21:
                ForceAnimationPlayback(assetEntityId, 2000110, false, false, true);
                Goto(L12);
S22:
                ForceAnimationPlayback(assetEntityId, 3000110, false, false, true);
                Goto(L12);
S23:
                ForceAnimationPlayback(assetEntityId, 4000110, false, false, true);
                Goto(L12);
S24:
                ForceAnimationPlayback(assetEntityId, 5000110, false, false, true);
                Goto(L12);
S25:
                ForceAnimationPlayback(assetEntityId, 6000110, false, false, true);
                Goto(L12);
S26:
                ForceAnimationPlayback(assetEntityId, 7000110, false, false, true);
                Goto(L12);
S27:
                ForceAnimationPlayback(assetEntityId, 8000110, false, false, true);
                Goto(L12);
S28:
                ForceAnimationPlayback(assetEntityId, 9000110, false, false, true);
                Goto(L12);
S29:
                ForceAnimationPlayback(assetEntityId, 10000110, false, false, true);
            } else {
L3:
                GotoIf(S39, value == 10);
                GotoIf(S38, value == 9);
                GotoIf(S37, value == 8);
                GotoIf(S36, value == 7);
                GotoIf(S35, value == 6);
                GotoIf(S34, value == 5);
                GotoIf(S33, value == 4);
                GotoIf(S32, value == 3);
                GotoIf(S31, value == 2);
                GotoIf(S30, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, true, true);
                Goto(L12);
S30:
                ForceAnimationPlayback(assetEntityId, 1000110, false, true, true);
                Goto(L12);
S31:
                ForceAnimationPlayback(assetEntityId, 2000110, false, true, true);
                Goto(L12);
S32:
                ForceAnimationPlayback(assetEntityId, 3000110, false, true, true);
                Goto(L12);
S33:
                ForceAnimationPlayback(assetEntityId, 4000110, false, true, true);
                Goto(L12);
S34:
                ForceAnimationPlayback(assetEntityId, 5000110, false, true, true);
                Goto(L12);
S35:
                ForceAnimationPlayback(assetEntityId, 6000110, false, true, true);
                Goto(L12);
S36:
                ForceAnimationPlayback(assetEntityId, 7000110, false, true, true);
                Goto(L12);
S37:
                ForceAnimationPlayback(assetEntityId, 8000110, false, true, true);
                Goto(L12);
S38:
                ForceAnimationPlayback(assetEntityId, 9000110, false, true, true);
                Goto(L12);
S39:
                ForceAnimationPlayback(assetEntityId, 10000110, false, true, true);
            }
L12:
            RestartEvent();
        }
L0:
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            EnableObjAct(assetEntityId2, -1);
            DisableObjAct(assetEntityId3, -1);
        }
        obj2 = ObjActEventFlag(objactEventFlag);
        flag2 = EventFlag(eventFlagId);
        areaSpFlag &= InArea(10000, areaEntityId2) && !CharacterHasSpEffect(10000, 4800);
        if (eventFlagId5 != 0) {
            areaSpFlag &= EventFlag(eventFlagId5);
        }
        WaitFor(obj2 || flag2 || areaSpFlag);
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            DisableObjAct(assetEntityId2, -1);
        }
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId3, ON);
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
        SetEventFlagID(eventFlagId2, ON);
        if (!obj2.Passed) {
            GotoIf(L4, EventFlag(eventFlagId4));
            GotoIf(S49, value == 10);
            GotoIf(S48, value == 9);
            GotoIf(S47, value == 8);
            GotoIf(S46, value == 7);
            GotoIf(S45, value == 6);
            GotoIf(S44, value == 5);
            GotoIf(S43, value == 4);
            GotoIf(S42, value == 3);
            GotoIf(S41, value == 2);
            GotoIf(S40, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L5);
S40:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
            Goto(L5);
S41:
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
            Goto(L5);
S42:
            ForceAnimationPlayback(assetEntityId, 3000012, false, true, true);
            Goto(L5);
S43:
            ForceAnimationPlayback(assetEntityId, 4000012, false, true, true);
            Goto(L5);
S44:
            ForceAnimationPlayback(assetEntityId, 5000012, false, true, true);
            Goto(L5);
S45:
            ForceAnimationPlayback(assetEntityId, 6000012, false, true, true);
            Goto(L5);
S46:
            ForceAnimationPlayback(assetEntityId, 7000012, false, true, true);
            Goto(L5);
S47:
            ForceAnimationPlayback(assetEntityId, 8000012, false, true, true);
            Goto(L5);
S48:
            ForceAnimationPlayback(assetEntityId, 9000012, false, true, true);
            Goto(L5);
S49:
            ForceAnimationPlayback(assetEntityId, 10000012, false, true, true);
        } else {
L4:
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, ON);
            }
            WaitFixedTimeSeconds(2);
            GotoIf(S59, value == 10);
            GotoIf(S58, value == 9);
            GotoIf(S57, value == 8);
            GotoIf(S56, value == 7);
            GotoIf(S55, value == 6);
            GotoIf(S54, value == 5);
            GotoIf(S53, value == 4);
            GotoIf(S52, value == 3);
            GotoIf(S51, value == 2);
            GotoIf(S50, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L14);
S50:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
            Goto(L14);
S51:
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
            Goto(L14);
S52:
            ForceAnimationPlayback(assetEntityId, 3000012, false, true, true);
            Goto(L14);
S53:
            ForceAnimationPlayback(assetEntityId, 4000012, false, true, true);
            Goto(L14);
S54:
            ForceAnimationPlayback(assetEntityId, 5000012, false, true, true);
            Goto(L14);
S55:
            ForceAnimationPlayback(assetEntityId, 6000012, false, true, true);
            Goto(L14);
S56:
            ForceAnimationPlayback(assetEntityId, 7000012, false, true, true);
            Goto(L14);
S57:
            ForceAnimationPlayback(assetEntityId, 8000012, false, true, true);
            Goto(L14);
S58:
            ForceAnimationPlayback(assetEntityId, 9000012, false, true, true);
            Goto(L14);
S59:
            ForceAnimationPlayback(assetEntityId, 10000012, false, true, true);
L14:
            ForceAnimationPlayback(assetEntityId2, 3, false, false, true);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
            }
        }
L5:
        WaitFor(
            AssetBackread(assetEntityId, Equal, 1)
                && (!AllPlayersInArea(areaEntityId) || !EventFlag(eventFlagId)));
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
            GotoIf(S69, value == 10);
            GotoIf(S68, value == 9);
            GotoIf(S67, value == 8);
            GotoIf(S66, value == 7);
            GotoIf(S65, value == 6);
            GotoIf(S64, value == 5);
            GotoIf(S63, value == 4);
            GotoIf(S62, value == 3);
            GotoIf(S61, value == 2);
            GotoIf(S60, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, false, true);
            Goto(L15);
S60:
            ForceAnimationPlayback(assetEntityId, 1000120, false, false, true);
            Goto(L15);
S61:
            ForceAnimationPlayback(assetEntityId, 2000120, false, false, true);
            Goto(L15);
S62:
            ForceAnimationPlayback(assetEntityId, 3000120, false, false, true);
            Goto(L15);
S63:
            ForceAnimationPlayback(assetEntityId, 4000120, false, false, true);
            Goto(L15);
S64:
            ForceAnimationPlayback(assetEntityId, 5000120, false, false, true);
            Goto(L15);
S65:
            ForceAnimationPlayback(assetEntityId, 6000120, false, false, true);
            Goto(L15);
S66:
            ForceAnimationPlayback(assetEntityId, 7000120, false, false, true);
            Goto(L15);
S67:
            ForceAnimationPlayback(assetEntityId, 8000120, false, false, true);
            Goto(L15);
S68:
            ForceAnimationPlayback(assetEntityId, 9000120, false, false, true);
            Goto(L15);
S69:
            ForceAnimationPlayback(assetEntityId, 10000120, false, false, true);
        } else {
L6:
            GotoIf(S79, value == 10);
            GotoIf(S78, value == 9);
            GotoIf(S77, value == 8);
            GotoIf(S76, value == 7);
            GotoIf(S75, value == 6);
            GotoIf(S74, value == 5);
            GotoIf(S73, value == 4);
            GotoIf(S72, value == 3);
            GotoIf(S71, value == 2);
            GotoIf(S70, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, true, true);
            Goto(L15);
S70:
            ForceAnimationPlayback(assetEntityId, 1000120, false, true, true);
            Goto(L15);
S71:
            ForceAnimationPlayback(assetEntityId, 2000120, false, true, true);
            Goto(L15);
S72:
            ForceAnimationPlayback(assetEntityId, 3000120, false, true, true);
            Goto(L15);
S73:
            ForceAnimationPlayback(assetEntityId, 4000120, false, true, true);
            Goto(L15);
S74:
            ForceAnimationPlayback(assetEntityId, 5000120, false, true, true);
            Goto(L15);
S75:
            ForceAnimationPlayback(assetEntityId, 6000120, false, true, true);
            Goto(L15);
S76:
            ForceAnimationPlayback(assetEntityId, 7000120, false, true, true);
            Goto(L15);
S77:
            ForceAnimationPlayback(assetEntityId, 8000120, false, true, true);
            Goto(L15);
S78:
            ForceAnimationPlayback(assetEntityId, 9000120, false, true, true);
            Goto(L15);
S79:
            ForceAnimationPlayback(assetEntityId, 10000120, false, true, true);
        }
L15:
        RestartEvent();
    }
L9:
    WaitFor(!EventFlag(eventFlagId3));
    RestartEvent();
});

// 【共通】2フロア移動エレベータ_初期設定 -- [Common] 2-floor moving elevator_Initial settings
$Event(90005501, Restart, function(eventFlagId, eventFlagId2, value, assetEntityId, assetEntityId2, assetEntityId3, eventFlagId3) {
    if (PlayerIsInOwnWorld()) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    WaitFor(AssetBackread(assetEntityId, Equal, 1));
    if (EventFlag(eventFlagId)) {
        if (value != 10) {
            GotoIf(S8, value == 9);
            GotoIf(S7, value == 8);
            GotoIf(S6, value == 7);
            GotoIf(S5, value == 6);
            GotoIf(S4, value == 5);
            GotoIf(S3, value == 4);
            GotoIf(S2, value == 3);
            GotoIf(S1, value == 2);
            GotoIf(S0, value == 1);
            ForceAnimationPlayback(assetEntityId, 20, false, false, false);
            Goto(L10);
S0:
            ForceAnimationPlayback(assetEntityId, 1000020, false, false, false);
            Goto(L10);
S1:
            ForceAnimationPlayback(assetEntityId, 2000020, false, false, false);
            Goto(L10);
S2:
            ForceAnimationPlayback(assetEntityId, 3000020, false, false, false);
            Goto(L10);
S3:
            ForceAnimationPlayback(assetEntityId, 4000020, false, false, false);
            Goto(L10);
S4:
            ForceAnimationPlayback(assetEntityId, 5000020, false, false, false);
            Goto(L10);
S5:
            ForceAnimationPlayback(assetEntityId, 6000020, false, false, false);
            Goto(L10);
S6:
            ForceAnimationPlayback(assetEntityId, 7000020, false, false, false);
            Goto(L10);
S7:
            ForceAnimationPlayback(assetEntityId, 8000020, false, false, false);
            Goto(L10);
S8:
            ForceAnimationPlayback(assetEntityId, 9000020, false, false, false);
        } else {
            ForceAnimationPlayback(assetEntityId, 10000020, false, false, false);
        }
L10:
        SetEventFlagID(eventFlagId2, ON);
        DisableObjAct(assetEntityId2, -1);
        EndEvent();
    }
L0:
    GotoIf(S18, value == 10);
    GotoIf(S17, value == 9);
    GotoIf(S16, value == 8);
    GotoIf(S15, value == 7);
    GotoIf(S14, value == 6);
    GotoIf(S13, value == 5);
    GotoIf(S12, value == 4);
    GotoIf(S11, value == 3);
    GotoIf(S10, value == 2);
    GotoIf(S9, value == 1);
    ForceAnimationPlayback(assetEntityId, 10, false, false, true);
    Goto(L15);
S9:
    ForceAnimationPlayback(assetEntityId, 1000010, false, false, true);
    Goto(L15);
S10:
    ForceAnimationPlayback(assetEntityId, 2000010, false, false, true);
    Goto(L15);
S11:
    ForceAnimationPlayback(assetEntityId, 3000010, false, false, true);
    Goto(L15);
S12:
    ForceAnimationPlayback(assetEntityId, 4000010, false, false, true);
    Goto(L15);
S13:
    ForceAnimationPlayback(assetEntityId, 5000010, false, false, true);
    Goto(L15);
S14:
    ForceAnimationPlayback(assetEntityId, 6000010, false, false, true);
    Goto(L15);
S15:
    ForceAnimationPlayback(assetEntityId, 7000010, false, false, true);
    Goto(L15);
S16:
    ForceAnimationPlayback(assetEntityId, 8000010, false, false, true);
    Goto(L15);
S17:
    ForceAnimationPlayback(assetEntityId, 9000010, false, false, true);
    Goto(L15);
S18:
    ForceAnimationPlayback(assetEntityId, 10000010, false, false, true);
L15:
    SetEventFlagID(eventFlagId2, OFF);
    DisableObjAct(assetEntityId3, -1);
    EndEvent();
});

// 【共通】2フロア移動エレベータ_初回起動 -- [Common] 2-floor moving elevator_first activation
$Event(90005502, Restart, function(eventFlagId, assetEntityId, areaEntityId) {
    DisableNetworkSync();
    EndIf(EventFlag(eventFlagId));
    WaitFixedTimeFrames(2);
    DisableObjAct(assetEntityId, -1);
    areaChr = InArea(10000, areaEntityId)
        && (CharacterType(10000, TargetType.Alive) || CharacterType(10000, TargetType.GrayPhantom));
    WaitFor(areaChr || ActionButtonInArea(8301, assetEntityId) || EventFlag(eventFlagId));
    if (!areaChr.Passed) {
        EndIf(EventFlag(eventFlagId));
        DisplayGenericDialog(4000, PromptType.OKCANCEL, NumberofOptions.OneButton, 0, 3);
        RestartEvent();
    }
L0:
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
    RestartEvent();
});

// 【共通】2フロア移動エレベータ_初回起動Ver2 -- [Common] 2-floor moving elevator_Initial startup Ver2
$Event(90015502, Restart, function(eventFlagId, assetEntityId, areaEntityId) {
    DisableNetworkSync();
    EndIf(EventFlag(eventFlagId));
    WaitFixedTimeFrames(2);
    DisableObjAct(assetEntityId, -1);
    areaChrHp = InArea(10000, areaEntityId)
        && (CharacterType(10000, TargetType.Alive) || CharacterType(10000, TargetType.GrayPhantom))
        && CharacterHPValue(10000) != 0;
    WaitFor(areaChrHp || ActionButtonInArea(8301, assetEntityId) || EventFlag(eventFlagId));
    if (!areaChrHp.Passed) {
        EndIf(EventFlag(eventFlagId));
        DisplayGenericDialog(4000, PromptType.OKCANCEL, NumberofOptions.OneButton, 0, 3);
        RestartEvent();
    }
L0:
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
    RestartEvent();
});

// 【共通】2軸移動エレベータ -- [Common] 2-axis moving elevator
$Event(90005503, Default, function(eventFlagId, eventFlagId2, value, assetEntityId, areaEntityId, areaEntityId2, areaEntityId3, areaEntityId4, eventFlagId3, eventFlagId4, eventFlagId5) {
    if (!(((EventFlag(eventFlagId) && EventFlag(eventFlagId2))
        || (!EventFlag(eventFlagId) && !EventFlag(eventFlagId2)))
        && EventFlag(eventFlagId3))) {
        if (EventFlag(eventFlagId2)) {
            flag = !EventFlag(eventFlagId);
            cond &= InArea(10000, areaEntityId) && !CharacterHasSpEffect(10000, 4800);
            if (eventFlagId5 != 0) {
                cond &= EventFlag(eventFlagId5);
            }
            areaSpFlag &= InArea(10000, areaEntityId4) && !CharacterHasSpEffect(10000, 4800);
            if (eventFlagId5 != 0) {
                areaSpFlag &= EventFlag(eventFlagId5);
            }
            WaitFor(flag || cond || areaSpFlag);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId3, ON);
                SetNetworkconnectedEventFlagID(eventFlagId, OFF);
            }
            SetEventFlagID(eventFlagId2, OFF);
            GotoIf(S3, value == 4);
            GotoIf(S2, value == 3);
            GotoIf(S1, value == 2);
            GotoIf(S0, value == 1);
            ForceAnimationPlayback(assetEntityId, 21, false, true, true);
            Goto(L2);
S0:
            ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
            Goto(L2);
S1:
            ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
            Goto(L2);
S2:
            ForceAnimationPlayback(assetEntityId, 3000021, false, true, true);
            Goto(L2);
S3:
            ForceAnimationPlayback(assetEntityId, 4000021, false, true, true);
L2:
            WaitFor(
                AssetBackread(assetEntityId, Equal, 1)
                    && ((!AllPlayersInArea(areaEntityId3) && !AllPlayersInArea(areaEntityId2))
                        || EventFlag(eventFlagId)));
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
                GotoIf(S7, value == 4);
                GotoIf(S6, value == 3);
                GotoIf(S5, value == 2);
                GotoIf(S4, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, false, true);
                Goto(L12);
S4:
                ForceAnimationPlayback(assetEntityId, 1000110, false, false, true);
                Goto(L12);
S5:
                ForceAnimationPlayback(assetEntityId, 2000110, false, false, true);
                Goto(L12);
S6:
                ForceAnimationPlayback(assetEntityId, 3000110, false, false, true);
                Goto(L12);
S7:
                ForceAnimationPlayback(assetEntityId, 4000110, false, false, true);
            } else {
L3:
                GotoIf(S11, value == 4);
                GotoIf(S10, value == 3);
                GotoIf(S9, value == 2);
                GotoIf(S8, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, true, true);
                Goto(L12);
S8:
                ForceAnimationPlayback(assetEntityId, 1000110, false, true, true);
                Goto(L12);
S9:
                ForceAnimationPlayback(assetEntityId, 2000110, false, true, true);
                Goto(L12);
S10:
                ForceAnimationPlayback(assetEntityId, 3000110, false, true, true);
                Goto(L12);
S11:
                ForceAnimationPlayback(assetEntityId, 4000110, false, true, true);
            }
L12:
            RestartEvent();
        }
L0:
        flag2 = EventFlag(eventFlagId);
        areaSpFlag2 &= InArea(10000, areaEntityId3) && !CharacterHasSpEffect(10000, 4800);
        if (eventFlagId5 != 0) {
            areaSpFlag2 &= EventFlag(eventFlagId5);
        }
        areaSpFlag3 &= InArea(10000, areaEntityId2) && !CharacterHasSpEffect(10000, 4800);
        if (eventFlagId5 != 0) {
            areaSpFlag3 &= EventFlag(eventFlagId5);
        }
        WaitFor(flag2 || areaSpFlag2 || areaSpFlag3);
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            DisableObjAct(areaEntityId, -1);
        }
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId3, ON);
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
        SetEventFlagID(eventFlagId2, ON);
        if (!flag2.Passed) {
            GotoIf(L4, EventFlag(eventFlagId4));
            GotoIf(S15, value == 4);
            GotoIf(S14, value == 3);
            GotoIf(S13, value == 2);
            GotoIf(S12, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L5);
S12:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
            Goto(L5);
S13:
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
            Goto(L5);
S14:
            ForceAnimationPlayback(assetEntityId, 3000012, false, true, true);
            Goto(L5);
S15:
            ForceAnimationPlayback(assetEntityId, 4000012, false, true, true);
        } else {
L4:
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, ON);
            }
            WaitFixedTimeSeconds(2);
            GotoIf(S19, value == 4);
            GotoIf(S18, value == 3);
            GotoIf(S17, value == 2);
            GotoIf(S16, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L14);
S16:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
            Goto(L14);
S17:
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
            Goto(L14);
S18:
            ForceAnimationPlayback(assetEntityId, 3000012, false, true, true);
            Goto(L14);
S19:
            ForceAnimationPlayback(assetEntityId, 4000012, false, true, true);
L14:
            ForceAnimationPlayback(areaEntityId, 3, false, false, true);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
            }
        }
L5:
        cond &= AssetBackread(assetEntityId, Equal, 1)
            && ((!AllPlayersInArea(areaEntityId) && !AllPlayersInArea(areaEntityId4))
                || !EventFlag(eventFlagId));
        WaitFor(cond);
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
            GotoIf(S23, value == 4);
            GotoIf(S22, value == 3);
            GotoIf(S21, value == 2);
            GotoIf(S20, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, false, true);
            Goto(L15);
S20:
            ForceAnimationPlayback(assetEntityId, 1000120, false, false, true);
            Goto(L15);
S21:
            ForceAnimationPlayback(assetEntityId, 2000120, false, false, true);
            Goto(L15);
S22:
            ForceAnimationPlayback(assetEntityId, 3000120, false, false, true);
            Goto(L15);
S23:
            ForceAnimationPlayback(assetEntityId, 4000120, false, false, true);
        } else {
L6:
            GotoIf(S27, value == 4);
            GotoIf(S26, value == 3);
            GotoIf(S25, value == 2);
            GotoIf(S24, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, false, true);
            Goto(L15);
S24:
            ForceAnimationPlayback(assetEntityId, 1000120, false, false, true);
            Goto(L15);
S25:
            ForceAnimationPlayback(assetEntityId, 2000120, false, false, true);
            Goto(L15);
S26:
            ForceAnimationPlayback(assetEntityId, 3000120, false, false, true);
            Goto(L15);
S27:
            ForceAnimationPlayback(assetEntityId, 4000120, false, false, true);
        }
L15:
        RestartEvent();
    }
L9:
    WaitFor(!EventFlag(eventFlagId3));
    RestartEvent();
});

// 【共通】2軸移動エレベータ_初期設定 -- [Common] 2-axis moving elevator_Initial settings
$Event(90005504, Default, function(eventFlagId, eventFlagId2, value, entityId, eventFlagId3) {
    if (PlayerIsInOwnWorld()) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    if (EventFlag(eventFlagId)) {
        if (value != 4) {
            GotoIf(S2, value == 3);
            GotoIf(S1, value == 2);
            GotoIf(S0, value == 1);
            ForceAnimationPlayback(entityId, 20, false, false, false);
            Goto(L10);
S0:
            ForceAnimationPlayback(entityId, 1000020, false, false, false);
            Goto(L10);
S1:
            ForceAnimationPlayback(entityId, 2000020, false, false, false);
            Goto(L10);
S2:
            ForceAnimationPlayback(entityId, 3000020, false, false, false);
        } else {
            ForceAnimationPlayback(entityId, 4000020, false, false, false);
            Goto(L10);
        }
L10:
        SetEventFlagID(eventFlagId2, ON);
        EndEvent();
    }
L0:
    GotoIf(S6, value == 4);
    GotoIf(S5, value == 3);
    GotoIf(S4, value == 2);
    GotoIf(S3, value == 1);
    ForceAnimationPlayback(entityId, 10, false, false, true);
    Goto(L15);
S3:
    ForceAnimationPlayback(entityId, 1000010, false, false, true);
    Goto(L15);
S4:
    ForceAnimationPlayback(entityId, 2000010, false, false, true);
    Goto(L15);
S5:
    ForceAnimationPlayback(entityId, 3000010, false, false, true);
    Goto(L15);
S6:
    ForceAnimationPlayback(entityId, 4000010, false, false, true);
L15:
    SetEventFlagID(eventFlagId2, OFF);
    EndEvent();
});

// 【共通】神門エレベータ -- [Common] Shinmon Elevator
$Event(90005505, Default, function(eventFlagId, eventFlagId2, value, assetEntityId, assetEntityId2, objactEventFlag, assetEntityId3, objactEventFlag2, eventFlagId3, eventFlagId4, eventFlagId5) {
    if (!(((EventFlag(eventFlagId) && EventFlag(eventFlagId2))
        || (!EventFlag(eventFlagId) && !EventFlag(eventFlagId2)))
        && EventFlag(eventFlagId3))) {
        if (EventFlag(eventFlagId2)) {
            if (PlayerIsInOwnWorld()) {
                EnableObjAct(assetEntityId3, -1);
                DisableObjAct(assetEntityId2, -1);
            }
            obj = ObjActEventFlag(objactEventFlag2);
            flag = !EventFlag(eventFlagId);
            if (eventFlagId5 != 0) {
                flagAct &= EventFlag(eventFlagId5);
            }
            flagAct &= ActionButtonInArea(8320, assetEntityId);
            WaitFor(obj || flag || flagAct);
            if (PlayerIsInOwnWorld()) {
                DisableObjAct(assetEntityId3, -1);
            }
            if (PlayerIsInOwnWorld()) {
                SetNetworkconnectedEventFlagID(eventFlagId3, ON);
                SetNetworkconnectedEventFlagID(eventFlagId, OFF);
            }
            SetEventFlagID(eventFlagId2, OFF);
            GotoIf(L1, flagAct.Passed);
            GotoIf(L2, obj.Passed);
            GotoIf(L2, EventFlag(eventFlagId4));
            GotoIf(S1, value == 2);
            GotoIf(S0, value == 1);
            ForceAnimationPlayback(assetEntityId, 21, false, true, true);
            Goto(L3);
S0:
            ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
            Goto(L3);
S1:
            ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
            Goto(L3);
L1:
            IssueShortWarpRequest(10000, TargetEntityType.Asset, assetEntityId, 191);
            ForceAnimationPlayback(10000, 60200, false, false, false);
            GotoIf(S3, value == 2);
            GotoIf(S2, value == 1);
            ForceAnimationPlayback(assetEntityId, 21, false, true, true);
            Goto(L3);
S2:
            ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
            Goto(L3);
S3:
            ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
            Goto(L3);
L2:
            SetNetworkconnectedEventFlagID(eventFlagId4, ON);
            WaitFixedTimeSeconds(2);
            if (value != 2) {
                GotoIf(S4, value == 1);
                ForceAnimationPlayback(assetEntityId, 21, false, true, true);
                Goto(L11);
S4:
                ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
            } else {
                ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
            }
L11:
            ForceAnimationPlayback(assetEntityId3, 3, false, false, true);
            SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
L3:
            WaitFor(AssetBackread(assetEntityId, Equal, 1));
            if (PlayerIsInOwnWorld()) {
                SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
                GotoIf(S6, value == 2);
                GotoIf(S5, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, false, true);
                Goto(L12);
S5:
                ForceAnimationPlayback(assetEntityId, 1000110, false, false, true);
                Goto(L12);
S6:
                ForceAnimationPlayback(assetEntityId, 2000110, false, false, true);
            } else {
L4:
                if (value != 2) {
                    GotoIf(S7, value == 1);
                    ForceAnimationPlayback(assetEntityId, 110, false, true, true);
                    Goto(L12);
S7:
                    ForceAnimationPlayback(assetEntityId, 1000110, false, true, true);
                } else {
                    ForceAnimationPlayback(assetEntityId, 2000110, false, true, true);
                }
            }
L12:
            RestartEvent();
        }
L0:
        if (PlayerIsInOwnWorld()) {
            EnableObjAct(assetEntityId2, -1);
            DisableObjAct(assetEntityId3, -1);
        }
        obj2 = ObjActEventFlag(objactEventFlag);
        flag2 = EventFlag(eventFlagId);
        if (eventFlagId5 != 0) {
            flagAct2 &= EventFlag(eventFlagId5);
        }
        flagAct2 &= ActionButtonInArea(8320, assetEntityId);
        WaitFor(obj2 || flag2 || flagAct2);
        if (PlayerIsInOwnWorld()) {
            DisableObjAct(assetEntityId2, -1);
        }
        if (PlayerIsInOwnWorld()) {
            SetNetworkconnectedEventFlagID(eventFlagId3, ON);
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
        SetEventFlagID(eventFlagId2, ON);
        GotoIf(L5, flagAct2.Passed);
        GotoIf(L6, obj2.Passed);
        GotoIf(L6, EventFlag(eventFlagId4));
        GotoIf(S9, value == 2);
        GotoIf(S8, value == 1);
        ForceAnimationPlayback(assetEntityId, 12, false, true, true);
        Goto(L7);
S8:
        ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
        Goto(L7);
S9:
        ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
        Goto(L7);
L5:
        IssueShortWarpRequest(10000, TargetEntityType.Asset, assetEntityId, 191);
        ForceAnimationPlayback(10000, 60200, false, false, false);
        GotoIf(S11, value == 2);
        GotoIf(S10, value == 1);
        ForceAnimationPlayback(assetEntityId, 12, false, true, true);
        Goto(L7);
S10:
        ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
        Goto(L7);
S11:
        ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
        Goto(L7);
L6:
        SetNetworkconnectedEventFlagID(eventFlagId4, ON);
        WaitFixedTimeSeconds(2);
        if (value != 2) {
            GotoIf(S12, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L14);
S12:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
        } else {
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
        }
L14:
        ForceAnimationPlayback(assetEntityId2, 3, false, false, true);
        SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
L7:
        WaitFor(AssetBackread(assetEntityId, Equal, 1));
        if (PlayerIsInOwnWorld()) {
            SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
            GotoIf(S14, value == 2);
            GotoIf(S13, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, false, true);
            Goto(L15);
S13:
            ForceAnimationPlayback(assetEntityId, 1000120, false, false, true);
            Goto(L15);
S14:
            ForceAnimationPlayback(assetEntityId, 2000120, false, false, true);
        } else {
L8:
            if (value != 2) {
                GotoIf(S15, value == 1);
                ForceAnimationPlayback(assetEntityId, 120, false, true, true);
                Goto(L15);
S15:
                ForceAnimationPlayback(assetEntityId, 1000120, false, true, true);
            } else {
                ForceAnimationPlayback(assetEntityId, 2000120, false, true, true);
            }
        }
L15:
        RestartEvent();
    }
L9:
    WaitFor(!EventFlag(eventFlagId3));
    RestartEvent();
});

// 【共通】神塔エレベータ -- [Common] Shrine tower elevator
$Event(90005507, Default, function(eventFlagId, eventFlagId2, value, assetEntityId, entityId, areaEntityId, entityId2, areaEntityId2, areaEntityId3, areaEntityId4, eventFlagId3, eventFlagId4, eventFlagId5) {
    if (!(((EventFlag(eventFlagId) && EventFlag(eventFlagId2))
        || (!EventFlag(eventFlagId) && !EventFlag(eventFlagId2)))
        && EventFlag(eventFlagId3))) {
        if (EventFlag(eventFlagId2)) {
            area = InArea(10000, areaEntityId2);
            flag = !EventFlag(eventFlagId);
            areaFlag &= InArea(10000, areaEntityId3);
            if (eventFlagId5 != 0) {
                areaFlag &= EventFlag(eventFlagId5);
            }
            WaitFor(area || flag || areaFlag);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId3, ON);
                SetNetworkconnectedEventFlagID(eventFlagId, OFF);
            }
            SetEventFlagID(eventFlagId2, OFF);
            if (!area.Passed) {
                GotoIf(L1, EventFlag(eventFlagId4));
                ForceAnimationPlayback(entityId2, 1, false, false, true);
                GotoIf(S9, value == 10);
                GotoIf(S8, value == 9);
                GotoIf(S7, value == 8);
                GotoIf(S6, value == 7);
                GotoIf(S5, value == 6);
                GotoIf(S4, value == 5);
                GotoIf(S3, value == 4);
                GotoIf(S2, value == 3);
                GotoIf(S1, value == 2);
                GotoIf(S0, value == 1);
                ForceAnimationPlayback(assetEntityId, 21, false, true, true);
                Goto(L2);
S0:
                ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
                Goto(L2);
S1:
                ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
                Goto(L2);
S2:
                ForceAnimationPlayback(assetEntityId, 3000021, false, true, true);
                Goto(L2);
S3:
                ForceAnimationPlayback(assetEntityId, 4000021, false, true, true);
                Goto(L2);
S4:
                ForceAnimationPlayback(assetEntityId, 5000021, false, true, true);
                Goto(L2);
S5:
                ForceAnimationPlayback(assetEntityId, 6000021, false, true, true);
                Goto(L2);
S6:
                ForceAnimationPlayback(assetEntityId, 7000021, false, true, true);
                Goto(L2);
S7:
                ForceAnimationPlayback(assetEntityId, 8000021, false, true, true);
                Goto(L2);
S8:
                ForceAnimationPlayback(assetEntityId, 9000021, false, true, true);
                Goto(L2);
S9:
                ForceAnimationPlayback(assetEntityId, 10000021, false, true, true);
            } else {
L1:
                if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                    SetNetworkconnectedEventFlagID(eventFlagId4, ON);
                }
                ForceAnimationPlayback(entityId2, 1, false, false, true);
                WaitFixedTimeSeconds(0.5);
                GotoIf(S19, value == 10);
                GotoIf(S18, value == 9);
                GotoIf(S17, value == 8);
                GotoIf(S16, value == 7);
                GotoIf(S15, value == 6);
                GotoIf(S14, value == 5);
                GotoIf(S13, value == 4);
                GotoIf(S12, value == 3);
                GotoIf(S11, value == 2);
                GotoIf(S10, value == 1);
                ForceAnimationPlayback(assetEntityId, 21, false, true, true);
                Goto(L11);
S10:
                ForceAnimationPlayback(assetEntityId, 1000021, false, true, true);
                Goto(L11);
S11:
                ForceAnimationPlayback(assetEntityId, 2000021, false, true, true);
                Goto(L11);
S12:
                ForceAnimationPlayback(assetEntityId, 3000021, false, true, true);
                Goto(L11);
S13:
                ForceAnimationPlayback(assetEntityId, 4000021, false, true, true);
                Goto(L11);
S14:
                ForceAnimationPlayback(assetEntityId, 5000021, false, true, true);
                Goto(L11);
S15:
                ForceAnimationPlayback(assetEntityId, 6000021, false, true, true);
                Goto(L11);
S16:
                ForceAnimationPlayback(assetEntityId, 7000021, false, true, true);
                Goto(L11);
S17:
                ForceAnimationPlayback(assetEntityId, 8000021, false, true, true);
                Goto(L11);
S18:
                ForceAnimationPlayback(assetEntityId, 9000021, false, true, true);
                Goto(L11);
S19:
                ForceAnimationPlayback(assetEntityId, 10000021, false, true, true);
L11:
                if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                    SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
                }
            }
L2:
            WaitFor(
                AssetBackread(assetEntityId, Equal, 1)
                    && (!AllPlayersInArea(areaEntityId4) || EventFlag(eventFlagId)));
            ForceAnimationPlayback(entityId, 3, false, false, true);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
                GotoIf(S29, value == 10);
                GotoIf(S28, value == 9);
                GotoIf(S27, value == 8);
                GotoIf(S26, value == 7);
                GotoIf(S25, value == 6);
                GotoIf(S24, value == 5);
                GotoIf(S23, value == 4);
                GotoIf(S22, value == 3);
                GotoIf(S21, value == 2);
                GotoIf(S20, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, false, true);
                Goto(L12);
S20:
                ForceAnimationPlayback(assetEntityId, 1000110, false, false, true);
                Goto(L12);
S21:
                ForceAnimationPlayback(assetEntityId, 2000110, false, false, true);
                Goto(L12);
S22:
                ForceAnimationPlayback(assetEntityId, 3000110, false, false, true);
                Goto(L12);
S23:
                ForceAnimationPlayback(assetEntityId, 4000110, false, false, true);
                Goto(L12);
S24:
                ForceAnimationPlayback(assetEntityId, 5000110, false, false, true);
                Goto(L12);
S25:
                ForceAnimationPlayback(assetEntityId, 6000110, false, false, true);
                Goto(L12);
S26:
                ForceAnimationPlayback(assetEntityId, 7000110, false, false, true);
                Goto(L12);
S27:
                ForceAnimationPlayback(assetEntityId, 8000110, false, false, true);
                Goto(L12);
S28:
                ForceAnimationPlayback(assetEntityId, 9000110, false, false, true);
                Goto(L12);
S29:
                ForceAnimationPlayback(assetEntityId, 10000110, false, false, true);
            } else {
L3:
                GotoIf(S39, value == 10);
                GotoIf(S38, value == 9);
                GotoIf(S37, value == 8);
                GotoIf(S36, value == 7);
                GotoIf(S35, value == 6);
                GotoIf(S34, value == 5);
                GotoIf(S33, value == 4);
                GotoIf(S32, value == 3);
                GotoIf(S31, value == 2);
                GotoIf(S30, value == 1);
                ForceAnimationPlayback(assetEntityId, 110, false, true, true);
                Goto(L12);
S30:
                ForceAnimationPlayback(assetEntityId, 1000110, false, true, true);
                Goto(L12);
S31:
                ForceAnimationPlayback(assetEntityId, 2000110, false, true, true);
                Goto(L12);
S32:
                ForceAnimationPlayback(assetEntityId, 3000110, false, true, true);
                Goto(L12);
S33:
                ForceAnimationPlayback(assetEntityId, 4000110, false, true, true);
                Goto(L12);
S34:
                ForceAnimationPlayback(assetEntityId, 5000110, false, true, true);
                Goto(L12);
S35:
                ForceAnimationPlayback(assetEntityId, 6000110, false, true, true);
                Goto(L12);
S36:
                ForceAnimationPlayback(assetEntityId, 7000110, false, true, true);
                Goto(L12);
S37:
                ForceAnimationPlayback(assetEntityId, 8000110, false, true, true);
                Goto(L12);
S38:
                ForceAnimationPlayback(assetEntityId, 9000110, false, true, true);
                Goto(L12);
S39:
                ForceAnimationPlayback(assetEntityId, 10000110, false, true, true);
            }
L12:
            RestartEvent();
        }
L0:
        area2 = InArea(10000, areaEntityId);
        flag2 = EventFlag(eventFlagId);
        areaSpFlag &= InArea(10000, areaEntityId4) && !CharacterHasSpEffect(10000, 4800);
        if (eventFlagId5 != 0) {
            areaSpFlag &= EventFlag(eventFlagId5);
        }
        WaitFor(area2 || flag2 || areaSpFlag);
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId3, ON);
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
        SetEventFlagID(eventFlagId2, ON);
        if (!area2.Passed) {
            GotoIf(L4, EventFlag(eventFlagId4));
            ForceAnimationPlayback(entityId, 1, false, false, true);
            GotoIf(S49, value == 10);
            GotoIf(S48, value == 9);
            GotoIf(S47, value == 8);
            GotoIf(S46, value == 7);
            GotoIf(S45, value == 6);
            GotoIf(S44, value == 5);
            GotoIf(S43, value == 4);
            GotoIf(S42, value == 3);
            GotoIf(S41, value == 2);
            GotoIf(S40, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L5);
S40:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
            Goto(L5);
S41:
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
            Goto(L5);
S42:
            ForceAnimationPlayback(assetEntityId, 3000012, false, true, true);
            Goto(L5);
S43:
            ForceAnimationPlayback(assetEntityId, 4000012, false, true, true);
            Goto(L5);
S44:
            ForceAnimationPlayback(assetEntityId, 5000012, false, true, true);
            Goto(L5);
S45:
            ForceAnimationPlayback(assetEntityId, 6000012, false, true, true);
            Goto(L5);
S46:
            ForceAnimationPlayback(assetEntityId, 7000012, false, true, true);
            Goto(L5);
S47:
            ForceAnimationPlayback(assetEntityId, 8000012, false, true, true);
            Goto(L5);
S48:
            ForceAnimationPlayback(assetEntityId, 9000012, false, true, true);
            Goto(L5);
S49:
            ForceAnimationPlayback(assetEntityId, 10000012, false, true, true);
        } else {
L4:
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, ON);
            }
            ForceAnimationPlayback(entityId, 1, false, false, true);
            WaitFixedTimeSeconds(0.5);
            GotoIf(S59, value == 10);
            GotoIf(S58, value == 9);
            GotoIf(S57, value == 8);
            GotoIf(S56, value == 7);
            GotoIf(S55, value == 6);
            GotoIf(S54, value == 5);
            GotoIf(S53, value == 4);
            GotoIf(S52, value == 3);
            GotoIf(S51, value == 2);
            GotoIf(S50, value == 1);
            ForceAnimationPlayback(assetEntityId, 12, false, true, true);
            Goto(L14);
S50:
            ForceAnimationPlayback(assetEntityId, 1000012, false, true, true);
            Goto(L14);
S51:
            ForceAnimationPlayback(assetEntityId, 2000012, false, true, true);
            Goto(L14);
S52:
            ForceAnimationPlayback(assetEntityId, 3000012, false, true, true);
            Goto(L14);
S53:
            ForceAnimationPlayback(assetEntityId, 4000012, false, true, true);
            Goto(L14);
S54:
            ForceAnimationPlayback(assetEntityId, 5000012, false, true, true);
            Goto(L14);
S55:
            ForceAnimationPlayback(assetEntityId, 6000012, false, true, true);
            Goto(L14);
S56:
            ForceAnimationPlayback(assetEntityId, 7000012, false, true, true);
            Goto(L14);
S57:
            ForceAnimationPlayback(assetEntityId, 8000012, false, true, true);
            Goto(L14);
S58:
            ForceAnimationPlayback(assetEntityId, 9000012, false, true, true);
            Goto(L14);
S59:
            ForceAnimationPlayback(assetEntityId, 10000012, false, true, true);
L14:
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
            }
        }
L5:
        WaitFor(
            AssetBackread(assetEntityId, Equal, 1)
                && (!AllPlayersInArea(areaEntityId3) || !EventFlag(eventFlagId)));
        ForceAnimationPlayback(entityId2, 3, false, false, true);
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId3, OFF);
            GotoIf(S69, value == 10);
            GotoIf(S68, value == 9);
            GotoIf(S67, value == 8);
            GotoIf(S66, value == 7);
            GotoIf(S65, value == 6);
            GotoIf(S64, value == 5);
            GotoIf(S63, value == 4);
            GotoIf(S62, value == 3);
            GotoIf(S61, value == 2);
            GotoIf(S60, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, false, true);
            Goto(L15);
S60:
            ForceAnimationPlayback(assetEntityId, 1000120, false, false, true);
            Goto(L15);
S61:
            ForceAnimationPlayback(assetEntityId, 2000120, false, false, true);
            Goto(L15);
S62:
            ForceAnimationPlayback(assetEntityId, 3000120, false, false, true);
            Goto(L15);
S63:
            ForceAnimationPlayback(assetEntityId, 4000120, false, false, true);
            Goto(L15);
S64:
            ForceAnimationPlayback(assetEntityId, 5000120, false, false, true);
            Goto(L15);
S65:
            ForceAnimationPlayback(assetEntityId, 6000120, false, false, true);
            Goto(L15);
S66:
            ForceAnimationPlayback(assetEntityId, 7000120, false, false, true);
            Goto(L15);
S67:
            ForceAnimationPlayback(assetEntityId, 8000120, false, false, true);
            Goto(L15);
S68:
            ForceAnimationPlayback(assetEntityId, 9000120, false, false, true);
            Goto(L15);
S69:
            ForceAnimationPlayback(assetEntityId, 10000120, false, false, true);
        } else {
L6:
            GotoIf(S79, value == 10);
            GotoIf(S78, value == 9);
            GotoIf(S77, value == 8);
            GotoIf(S76, value == 7);
            GotoIf(S75, value == 6);
            GotoIf(S74, value == 5);
            GotoIf(S73, value == 4);
            GotoIf(S72, value == 3);
            GotoIf(S71, value == 2);
            GotoIf(S70, value == 1);
            ForceAnimationPlayback(assetEntityId, 120, false, true, true);
            Goto(L15);
S70:
            ForceAnimationPlayback(assetEntityId, 1000120, false, true, true);
            Goto(L15);
S71:
            ForceAnimationPlayback(assetEntityId, 2000120, false, true, true);
            Goto(L15);
S72:
            ForceAnimationPlayback(assetEntityId, 3000120, false, true, true);
            Goto(L15);
S73:
            ForceAnimationPlayback(assetEntityId, 4000120, false, true, true);
            Goto(L15);
S74:
            ForceAnimationPlayback(assetEntityId, 5000120, false, true, true);
            Goto(L15);
S75:
            ForceAnimationPlayback(assetEntityId, 6000120, false, true, true);
            Goto(L15);
S76:
            ForceAnimationPlayback(assetEntityId, 7000120, false, true, true);
            Goto(L15);
S77:
            ForceAnimationPlayback(assetEntityId, 8000120, false, true, true);
            Goto(L15);
S78:
            ForceAnimationPlayback(assetEntityId, 9000120, false, true, true);
            Goto(L15);
S79:
            ForceAnimationPlayback(assetEntityId, 10000120, false, true, true);
        }
L15:
        RestartEvent();
    }
L9:
    WaitFor(!EventFlag(eventFlagId3));
    RestartEvent();
});

// 【共通】神塔エレベータ_初期設定 -- [Common] Shinto tower elevator_Initial settings
$Event(90005508, Restart, function(eventFlagId, eventFlagId2, value, entityId, assetEntityId, assetEntityId2, eventFlagId3) {
    if (PlayerIsInOwnWorld()) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    if (EventFlag(eventFlagId)) {
        if (value != 10) {
            GotoIf(S8, value == 9);
            GotoIf(S7, value == 8);
            GotoIf(S6, value == 7);
            GotoIf(S5, value == 6);
            GotoIf(S4, value == 5);
            GotoIf(S3, value == 4);
            GotoIf(S2, value == 3);
            GotoIf(S1, value == 2);
            GotoIf(S0, value == 1);
            ForceAnimationPlayback(entityId, 20, false, false, false);
            Goto(L10);
S0:
            ForceAnimationPlayback(entityId, 1000020, false, false, false);
            Goto(L10);
S1:
            ForceAnimationPlayback(entityId, 2000020, false, false, false);
            Goto(L10);
S2:
            ForceAnimationPlayback(entityId, 3000020, false, false, false);
            Goto(L10);
S3:
            ForceAnimationPlayback(entityId, 4000020, false, false, false);
            Goto(L10);
S4:
            ForceAnimationPlayback(entityId, 5000020, false, false, false);
            Goto(L10);
S5:
            ForceAnimationPlayback(entityId, 6000020, false, false, false);
            Goto(L10);
S6:
            ForceAnimationPlayback(entityId, 7000020, false, false, false);
            Goto(L10);
S7:
            ForceAnimationPlayback(entityId, 8000020, false, false, false);
            Goto(L10);
S8:
            ForceAnimationPlayback(entityId, 9000020, false, false, false);
        } else {
            ForceAnimationPlayback(entityId, 10000020, false, false, false);
        }
L10:
        SetEventFlagID(eventFlagId2, ON);
        ReproduceAssetAnimation(assetEntityId, 1);
        EndEvent();
    }
L0:
    GotoIf(S18, value == 10);
    GotoIf(S17, value == 9);
    GotoIf(S16, value == 8);
    GotoIf(S15, value == 7);
    GotoIf(S14, value == 6);
    GotoIf(S13, value == 5);
    GotoIf(S12, value == 4);
    GotoIf(S11, value == 3);
    GotoIf(S10, value == 2);
    GotoIf(S9, value == 1);
    ForceAnimationPlayback(entityId, 10, false, false, true);
    Goto(L15);
S9:
    ForceAnimationPlayback(entityId, 1000010, false, false, true);
    Goto(L15);
S10:
    ForceAnimationPlayback(entityId, 2000010, false, false, true);
    Goto(L15);
S11:
    ForceAnimationPlayback(entityId, 3000010, false, false, true);
    Goto(L15);
S12:
    ForceAnimationPlayback(entityId, 4000010, false, false, true);
    Goto(L15);
S13:
    ForceAnimationPlayback(entityId, 5000010, false, false, true);
    Goto(L15);
S14:
    ForceAnimationPlayback(entityId, 6000010, false, false, true);
    Goto(L15);
S15:
    ForceAnimationPlayback(entityId, 7000010, false, false, true);
    Goto(L15);
S16:
    ForceAnimationPlayback(entityId, 8000010, false, false, true);
    Goto(L15);
S17:
    ForceAnimationPlayback(entityId, 9000010, false, false, true);
    Goto(L15);
S18:
    ForceAnimationPlayback(entityId, 10000010, false, false, true);
L15:
    SetEventFlagID(eventFlagId2, OFF);
    ReproduceAssetAnimation(assetEntityId2, 1);
    EndEvent();
});

// 【共通】一方通行扉_鍵付き扉 -- [Common] One-way door_locked door
$Event(90005510, Default, function(eventFlagId, assetEntityId, objactEventFlag, objactParamId, messageId, value) {
    EndIf(!PlayerIsInOwnWorld());
    if (!EventFlag(eventFlagId)) {
        WaitFor(PlayerIsInOwnWorld() && ObjActEventFlag(objactEventFlag));
        WaitFixedTimeRealFrames(1);
        DisplayGenericDialog(messageId, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId, 3);
        SetEventFlagID(eventFlagId, ON);
    }
L0:
    if (value != 1) {
        DisableObjAct(assetEntityId, objactParamId);
    }
    EndEvent();
});

// 【共通】一方通行扉_領域扉 -- [Common] One-way door_area door
$Event(90005511, Default, function(eventFlagId, assetEntityId, objactEventFlag, objactParamId, value) {
    if (!EventFlag(eventFlagId)) {
        WaitFor(ObjActEventFlag(objactEventFlag));
        SetEventFlagID(eventFlagId, ON);
    }
L0:
    EndIf(value == 1);
    DisableObjActAssignIdx(assetEntityId, objactParamId, 0);
    DisableObjActAssignIdx(assetEntityId, objactParamId, 1);
    DisableObjActAssignIdx(assetEntityId, objactParamId, 2);
    DisableObjActAssignIdx(assetEntityId, objactParamId, 3);
    EndEvent();
});

// 【共通】一方通行扉_領域扉_特殊効果付与 -- [Common] One-way door_Area door_Special effects added
$Event(90005512, Default, function(eventFlagId, areaEntityId, areaEntityId2) {
    DisableNetworkSync();
    if (!EventFlag(eventFlagId)) {
        WaitFor(EventFlag(eventFlagId) || (InArea(10000, areaEntityId) && PlayerIsInOwnWorld()));
        RestartIf(EventFlag(eventFlagId));
        SetSpEffect(10000, 4150);
        WaitFixedTimeSeconds(3);
        RestartEvent();
    }
L0:
    WaitFor(InArea(10000, areaEntityId) || InArea(10000, areaEntityId2));
    SetSpEffect(10000, 4150);
    WaitFixedTimeSeconds(3);
    RestartEvent();
});

// 【共通】一方通行扉_レバー扉 -- [Common] One-way door_Lever door
$Event(90005513, Restart, function(eventFlagId, assetEntityId, assetEntityId2, objactEventFlag, objactParamId, animationId, animationId2) {
    if (EventFlag(eventFlagId)) {
        DisableObjAct(assetEntityId2, objactParamId);
        ReproduceAssetAnimation(assetEntityId, animationId2);
        EndEvent();
    }
L0:
    WaitFor(!EventFlag(eventFlagId) && ObjActEventFlag(objactEventFlag));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    DisableObjAct(assetEntityId2, objactParamId);
    ForceAnimationPlayback(assetEntityId, animationId, false, false, false);
});

// 【共通】両開き扉_エラーメッセージ -- [Common] Double door_error message
$Event(90005515, Default, function(eventFlagId, entityId) {
    DisableNetworkSync();
    WaitFor((PlayerIsInOwnWorld() && ActionButtonInArea(7101, entityId)) || EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId));
    DisplayGenericDialog(4010, PromptType.OKCANCEL, NumberofOptions.OneButton, entityId, 3);
    RestartEvent();
});

// 【共通】蹴りおろし梯子 -- [Common] Kick-down ladder
$Event(90005520, Restart, function(eventFlagId, assetEntityId, eventFlagId2, eventFlagId3) {
    if (EventFlag(eventFlagId)) {
        ReproduceAssetAnimation(assetEntityId, 2);
        RegisterLadder(eventFlagId2, eventFlagId3, assetEntityId);
        EndEvent();
    }
L0:
    WaitFor(PlayerIsInOwnWorld() && ActionButtonInArea(9200, assetEntityId));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    if (PlayerIsInOwnWorld()) {
        RotateCharacter(10000, assetEntityId, 60210, false);
    }
    ForceAnimationPlayback(assetEntityId, 1, false, true, false);
    RegisterLadder(eventFlagId2, eventFlagId3, assetEntityId);
});

// 【共通】魔法壁 -- [Common] Magic wall
$Event(90005525, Restart, function(eventFlagId, assetEntityId) {
    if (!EventFlag(eventFlagId)) {
        WaitFor(
            PlayerIsInOwnWorld() && HasDamageType(assetEntityId, 20000, DamageType.Unspecified));
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
        ForceAnimationPlayback(assetEntityId, 1, false, true, false);
    }
L0:
    DisableAsset(assetEntityId);
});

// 【共通】魔法封印壁 -- [Common] Magic sealing wall
$Event(900055278, Restart, function(eventFlagId, assetEntityId, sfxId, actionButtonParameterId, messageId, value, value2, value3) {
    if (EventFlag(eventFlagId)) {
        DisableAsset(assetEntityId);
        EndEvent();
    }
L0:
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 101, sfxId);
    onlineAct = PlayerIsInOwnWorld() && ActionButtonInArea(actionButtonParameterId, assetEntityId);
    flag = EventFlag(eventFlagId);
    WaitFor(onlineAct || flag);
    if (!flag.Passed) {
        DisplayGenericDialog(messageId, PromptType.YESNO, NumberofOptions.NoButtons, eventFlagId, 3);
        WaitFixedTimeSeconds(1);
        RestartEvent();
    }
L1:
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    DeleteAssetfollowingSFX(assetEntityId, true);
    DisableAsset(assetEntityId);
    EndEvent();
    EndIf(Signed(value) == 0);
    EndIf(Signed(value2) == 0);
    EndIf(Signed(value3) == 0);
});

// 【共通】レバー操作ギミック -- [Common] Lever operation gimmick
$Event(90005540, Restart, function(eventFlagId, assetEntityId, assetEntityId2, objactEventFlag, objactParamId, animationId, animationId2) {
    if (EventFlag(eventFlagId)) {
        DisableObjAct(assetEntityId2, objactParamId);
        ReproduceAssetAnimation(assetEntityId, animationId2);
        EndEvent();
    }
L0:
    WaitFor(!EventFlag(eventFlagId) && ObjActEventFlag(objactEventFlag));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    DisableObjAct(assetEntityId2, objactParamId);
    ForceAnimationPlayback(assetEntityId, animationId, false, false, false);
});

// 【共通】宝箱 -- [Common] Treasure chest
$Event(90005550, Restart, function(eventFlagId, assetEntityId, objactEventFlag) {
    if (EventFlag(eventFlagId)) {
        ReproduceAssetAnimation(assetEntityId, 1);
        DisableObjAct(assetEntityId, -1);
        EnableAssetTreasure(assetEntityId);
        EndEvent();
    }
L0:
    DisableAssetTreasure(assetEntityId);
    WaitFor(ObjActEventFlag(objactEventFlag));
    WaitFixedTimeFrames(10);
    EnableAssetTreasure(assetEntityId);
    SetEventFlagID(eventFlagId, ON);
});

$Event(90005555, Restart, function(eventFlagId, itemLotId, assetEntityId) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    CreateAssetfollowingSFX(assetEntityId, 100, 842050);
    WaitFor(PlayerIsInOwnWorld() && ActionButtonInArea(209200, assetEntityId));
    RotateCharacter(10000, assetEntityId, -1, true);
    ForceAnimationPlayback(10000, 61040, false, false, false);
    WaitFixedTimeSeconds(0.5);
    PlaySE(assetEntityId, SoundType.EnvironmentalSound, 420009000);
    WaitFixedTimeSeconds(1.5);
    DeleteAssetfollowingSFX(assetEntityId, true);
    SpawnOneshotSFX(TargetEntityType.Asset, assetEntityId, 100, 842051);
    WaitFixedTimeSeconds(1.5);
    AwardItemsIncludingClients(itemLotId);
});

$Event(90005556, Restart, function(assetEntityId, eventFlagId) {
    DisableAssetTreasure(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndIf(EventFlag(eventFlagId));
    WaitFor(TimeOfDayInRange(20, 0, 0, 5, 59, 59));
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 100, 861245);
    EnableAssetTreasure(assetEntityId);
    WaitFor(!TimeOfDayInRange(20, 0, 0, 5, 59, 59) || EventFlag(eventFlagId));
    RestartEvent();
});

$Event(90005557, Restart, function(entityId) {
    ForceAnimationPlayback(entityId, 3, false, false, false);
    WaitFor(TimeOfDayInRange(20, 0, 0, 5, 59, 59));
    ForceAnimationPlayback(entityId, 2, false, false, false);
    WaitFixedTimeSeconds(6);
    ForceAnimationPlayback(entityId, 0, false, false, false);
    WaitFor(!TimeOfDayInRange(20, 0, 0, 5, 59, 59));
    ForceAnimationPlayback(entityId, 1, false, false, false);
    WaitFixedTimeSeconds(6);
    RestartEvent();
});

// 【共通】破壊アセット宝 -- [Common] Destruction asset treasure
$Event(90005560, Restart, function(eventFlagId, assetEntityId, value) {
    if (EventFlag(eventFlagId)) {
        ReproduceAssetDestruction(assetEntityId, 1);
        EnableAssetTreasure(assetEntityId);
        EndEvent();
    }
L0:
    if (Signed(value) == 0) {
        DeleteAssetfollowingSFX(assetEntityId, true);
        CreateAssetfollowingSFX(assetEntityId, 200, 803300);
    }
    DisableAssetTreasure(assetEntityId);
    WaitFor(AssetDestroyed(assetEntityId, Equal, 1));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    EnableAssetTreasure(assetEntityId);
    if (Signed(value) == 0) {
        DeleteAssetfollowingSFX(assetEntityId, true);
    }
});

// 【共通】ジェスチャー入手 -- [Common] Get gesture
$Event(90005570, Default, function(eventFlagId, gestureParamId, assetEntityId, value, value2, value3) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    if (Signed(value2) == 3) {
        CreateAssetfollowingSFX(assetEntityId, 90, 6103);
    } else if (Signed(value2) == 2) {
        CreateAssetfollowingSFX(assetEntityId, 90, 6102);
    } else if (Signed(value2) == 1) {
        CreateAssetfollowingSFX(assetEntityId, 90, 6101);
    } else {
        CreateAssetfollowingSFX(assetEntityId, 90, 6100);
    }
L1:
    onlineFlagAct &= PlayerIsInOwnWorld() && !EventFlag(eventFlagId);
    if (Signed(value) == 2) {
        onlineFlagAct &= ActionButtonInArea(4250, assetEntityId);
    } else if (Signed(value) == 1) {
        onlineFlagAct &= ActionButtonInArea(4300, assetEntityId);
    } else {
        onlineFlagAct &= ActionButtonInArea(4200, assetEntityId);
    }
L2:
    WaitFor(onlineFlagAct || EventFlag(eventFlagId));
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndIf(EventFlag(eventFlagId));
    WaitFixedTimeRealFrames(1);
    AwardGesture(gestureParamId);
    SetEventFlagID(eventFlagId, ON);
    EndIf(Signed(0) == value3);
});

// 【共通】ジェスチャー入手with宝 -- [Common] Gesture acquisition with treasure
$Event(900005571, Default, function(eventFlagId, gestureParamId, eventFlagId2, value) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(PlayerIsInOwnWorld() && EventFlag(eventFlagId2));
    AwardGesture(gestureParamId);
    SetEventFlagID(eventFlagId, ON);
    EndIf(Signed(0) == value);
});

$Event(900005580, Restart, function(eventFlagId, assetEntityId, eventFlagId2) {
    DisableAsset(assetEntityId);
    DisableAssetTreasure(assetEntityId);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId) || EventFlag(eventFlagId2));
    EndIf(EventFlag(eventFlagId));
    EnableAsset(assetEntityId);
    EnableAssetTreasure(assetEntityId);
    WaitFor(EventFlag(eventFlagId));
    DisableAsset(assetEntityId);
    DisableAssetTreasure(assetEntityId);
});

// 【共通】フィールド篝火登録 -- [Common] Field bonfire registration
$Event(90005600, Restart, function(eventFlagId, assetEntityId, enemyDeactivationDistance, chrEntityId) {
    RegisterBonfire(eventFlagId, assetEntityId, 0, 0, 0, enemyDeactivationDistance);
    if (0 != chrEntityId) {
        DisableCharacterCollision(chrEntityId);
    }
    if (!EventFlag(eventFlagId)) {
        WaitFor(
            PlayerIsInOwnWorld()
                && EntityInRadiusOfEntity(10000, assetEntityId, 5, 1)
                && EventFlag(eventFlagId));
        EndIf(0 == chrEntityId);
        DisableCharacterCollision(chrEntityId);
        SetSpEffect(chrEntityId, 530);
        WaitFixedTimeSeconds(1.5);
    }
L0:
    DisableCharacter(chrEntityId);
});

// 【共通】汎用ワープ -- [Common] General purpose warp
$Event(90005605, Restart, function(assetEntityId, areaId, blockId, regionId, indexId, initialAreaEntityId, subareaNamePopupMessageId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, messageId, timeSeconds, timeSeconds2) {
    EndIf(!PlayerIsInOwnWorld());
    SetEventFlagID(eventFlagId2, OFF);
    SetEventFlagID(eventFlagId3, OFF);
    if (!ThisEventSlot()) {
        DeleteAssetfollowingSFX(assetEntityId, true);
        SetEventFlagID(eventFlagId, OFF);
        WaitFixedTimeFrames(1);
    }
    onlineFlag |= HasMultiplayerState(MultiplayerState.Multiplayer)
        || HasMultiplayerState(MultiplayerState.MultiplayerPending);
    if (eventFlagId4 != 0) {
        onlineFlag |= !EventFlag(eventFlagId4);
    }
    if (!onlineFlag) {
        if (!EventFlag(eventFlagId)) {
            CreateAssetfollowingSFX(assetEntityId, 200, 806870);
            SetEventFlagID(eventFlagId, ON);
        }
    }
L1:
    onlineFlagAct &= PlayerIsInOwnWorld()
        && !(HasMultiplayerState(MultiplayerState.Multiplayer)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending));
    if (eventFlagId4 != 0) {
        if (Signed(messageId) == 0) {
            onlineFlagAct &= EventFlag(eventFlagId4) && EventFlag(eventFlagId);
        }
    }
    onlineFlagAct &= ActionButtonInArea(9140, assetEntityId);
    onlineFlag2 |= HasMultiplayerState(MultiplayerState.Multiplayer)
        || HasMultiplayerState(MultiplayerState.MultiplayerPending);
    if (eventFlagId4 != 0) {
        onlineFlag2 |= !EventFlag(eventFlagId4);
    }
    onlineFlag3 = onlineFlag2 && EventFlag(eventFlagId);
    onlineFlag4 |= HasMultiplayerState(MultiplayerState.Multiplayer)
        || HasMultiplayerState(MultiplayerState.MultiplayerPending);
    if (eventFlagId4 != 0) {
        onlineFlag4 |= !EventFlag(eventFlagId4);
    }
    onlineFlag5 = !onlineFlag4 && !EventFlag(eventFlagId);
    flag = EventFlagState(CHANGE, TargetEventFlagType.EventFlag, eventFlagId4);
    onlineFlagAct2 |= onlineFlagAct || onlineFlag3 || onlineFlag5;
    if (eventFlagId4 != 0) {
        onlineFlagAct2 |= flag;
    }
    WaitFor(onlineFlagAct2);
    if (!onlineFlagAct.Passed) {
        if (onlineFlag3.Passed) {
            DeleteAssetfollowingSFX(assetEntityId, true);
            SetEventFlagID(eventFlagId, OFF);
        }
L2:
        WaitFixedTimeSeconds(0.033);
        RestartEvent();
    }
L3:
    if (!(eventFlagId4 == 0 || Signed(messageId) == 0)) {
        if (!EventFlag(eventFlagId4)) {
            DisplayGenericDialog(messageId, PromptType.YESNO, NumberofOptions.NoButtons, assetEntityId, 3);
            WaitFixedTimeSeconds(1);
            RestartEvent();
        }
    }
L4:
    DisplayGenericDialogAndSetEventFlags(4300, PromptType.YESNO, NumberofOptions.TwoButtons, assetEntityId, 3, eventFlagId2, eventFlagId3, eventFlagId3);
    if (!EventFlag(eventFlagId2)) {
        WaitFixedTimeSeconds(1);
        RestartEvent();
    }
L6:
    RestartIf(
        HasMultiplayerState(MultiplayerState.Multiplayer)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending));
    RotateCharacter(10000, assetEntityId, -1, true);
    ForceAnimationPlayback(10000, 60490, false, false, false);
    WaitFixedTimeSeconds(3);
    WarpPlayer(areaId, blockId, regionId, indexId, initialAreaEntityId, subareaNamePopupMessageId);
    RestartEvent();
    WaitFixedTimeSeconds(timeSeconds);
    WaitFixedTimeSeconds(timeSeconds2);
});

// 【共通】馬禁止領域 -- [Common] Horse prohibited area
$Event(900005610, Default, function(assetEntityId, dummypolyId, sfxId, eventFlagId) {
    DisableNetworkSync();
    DeleteAssetfollowingSFX(assetEntityId, true);
    if (0 != eventFlagId) {
        flagChr &= EventFlag(eventFlagId);
    }
    flagChr &= CharacterRidingMount(10000);
    WaitFor(flagChr);
    CreateAssetfollowingSFX(assetEntityId, dummypolyId, sfxId);
    if (0 != eventFlagId) {
        flagChr2 |= !EventFlag(eventFlagId);
    }
    flagChr2 |= !CharacterRidingMount(10000);
    WaitFor(flagChr2);
    RestartEvent();
});

$Event(90005615, Default, function(areaEntityId, eventFlagId) {
    DisableNetworkSync();
    if (eventFlagId != 0) {
        flagAreaOnline &= EventFlag(eventFlagId);
    }
    flagAreaOnline &= InArea(20000, areaEntityId) && !HasMultiplayerState(MultiplayerState.Invasion);
    WaitFor(flagAreaOnline);
    SetSpEffect(20000, 9621);
    WaitFixedTimeSeconds(0.1);
    if (eventFlagId != 0) {
        flagAreaOnline2 |= !EventFlag(eventFlagId);
    }
    flagAreaOnline2 |= !InArea(20000, areaEntityId) || HasMultiplayerState(MultiplayerState.Invasion);
    WaitFor(flagAreaOnline2);
    WaitFixedTimeSeconds(0.1);
    ClearSpEffect(20000, 9621);
    RestartEvent();
});

// 【共通】震える死の根 -- [Common] Trembling roots of death
$Event(90005616, Default, function(eventFlagId, areaEntityId) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(
        PlayerIsInOwnWorld()
            && !EventFlag(eventFlagId)
            && EventFlag(400239)
            && InArea(10000, areaEntityId));
    DisplayBlinkingMessage(20600);
});

// 【共通】ガーゴイル像 -- [Common] Gargoyle statue
$Event(90005620, Default, function(eventFlagId, assetEntityId, assetEntityId2, assetEntityId3, eventFlagId2, eventFlagId3, value) {
    DisableNetworkSync();
    if (EventFlag(eventFlagId)) {
        EndEvent();
    }
L0:
    SetEventFlagID(eventFlagId2, OFF);
    SetEventFlagID(eventFlagId3, OFF);
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 200, 806040);
    if (assetEntityId3 != 0) {
        CreateAssetfollowingSFX(assetEntityId, 201, 806040);
    }
    DisableAsset(assetEntityId2);
    if (assetEntityId3 != 0) {
        DisableAsset(assetEntityId3);
    }
    WaitFor(
        (PlayerIsInOwnWorld() && ActionButtonInArea(9220, assetEntityId)) || EventFlag(eventFlagId));
    if (!EventFlag(eventFlagId)) {
        DisplayGenericDialogAndSetEventFlags(108000, PromptType.YESNO, NumberofOptions.TwoButtons, assetEntityId, 1.75, eventFlagId2, eventFlagId3, eventFlagId3);
        if (!EventFlag(eventFlagId2)) {
            WaitFixedTimeSeconds(0.5);
            RestartEvent();
        }
L1:
        StoreItemAmountHeldInEventValue(ItemType.Goods, 8000, 9580, 8);
        GotoIf(L2, assetEntityId3 != 0);
        GotoIf(L3, EventValue(9580, 8) >= 1);
L2:
        GotoIf(L4, EventValue(9580, 8) >= 2);
        ForceAnimationPlayback(10000, 50050, false, false, false);
        WaitFixedTimeSeconds(1.4);
        if (EventValue(9580, 8) < 1) {
            DisplayGenericDialog(308000, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId, 3);
            RestartEvent();
        }
L5:
        DisplayGenericDialog(408000, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId, 3);
        RestartEvent();
L3:
        IssueShortWarpRequest(10000, TargetEntityType.Asset, assetEntityId, 191);
        ForceAnimationPlayback(10000, 60810, false, false, false);
        WaitFixedTimeSeconds(2.7);
        DisplayGenericDialog(208000, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId, 3);
        EnableAsset(assetEntityId2);
        RemoveItemFromPlayer(ItemType.Goods, 8000, 1);
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
        Goto(L8);
L4:
        IssueShortWarpRequest(10000, TargetEntityType.Asset, assetEntityId, 191);
        ForceAnimationPlayback(10000, 60810, false, false, false);
        WaitFixedTimeSeconds(2.67);
        EnableAsset(assetEntityId2);
        ForceAnimationPlayback(10000, 60811, false, false, false);
        WaitFixedTimeSeconds(1.5);
        DisplayGenericDialog(208000, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId, 3);
        EnableAsset(assetEntityId3);
        RemoveItemFromPlayer(ItemType.Goods, 8000, 2);
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    } else {
L9:
        EnableAsset(assetEntityId2);
        EnableAsset(assetEntityId3);
    }
L8:
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndEvent();
    EndIf(Signed(0) == value);
});

// 【共通】ガーゴイル像_封印扉 -- [Common] Gargoyle statue_Sealed door
$Event(90005621, Default, function(eventFlagId, assetEntityId) {
    if (EventFlag(eventFlagId)) {
        DisableAsset(assetEntityId);
        EndEvent();
    }
L0:
    CreateAssetfollowingSFX(assetEntityId, 101, 806042);
    WaitFor(PlayerIsInOwnWorld() && EventFlag(eventFlagId));
    DeleteAssetfollowingSFX(assetEntityId, true);
    PlaySE(assetEntityId, SoundType.SFX, 90011);
    WaitFixedTimeSeconds(0.5);
    DisableAsset(assetEntityId);
});

// 【共通】遠見台 -- [Common] Far viewing platform
$Event(90005630, Restart, function(farviewId, assetEntityId, dummypolyId) {
    DisableNetworkSync();
    WaitFor(PlayerIsInOwnWorld() && ActionButtonInArea(9270, assetEntityId));
    UseFarviewCamera(farviewId, assetEntityId, dummypolyId);
    RotateCharacter(10000, assetEntityId, -1, true);
    RotateCharacter(10000, assetEntityId, 60480, false);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】剣碑解読 -- [Common] Sword monument decipherment
$Event(90005631, Restart, function(entityId, messageId) {
    DisableNetworkSync();
    WaitFor(ActionButtonInArea(9330, entityId));
    DisplayGenericDialog(messageId, PromptType.YESNO, NumberofOptions.NoButtons, entityId, 3);
    WaitFixedTimeSeconds(2);
    RestartEvent();
});

// 【共通】絵画宝探し_アトリエ -- [Common] Painting treasure hunt_Atelier
$Event(90005632, Restart, function(eventFlagId, assetEntityId, itemLotId) {
    EndIf(EventFlag(eventFlagId));
    EndIf(!PlayerIsInOwnWorld());
    DeleteAssetfollowingSFX(assetEntityId, false);
    CreateAssetfollowingSFX(assetEntityId, 200, 806840);
    WaitFor(PlayerIsInOwnWorld() && ActionButtonInArea(9310, assetEntityId));
    DeleteAssetfollowingSFX(assetEntityId, true);
    PlaySE(assetEntityId, SoundType.SFX, 806841);
    WaitFixedTimeSeconds(0.1);
    AwardItemsIncludingClients(itemLotId);
});

// 【共通】絵画宝探し_モチーフ -- [Common] Painting treasure hunt_motif
$Event(90005633, Restart, function(eventFlagId, eventFlagId2, chrEntityId, animationId, animationId2, assetEntityId, assetEntityId2) {
    SetSpEffect(eventFlagId, 10124);
    DisableCharacter(chrEntityId);
    DisableCharacterCollision(chrEntityId);
    DisableAsset(assetEntityId);
    DisableAsset(assetEntityId2);
    DisableAssetTreasure(assetEntityId2);
    EndIf(EventFlag(eventFlagId));
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(
        PlayerIsInOwnWorld()
            && EventFlag(eventFlagId2)
            && EntityInRadiusOfEntity(chrEntityId, 10000, 15, 1));
    EnableCharacter(chrEntityId);
    ClearSpEffect(eventFlagId, 10124);
    ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    EnableAsset(assetEntityId);
    EnableAsset(assetEntityId2);
    ForceAnimationPlayback(assetEntityId, 2, false, false, false);
    WaitFor(
        PlayerIsInOwnWorld()
            && EventFlag(eventFlagId2)
            && EntityInRadiusOfEntity(chrEntityId, 10000, 5, 1));
    ForceAnimationPlayback(chrEntityId, animationId2, false, false, false);
    ForceAnimationPlayback(assetEntityId, 1, false, false, false);
    WaitFixedTimeSeconds(3.8);
    DisableCharacter(chrEntityId);
    DisableAsset(assetEntityId);
    EnableAssetTreasure(assetEntityId2);
});

// 【共通】霊体キャンドル -- [Common] Spirit Candle
$Event(90005636, Restart, function(eventFlagId, chrEntityId, entityId, spEffectId, chrEntityId2, areaEntityId, eventFlagId2, patrolInformationEntityId, value) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        EndEvent();
    }
L0:
    if (!EventFlag(eventFlagId2)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        DisableCharacterAI(chrEntityId);
    }
L1:
    onlineFlag = PlayerIsInOwnWorld() && EventFlag(eventFlagId);
    flagArea = EventFlag(eventFlagId2) && InArea(chrEntityId, areaEntityId);
    onlineFlagAreaAct |= onlineFlag || flagArea;
    onlineFlagAreaAct2 &= PlayerIsInOwnWorld() && !EventFlag(eventFlagId);
    if (EventFlag(eventFlagId2)) {
        onlineFlagAreaAct2 &= !EntityInRadiusOfEntity(10000, chrEntityId, 30, 1);
    }
    onlineFlagAreaAct2 &= ActionButtonInArea(9300, entityId);
    onlineFlagAreaAct |= onlineFlagAreaAct2;
    WaitFor(onlineFlagAreaAct);
    if (EventFlag(eventFlagId2)) {
        SpawnOneshotSFX(TargetEntityType.Character, chrEntityId, 905, 643041);
        SpawnOneshotSFX(TargetEntityType.Character, chrEntityId, 960, 643040);
        WaitFixedTimeSeconds(0.2);
        DisableCharacter(chrEntityId);
        DisableCharacterAI(chrEntityId);
        if (flagArea.Passed) {
            WarpCharacterAndCopyFloor(chrEntityId, TargetEntityType.Area, chrEntityId2, -1, 10000);
            WaitFixedTimeSeconds(0.1);
        }
L2:
        GotoIf(L3, !onlineFlagAreaAct2.Passed);
    }
L1:
    if (!EventFlag(eventFlagId2)) {
        SetNetworkconnectedEventFlagID(eventFlagId2, ON);
    }
    WarpCharacterAndCopyFloor(chrEntityId, TargetEntityType.Area, chrEntityId2, -1, 10000);
    if (0 != patrolInformationEntityId) {
        ChangeCharacterPatrolBehavior(chrEntityId, patrolInformationEntityId);
    }
    WaitFixedTimeFrames(1);
    EnableCharacter(chrEntityId);
    DisableCharacterCollision(chrEntityId);
    ForceAnimationPlayback(chrEntityId, 20028, false, false, false);
    WaitFixedTimeSeconds(0.5);
    EnableCharacterAI(chrEntityId);
    SetSpEffect(chrEntityId, spEffectId);
L3:
    RestartEvent();
    EndIf(Signed(0) == value);
});

// 【共通】霊体キャンドル_出現 -- [Common] Spirit candle_appearance
$Event(90005637, Restart, function(eventFlagId, chrEntityId, areaEntityId) {
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId) || InArea(chrEntityId, areaEntityId));
    EndIf(EventFlag(eventFlagId));
    SetSpEffect(chrEntityId, 4463);
    WaitFixedTimeSeconds(3);
    RestartEvent();
});

$Event(90005638, Restart, function(eventFlagId, assetEntityId, assetEntityId2) {
    if (EventFlag(eventFlagId)) {
        DisableAsset(assetEntityId);
        DisableAsset(assetEntityId2);
        EndEvent();
    }
L0:
    EnableAssetInvunerability(assetEntityId);
    EnableAssetInvunerability(assetEntityId2);
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 100, 841075);
    DeleteAssetfollowingSFX(assetEntityId2, true);
    CreateAssetfollowingSFX(assetEntityId2, 100, 841076);
    WaitFor(PlayerIsInOwnWorld() && AssetHitBy(assetEntityId, 20000));
    DisableAssetInvunerability(assetEntityId);
    RequestAssetDestruction(assetEntityId, 0);
    DeleteAssetfollowingSFX(assetEntityId, true);
    DeleteAssetfollowingSFX(assetEntityId2, true);
    CreateAssetfollowingSFX(assetEntityId, 100, 841072);
    CreateAssetfollowingSFX(assetEntityId2, 100, 841072);
    DisableAssetInvunerability(assetEntityId2);
    WaitFixedTimeRealFrames(1);
    RequestAssetDestruction(assetEntityId2, 0);
    SetEventFlagID(eventFlagId, ON);
    WaitFixedTimeSeconds(2);
    DisplayGenericDialog(2020030, PromptType.OKCANCEL, NumberofOptions.OneButton, 0, 100);
});

$Event(90005639, Restart, function(eventFlagId, assetEntityId, assetEntityId2, assetEntityId3, timeSeconds) {
    if (EventFlag(eventFlagId)) {
        DisableAsset(assetEntityId);
        EnableAssetInvunerability(assetEntityId2);
        EnableAssetTreasure(assetEntityId3);
        EndEvent();
    }
L0:
    DisableAsset(assetEntityId3);
    DisableAssetTreasure(assetEntityId3);
    EnableAssetInvunerability(assetEntityId2);
    EnableAssetInvunerability(assetEntityId);
    WaitFor(PlayerIsInOwnWorld() && AssetHitBy(assetEntityId, 20000));
    DisableAssetInvunerability(assetEntityId);
    RequestAssetDestruction(assetEntityId, 0);
    WaitFixedTimeSeconds(timeSeconds);
    EnableAsset(assetEntityId3);
    EnableAssetTreasure(assetEntityId3);
    SetEventFlagID(eventFlagId, ON);
});

// 【共通】地下迷宮_入口扉 -- [Common] Underground labyrinth_entrance door
$Event(90005640, Restart, function(eventFlagId, assetEntityId) {
    if (EventFlag(eventFlagId)) {
        WaitFor(AssetBackread(assetEntityId, Equal, 1));
        ReproduceAssetAnimation(assetEntityId, 2);
        EndEvent();
    }
L0:
    WaitFor(
        AssetBackread(assetEntityId, Equal, 1)
            && EntityInRadiusOfEntity(10000, assetEntityId, 50, 1));
    SetEventFlagID(eventFlagId, ON);
    ForceAnimationPlayback(assetEntityId, 1, false, false, false);
});

// 【共通】地下小探索_迷宮脱出スペル[仮] -- [Common] Underground exploration_labyrinth escape spell [tentative]
$Event(90005645, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, assetEntityId, initialAreaEntityId, areaId, blockId, regionId, indexId) {
    if (!EventFlag(eventFlagId)) {
        DisableAsset(assetEntityId);
        WaitFor(
            PlayerIsInOwnWorld()
                && !EntityInRadiusOfEntity(10000, assetEntityId, 1, 1)
                && EventFlag(eventFlagId));
    }
L0:
    EnableAsset(assetEntityId);
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.MultiplayerPending)
            || HasMultiplayerState(MultiplayerState.Multiplayer))
            && ActionButtonInArea(9290, assetEntityId));
    DisplayGenericDialogAndSetEventFlags(4100, PromptType.YESNO, NumberofOptions.TwoButtons, assetEntityId, 3, eventFlagId2, eventFlagId3, eventFlagId3);
    if (!EventFlag(eventFlagId2)) {
        SetEventFlagID(eventFlagId3, ON);
        WaitFixedTimeSeconds(2);
        RestartEvent();
    }
L1:
    WaitFixedTimeSeconds(1);
    WarpPlayer(areaId, blockId, regionId, indexId, initialAreaEntityId, 0);
});

// 【共通】地下小探索_迷宮脱出スペル -- [Common] Underground exploration_labyrinth escape spell
$Event(90005646, Default, function(eventFlagId, eventFlagId2, eventFlagId3, assetEntityId, initialAreaEntityId, areaId, blockId, regionId, indexId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(PlayerIsInOwnWorld() && EventFlag(eventFlagId));
    if (!ThisEventSlot()) {
        CreateAssetfollowingSFX(assetEntityId, 190, 1300);
    }
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.MultiplayerPending)
            || HasMultiplayerState(MultiplayerState.Multiplayer))
            && ActionButtonInArea(9290, assetEntityId));
    DisplayGenericDialogAndSetEventFlags(4100, PromptType.YESNO, NumberofOptions.TwoButtons, assetEntityId, 3, eventFlagId2, eventFlagId3, eventFlagId3);
    if (!EventFlag(eventFlagId2)) {
        SetEventFlagID(eventFlagId3, ON);
        WaitFixedTimeSeconds(2);
        RestartEvent();
    }
L1:
    ForceAnimationPlayback(10000, 60460, false, false, false);
    WaitFixedTimeSeconds(2.5);
    WarpPlayer(areaId, blockId, regionId, indexId, initialAreaEntityId, 0);
});

// 【共通】英雄の墓_扉解放 -- [Common] Hero's Tomb_Door release
$Event(90005650, Default, function(eventFlagId, assetEntityId, assetEntityId2, objactEventFlag, objactParamId) {
    if (EventFlag(eventFlagId)) {
        ReproduceAssetAnimation(assetEntityId, 2);
        DisableObjAct(assetEntityId2, objactParamId);
        EndEvent();
    }
L0:
    WaitFor(PlayerIsInOwnWorld() && ObjActEventFlag(objactEventFlag));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    if (PlayerIsInOwnWorld()) {
        DisplayGenericDialog(4200, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId2, 5);
    } else {
        DisplayBlinkingMessage(4200);
    }
    ForceAnimationPlayback(assetEntityId, 1, false, false, false);
    EndEvent();
});

// 【共通】英雄の墓_扉解放_フラグ判定 -- [Common] Hero's Grave_Door Release_Flag Judgment
$Event(90005652, Default, function(eventFlagId, assetEntityId, eventFlagId2) {
    if (EventFlag(eventFlagId)) {
        ReproduceAssetAnimation(assetEntityId, 2);
        EndEvent();
    }
L0:
    WaitFor(PlayerIsInOwnWorld() && EventFlag(eventFlagId2));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    DisplayGenericDialog(4200, PromptType.OKCANCEL, NumberofOptions.NoButtons, 0, 5);
    ForceAnimationPlayback(assetEntityId, 1, false, false, false);
    EndEvent();
});

// 【共通】英雄の墓_扉エラーメッセージ -- [Common] Hero's Tomb_Door error message
$Event(90005651, Default, function(eventFlagId, entityId) {
    DisableNetworkSync();
    WaitFor(ActionButtonInArea(7200, entityId) || EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId));
    DisplayGenericDialog(4001, PromptType.OKCANCEL, NumberofOptions.NoButtons, entityId, 3);
    WaitFixedTimeFrames(1);
    RestartEvent();
});

// 【共通】英雄の墓_弓矢トラップ_TypeA -- [Common] Hero's Grave_Bow and Arrow Trap_TypeA
$Event(90005660, Default, function(chrEntityId, entityId, areaEntityId, behaviorId, entityId2, entityId3, entityId4) {
    CreateBulletOwner(chrEntityId);
    WaitFor(InArea(10000, areaEntityId));
    ForceAnimationPlayback(entityId, 1, false, true, false);
    WaitFixedTimeSeconds(0.5);
    if (Signed(behaviorId) != 0) {
        ShootBullet(chrEntityId, entityId2, -1, behaviorId, 0, 0, 0);
        ShootBullet(chrEntityId, entityId3, -1, behaviorId, 0, 0, 0);
        ShootBullet(chrEntityId, entityId4, -1, behaviorId, 0, 0, 0);
    } else {
        ShootBullet(chrEntityId, entityId2, -1, 102000, 0, 0, 0);
        ShootBullet(chrEntityId, entityId3, -1, 102000, 0, 0, 0);
        ShootBullet(chrEntityId, entityId4, -1, 102000, 0, 0, 0);
    }
    WaitFixedTimeSeconds(0.6);
    if (Signed(behaviorId) != 0) {
        ShootBullet(chrEntityId, entityId2, -1, behaviorId, 0, 0, 0);
        ShootBullet(chrEntityId, entityId3, -1, behaviorId, 0, 0, 0);
        ShootBullet(chrEntityId, entityId4, -1, behaviorId, 0, 0, 0);
    } else {
        ShootBullet(chrEntityId, entityId2, -1, 102000, 0, 0, 0);
        ShootBullet(chrEntityId, entityId3, -1, 102000, 0, 0, 0);
        ShootBullet(chrEntityId, entityId4, -1, 102000, 0, 0, 0);
    }
    WaitFixedTimeSeconds(0.6);
    if (Signed(behaviorId) != 0) {
        ShootBullet(chrEntityId, entityId2, -1, behaviorId, 0, 0, 0);
        ShootBullet(chrEntityId, entityId3, -1, behaviorId, 0, 0, 0);
        ShootBullet(chrEntityId, entityId4, -1, behaviorId, 0, 0, 0);
    } else {
        ShootBullet(chrEntityId, entityId2, -1, 102000, 0, 0, 0);
        ShootBullet(chrEntityId, entityId3, -1, 102000, 0, 0, 0);
        ShootBullet(chrEntityId, entityId4, -1, 102000, 0, 0, 0);
    }
    WaitFixedTimeSeconds(3);
    WaitFor(!AllPlayersInArea(areaEntityId));
    ForceAnimationPlayback(entityId, 3, false, true, false);
    RestartEvent();
});

// 【共通】英雄の墓_トラップエレベータ -- [Common] Hero's Tomb_Trap Elevator
$Event(90005670, Default, function(eventFlagId, eventFlagId2, eventFlagId3, entityId, areaEntityId, areaEntityId2, eventFlagId4) {
    if (!EventFlag(eventFlagId2)) {
        WaitFor(
            ((CharacterType(10000, TargetType.Alive)
                || CharacterType(10000, TargetType.BluePhantom)
                || CharacterType(10000, TargetType.WhitePhantom))
                && InArea(10000, areaEntityId)
                && !EventFlag(eventFlagId))
                || EventFlag(eventFlagId2));
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
        ForceAnimationPlayback(entityId, 12, false, true, false);
    }
L0:
    GotoIf(L10, !AllPlayersInArea(areaEntityId2));
    GotoIf(S0, 0 == eventFlagId4);
    GotoIf(L10, !EventFlag(eventFlagId4));
S0:
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId2, ON);
    }
    SetEventFlagID(eventFlagId3, ON);
    ForceAnimationPlayback(entityId, 20, false, true, false);
    RestartEvent();
L10:
    WaitFixedTimeSeconds(0.1);
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
    }
    ForceAnimationPlayback(entityId, 21, false, true, false);
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId, OFF);
        ForceAnimationPlayback(entityId, 10, false, false, false);
    } else {
        ForceAnimationPlayback(entityId, 10, false, true, false);
    }
    RestartEvent();
});

// 【共通】英雄の墓_トラップエレベータ_闇霊排除 -- [Common] Hero's Tomb_Trap Elevator_Dark Spirit Elimination
$Event(90005673, Default, function(eventFlagId, areaEntityId) {
    WaitFor(
        (CharacterType(10000, TargetType.Alive)
            || CharacterType(10000, TargetType.WhitePhantom)
            || CharacterType(10000, TargetType.BluePhantom))
            && InArea(10000, areaEntityId));
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
    chrArea = (CharacterType(10000, TargetType.BlackPhantom)
        || CharacterType(10000, TargetType.Invader)
        || CharacterType(10000, TargetType.Invader2)
        || CharacterType(10000, TargetType.Invader3))
        && InArea(10000, areaEntityId);
    WaitFor(chrArea || !AllPlayersInArea(areaEntityId));
    if (chrArea.Passed) {
        WaitFixedTimeSeconds(1);
    }
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    }
    RestartEvent();
});

// 【共通】英雄の墓_針ダメージ -- [Common] Hero's Tomb_Needle damage
$Event(90005671, Default, function(eventFlagId, eventFlagId2, eventFlagId3, dummypolyId, behaviorId) {
    DisableNetworkSync();
    WaitFor(
        EventFlag(eventFlagId) && InArea(10000, eventFlagId3) && CharacterHasSpEffect(10000, 4195));
    WarpAssetToCharacter(eventFlagId2, 10000, 93);
    WaitFixedTimeFrames(1);
    CreateDamagingAsset(eventFlagId3, eventFlagId2, dummypolyId, behaviorId, DamageTargetType.Character, 2, 0.1, 0);
    WaitFixedTimeFrames(1);
    DeleteAssetEvent(eventFlagId2);
    WaitFixedTimeSeconds(0.5);
    RestartEvent();
});

// 【共通】英雄の墓_針ダメージ_特殊効果付与 -- [Common] Hero's Tomb_Needle damage_Special effects added
$Event(90005672, Default, function(eventFlagId, areaEntityId) {
    WaitFor(EventFlag(eventFlagId) && InArea(10000, areaEntityId));
    SetSpEffect(10000, 4195);
    WaitFixedTimeSeconds(0.5);
    RestartEvent();
});

// 【共通】英雄の墓_ギロチン -- [Common] Tomb of the Hero_Guillotine
$Event(90005675, Default, function(eventFlagId, eventFlagId2, assetEntityId, areaEntityId, behaviorId, timeSeconds, value) {
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0) && EventFlag(eventFlagId)) {
        SetNetworkconnectedEventFlagID(eventFlagId, OFF);
        SetThisEventSlot(OFF);
    }
L10:
    WaitFor((InArea(10000, areaEntityId) || ThisEventSlot()) && !EventFlag(eventFlagId));
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
    if (!ThisEventSlot()) {
        WaitFixedTimeSeconds(timeSeconds);
    }
    if (Signed(1) != value) {
        ForceAnimationPlayback(assetEntityId, 1, false, false, false);
    } else {
        ForceAnimationPlayback(assetEntityId, 2, false, false, false);
    }
    if (Signed(behaviorId) != 0) {
        CreateBigDamagingAsset(eventFlagId2, assetEntityId, 30, 31, behaviorId, DamageTargetType.Character, 0.1, 1, 0);
    } else {
        CreateBigDamagingAsset(eventFlagId2, assetEntityId, 30, 31, 103000, DamageTargetType.Character, 0.1, 1, 0);
    }
    WaitFixedTimeSeconds(1);
    DeleteAssetEvent(eventFlagId2);
    WaitFixedTimeSeconds(4.1);
    WaitFixedTimeSeconds(0.1);
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    }
    RestartEvent();
});

// 【共通】英雄の墓_火吹き像_初期設定 -- [Common] Tomb of the Hero_Fire-breathing statue_Initial settings
$Event(90005680, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, assetEntityId) {
    if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
        SetEventFlagID(eventFlagId4, OFF);
    }
    WaitFor(AssetBackread(assetEntityId, Equal, 1));
    if (EventFlag(eventFlagId)) {
        ForceAnimationPlayback(assetEntityId, 20, false, false, false);
        SetEventFlagID(eventFlagId2, ON);
        SetEventFlagID(eventFlagId3, ON);
        EndEvent();
    }
L0:
    ForceAnimationPlayback(assetEntityId, 10, false, false, false);
    SetEventFlagID(eventFlagId2, OFF);
    SetEventFlagID(eventFlagId3, OFF);
    EndEvent();
});

// 【共通】英雄の墓_火吹き像_移動処理 -- [Common] Hero's Tomb_Fire-breathing statue_Movement process
$Event(90005681, Default, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, entityId) {
    if (!(((EventFlag(eventFlagId) && EventFlag(eventFlagId2))
        || (!EventFlag(eventFlagId) && !EventFlag(eventFlagId2)))
        && EventFlag(eventFlagId4))) {
        if (EventFlag(eventFlagId)) {
            WaitFor(
                !EventFlag(eventFlagId)
                    || (EventFlag(eventFlagId2)
                        && HasDamageType(entityId, 20000, DamageType.Unspecified)));
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId, OFF);
                SetNetworkconnectedEventFlagID(eventFlagId4, ON);
            }
            SetEventFlagID(eventFlagId2, OFF);
            SetEventFlagID(eventFlagId3, OFF);
            ForceAnimationPlayback(entityId, 21, false, true, false);
            if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
                SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
            }
            RestartEvent();
        }
L0:
        WaitFor(
            EventFlag(eventFlagId)
                || (!EventFlag(eventFlagId2) && HasDamageType(entityId, 20000, DamageType.Unspecified)));
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
            SetNetworkconnectedEventFlagID(eventFlagId4, ON);
        }
        SetEventFlagID(eventFlagId2, ON);
        ForceAnimationPlayback(entityId, 12, false, true, false);
        if (MapHasPermissionToUpdate(false, 0, 0, 0, 0)) {
            SetNetworkconnectedEventFlagID(eventFlagId4, OFF);
        }
        SetEventFlagID(eventFlagId3, ON);
        RestartEvent();
    }
L9:
    WaitFor(!EventFlag(eventFlagId4));
    RestartEvent();
});

// 【共通】英雄の墓_火吹き像_火炎処理 -- [Common] Hero's Tomb_Fire-breathing statue_Flame processing
$Event(90005682, Default, function(eventFlagId, entityId, areaEntityId, chrEntityId, behaviorId, behaviorId2, dummypolyId, dummypolyId2, dummypolyId3, dummypolyId4) {
    flagArea &= EventFlag(eventFlagId);
    if (areaEntityId != 0) {
        flagArea &= InArea(10000, areaEntityId);
    }
    WaitFor(flagArea);
    CreateBulletOwner(chrEntityId);
    if (Signed(dummypolyId) != 0) {
        if (Signed(behaviorId) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId, behaviorId, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId, 101100, 0, 0, 0);
        }
        if (Signed(behaviorId2) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId, behaviorId2, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId, 101102, 0, 0, 0);
        }
    }
L1:
    if (Signed(dummypolyId2) != 0) {
        if (Signed(behaviorId) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId2, behaviorId, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId2, 101100, 0, 0, 0);
        }
        if (Signed(behaviorId2) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId2, behaviorId2, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId2, 101102, 0, 0, 0);
        }
    }
L2:
    if (Signed(dummypolyId3) != 0) {
        if (Signed(behaviorId) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId3, behaviorId, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId3, 101100, 0, 0, 0);
        }
        if (Signed(behaviorId2) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId3, behaviorId2, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId3, 101102, 0, 0, 0);
        }
    }
L3:
    if (Signed(dummypolyId4) != 0) {
        if (Signed(behaviorId) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId4, behaviorId, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId4, 101100, 0, 0, 0);
        }
        if (Signed(behaviorId2) != 0) {
            ShootBullet(chrEntityId, entityId, dummypolyId4, behaviorId2, 0, 0, 0);
        } else {
            ShootBullet(chrEntityId, entityId, dummypolyId4, 101102, 0, 0, 0);
        }
    }
L4:
    WaitFixedTimeSeconds(7.2);
    RestartEvent();
});

// 【共通】英雄の墓_指示像 -- [Common] Hero's Tomb_Instruction Statue
$Event(90005683, Default, function(eventFlagId, assetEntityId, dummypolyId, eventFlagId2, eventFlagId3) {
    DisableNetworkSync();
    if (EventFlag(eventFlagId)) {
        DeleteAssetfollowingSFX(assetEntityId, true);
        SetEventFlagID(eventFlagId2, OFF);
        SetEventFlagID(eventFlagId3, OFF);
        EndEvent();
    }
L0:
    if (!EventFlag(eventFlagId2)) {
        WaitFor(ActionButtonInArea(9260, assetEntityId));
        DisplayGenericDialog(4210, PromptType.OKCANCEL, NumberofOptions.NoButtons, assetEntityId, 3);
        SetEventFlagID(eventFlagId2, ON);
        SetEventFlagID(eventFlagId3, ON);
    }
L1:
    if (1049551600 != assetEntityId) {
        CreateAssetfollowingSFX(assetEntityId, dummypolyId, 800530);
    } else {
L10:
        CreateAssetfollowingSFX(assetEntityId, dummypolyId, 800531);
    }
L1:
    WaitFor(EventFlag(eventFlagId));
    RestartEvent();
    CreateAssetfollowingSFX(assetEntityId, dummypolyId, 800530);
});

// 【共通】英雄の墓_メッセージ表示 -- [Common] Hero's Tomb_Message display
$Event(90005684, Default, function(entityId) {
    DisableNetworkSync();
    WaitFor(ActionButtonInArea(9260, entityId));
    DisplayGenericDialog(4210, PromptType.OKCANCEL, NumberofOptions.NoButtons, entityId, 3);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

// 【共通】英雄の墓_チャリオット初期設定 -- [Common] Hero's Tomb_Chariot initial settings
$Event(90005685, Default, function(chrEntityId) {
    EnableCharacterImmortality(chrEntityId);
    DisableCharacterInvincibility(chrEntityId);
    DisableLockOnPoint(chrEntityId, 220);
    DisableCharacterHPBarDisplay(chrEntityId);
    SetSpEffect(chrEntityId, 5000);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AlwaysUpdate);
});

// 【共通】英雄の墓_チャリオット弾丸作成 -- [Common] Hero's Tomb_Chariot bullet creation
$Event(90005686, Default, function(chrEntityId, eventFlagId) {
    WaitFor(EventFlag(eventFlagId));
    ShootBullet(chrEntityId, chrEntityId, 10, 244600980, 0, 0, 0);
    ShootBullet(chrEntityId, chrEntityId, 15, 244600980, 0, 0, 0);
    ShootBullet(chrEntityId, chrEntityId, 20, 244600981, 0, 0, 0);
    ShootBullet(chrEntityId, chrEntityId, 25, 244600981, 0, 0, 0);
    ShootBullet(chrEntityId, chrEntityId, 30, 244600981, 0, 0, 0);
    WaitFixedTimeFrames(1);
    RestartEvent();
});

// 【共通】英雄の墓_チャリオット巡回ルート指定_初回起動 -- [Common] Tomb of the Hero_Chariot patrol route specification_First launch
$Event(90005687, Default, function(chrEntityId, patrolInformationEntityId, areaEntityId) {
    EndIf(ThisEventSlot());
    WaitFor(InArea(10000, areaEntityId));
    ChangeCharacterPatrolBehavior(chrEntityId, patrolInformationEntityId);
    WaitFixedTimeFrames(1);
});

// 【共通】英雄の墓_チャリオット巡回ルート指定_XX -- [Common] Tomb of the Hero_Chariot patrol route specification_XX
$Event(90005688, Default, function(chrEntityId, areaEntityId, patrolInformationEntityId, areaEntityId2, patrolInformationEntityId2, areaEntityId3, patrolInformationEntityId3) {
    WaitFor(InArea(chrEntityId, areaEntityId));
    GotoIf(L1, InArea(10000, areaEntityId2));
    GotoIf(S0, 0 == areaEntityId3);
    GotoIf(L2, InArea(10000, areaEntityId3));
S0:
    ChangeCharacterPatrolBehavior(chrEntityId, patrolInformationEntityId);
    Goto(L20);
L1:
    ChangeCharacterPatrolBehavior(chrEntityId, patrolInformationEntityId2);
    Goto(L20);
L2:
    ChangeCharacterPatrolBehavior(30090400, patrolInformationEntityId3);
    Goto(L20);
L20:
    WaitFor(!InArea(chrEntityId, areaEntityId));
    RestartEvent();
});

// 【共通】落下死亡無効 -- [Common] Fall death invalidity
$Event(90005690, Restart, function(areaEntityId) {
    DisableNetworkSync();
    WaitFor(InArea(10000, areaEntityId));
    SetSpEffect(10000, 4080);
    WaitFor(!InArea(10000, areaEntityId));
    ClearSpEffect(10000, 4080);
    RestartEvent();
});

// 【共通】落下ダメージ無効 -- [Common] Falling damage disabled
$Event(90005691, Restart, function(areaEntityId) {
    DisableNetworkSync();
    WaitFor(InArea(10000, areaEntityId));
    SetSpEffect(10000, 4085);
    WaitFor(!InArea(10000, areaEntityId));
    ClearSpEffect(10000, 4085);
    RestartEvent();
});

// 【共通】常駐ダメージアセット -- [Common] Resident damage asset
$Event(90005694, Restart, function(eventFlagId, assetEntityId, dummypolyId, endingDummypolyId, behaviorId, radius, lifespan, repetitionTimeS) {
    DeleteAssetEvent(eventFlagId);
    if (Signed(0) == endingDummypolyId) {
        CreateDamagingAsset(eventFlagId, assetEntityId, dummypolyId, behaviorId, DamageTargetType.Character, radius, lifespan, repetitionTimeS);
    } else {
        CreateBigDamagingAsset(eventFlagId, assetEntityId, dummypolyId, endingDummypolyId, behaviorId, DamageTargetType.Character, radius, lifespan, repetitionTimeS);
    }
});

// 【共通】常駐ダメージアセット_破壊有り -- [Common] Permanent damage asset_destructed
$Event(90005695, Restart, function(eventFlagId, assetEntityId, dummypolyId, endingDummypolyId, behaviorId, radius, lifespan, repetitionTimeS) {
    DeleteAssetEvent(eventFlagId);
    EndIf(AssetDestroyed(assetEntityId, Equal, 1));
    if (Signed(0) == endingDummypolyId) {
        CreateDamagingAsset(eventFlagId, assetEntityId, dummypolyId, behaviorId, DamageTargetType.Character, radius, lifespan, repetitionTimeS);
    } else {
        CreateBigDamagingAsset(eventFlagId, assetEntityId, dummypolyId, endingDummypolyId, behaviorId, DamageTargetType.Character, radius, lifespan, repetitionTimeS);
    }
    WaitFor(AssetDestroyed(eventFlagId, Equal, 1));
    DeleteAssetEvent(eventFlagId);
});

// 【共通】NPC敵対化処理 -- [Common] NPC hostile processing
$Event(90005700, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, targetHPRatio, eventFlagId4, eventFlagId5, value) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(!EventFlag(3000));
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2));
    SetEventFlagID(eventFlagId3, OFF);
    WaitFor(
        !EventFlag(eventFlagId)
            && !EventFlag(eventFlagId2)
            && HPRatio(chrEntityId) > 0
            && (((HasDamageType(chrEntityId, 10000, DamageType.Unspecified)
                || HasDamageType(chrEntityId, 40000, DamageType.Unspecified)
                || CharacterHasSpEffect(chrEntityId, 1650000))
                && HPRatio(chrEntityId) < targetHPRatio)
                || CharacterHasSpEffect(chrEntityId, 9641)
                || EventFlag(eventFlagId3)));
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2));
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    SetSpEffect(chrEntityId, 9628);
    SetSpEffect(chrEntityId, 9635);
    if (Signed(1) != value) {
        BatchSetNetworkconnectedEventFlags(eventFlagId4, eventFlagId5, OFF);
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    } else {
L0:
        BatchSetNetworkconnectedEventFlags(eventFlagId4, eventFlagId5, OFF);
        SetNetworkconnectedEventFlagID(eventFlagId2, ON);
    }
L9:
    SaveRequest();
});

// 【共通】NPCがX回攻撃されたらフラグを立てる処理 -- [Common] Processing to set a flag when an NPC is attacked X times
$Event(90005701, Restart, function(entityId, eventFlagId, eventFlagId2, eventFlagId3, value) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(!EventFlag(3000));
    WaitFixedTimeFrames(1);
    WaitFor(!EventFlag(eventFlagId) && !EventFlag(eventFlagId2));
    GotoIf(L0, Signed(9) == value);
    GotoIf(L1, Signed(8) == value);
    GotoIf(L2, Signed(7) == value);
    GotoIf(L3, Signed(6) == value);
    GotoIf(L4, Signed(5) == value);
    GotoIf(L5, Signed(4) == value);
    GotoIf(L6, Signed(3) == value);
    GotoIf(L7, Signed(2) == value);
    GotoIf(L8, Signed(1) == value);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L0:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L1:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L2:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L3:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L4:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L5:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L6:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L7:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    WaitFixedTimeFrames(1);
L8:
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified));
    SetEventFlagID(eventFlagId3, ON);
    RestartEvent();
});

// 【共通】NPC死亡処理 -- [Common] NPC death processing
$Event(90005702, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(!EventFlag(eventFlagId) && CharacterDead(chrEntityId));
    BatchSetNetworkconnectedEventFlags(eventFlagId2, eventFlagId3, OFF);
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    SaveRequest();
});

// 【共通】新_NPC敵対化処理 -- [Common] New_NPC hostile processing
$Event(90005703, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, value) {
    EndIf(!PlayerIsInOwnWorld());
    SetEventFlagID(eventFlagId3, OFF);
    if (!EventFlag(eventFlagId5)) {
        SetSpEffect(chrEntityId, 9628);
        SetSpEffect(chrEntityId, 9635);
        SetSpEffect(chrEntityId, 9643);
        if (!CharacterHasSpEffect(chrEntityId, 445)) {
            SetSpEffect(chrEntityId, 442);
        }
        SetSpEffect(chrEntityId, 9644);
    }
L0:
    WaitFor(!EventFlag(eventFlagId4) && EventFlag(eventFlagId5));
    SetSpEffect(chrEntityId, 9629);
    SetSpEffect(chrEntityId, 9634);
    SetSpEffect(chrEntityId, 9642);
    SetSpEffect(chrEntityId, 9647);
    if (!CharacterHasSpEffect(chrEntityId, 445)) {
        SetSpEffect(chrEntityId, 440);
    }
    SetSpEffect(chrEntityId, 9645);
    dmgSp = HasDamageType(chrEntityId, 10000, DamageType.Unspecified)
        || HasDamageType(chrEntityId, 40000, DamageType.Unspecified)
        || CharacterHasSpEffect(chrEntityId, 1650000);
    if (HPRatio(chrEntityId) >= 1) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.65;
    } else if (HPRatio(chrEntityId) >= 0.9) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.55;
    } else if (HPRatio(chrEntityId) >= 0.8) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.45;
    } else if (HPRatio(chrEntityId) >= 0.7) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.35;
    } else if (HPRatio(chrEntityId) >= 0.7) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.25;
    } else {
        hpDmgSp &= HPRatio(chrEntityId) < 0.15;
        Goto(L10);
    }
L10:
    hpDmgSp &= dmgSp;
    flag = EventFlag(eventFlagId) || EventFlag(eventFlagId2);
    hpFlagSpDmg = HPRatio(chrEntityId) > 0
        && (EventFlag(eventFlagId3) || CharacterHasSpEffect(chrEntityId, 9641) || flag || hpDmgSp);
    flag2 = EventFlag(eventFlagId4);
    WaitFor(flag2 || hpFlagSpDmg);
    RestartIf(flag2.Passed);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    SetSpEffect(chrEntityId, 9628);
    SetSpEffect(chrEntityId, 9635);
    SetSpEffect(chrEntityId, 9643);
    if (!CharacterHasSpEffect(chrEntityId, 445)) {
        SetSpEffect(chrEntityId, 442);
    }
    SetSpEffect(chrEntityId, 9644);
    if (!flag.Passed) {
        if (Signed(1) != value) {
            BatchSetNetworkconnectedEventFlags(eventFlagId5, eventFlagId6, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        } else {
L1:
            BatchSetNetworkconnectedEventFlags(eventFlagId5, eventFlagId6, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId2, ON);
        }
    }
L9:
    SaveRequest();
    RestartEvent();
});

// 【共通】新_NPCがX回攻撃されたらフラグを立てる処理 -- [Common] New_Processing to set a flag when an NPC is attacked X times
$Event(90005704, Restart, function(entityId, eventFlagId, eventFlagId2, eventFlagId3, value) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    WaitFor(!EventFlag(eventFlagId) && EventFlag(eventFlagId2));
    GotoIf(L4, Signed(4) == value);
    GotoIf(L3, Signed(3) == value);
    GotoIf(L2, Signed(2) == value);
    GotoIf(L1, Signed(1) == value);
    flag = EventFlag(eventFlagId) || !EventFlag(eventFlagId2);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified)
            || flag);
    RestartIf(flag.Passed);
    WaitFixedTimeFrames(1);
L4:
    flag2 = EventFlag(eventFlagId) || !EventFlag(eventFlagId2);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified)
            || flag2);
    RestartIf(flag2.Passed);
    WaitFixedTimeFrames(1);
L3:
    flag3 = EventFlag(eventFlagId) || !EventFlag(eventFlagId2);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified)
            || flag3);
    RestartIf(flag3.Passed);
    WaitFixedTimeFrames(1);
L2:
    flag4 = EventFlag(eventFlagId) || !EventFlag(eventFlagId2);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified)
            || flag4);
    RestartIf(flag4.Passed);
    WaitFixedTimeFrames(1);
L1:
    flag5 = EventFlag(eventFlagId) || !EventFlag(eventFlagId2);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified)
            || flag5);
    RestartIf(flag5.Passed);
    SetEventFlagID(eventFlagId3, ON);
    RestartEvent();
});

// 【共通】NPC101道標老婆_死亡遷移イベント -- [Common] NPC101 Signpost Old Woman_Death Transition Event
$Event(90005705, Restart, function(chrEntityId) {
    WaitFixedTimeFrames(1);
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    EndIf(!PlayerIsInOwnWorld());
    EnableCharacterImmortality(chrEntityId);
    WaitFor(HasDamageType(chrEntityId, 10000, DamageType.Unspecified));
    ForceAnimationPlayback(chrEntityId, 20022, false, false, false);
    WaitFixedTimeSeconds(10);
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    EndEvent();
});

// 【共通】NPC700話す死体_初期化イベント -- [Common] NPC700 talking corpse_Initialization event
$Event(90005706, Restart, function(chrEntityId, animationId, chrEntityId2) {
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacter(chrEntityId);
    DisableCharacterGravity(chrEntityId);
    ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    EndIf(chrEntityId2 == 0);
    WaitFor(CharacterHasSpEffect(chrEntityId, 9624));
    IssueShortWarpRequest(chrEntityId, TargetEntityType.Area, chrEntityId2, -1);
    DisableCharacterGravity(chrEntityId);
    EndEvent();
});

// 【共通】幻影敵対化 -- [Common] Phantom hostility
$Event(90005707, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, value, animationId, eventFlagId7, eventFlagId8) {
    EndIf(!PlayerIsInOwnWorld());
    SetEventFlagID(eventFlagId3, OFF);
    WaitFor(!EventFlag(eventFlagId4) && EventFlag(eventFlagId5));
L0:
    SetSpEffect(chrEntityId, 9642);
    dmgSp = HasDamageType(chrEntityId, 10000, DamageType.Unspecified)
        || HasDamageType(chrEntityId, 40000, DamageType.Unspecified)
        || CharacterHasSpEffect(chrEntityId, 1650000);
    if (HPRatio(chrEntityId) >= 1) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.65;
    } else if (HPRatio(chrEntityId) >= 0.9) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.55;
    } else if (HPRatio(chrEntityId) >= 0.8) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.45;
    } else if (HPRatio(chrEntityId) >= 0.7) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.35;
    } else if (HPRatio(chrEntityId) >= 0.7) {
        hpDmgSp &= HPRatio(chrEntityId) < 0.25;
    } else {
        hpDmgSp &= HPRatio(chrEntityId) < 0.15;
        Goto(L10);
    }
L10:
    hpDmgSp &= dmgSp;
    hpFlagSpDmg = HPRatio(chrEntityId) > 0
        && (EventFlag(eventFlagId3)
            || CharacterHasSpEffect(chrEntityId, 9641)
            || EventFlag(eventFlagId)
            || EventFlag(eventFlagId2)
            || hpDmgSp);
    flag = EventFlag(eventFlagId4);
    WaitFor(flag || hpFlagSpDmg);
    RestartIf(flag.Passed);
    if (!or5.Passed) {
        if (Signed(1) != value) {
            BatchSetNetworkconnectedEventFlags(eventFlagId5, eventFlagId6, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        } else {
L0:
            BatchSetNetworkconnectedEventFlags(eventFlagId5, eventFlagId6, OFF);
            SetNetworkconnectedEventFlagID(eventFlagId2, ON);
        }
    }
L9:
    SaveRequest();
    if (eventFlagId7 != 0) {
        WaitFixedTimeRealFrames(2);
        WaitFor(!EventFlag(eventFlagId7));
    }
    ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    SetEventFlagID(eventFlagId8, ON);
    RestartEvent();
});

// 【共通】椅子キャラ位置合わせワープ -- [Common] Chair character positioning warp
$Event(90005708, Restart, function(chrEntityId, eventFlagId, chrEntityId2) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(CharacterBackreadStatus(chrEntityId) && EventFlag(eventFlagId));
    WaitFixedTimeRealFrames(1);
    RestartIf(!EventFlag(eventFlagId));
    if (chrEntityId2 == 0) {
        ResetCharacterPosition(chrEntityId);
    } else {
        IssueShortWarpRequest(chrEntityId, TargetEntityType.Area, chrEntityId2, -1);
    }
});

// 【共通】幻影被ダメSFX -- [Common] Illusion damage SFX
$Event(90005709, Restart, function(entityId, dummypolyId, sfxId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(HasDamageType(entityId, 0, DamageType.Unspecified));
    SpawnOneshotSFX(TargetEntityType.Character, entityId, dummypolyId, sfxId);
    RestartEvent();
});

// 【共通】バディ召喚石碑_SFX再生 -- [Common] Buddy summoning stone monument_SFX playback
$Event(90005710, Restart, function(eventFlagId, assetEntityId, dummypolyId, sfxId) {
    WaitFor(!EventFlag(eventFlagId));
    CreateAssetfollowingSFX(assetEntityId, dummypolyId, sfxId);
    WaitFor(EventFlag(eventFlagId));
    WaitFixedTimeSeconds(2);
    DeleteAssetfollowingSFX(assetEntityId, true);
    RestartEvent();
});

// 【共通】バディ召喚石碑_バディ巡回ルート設定 -- [Common] Buddy summoning stone monument_Buddy patrol route setting
$Event(90005711, Restart, function(eventFlagId, patrolInformationEntityId) {
    if (!PlayerIsInOwnWorld()) {
        EndEvent();
    }
L0:
    SetNetworkUpdateAuthority(20000, AuthorityLevel.Forced);
    WaitFor(EventFlag(eventFlagId));
    ChangeCharacterPatrolBehavior(35000, patrolInformationEntityId);
    RestartEvent();
});

// 【共通】バディ召喚石碑_アクセス可SFX設定 -- [Common] Buddy Summon Stone Monument_Accessible SFX Settings
$Event(90005712, Restart, function(chrEntityId, assetEntityId, dummypolyId, sfxId) {
    DisableNetworkSync();
    EndIf(!PlayerIsInOwnWorld());
    CreateAssetfollowingSFX(assetEntityId, dummypolyId, sfxId);
    WaitFor(CharacterHasSpEffect(chrEntityId, 9502));
    DeleteAssetfollowingSFX(assetEntityId, true);
    WaitFor(CharacterHasSpEffect(chrEntityId, 9503));
    RestartEvent();
});

// 【共通】バディ召喚石碑_撃破対象リスト設定 -- [Common] Buddy summon stone monument_defeat target list setting
$Event(90005713, Restart, function(eventFlagId, chrEntityId, chrEntityId2) {
    if (!EventFlag(eventFlagId)) {
        WaitFor(
            (PlayerIsInOwnWorld() && CharacterHasSpEffect(chrEntityId, 9500))
                || (!PlayerIsInOwnWorld() && EventFlag(eventFlagId)));
        if (PlayerIsInOwnWorld()) {
            SetNetworkconnectedEventFlagID(eventFlagId, ON);
        }
    }
L0:
    EnableCharacterAI(chrEntityId2);
    WaitFor(
        (PlayerIsInOwnWorld() && CharacterHasSpEffect(20000, 202))
            || (!PlayerIsInOwnWorld() && !EventFlag(eventFlagId)));
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId, OFF);
    }
    RestartEvent();
});

$Event(90005715, Restart, function(chrEntityId, chrEntityId2, eventFlagId, eventFlagId2, range) {
    EndIf(!PlayerIsInOwnWorld());
    SetCharacterTalkRange(chrEntityId, 17);
    if (0 != chrEntityId2) {
        SetCharacterTalkRange(chrEntityId2, 17);
    }
    EndIf(EventFlag(eventFlagId));
    GotoIf(L1, !EventFlag(eventFlagId2));
    Goto(L2);
L1:
    WaitFor(EventFlag(eventFlagId2));
    Goto(L2);
L2:
    SetCharacterTalkRange(chrEntityId, range);
    if (0 != chrEntityId2) {
        SetCharacterTalkRange(chrEntityId2, range);
    }
    EndEvent();
});

$Event(90005716, Restart, function(chrEntityId, eventFlagId, eventFlagId2) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(CharacterDead(chrEntityId));
    EnableCharacterDefaultBackread(chrEntityId);
    WaitFor(EventFlag(eventFlagId2) || ElapsedSeconds(30));
    DisableCharacterDefaultBackread(chrEntityId);
    EndEvent();
});

// 【共通】ジプシーバディ召喚 -- [Common] Gypsy Buddy Summon
$Event(90005720, Restart, function(chrEntityId, chrEntityId2, spEffectId, dummypolyId) {
    EndIf(CharacterHasSpEffect(chrEntityId, 11020));
    DisableCharacter(chrEntityId2);
    DisableCharacterCollision(chrEntityId2);
    WaitFor(
        CharacterHasSpEffect(chrEntityId, 10960) && CharacterHasSpEffect(chrEntityId, spEffectId));
    EnableCharacter(chrEntityId2);
    EnableCharacterCollision(chrEntityId2);
    SetSpEffect(chrEntityId2, 8551);
    WarpCharacterAndCopyFloor(chrEntityId2, TargetEntityType.Character, chrEntityId, dummypolyId, chrEntityId);
    ForceAnimationPlayback(chrEntityId2, 20000, false, false, false);
    EndEvent();
});

// 【共通】ジプシーバディ死亡演出 -- [Common] Gypsy Buddy death performance
$Event(90005721, Restart, function(chrEntityId, chrEntityId2) {
    WaitFor(CharacterDead(chrEntityId));
    WaitRandomTimeSeconds(0.5, 1.5);
    ForceCharacterDeath(chrEntityId2, true);
    EndEvent();
});

// 【共通】ジプシー_敵対判定 -- [Common] Gypsy_hostile judgment
$Event(90005722, Restart, function(chrEntityId, chrEntityId2) {
    if (CharacterHasSpEffect(chrEntityId, 11020)) {
        SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
        SetCharacterTeamType(chrEntityId2, TeamType.HostileNPC);
    }
L0:
    WaitFor(HPRatio(chrEntityId) < 0.65 || HPRatio(chrEntityId2, GreaterOrEqual, 1) < 0.65);
    SetSpEffect(chrEntityId, 11012);
    SetSpEffect(chrEntityId, 11020);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    SetCharacterTeamType(chrEntityId2, TeamType.HostileNPC);
    EndEvent();
});

// 【共通】ジプシー_会話判定 -- [Common] Gypsy_Conversation judgment
$Event(90005723, Restart, function(chrEntityId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(!CharacterHasSpEffect(chrEntityId, 11001) && !CharacterHasSpEffect(chrEntityId, 11020));
    SetSpEffect(chrEntityId, 11000);
    WaitFor(CharacterHasSpEffect(chrEntityId, 11001) || CharacterHasSpEffect(chrEntityId, 11020));
    ClearSpEffect(chrEntityId, 11000);
    RestartEvent();
});

// 【共通】ジプシー_リスポン処理 -- [Common] Gypsy_Respon processing
$Event(90005724, Restart, function(eventFlagId, chrEntityId, itemLotId, timeSeconds, value, chrEntityId2) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId2);
        DisableCharacterCollision(chrEntityId2);
        if (Signed(value) != 0) {
            DisableCharacter(chrEntityId);
            DisableCharacterCollision(chrEntityId);
            ForceCharacterTreasure(chrEntityId);
            EndEvent();
        }
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndEvent();
    }
L0:
    WaitFor(CharacterDead(chrEntityId));
    WaitFixedTimeSeconds(timeSeconds);
    SetEventFlagID(eventFlagId, ON);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(Signed(value) == 1);
    AwardItemsIncludingClients(itemLotId);
    EndEvent();
});

// 【共通】NPC801モブ赤目_初期化イベント -- [Common] NPC801 Mob Red Eye_Initialization event
$Event(90005725, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, chrEntityId, chrEntityId2, assetEntityId) {
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
        if (EventFlag(eventFlagId) && EventFlag(eventFlagId4)) {
            SetEventFlagID(eventFlagId4, OFF);
        }
    }
L0:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    DisableCharacter(chrEntityId2);
    SetCharacterBackreadState(chrEntityId2, true);
    DisableAsset(assetEntityId);
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L2, EventFlag(eventFlagId2));
    GotoIf(L4, EventFlag(eventFlagId3));
L1:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    if (!CharacterHasSpEffect(chrEntityId, 11035)) {
        ForceAnimationPlayback(chrEntityId, 930003, false, false, false);
    }
    if (CharacterHasSpEffect(chrEntityId, 11035)) {
        ForceAnimationPlayback(chrEntityId, 930002, false, false, false);
    }
    EnableCharacter(chrEntityId2);
    SetCharacterBackreadState(chrEntityId2, false);
    EnableAsset(assetEntityId);
    Goto(L20);
L2:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    EnableCharacter(chrEntityId2);
    SetCharacterBackreadState(chrEntityId2, false);
    SetCharacterTeamType(chrEntityId2, TeamType.HostileNPC);
    EnableAsset(assetEntityId);
    Goto(L20);
L4:
    ForceCharacterTreasure(chrEntityId);
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    DisableCharacter(chrEntityId2);
    SetCharacterBackreadState(chrEntityId2, true);
    DisableAsset(assetEntityId);
    Goto(L20);
L20:
    EndEvent();
});

// 【共通】NPC801モブ赤目_ロバ無し_初期化イベント -- [Common] NPC801 Mob Red Eye_No Donkey_Initialization Event
$Event(90005726, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, chrEntityId, assetEntityId) {
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
        if (EventFlag(eventFlagId) && EventFlag(eventFlagId4)) {
            SetEventFlagID(eventFlagId4, OFF);
        }
    }
L0:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    DisableAsset(assetEntityId);
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L2, EventFlag(eventFlagId2));
    GotoIf(L4, EventFlag(eventFlagId3));
L1:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    ForceAnimationPlayback(chrEntityId, 930003, false, false, false);
    EnableAsset(assetEntityId);
    Goto(L20);
L2:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    EnableAsset(assetEntityId);
    Goto(L20);
L4:
    ForceCharacterTreasure(chrEntityId);
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    DisableAsset(assetEntityId);
    Goto(L20);
L20:
    EndEvent();
});

// 【共通】NPC801モブ赤目_赤目ロバ相互敵対処理 -- [Common] NPC801 Mob Red Eye_Red Eye Donkey Mutual Hostility Processing
$Event(90005727, Restart, function(eventFlagId, chrEntityId, chrEntityId2, eventFlagId2, eventFlagId3) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId3));
    SetSpEffect(chrEntityId, 9629);
    SetSpEffect(chrEntityId, 9634);
    SetSpEffect(chrEntityId, 9642);
    SetSpEffect(chrEntityId, 440);
    SetSpEffect(chrEntityId, 9645);
    SetSpEffect(chrEntityId2, 9629);
    SetSpEffect(chrEntityId2, 9634);
    SetSpEffect(chrEntityId2, 9642);
    SetSpEffect(chrEntityId2, 440);
    SetSpEffect(chrEntityId2, 9645);
    WaitFor(
        EventFlag(eventFlagId)
            || (HasDamageType(chrEntityId, 20000, DamageType.Unspecified)
                && CharacterHPValue(chrEntityId) < 1)
            || (HasDamageType(chrEntityId2, 20000, DamageType.Unspecified)
                && CharacterHPValue(chrEntityId2) < 1));
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    EnableCharacterAI(chrEntityId);
    SetSpEffect(chrEntityId, 9628);
    SetSpEffect(chrEntityId, 9635);
    SetSpEffect(chrEntityId, 9643);
    SetSpEffect(chrEntityId, 442);
    SetSpEffect(chrEntityId, 9644);
    SetCharacterTeamType(chrEntityId2, TeamType.HostileNPC);
    EnableCharacterAI(chrEntityId2);
    SetSpEffect(chrEntityId2, 9628);
    SetSpEffect(chrEntityId2, 9635);
    SetSpEffect(chrEntityId2, 9643);
    SetSpEffect(chrEntityId2, 442);
    SetSpEffect(chrEntityId2, 9644);
    if (!EventFlag(eventFlagId3)) {
        BatchSetNetworkconnectedEventFlags(eventFlagId2, eventFlagId3, OFF);
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
    EndEvent();
});

// 【共通】NPC801モブ赤目_ロバ被ダメ台詞再生 -- [Common] NPC801 Mob Red Eye_Donkey damaged lines playback
$Event(90005728, Restart, function(entityId, eventFlagId, eventFlagId2) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(
        (HasDamageType(entityId, 20000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified))
            && !EventFlag(eventFlagId2));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    EndEvent();
});

// 【共通】NPC801モブ赤目_タイプA呼び掛け会話イベント -- [Common] NPC801 Mob Red Eye_Type A calling conversation event
$Event(90005729, Restart, function(eventFlagId, chrEntityId, range, eventFlagId2) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    SetCharacterTalkRange(chrEntityId, range);
    WaitForEventFlag(ON, TargetEventFlagType.EventFlag, eventFlagId2);
    WaitFixedTimeSeconds(30);
    SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

// 【共通】リマインド自動会話 -- [Common] Reminder automatic conversation
$Event(90005730, Restart, function(eventFlagId, targetTimeSeconds, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(
        !EventFlag(eventFlagId)
            && EventFlag(eventFlagId3)
            && !EventFlag(eventFlagId4)
            && !EventFlag(eventFlagId5));
    if (!EventFlag(eventFlagId2)) {
        flag = EventFlag(eventFlagId)
            || !EventFlag(eventFlagId3)
            || EventFlag(eventFlagId4)
            || EventFlag(eventFlagId5);
        WaitFor(EventFlag(eventFlagId2) || flag);
        RestartIf(flag.Passed);
        SetEventFlagID(eventFlagId, ON);
        RestartEvent();
    }
L0:
    flag2 = EventFlag(eventFlagId)
        || !EventFlag(eventFlagId3)
        || EventFlag(eventFlagId4)
        || EventFlag(eventFlagId5)
        || !EventFlag(eventFlagId2);
    WaitFor(ElapsedSeconds(targetTimeSeconds) || flag2);
    RestartIf(flag2.Passed);
    SetEventFlagID(eventFlagId, ON);
    RestartEvent();
});

// 【共通】一定距離に入ったらフラグを立てる_チャタリング防止 -- [Common] Set a flag when you enter a certain distance_Chattering prevention
$Event(90005731, Restart, function(eventFlagId, entityId, targetDistance, targetDistance2) {
    EndIf(!PlayerIsInOwnWorld());
    if (!EventFlag(eventFlagId)) {
        WaitFor(EntityInRadiusOfEntity(10000, entityId, targetDistance, 1));
        SetEventFlagID(eventFlagId, ON);
    }
L0:
    WaitFor(
        !EntityInRadiusOfEntity(10000, entityId, targetDistance, 1)
            && !EntityInRadiusOfEntity(10000, entityId, targetDistance2, 1));
    SetEventFlagID(eventFlagId, OFF);
    RestartEvent();
});

// 【共通】領域に入ったらフラグを立てる_チャタリング防止 -- [Common] Set a flag when entering the area_Chattering prevention
$Event(90005732, Restart, function(eventFlagId, areaEntityId, areaEntityId2) {
    EndIf(!PlayerIsInOwnWorld());
    if (!EventFlag(eventFlagId)) {
        WaitFor(InArea(10000, areaEntityId));
        SetEventFlagID(eventFlagId, ON);
    }
L0:
    WaitFor(!InArea(10000, areaEntityId) && !InArea(10000, areaEntityId2));
    SetEventFlagID(eventFlagId, OFF);
    RestartEvent();
});

// 【共通】NPC322ユリア_同衾データサーバー打ち上げ -- [Common] NPC322 Yulia_Dojuku data server launch
$Event(90005733, Restart, function(eventFlagId) {
    EndIf(!PlayerIsInOwnWorld());
    DisableNetworkSync();
    SetEventFlagID(eventFlagId, OFF);
    WaitFor(EventFlag(eventFlagId) && PlayerIsInOwnWorld());
    SendCharacterDataToOnlinePlayers(0);
    RestartEvent();
});

$Event(90005734, Restart, function(eventFlagId, eventFlagId2, areaEntityId, areaEntityId2, eventFlagId3, value) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    EndIf(!EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2));
    WaitFor(InArea(10000, areaEntityId));
    SetEventFlagID(eventFlagId3, ON);
    WaitFixedTimeFrames(1);
    WaitFor(!InArea(10000, areaEntityId) && !InArea(10000, areaEntityId2));
    if (Signed(-1) != value) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    RestartEvent();
});

$Event(90005735, Restart, function(chrEntityId, eventFlagId, eventFlagId2, entityId, targetDistance) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    DisableCharacterDefaultBackread(chrEntityId);
    EndIf(!EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2));
    WaitFor(
        !EventFlag(eventFlagId2) && EntityInRadiusOfEntity(entityId, chrEntityId, targetDistance, 1));
    EnableCharacterDefaultBackread(chrEntityId);
    WaitFor(
        !(!EventFlag(eventFlagId2)
            && EntityInRadiusOfEntity(entityId, chrEntityId, targetDistance, 1)));
    DisableCharacterDefaultBackread(chrEntityId);
    RestartEvent();
});

$Event(90005736, Restart, function(chrEntityId, assetEntityId, eventFlagId, eventFlagId2, targetDistance, range, eventFlagId3, eventFlagId4, value, animationId, value2, assetEntityId2) {
    if (Signed(1) != value) {
        if (Signed(0) != value2) {
            DisableAsset(assetEntityId2);
        }
    }
    if (PlayerIsInOwnWorld()) {
        EndIf(EventFlag(eventFlagId));
        if (Signed(1) != value) {
            if (Signed(0) != value2) {
                EnableAsset(assetEntityId2);
                CreateAssetfollowingSFX(assetEntityId2, 100, 600904);
            }
        }
        WaitFor(
            HasDamageType(assetEntityId, 20000, DamageType.Unspecified) && PlayerIsInOwnWorld());
        SetEventFlagID(eventFlagId2, ON);
        if (!EntityInRadiusOfEntity(20000, assetEntityId, targetDistance, 1)) {
            SetEventFlagID(eventFlagId3, ON);
        }
        DisableCharacterGravity(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        SetCharacterMaphit(chrEntityId, false);
    }
L0:
    WaitForEventFlag(ON, TargetEventFlagType.EventFlag, eventFlagId2);
    GotoIf(L1, Signed(1) == value);
    GotoIf(L2, Signed(0) == value);
L1:
    SpawnOneshotSFX(TargetEntityType.Character, chrEntityId, 900, 641012);
    WaitFixedTimeSeconds(0.5);
    DisableAsset(assetEntityId);
    WaitFixedTimeSeconds(0.3);
    ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    EnableCharacter(chrEntityId);
    EnableCharacterGravity(chrEntityId);
    EnableCharacterCollision(chrEntityId);
    SetCharacterMaphit(chrEntityId, true);
    Goto(L10);
L2:
    ForceAnimationPlayback(assetEntityId, 1, false, false, false);
    WaitFixedTimeSeconds(1);
    if (Signed(0) != value2) {
        DeleteAssetfollowingSFX(assetEntityId2, true);
    }
    ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    EnableCharacter(chrEntityId);
    SpawnOneshotSFX(TargetEntityType.Character, chrEntityId, 220, 302603);
    WaitFixedTimeSeconds(1);
    DisableAsset(assetEntityId);
    EnableCharacterGravity(chrEntityId);
    EnableCharacterCollision(chrEntityId);
    SetCharacterMaphit(chrEntityId, true);
    Goto(L10);
L10:
    WaitFor(EventFlag(eventFlagId4));
    SetCharacterTalkRange(chrEntityId, range);
    EndEvent();
});

$Event(90005737, Restart, function(eventFlagId, eventFlagId2) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    GotoIf(L0, !EventFlag(eventFlagId2));
    Goto(L1);
L0:
    WaitFor(
        HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending));
    SetEventFlagID(eventFlagId2, ON);
    RestartEvent();
L1:
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending)));
    SetEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

// 【共通】投げもどきアニメ再生_PC -- [Common] Throwback anime playback_PC
$Event(90005740, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, dummypolyId, assetEntityId, dummypolyId2, targetDistance, animationId, animationId2, spEffectId, targetDistance2) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId));
    if (Signed(dummypolyId) != 0) {
        GotoIf(L0, assetEntityId == 0);
        WarpAssetToCharacter(assetEntityId, chrEntityId, dummypolyId2);
        WaitFixedTimeRealFrames(1);
        area &= EntityInRadiusOfEntity(10000, assetEntityId, targetDistance, 1);
        GotoIf(L9, area);
        GotoIf(L9, 
            EntityInRadiusOfEntity(10000, assetEntityId, targetDistance2, 1)
                && EntityInRadiusOfEntity(10000, chrEntityId, targetDistance2, 1));
        RotateCharacter(10000, assetEntityId, -1, true);
        RotateCharacter(10000, assetEntityId, 90006, false);
        Goto(L8);
    }
L0:
    RotateCharacter(10000, chrEntityId, -1, true);
    area &= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    GotoIf(L9, area);
    RotateCharacter(10000, chrEntityId, 90006, false);
    Goto(L8);
L8:
    WaitFixedTimeRealFrames(1);
    sp = !CharacterHasSpEffect(10000, 9900);
    flagTime = !EventFlag(eventFlagId) || ElapsedSeconds(2);
    spFlagTimeArea |= sp || flagTime;
    if (Signed(dummypolyId) != 0) {
        GotoIf(S0, assetEntityId == 0);
        spFlagTimeArea |= EntityInRadiusOfEntity(10000, assetEntityId, targetDistance, 1);
    } else {
S0:
        spFlagTimeArea |= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    }
    WaitFor(spFlagTimeArea);
    GotoIf(L20, sp.Passed);
    GotoIf(L19, flagTime.Passed);
L9:
    SetEventFlagID(eventFlagId2, ON);
    if (eventFlagId3 != 0) {
        SetEventFlagID(eventFlagId3, ON);
    }
    if (Signed(dummypolyId) != 0) {
        IssueShortWarpRequest(10000, TargetEntityType.Character, chrEntityId, dummypolyId);
    }
    if (Signed(spEffectId) != -1) {
        RotateCharacter(10000, chrEntityId, animationId, false);
    } else {
        RotateCharacter(10000, chrEntityId, animationId, true);
    }
    Goto(L8);
L8:
    WaitFixedTimeRealFrames(1);
    sp2 = !CharacterHasSpEffect(10000, 9900);
    WaitFor(!EventFlag(eventFlagId) || sp2);
    if (!sp2.Passed) {
        if (Signed(animationId2) != -1) {
            if (Signed(spEffectId) != -1) {
                sp3 = !CharacterHasSpEffect(10000, 9900);
                WaitFor(CharacterHasSpEffect(10000, spEffectId) || sp3);
                GotoIf(L20, sp3.Passed);
            }
L10:
            SetEventFlagID(eventFlagId2, OFF);
            ForceAnimationPlayback(10000, animationId2, false, true, false);
            RestartEvent();
        }
L18:
        SetEventFlagID(eventFlagId2, OFF);
        RestartEvent();
    }
L19:
    SetEventFlagID(eventFlagId, OFF);
    ForceAnimationPlayback(10000, 0, false, false, false);
    RestartEvent();
L20:
    SetEventFlagID(eventFlagId, OFF);
    SetEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

// 【共通】投げもどきアニメ再生_話者 -- [Common] Throwback anime playback_Speaker
$Event(90005741, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, animationId, value, animationId2, spEffectId, timeSeconds) {
    EndIf(!PlayerIsInOwnWorld());
    if (eventFlagId3 != 0) {
        cond &= EventFlag(eventFlagId3);
    }
    cond &= EventFlag(eventFlagId);
    WaitFor(cond);
    SetEventFlagID(eventFlagId2, ON);
    if (eventFlagId3 != 0) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    if (value != 1) {
        if (Signed(spEffectId) != -1) {
            ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
        } else {
            ForceAnimationPlayback(chrEntityId, animationId, false, true, false);
        }
    } else {
L0:
        if (Signed(spEffectId) != -1) {
            RotateCharacter(chrEntityId, 10000, animationId, false);
        } else {
            RotateCharacter(chrEntityId, 10000, animationId, true);
        }
        Goto(L10);
    }
L10:
    cond &= !EventFlag(eventFlagId);
    if (Signed(spEffectId) != -1) {
        cond &= CharacterHasSpEffect(chrEntityId, spEffectId);
    }
    WaitFor(cond);
    if (Signed(animationId2) != -1) {
        SetEventFlagID(eventFlagId2, OFF);
        ForceAnimationPlayback(chrEntityId, animationId2, false, true, false);
        WaitFixedTimeSeconds(timeSeconds);
        RestartEvent();
    }
L19:
    SetEventFlagID(eventFlagId2, OFF);
    WaitFixedTimeSeconds(timeSeconds);
    RestartEvent();
L20:
    SetEventFlagID(eventFlagId, OFF);
    SetEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

// 【共通】投げもどきアニメ再生_PC_ユリア用 -- [Common] Throwback anime playback_PC_for Yuria
$Event(90005742, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, dummypolyId, assetEntityId, dummypolyId2, targetDistance, animationId, animationId2, spEffectId, targetDistance2, eventFlagId4) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId));
    if (Signed(dummypolyId) != 0) {
        GotoIf(L0, assetEntityId == 0);
        WarpAssetToCharacter(assetEntityId, chrEntityId, dummypolyId2);
        WaitFixedTimeRealFrames(1);
        area &= EntityInRadiusOfEntity(10000, assetEntityId, targetDistance, 1);
        GotoIf(L9, area);
        areaFlag &= EntityInRadiusOfEntity(10000, assetEntityId, targetDistance2, 1)
            && EntityInRadiusOfEntity(10000, chrEntityId, targetDistance2, 1);
        GotoIf(L9, areaFlag);
        RotateCharacter(10000, assetEntityId, -1, true);
        RotateCharacter(10000, assetEntityId, 90006, false);
        Goto(L8);
    }
L0:
    RotateCharacter(10000, chrEntityId, -1, true);
    area &= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    GotoIf(L9, area);
    RotateCharacter(10000, chrEntityId, 90006, false);
    Goto(L8);
L8:
    WaitFixedTimeRealFrames(1);
    sp = !CharacterHasSpEffect(10000, 9900);
    flagTime = !EventFlag(eventFlagId) || ElapsedSeconds(2);
    spFlagTimeArea |= sp || flagTime;
    if (Signed(dummypolyId) != 0) {
        GotoIf(S0, assetEntityId == 0);
        spFlagTimeArea |= EntityInRadiusOfEntity(10000, assetEntityId, targetDistance, 1);
    } else {
S0:
        spFlagTimeArea |= EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1);
    }
    WaitFor(spFlagTimeArea);
    if (!sp.Passed) {
        if (!flagTime.Passed) {
L9:
            SetEventFlagID(eventFlagId2, ON);
            if (eventFlagId3 != 0) {
                SetEventFlagID(eventFlagId3, ON);
            }
            if (Signed(dummypolyId) != 0) {
                IssueShortWarpRequest(10000, TargetEntityType.Character, chrEntityId, dummypolyId);
            }
            if (Signed(spEffectId) != -1) {
                RotateCharacter(10000, chrEntityId, animationId, false);
            } else {
                RotateCharacter(10000, chrEntityId, animationId, true);
            }
            Goto(L8);
L8:
            WaitFixedTimeRealFrames(1);
            sp2 = !CharacterHasSpEffect(10000, 9900);
            areaFlag &= EventFlag(eventFlagId4);
            WaitFor(!EventFlag(eventFlagId) || sp2 || areaFlag);
            GotoIf(L20, sp2.Passed);
            GotoIf(L18, Signed(animationId2) == -1);
            GotoIf(L20, areaFlag.Passed);
            if (Signed(spEffectId) != -1) {
                sp3 = !CharacterHasSpEffect(10000, 9900);
                WaitFor(CharacterHasSpEffect(10000, spEffectId) || sp3);
                GotoIf(L20, sp3.Passed);
            }
L10:
            SetEventFlagID(eventFlagId2, OFF);
            ForceAnimationPlayback(10000, animationId2, false, true, false);
            RestartEvent();
L18:
            SetEventFlagID(eventFlagId2, OFF);
            RestartEvent();
        }
L19:
        SetEventFlagID(eventFlagId, OFF);
        ForceAnimationPlayback(10000, 0, false, false, false);
        RestartEvent();
    }
L20:
    SetEventFlagID(eventFlagId, OFF);
    SetEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

// 【共通】投げもどきアニメ再生_話者_ユリア用 -- [Common] Throwback anime playback_speaker_for Yuria
$Event(90005743, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, animationId, value, animationId2, spEffectId, timeSeconds, eventFlagId4) {
    EndIf(!PlayerIsInOwnWorld());
    if (eventFlagId3 != 0) {
        cond &= EventFlag(eventFlagId3);
    }
    cond &= EventFlag(eventFlagId);
    WaitFor(cond);
    SetEventFlagID(eventFlagId2, ON);
    if (eventFlagId3 != 0) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    if (value != 1) {
        if (Signed(spEffectId) != -1) {
            ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
        } else {
            ForceAnimationPlayback(chrEntityId, animationId, false, true, false);
        }
    } else {
L0:
        if (Signed(spEffectId) != -1) {
            RotateCharacter(chrEntityId, 10000, animationId, false);
        } else {
            RotateCharacter(chrEntityId, 10000, animationId, true);
        }
        Goto(L10);
    }
L10:
    cond &= !EventFlag(eventFlagId);
    if (Signed(spEffectId) != -1) {
        cond &= CharacterHasSpEffect(chrEntityId, spEffectId);
    }
    flag = EventFlag(eventFlagId4);
    WaitFor(cond || flag);
    GotoIf(L19, Signed(animationId2) == -1);
    GotoIf(L20, flag.Passed);
    SetEventFlagID(eventFlagId2, OFF);
    ForceAnimationPlayback(chrEntityId, animationId2, false, true, false);
    WaitFixedTimeSeconds(timeSeconds);
    RestartEvent();
L19:
    SetEventFlagID(eventFlagId2, OFF);
    WaitFixedTimeSeconds(timeSeconds);
    RestartEvent();
L20:
    SetEventFlagID(eventFlagId, OFF);
    SetEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

$Event(90005744, Restart, function(entityId, eventFlagId, eventFlagId2, animationId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId2));
    WaitFor(EventFlag(eventFlagId));
    ForceAnimationPlayback(entityId, animationId, false, false, false);
    WaitFor(!EventFlag(eventFlagId) || EventFlag(eventFlagId2));
    RestartIf(!EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2));
});

$Event(90005745, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, timeSeconds) {
    WaitFixedTimeFrames(1);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    if (EventFlag(eventFlagId2)) {
        WaitFor(EventFlag(eventFlagId) || EventFlag(eventFlagId3));
        EndIf(EventFlag(eventFlagId));
        WaitFixedTimeSeconds(timeSeconds);
        SetEventFlagID(eventFlagId3, OFF);
        RestartEvent();
    }
L10:
    WaitFor(EventFlag(eventFlagId2));
    RestartEvent();
});

$Event(90005746, Restart, function(eventFlagId, eventFlagId2, range) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId));
    SetCharacterTalkRange(eventFlagId, range);
    SetEventFlagID(eventFlagId2, ON);
});

$Event(90005747, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, targetTimeSeconds, eventFlagId4, eventFlagId5, targetTimeSeconds2) {
    WaitFixedTimeFrames(1);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    EndIf(!EventFlag(eventFlagId2));
    WaitFor(EventFlag(eventFlagId) || EventFlag(eventFlagId3));
    EndIf(EventFlag(eventFlagId));
    if (!EventFlag(eventFlagId5)) {
        Goto(L0);
L0:
        WaitFor(ElapsedSeconds(targetTimeSeconds) || EventFlag(eventFlagId4));
    } else {
L1:
        WaitFor(ElapsedSeconds(targetTimeSeconds2) || EventFlag(eventFlagId4));
        Goto(L20);
    }
L20:
    SetEventFlagID(eventFlagId3, OFF);
    RestartEvent();
});

$Event(90005748, Restart, function(entityId, actionButtonParameterId, messageId, displayDistance, eventFlagId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(ActionButtonInArea(actionButtonParameterId, entityId));
    DisplayGenericDialog(messageId, PromptType.YESNO, NumberofOptions.NoButtons, 0, displayDistance);
    SetEventFlagID(eventFlagId, ON);
    WaitFixedTimeSeconds(1);
    RestartEvent();
});

$Event(90005749, Restart, function(chrEntityId, chrEntityId2, eventFlagId, eventFlagId2) {
    WaitFixedTimeRealFrames(2);
    if (EventFlag(eventFlagId)) {
        EnableCharacterInvincibility(chrEntityId2);
        EnableCharacterImmortality(chrEntityId);
        if (PlayerIsInOwnWorld()) {
            WaitFor(EntityInRadiusOfEntity(10000, chrEntityId2, 100, 1));
            IssueShortWarpRequest(chrEntityId, TargetEntityType.Character, chrEntityId2, 11);
            WaitFor(HasDamageType(chrEntityId, 0, DamageType.Unspecified));
            SetSpEffect(chrEntityId2, 9910);
            DisableCharacter(chrEntityId);
            DisableCharacterCollision(chrEntityId2);
            SpawnOneshotSFX(TargetEntityType.Character, chrEntityId2, 200, 604220);
            SetNetworkconnectedEventFlagID(eventFlagId2, ON);
            WaitFixedTimeSeconds(5);
            DisableCharacter(chrEntityId2);
            SetCharacterBackreadState(chrEntityId2, true);
            EndEvent();
        }
L19:
        WaitFor(EventFlag(eventFlagId2));
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId2);
        WaitFixedTimeSeconds(5);
        DisableCharacter(chrEntityId2);
        EndEvent();
    }
L20:
    DisableCharacter(chrEntityId);
    WaitFor(EventFlag(eventFlagId));
    EnableCharacter(chrEntityId);
    RestartEvent();
});

// 【共通】会話NPCアイテム光 -- [Common] Conversation NPC item light
$Event(90005750, Default, function(assetEntityId, actionButtonParameterId, itemLotId, eventFlagId, eventFlagId2, eventFlagId3, sfxId) {
    DisableNetworkSync();
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId3) && !AllBatchEventFlags(eventFlagId, eventFlagId2));
    if (Signed(sfxId) != 0) {
        CreateAssetfollowingSFX(assetEntityId, 90, sfxId);
    } else {
        CreateAssetfollowingSFX(assetEntityId, 90, 6101);
    }
    flag = !EventFlag(eventFlagId3) || AllBatchEventFlags(eventFlagId, eventFlagId2);
    WaitFor(ActionButtonInArea(actionButtonParameterId, assetEntityId) || flag);
    if (!flag.Passed) {
        DeleteAssetfollowingSFX(assetEntityId, true);
        AwardItemsIncludingClients(itemLotId);
        EzstateInstructionRequest(10000, 60070, 0);
        EndEvent();
    }
L0:
    DeleteAssetfollowingSFX(assetEntityId, true);
    RestartEvent();
});

// 【共通】会話NPCバリアSFX_ワンショット -- [Common] Conversation NPC Barrier SFX_One Shot
$Event(90005751, Restart, function(entityId, dummypolyId, sfxId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(HasDamageType(entityId, 20000, DamageType.Unspecified) && PlayerIsInOwnWorld());
    SpawnOneshotSFX(TargetEntityType.Asset, entityId, dummypolyId, sfxId);
    RestartEvent();
});

// 【共通】会話NPCバリアSFX_ループ -- [Common] Conversation NPC Barrier SFX_Loop
$Event(90005752, Default, function(assetEntityId, dummypolyId, sfxId, targetTimeSeconds) {
    DisableNetworkSync();
    if (ThisEventSlot()) {
        dmg = HasDamageType(assetEntityId, 20000, DamageType.Unspecified);
        WaitFor(PlayerIsInOwnWorld() && (ElapsedSeconds(targetTimeSeconds) || dmg));
        RestartIf(dmg.Passed);
        DeleteAssetfollowingSFX(assetEntityId, true);
    }
L0:
    WaitFor(PlayerIsInOwnWorld() && HasDamageType(assetEntityId, 20000, DamageType.Unspecified));
    CreateAssetfollowingSFX(assetEntityId, dummypolyId, sfxId);
    RestartEvent();
});

$Event(90005753, Restart, function(entityId, entityId2, eventFlagId, eventFlagId2, eventFlagId3, targetTimeSeconds, eventFlagId4, eventFlagId5, eventFlagId6, eventFlagId7) {
    WaitFixedTimeFrames(1);
    EndIf(!PlayerIsInOwnWorld());
    WaitForEventFlag(ON, TargetEventFlagType.EventFlag, eventFlagId);
    GotoIf(L0, !EventFlag(eventFlagId6));
    GotoIf(L1, EventFlag(eventFlagId3));
L0:
    WaitFor(
        HasDamageType(entityId2, 20000, DamageType.Unspecified)
            && EntityInRadiusOfEntity(entityId, 20000, 10, 1));
    SetEventFlagID(eventFlagId6, ON);
    GotoIf(L13, EventFlag(eventFlagId3));
    Goto(L10);
L1:
    dmg = HasDamageType(entityId2, 20000, DamageType.Unspecified);
    WaitFor(ElapsedSeconds(targetTimeSeconds) || dmg);
    GotoIf(L11, dmg.Passed);
    Goto(L12);
L10:
    SetEventFlagID(eventFlagId2, ON);
    WaitFor(EventFlag(eventFlagId3));
    Goto(L20);
L11:
    if (!EventFlag(eventFlagId7)) {
        if (EntityInRadiusOfEntity(entityId, 20000, 10, 1)) {
            SetEventFlagID(eventFlagId2, ON);
            WaitFor(EventFlag(eventFlagId4));
            SetEventFlagID(eventFlagId4, OFF);
            SetEventFlagID(eventFlagId7, ON);
        }
    }
    Goto(L20);
L12:
    SetEventFlagID(eventFlagId5, ON);
    SetEventFlagID(eventFlagId6, OFF);
    Goto(L20);
L13:
    SetEventFlagID(eventFlagId2, ON);
    SetEventFlagID(eventFlagId5, OFF);
    WaitFor(EventFlag(eventFlagId4));
    SetEventFlagID(eventFlagId4, OFF);
    SetEventFlagID(eventFlagId7, ON);
    Goto(L20);
L20:
    SetEventFlagID(eventFlagId2, OFF);
    RestartEvent();
});

$Event(90005754, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, areaEntityId, eventFlagId5, eventFlagId6, eventFlagId7, chrEntityId, eventFlagId8, range, eventFlagId9, eventFlagId10, eventFlagId11, eventFlagId12) {
    EndIf(!PlayerIsInOwnWorld());
    SetCharacterBackreadState(chrEntityId, true);
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId6));
    EndIf(EventFlag(eventFlagId4));
    GotoIf(L1, 0 == eventFlagId10);
    Goto(L2);
L1:
    WaitFor(
        EventFlag(eventFlagId8)
            || (InArea(10000, areaEntityId)
                && (!AnyBatchEventFlags(eventFlagId2, eventFlagId3) || EventFlag(eventFlagId))));
    Goto(L3);
L2:
    WaitFor(
        EventFlag(eventFlagId8)
            || (InArea(10000, areaEntityId)
                && (!AnyBatchEventFlags(eventFlagId2, eventFlagId3) || EventFlag(eventFlagId))
                && (!EventFlag(eventFlagId10)
                    || (EventFlag(eventFlagId10) && EventFlag(eventFlagId11)))));
    Goto(L3);
L3:
    if (0 != eventFlagId8) {
        if (EventFlag(eventFlagId8)) {
            BatchSetEventFlags(eventFlagId2, eventFlagId3, OFF);
        }
    }
    if (0 != eventFlagId7) {
        EndIf(EventFlag(eventFlagId7));
    }
    SetEventFlagID(eventFlagId, ON);
    if (0 != eventFlagId12) {
        SetEventFlagID(eventFlagId12, ON);
    }
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTalkRange(chrEntityId, range);
    WaitFor(EventFlag(eventFlagId9) || !EventFlag(eventFlagId));
    if (!EventFlag(eventFlagId5)) {
        EndIf(EventFlag(eventFlagId9));
        RestartEvent();
    }
L0:
    SetEventFlagID(eventFlagId, OFF);
    SetEventFlagID(eventFlagId4, ON);
    EndEvent();
});

$Event(90005755, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, maximumAllowedValue) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId4));
    EndIf(EventFlag(eventFlagId2));
    WaitFor(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId2));
    if (0 != eventFlagId3) {
        SetEventFlagID(eventFlagId3, OFF);
    }
    IncrementEventValue(eventFlagId5, 4, maximumAllowedValue);
    if (EventValue(eventFlagId5, 4) == maximumAllowedValue) {
        SetEventFlagID(eventFlagId4, ON);
    }
    EndEvent();
});

$Event(90005756, Restart, function(eventFlagId, eventFlagId2, eventFlagId3) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId3));
    WaitFor(EventFlag(eventFlagId3));
    EndIf(!EventFlag(eventFlagId2));
    SetEventFlagID(eventFlagId, ON);
    EndEvent();
});

$Event(90005757, Restart, function(chrEntityId, chrEntityId2, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4) {
    WaitFixedTimeRealFrames(1);
    DisableCharacter(chrEntityId);
    DisableCharacter(chrEntityId2);
    EndIf(!EventFlag(eventFlagId) || EventFlag(eventFlagId4));
    GotoIf(L1, !EventFlag(eventFlagId2));
    EndIf(!PlayerIsInOwnWorld());
    Goto(L2);
L1:
    EnableCharacter(chrEntityId);
    ForceAnimationPlayback(chrEntityId, 30007, false, false, false);
    WaitFor(CharacterBackreadStatus(chrEntityId));
    WaitFixedTimeRealFrames(1);
    EndEvent();
L2:
    EnableCharacter(chrEntityId2);
    ForceAnimationPlayback(chrEntityId2, 30008, false, false, false);
    SetCharacterTeamType(chrEntityId2, TeamType.Disabled);
    DisableCharacterCollision(chrEntityId2);
    WaitFor(CharacterBackreadStatus(chrEntityId2));
    WaitFixedTimeRealFrames(1);
    EndEvent();
    SetEventFlagID(eventFlagId3, ON);
});

$Event(90005758, Restart, function(eventFlagId, eventFlagId2, animationId, entityId, eventFlagId3) {
    WaitFixedTimeFrames(2);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(!EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId3));
    EndIf(EventFlag(eventFlagId2));
    WaitFor(EventFlag(eventFlagId2));
    ForceAnimationPlayback(entityId, animationId, true, false, false);
});

$Event(90005759, Default, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, eventFlagId4, eventFlagId5, eventFlagId6, eventFlagId7, eventFlagId8, eventFlagId9, eventFlagId10, timeSeconds, eventFlagId11, targetDistance) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId));
    EndIf(!EventFlag(eventFlagId2));
    EndIf(EventFlag(eventFlagId3));
    if (!EventFlag(eventFlagId11)) {
        if (EventFlag(eventFlagId11)) {
        }
L0:
        EndIf(EventFlag(eventFlagId4));
        WaitFor(
            CharacterRatioDead(chrEntityId)
                || CharacterHPValue(chrEntityId) <= 0
                || EventFlag(eventFlagId4));
        SetEventFlagID(eventFlagId4, ON);
        if (CountEventFlags(TargetEventFlagType.EventFlag, eventFlagId6, eventFlagId7) == 1) {
            SetEventFlagID(eventFlagId8, ON);
        }
        if (CountEventFlags(TargetEventFlagType.EventFlag, eventFlagId6, eventFlagId7) >= 2) {
            SetEventFlagID(eventFlagId9, ON);
            EndIf(EventFlag(eventFlagId10));
            SetEventFlagID(eventFlagId11, ON);
            WaitFixedTimeSeconds(timeSeconds);
            SetEventFlagID(eventFlagId5, ON);
            flag &= EventFlag(eventFlagId3);
        }
        WaitFor(flag);
        SetEventFlagID(eventFlagId11, OFF);
        EndEvent();
    }
L10:
    WaitFor(EntityInRadiusOfEntity(10000, chrEntityId, targetDistance, 1));
    EndIf(EventFlag(eventFlagId10));
    SetEventFlagID(eventFlagId5, ON);
    flag &= EventFlag(eventFlagId3);
    WaitFor(flag);
    SetEventFlagID(eventFlagId11, OFF);
    EndEvent();
});

// 【共通】会話NPC夜敵出現 -- [Common] Conversation NPC enemy appears at night
$Event(90005760, Restart, function(eventFlagId, chrEntityId, areaEntityId, eventFlagId2) {
    EndIf(EventFlag(eventFlagId));
    if (!ThisEventSlot()) {
        WaitFor(
            EventFlag(eventFlagId2)
                && !EventFlag(9000)
                && PlayerIsInOwnWorld()
                && InArea(10000, areaEntityId));
    }
L0:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    ForceAnimationPlayback(chrEntityId, 20000, false, false, false);
    EndEvent();
});

$Event(90005761, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, animationId, range) {
    DisableNetworkSync();
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
        if (EventFlag(eventFlagId)) {
            SetEventFlagID(eventFlagId6, OFF);
        }
    }
L10:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    if (!EventFlag(eventFlagId5)) {
        WaitFor(EventFlag(eventFlagId5));
        RestartEvent();
    }
L0:
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L2, EventFlag(eventFlagId2));
    GotoIf(L3, EventFlag(eventFlagId3));
    GotoIf(L4, EventFlag(eventFlagId4));
L1:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    if (Signed(-1) != animationId) {
        ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    }
    SetCharacterTalkRange(chrEntityId, range);
    Goto(L20);
L2:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    Goto(L20);
L3:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    Goto(L20);
L4:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    Goto(L20);
L20:
    WaitFor(!EventFlag(eventFlagId5));
    RestartEvent();
});

$Event(90005762, Restart, function(chrEntityId, assetEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, eventFlagId7, range) {
    DisableNetworkSync();
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
        if (EventFlag(eventFlagId)) {
            SetEventFlagID(eventFlagId7, OFF);
        }
    }
L10:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    DisableAsset(assetEntityId);
    if (!EventFlag(eventFlagId5)) {
        WaitFor(EventFlag(eventFlagId5));
        RestartEvent();
    }
L0:
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L2, EventFlag(eventFlagId2));
    GotoIf(L3, EventFlag(eventFlagId3));
    GotoIf(L4, EventFlag(eventFlagId4));
L1:
    GotoIf(L5, !EventFlag(eventFlagId6));
    Goto(L6);
L5:
    SetCharacterBackreadState(chrEntityId, false);
    DisableCharacter(chrEntityId);
    SetCharacterTeamType(chrEntityId, TeamType.FriendlyNPC);
    EnableAsset(assetEntityId);
    DisableCharacterCollision(chrEntityId);
    SetCharacterTalkRange(chrEntityId, range);
    GotoIf(L20, mainGroupAbuse);
L6:
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacter(chrEntityId);
    SetCharacterTeamType(chrEntityId, TeamType.FriendlyNPC);
    DisableAsset(assetEntityId);
    GotoIf(L20, mainGroupAbuse);
L2:
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacter(chrEntityId);
    DisableAsset(assetEntityId);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    Goto(L20);
L3:
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacter(chrEntityId);
    DisableAsset(assetEntityId);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    Goto(L20);
L4:
    DisableAsset(assetEntityId);
    Goto(L20);
L20:
    WaitFor(!EventFlag(eventFlagId5));
    RestartEvent();
});

$Event(90005763, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, range, assetEntityId, animationId) {
    DisableNetworkSync();
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
    }
L10:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    DisableAsset(assetEntityId);
    if (!EventFlag(eventFlagId3)) {
        WaitFor(EventFlag(eventFlagId3));
        RestartEvent();
    }
L0:
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L4, EventFlag(eventFlagId2));
L1:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.Disabled);
    SetCharacterTalkRange(chrEntityId, range);
    if (Signed(-1) != animationId) {
        ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    }
    EnableAsset(assetEntityId);
    WarpAssetToCharacter(assetEntityId, chrEntityId, -1);
    Goto(L20);
L4:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    ForceCharacterTreasure(chrEntityId);
    Goto(L20);
L20:
    WaitFor(!EventFlag(eventFlagId3));
    RestartEvent();
});

$Event(90005764, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, animationId, range, chrEntityId2, assetEntityId) {
    DisableNetworkSync();
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
        if (EventFlag(eventFlagId)) {
            SetEventFlagID(eventFlagId6, OFF);
        }
    }
L10:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    EnableCharacterGravity(chrEntityId);
    DisableAssetInvunerability(assetEntityId);
    if (!EventFlag(eventFlagId5)) {
        WaitFor(EventFlag(eventFlagId5));
        RestartEvent();
    }
L0:
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L2, EventFlag(eventFlagId2));
    GotoIf(L3, EventFlag(eventFlagId3));
    GotoIf(L4, EventFlag(eventFlagId4));
L1:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacterInvincibility(chrEntityId);
    EnableAssetInvunerability(assetEntityId);
    DisableCharacterGravity(chrEntityId);
    IssueShortWarpRequest(chrEntityId, TargetEntityType.Area, chrEntityId2, -1);
    ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    SetCharacterTalkRange(chrEntityId, range);
    Goto(L20);
L2:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    Goto(L20);
L3:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    SetCharacterTeamType(chrEntityId, TeamType.HostileNPC);
    Goto(L20);
L4:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    Goto(L20);
L20:
    WaitFor(!EventFlag(eventFlagId5));
    RestartEvent();
});

$Event(90005765, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, animationId, range, eventFlagId7, timeSeconds) {
    DisableNetworkSync();
    WaitFixedTimeFrames(1);
    if (PlayerIsInOwnWorld()) {
        if (EventFlag(eventFlagId)) {
            SetEventFlagID(eventFlagId6, OFF);
        }
    }
L10:
    DisableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, true);
    if (!EventFlag(eventFlagId5)) {
        WaitFor(EventFlag(eventFlagId5));
        RestartEvent();
    }
L0:
    GotoIf(L1, EventFlag(eventFlagId));
    GotoIf(L2, EventFlag(eventFlagId2));
    GotoIf(L3, EventFlag(eventFlagId3));
    GotoIf(L4, EventFlag(eventFlagId4));
L1:
    EnableCharacter(chrEntityId);
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacterImmortality(chrEntityId);
    if (Signed(-1) != animationId) {
        ForceAnimationPlayback(chrEntityId, animationId, true, false, false);
    }
    SetCharacterTalkRange(chrEntityId, range);
    Goto(L20);
L2:
L3:
L4:
    Goto(L20);
L20:
    flag = !EventFlag(eventFlagId5);
    WaitFor(
        flag
            || (CountEventFlags(TargetEventFlagType.EventFlag, eventFlagId2, eventFlagId3) == 1
                && EventFlag(eventFlagId7)));
    RestartIf(flag.Passed);
    WaitFixedTimeSeconds(timeSeconds);
    SetEventFlagID(eventFlagId7, OFF);
    RestartEvent();
});

$Event(90005766, Restart, function(eventFlagId, chrEntityId, range, eventFlagId2, eventFlagId3) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId3));
    WaitFor(EventFlag(eventFlagId));
    SetCharacterTalkRange(chrEntityId, range);
    SetEventFlagID(eventFlagId2, ON);
    SetEventFlagID(eventFlagId3, ON);
});

$Event(90005767, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, eventFlagId4, chrEntityId2, eventFlagId5) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId3));
    WaitFor(CharacterRatioDead(chrEntityId) || CharacterRatioDead(chrEntityId2));
    BatchSetNetworkconnectedEventFlags(eventFlagId2, eventFlagId3, OFF);
    SetNetworkconnectedEventFlagID(eventFlagId3, ON);
    SetEventFlagID(eventFlagId, ON);
    SetEventFlagID(eventFlagId4, ON);
    SetEventFlagID(4895, OFF);
    if (CharacterRatioDead(chrEntityId2)) {
        SetEventFlagID(eventFlagId5, ON);
    }
    SaveRequest();
});

$Event(90005768, Restart, function(eventFlagId, itemLotId, eventFlagId2, itemLotId2, eventFlagId3, eventFlagId4) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2) && EventFlag(eventFlagId3));
    WaitFor(ElapsedSeconds(2) && EventFlag(eventFlagId));
    GotoIf(L0, EventValue(eventFlagId4, 4) == 0);
    Goto(L1);
L0:
    if (PlayerIsInOwnWorld()) {
        AwardItemsIncludingClients(itemLotId);
    }
    Goto(L5);
L1:
    if (PlayerIsInOwnWorld()) {
        AwardItemsIncludingClients(itemLotId2);
    }
    Goto(L5);
L5:
    EndEvent();
});

$Event(90005769, Restart, function(chrEntityId, eventFlagId, chrEntityId2, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5) {
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId4) || EventFlag(eventFlagId5));
    WaitFor(
        EventFlag(eventFlagId)
            && (CharacterHPValue(chrEntityId) <= 0 || CharacterDead(chrEntityId))
            && (EventFlag(eventFlagId2)
                || CharacterHPValue(chrEntityId2) <= 0
                || CharacterDead(chrEntityId2)));
    SetEventFlagID(eventFlagId3, ON);
});

// 【共通】会話NPCフラグON同期 -- [Common] Conversation NPC flag ON synchronization
$Event(90005770, Restart, function(eventFlagId) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId));
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
});

// 【共通】特定篝火付近判定 -- [Common] Judgment near specific bonfires
$Event(90005771, Restart, function(entityId, eventFlagId) {
    EndIf(!PlayerIsInOwnWorld());
    SetEventFlagID(eventFlagId, OFF);
    WaitFor(EntityInRadiusOfEntity(10000, entityId, 3, 1));
    SetEventFlagID(eventFlagId, ON);
    WaitFor(!EntityInRadiusOfEntity(10000, entityId, 3, 1));
    RestartEvent();
});

// 【共通】キャラ無効化 -- [Common] Character invalidation
$Event(90005772, Restart, function(chrEntityId) {
    SetCharacterBackreadState(chrEntityId, true);
    DisableCharacter(chrEntityId);
});

// 【共通】セーブ要求 -- [Common] Save request
$Event(90005773, Default, function(eventFlagId) {
    EndIf(!PlayerIsInOwnWorld());
    SetEventFlagID(eventFlagId, OFF);
    WaitFor(EventFlag(eventFlagId));
    SaveRequest();
    RestartEvent();
});

// 【共通】疑似マルチ報酬取得 -- [Common] Obtain pseudo multi-reward
$Event(90005774, Default, function(eventFlagId, itemLotId, eventFlagId2) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId2));
    WaitFor(ElapsedSeconds(2) && EventFlag(eventFlagId));
    if (PlayerIsInOwnWorld()) {
        AwardItemsIncludingClients(itemLotId);
    }
    EndEvent();
});

// 【共通】会話NPC地図に情報を書き込む -- [Common] Conversation NPC Write information on the map
$Event(90005775, Restart, function(worldMapPointParamId, eventFlagId, distance) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId));
    OpenWorldMapPoint(worldMapPointParamId, distance);
});

$Event(90005776, Restart, function(eventFlagId, eventFlagId2, itemLotId) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(ElapsedSeconds(2) && EventFlag(eventFlagId2));
    AwardItemLot(itemLotId);
    EndEvent();
});

$Event(90005777, Restart, function(chrEntityId, eventFlagId, eventFlagId2, eventFlagId3) {
    WaitFixedTimeFrames(1);
    DisableCharacter(chrEntityId);
    if (!EventFlag(eventFlagId) || EventFlag(eventFlagId2)) {
        EndEvent();
    }
    EndIf(EventFlag(eventFlagId3));
    EnableCharacter(chrEntityId);
    WaitFor(CharacterHPValue(chrEntityId) >= 1 && EventFlag(eventFlagId2));
    RestartEvent();
});

$Event(90005778, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, entityId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    SetEventFlagID(eventFlagId, ON);
    EndIf(EventFlag(eventFlagId2));
    EndIf(EventFlag(eventFlagId3));
    SetEventFlagID(eventFlagId, OFF);
    WaitFor(
        HasDamageType(entityId, 10000, DamageType.Unspecified)
            || HasDamageType(entityId, 40000, DamageType.Unspecified)
            || EventFlag(eventFlagId2)
            || EventFlag(eventFlagId3));
    SetEventFlagID(eventFlagId, ON);
});

$Event(90005779, Restart, function(chrEntityId, eventFlagId, animationId, eventFlagId2, eventFlagId3) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    EndIf(EventFlag(eventFlagId));
    EndIf(!EventFlag(eventFlagId2));
    EndIf(EventFlag(eventFlagId3));
    WaitFor(CharacterHasSpEffect(chrEntityId, 9617));
    EndIf(CharacterHPValue(chrEntityId) < 1);
    ForceAnimationPlayback(chrEntityId, animationId, false, true, false);
});

// 【共通】協力NPC_召喚 -- [Common] Cooperation NPC_Summon
$Event(90005780, Default, function(eventFlagId, eventFlagId2, eventFlagId3, npcEntityId, signType, areaEntityId, eventFlagId4, unknown, value) {
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(npcEntityId, AuthorityLevel.Forced);
    }
    DeleteNPCSummonSign(npcEntityId);
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId3));
    if (0 != eventFlagId4) {
        flagOnlineChrArea &= EventFlag(eventFlagId4);
    }
    flagOnlineChrArea &= PlayerIsInOwnWorld()
        && CharacterBackreadStatus(npcEntityId)
        && EntityInRadiusOfEntity(10000, npcEntityId, 10, 1);
    WaitFor(flagOnlineChrArea);
    PlaceNPCSummonSign(signType, npcEntityId, areaEntityId, eventFlagId2, eventFlagId3, unknown);
    EndIf(Signed(0) == value);
});

// 【共通】協力NPC_バックリート有効化 -- [Common] Cooperating NPC_Backleat Activation
$Event(90005781, Default, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId) {
    DisableCharacter(chrEntityId);
    DisableCharacterCollision(chrEntityId);
    DisableCharacterAI(chrEntityId);
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId3));
    WaitFor(EventFlag(eventFlagId2));
    SetCharacterBackreadState(chrEntityId, false);
    EnableCharacter(chrEntityId);
    EnableCharacterCollision(chrEntityId);
    EnableCharacterAI(chrEntityId);
    EnableCharacterDefaultBackread(chrEntityId);
    WaitFor(EventFlag(eventFlagId3));
    DisableCharacterDefaultBackread(chrEntityId);
});

// 【共通】協力NPC_ボス部屋入場 -- [Common] Cooperating NPC_Boss room entry
$Event(90005782, Default, function(eventFlagId, eventFlagId2, chrEntityId, entityId, areaEntityId, animationId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId) && EventFlag(eventFlagId2));
    RequestCharacterAICommand(chrEntityId, 10, 0);
    RequestCharacterAIReplan(chrEntityId);
    SetEventPoint(chrEntityId, areaEntityId, 0);
    WaitFor(InArea(chrEntityId, areaEntityId));
    if (Signed(animationId) != 0) {
        RotateCharacter(chrEntityId, entityId, animationId, true);
    } else {
        RotateCharacter(chrEntityId, entityId, 60060, true);
    }
    time = ElapsedSeconds(3);
    WaitFor(time || InArea(chrEntityId, eventFlagId2));
    RestartIf(time.Passed);
    RequestCharacterAICommand(chrEntityId, -1, 0);
    RequestCharacterAIReplan(chrEntityId);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AlwaysUpdate);
});

// 【共通】協力NPC_ボス部屋入場Ver2 -- [Common] Cooperation NPC_Boss room entrance Ver2
$Event(90005784, Default, function(eventFlagId, eventFlagId2, chrEntityId, areaEntityId, areaEntityId2, animationId) {
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId) && EventFlag(eventFlagId2));
    RequestCharacterAICommand(chrEntityId, 10, 0);
    RequestCharacterAIReplan(chrEntityId);
    SetEventPoint(chrEntityId, areaEntityId2, 0);
    WaitFor(InArea(chrEntityId, areaEntityId2));
    if (Signed(animationId) != 0) {
        RotateCharacter(chrEntityId, areaEntityId, animationId, true);
    } else {
        RotateCharacter(chrEntityId, areaEntityId, 60060, true);
    }
    time = ElapsedSeconds(3);
    WaitFor(time || InArea(chrEntityId, areaEntityId));
    RestartIf(time.Passed);
    RequestCharacterAICommand(chrEntityId, -1, 0);
    RequestCharacterAIReplan(chrEntityId);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AlwaysUpdate);
});

// 【共通】協力NPC_帰還 -- [Common] Cooperation NPC_Return
$Event(90005783, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, npcEntityId, entityId, areaEntityId, value) {
    EndIf(EventFlag(eventFlagId));
    flag = EventFlag(eventFlagId) && EventFlag(eventFlagId2);
    onlineFlagChrArea &= PlayerIsInOwnWorld()
        && EventFlag(eventFlagId2)
        && CharacterAIState(npcEntityId, AIStateType.Combat, NotEqual, 1);
    if (areaEntityId == 0) {
        onlineFlagChrArea &= !EntityInRadiusOfEntity(10000, entityId, 75, 1);
    } else {
        onlineFlagChrArea &= !InArea(10000, areaEntityId);
    }
    onlineFlagArea &= PlayerIsInOwnWorld() && EventFlag(eventFlagId2);
    if (Signed(value) != 2) {
        GotoIf(S0, Signed(value) == 1);
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, 180, 1);
        Goto(S1);
S0:
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, 360, 1);
    } else {
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, 720, 1);
    }
S1:
    WaitFor(flag || onlineFlagChrArea || onlineFlagArea);
    EndIf(EventFlag(eventFlagId) && EventFlag(eventFlagId3));
    SendNPCSummonHome(npcEntityId);
    EndEvent();
});

// 【共通】協力NPC_帰還Ver2 -- [Common] Cooperation NPC_Return Ver2
$Event(90005785, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, npcEntityId, entityId, areaEntityId, targetDistance) {
    EndIf(EventFlag(eventFlagId));
    flag = EventFlag(eventFlagId) && EventFlag(eventFlagId2);
    onlineFlagArea &= PlayerIsInOwnWorld() && EventFlag(eventFlagId2);
    if (areaEntityId == 0) {
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, targetDistance, 1);
    } else {
        onlineFlagArea &= !InArea(10000, areaEntityId);
    }
    WaitFor(flag || onlineFlagArea);
    EndIf(EventFlag(eventFlagId) && EventFlag(eventFlagId3));
    SendNPCSummonHome(npcEntityId);
    EndEvent();
});

// 【共通】敵対NPC_侵入 -- [Common] Hostile NPC_Intrusion
$Event(90005790, Default, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, npcEntityId, signType, areaEntityId, areaEntityId2, timeSeconds, eventFlagId5, unknown, value) {
    DisableNetworkSync();
    EndIf(!PlayerIsInOwnWorld());
    if (0 != eventFlagId) {
        EndIf(EventFlag(eventFlagId));
    }
    EndIf(EventFlag(eventFlagId2));
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(npcEntityId, AuthorityLevel.Forced);
    }
    EndIf(EventFlag(eventFlagId4));
    onlineFlagArea &= PlayerIsInOwnWorld()
        && !EventFlag(eventFlagId)
        && !EventFlag(eventFlagId2)
        && !EventFlag(eventFlagId3);
    if (0 != eventFlagId5) {
        onlineFlagArea &= EventFlag(eventFlagId5);
    }
    onlineFlagArea &= InArea(10000, areaEntityId2) && !EventFlag(9000);
    WaitFor(onlineFlagArea);
    WaitFixedTimeSeconds(timeSeconds);
    PlaceNPCSummonSign(signType, npcEntityId, areaEntityId, eventFlagId3, eventFlagId4, unknown);
    WaitFixedTimeSeconds(1);
    RestartEvent();
    EndIf(Signed(0) == value);
});

// 【共通】敵対NPC_バックリート有効化 -- [Common] Hostile NPC_Backleat enabled
$Event(90005791, Default, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId) {
    DisableCharacter(chrEntityId);
    DisableCharacterCollision(chrEntityId);
    DisableCharacterAI(chrEntityId);
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId3));
    WaitFor(EventFlag(eventFlagId2));
    SetCharacterBackreadState(chrEntityId, false);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
    EnableCharacter(chrEntityId);
    EnableCharacterCollision(chrEntityId);
    EnableCharacterAI(chrEntityId);
    EnableCharacterDefaultBackread(chrEntityId);
    WaitFor(EventFlag(eventFlagId3));
    DisableCharacterDefaultBackread(chrEntityId);
    SetNetworkUpdateRate(chrEntityId, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
});

// 【共通】敵対NPC_撃破 -- [Common] Hostile NPC_Defeated
$Event(90005792, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, itemLotId, timeSeconds) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndEvent();
    }
L0:
    WaitFor(CharacterRatioDead(chrEntityId) && EventFlag(eventFlagId2));
    WaitFixedTimeSeconds(timeSeconds);
    SetEventFlagID(eventFlagId, ON);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(Signed(itemLotId) == 0);
    AwardItemsIncludingClients(itemLotId);
    EndEvent();
    flag = EventFlag(eventFlagId3);
});

// 【共通】敵対NPC_帰還 -- [Common] Hostile NPC_Return
$Event(90005793, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, npcEntityId, entityId, areaEntityId, value) {
    EndIf(EventFlag(eventFlagId));
    EndIf(!PlayerIsInOwnWorld());
    flag = EventFlag(eventFlagId);
    onlineFlagChrArea &= PlayerIsInOwnWorld()
        && EventFlag(eventFlagId2)
        && CharacterAIState(npcEntityId, AIStateType.Combat, NotEqual, 1);
    if (areaEntityId == 0) {
        onlineFlagChrArea &= !EntityInRadiusOfEntity(10000, entityId, 110, 1);
    } else {
        onlineFlagChrArea &= !InArea(10000, areaEntityId);
    }
    onlineFlagArea &= PlayerIsInOwnWorld() && EventFlag(eventFlagId2);
    if (Signed(value) != 2) {
        GotoIf(S0, Signed(value) == 1);
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, 180, 1);
        Goto(S1);
S0:
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, 360, 1);
    } else {
        onlineFlagArea &= !EntityInRadiusOfEntity(10000, entityId, 720, 1);
    }
S1:
    WaitFor(flag || onlineFlagChrArea || onlineFlagArea);
    EndIf(EventFlag(eventFlagId));
    SendNPCSummonHome(npcEntityId);
    EndEvent();
    flag2 = !EventFlag(eventFlagId3);
});

// 【共通】NPC疑似マルチ_開始 -- [Common] NPC pseudo multi_start
$Event(90005795, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, messageId, actionButtonParameterId, assetEntityId, sfxId) {
    DisableNetworkSync();
    EndIf(!PlayerIsInOwnWorld());
    SetEventFlagID(eventFlagId4, OFF);
    SetEventFlagID(eventFlagId5, OFF);
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndIf(EventFlag(eventFlagId));
    WaitFor(
        EventFlag(eventFlagId3)
            && PlayerIsInOwnWorld()
            && !(HasMultiplayerState(MultiplayerState.Multiplayer)
                || HasMultiplayerState(MultiplayerState.MultiplayerPending)));
    CreateAssetfollowingSFX(assetEntityId, 100, sfxId);
    online = HasMultiplayerState(MultiplayerState.Multiplayer)
        || HasMultiplayerState(MultiplayerState.MultiplayerPending);
    WaitFor(
        online
            || ActionButtonInArea(actionButtonParameterId, assetEntityId)
            || !EventFlag(eventFlagId3));
    RestartIf(online.Passed);
    RestartIf(!EventFlag(eventFlagId3));
    DisplayGenericDialogAndSetEventFlags(messageId, PromptType.YESNO, NumberofOptions.TwoButtons, assetEntityId, 2, eventFlagId4, eventFlagId5, eventFlagId5);
    RestartIf(!EventFlag(eventFlagId4));
    SetEventFlagID(eventFlagId2, ON);
    SetSpEffect(10000, 15);
    WaitFixedTimeSeconds(20);
    RestartEvent();
});

// 【共通】NPC疑似マルチ_終了 -- [Common] NPC pseudo-multi_end
$Event(90005796, Restart, function(eventFlagId, chrEntityId, bannerType, areaEntityId) {
    DisableNetworkSync();
    EndIf(PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(CharacterRatioDead(chrEntityId));
    SetEventFlagID(eventFlagId, ON);
    DisplayBanner(bannerType);
    if (areaEntityId != 0) {
        SetPsuedoMultiplayerReturnPosition(areaEntityId);
    }
    IssueEndOfPseudoMultiplayerNotification(true);
});

// 【共通】NPC疑似マルチ_終了Ver2 -- [Common] NPC pseudo multi_end Ver2
$Event(90005797, Restart, function(eventFlagId, chrEntityId, bannerType, areaEntityId, spEffectId) {
    DisableNetworkSync();
    EndIf(PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(CharacterRatioDead(chrEntityId));
    SetEventFlagID(eventFlagId, ON);
    DisplayBanner(bannerType);
    SetSpEffect(20000, spEffectId);
    if (areaEntityId != 0) {
        SetPsuedoMultiplayerReturnPosition(areaEntityId);
    }
    IssueEndOfPseudoMultiplayerNotification(true);
});

$Event(90005798, Restart, function(eventFlagId, chrEntityId, bannerType, areaEntityId, eventFlagId2, spEffectId) {
    DisableNetworkSync();
    EndIf(PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(CharacterRatioDead(chrEntityId));
    SetEventFlagID(eventFlagId, ON);
    DisplayBanner(bannerType);
    SetSpEffect(20000, spEffectId);
    if (areaEntityId != 0) {
        SetPsuedoMultiplayerReturnPosition(areaEntityId);
    }
    WaitFor(EventFlag(eventFlagId2));
    IssueEndOfPseudoMultiplayerNotification(true);
});

$Event(90005799, Restart, function(eventFlagId, chrEntityId, bannerType, areaEntityId, eventFlagId2, chrEntityId2, spEffectId) {
    DisableNetworkSync();
    EndIf(PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    DisableCharacterCollision(chrEntityId2);
    DisableCharacterGravity(chrEntityId2);
    WaitFor(CharacterRatioDead(chrEntityId));
    SetEventFlagID(eventFlagId, ON);
    DisplayBanner(bannerType);
    SetSpEffect(20000, spEffectId);
    if (areaEntityId != 0) {
        SetPsuedoMultiplayerReturnPosition(areaEntityId);
    }
    WaitFor(EventFlag(eventFlagId2));
    ForceCharacterDeath(chrEntityId2, false);
    IssueEndOfPseudoMultiplayerNotification(true);
});

// 【共通】ホストがボス部屋入場 -- [Common] Host enters the boss room
$Event(9005800, Restart, function(eventFlagId, entityId, areaEntityId, eventFlagId2, chrEntityId, actionButtonParameterId, eventFlagId3, areaEntityId2) {
    if (!EventFlag(eventFlagId)) {
        WaitFixedTimeFrames(1);
        if (eventFlagId3 != 0) {
            GotoIf(L0, EventFlag(eventFlagId3));
            if (areaEntityId2 != 0) {
                areaFlag |= InArea(10000, areaEntityId2);
            }
            areaFlag |= EventFlag(eventFlagId3);
            WaitFor((areaFlag && PlayerIsInOwnWorld()) || EventFlag(eventFlagId));
            RestartIf(EventFlag(eventFlagId));
            Goto(L1);
        }
L0:
        if (PlayerIsInOwnWorld()) {
            WaitFor(
                EventFlag(eventFlagId)
                    || (PlayerIsInOwnWorld()
                        && !EventFlag(eventFlagId)
                        && ActionButtonInArea(actionButtonParameterId, entityId)));
            GotoIf(L2, !PlayerIsInOwnWorld());
            RestartIf(EventFlag(eventFlagId));
            SuppressSoundForFogGate(5);
            if (!CharacterHasSpEffect(10000, 4250)) {
                RotateCharacter(10000, areaEntityId, 60060, true);
            } else {
                RotateCharacter(10000, areaEntityId, 60060, false);
            }
        }
L3:
        GotoIf(L1, EventFlag(eventFlagId2));
        time = ElapsedSeconds(3);
        WaitFor(
            ((InArea(10000, areaEntityId) || time)
                && PlayerIsInOwnWorld()
                && !EventFlag(eventFlagId))
                || EventFlag(eventFlagId));
        RestartIf(EventFlag(eventFlagId));
        RestartIf(time.Passed);
L1:
        if (PlayerIsInOwnWorld()) {
            IssueBossRoomEntryNotification();
            SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
        }
L2:
        ActivateMultiplayerdependantBuffs(chrEntityId);
        SetNetworkconnectedEventFlagID(eventFlagId2, ON);
        EndIf(!PlayerIsInOwnWorld());
        RestartEvent();
    }
L10:
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(
        PlayerIsInOwnWorld()
            && EventFlag(eventFlagId)
            && (HasMultiplayerState(MultiplayerState.Invasion)
                || HasMultiplayerState(MultiplayerState.InvasionPending))
            && ActionButtonInArea(10000, entityId));
    RotateCharacter(10000, areaEntityId, 60060, true);
    SendInvadingPhantomsHome(0);
    RestartEvent();
});

// 【共通】ゲストがボス部屋入場 -- [Common] Guest enters the boss room
$Event(9005801, Restart, function(eventFlagId, entityId, areaEntityId, eventFlagId2, eventFlagId3, actionButtonParameterId) {
    DisableNetworkSync();
    EndIf(EventFlag(eventFlagId));
    WaitFor(
        !EventFlag(eventFlagId)
            && EventFlag(eventFlagId2)
            && CharacterType(10000, TargetType.WhitePhantom)
            && ActionButtonInArea(actionButtonParameterId, entityId));
    SuppressSoundForFogGate(5);
    RotateCharacter(10000, areaEntityId, 60060, true);
    time = ElapsedSeconds(3);
    WaitFor(CharacterType(10000, TargetType.WhitePhantom) && (InArea(10000, areaEntityId) || time));
    RestartIf(time.Passed);
    SetEventFlagID(eventFlagId3, ON);
    RestartEvent();
});

// 【共通】ボス用篝火処理 -- [Common] Bonfire processing for boss
$Event(9005810, Restart, function(eventFlagId, eventFlagId2, chrEntityId, assetEntityId, enemyDeactivationDistance) {
    if (!EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableAsset(assetEntityId);
        WaitFixedTimeSeconds(1);
        WaitFor(EventFlag(eventFlagId));
        SpawnOneshotSFX(TargetEntityType.Asset, assetEntityId, 200, 1060);
        WaitFixedTimeSeconds(0.5);
        EnableCharacter(chrEntityId);
        EnableAsset(assetEntityId);
    }
L0:
    RegisterBonfire(eventFlagId2, assetEntityId, 5, 180, 0, enemyDeactivationDistance);
});

// 【共通】ボス用白扉処理 -- [Common] White door treatment for boss
$Event(9005811, Restart, function(eventFlagId, assetEntityId, sfxId, eventFlagId2) {
    DisableNetworkSync();
    DisableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    chrFlag = (CharacterType(10000, TargetType.BlackPhantom)
        || CharacterType(10000, TargetType.Invader)
        || CharacterType(10000, TargetType.Invader2)
        || CharacterType(10000, TargetType.Invader3))
        && !EventFlag(eventFlagId);
    chrFlag2 = (CharacterType(10000, TargetType.WhitePhantom) || CharacterType(10000, TargetType.BluePhantom))
        && !EventFlag(eventFlagId);
    if (0 != eventFlagId2) {
        flag &= EventFlag(eventFlagId2);
    }
    flag &= !EventFlag(eventFlagId);
    WaitFor(
        chrFlag
            || chrFlag2
            || flag
            || ((HasMultiplayerState(MultiplayerState.Invasion)
                || HasMultiplayerState(MultiplayerState.InvasionPending))
                && EventFlag(eventFlagId)
                && !CharacterType(10000, TargetType.WhitePhantom))
            || ((HasMultiplayerState(MultiplayerState.Invasion)
                || HasMultiplayerState(MultiplayerState.InvasionPending))
                && EventFlag(eventFlagId)
                && CharacterType(10000, TargetType.WhitePhantom)
                && !EntityInRadiusOfEntity(10000, assetEntityId, 1, 1)));
    EnableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 101, sfxId);
    chrFlag3 = (CharacterType(10000, TargetType.BlackPhantom)
        || CharacterType(10000, TargetType.Invader)
        || CharacterType(10000, TargetType.Invader2)
        || CharacterType(10000, TargetType.Invader3))
        && !EventFlag(eventFlagId);
    chrFlag4 = (CharacterType(10000, TargetType.WhitePhantom) || CharacterType(10000, TargetType.BluePhantom))
        && !EventFlag(eventFlagId);
    if (0 != eventFlagId2) {
        flag2 &= EventFlag(eventFlagId2);
    }
    flag2 &= !EventFlag(eventFlagId);
    WaitFor(
        !chrFlag3
            && !chrFlag4
            && !flag2
            && !((HasMultiplayerState(MultiplayerState.Invasion)
                || HasMultiplayerState(MultiplayerState.InvasionPending))
                && EventFlag(eventFlagId)
                && !CharacterType(10000, TargetType.WhitePhantom))
            && !((HasMultiplayerState(MultiplayerState.Invasion)
                || HasMultiplayerState(MultiplayerState.InvasionPending))
                && EventFlag(eventFlagId)
                && CharacterType(10000, TargetType.WhitePhantom)
                && !EntityInRadiusOfEntity(10000, assetEntityId, 1, 1)));
    RestartEvent();
});

// 【共通】ボス用白扉処理Ver2 -- [Common] Boss white door processing Ver2
$Event(9005812, Restart, function(eventFlagId, assetEntityId, sfxId, eventFlagId2, sfxId2) {
    DisableNetworkSync();
    DisableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    if (!EventFlag(eventFlagId)) {
        if (0 != eventFlagId2) {
            flag &= EventFlag(eventFlagId2);
        }
        flag &= !EventFlag(eventFlagId);
        WaitFor(
            flag
                || CharacterType(10000, TargetType.WhitePhantom)
                || CharacterType(10000, TargetType.BluePhantom)
                || CharacterType(10000, TargetType.BlackPhantom)
                || CharacterType(10000, TargetType.Invader)
                || CharacterType(10000, TargetType.Invader2)
                || CharacterType(10000, TargetType.Invader3));
        EnableAsset(assetEntityId);
        DeleteAssetfollowingSFX(assetEntityId, true);
        CreateAssetfollowingSFX(assetEntityId, 101, sfxId);
        if (0 != eventFlagId2) {
            flag2 &= EventFlag(eventFlagId2);
        }
        flag2 &= !EventFlag(eventFlagId);
        WaitFor(
            !flag2
                && !(CharacterType(10000, TargetType.WhitePhantom)
                    || CharacterType(10000, TargetType.BluePhantom))
                && !(CharacterType(10000, TargetType.BlackPhantom)
                    || CharacterType(10000, TargetType.Invader)
                    || CharacterType(10000, TargetType.Invader2)
                    || CharacterType(10000, TargetType.Invader3)));
        RestartEvent();
    }
L0:
    WaitFor(
        HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending)
            || EventFlag(9982));
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending))
            && !EventFlag(9982));
    RestartEvent();
    CreateAssetfollowingSFX(assetEntityId, 101, sfxId2);
});

// 【共通】ボス用白扉処理Ver3 -- [Common] Boss white door processing Ver3
$Event(9005813, Restart, function(eventFlagId, assetEntityId, sfxId, eventFlagId2, sfxId2) {
    DisableNetworkSync();
    DisableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    if (!EventFlag(eventFlagId)) {
        if (0 != eventFlagId2) {
            flag &= EventFlag(eventFlagId2);
        }
        flag &= !EventFlag(eventFlagId);
        WaitFor(
            flag
                || CharacterType(10000, TargetType.WhitePhantom)
                || CharacterType(10000, TargetType.BluePhantom)
                || CharacterType(10000, TargetType.BlackPhantom)
                || CharacterType(10000, TargetType.Invader)
                || CharacterType(10000, TargetType.Invader2)
                || CharacterType(10000, TargetType.Invader3));
        EnableAsset(assetEntityId);
        DeleteAssetfollowingSFX(assetEntityId, true);
        CreateAssetfollowingSFX(assetEntityId, 101, sfxId);
        if (0 != eventFlagId2) {
            flag2 &= EventFlag(eventFlagId2);
        }
        flag2 &= !EventFlag(eventFlagId);
        WaitFor(
            !flag2
                && !(CharacterType(10000, TargetType.WhitePhantom)
                    || CharacterType(10000, TargetType.BluePhantom))
                && !(CharacterType(10000, TargetType.BlackPhantom)
                    || CharacterType(10000, TargetType.Invader)
                    || CharacterType(10000, TargetType.Invader2)
                    || CharacterType(10000, TargetType.Invader3)));
        RestartEvent();
    }
L0:
    WaitFor(
        HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending)
            || HasMultiplayerState(MultiplayerState.Multiplayer));
    EnableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 101, sfxId2);
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending)
            || HasMultiplayerState(MultiplayerState.Multiplayer)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending)));
    RestartEvent();
});

// 【共通】ボス戦BGM再生_２曲 -- [Common] Boss battle BGM playback_2 songs
$Event(9005822, Restart, function(eventFlagId, bgmBossConvParamId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, value, value2) {
    DisableNetworkSync();
    if (EventFlag(eventFlagId)) {
        EndEvent();
    }
L0:
    if (PlayerIsInOwnWorld()) {
        SetEventFlagID(eventFlagId2, OFF);
    }
    flag &= EventFlag(eventFlagId2);
    if (!PlayerIsInOwnWorld()) {
        flag &= EventFlag(eventFlagId3);
    }
    if (0 != eventFlagId4) {
        flag &= EventFlag(eventFlagId4);
    }
    WaitFor(flag);
    WaitFixedTimeFrames(1);
    if (!EventFlag(eventFlagId5)) {
        SetBossBGM(bgmBossConvParamId, BossBGMState.Start);
    }
    WaitFor(EventFlag(eventFlagId5) || EventFlag(eventFlagId));
    if (!EventFlag(eventFlagId)) {
        WaitFixedTimeFrames(1);
        if (Signed(value) != 0) {
        }
        SetBossBGM(bgmBossConvParamId, BossBGMState.HeatUp);
        WaitFor(EventFlag(eventFlagId));
    }
L1:
    if (Signed(value2) != 1) {
        SetBossBGM(bgmBossConvParamId, BossBGMState.Stop2);
        EndEvent();
    }
    SetBossBGM(bgmBossConvParamId, BossBGMState.Stop1);
});

// 【共通】ボス戦BGM再生_３曲 -- [Common] Boss battle BGM playback_3 songs
$Event(9005823, Restart, function(eventFlagId, bgmBossConvParamId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, value, value2) {
    DisableNetworkSync();
    if (PlayerIsInOwnWorld()) {
        SetEventFlagID(eventFlagId2, OFF);
    }
    if (EventFlag(eventFlagId)) {
        EndEvent();
    }
L0:
    flag &= EventFlag(eventFlagId2);
    if (!PlayerIsInOwnWorld()) {
        flag &= EventFlag(eventFlagId3);
    }
    if (0 != eventFlagId4) {
        flag &= EventFlag(eventFlagId4);
    }
    WaitFor(flag);
    SetBossBGM(bgmBossConvParamId, BossBGMState.Start);
    flag2 |= EventFlag(eventFlagId5) || EventFlag(eventFlagId6) || EventFlag(eventFlagId);
    WaitFor(flag2);
    if (!EventFlag(eventFlagId)) {
        if (!EventFlag(eventFlagId6)) {
            WaitFixedTimeFrames(1);
            if (Signed(value) != 1) {
            }
            SetBossBGM(bgmBossConvParamId, BossBGMState.HeatUp);
            flag2 |= EventFlag(eventFlagId6) || EventFlag(eventFlagId);
            WaitFor(flag2);
            GotoIf(L2, EventFlag(eventFlagId));
        }
L1:
        Unknown201008(90003003);
        WaitFor(EventFlag(eventFlagId));
    }
L2:
    if (Signed(value2) != 1) {
        SetBossBGM(bgmBossConvParamId, BossBGMState.Stop2);
        EndEvent();
    }
    SetBossBGM(bgmBossConvParamId, BossBGMState.Stop1);
});

$Event(9005824, Restart, function(eventFlagId, bgmBossConvParamId, eventFlagId2, eventFlagId3, eventFlagId4, eventFlagId5, eventFlagId6, value, value2) {
    DisableNetworkSync();
    if (PlayerIsInOwnWorld()) {
        SetEventFlagID(eventFlagId2, OFF);
    }
    if (EventFlag(eventFlagId)) {
        EndEvent();
    }
L0:
    flag &= EventFlag(eventFlagId2);
    if (!PlayerIsInOwnWorld()) {
        flag &= EventFlag(eventFlagId3);
    }
    if (0 != eventFlagId4) {
        flag &= EventFlag(eventFlagId4);
    }
    WaitFor(flag);
    SetBossBGM(bgmBossConvParamId, BossBGMState.Start);
    flag2 |= EventFlag(eventFlagId5) || EventFlag(eventFlagId6) || EventFlag(eventFlagId);
    WaitFor(flag2);
    if (!EventFlag(eventFlagId)) {
        if (!EventFlag(eventFlagId6)) {
            WaitFixedTimeFrames(1);
            if (Signed(value) != 1) {
            }
            SetBossBGM(bgmBossConvParamId, BossBGMState.HeatUp);
            flag2 |= EventFlag(eventFlagId6) || EventFlag(eventFlagId);
            WaitFor(flag2);
            GotoIf(L2, EventFlag(eventFlagId));
        }
L1:
        SetBossBGM(bgmBossConvParamId, BossBGMState.HeatUp2);
        WaitFor(EventFlag(eventFlagId));
    }
L2:
    if (Signed(value2) != 1) {
        SetBossBGM(bgmBossConvParamId, BossBGMState.Stop2);
        EndEvent();
    }
    SetBossBGM(bgmBossConvParamId, BossBGMState.Stop1);
});

// 【共通】ボス戦入場時CS再生 -- [Common] CS playback when entering a boss battle
$Event(90005830, Restart, function(eventFlagId, areaEntityId) {
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId) || (InArea(10000, areaEntityId) && PlayerIsInOwnWorld()));
    RestartIf(EventFlag(eventFlagId));
    SetSpEffect(10000, 4250);
    WaitFixedTimeSeconds(3);
    RestartEvent();
});

// 【共通】汎用ボス撃破 -- [Common] Defeat general-purpose boss
$Event(9005840, Restart, function(eventFlagId, eventFlagId2, chrEntityId) {
    EndIf(EventFlag(eventFlagId));
    WaitFor(CharacterHPValue(chrEntityId) <= 0);
    WaitFixedTimeSeconds(4);
    PlaySE(chrEntityId, SoundType.SFX, 888880000);
    WaitFor(CharacterDead(chrEntityId));
    HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.DemigodFelled);
    $InitializeCommonEvent(0, 90001010); //boss rewards and defeat handling (overworld)
    EndEvent(); //end
    SetEventFlagID(eventFlagId, ON);
    if (eventFlagId2 != 0) {
        SetEventFlagID(eventFlagId2, ON);
    }
});

// 【共通】汎用ボス出現 -- [Common] General boss appearance
$Event(9005845, Restart, function(eventFlagId, chrEntityId) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndEvent();
    }
L0:
    DisableCharacterAI(chrEntityId);
    if (!EventFlag(11000801)) {
        WaitFor(
            (PlayerIsInOwnWorld() && EntityInRadiusOfEntity(10000, 11000800, 20, 1))
                || HasDamageType(chrEntityId, 10000, DamageType.Unspecified));
        SetNetworkconnectedEventFlagID(11000801, ON);
    } else {
L1:
        WaitFor(EventFlag(11002805) && InArea(10000, 11002800));
    }
L2:
    EnableCharacterAI(11005800);
    SetNetworkUpdateRate(11005800, true, CharacterUpdateFrequency.AlwaysUpdate);
    DisplayBossHealthBar(Enabled, 11000800, 0, 0);
});

// 【共通】フィールドボス撃破 -- [Common] Defeat field boss
$Event(90005860, Restart, function(eventFlagId, eventFlagId2, chrEntityId, value, itemLotId, timeSeconds) {
    if (Signed(itemLotId) != 0) {
        Unknown200476(eventFlagId, itemLotId);
    }
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndIf(!PlayerIsInOwnWorld());
        EndIf(Signed(itemLotId) == 0);
        WaitFixedTimeSeconds(1);
        AwardItemsIncludingClients(itemLotId);
        EndEvent();
    }
L0:
    WaitFor(CharacterHPValue(chrEntityId) <= 0);
    WaitFixedTimeSeconds(2);
    PlaySE(chrEntityId, SoundType.SFX, 888880000);
    WaitFor(CharacterDead(chrEntityId));
    GotoIf(S0, value == 3);
    if (value != 2) {
        if (value != 1) {
            HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.EnemyFelled);
            Goto(L1);
        }
        HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.GreatEnemyFelled);
    }
    Goto(L1);
S0:
    HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.DemigodFelled);
    Goto(L1);
    HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.LegendFelled);
L1:
    $InitializeCommonEvent(0, 90001010); //boss rewards and defeat handling (overworld)
    EndEvent(); //end
    SetEventFlagID(eventFlagId, ON);
    if (eventFlagId2 != 0) {
        SetEventFlagID(eventFlagId2, ON);
    }
    EndIf(!PlayerIsInOwnWorld());
    EndIf(Signed(itemLotId) == 0);
    WaitFixedTimeSeconds(5);
    AwardItemsIncludingClients(itemLotId);
    EndEvent();
    WaitFixedTimeSeconds(timeSeconds);
});

// 【共通】フィールドボス撃破_竜餐 -- [Common] Defeat Field Boss_Dragon Dinner
$Event(90005861, Restart, function(eventFlagId, eventFlagId2, chrEntityId, value, itemLotId, messageId, timeSeconds) {
    if (Signed(itemLotId) != 0) {
        Unknown200476(eventFlagId, itemLotId);
    }
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        EndIf(!PlayerIsInOwnWorld());
        EndIf(Signed(itemLotId) == 0);
        WaitFixedTimeSeconds(1);
        AwardItemsIncludingClients(itemLotId);
        EndEvent();
    }
L0:
    WaitFor(CharacterHPValue(chrEntityId) <= 0);
    WaitFixedTimeSeconds(2);
    PlaySE(chrEntityId, SoundType.SFX, 888880000);
    WaitFor(CharacterDead(chrEntityId));
    GotoIf(S0, value == 3);
    if (value != 2) {
        if (value != 1) {
            HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.EnemyFelled);
            Goto(L1);
        }
        HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.GreatEnemyFelled);
    }
    Goto(L1);
S0:
    HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.DemigodFelled);
    Goto(L1);
    HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.LegendFelled);
L1:
    $InitializeCommonEvent(0, 90001010); //boss rewards and defeat handling (overworld)
    EndEvent(); //end
    SetEventFlagID(eventFlagId, ON);
    if (eventFlagId2 != 0) {
        SetEventFlagID(eventFlagId2, ON);
    }
    EndIf(!PlayerIsInOwnWorld());
    EndIf(Signed(itemLotId) == 0);
    WaitFixedTimeSeconds(5);
    AwardItemsIncludingClients(itemLotId);
    WaitFixedTimeSeconds(2);
    DisplayBlinkingMessage(messageId);
    EndEvent();
    WaitFixedTimeSeconds(timeSeconds);
});

// 【共通】フィールドボスHPゲージ -- [Common] Field boss HP gauge
$Event(90005870, Default, function(chrEntityId, nameId, npcThreatLevel) {
    DisableNetworkSync();
    WaitFor(
        CharacterAIState(chrEntityId, AIStateType.Combat)
            && FieldBattleBGMActive(npcThreatLevel)
            && !EventFlag(9000));
    GotoIf(L0, !EventFlag(9290));
    GotoIf(L1, !EventFlag(9291));
    WaitFixedTimeSeconds(5);
    RestartEvent();
L0:
    SetEventFlagID(9290, ON);
    WaitFixedTimeSeconds(1);
    DisplayBossHealthBar(Enabled, chrEntityId, 0, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
        SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    WaitFor(
        !(CharacterAIState(chrEntityId, AIStateType.Combat) && FieldBattleBGMActive(npcThreatLevel))
            || CharacterDead(chrEntityId)
            || EventFlag(9000));
    if (CharacterDead(chrEntityId)) {
        WaitFixedTimeSeconds(3);
    } else if (!EventFlag(9000)) {
        WaitFixedTimeSeconds(1);
    }
    DisplayBossHealthBar(Disabled, chrEntityId, 0, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Normal);
        SetNetworkUpdateRate(chrEntityId, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    SetEventFlagID(9290, OFF);
    RestartEvent();
L1:
    SetEventFlagID(9291, ON);
    WaitFixedTimeSeconds(1);
    DisplayBossHealthBar(Enabled, chrEntityId, 1, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
        SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    WaitFor(
        !(CharacterAIState(chrEntityId, AIStateType.Combat) && FieldBattleBGMActive(npcThreatLevel))
            || CharacterDead(chrEntityId)
            || EventFlag(9000));
    if (CharacterDead(chrEntityId)) {
        WaitFixedTimeSeconds(3);
    } else if (!EventFlag(9000)) {
        WaitFixedTimeSeconds(1);
    }
    DisplayBossHealthBar(Disabled, chrEntityId, 1, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Normal);
        SetNetworkUpdateRate(chrEntityId, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    SetEventFlagID(9291, OFF);
    RestartEvent();
});

// 【共通】フィールドボスHPゲージ_騎乗 -- [Common] Field Boss HP Gauge_Riding
$Event(90005871, Default, function(chrEntityId, nameId, npcThreatLevel, chrEntityId2) {
    DisableNetworkSync();
    WaitFor(
        CharacterAIState(chrEntityId, AIStateType.Combat)
            && FieldBattleBGMActive(npcThreatLevel)
            && !EventFlag(9000));
    GotoIf(L0, !EventFlag(9290));
    GotoIf(L1, !EventFlag(9291));
    WaitFixedTimeSeconds(5);
    RestartEvent();
L0:
    SetEventFlagID(9290, ON);
    WaitFixedTimeSeconds(1);
    DisplayBossHealthBar(Enabled, chrEntityId, 0, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
        SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
        SetNetworkUpdateAuthority(chrEntityId2, AuthorityLevel.Forced);
        SetNetworkUpdateRate(chrEntityId2, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    WaitFor(
        !(CharacterAIState(chrEntityId, AIStateType.Combat) && FieldBattleBGMActive(npcThreatLevel))
            || CharacterDead(chrEntityId)
            || EventFlag(9000));
    if (CharacterDead(chrEntityId)) {
        WaitFixedTimeSeconds(3);
    } else if (!EventFlag(9000)) {
        WaitFixedTimeSeconds(1);
    }
    DisplayBossHealthBar(Disabled, chrEntityId, 0, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Normal);
        SetNetworkUpdateRate(chrEntityId, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
        SetNetworkUpdateAuthority(chrEntityId2, AuthorityLevel.Normal);
        SetNetworkUpdateRate(chrEntityId2, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    SetEventFlagID(9290, OFF);
    RestartEvent();
L1:
    SetEventFlagID(9291, ON);
    WaitFixedTimeSeconds(1);
    DisplayBossHealthBar(Enabled, chrEntityId, 1, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
        SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Forced);
        SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    WaitFor(
        !(CharacterAIState(chrEntityId, AIStateType.Combat) && FieldBattleBGMActive(npcThreatLevel))
            || CharacterDead(chrEntityId)
            || EventFlag(9000));
    if (CharacterDead(chrEntityId)) {
        WaitFixedTimeSeconds(3);
    } else if (!EventFlag(9000)) {
        WaitFixedTimeSeconds(1);
    }
    DisplayBossHealthBar(Disabled, chrEntityId, 1, nameId);
    if (PlayerIsInOwnWorld()) {
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Normal);
        SetNetworkUpdateRate(chrEntityId, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
        SetNetworkUpdateAuthority(chrEntityId, AuthorityLevel.Normal);
        SetNetworkUpdateRate(chrEntityId, false, CharacterUpdateFrequency.AtLeastEvery2Frames);
    }
    SetEventFlagID(9291, OFF);
    RestartEvent();
});

// 【共通】フィールドボス_HU通知 -- [Common] Field Boss_HU notification
$Event(90005872, Default, function(chrEntityId, npcThreatLevel, eventFlagId) {
    DisableNetworkSync();
    if (0 != eventFlagId) {
        flagHp &= EventFlag(eventFlagId);
    } else {
        flagHp &= HPRatio(chrEntityId) <= 0.55;
    }
    flagHp &= FieldBattleBGMActive(npcThreatLevel);
    WaitFor(flagHp);
    SetFieldBattleBGMHeatUp(npcThreatLevel, true);
    WaitFor(CharacterDead(chrEntityId) || !FieldBattleBGMActive(npcThreatLevel));
    SetFieldBattleBGMHeatUp(npcThreatLevel, false);
    WaitFixedTimeSeconds(0.3);
    RestartEvent();
});

// 【共通】円形サークルボス撃破 -- [Common] Defeat the circle boss
$Event(90005880, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, itemLotId, areaId, blockId, regionId, indexId, initialAreaEntityId) {
    EndIf(EventFlag(eventFlagId));
    EndIf(!PlayerIsInOwnWorld());
    EndIf(!EventFlag(eventFlagId2));
    WaitFor(CharacterDead(chrEntityId));
    WaitFixedTimeSeconds(3);
    HandleBossDefeatAndDisplayBanner(chrEntityId, TextBannerType.EnemyFelled);
    $InitializeCommonEvent(0, 90001010); //boss rewards and defeat handling (overworld)
    DeactivateGparamOverride(10);
    EndEvent(); //end
    AwardItemsIncludingClients(itemLotId);
    SetNetworkconnectedEventFlagID(eventFlagId, ON);
    WaitFixedTimeSeconds(5);
    SetSpEffect(20000, 8870);
    WaitFixedTimeSeconds(2);
    SetEventFlagID(eventFlagId3, ON);
    SetEventFlagID(9295, ON);
    WarpPlayer(areaId, blockId, regionId, indexId, initialAreaEntityId, 0);
    EndEvent();
});

// 【共通】円形サークルボス開始 -- [Common] Circular circle boss start
$Event(90005881, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, eventFlagId4, messageId, entityId, areaId, blockId, regionId, indexId, initialAreaEntityId) {
    SetEventFlagID(eventFlagId3, OFF);
    SetEventFlagID(eventFlagId4, OFF);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId2));
    WaitFor(
        !HasMultiplayerState(MultiplayerState.MultiplayerPending)
            && HasMultiplayerState(MultiplayerState.Singleplayer)
            && ActionButtonInArea(9230, entityId));
    DisplayGenericDialogAndSetEventFlags(messageId, PromptType.YESNO, NumberofOptions.TwoButtons, entityId, 3, eventFlagId3, eventFlagId4, eventFlagId4);
    RestartIf(EventFlag(eventFlagId4));
    RestartIf(
        HasMultiplayerState(MultiplayerState.Multiplayer)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending));
    SetNetworkconnectedEventFlagID(eventFlagId2, ON);
    SetSpEffect(10000, 514);
    WaitFixedTimeFrames(1);
    ForceAnimationPlayback(10000, 60450, false, false, false);
    WaitFixedTimeSeconds(1.5);
    WarpCharacterAndCopyFloorWithFadeout(10000, TargetEntityType.Area, initialAreaEntityId, -1, 10000, true, true);
    SetEventFlagID(9021, ON);
    EndEvent();
    WarpPlayer(areaId, blockId, regionId, indexId, initialAreaEntityId, 0);
});

// 【共通】円形サークルボス出現 -- [Common] Circular circle boss appears
$Event(90005882, Restart, function(eventFlagId, eventFlagId2, eventFlagId3, chrEntityId, eventFlagId4, chrEntityId2, assetEntityId, chrEntityId3, entityId, nameId, animationId, animationId2) {
    if (EventFlag(eventFlagId)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
        ForceCharacterDeath(chrEntityId, false);
        DisableAsset(assetEntityId);
        EndEvent();
    }
L0:
    DisableCharacter(chrEntityId);
    DisableCharacterCollision(chrEntityId);
    DisableCharacterAI(chrEntityId);
    DisableAsset(assetEntityId);
    EndIf(!EventFlag(eventFlagId2));
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    SetEventFlagID(1099002100, ON);
    SetEventFlagID(eventFlagId3, ON);
    SetSpEffect(10000, 190);
    ActivateGparamOverride(0, 0);
    ChangeWeather(Weather.PuffyClouds, -1, false);
    ShootBullet(chrEntityId3, entityId, 100, 100500, 0, 90, 0);
    DisableCharacter(chrEntityId2);
    DisableCharacterCollision(chrEntityId2);
    DisableCharacterAI(chrEntityId2);
    if (Signed(-1) != animationId) {
        ForceAnimationPlayback(chrEntityId, animationId, false, false, false);
    } else {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
    }
    DisableCharacterHPBarDisplay(chrEntityId);
    SetNetworkconnectedEventFlagID(eventFlagId2, OFF);
    SetSpEffect(10000, 514);
    EnableAsset(assetEntityId);
    CreateAssetfollowingSFX(assetEntityId, 200, 806700);
    ForceAnimationPlayback(10000, 60451, false, false, false);
    WaitFixedTimeSeconds(1);
    SetSpEffect(20000, 8870);
    WaitFor(
        !EntityInRadiusOfEntity(10000, assetEntityId, 12, 1)
            || HasDamageType(chrEntityId, 10000, DamageType.Unspecified)
            || HasDamageType(chrEntityId, 0, DamageType.Unspecified));
    SetEventFlagID(1099002100, OFF);
    if (Signed(-1) == animationId) {
        EnableCharacter(chrEntityId);
        EnableCharacterCollision(chrEntityId);
    }
    if (Signed(-1) != animationId2) {
        ForceAnimationPlayback(chrEntityId, animationId2, false, false, false);
    }
    EnableCharacterAI(chrEntityId);
    SetNetworkUpdateRate(chrEntityId, true, CharacterUpdateFrequency.AlwaysUpdate);
    SetEventFlagID(eventFlagId4, ON);
    WaitFixedTimeSeconds(1);
    DisplayBossHealthBar(Enabled, chrEntityId, 0, nameId);
});

// 【共通】円形サークルトリガー出現 -- [Common] Circular circle trigger appears
$Event(90005883, Restart, function(eventFlagId, eventFlagId2, entityId) {
    ForceAnimationPlayback(entityId, 0, true, false, false);
    EndIf(!PlayerIsInOwnWorld());
    EndIf(EventFlag(eventFlagId));
    ForceAnimationPlayback(entityId, 10, true, false, false);
    EndIf(EventFlag(eventFlagId2));
    WaitFor(
        HasMultiplayerState(MultiplayerState.Singleplayer)
            && !HasMultiplayerState(MultiplayerState.MultiplayerPending));
    WaitFixedTimeFrames(1);
    ForceAnimationPlayback(entityId, 1, true, false, false);
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.Singleplayer)
            && !HasMultiplayerState(MultiplayerState.MultiplayerPending)));
    WaitFixedTimeFrames(1);
    RestartEvent();
});

// 【共通】円形サークルバディ石碑出現 -- [Common] Circular circle buddy stone monument appears
$Event(90005884, Restart, function(eventFlagId, eventFlagId2, chrEntityId, assetEntityId) {
    SetSpEffect(chrEntityId, 9531);
    DisableCharacterAI(chrEntityId);
    DisableCharacterCollision(chrEntityId);
    DisableAsset(assetEntityId);
    EndIf(!EventFlag(eventFlagId));
    EndIf(!EventFlag(eventFlagId2));
    EndIf(!PlayerIsInOwnWorld());
    WaitFixedTimeFrames(1);
    SetSpEffect(chrEntityId, 9532);
    EnableCharacterCollision(chrEntityId);
    EnableAsset(assetEntityId);
});

// 【共通】円形サークルボス戦BGM再生_２曲 -- [Common] Circular circle boss battle BGM playback_2 songs
$Event(90005885, Restart, function(eventFlagId, bgmBossConvParamId, eventFlagId2, eventFlagId3, value, value2) {
    DisableNetworkSync();
    if (EventFlag(eventFlagId)) {
        EndEvent();
    }
L0:
    WaitFor(EventFlag(eventFlagId2));
    WaitFixedTimeFrames(1);
    if (Signed(0) != bgmBossConvParamId) {
        SetBossBGM(bgmBossConvParamId, BossBGMState.Start);
    } else {
        SetBossBGM(921100, BossBGMState.Start);
    }
    WaitFor(EventFlag(eventFlagId3) || EventFlag(eventFlagId));
    if (!EventFlag(eventFlagId)) {
        WaitFixedTimeFrames(1);
        if (Signed(value) != 1) {
            if (Signed(0) != bgmBossConvParamId) {
                SetBossBGM(bgmBossConvParamId, BossBGMState.HeatUp);
            } else {
                SetBossBGM(925000, BossBGMState.HeatUp);
            }
        }
        WaitFor(EventFlag(eventFlagId));
    }
L1:
    if (Signed(value2) != 1) {
        if (Signed(0) != bgmBossConvParamId) {
            SetBossBGM(bgmBossConvParamId, BossBGMState.Stop2);
        } else {
            SetBossBGM(925000, BossBGMState.Stop2);
        }
        EndEvent();
    }
    if (Signed(0) != bgmBossConvParamId) {
        SetBossBGM(bgmBossConvParamId, BossBGMState.Stop1);
    } else {
        SetBossBGM(925000, BossBGMState.Stop1);
    }
});

// 【共通】敵対マルチ用白壁対応 -- [Common] Compatible with white walls for enemy multiplayer
$Event(91005600, Restart, function(eventFlagId, assetEntityId, sfxId) {
    DisableNetworkSync();
    DisableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    WaitFor(
        HasMultiplayerState(MultiplayerState.Multiplayer)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending)
            || HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending)
            || EventFlag(9982));
    EnableAsset(assetEntityId);
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 101, sfxId);
    WaitFor(
        !(HasMultiplayerState(MultiplayerState.Multiplayer)
            || HasMultiplayerState(MultiplayerState.MultiplayerPending)
            || HasMultiplayerState(MultiplayerState.Invasion)
            || HasMultiplayerState(MultiplayerState.InvasionPending))
            && !EventFlag(9982));
    RestartEvent();
    WaitFor(EventFlag(eventFlagId));
});

// 【共通】篝火の導き -- [Common] Bonfire Guidance
$Event(90005100, Restart, function(eventFlagId, eventFlagId2, assetEntityId, eventFlagId3, thresholdValue, eventFlagId4, eventFlagId5, eventFlagId6, eventFlagId7, eventFlagId8, eventFlagId9, eventFlagId10, eventFlagId11, eventFlagId12, eventFlagId13) {
    if (!EventFlag(9000)) {
        DeleteAssetfollowingSFX(assetEntityId, false);
        WaitFixedTimeFrames(1);
    }
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId2) && !EventFlag(9000));
    CreateAssetfollowingSFX(assetEntityId, 100, 6400);
    if (thresholdValue == 0) {
        SetEventFlagID(eventFlagId4, ON);
    } else if (thresholdValue == 1) {
        SetEventFlagID(eventFlagId5, ON);
    } else if (thresholdValue == 2) {
        SetEventFlagID(eventFlagId6, ON);
    } else if (thresholdValue == 3) {
        SetEventFlagID(eventFlagId7, ON);
    } else if (thresholdValue == 4) {
        SetEventFlagID(eventFlagId8, ON);
    } else if (thresholdValue == 5) {
        SetEventFlagID(eventFlagId9, ON);
    } else if (thresholdValue == 6) {
        SetEventFlagID(eventFlagId10, ON);
    } else if (thresholdValue == 7) {
        SetEventFlagID(eventFlagId11, ON);
    } else if (thresholdValue == 8) {
        SetEventFlagID(eventFlagId12, ON);
    } else {
        SetEventFlagID(eventFlagId13, ON);
        Goto(L6);
    }
L6:
    if (PlayerIsInOwnWorld()) {
        if (!EventFlag(69080)) {
            WaitFor(PlayerIsInOwnWorld() && !CharacterHasSpEffect(10000, 100680));
            SetEventFlagID(710510, ON);
            ShowTutorialPopup(1510, true, true);
            DirectlyGivePlayerItem(ItemType.Goods, 9108, 710510, 1);
            SetEventFlagID(69080, ON);
        }
    }
L5:
    EndEvent();
    DeleteAssetfollowingSFX(assetEntityId, false);
    EndIf(!PlayerIsInOwnWorld());
    if (EventFlag(eventFlagId)) {
        SetEventFlagID(eventFlagId4, OFF);
        SetEventFlagID(eventFlagId5, OFF);
        SetEventFlagID(eventFlagId6, OFF);
        SetEventFlagID(eventFlagId7, OFF);
        SetEventFlagID(eventFlagId8, OFF);
        SetEventFlagID(eventFlagId9, OFF);
        SetEventFlagID(eventFlagId10, OFF);
        SetEventFlagID(eventFlagId11, OFF);
        SetEventFlagID(eventFlagId12, OFF);
        SetEventFlagID(eventFlagId13, OFF);
        EndEvent();
    }
L3:
    EndIf(EventValue(eventFlagId3, 4) > thresholdValue);
    WaitFor(EventFlag(eventFlagId) || (EventFlag(eventFlagId2) && !EventFlag(9000)));
    RestartIf(EventValue(eventFlagId3, 4) > thresholdValue);
    CreateAssetfollowingSFX(assetEntityId, 100, 6400);
    if (thresholdValue == 0) {
        SetEventFlagID(eventFlagId4, ON);
        EventValueOperation(eventFlagId3, 4, 0, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId4, OFF);
    }
    if (thresholdValue == 1) {
        SetEventFlagID(eventFlagId5, ON);
        EventValueOperation(eventFlagId3, 4, 1, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId5, OFF);
    }
    if (thresholdValue == 2) {
        SetEventFlagID(eventFlagId6, ON);
        EventValueOperation(eventFlagId3, 4, 2, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId6, OFF);
    }
    if (thresholdValue == 3) {
        SetEventFlagID(eventFlagId7, ON);
        EventValueOperation(eventFlagId3, 4, 3, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId7, OFF);
    }
    if (thresholdValue == 4) {
        SetEventFlagID(eventFlagId8, ON);
        EventValueOperation(eventFlagId3, 4, 4, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId8, OFF);
    }
    if (thresholdValue == 5) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 5, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 6) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 6, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 7) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 7, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 8) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 8, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 9) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 9, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    WaitFor(EventValue(eventFlagId3, 4) != thresholdValue || EventFlag(eventFlagId));
    WaitFixedTimeFrames(1);
    RestartEvent();
});

// 【共通】篝火の導き_NT用 -- [Common] Bonfire Guidance_For NT
$Event(90005101, Restart, function(eventFlagId, eventFlagId2, assetEntityId, eventFlagId3, thresholdValue, eventFlagId4, eventFlagId5, eventFlagId6, eventFlagId7, eventFlagId8, eventFlagId9, eventFlagId10, eventFlagId11, eventFlagId12, eventFlagId13) {
    if (!EventFlag(9000)) {
        DeleteAssetfollowingSFX(assetEntityId, false);
        WaitFixedTimeFrames(1);
    }
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId2) && !EventFlag(9000));
    CreateAssetfollowingSFX(assetEntityId, 100, 6401);
    if (thresholdValue == 0) {
        SetEventFlagID(eventFlagId4, ON);
    } else if (thresholdValue == 1) {
        SetEventFlagID(eventFlagId5, ON);
    } else if (thresholdValue == 2) {
        SetEventFlagID(eventFlagId6, ON);
    } else if (thresholdValue == 3) {
        SetEventFlagID(eventFlagId7, ON);
    } else if (thresholdValue == 4) {
        SetEventFlagID(eventFlagId8, ON);
    } else if (thresholdValue == 5) {
        SetEventFlagID(eventFlagId9, ON);
    } else if (thresholdValue == 6) {
        SetEventFlagID(eventFlagId10, ON);
    } else if (thresholdValue == 7) {
        SetEventFlagID(eventFlagId11, ON);
    } else if (thresholdValue == 8) {
        SetEventFlagID(eventFlagId12, ON);
    } else {
        SetEventFlagID(eventFlagId13, ON);
        Goto(L6);
    }
L6:
    if (PlayerIsInOwnWorld()) {
        if (!EventFlag(710510)) {
            WaitFor(PlayerIsInOwnWorld() && !CharacterHasSpEffect(10000, 100680));
            SetEventFlagID(710510, ON);
            ShowTutorialPopup(1510, true, true);
            DirectlyGivePlayerItem(ItemType.Goods, 9108, 710510, 1);
        }
    }
L5:
    EndEvent();
    DeleteAssetfollowingSFX(assetEntityId, false);
    EndIf(!PlayerIsInOwnWorld());
    if (EventFlag(eventFlagId)) {
        SetEventFlagID(eventFlagId4, OFF);
        SetEventFlagID(eventFlagId5, OFF);
        SetEventFlagID(eventFlagId6, OFF);
        SetEventFlagID(eventFlagId7, OFF);
        SetEventFlagID(eventFlagId8, OFF);
        SetEventFlagID(eventFlagId9, OFF);
        SetEventFlagID(eventFlagId10, OFF);
        SetEventFlagID(eventFlagId11, OFF);
        SetEventFlagID(eventFlagId12, OFF);
        SetEventFlagID(eventFlagId13, OFF);
        EndEvent();
    }
L3:
    EndIf(EventValue(eventFlagId3, 4) > thresholdValue);
    WaitFor(EventFlag(eventFlagId) || (EventFlag(eventFlagId2) && !EventFlag(9000)));
    RestartIf(EventValue(eventFlagId3, 4) > thresholdValue);
    CreateAssetfollowingSFX(assetEntityId, 100, 6401);
    if (thresholdValue == 0) {
        SetEventFlagID(eventFlagId4, ON);
        EventValueOperation(eventFlagId3, 4, 0, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId4, OFF);
    }
    if (thresholdValue == 1) {
        SetEventFlagID(eventFlagId5, ON);
        EventValueOperation(eventFlagId3, 4, 1, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId5, OFF);
    }
    if (thresholdValue == 2) {
        SetEventFlagID(eventFlagId6, ON);
        EventValueOperation(eventFlagId3, 4, 2, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId6, OFF);
    }
    if (thresholdValue == 3) {
        SetEventFlagID(eventFlagId7, ON);
        EventValueOperation(eventFlagId3, 4, 3, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId7, OFF);
    }
    if (thresholdValue == 4) {
        SetEventFlagID(eventFlagId8, ON);
        EventValueOperation(eventFlagId3, 4, 4, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId8, OFF);
    }
    if (thresholdValue == 5) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 5, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 6) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 6, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 7) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 7, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 8) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 8, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 9) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 9, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    WaitFor(EventValue(eventFlagId3, 4) != thresholdValue || EventFlag(eventFlagId));
    WaitFixedTimeFrames(1);
    RestartEvent();
});

$Event(90005102, Restart, function(eventFlagId, eventFlagId2, assetEntityId, eventFlagId3, thresholdValue, eventFlagId4, eventFlagId5, eventFlagId6, eventFlagId7, eventFlagId8, eventFlagId9, eventFlagId10, eventFlagId11, eventFlagId12, eventFlagId13, eventFlagId14) {
    if (!EventFlag(9000)) {
        DeleteAssetfollowingSFX(assetEntityId, false);
        WaitFixedTimeFrames(1);
    }
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndIf(!PlayerIsInOwnWorld());
    WaitFor(EventFlag(eventFlagId2) && !EventFlag(9000) && EventFlag(eventFlagId14));
    CreateAssetfollowingSFX(assetEntityId, 100, 6400);
    if (thresholdValue == 0) {
        SetEventFlagID(eventFlagId4, ON);
    } else if (thresholdValue == 1) {
        SetEventFlagID(eventFlagId5, ON);
    } else if (thresholdValue == 2) {
        SetEventFlagID(eventFlagId6, ON);
    } else if (thresholdValue == 3) {
        SetEventFlagID(eventFlagId7, ON);
    } else if (thresholdValue == 4) {
        SetEventFlagID(eventFlagId8, ON);
    } else if (thresholdValue == 5) {
        SetEventFlagID(eventFlagId9, ON);
    } else if (thresholdValue == 6) {
        SetEventFlagID(eventFlagId10, ON);
    } else if (thresholdValue == 7) {
        SetEventFlagID(eventFlagId11, ON);
    } else if (thresholdValue == 8) {
        SetEventFlagID(eventFlagId12, ON);
    } else {
        SetEventFlagID(eventFlagId13, ON);
        Goto(L6);
    }
L6:
    if (PlayerIsInOwnWorld()) {
        if (!EventFlag(69080)) {
            WaitFor(PlayerIsInOwnWorld() && !CharacterHasSpEffect(10000, 100680));
            SetEventFlagID(710510, ON);
            ShowTutorialPopup(1510, true, true);
            DirectlyGivePlayerItem(ItemType.Goods, 9108, 710510, 1);
            SetEventFlagID(69080, ON);
        }
    }
L5:
    EndEvent();
    DeleteAssetfollowingSFX(assetEntityId, false);
    EndIf(!PlayerIsInOwnWorld());
    if (EventFlag(eventFlagId)) {
        SetEventFlagID(eventFlagId4, OFF);
        SetEventFlagID(eventFlagId5, OFF);
        SetEventFlagID(eventFlagId6, OFF);
        SetEventFlagID(eventFlagId7, OFF);
        SetEventFlagID(eventFlagId8, OFF);
        SetEventFlagID(eventFlagId9, OFF);
        SetEventFlagID(eventFlagId10, OFF);
        SetEventFlagID(eventFlagId11, OFF);
        SetEventFlagID(eventFlagId12, OFF);
        SetEventFlagID(eventFlagId13, OFF);
        EndEvent();
    }
L3:
    EndIf(EventValue(eventFlagId3, 4) > thresholdValue);
    WaitFor(EventFlag(eventFlagId) || (EventFlag(eventFlagId2) && !EventFlag(9000)));
    RestartIf(EventValue(eventFlagId3, 4) > thresholdValue);
    CreateAssetfollowingSFX(assetEntityId, 100, 6400);
    if (thresholdValue == 0) {
        SetEventFlagID(eventFlagId4, ON);
        EventValueOperation(eventFlagId3, 4, 0, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId4, OFF);
    }
    if (thresholdValue == 1) {
        SetEventFlagID(eventFlagId5, ON);
        EventValueOperation(eventFlagId3, 4, 1, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId5, OFF);
    }
    if (thresholdValue == 2) {
        SetEventFlagID(eventFlagId6, ON);
        EventValueOperation(eventFlagId3, 4, 2, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId6, OFF);
    }
    if (thresholdValue == 3) {
        SetEventFlagID(eventFlagId7, ON);
        EventValueOperation(eventFlagId3, 4, 3, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId7, OFF);
    }
    if (thresholdValue == 4) {
        SetEventFlagID(eventFlagId8, ON);
        EventValueOperation(eventFlagId3, 4, 4, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId8, OFF);
    }
    if (thresholdValue == 5) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 5, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 6) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 6, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 7) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 7, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 8) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 8, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    if (thresholdValue == 9) {
        SetEventFlagID(eventFlagId9, ON);
        EventValueOperation(eventFlagId3, 4, 9, 0, 1, CalculationType.Assign);
    } else {
        SetEventFlagID(eventFlagId9, OFF);
    }
    WaitFor(EventValue(eventFlagId3, 4) != thresholdValue || EventFlag(eventFlagId));
    WaitFixedTimeFrames(1);
    RestartEvent();
});

// 【共通】大ルーン取得 -- [Common] Obtain a large rune
$Event(90005110, Restart, function(eventFlagId, eventFlagId2, assetEntityId, itemLotId, itemId, sfxId, actionButtonParameterId, animationId, value) {
    EndIf(EventFlag(eventFlagId));
    EndIf(!PlayerIsInOwnWorld());
    EndIf(!EventFlag(eventFlagId2));
    DeleteAssetfollowingSFX(assetEntityId, true);
    CreateAssetfollowingSFX(assetEntityId, 100, sfxId);
    WaitFor(PlayerIsInOwnWorld() && ActionButtonInArea(actionButtonParameterId, assetEntityId));
    RotateCharacter(10000, assetEntityId, -1, true);
    ForceAnimationPlayback(10000, animationId, false, false, false);
    DeleteAssetfollowingSFX(assetEntityId, true);
    WaitFixedTimeSeconds(4);
    DisplayBanner(TextBannerType.GreatRuneRestored);
    AwardItemsIncludingClients(itemLotId);
    RemoveItemFromPlayer(ItemType.Goods, itemId, 1);
    SetEventFlagID(eventFlagId, ON);
    EndEvent();
    EndIf(Signed(value) == 0);
});

// 【共通】テスト_小篝火SFX -- [Common] Test_Small Bonfire SFX
$Event(9005910, Restart, function(assetEntityId, eventFlagId, eventFlagId2, value) {
    DeleteAssetfollowingSFX(assetEntityId, true);
    GotoIf(L1, !AnyBatchEventFlags(eventFlagId, eventFlagId2));
    GotoIf(L2, !AllBatchEventFlags(eventFlagId, eventFlagId2));
    Goto(L9);
L1:
    if (Signed(3) >= value) {
        CreateAssetfollowingSFX(assetEntityId, 201, 62);
    } else {
        CreateAssetfollowingSFX(assetEntityId, 201, 63);
    }
    WaitFor(AnyBatchEventFlags(eventFlagId, eventFlagId2));
    RestartEvent();
L2:
    CreateAssetfollowingSFX(assetEntityId, 201, 61);
    WaitFor(AllBatchEventFlags(eventFlagId, eventFlagId2));
    RestartEvent();
L9:
    DeleteAssetfollowingSFX(assetEntityId, true);
    EndEvent();
});

// 【共通】小篝火_お試しSFX -- [Common] Small Bonfire_Trial SFX
$Event(9005911, Restart, function(assetEntityId) {
    CreateAssetfollowingSFX(assetEntityId, 201, 40);
    WaitFor(EntityInRadiusOfEntity(10000, assetEntityId, 3, 1));
    DeleteAssetfollowingSFX(assetEntityId, true);
});

// 【共通】小篝火_お試し地名表示 -- [Common] Small Bonfire_Trial place name display
$Event(9005912, Restart, function(eventFlagId, messageId) {
    EndIf(EventFlag(eventFlagId));
    WaitFor(EventFlag(eventFlagId));
    DisplaySubareaWelcomeMessage(messageId);
});

// 【共通】いんちきランダム配置 -- [Common] Bogus random placement
$Event(9005920, Restart, function(chrEntityId, chrEntityId2, chrEntityId3, chrEntityId4, chrEntityId5, chrEntityId6, chrEntityId7, chrEntityId8, chrEntityId9, chrEntityId10) {
    if (!EventFlag(9800)) {
        DisableCharacter(chrEntityId);
        DisableCharacterCollision(chrEntityId);
    } else {
        EnableCharacter(chrEntityId);
        EnableCharacterCollision(chrEntityId);
    }
    if (!EventFlag(9801)) {
        DisableCharacter(chrEntityId2);
        DisableCharacterCollision(chrEntityId2);
    } else {
        EnableCharacter(chrEntityId2);
        EnableCharacterCollision(chrEntityId2);
    }
    if (!EventFlag(9802)) {
        DisableCharacter(chrEntityId3);
        DisableCharacterCollision(chrEntityId3);
    } else {
        EnableCharacter(chrEntityId3);
        EnableCharacterCollision(chrEntityId3);
    }
    if (!EventFlag(9803)) {
        DisableCharacter(chrEntityId4);
        DisableCharacterCollision(chrEntityId4);
    } else {
        EnableCharacter(chrEntityId4);
        EnableCharacterCollision(chrEntityId4);
    }
    if (!EventFlag(9804)) {
        DisableCharacter(chrEntityId5);
        DisableCharacterCollision(chrEntityId5);
    } else {
        EnableCharacter(chrEntityId5);
        EnableCharacterCollision(chrEntityId5);
    }
    if (!EventFlag(9805)) {
        DisableCharacter(chrEntityId6);
        DisableCharacterCollision(chrEntityId6);
    } else {
        EnableCharacter(chrEntityId6);
        EnableCharacterCollision(chrEntityId6);
    }
    if (!EventFlag(9806)) {
        DisableCharacter(chrEntityId7);
        DisableCharacterCollision(chrEntityId7);
    } else {
        EnableCharacter(chrEntityId7);
        EnableCharacterCollision(chrEntityId7);
    }
    if (!EventFlag(9807)) {
        DisableCharacter(chrEntityId8);
        DisableCharacterCollision(chrEntityId8);
    } else {
        EnableCharacter(chrEntityId8);
        EnableCharacterCollision(chrEntityId8);
    }
    if (!EventFlag(9808)) {
        DisableCharacter(chrEntityId9);
        DisableCharacterCollision(chrEntityId9);
    } else {
        EnableCharacter(chrEntityId9);
        EnableCharacterCollision(chrEntityId9);
    }
    if (!EventFlag(9809)) {
        DisableCharacter(chrEntityId10);
        DisableCharacterCollision(chrEntityId10);
    } else {
        EnableCharacter(chrEntityId10);
        EnableCharacterCollision(chrEntityId10);
    }
});

// 【共通】宝箱_視認性 -- [Common] Treasure Chest_Visibility
$Event(90005920, Restart, function(eventFlagId, assetEntityId, objactEventFlag) {
    EndIf(EventFlag(eventFlagId));
    CreateAssetfollowingSFX(assetEntityId, 100, 6150);
    WaitFor(ObjActEventFlag(objactEventFlag));
    SetEventFlagID(eventFlagId, ON);
    WaitFixedTimeSeconds(0.3);
    DeleteAssetfollowingSFX(assetEntityId, true);
});

// 【共通】特殊待機文字列確認用テスト -- [Common] Special standby character string confirmation test
$Event(9005990, Restart, function(timeSeconds) {
    WaitFixedTimeSeconds(timeSeconds);
});

// 【共通】闘技場_メイン処理 -- [Common] Arena_Main process
$Event(98005100, Restart, function(matchType, eventFlagId, messageId, messageId2) {
    DisableAreaWelcomeMessage();
    WaitFor(PlayerIsInOwnWorld() && ArenaMatchReady());
    WaitFixedTimeSeconds(5);
    DisplayBlinkingMessageWithPriority(messageId, 1, true);
    SetEventFlagID(280, ON);
    DisplayBanner(TextBannerType.Commence);
    if (PlayerIsInOwnWorld()) {
        WaitUntilArenaHalfTime(matchType, false);
    }
    WaitFor(PlayerIsInOwnWorld() && !EventFlag(eventFlagId));
    DisplayBlinkingMessageWithPriority(messageId2, 2, true);
    SetSpEffect(10000, 1160);
    if (PlayerIsInOwnWorld()) {
        WaitUntilArenaHalfTime(matchType, true);
    }
    WaitFor(PlayerIsInOwnWorld());
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
});

// 【共通】闘技場_サブ処理_決闘 -- [Common] Arena_Sub-processing_Duel
$Event(98005110, Restart, function(eventFlagId) {
    WaitFor(ArenaSoloScore() == 1 || EventFlag(eventFlagId));
    EndIf(EventFlag(eventFlagId));
    if (PlayerIsInOwnWorld()) {
        SetNetworkconnectedEventFlagID(eventFlagId, ON);
    }
});

// 【共通】闘技場_結果表示処理 -- [Common] Arena_Result display processing
$Event(98005120, Restart, function(eventFlagId) {
    DisableNetworkSync();
    WaitFor(EventFlag(eventFlagId));
    EnableCharacterInvincibility(10000);
    SetEventFlagID(280, OFF);
    DisplayBlinkingMessageWithPriority(88040, 0, true);
    WaitFixedTimeFrames(1);
    WaitFixedTimeSeconds(5);
    Unknown200383(0);
    if (!HasArenaMatchType(ArenaMatchType.OneVersusOne, false)) {
        GotoIf(L9, HasArenaMatchType(ArenaMatchType.OneVersusOne, false));
        GotoIf(L9, HasArenaMatchType(ArenaMatchType.TwoVersusTwo, false));
        GotoIf(L9, HasArenaMatchType(ArenaMatchType.ThreeVersusThree, false));
        GotoIf(L9, HasArenaMatchType(ArenaMatchType.TwoVersusTwo, true));
        GotoIf(L9, HasArenaMatchType(ArenaMatchType.ThreeVersusThree, true));
        online |= ArenaSoloResults(ArenaResult.Win);
        online2 |= ArenaSoloResults(ArenaResult.Draw);
        GotoIf(L0, online);
        GotoIf(L1, online2);
    } else {
L9:
        online |= ArenaTeamResults(ArenaResult.Win);
        online2 |= ArenaTeamResults(ArenaResult.Draw);
        GotoIf(L0, online);
        GotoIf(L1, online2);
        Goto(L2);
L0:
        DisplayBanner(TextBannerType.Victory);
        SetSpEffect(10000, 1140);
        WaitFixedTimeSeconds(5);
        DisplayBlinkingMessageWithPriority(88050, 0, true);
        WaitFixedTimeSeconds(0.5);
        SendAllPhantomsHomeAndUpdateServerPvpStats(0);
        EndEvent();
L1:
        DisplayBanner(TextBannerType.Stalemate);
        SetSpEffect(10000, 1150);
        WaitFixedTimeSeconds(5);
        DisplayBlinkingMessageWithPriority(88051, 0, true);
        WaitFixedTimeSeconds(0.5);
        SendAllPhantomsHomeAndUpdateServerPvpStats(0);
        EndEvent();
    }
L2:
    DisplayBanner(TextBannerType.Defeat);
    WaitFixedTimeSeconds(5);
    DisplayBlinkingMessageWithPriority(88052, 0, true);
    WaitFixedTimeSeconds(0.5);
    SendAllPhantomsHomeAndUpdateServerPvpStats(0);
    EndEvent();
});

// 【共通】闘技場_結果表示処理_決闘 -- [Common] Arena_Result display processing_Duel
$Event(98005121, Restart, function(eventFlagId) {
    DisableNetworkSync();
    WaitFor(EventFlag(eventFlagId));
    EnableCharacterInvincibility(10000);
    SetEventFlagID(280, OFF);
    if (ArenaSoloResults(ArenaResult.Draw)) {
        DisplayBlinkingMessageWithPriority(88040, 0, true);
        WaitFixedTimeSeconds(3.5);
    }
    WaitFixedTimeSeconds(1);
    Unknown200383(0);
    WaitFixedTimeFrames(1);
    online = ArenaSoloResults(ArenaResult.Win);
    online2 = ArenaSoloResults(ArenaResult.Draw);
    GotoIf(L0, online);
    GotoIf(L1, online2);
    Goto(L2);
L0:
    DisplayBanner(TextBannerType.Victory);
    SetSpEffect(10000, 1140);
    WaitFixedTimeSeconds(5);
    DisplayBlinkingMessageWithPriority(88050, 0, true);
    WaitFixedTimeSeconds(0.5);
    SendAllPhantomsHomeAndUpdateServerPvpStats(0);
    EndEvent();
L1:
    DisplayBanner(TextBannerType.Stalemate);
    WaitFixedTimeSeconds(5);
    DisplayBlinkingMessageWithPriority(88051, 0, true);
    WaitFixedTimeSeconds(0.5);
    SendAllPhantomsHomeAndUpdateServerPvpStats(0);
    EndEvent();
L2:
    DisplayBanner(TextBannerType.Defeat);
    WaitFixedTimeSeconds(5);
    DisplayBlinkingMessageWithPriority(88052, 0, true);
    WaitFixedTimeSeconds(0.5);
    SendAllPhantomsHomeAndUpdateServerPvpStats(0);
    EndEvent();
});
