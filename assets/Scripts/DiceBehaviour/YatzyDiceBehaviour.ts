import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { AbstractDiceBehaviour } from './AbstractDiceBehaviour';
import { Dice } from '../Dice';
const { ccclass, property } = _decorator;

@ccclass('YatzyDiceBehaviour')
export class YatzyDiceBehaviour extends AbstractDiceBehaviour {

    public ChangeVisualToUnpicked(dice: Dice): void {
        let nodeRotation: Vec3 = dice.DiceNode.eulerAngles;

        tween(dice.DiceNode).to(0.5,{
            eulerAngles: new Vec3(nodeRotation.x - 20, nodeRotation.y, nodeRotation.z)
        }, { easing: 'quintOut'}).start();
    }
    public ChangeVisualToPicked(dice: Dice): void {
        let nodeRotation: Vec3 = dice.DiceNode.eulerAngles;

        tween(dice.DiceNode).to(0.5,{
            eulerAngles: new Vec3(nodeRotation.x + 20, nodeRotation.y, nodeRotation.z)
        }, { easing: 'quintOut'}).start();
    }
}


