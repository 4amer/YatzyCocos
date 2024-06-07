import { _decorator, Component, Game, Node } from 'cc';
import { YatzyView as YatzyView } from '../UI/Views/YatzyView';
import YatzyModel from '../UI/Models/YatzyModel';
import { RestartView } from '../UI/Views/RestartView';
import { ViewManager } from '../UI/ViewManager';
import { AudioManager } from './AudioManager/AudioManager';
import { ZonkView } from '../UI/Views/ZonkView';
import { ZonkModel } from '../UI/Models/ZonkModel';
const { ccclass, property } = _decorator;

@ccclass('GodSinglton')
export class GodSinglton extends Component{

    @property({visible: true, type: YatzyView}) private _yatzyView: YatzyView = null;
    @property({visible: true, type: ZonkView}) private _zonkView: ZonkView = null;
    @property({visible: true, type: RestartView}) private _restartView: RestartView = null;
    @property({visible: true, type: ViewManager}) private _viewManager: ViewManager = null;
    @property({visible: true, type: AudioManager}) private _audioManager: AudioManager = null;

    public static yatzyView: YatzyView = null;
    public static zonkView: ZonkView = null;
    public static restartView: RestartView = null;
    public static yatzyModel: YatzyModel = null;
    public static zonkModel: ZonkModel = null;
    public static viewManager: ViewManager = null;
    public static audioManager: AudioManager = null;

    protected onLoad(): void {
        GodSinglton.yatzyView = this._yatzyView.getComponent(YatzyView);
        GodSinglton.zonkView = this._zonkView.getComponent(ZonkView);
        GodSinglton.restartView = this._restartView.getComponent(RestartView);
        GodSinglton.viewManager = this._viewManager.getComponent(ViewManager);
        GodSinglton.audioManager = this._audioManager.getComponent(AudioManager);
    }

    protected start(): void {
        GodSinglton.yatzyModel = YatzyModel.Instance;
        GodSinglton.zonkModel = ZonkModel.Instance;
    }
}

