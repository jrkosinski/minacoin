#ifndef __BLOCKCHAIN_H__
#define __BLOCKCHAIN_H__

#include <vector>
#include "block.hpp" 
#include "iblockdataitem.hpp" 
#include "../ijsonserializable.hpp" 
#include "../loggingobj.hpp" 
	
using namespace std; 
using namespace minacoin;
using namespace minacoin::util::logging;

namespace minacoin::blockchain {

	class Blockchain: public IJsonSerializable, LoggingObj {
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
			bool containsDataItem(const std::string& id); 
			
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
