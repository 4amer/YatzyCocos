import { _decorator, Component, lerp, Node, Quat, random, randomRange, randomRangeInt, Sprite, Toggle, tween, Vec3 } from 'cc';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { GameView } from '../Views/GameView';
import { Dice } from '../../Scripts/Dice';
import { DiceConditions } from '../../Scripts/Enums/DiceConditions';
import { SectionsName } from '../../Scripts/Enums/SectionsName';
import { ExtendedToggle } from '../../Scripts/ExtendedToggle';
import { RestartView } from '../Views/RestartView';
import { WindowTypes } from '../WindowTypes/WindowTypes';
import { SoundNames } from '../../Scripts/AudioManager/SoundNames/SoundNames';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export default class GameModel{
    private _gameView: GameView = null;
    private _restartView: RestartView = null;
    
    private static GameModel: GameModel = null;
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

    private _throwCount: number = 3;
    private _currentSelectedToggle: ExtendedToggle = null;
    private _currentScore: number = 0;

    private _diceValues: number[] = [0,0,0,0,0]; 

    private _stopDicesCounter: number = 0;

    private _LastMove: number = 13;
    private _moveCounter: number = 0;

    private constructor(){
        this._gameView = GodSinglton.gameView;
        this._gameView.node.on("Throw", this.WhenThrowButtonClicked, this);
        this._gameView.node.on("Move", this.WhenMoveButtonClicked, this);
        this._gameView.node.on("ToggleSelected", this.WhenToggleSelected, this);

        this._restartView = GodSinglton.restartView;
        this._restartView.node.on("Restart", this.RestartGame, this);
    }

    public static get Instance(): GameModel{
        if(this.GameModel == null){
            this.GameModel = new GameModel();
        }
        return this.GameModel;
    }

    private WhenToggleSelected(toggle: ExtendedToggle): void{
        GodSinglton.audioManager.Play(SoundNames.ButtonClicked);
        this._gameView.ToggleContainerAllowSwitchOff = false;
        this._currentSelectedToggle = toggle;

        if(this._isDiceRolling == true) return;
        this._gameView.EnableMoveButton();
    }

    private WhenMoveButtonClicked(): void{
        GodSinglton.audioManager.Play(SoundNames.NextMove);
        this._moveCounter += 1;

        this.ThrowCoutnerByDefault();
        this._gameView.ToggleContainerAllowSwitchOff = true;
        this._gameView.DisableMoveButton();
        this._gameView.DisableToggle(this._currentSelectedToggle);

        let scoreSum: number = 0;
        if(this._hasFiveIdentical == true && this.CheckIdenticalNumbers(5)){
            this.AddScore(this._YatzyScore);
            this._currentSelectedToggle.ShowBonusScore();
        }
        switch(this._currentSelectedToggle.SectionName){
            case SectionsName.One:
                scoreSum = this.SumFromCertainNumbers(1)
                this.AddScore(scoreSum);
                this._upperSectionScoreCounter += scoreSum;
                break;
            case SectionsName.Two:
                scoreSum = this.SumFromCertainNumbers(2)
                this.AddScore(scoreSum);
                this._upperSectionScoreCounter += scoreSum;
                break;
            case SectionsName.Three:
                scoreSum = this.SumFromCertainNumbers(3)
                this.AddScore(scoreSum);
                this._upperSectionScoreCounter += scoreSum;
                break;
            case SectionsName.Four:
                scoreSum = this.SumFromCertainNumbers(4)
                this.AddScore(scoreSum);
                this._upperSectionScoreCounter += scoreSum;
                break;
            case SectionsName.Five:
                scoreSum = this.SumFromCertainNumbers(5)
                this.AddScore(scoreSum);
                this._upperSectionScoreCounter += scoreSum;
                break;
            case SectionsName.Six:
                scoreSum = this.SumFromCertainNumbers(6)
                this.AddScore(scoreSum);
                this._upperSectionScoreCounter += scoreSum;
                break;
            case SectionsName.ThreeIdentical:
                if(this.CheckIdenticalNumbers(3) == true){
                    scoreSum = this.SumFromDiceValues()
                    this.AddScore(scoreSum);
                    this._lowerSectionScoreCounter += scoreSum;
                    }
                break;
            case SectionsName.FourIdentical:
                if(this.CheckIdenticalNumbers(4) == true){
                    scoreSum = this.SumFromDiceValues()
                    this.AddScore(scoreSum);
                    this._lowerSectionScoreCounter += scoreSum;
                }
                break;
            case SectionsName.FiveIdentical:
                if(this.CheckIdenticalNumbers(5) == true){
                    this._hasFiveIdentical = true;
                    scoreSum += this._YatzyScore;
                    this.AddScore(this._YatzyScore);
                    this._lowerSectionScoreCounter += this._YatzyScore;
                }
                break;
            case SectionsName.FullHouse:
                if(this.CheckFullHouse() == true){
                    scoreSum += this._FullHouseScore;
                    this.AddScore(this._FullHouseScore);
                    this._lowerSectionScoreCounter += this._FullHouseScore;
                }
                break;
            case SectionsName.FourInOrder:
                if(this.CheckStraight(4) == true){
                    scoreSum += this._SmallStraightScore;
                    this.AddScore(this._SmallStraightScore);
                    this._lowerSectionScoreCounter += this._SmallStraightScore;
                }
                break;
            case SectionsName.AllInOrder:
                if(this.CheckStraight(5) == true){
                    scoreSum += this._BigStraightScore;
                    this.AddScore(this._BigStraightScore);
                    this._lowerSectionScoreCounter += this._BigStraightScore;
                }
                break;
            case SectionsName.Other:
                scoreSum = this.SumFromDiceValues();
                this.AddScore(scoreSum);
                this._lowerSectionScoreCounter += scoreSum;
                break;
            case SectionsName.None:
                console.warn("Section name is 'None'!");
                break;
        }
        if(this._upperSectionScoreCounter >= this._ScoreToGetUpperSectionBonus && this._hasUpperSectionBonus == true){
            this._hasUpperSectionBonus = false;
            this._gameView.ChangeUpperSectionBonusScoresValue(this._UpperSectionBonus);
            this.AddScore(this._UpperSectionBonus);
        }
        console.log(scoreSum);
        this._currentSelectedToggle.ScoreText = `${scoreSum}`;
        this.ChangeScoreTextOnView();
        this._gameView.DeactivateDiceLayout();
        this._gameView.DeactivateDicePositionsNode();
        this._gameView.ActivateThrowDiceText();
        this.ToggleContainerActive(false);
        this.UnlockAllDice();
        this._currentSelectedToggle = null;
        if(this._moveCounter >= this._LastMove){
            GodSinglton.audioManager.Play(SoundNames.Congratulation);
            GodSinglton.viewManager.Show(WindowTypes.RestartView);
            this._restartView.FinalScore = this._currentScore;
            return;
        }
    }

    private WhenThrowButtonClicked(): void{
        if(this._throwCount <= 0) return;
        GodSinglton.audioManager.Play(SoundNames.ButtonClicked);
        this._isDiceRolling = true;
        this._stopDicesCounter = 0;
        this._throwCount -= 1;
        this.ToggleContainerActive(true);

        this._gameView.ActivateDiceLayout();
        this._gameView.DeactivateDicePositionsNode();
        this._gameView.DisableMoveButton();

        this._gameView.DeactivateThrowDiceText();
        this._gameView.DisableThrowButton();
        this._gameView.ThrowCounter = this._throwCount;
        GodSinglton.audioManager.Play(SoundNames.DiceThrow);
        for(let i = 0; i < this._gameView.Dices.length; i++){
            let dice: Dice = this._gameView.Dices[i].getComponent(Dice);
            if(dice.Condition == DiceConditions.lock) {
                this._stopDicesCounter += 1;
                continue;
            }

            this.DoTweenForDice(dice);
            this.RollDice(dice, 1300, i).then(() => {
                if(this._stopDicesCounter == this._diceValues.length){
                    this._gameView.EnableThrowButton();
                    this._gameView.ActivateDicePositionsNode();
                    this._isDiceRolling = false;
                    if(this._currentSelectedToggle != null){
                        this._gameView.EnableMoveButton();
                    }
                }
            });
        }
    }

    private async RollDice(dice: Dice, rollTimeMs: number, diceNumber: number): Promise<void> {
        return new Promise((resolve, reject) => {
            dice.SetToDeactive();
            let randomNum = randomRangeInt(1, 7);
            dice.RollToNumber(randomNum);
            setTimeout(() => {
                dice.RequestingValue = randomNum;
                this._diceValues[diceNumber] = randomNum;
                dice.SetToActive();
                this._stopDicesCounter += 1;
                resolve();
            }, rollTimeMs);
        })
    }

    private ToggleContainerActive(bool: boolean){
        this._gameView.DoAllEnabledToggleInteractable(bool);
        this._gameView.ToggleContainerActive(bool);
    }

    private ThrowCoutnerByDefault(){
        this._throwCount = this._MaxThrowCount;
        this._gameView.ThrowCounter = this._MaxThrowCount;
    }

    private UnlockAllDice(){
        this._gameView.Dices.forEach((element) => {
            let dice: Dice = element.getComponent(Dice);
            dice.Condition = DiceConditions.unlock;
        });
    }

    private ChangeViewSumValues(): void{
        this._gameView.ChangeSumForLowerSectionValue(this._lowerSectionScoreCounter);
        this._gameView.ChangeSumForUpperSectionValue(this._upperSectionScoreCounter);
    }

    private ChangeScoreTextOnView(){
        this._gameView.Score = this._currentScore;
        this.ChangeViewSumValues();
    }

    private AddScore(number: number){
        this._currentScore += number;
    }

    private SumFromDiceValues(): number{
        let sum: number = 0; 
        this._diceValues.forEach((value) => {
            sum += value;
        })
        return sum;
    }

    private SumFromCertainNumbers(number: number){
        let sum: number = 0; 
        this._diceValues.forEach((value) => {
            if(value == number){
                sum += value;
            }
        })
        return sum;
    }

    private CheckIdenticalNumbers(amount: number): boolean{
        let numCounts: Map<number, number> = new Map<number,number>();

        this._diceValues.forEach((value) => {
            if(numCounts.has(value)) {
                numCounts.set(value, numCounts.get(value) + 1);
            }
            else{
                numCounts.set(value, 1);
            }
        });

        let hasIdentical = false;

        numCounts.forEach((count) => {
            if (count >= amount) {
                hasIdentical = true;
            }
        });

        return hasIdentical;
    }

    private DoTweenForDice(dice: Dice){

        dice.SetLandingPointByDefault();
        const tweenTime: number = 1.3;

        let rotationDirections: Vec3 = new Vec3();
        const rotationValues: number[] = [-720, -360 , 360, 720];
        const diceNodeWorldPosition : Vec3 = dice.DiceNode.getWorldPosition();
        const throwDirection: Vec3 = new Vec3(diceNodeWorldPosition.x, diceNodeWorldPosition.y + 400, diceNodeWorldPosition.z);
        const landingPosition: Vec3 = dice.DiceLandingPointWorldPosition;

        let newLandingPositionPosition: Vec3 = new Vec3();

        newLandingPositionPosition.x = landingPosition.x + randomRangeInt(-20,20);
        newLandingPositionPosition.y = landingPosition.y + randomRangeInt(-50,50);
        newLandingPositionPosition.z = landingPosition.z;

        rotationDirections.x = rotationValues[Math.floor(Math.random()*rotationValues.length)];
        rotationDirections.y = rotationValues[Math.floor(Math.random()*rotationValues.length)];
        rotationDirections.z = rotationValues[Math.floor(Math.random()*rotationValues.length)];

        dice.DiceLandingPointWorldPosition = newLandingPositionPosition;

        let rotationTween = tween(dice.DiceNode).to(tweenTime, {
                eulerAngles: rotationDirections,
                }, { easing: 'quadOut' });

        let scaleTween = tween(dice.DiceNode).to(tweenTime, {
                scale: new Vec3(1, 1, 1),
                }, { easing: 'bounceOut' });
        
        let positionScale = tween(dice.DiceNode).to(tweenTime, {
                worldPosition: dice.DiceLandingPointWorldPosition,
                }, { easing: 'sineOut' });

        dice.DiceNode.worldScale = new Vec3(2, 2, 2);
        dice.DiceNode.worldRotation = new Quat(0, 0, 0);
        dice.DiceNode.worldPosition = throwDirection;

        tween(dice.DiceNode).parallel(rotationTween, scaleTween, positionScale).start();
    }

    private CheckFullHouse(): boolean {
        let numCounts: Map<number, number> = new Map<number, number>();
        
        this._diceValues.forEach((value) => {
            if(numCounts.has(value)) {
                numCounts.set(value, numCounts.get(value) + 1);
            }
            else{
                numCounts.set(value, 1);
            }
        });
        
        let hasTwoSame = false;
        let hasThreeSame = false;
        
        numCounts.forEach((count) => {
            if (count == 2) {
                hasTwoSame = true;
            }
            if (count == 3) {
                hasThreeSame = true;
            }
        });
        
        return hasTwoSame && hasThreeSame;
    }

    private CheckStraight(straightNumber: number): boolean{
        let straight:number = 0;
        let isStraight: boolean = false;
        let minNum: number = Math.min(...this._diceValues);

        for(let i = 0; i < this._diceValues.length; i++){
            let nextNum: number = 0;
            let nextNumIndex: number = this._diceValues.indexOf((minNum + i));
            nextNum = this._diceValues[nextNumIndex];
            if(nextNum == undefined){
                return false;
            }
            if(nextNum > 0){
                straight += 1;
            }
            if(straight >= straightNumber){
                isStraight = true;
                break;
            }
        }

        return isStraight;
    }

    private AllScouresAndCountersByDefault(): void{
        this._lowerSectionScoreCounter = 0;
        this._upperSectionScoreCounter = 0;
        this._currentScore = 0;
        this._moveCounter = 0;
        this.ThrowCoutnerByDefault();
    }
    
    private RestartGame(): void{
        GodSinglton.audioManager.Play(SoundNames.ButtonClicked);
        this.AllScouresAndCountersByDefault();
        this._gameView.StartNewGame();
        GodSinglton.viewManager.Hide(WindowTypes.RestartView);
    }
}