import { _decorator, AudioClip, AudioSource, Component, Enum, Node } from 'cc';
import { SoundNames } from './SoundNames';
const { ccclass, property } = _decorator;

@ccclass('ExtandAudioSource')
export class ExtandAudioSource extends AudioSource {
    @property({ visible: true, type: Enum(SoundNames) }) private _soundName: SoundNames = SoundNames.None;
    
    public Init(name: SoundNames, audioClip: AudioClip, volume: number){
        this._soundName = name;
        this.clip = audioClip;
        this.volume = volume;
    }

    public get SoundName(): SoundNames{
        return this._soundName;
    }
}


