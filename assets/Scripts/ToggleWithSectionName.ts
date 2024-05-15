import { _decorator, Component, Enum, Node, Toggle } from 'cc';
import { SectionsName } from './Enums/SectionsName';
const { ccclass, property } = _decorator;

@ccclass('ToggleWithSectionName')
export class ToggleWithSectionName extends Toggle {
    @property({visible: true, type: Enum(SectionsName)}) private _sectionName: SectionsName = SectionsName.None;

    public get SectionName(): SectionsName{
        return this._sectionName;
    }
}


