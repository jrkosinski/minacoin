#ifndef __ISERIALIZABLE_H__
#define __ISERIALIZABLE_H__

#include <string> 

namespace minacoin::lib {
    class IJsonSerializable {
        public: 
            virtual std::string toJson() = 0;
            virtual void fromJson(const std::string& json) = 0;
    }; 
}

#endif 
