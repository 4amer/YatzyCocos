import { _decorator, Component, Node } from 'cc';
import { AbstractDiceBehaviour } from './AbstractDiceBehaviour';
import { Dice } from '../Dice';
const { ccclass, property } = _decorator;

@ccclass('ZonkDiceBehaviour')
export class ZonkDiceBehaviour extends AbstractDiceBehaviour {
    protected ChangeVisualToUnpicked(dice: Dice): void {

    }
    protected ChangeVisualToPicked(dice: Dice): void {

    }
}


