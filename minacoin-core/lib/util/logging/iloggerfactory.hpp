#ifndef __ILOGGER_FACTORY_H__
#define __ILOGGER_FACTORY_H__

#include <string> 
#include "ilogger.hpp"

namespace minacoin::lib::util::logging {
    class ILoggerFactory {
        public: 
            virtual ILogger* createLogger() =0; 
            virtual ILogger* createLogger(const std::string& tag) =0;
    }; 
}

#endif 
