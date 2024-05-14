import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, RichText} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.lock;
    @property({visible: true, type: CCInteger}) private _requestingNumber: number = 1;

    private WhiteColor: string = "WHITE";
    private RedColor: string = "RED";

    private _isActive = true;

    protected start(): void {
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
    }

    private TouchEnd(): void{
        if(!this._isActive) return;
        let text: RichText = this.node.getComponent(RichText);
        if(this._condition == DiceConditions.lock){
            this._condition = DiceConditions.unlock;
            text.string = `<color = ${this.WhiteColor}> ${this._requestingNumber} <color/>`;
        } 
        else if (this._condition == DiceConditions.unlock) 
        {
            this._condition = DiceConditions.lock;
            text.string = `<color = ${this.RedColor}> ${this._requestingNumber} <color/>`;
        }
    }   

    private Rewrite(): void{
        let text: RichText = this.node.getComponent(RichText);
        text.string = `${this._requestingNumber}`;
    }

    public set Condition(condition: DiceConditions){
        this._condition = condition;
    }

    public get Condition(): DiceConditions{
        return this._condition;
    }

    public set RequestingNumber(number: number){
        this._requestingNumber = number;
        this.Rewrite();
    }

    public get RequestingNumber(): number{
        return this._requestingNumber;
    }
}


