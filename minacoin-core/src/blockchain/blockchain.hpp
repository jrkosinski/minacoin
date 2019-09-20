#ifndef __BLOCKCHAIN_H__
#define __BLOCKCHAIN_H__

#include "../inc.h"
#include <vector>
#include "block.hpp" 
#include "iblockdataitem.hpp" 
#include "../ijsonserializable.hpp" 
#include "../loggingobj.hpp" 
	
using namespace minacoin::util::logging;

namespace minacoin::blockchain {

	class Blockchain: public IJsonSerializable, LoggingObj {
		private: 
			vector<Block*> _chain; 
			
		public: 
			size_t height() const; 
			Block* blockAt(size_t index) const; 
			Block* lastBlock() const;
		
		public: 
			Blockchain(); 
			~Blockchain();
			
		public: 
			Block* addBlock(const vector<IBlockDataItem*>& data); 
			void replaceChain(const vector<Block*>& chain);  
        	vector<IBlockDataItem*> getDataItems() const;
			bool containsDataItem(const std::string& id) const; 
			
		public: 
			static bool isValidChain(const vector<Block*>& chain); 
			static Blockchain* createFromJson(const string& json);
			
		public: 
			string toJson() const override;
			void fromJson(const string& json) override;
			
		private: 
			void clearChain();
	}; 
}

#endif
