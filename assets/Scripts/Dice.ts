import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, Quat, RichText, tween, TweenAction, TweenSystem, Vec3} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.lock;
    @property({visible: true, type: CCInteger}) private _requestingValue: number = 1;
    
    @property({visible: true, type: Node}) private _DiceChildren: Node = null;

    @property({visible: true, type: Node}) private _diceLandingPoint: Node = null;
    @property({visible: true, type: Node}) private _defaultLandingPoint: Node = null;

    @property({visible: true, type: Node}) private _nodeOne: Node = null;
    @property({visible: true, type: Node}) private _nodeTwo: Node = null;
    @property({visible: true, type: Node}) private _nodeThree: Node = null;
    @property({visible: true, type: Node}) private _nodeFour: Node = null;
    @property({visible: true, type: Node}) private _nodeFive: Node = null;
    @property({visible: true, type: Node}) private _nodeSix: Node = null;

    private WhiteColor: string = "WHITE";
    private RedColor: string = "RED";

    private _isActive = true;

    protected onLoad(): void {
        this._diceLandingPoint.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
    }

    private TouchEnd(): void{
        console.log("WasClicked");
        if(!this._isActive) return;
        if(this._condition == DiceConditions.lock && this.HasActiveTween(this.DiceNode) == false){
            this._condition = DiceConditions.unlock;
            this.ChangeVisualToUnlock();
        } 
        else if (this._condition == DiceConditions.unlock && this.HasActiveTween(this.DiceNode) == false) 
        {
            this._condition = DiceConditions.lock;
            this.ChangeVisualToLock();
        }
    }   

    public Unlock(){
        this._condition = DiceConditions.unlock;
        this.ChangeVisualToUnlock();
    }

    public ChangeVisualToUnlock(): void{
        
        let nodeRotation: Vec3 = this.DiceNode.eulerAngles;

        tween(this.DiceNode).to(0.5,{
            eulerAngles: new Vec3(nodeRotation.x - 20, nodeRotation.y, nodeRotation.z)
        }, { easing: 'quintOut'}).start();
    }

    public ChangeVisualToLock(): void{
        
        let nodeRotation: Vec3 = this.DiceNode.eulerAngles;

        tween(this.DiceNode).to(0.5,{
            eulerAngles: new Vec3(nodeRotation.x + 20, nodeRotation.y, nodeRotation.z)
        }, { easing: 'quintOut'}).start();
    }

    private HasActiveTween(node: Node): boolean {
        const tweens = TweenSystem.instance.ActionManager;
        if(tweens.getNumberOfRunningActionsInTarget(node) > 0){
            return true;
        }
        return false;
    }

    public RollToNumber(number: number){
        let oppositeNumber = number;
        switch(oppositeNumber){
            case 1:
                this._DiceChildren.lookAt(this._nodeOne.worldPosition);
                break;
            case 2:
                this._DiceChildren.lookAt(this._nodeTwo.worldPosition);
                break;
            case 3:
                this._DiceChildren.lookAt(this._nodeThree.worldPosition);
                break;
            case 4:
                this._DiceChildren.lookAt(this._nodeFour.worldPosition);
                break;
            case 5:
                this._DiceChildren.lookAt(this._nodeFive.worldPosition);
                break;
            case 6:
                this._DiceChildren.lookAt(this._nodeSix.worldPosition);
                break;
        }
    }
    
    public SetToDeactive(){
        this._isActive = false;
    }
    
    public SetToActive(){
        this._isActive = true;
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

    public set DiceLandingPointWorldPosition(position :Vec3){
        this._diceLandingPoint.setWorldPosition(position);
    }

    public get DiceLandingPointWorldPosition(): Vec3{
        return this._diceLandingPoint.getWorldPosition();
    }
}


