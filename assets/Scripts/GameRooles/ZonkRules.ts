import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZonkRules')
export class ZonkRules extends Component {
    private _isExtraThrow: boolean = false;

    private _ThreeInRaw: number[] = Array<number>(1000, 200, 300, 400, 500, 600);
    private _One = 100;
    private _Five = 50;

    public HasCombinations(map: Map<number, number>): boolean{
        var sortMap = new Map([...map.entries()].sort());
        if(this.HasSpacificNumber(1,sortMap) || this.HasSpacificNumber(5,sortMap) || this.HasThreeOrMoreCombo(sortMap) 
            || this.HasThreePairs(sortMap) || this.HasStreet(sortMap)){
                return true;
        }
        return false;
    }

    public CountScores(pickedDiceValues: Map<number, number>): number{
        var sortMap = new Map([...pickedDiceValues.entries()].sort());
        let scourSum: number = 0;

        if(this.HasStreet(sortMap)){
            scourSum = 1500;
            this._isExtraThrow = true;
        } else if(this.HasThreePairs(sortMap)){
            scourSum = 750;
            this._isExtraThrow = true;
        }

        const sortMapKeys = sortMap.keys();
        sortMap.forEach((element) => {
            const keyValue = sortMapKeys.next().value;
            if(element >= 3){
                scourSum += this._ThreeInRaw[keyValue - 1] * (element - 2);
                return;
            } else if(element >= 1){
                switch(keyValue){
                    case 1:
                        scourSum += this._One * element;
                        break;
                    case 5:
                        scourSum += this._Five * element;
                        break;
                }
            }
        })

        return scourSum;
    }

    public get IsExtraThrow(): boolean{
        return this._isExtraThrow;
    }

    private HasSpacificNumber(num: number, map: Map<number, number>): boolean{
        if(map.has(1)){
            return true;
        }
        return false;
    }
    private HasThreeOrMoreCombo(map: Map<number, number>): boolean{
        map.forEach((element) => {
            if(element >= 3){
                return true;
            }
        })
        return false;
    }
    private HasThreePairs(map: Map<number, number>): boolean{
        let counter: number = 0;
        for(let i = 0; i < map.size; i++){
            if(map[i] == 2){
                counter += 1;
            }
        }
        if(counter == 3){
            return true;
        }
        return false;
    }
    private HasStreet(map: Map<number, number>){
        let counter: number = 0;
        for(let i = 0; i < map.size; i++){
            if(map[i] == 1){
                counter += 1;
            }
        }
        if(counter == 6){
            return true;
        }
        return false;
    }
}


