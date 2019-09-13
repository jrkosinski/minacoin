#ifndef __BLOCKCHAIN_H__
#define __BLOCKCHAIN_H__

#include <vector>
#include "block.hpp" 
#include "iblockdataitem.hpp" 
#include "../ijsonserializable.hpp" 
	
using namespace std; 
using namespace minacoin;

namespace minacoin::blockchain {
	
	typedef unsigned char byte; 

	/*
	 * # growable array 
	 * # strings 
	 * 3. memory cleanup 
	 * # crypto 
	 * # transactions 
	 * # namespaces 
	 * # json lib
	 */

	class Blockchain: public IJsonSerializable {
		private: 
			vector<Block*> _chain; 
			
		public: 
			size_t height(); 
			Block* blockAt(size_t index); 
			Block* lastBlock();
		
		public: 
			Blockchain(); 
			~Blockchain();
			
		public: 
			Block* addBlock(vector<IBlockDataItem*>& data); 
			void replaceChain(vector<Block*>& chain); 
        	vector<IBlockDataItem*> getDataItems();
			
		public: 
			static bool isValidChain(vector<Block*>& chain); 
			static Blockchain* createFromJson(const string& json);
			
		public: 
			string toJson() override;
			void fromJson(const string& json) override;
			
		private: 
			void clearChain();
	}; 
}

#endif
