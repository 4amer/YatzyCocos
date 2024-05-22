import { _decorator, Button, Component, Node, RichText, setPropertyEnumType } from 'cc';
import { ViewManager } from '../ViewManager';
import { AbstractView } from './AbstractView';
const { ccclass, property } = _decorator;

@ccclass('RestartView')
export class RestartView extends AbstractView {

    @property({ visible: true, type: RichText }) private _scoreText: RichText = null;

    public RestartButtonClicked(): void{
        this.node.emit("Restart");
    }

    public set FinalScore(number: number){
        this._scoreText.string = `${number}`;
    }
}


