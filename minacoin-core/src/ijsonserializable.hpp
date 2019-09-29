#ifndef __ISERIALIZABLE_H__
#define __ISERIALIZABLE_H__

#include "inc.h"

namespace minacoin {
    
	/**
	 * Defines an object whose state can be serialized to a JSON string, and deserialized from a 
     * JSON string. 
	 */ 
    class IJsonSerializable {
        public: 
            virtual std::string toJson() const __abstract_method__;
            virtual void fromJson(const std::string& json) __abstract_method__; 
    }; 
}

#endif 
