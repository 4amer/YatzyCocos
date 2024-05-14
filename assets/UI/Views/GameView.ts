import { _decorator, Button, Component, Node, RichText, Toggle } from 'cc';
import { GameModel } from '../Models/GameModel';
import { GamePresenter } from '../Presentor/GamePresenter';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({visible: true, type: Button}) private _moveButton: Button = null; 
    @property({visible: true, type: Button}) private _throwButton: Button = null; 
    @property({visible: true, type: [Toggle]}) private _toggles: Toggle[] = []; 
    @property({visible: true, type: [RichText]}) private _dices: RichText[] = []; 

    private _gameModel: GameModel = null;
    private _gamePresentor: GamePresenter = null;

    private nextMove(): void{
        
    }

    private Throw(): void{

    }
}


