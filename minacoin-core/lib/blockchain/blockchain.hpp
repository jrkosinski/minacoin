#ifndef __BLOCKCHAIN_H__
#define __BLOCKCHAIN_H__

#include <vector>
#include "block.hpp" 
#include "iblockdataitem.hpp" 
	
using namespace std; 

namespace minacoin { namespace lib { namespace blockchain {
	
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

	class Blockchain {
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
			
		public: 
			static bool isValidChain(vector<Block*>& chain); 
	}; 
}}}

#endif
