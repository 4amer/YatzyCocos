import { _decorator, CCInteger, Color, ColorKey, Component, Enum, Input, Node, RichText} from 'cc';
import { DiceConditions } from './Enums/DiceConditions';
const { ccclass, property } = _decorator;

@ccclass('DiceInfo')
export class Dice extends Component {
    @property({visible: true, type: Enum(DiceConditions)}) private _condition: DiceConditions = DiceConditions.lock;
    @property({visible: true, type: CCInteger}) private _requestingValue: number = 1;

    private WhiteColor: string = "WHITE";
    private RedColor: string = "RED";

    private _richText: RichText = null;

    private _isActive = true;

    protected start(): void {
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
        this._richText = this.node.getComponent(RichText);
    }

    private TouchEnd(): void{
        if(!this._isActive) return;
        if(this._condition == DiceConditions.lock){
            this._condition = DiceConditions.unlock;
            this.ChangeTextColorToWhite();
        } 
        else if (this._condition == DiceConditions.unlock) 
        {
            this._condition = DiceConditions.lock;
            this.ChangeTextColorToRed();
        }
    }   

    private Rewrite(): void{
        this._richText.string = `${this._requestingValue}`;
    }

    public Unlock(){
        this._condition = DiceConditions.unlock;
        this._richText.string = `<color = ${this.WhiteColor}> ${this._requestingValue} <color/>`;
    }

    public ChangeTextColorToRed(): void{
        this._richText.string = `<color = ${this.RedColor}> ${this._requestingValue} <color/>`;
    }

    public ChangeTextColorToWhite(): void{
        this._richText.string = `<color = ${this.WhiteColor}> ${this._requestingValue} <color/>`;
    }

    public ClearTextField(): void{
        this._richText.string = "";
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


