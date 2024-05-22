import { _decorator, Component, Enum, Node } from 'cc';
import { WindowTypes } from '../WindowTypes/WindowTypes';
const { ccclass, property } = _decorator;

@ccclass('AbstractView')
export abstract class AbstractView extends Component 
{
    @property({ visible: true, type: Enum(WindowTypes) }) private _type: WindowTypes = WindowTypes.None;

    public Show(){
        this.node.active = true;
    }
    
    public Hide(){
        this.node.active = false;
    }

    public get WindowType(): WindowTypes{
        return this._type;
    }
}


