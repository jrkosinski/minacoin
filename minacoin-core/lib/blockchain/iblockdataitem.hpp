#ifndef __IBLOCK_DATA_ITEM_H__
#define __IBLOCK_DATA_ITEM_H__

#include <string> 
#include "../ijsonserializable.hpp"

using namespace std; 
using namespace minacoin::lib; 

namespace minacoin::lib::blockchain {
    class IBlockDataItem: public IJsonSerializable {
        public: 
            virtual string toJson() = 0;
            virtual void fromJson(const string& json) = 0;
    }; 
}

#endif 