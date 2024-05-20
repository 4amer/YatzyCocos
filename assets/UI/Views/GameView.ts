import { CCClass, _decorator, Button, Component, Node, RichText, Toggle, find, Label, ToggleContainer, Sprite } from 'cc';
import GameModel from '../Models/GameModel';
import { GodSinglton } from '../../Scripts/GodSinglton';
import { Dice } from '../../Scripts/Dice';
import { SectionsName } from '../../Scripts/Enums/SectionsName';
import { ExtendedToggle } from '../../Scripts/ExtendedToggle';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({visible: true, type: Button}) private _moveButton: Button = null; 
    @property({visible: true, type: Button}) private _throwButton: Button = null; 
    @property({visible: true, type: RichText}) private _throwCounter: RichText = null; 
    @property({visible: true, type: RichText}) private _scoreText: RichText = null; 
    @property({visible: true, type: RichText}) private _throwDiceText: RichText = null; 
    @property({visible: true, type: RichText}) private _sumForUpperSection: RichText = null; 
    @property({visible: true, type: RichText}) private _sumForLowerSection: RichText = null; 
    @property({visible: true, type: RichText}) private _upperSectionBonusScores: RichText = null; 
    @property({visible: true, type: ToggleContainer}) private _toggleContainer: ToggleContainer = null; 
    @property({visible: true, type: [Toggle]}) private _toggles: ExtendedToggle[] = []; 
    @property({visible: true, type: [Node]}) private _dices: Node[] = []; 
    @property({visible: true, type: Node}) private _diceLayout: Node = null; 

    private _gameModel: GameModel = null;

    protected start(): void {
        this.DisableMoveButton();
        this.DisableDiceLayout();
        this.EnableThrowDiceText();
        this.DoAllEnabledToggleInteractable(false);
        this.ToggleContainerActive(false);
    }

    private NextMove(): void{
        this.node.emit("Move");
    }

    private Throw(): void{
        this.node.emit("Throw");
    }
    
    private ToggleSelected(): void{
        let toggle: ExtendedToggle;
        this._toggleContainer.toggleItems.forEach((element) => {
            if(element.isChecked == true){
                toggle = element as ExtendedToggle;
            }
        })
        this.node.emit("ToggleSelected", toggle);
    }    

    public EnableThrowButton(): void{
        this._throwButton.interactable = true;
    }
    
    public DisableThrowButton(): void{
        this._throwButton.interactable = false;
    }

    public EnableMoveButton(): void{
        this._moveButton.interactable = true;
    }
    
    public DisableMoveButton(): void{
        this._moveButton.interactable = false;
    }
    
    public DisableToggle(toggle: ExtendedToggle){
        toggle.getComponent(Sprite).color = toggle.disabledColor;
        toggle.interactable = false;
        toggle.isChecked = false;
        toggle.IsDisable = true;
    }

    public DisableDiceLayout(){
        this._diceLayout.active = false;
    }

    public EnableDiceLayout(){
        this._diceLayout.active = true;
    }

    public DisableThrowDiceText(){
        this._throwDiceText.node.active = false;
    }

    public EnableThrowDiceText(){
        this._throwDiceText.node.active = true;
    }

    public ChangeUpperSectionBonusScoresValue(number: number){
        this._upperSectionBonusScores.string = `${number}`;
    }

    public ChangeSumForUpperSectionValue(number: number){
        this._sumForUpperSection.string = `${number}`;
    }

    public ChangeSumForLowerSectionValue(number: number){
        this._sumForLowerSection.string = `${number}`;
    }

    public DoAllEnabledToggleInteractable(bool: boolean){
        this._toggles.forEach((element) => {
            if(!element.IsDisable){
                element.interactable = bool;
            }
        })
    }

    public ToggleContainerActive(bool: boolean){
        this._toggleContainer.enabled = bool;
    }

    public set Score(number: number){
        this._scoreText.string = `${number}`;
    }

    public set ToggleContainerAllowSwitchOff(bool : boolean){
        this._toggleContainer.allowSwitchOff = bool;
    }

    public set ThrowCounter(number: number){
        this._throwCounter.string = `${number}`;
    }

    public get Dices(): Node[]{
        return this._dices;
    }
}


