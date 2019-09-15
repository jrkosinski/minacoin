#ifndef __ISERIALIZABLE_H__
#define __ISERIALIZABLE_H__

#include "inc.h"

namespace minacoin {
    class IJsonSerializable {
        public: 
            virtual std::string toJson() __abstract_method__;
            virtual void fromJson(const std::string& json) __abstract_method__; 
    }; 
}

#endif 
