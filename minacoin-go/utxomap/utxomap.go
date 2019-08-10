package utxomap

import (
	"../output"
)

type UtxoMap struct {
	Map map[string]output.Output
}

func New() *UtxoMap {
	output := &UtxoMap{Map: make(map[string]output.Output)}
	return output
}

func (this *UtxoMap) GetAll() []output.Output {
	output := make([]output.Output, 0)

	for _, v := range this.Map { 
		output = append(output, v)
	}

	return output
}

func (this *UtxoMap) Get(id string) output.Output {
	return this.Map[id]
}

func (this *UtxoMap) Add(o* output.Output) {
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