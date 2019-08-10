package chain

import (
	"../block"
	"../output"
	"../utxomap"
)

type Chain struct {
	Difficulty 		int
	Blocks			[]block.Block
	Utxos			*utxomap.UtxoMap
}

func New(difficulty int) *Chain {
	output := &Chain{
		Difficulty: 10,
		Blocks: make([]block.Block, 0),
		Utxos: utxomap.New(),
	}
	return output
}

//not done
func (this *Chain) ValidateBlock(b *block.Block, index int) bool {
	return false
}

func (this *Chain) Size() int {
	return len(this.Blocks)
}

func (this *Chain) LastBlock() *block.Block {
	size := this.Size()
	if size > 0 {
		return &(this.Blocks[size-1])
	} else {
		return nil
	}
}

func (this *Chain) AddBlock(b *block.Block) bool {
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

func (this *Chain) BlockExists(b *block.Block) bool {
	for n := 0; n < this.Size(); n++ {
		if  this.Blocks[n].Hash == b.Hash {
			return true
		}
	}
	return false
}

func (this *Chain) IsValid() bool {
	for n := 0; n < this.Size(); n++ {
		if !this.ValidateBlock(&(this.Blocks[n]), this.Size()) {
			return false
		}
	}
	return true;
}

func (this *Chain) GetUtxos() []output.Output {
	return this.Utxos.GetAll()
}

func (this *Chain) GetUtxo(id string) output.Output {
	return this.Utxos.Get(id)
}

func (this *Chain) AddUtxo(o* output.Output) {
	this.Utxos.Add(o)
}

func (this *Chain) RemoveUtxo(id string) bool {
	return this.Utxos.Remove(id)
}
