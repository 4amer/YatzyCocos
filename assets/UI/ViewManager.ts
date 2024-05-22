import { _decorator, Component, Node, view } from 'cc';
import { AbstractView } from './Views/AbstractView';
import { WindowTypes } from './WindowTypes/WindowTypes';
const { ccclass, property } = _decorator;

@ccclass('ViewManager')
export class ViewManager extends Component 
{
    @property({ visible: true , type: AbstractView}) private _startingView: AbstractView = null;
    @property({ visible: true , type: [AbstractView]}) private _views: AbstractView[] = [];

    private _currentView: AbstractView = null;

    public Show(type: WindowTypes): void{

        for (let i = 0; i < this._views.length; i++) {
            if (this._views[i].WindowType === type) {
                this._views[i].Show();
                return;
            }
        }
    }

    public Hide(type: WindowTypes): void{

        for (let i = 0; i < this._views.length; i++) {
            if (this._views[i].WindowType === type) {
                this._views[i].Hide();
                return;
            }
        }
    }

    protected start(): void {
        this._views.forEach((element) => {
            element.Hide();
        })

        if(this._startingView != null) {
            this._startingView.Show();
            this._currentView = this._startingView;
        }
    }
}


