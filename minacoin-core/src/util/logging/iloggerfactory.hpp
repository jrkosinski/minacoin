#ifndef __ILOGGER_FACTORY_H__
#define __ILOGGER_FACTORY_H__

#include "../../inc.h"
#include "ilogger.hpp"

namespace minacoin::util::logging {
    
	/**
	 * Defines an interface for a class factory which outputs ILogger instances. 
	 */ 
    class ILoggerFactory {
        public: 
            virtual std::shared_ptr<ILogger> createLogger() __abstract_method__;  
            virtual std::shared_ptr<ILogger> createLogger(const std::string& tag) __abstract_method__; 
    }; 
}

#endif 
