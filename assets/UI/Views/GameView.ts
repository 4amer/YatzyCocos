import { CCClass, _decorator, Button, Component, Node, RichText, Toggle, find, Label, ToggleContainer, Sprite } from 'cc';
import GameModel from '../Models/GameModel';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { Dice } from '../../Scripts/Dice';
import { SectionsName } from '../../Scripts/Enums/SectionsName';
import { ToggleWithSectionName } from '../../Scripts/ToggleWithSectionName';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({visible: true, type: Button}) private _moveButton: Button = null; 
    @property({visible: true, type: Button}) private _throwButton: Button = null; 
    @property({visible: true, type: RichText}) private _throwDowncounter: RichText = null; 
    @property({visible: true, type: RichText}) private _scoreText: RichText = null; 
    @property({visible: true, type: ToggleContainer}) private _toggleContainer: ToggleContainer = null; 
    @property({visible: true, type: [Toggle]}) private _toggles: ToggleWithSectionName[] = []; 
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
        let toggle: ToggleWithSectionName;
        this._toggleContainer.toggleItems.forEach((element) => {
            if(element.isChecked == true){
                toggle = element as ToggleWithSectionName;
            }
        })
        this.node.emit("ToggleSelected", toggle);
    }    

    public ActivateMoveButton(): void{
        this._moveButton.interactable = true;
    }
    
    public DeactivateMoveButton(): void{
        this._moveButton.interactable = false;
    }
    
    public SetToggleToDisable(toggle: Toggle){
        toggle.getComponent(Sprite).color = toggle.disabledColor;
        toggle.interactable = false;
        toggle.isChecked = false;
    }

    public set Score(number: number){
        this._scoreText.string = `${number}`;
    }

    public set ToggleContainerAllowSwitchOff(bool : boolean){
        this._toggleContainer.allowSwitchOff = bool;
    }

    public set ThrowDowncounter(number: number){
        this._throwDowncounter.string = `${number}`;
    }
    
    public get Dices(): RichText[]{
        return this._dices;
    }
}


