import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, Quat, RichText, tween, TweenAction, TweenSystem, UITransform, Vec2, Vec3} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.picked;
    @property({visible: true, type: CCInteger}) private _requestingValue: number = 1;
    
    @property({visible: true, type: Node}) private _DiceChildren: Node = null;

    @property({visible: true, type: Node}) private _diceLandingPoint: Node = null;
    @property({visible: true, type: Node}) private _defaultLandingPoint: Node = null;
    @property({visible: true, type: Node}) private _throwPosition: Node = null;

    @property({visible: true, type: Node}) private _nodeOne: Node = null;
    @property({visible: true, type: Node}) private _nodeTwo: Node = null;
    @property({visible: true, type: Node}) private _nodeThree: Node = null;
    @property({visible: true, type: Node}) private _nodeFour: Node = null;
    @property({visible: true, type: Node}) private _nodeFive: Node = null;
    @property({visible: true, type: Node}) private _nodeSix: Node = null;

    private _isActive: boolean = true;
    private _defaultLandingUITransform: UITransform = null;

    private _DiceHeight: number = 100;
    private _DiceWight: number = 100;

    protected onLoad(): void {
        this._diceLandingPoint.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
        this._defaultLandingUITransform =  this._defaultLandingPoint.getComponent(UITransform);
    }

    private TouchEnd(): void{
        console.log("WasClicked");
        this.node.emit("DiceCliked", this);
    }   

    public HasActiveTween(node: Node): boolean {
        const tweens = TweenSystem.instance.ActionManager;
        if(tweens.getNumberOfRunningActionsInTarget(node) > 0){
            return true;
        }
        return false;
    }

    public SetLandingPointByDefault(){
        this._diceLandingPoint.setWorldPosition(this._defaultLandingPoint.getWorldPosition());
    }
    
    public set Condition(condition: DiceConditions){
        this._condition = condition;
    }

    public get Condition(): DiceConditions{
        return this._condition;
    }
    
    public set RequestingValue(number: number){
        this._requestingValue = number;
    }

    public get RequestingValue(): number{
        return this._requestingValue;
    }
    
    public get DiceNode(){
        return this.node;
    }

    public get DiceChildren(): Node{
        return this._DiceChildren;
    }

    public get DiceNumberNodes(): Node[]{
        return new Array(this._nodeOne, this._nodeTwo, this._nodeThree, this._nodeFour, this._nodeFive, this._nodeSix);
    }

    public set DiceLandingPointWorldPosition(position :Vec3){
        this._diceLandingPoint.setWorldPosition(position);
    }

    public get DiceLandingPointWorldPosition(): Vec3{
        return this._diceLandingPoint.getWorldPosition();
    }

    public get ThrowPosition(): Vec3{
        return this._throwPosition.getWorldPosition();
    }
    
    public set IsActive(bool: boolean){
        this._isActive = bool;
    }

    public get IsActive(): boolean{
        return this._isActive;
    }

    public get RangeForLanding(): Vec2{
        let x: number = (this._defaultLandingUITransform.contentSize.width - this._DiceWight) / 2;
        let y: number = (this._defaultLandingUITransform.contentSize.height - this._DiceHeight) / 2;
        if(x <= 0){
            x = 0;
        } else if(y <= 0){
            y = 0;
        } 
        return new Vec2(x, y);
    }
}