import { _decorator, animation, Component, Node, tween, Vec3 } from 'cc';
import { AbstractDiceBehaviour } from './AbstractDiceBehaviour';
import { Dice } from '../Dice';
const { ccclass, property } = _decorator;

@ccclass('ZonkDiceBehaviour')
export class ZonkDiceBehaviour extends AbstractDiceBehaviour {
    private _position: Vec3 = null;
    private _scale: Vec3 = null;

    protected ChangeVisualToUnpicked(dice: Dice): void {
        this.DoTween(dice);
    }
    protected ChangeVisualToPicked(dice: Dice): void {
        this.DoTween(dice);
    }
    public SetTweenTranform(position: Vec3, scale: Vec3): void{
        this._position = position;
        this._scale = scale;
    }
    public DoTween(dice: Dice){
        if(dice.HasActiveTween(dice.DiceNode)) return;

        tween(dice.DiceNode).to(0.2, {
            worldPosition: this._position,
            worldScale: this._scale
        }, {easing: "quadOut"}).start();
    }
}


