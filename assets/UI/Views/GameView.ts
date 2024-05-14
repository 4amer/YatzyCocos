import { CCClass, _decorator, Button, Component, Node, RichText, Toggle, find } from 'cc';
import GameModel from '../Models/GameModel';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { Dice } from '../../Scripts/Dice';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({visible: true, type: Button}) private _moveButton: Button = null; 
    @property({visible: true, type: Button}) private _throwButton: Button = null; 
    @property({visible: true, type: [Toggle]}) private _toggles: Toggle[] = []; 
    @property({visible: true, type: [RichText]}) private _dices: RichText[] = []; 

    private _gameModel: GameModel = null;

    protected onLoad(): void {

    }

    private NextMove(): void{
        this.node.emit("Move");
    }

    private Throw(): void{
        this.node.emit("Throw");
    }

    public get Dices(): RichText[]{
        return this._dices;
    }
}


