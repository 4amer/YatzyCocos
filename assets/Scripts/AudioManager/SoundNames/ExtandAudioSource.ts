import { _decorator, AudioClip, AudioSource, Component, Enum, Node } from 'cc';
import { SoundNames } from './SoundNames';
const { ccclass, property } = _decorator;

@ccclass('ExtandAudioSource')
export class ExtandAudioSource extends AudioSource {
    @property({ visible: true, type: Enum(SoundNames) }) private _soundName: SoundNames = SoundNames.None;

    // private _isPlaying = false;
    // private _isPaused = false;

    // public Play(){
    //     this._audioClip.playOneShot(this._soundValue);
    //     this._isPlaying = true;
    //     this._isPaused = false;
    // }

    // public Pause(){
    //     this._audioClip.pause();
    //     this._isPaused = true;
    // }
    
    // public Stop(){
    //     this._audioClip.stop();
    //     this._isPlaying = false;
    // }
    
    public Init(name: SoundNames, audioClip: AudioClip, volume: number){
        this._soundName = name;
        this.clip = audioClip;
        this.volume = volume;
    }
    
    // public set Loop(bool: boolean){
    //     this._audioClip.setLoop(true);
    // }

    // public get Loop(): boolean{
    //     return this._audioClip.getLoop();
    // }

    // public get IsPoused(): boolean{
    //     return this._isPaused;
    // }

    // public get IsPLaying(): boolean{
    //     return this._isPlaying;
    // }

    // public get Item(): AudioItem{
    //     return this;
    // }

    public get SoundName(): SoundNames{
        return this._soundName;
    }

    // public get AudioClip(): AudioClip{
    //     return this._audioClip;
    // }
}


