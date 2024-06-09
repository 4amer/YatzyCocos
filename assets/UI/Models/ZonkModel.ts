import { _decorator, Component, Node, Quat, randomRangeInt, tween, Vec2, Vec3 } from 'cc';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { ZonkView } from '../Views/ZonkView';
import { RestartView } from '../Views/RestartView';
import { SoundNames } from '../../Scripts/AudioManager/SoundNames/SoundNames';
import { Dice } from '../../Scripts/Dice';
import { DiceConditions } from '../../Scripts/Enums/DiceConditions';
import { AbstractDiceBehaviour } from '../../Scripts/DiceBehaviour/AbstractDiceBehaviour';
import { ZonkDiceBehaviour } from '../../Scripts/DiceBehaviour/ZonkDiceBehaviour';
const { ccclass, property } = _decorator;

@ccclass('ZonkModel')
export class ZonkModel{
private static ZonkModel: ZonkModel = null;
    private _zonkView: ZonkView = null;
    private _restartView: RestartView = null;
    
    private _MaxThrowCount: number = 3;
    private _YatzyScore: number = 50; 
    private _BigStraightScore: number = 40; 
    private _SmallStraightScore: number = 30; 
    private _FullHouseScore: number = 25; 

    private _UpperSectionBonus: number = 35;
    private _ScoreToGetUpperSectionBonus: number = 63;
    private _upperSectionScoreCounter: number = 0;
    private _lowerSectionScoreCounter: number = 0;
    private _hasUpperSectionBonus: boolean = true;

    private _hasFiveIdentical: boolean = false;
    private _isDiceRolling = false;

    private _currentScore: number = 0;

    private _diceValues: number[] = [0,0,0,0,0]; 

    private _stopDicesCounter: number = 0;

    private _LastMove: number = 13;
    private _moveCounter: number = 0;

    private _DiceBehaviour: AbstractDiceBehaviour = null;

    private constructor(){
        this._zonkView = GodSinglton.zonkView;
        this._zonkView.node.on("Throw", this.WhenThrowButtonClicked, this);
        this._zonkView.node.on("Move", this.WhenMoveButtonClicked, this);
        this._zonkView.node.on("ToggleSelected", this.WhenToggleSelected, this);

        this._DiceBehaviour = new ZonkDiceBehaviour(this._zonkView.Dices);

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
        this._isDiceRolling = true;
        this._stopDicesCounter = 0;

        this._zonkView.ActivateDiceLayout();
        this._zonkView.DeactivateDiceLandingPosition();
        this._zonkView.DisableMoveButton();

        this._zonkView.DisableThrowButton();
        GodSinglton.audioManager.Play(SoundNames.DiceThrow);
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

    public WhenMoveButtonClicked(): void{
        
    }

    public WhenToggleSelected(): void{
        
    }

    public RestartGame(): void{

    }
}


