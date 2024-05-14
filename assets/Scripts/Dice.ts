import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, RichText} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.lock;
    @property({visible: true, type: CCInteger}) private _requestingNumber: number = 1;

    private _whiteColor: string = "WHITE";
    private _redColor: string = "RED";
    protected start(): void {
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
        //this.node.on(Input.EventType.MOUSE_UP, this.TouchEnd, this);
    }

    private TouchEnd(): void{
        let text: RichText = this.node.getComponent(RichText);
        if(this._condition == DiceConditions.lock){
            this._condition = DiceConditions.unlock;
            text.string = `<color = ${this._whiteColor}> ${this._requestingNumber} <color/>`;
        } 
        else if (this._condition == DiceConditions.unlock) 
        {
            this._condition = DiceConditions.lock;
            text.string = `<color = ${this._redColor}> ${this._requestingNumber} <color/>`;
        }
    }   

    public set condition(condition: DiceConditions){
        this._condition = condition;
    }

    public get condition(): DiceConditions{
        return this._condition;
    }

    public set requestingNumber(number: number){
        this._requestingNumber = number;
    }

    public get requestingNumber(): number{
        return this._requestingNumber;
    }
}


