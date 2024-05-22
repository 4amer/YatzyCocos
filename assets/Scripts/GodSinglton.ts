import { _decorator, Component, Game, Node } from 'cc';
import { GameView } from '../UI/Views/GameView';
import GameModel from '../UI/Models/GameModel';
import { RestartView } from '../UI/Views/RestartView';
import { ViewManager } from '../UI/ViewManager';
const { ccclass, property } = _decorator;

@ccclass('GodSinglton')
export class GodSinglton extends Component{

    @property({visible: true, type: GameView}) private _gameView: GameView = null;
    @property({visible: true, type: RestartView}) private _restartView: RestartView = null;
    @property({visible: true, type: ViewManager}) private _viewManager: ViewManager = null;

    public static gameView: GameView = null;
    public static restartView: RestartView = null;
    public static gameModel: GameModel = null;
    public static viewManager: ViewManager = null;

    protected onLoad(): void {
        GodSinglton.gameView = this._gameView.getComponent(GameView);
        GodSinglton.restartView = this._restartView.getComponent(RestartView);
        GodSinglton.viewManager = this._viewManager.getComponent(ViewManager);
    }

    protected start(): void {
        GodSinglton.gameModel = GameModel.Instance;
    }
}

