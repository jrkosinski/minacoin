#ifndef __IBLOCK_DATA_ITEM_H__
#define __IBLOCK_DATA_ITEM_H__

#include <string> 

using namespace std; 

namespace minacoin { namespace lib { namespace blockchain {
    class IBlockDataItem {
        public: 
            virtual string toJson() = 0;
            virtual void fromJson(string json) = 0;
    }; 
}}}

#endif 