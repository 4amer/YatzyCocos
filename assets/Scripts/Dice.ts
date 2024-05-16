import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, RichText} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.lock;
    @property({visible: true, type: CCInteger}) private _requestingValue: number = 1;

    private _text: RichText = this.node.getComponent(RichText);

    private WhiteColor: string = "WHITE";
    private RedColor: string = "RED";

    private _isActive = true;

    protected start(): void {
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
    }

    private TouchEnd(): void{
        if(!this._isActive) return;
        if(this._condition == DiceConditions.lock){
            this._condition = DiceConditions.unlock;
            this._text.string = `<color = ${this.WhiteColor}> ${this._requestingValue} <color/>`;
        } 
        else if (this._condition == DiceConditions.unlock) 
        {
            this._condition = DiceConditions.lock;
            this._text.string = `<color = ${this.RedColor}> ${this._requestingValue} <color/>`;
        }
    }   

    private Rewrite(): void{
        this._text.string = `${this._requestingValue}`;
    }

    public Unlock(){
        this._condition = DiceConditions.unlock;
        this._text.string = `<color = ${this.WhiteColor}> ${this._requestingValue} <color/>`;
    }

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
        this.Rewrite();
    }

    public get RequestingValue(): number{
        return this._requestingValue;
    }
}


