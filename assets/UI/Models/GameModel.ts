import { _decorator, Component, Node, randomRangeInt, Sprite, Toggle } from 'cc';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { GameView } from '../Views/GameView';
import { Dice } from '../../Scripts/Dice';
import { DiceConditions } from '../../Scripts/Enums/DiceConditions';
import { ToggleWithSectionName } from '../../Scripts/ToggleWithSectionName';
import { SectionsName } from '../../Scripts/Enums/SectionsName';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export default class GameModel{
    private _gameView: GameView = null;
    
    private static GameModel: GameModel = null;
    private MaxThrowCount: number = 1000;
    private YatzyScore = 50; 
    private BigStraightScore = 40; 
    private SmallStraightScore = 30; 
    private FullHouseScore = 25; 
    
    private _throwCount: number = 3;
    private _currentSelectedToggle: ToggleWithSectionName = null;
    private _currentScore: number = 0;


    private _diceValues: number[] = []; 

    private constructor(){
        this._gameView = GodSinglton.gameView;
        this._gameView.node.on("Throw", this.WhenThrowButtonClicked, this);
        this._gameView.node.on("Move", this.WhenMoveButtonClicked, this);
        this._gameView.node.on("ToggleSelected", this.WhenToggleSelected, this);
    }

    public static get Instance(): GameModel{
        if(this.GameModel == null){
            this.GameModel = new GameModel();
        }
        return this.GameModel;
    }
    
    private WhenToggleSelected(toggle: ToggleWithSectionName): void{
        this._gameView.ToggleContainerAllowSwitchOff = false;
        this._gameView.ActivateMoveButton();
        this._currentSelectedToggle = toggle;
    }

    private WhenMoveButtonClicked(): void{
        this._throwCount = this.MaxThrowCount;
        this._gameView.ToggleContainerAllowSwitchOff = true;
        this._gameView.DeactivateMoveButton();
        this._gameView.SetToggleToDisable(this._currentSelectedToggle);

        switch(this._currentSelectedToggle.SectionName){
            case SectionsName.One:
                this.AddScore(this.SumFromCertainNumbers(1));
                break;
            case SectionsName.Two:
                this.AddScore(this.SumFromCertainNumbers(2));
                break;
            case SectionsName.Three:
                this.AddScore(this.SumFromCertainNumbers(3));
                break;
            case SectionsName.Four:
                this.AddScore(this.SumFromCertainNumbers(4));
                break;
            case SectionsName.Five:
                this.AddScore(this.SumFromCertainNumbers(5));
                break;
            case SectionsName.Six:
                this.AddScore(this.SumFromCertainNumbers(6));
                break;
            case SectionsName.ThreeIdentical:
                if(this.CheckIdenticalNumbers(3))
                    this.AddScore(this.SumFromDiceValues());
                break;
            case SectionsName.FourIdentical:
                if(this.CheckIdenticalNumbers(4))
                    this.AddScore(this.SumFromDiceValues());
                break;
            case SectionsName.FiveIdentical:
                if(this.CheckIdenticalNumbers(5))
                    this.AddScore(this.YatzyScore);
                break;
            case SectionsName.FullHouse:
                if(this.CheckFullHouse())
                    this.AddScore(this.FullHouseScore);
                break;
            case SectionsName.FourInOrder:
                if(this.CheckStraight(4))
                    this.AddScore(this.SmallStraightScore);
                break;
            case SectionsName.AllInOrder:
                if(this.CheckStraight(5))
                    this.AddScore(this.BigStraightScore);
                break;
            case SectionsName.Other:
                this.AddScore(this.SumFromDiceValues());
                break;
            case SectionsName.None:
                console.warn("Section name is 'None'!");
                break;
        }
        this.ChangeScoreTextOnView();   
    }

    private WhenThrowButtonClicked(): void{
        if(this._throwCount <= 0) return;
        this._throwCount -= 1;
        this._gameView.ThrowDowncounter = this._throwCount;
        for(let i = 0; i < this._gameView.Dices.length; i++){
            let dice: Dice = this._gameView.Dices[i].getComponent(Dice);
            if(dice.Condition == DiceConditions.lock) continue;
            this.RollDice(dice, i * 100 + 500, i);
        }
    }

    private async RollDice(dice: Dice, rollTimeMs: number, diceNumber: number): Promise<void> {
        dice.SetToDeactive();
        
        setTimeout(() => {
            let randomNum = randomRangeInt(1, 7);
            dice.RequestingValue = randomNum;
            this._diceValues[diceNumber] = randomNum;
            dice.SetToActive();
        }, rollTimeMs);
    }

    private ChangeScoreTextOnView(){
        this._gameView.Score = this._currentScore;
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
            if (count === amount) {
                hasIdentical = true;
            }
        });

        return hasIdentical;
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
        let minNum: number = Math.min.apply(this._diceValues);
        for(let i = 0; i < this._diceValues.length; i++){
            let nextNum: number = 0;
            nextNum = this._diceValues.find((element) => element == (minNum + i));
            if(nextNum != 0){
                straight += 1;
            }
            if(straight == straightNumber){
                isStraight = true;
                break;
            }
        }

        return isStraight;
    }
}