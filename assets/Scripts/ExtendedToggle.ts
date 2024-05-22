import { _decorator, Component, Enum, Node, RichText, TERRAIN_SOUTH_INDEX, Toggle } from 'cc';
import { SectionsName } from './Enums/SectionsName';
const { ccclass, property } = _decorator;

@ccclass('ExtendedToggle')
export class ExtendedToggle extends Toggle {
    @property({visible: true, type: RichText}) private _scoreText: RichText = null;
    @property({visible: true, type: RichText}) private _bonusScoreText: RichText = null;
    @property({visible: true, type: Enum(SectionsName)}) private _sectionName: SectionsName = SectionsName.None;
    private _isDisable: boolean = false;

    protected start(): void {
        this._bonusScoreText.node.active = false;
    }

    public ShowBonusScore(){
        this._bonusScoreText.node.active = true;
    }

    public HideBonusScore(){
        this._bonusScoreText.node.active = false;
    }

    public set ScoreText(text: string){
        this._scoreText.string = text;
    }

    public set IsDisable(bool: boolean){
        this._isDisable = bool;
    }

    public get IsDisable(): boolean{
        return this._isDisable;
    }

    public get SectionName(): SectionsName{
        return this._sectionName;
    }
}


