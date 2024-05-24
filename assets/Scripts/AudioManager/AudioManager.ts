import { _decorator, Component, Node } from 'cc';
import { SoundNames } from './SoundNames/SoundNames';
import { ExtandAudioSource } from './SoundNames/ExtandAudioSource';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property({ visible: true, type: Node}) private _audioItemContainer: Node = null;
    @property({ visible: true, type: [ExtandAudioSource]}) private _audioSources: ExtandAudioSource[] = [];

    private _audioItemsMap: Map<number, Array<ExtandAudioSource>> = new Map<number, Array<ExtandAudioSource>>();

    protected start(): void {
        this.GetAllItemsFromContainer();
    }

    public Play(name: SoundNames){
        let itemArray = this._audioItemsMap.get(name);
        let isPlayed = false;
        for(let i = 0; i < itemArray.length; i++){
            if(itemArray[i].playing == false){
                itemArray[i].play();
                isPlayed = true;
                return;
            }
        }
        if(isPlayed) return;
        let item = this.CreateNewItem(itemArray[0]);
        item.play();
    }

    public Stop(name: SoundNames){
        let itemArray = this._audioItemsMap.get(name);
        itemArray.forEach((item) => {
            item.stop();
        })
    }

    private GetAllItemsFromContainer(): void {
        const containerItems: Array<ExtandAudioSource> = this._audioItemContainer.getComponents(ExtandAudioSource);
        if(containerItems.length == 0){
            this.CreateEachItemByOne();
        }
    }

    private CreateEachItemByOne(){
        this._audioSources.forEach((element) => {
            this.CreateNewItem(element);
        });
        
    }

    private CreateNewItem(audioItem :ExtandAudioSource): ExtandAudioSource{
        let item = this._audioItemContainer.addComponent(ExtandAudioSource);
        item.Init(audioItem.SoundName, audioItem.clip, audioItem.volume);
        let audioItems: Array<ExtandAudioSource> = new Array<ExtandAudioSource>;
        if(this._audioItemsMap.has(audioItem.SoundName)){
            audioItems = this._audioItemsMap.get(audioItem.SoundName);
        }
        audioItems.push(item);
        this._audioItemsMap.set(audioItem.SoundName, audioItems);
        return item;
    }
}