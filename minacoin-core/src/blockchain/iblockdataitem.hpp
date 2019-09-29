#ifndef __IBLOCK_DATA_ITEM_H__
#define __IBLOCK_DATA_ITEM_H__

#include "../inc.h"
#include "../ijsonserializable.hpp"

namespace minacoin::blockchain {
    
	/**
     * Generic interface for a piece of data in a blockchain block. Data items are stored in 
     * a block as a list of JSON-serializable instances of this interface. 
	 */
    class IBlockDataItem: public IJsonSerializable {
        public: 
            virtual string id() const __abstract_method__;
            virtual string toJson() const __abstract_method__;
            virtual string getHash() const __abstract_method__; 
            virtual void fromJson(const string& json) __abstract_method__;
            virtual bool equals(const IBlockDataItem* item) const __abstract_method__;
            virtual bool equals(const IBlockDataItem& item) const __abstract_method__;
    }; 
}

#endif 