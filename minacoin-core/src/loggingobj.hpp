#ifndef __LOGGING_OBJ_H__
#define __LOGGING_OBJ_H__

#include "inc.h"
#include "util/logging/ilogger.hpp" 
#include "ioc.hpp"
#include "util/logging/iloggerfactory.hpp" 

using namespace minacoin::util::logging;

namespace minacoin {
    class LoggingObj {
        private: 
            shared_ptr<ILogger> _logger; 
            std::string _logTag;
            
        public: 
            LoggingObj() {
                this->_logger = nullptr;
            }
            
            ~LoggingObj() { 
            }
            
        public: 
            std::string logTag() {
                return this->_logTag;
            }
            
            void logTag(const std::string& value) {
                this->_logTag = value;
            }
            
            shared_ptr<ILogger> logger() {
                if (!_logger) {
                    _logger = IOC::resolve<ILoggerFactory>()->createLogger(this->logTag());
                }
                return this->_logger;
            }
    }; 
}

#endif 