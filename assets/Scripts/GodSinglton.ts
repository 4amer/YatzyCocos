import { _decorator, Component, Game, Node } from 'cc';
import { GameView } from '../UI/Views/GameView';
import GameModel from '../UI/Models/GameModel';
import { RestartView } from '../UI/Views/RestartView';
import { ViewManager } from '../UI/ViewManager';
import { AudioManager } from './AudioManager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GodSinglton')
export class GodSinglton extends Component{

    @property({visible: true, type: GameView}) private _gameView: GameView = null;
    @property({visible: true, type: RestartView}) private _restartView: RestartView = null;
    @property({visible: true, type: ViewManager}) private _viewManager: ViewManager = null;
    @property({visible: true, type: AudioManager}) private _audioManager: AudioManager = null;

    public static gameView: GameView = null;
    public static restartView: RestartView = null;
    public static gameModel: GameModel = null;
    public static viewManager: ViewManager = null;
    public static audioManager: AudioManager = null;

    protected onLoad(): void {
        GodSinglton.gameView = this._gameView.getComponent(GameView);
        GodSinglton.restartView = this._restartView.getComponent(RestartView);
        GodSinglton.viewManager = this._viewManager.getComponent(ViewManager);
        GodSinglton.audioManager = this._audioManager.getComponent(AudioManager);
    }

    protected start(): void {
        GodSinglton.gameModel = GameModel.Instance;
    }
}

