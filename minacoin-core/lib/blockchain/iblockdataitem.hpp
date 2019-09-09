#ifndef __IBLOCK_DATA_ITEM_H__
#define __IBLOCK_DATA_ITEM_H__

using namespace std; 

namespace minacoin { namespace lib { namespace blockchain {
    class IBlockDataItem {
        public: 
            virtual string toJson() { return ""; }
            virtual void fromJson(string json) { }
    }; 
}}}

#endif 