#ifndef __ILOGGER_FACTORY_H__
#define __ILOGGER_FACTORY_H__

#include <string> 
#include "ilogger.hpp"

namespace minacoin::util::logging {
    class ILoggerFactory {
        public: 
            virtual ILogger* createLogger() =0; //TODO: should return shared_ptr
            virtual ILogger* createLogger(const std::string& tag) =0;
    }; 
}

#endif 
