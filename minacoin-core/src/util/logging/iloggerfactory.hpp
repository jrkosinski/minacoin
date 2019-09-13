#ifndef __ILOGGER_FACTORY_H__
#define __ILOGGER_FACTORY_H__

#include <string> 
#include "ilogger.hpp"

namespace minacoin::util::logging {
    class ILoggerFactory {
        public: 
            virtual std::shared_ptr<ILogger> createLogger() =0;  
            virtual std::shared_ptr<ILogger> createLogger(const std::string& tag) =0;
    }; 
}

#endif 
