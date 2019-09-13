#ifndef __IBLOCK_DATA_ITEM_H__
#define __IBLOCK_DATA_ITEM_H__

#include <string> 
#include "../ijsonserializable.hpp"

using namespace std; 
using namespace minacoin; 

namespace minacoin::blockchain {
    class IBlockDataItem: public IJsonSerializable {
        public: 
            virtual string id() = 0;
            virtual string toJson() = 0;
            virtual void fromJson(const string& json) = 0;
    }; 
}

#endif 