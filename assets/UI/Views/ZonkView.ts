import { _decorator, Button, Component, Node, RichText } from 'cc';
import { Dice } from '../../Scripts/Dice';
import { AbstractView } from './AbstractView';
const { ccclass, property } = _decorator;

@ccclass('ZonkView')
export class ZonkView extends AbstractView {
    @property({visible: true, type: Button}) private _moveButton: Button = null; 
    @property({visible: true, type: Button}) private _throwButton: Button = null; 
    @property({visible: true, type: RichText}) private _thisMoveScoreText: RichText = null; 
    @property({visible: true, type: [RichText]}) private _allScoreTexts: RichText[] = []; 
    @property({visible: true, type: RichText}) private _totalScoreText: RichText; 
    @property({visible: true, type: [Node]}) private _dices: Node[] = []; 
    @property({visible: true, type: Node}) private _diceLandingPosition: Node = null; 
    @property({visible: true, type: Node}) private _diceLayout: Node = null; 
    
    private NextMove(): void{
        this.node.emit("Move");
    }

    private Throw(): void{
        this.node.emit("Throw");
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

    protected start(): void {
        this.StartNewGame();
    }

    public StartNewGame(){
        this.DisableMoveButton();
        this.DeactivateDiceLayout();
        this.DeactivateDiceLandingPosition();


        this.ThisMoveScore = 0;
    }

    public DeactivateDiceLayout(){
        this._diceLayout.active = false;
    }

    public ActivateDiceLayout(){
        this._diceLayout.active = true;
    }

    public DeactivateDiceLandingPosition(){
        this._diceLandingPosition.active = false;
    }

    public ActivateDiceLandingPosition(){
        this._diceLandingPosition.active = true;
    }

    public set ThisMoveScore(number: number){
        this._thisMoveScoreText.string = `${number}`;
    }

    public get Dices(): Node[]{
        return this._dices;
    }

    public get AllScoreTexts(): RichText[]{
        return this._allScoreTexts
    }

    public get TotalScoreText(): RichText{
        return this._totalScoreText;
    }
}


