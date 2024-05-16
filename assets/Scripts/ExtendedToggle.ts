import { _decorator, Component, Enum, Node, RichText, Toggle } from 'cc';
import { SectionsName } from './Enums/SectionsName';
const { ccclass, property } = _decorator;

@ccclass('ExtendedToggle')
export class ExtendedToggle extends Toggle {
    @property({visible: true, type: RichText}) private _scoreText: RichText = null;
    @property({visible: true, type: Enum(SectionsName)}) private _sectionName: SectionsName = SectionsName.None;
    private _isDisable: boolean = false;

    public set ScoreText(text: string){
        this._scoreText.string = text;
    }

    public set IsDisable(bool: boolean){
        this._isDisable = bool;
    }

    public get SectionName(): SectionsName{
        return this._sectionName;
    }
}


