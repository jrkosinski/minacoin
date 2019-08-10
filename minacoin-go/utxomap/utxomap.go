package utxomap

import (
	."../output"
)

type UtxoMap struct {
	Map map[string]Output
}


func (this *UtxoMap) New() {
	this.Map = make(map[string]Output)
}

func (this *UtxoMap) GetAll() []Output {
	output := make([]Output, 0)

	for _, v := range this.Map { 
		output = append(output, v)
	}

	return output
}

func (this *UtxoMap) Get(id string) Output {
	return this.Map[id]
}

func (this *UtxoMap) Add(o* Output) {
	//TODO: check for null
	this.Map[o.Id] = *o
}

func (this *UtxoMap) Remove(id string) bool {
	if _, ok := this.Map[id]; ok {
		delete(this.Map, id) 
		return true
	}
	return false
}