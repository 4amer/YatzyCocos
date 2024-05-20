import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, Quat, RichText, tween, Vec3} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.lock;
    @property({visible: true, type: CCInteger}) private _requestingValue: number = 1;
    
    @property({visible: true, type: Node}) private _DiceChildren: Node = null;

    @property({visible: true, type: Node}) private _NodeForClickEvent: Node = null;

    @property({visible: true, type: Node}) private _nodeOne: Node = null;
    @property({visible: true, type: Node}) private _nodeTwo: Node = null;
    @property({visible: true, type: Node}) private _nodeThree: Node = null;
    @property({visible: true, type: Node}) private _nodeFour: Node = null;
    @property({visible: true, type: Node}) private _nodeFive: Node = null;
    @property({visible: true, type: Node}) private _nodeSix: Node = null;

    private WhiteColor: string = "WHITE";
    private RedColor: string = "RED";

    //private _richText: RichText = null;

    private _isActive = true;

    protected onLoad(): void {
        this._NodeForClickEvent.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
        //this._richText = this.node.getComponent(RichText);
    }

    private TouchEnd(): void{
        console.log("WasClicked");
        if(!this._isActive) return;
        if(this._condition == DiceConditions.lock){
            this._condition = DiceConditions.unlock;
            this.ChangeVisualToUnlock();
        } 
        else if (this._condition == DiceConditions.unlock) 
        {
            this._condition = DiceConditions.lock;
            this.ChangeVisualToLock();
        }
    }   

    // private Rewrite(): void{
    //     this._richText.string = `${this._requestingValue}`;
    // }

    public Unlock(){
        this._condition = DiceConditions.unlock;
        this.ChangeVisualToUnlock();
    }

    public ChangeVisualToUnlock(): void{
        
        let nodeRotation: Vec3 = this.DiceNode.eulerAngles;
        //Quat.toEuler(nodeRotation, this.DiceNode.getWorldRotation());

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

    // public ClearTextField(): void{
    //     this._richText.string = "";
    // }

    public SetToDeactive(){
        this._isActive = false;
    }

    public SetToActive(){
        this._isActive = true;
    }

    public set Condition(condition: DiceConditions){
        this._condition = condition;
    }

    public get Condition(): DiceConditions{
        return this._condition;
    }

    public set RequestingValue(number: number){
        this._requestingValue = number;
        //this.Rewrite();
    }

    public get RequestingValue(): number{
        return this._requestingValue;
    }

    public get DiceNode(){
        return this.node;
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
}


