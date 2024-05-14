import { _decorator, Component, Game, Node } from 'cc';
import { GameView } from '../UI/Views/GameView';
import GameModel from '../UI/Models/GameModel';
const { ccclass, property } = _decorator;

@ccclass('GodSinglton')
export class GodSinglton extends Component{

    @property({visible: true, type: GameView}) private _gameView: GameView = null;

    public static gameView: GameView = null;
    public static gameModel: GameModel = null;

    protected onLoad(): void {
        GodSinglton.gameView = this._gameView.getComponent(GameView);
    }

    protected start(): void {
        GodSinglton.gameModel = GameModel.Instance;
    }
}

