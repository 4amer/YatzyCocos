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
    private _zonkView: ZonkView = null;
    private _restartView: RestartView = null;

    private _throwDiceCounter = 0;
    private _isDiceRolling = false;

    private _extraScore: number = 0;
    private _currentMoveScore: number = 0;
    private _currentThrowScore: number = 0;
    private _totalScore: number = 0;

    private _diceValues: number[] = [0,0,0,0,0,0]; 
    private _pickedDiceValues: Array<Array<Dice>> = new Array<Array<Dice>>(
        [null,null,null,null,null,null],
        [null,null,null,null,null],
        [null,null,null,null],
        [null,null,null],
        [null,null],
        [null])

    private _stopDicesCounter: number = 0;

    private _LastMove: number = 10;
    private _moveCounter: number = 0;

    private _ZonkRules: ZonkRules = null;
    private _DiceBehaviour: ZonkDiceBehaviour = null;

    private constructor(){
        this._zonkView = GodSinglton.zonkView;
        this._zonkView.node.on("Throw", this.WhenThrowButtonClicked, this);
        this._zonkView.node.on("Move", this.WhenMoveButtonClicked, this);

        this._DiceBehaviour = new ZonkDiceBehaviour(this._zonkView.Dices);
        this._ZonkRules = new ZonkRules();

        this._zonkView.Dices.forEach(element => {
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
        if(this._ZonkRules.IsExtraThrow){
            this._extraScore = this._currentMoveScore;
        }
        this._isDiceRolling = true;
        this._stopDicesCounter = 0;
        this._throwDiceCounter++;

        this._zonkView.ActivateDiceLayout();
        this._zonkView.DeactivateDiceLandingPosition();
        this._zonkView.DisableMoveButton();

        this._zonkView.DisableThrowButton();
        GodSinglton.audioManager.Play(SoundNames.DiceThrow);

        this._DiceBehaviour.AllPickedDices.forEach((element) => {
            element.IsActive = false;
        })

        for(let i = 0; i < this._zonkView.Dices.length; i++){
            let dice: Dice = this._zonkView.Dices[i].getComponent(Dice);
            if(dice.Condition == DiceConditions.picked) {
                this._stopDicesCounter += 1;
                continue;
            }
            this._DiceBehaviour.DoRollTween(dice);
            this.RollDice(dice, 1300, i).then(() => {
                if(this._stopDicesCounter == this._diceValues.length){
                    this._zonkView.EnableThrowButton();
                    this._zonkView.ActivateDiceLandingPosition();
                    this._isDiceRolling = false;
                    this._zonkView.EnableMoveButton();
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
            this._zonkView.AllScoreTexts[this._moveCounter].string = "Зонк!";
            this._zonkView.DisableThrowButton();
            this._DiceBehaviour.DeactiveAllDices();
        };
    }

    private ExtraMove(): void{

    }

    public WhenMoveButtonClicked(): void{
        this.NextMove();
        if(this._DiceBehaviour.HasUnpickedDices()) this.ExtraMove();
    }

    private NextMove(){
        this._throwDiceCounter = 0;
    }

    private OnDiceCliked(dice: Dice): void{
        const throwDiceCounter = this._throwDiceCounter - 1;
        const pickedDices: Array<Dice> = this._pickedDiceValues[throwDiceCounter];
        const pickedDiceArea: Node[] = this._zonkView.PickedDicePositions[throwDiceCounter];
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

        this._zonkView.PickedDiceAreaScores[throwDiceCounter].string = score.toString();
        this._zonkView.ThisMoveScore = score + this._currentMoveScore + this._extraScore;
        this._currentThrowScore = score;
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


