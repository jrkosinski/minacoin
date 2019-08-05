package chain

import (
	."../block"
	."../output"
)

type Chain struct {
	Difficulty 		int
	Blocks			[]Block
	Utxos			map[string]Output
}

func (this *Chain) New(difficulty int) {
	this.Difficulty = difficulty
	this.Blocks = make([]Block, 0)
	this.Utxos = make(map[string]Output)
}

//not done
func (this *Chain) ValidateBlock(b *Block, index int) bool {
	return false
}

//DONE
func (this *Chain) Size() int {
	return len(this.Blocks)
}

//DONE
func (this *Chain) LastBlock() *Block {
	size := this.Size()
	if size > 0 {
		return &(this.Blocks[size-1])
	} else {
		return nil
	}
}

//DONE
func (this *Chain) AddBlock(b *Block) bool {
	if this.Size() == 0  {
		this.Blocks = append(this.Blocks, *b)
	} else {
		if  this.ValidateBlock(b, this.Size()) {
			this.Blocks = append(this.Blocks, *b)
		} else {
			return false
		}
	}

	return true
}

//DONE
func (this *Chain) BlockExists(b *Block) bool {
	for n := 0; n < this.Size(); n++ {
		if  this.Blocks[n].Hash == b.Hash {
			return true
		}
	}
	return false
}

//DONE
func (this *Chain) IsValid() bool {
	for n := 0; n < this.Size(); n++ {
		if !this.ValidateBlock(&(this.Blocks[n]), this.Size()) {
			return false
		}
	}
	return true;
}

//DONE
func (this *Chain) GetUtxos() []Output {
	output := make([]Output, 0)

	for _, v := range this.Utxos { 
		output = append(output, v)
	}

	return output
}

//DONE
func (this *Chain) GetUtxo(id string) Output {
	return this.Utxos[id]
}

//DONE
func (this *Chain) AddUtxo(o* Output) {
	//TODO: check for null
	this.Utxos[o.Id] = *o
}

//DONE
func (this *Chain) RemoveUtxo(id string) bool {
	if _, ok := this.Utxos[id]; ok {
		delete(this.Utxos, id) 
		return true
	}
	return false
}
