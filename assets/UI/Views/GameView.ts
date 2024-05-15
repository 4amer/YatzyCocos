import { CCClass, _decorator, Button, Component, Node, RichText, Toggle, find, Label } from 'cc';
import GameModel from '../Models/GameModel';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { Dice } from '../../Scripts/Dice';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({visible: true, type: Button}) private _moveButton: Button = null; 
    @property({visible: true, type: Button}) private _throwButton: Button = null; 
    @property({visible: true, type: RichText}) private _throwDowncounter: RichText = null; 
    @property({visible: true, type: [Toggle]}) private _toggles: Toggle[] = []; 
    @property({visible: true, type: [RichText]}) private _dices: RichText[] = []; 

    private _gameModel: GameModel = null;

    protected onLoad(): void {
        this.DeactivateMoveButton();
    }

    private NextMove(): void{
        this.node.emit("Move");
    }

    private Throw(): void{
        this.node.emit("Throw");
    }

    private ToggleSelected(): void{
        this.node.emit("ToggleSelected");
    }
    
    public ActivateMoveButton(): void{
        this._moveButton.interactable = true;
    }

    public DeactivateMoveButton(): void{
        this._moveButton.interactable = false;
    }

    public set ThrowDowncounter(number: number){
        this._throwDowncounter.string = `${number}`;
    }

    public get Dices(): RichText[]{
        return this._dices;
    }

}


