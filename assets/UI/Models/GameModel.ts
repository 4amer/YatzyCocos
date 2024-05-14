import { _decorator, Component, Node, randomRangeInt } from 'cc';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { GameView } from '../Views/GameView';
import { Dice } from '../../Scripts/Dice';
import { DiceConditions } from '../../Scripts/Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export default class GameModel{
    private _gameView: GameView = null;
    
    private static GameModel: GameModel = null;

    private constructor(){
        this._gameView = GodSinglton.gameView;
        this._gameView.node.on("Throw", this.WhenThrowButtonClicked, this);
        this._gameView.node.on("Move", this.WhenMoveButtonClicked, this);
    }

    public static get Instance(): GameModel{
        if(this.GameModel == null){
            this.GameModel = new GameModel();
        }
        return this.GameModel;
    }

    private WhenThrowButtonClicked(): void{
        for(let i = 0; i < this._gameView.Dices.length; i++){
            let dice: Dice = this._gameView.Dices[i].getComponent(Dice);
            if(dice.Condition == DiceConditions.lock) continue;
            this.RollDice(dice, i * 100 + 500);
        }
    }

    private async RollDice(dice: Dice, rollTimeMs: number): Promise<void> {
        setTimeout(() => {
            let randomNum = randomRangeInt(1, 7);
            dice.RequestingNumber = randomNum;
        }, rollTimeMs);
    }

    private WhenMoveButtonClicked(): void{
        
    }
}


