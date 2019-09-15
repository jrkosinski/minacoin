#ifndef __IBLOCK_DATA_ITEM_H__
#define __IBLOCK_DATA_ITEM_H__

#include "../inc.h"
#include "../ijsonserializable.hpp"

namespace minacoin::blockchain {
    class IBlockDataItem: public IJsonSerializable {
        public: 
            virtual string id() __abstract_method__;
            virtual string toJson() __abstract_method__;
            virtual void fromJson(const string& json) __abstract_method__;
    }; 
}

#endif 