import { _decorator, Component, Node, Quat, randomRangeInt, tween, Vec2, Vec3 } from 'cc';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { ZonkView } from '../Views/ZonkView';
import { RestartView } from '../Views/RestartView';
import { SoundNames } from '../../Scripts/AudioManager/SoundNames/SoundNames';
import { Dice } from '../../Scripts/Dice';
import { DiceConditions } from '../../Scripts/Enums/DiceConditions';
import { AbstractDiceBehaviour } from '../../Scripts/DiceBehaviour/AbstractDiceBehaviour';
import { ZonkDiceBehaviour } from '../../Scripts/DiceBehaviour/ZonkDiceBehaviour';
import { ZonkRules } from '../../Scripts/GameRooles/ZonkRules';
const { ccclass, property } = _decorator;

@ccclass('ZonkModel')
export class ZonkModel{
private static ZonkModel: ZonkModel = null;
    private _ZonkView: ZonkView = null;
    private _restartView: RestartView = null;

    private _throwDiceCounter = 0;
    private _isDiceRolling = false;

    private _currentMoveScore: number = 0;
    private _currentThrowScore: number = 0;
    private _totalScore: number = 0;

    private _diceValues: number[] = [0,0,0,0,0,0]; 
    private _pickedDiceRaw: Array<Array<Dice>> = new Array<Array<Dice>>(
        [null,null,null,null,null,null],
        [null,null,null,null,null],
        [null,null,null,null],
        [null,null,null],
        [null,null],
        [null])

    private _stopDicesCounter: number = 0;

    private _LastMove: number = 10;
    private _moveCounter: number = 0;

    private _zonkCounter: number = 0;

    private _ZonkRules: ZonkRules = null;
    private _DiceBehaviour: ZonkDiceBehaviour = null;

    private constructor(){
        this._ZonkView = GodSinglton.zonkView;
        this._ZonkView.node.on("Throw", this.WhenThrowButtonClicked, this);
        this._ZonkView.node.on("Move", this.WhenMoveButtonClicked, this);

        this._DiceBehaviour = new ZonkDiceBehaviour(this._ZonkView.NodeDices);
        this._ZonkRules = new ZonkRules();

        this._ZonkView.NodeDices.forEach(element => {
            element.on("DiceCliked", this.OnDiceCliked, this);
        });

        this._restartView = GodSinglton.restartView;
        this._restartView.node.on("Restart", this.RestartGame, this);
    }

    public static get Instance(): ZonkModel{
        if(this.ZonkModel == null){
            this.ZonkModel = new ZonkModel();
        }
        return this.ZonkModel;
    }

    public WhenThrowButtonClicked(): void{
        GodSinglton.audioManager.Play(SoundNames.ButtonClicked);
        this._currentMoveScore += this._currentThrowScore;
        this._currentThrowScore = 0;
        this._isDiceRolling = true;
        this._stopDicesCounter = 0;
        this._throwDiceCounter++;

        this._ZonkView.ActivateDiceLayout();
        this._ZonkView.DeactivateDiceLandingPosition();
        this._ZonkView.DisableMoveButton();

        this._ZonkView.DisableThrowButton();
        GodSinglton.audioManager.Play(SoundNames.DiceThrow);

        this._DiceBehaviour.AllPickedDices.forEach((element) => {
            element.IsActive = false;
        })

        for(let i = 0; i < this._ZonkView.NodeDices.length; i++){
            let dice: Dice = this._ZonkView.NodeDices[i].getComponent(Dice);
            if(dice.Condition == DiceConditions.picked) {
                this._stopDicesCounter += 1;
                continue;
            }
            this._DiceBehaviour.DoRollTween(dice);
            this.RollDice(dice, 1300, i).then(() => {
                if(this._stopDicesCounter == this._diceValues.length){
                    this._ZonkView.EnableThrowButton();
                    this._ZonkView.ActivateDiceLandingPosition();
                    this._isDiceRolling = false;
                    this._ZonkView.EnableMoveButton();
                    this.CheckDiceValues(this._DiceBehaviour.AllUnpickedDices);
                }
            });
        }
    }

    private async RollDice(dice: Dice, rollTimeMs: number, diceNumber: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this._DiceBehaviour.SetIsActive(dice, false);
            let randomNum = randomRangeInt(1, 7);
            this._DiceBehaviour.RollToNumber(randomNum, dice);
            setTimeout(() => {
                dice.RequestingValue = randomNum;
                this._diceValues[diceNumber] = randomNum;
                this._DiceBehaviour.SetIsActive(dice, true);
                this._stopDicesCounter += 1;
                resolve();
            }, rollTimeMs);
        })
    }

    private CheckDiceValues(dices: Dice[]): void{
        let combinations: Map<number, number> = null;

        combinations = this.GetMapWithDiceValues(dices);

        if(this._ZonkRules.HasCombinations(combinations) == false){
            this._ZonkView.AllScoreTexts[this._moveCounter].string = "Зонк!";
            this._ZonkView.DisableThrowButton();
            this._DiceBehaviour.DeactiveAllDices();
            this._currentMoveScore = 0;
            this._ZonkView.ThisMoveScore = 0;
            
            this._zonkCounter += 1;
            if((this._zonkCounter % 3) == 0){
                this._totalScore -= 1000;
            }
        } else {
            this._ZonkView.DisableMoveButton();
            this._ZonkView.DisableThrowButton();
        };
    }

    public WhenMoveButtonClicked(): void{
        if(this.IsExtraThrow() == false){
            if(this._currentMoveScore > 0){
                this._zonkCounter = 0;
            }

            const scoreForMove: number = this._currentMoveScore + this._currentThrowScore
            this._totalScore += scoreForMove;
            var text = this._ZonkView.AllScoreTexts[this._moveCounter];
            if(text.string == ""){
                text.string = scoreForMove.toString();
            }
            this._currentMoveScore = 0;
            this._currentThrowScore = 0;
            this._moveCounter += 1;

            this._ZonkView.ThisMoveScore = 0;
            this._ZonkView.TotalScoreText = this._totalScore;
        }
        this._throwDiceCounter = 0;
        this.ResetAllPickedDiceRaws();
        this._DiceBehaviour.UnpickAllDice();
        this._DiceBehaviour.ActiveAllDices();
        this._ZonkView.DeactivateDiceLayout();
        this._ZonkView.DisableMoveButton();
        this._ZonkView.EnableThrowButton();
    }

    private OnDiceCliked(dice: Dice): void{
        if(!dice.IsActive) return
        const throwDiceCounter = this._throwDiceCounter - 1;
        const pickedDices: Array<Dice> = this._pickedDiceRaw[throwDiceCounter];
        const pickedDiceArea: Node[] = this._ZonkView.PickedDicePositions[throwDiceCounter];
        if(dice.Condition == DiceConditions.unpicked){
            let emptySlotIndex: number = 0;
            for(let i = 0; i < pickedDices.length; i++){
                if(pickedDices[i] == null){
                    emptySlotIndex = i;
                    break;
                }
            }
            pickedDices[emptySlotIndex] = dice;
            pickedDices.sort
            this._DiceBehaviour.SetTweenTranform(pickedDiceArea[emptySlotIndex].getWorldPosition(), new Vec3(0.5,0.5,0.5));
            this._DiceBehaviour.OnDiceCliked(dice);
        } else {
            for(let i = 0; i < pickedDices.length; i++){
                if(pickedDices[i] == dice){
                    pickedDices[i] = null;
                    break;
                }
            }
            this._DiceBehaviour.SetTweenTranform(dice.DiceLandingPoint.getWorldPosition(), new Vec3(1,1,1));
            this._DiceBehaviour.OnDiceCliked(dice);
            
            pickedDices.sort();
            for(let i = 0; i < pickedDices.length; i++){
                if(pickedDices[i] == null) continue;
                this._DiceBehaviour.SetTweenTranform(pickedDiceArea[i].getWorldPosition(), new Vec3(0.5,0.5,0.5))
                this._DiceBehaviour.DoTween(pickedDices[i]);
            }
        }
        const diceValuesMap : Map<number, number> = this.GetMapWithDiceValues(pickedDices);
        const score = this._ZonkRules.CountScores(diceValuesMap);

        if(this.IsAllSlotsFill(throwDiceCounter) == false){
            this._ZonkView.EnableThrowButton();
        }
        if(this._DiceBehaviour.AllUnpickedDices.length == 0){
            this._ZonkView.DisableThrowButton();
        }
        if((score + this._currentMoveScore) >= this._ZonkRules.MinScoreForMove){
            this._ZonkView.EnableMoveButton();
        } else {
            this._ZonkView.DisableMoveButton();
        }

        this._ZonkView.PickedDiceAreaScores[throwDiceCounter].string = score.toString();
        this._ZonkView.ThisMoveScore = score + this._currentMoveScore;
        this._currentThrowScore = score;
    }

    private IsAllSlotsFill(throwCounter: number): boolean{
        const slotsNumberInRaw: number =  this._pickedDiceRaw[throwCounter].length;
        let emptySlotsCouter: number = 0;
        this._pickedDiceRaw[throwCounter].forEach((element)=>{
            if(element != null){
                emptySlotsCouter += 1;
            }
        })
        if(emptySlotsCouter == slotsNumberInRaw){
            return true;
        }
        return false;
    }

    private ResetAllPickedDiceRaws(){
        for(let i = 0; i < this._pickedDiceRaw.length; i++){
            for(let j = 0; j < this._pickedDiceRaw[i].length; j++){
                this._pickedDiceRaw[i][j] = null;
            }
            this._ZonkView.PickedDiceAreaScores[i].string = "0";
        }
    }

    private IsExtraThrow(): boolean{
         return !this._DiceBehaviour.HasUnpickedDices();
    }

    private GetMapWithDiceValues(dices: Dice[]): Map<number, number>{
        let map: Map<number, number> = new Map<number, number>;

        dices.forEach((element) => {
            if(element == null) return;
            const diceValue = element.RequestingValue
            if(map.has(diceValue)){
                let arrayNum: number = 0;
                arrayNum = map.get(diceValue);
                arrayNum += 1;
                map.set(diceValue, arrayNum);
            } else {
                map.set(diceValue, 1);
            }
        })
        return map;
    }

    public RestartGame(): void{

    }
}


