import { _decorator, Component, Node, Quat, randomRangeInt, tween, Vec2, Vec3 } from 'cc';
import { Dice } from '../Dice';
import { DiceConditions } from '../Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('AbstractDiceBehaviour')
export abstract class AbstractDiceBehaviour{

    protected Dices: Dice[] = [];

    public constructor(diceNodes: Node[]){
        let dices: Dice[] = [];
        diceNodes.forEach((element) => {
            dices.push(element.getComponent(Dice));
        })
        this.Dices = dices;
    }

    public OnDiceCliked(dice: Dice): void{
        if(!dice.IsActive) return;
        if(dice.Condition == DiceConditions.picked && dice.HasActiveTween(dice.DiceNode) == false){
            dice.Condition = DiceConditions.unpicked;
            this.ChangeVisualToUnpicked(dice);
        } 
        else if (dice.Condition == DiceConditions.unpicked && dice.HasActiveTween(dice.DiceNode) == false) 
        {
            dice.Condition = DiceConditions.picked;
            this.ChangeVisualToPicked(dice);
        }
    }

    public SetIsActive(dice: Dice, bool: boolean){
        dice.IsActive = bool;
    }

    public UnpickDice(dice: Dice): void{
        dice.Condition = DiceConditions.unpicked;
        this.ChangeVisualToUnpicked(dice);
    }

    public PickDice(dice: Dice): void{
        dice.Condition = DiceConditions.picked;
        this.ChangeVisualToPicked(dice);
    }

    public ActiveAllDices(): void{ 
        this.Dices.forEach((element) => {
            let dice: Dice = element.getComponent(Dice);
            dice.IsActive = true;
        });
    }

    public DeactiveAllDices(): void{ 
        this.Dices.forEach((element) => {
            let dice: Dice = element.getComponent(Dice);
            dice.IsActive = false;
        });
    }

    public UnpickAllDice(): void{
        this.Dices.forEach((element) => {
            let dice: Dice = element.getComponent(Dice);
            dice.Condition = DiceConditions.unpicked;
        });
    }

    public PickAllDice(): void{
        this.Dices.forEach((element) => {
            let dice: Dice = element.getComponent(Dice);
            dice.Condition = DiceConditions.picked;
        });
    }

    public DoRollTween(dice: Dice){

        dice.SetLandingPointByDefault();
        const tweenTime: number = 1.3;

        let rotationDirections: Vec3 = new Vec3();
        const rotationValues: number[] = [-720, -360 , 360, 720];
        const throwPosition: Vec3 = dice.ThrowPosition;
        const landingPosition: Vec3 = dice.DiceLandingPointWorldPosition;

        let newLandingPositionPosition: Vec3 = new Vec3();

        let landingRange: Vec2 = dice.RangeForLanding;

        newLandingPositionPosition.x = landingPosition.x + randomRangeInt((landingRange.x * -1),landingRange.x);
        newLandingPositionPosition.y = landingPosition.y + randomRangeInt((landingRange.y * -1),landingRange.y);
        newLandingPositionPosition.z = landingPosition.z;

        rotationDirections.x = rotationValues[Math.floor(Math.random()*rotationValues.length)];
        rotationDirections.y = rotationValues[Math.floor(Math.random()*rotationValues.length)];
        rotationDirections.z = rotationValues[Math.floor(Math.random()*rotationValues.length)];

        dice.DiceLandingPointWorldPosition = newLandingPositionPosition;

        let rotationTween = tween(dice.DiceNode).to(tweenTime, {
                eulerAngles: rotationDirections,
                }, { easing: 'quadOut' });

        let scaleTween = tween(dice.DiceNode).to(tweenTime, {
                scale: new Vec3(1, 1, 1),
                }, { easing: 'bounceOut' });
        
        let positionScale = tween(dice.DiceNode).to(tweenTime, {
                worldPosition: dice.DiceLandingPointWorldPosition,
                }, { easing: 'sineOut' });

        dice.DiceNode.worldScale = new Vec3(2, 2, 2);
        dice.DiceNode.worldRotation = new Quat(0, 0, 0);
        dice.DiceNode.worldPosition = throwPosition;

        tween(dice.DiceNode).parallel(rotationTween, scaleTween, positionScale).start();
    }

    public RollToNumber(number: number, dice: Dice){
        let oppositeNumber = number;

        const diceNumberNodes: Node[] = dice.DiceNumberNodes;

        switch(oppositeNumber){
            case 1:
                dice.DiceChildren.lookAt(diceNumberNodes[0].worldPosition);
                break;
            case 2:
                dice.DiceChildren.lookAt(diceNumberNodes[1].worldPosition);
                break;
            case 3:
                dice.DiceChildren.lookAt(diceNumberNodes[2].worldPosition);
                break;
            case 4:
                dice.DiceChildren.lookAt(diceNumberNodes[3].worldPosition);
                break;
            case 5:
                dice.DiceChildren.lookAt(diceNumberNodes[4].worldPosition);
                break;
            case 6:
                dice.DiceChildren.lookAt(diceNumberNodes[5].worldPosition);
                break;
        }
    }

    public HasUnpickedDices(): boolean{
        this.Dices.forEach((element) => {
            if(element.Condition == DiceConditions.unpicked){
                return true;
            }
        });
        return false;
    }

    public get AllPickedDices(): Dice[]{
        let dices: Dice[] = new Array<Dice>;
        this.Dices.forEach((element) => {
            if(element.Condition == DiceConditions.picked) dices.push(element);
        })
        return dices;
    }

    public get AllUnpickedDices(): Dice[]{
        let dices: Dice[] = new Array<Dice>;
        this.Dices.forEach((element) => {
            if(element.Condition == DiceConditions.unpicked) dices.push(element);
        })
        return dices;
    }

    protected abstract ChangeVisualToUnpicked(dice: Dice): void;

    protected abstract ChangeVisualToPicked(dice: Dice): void;
}


