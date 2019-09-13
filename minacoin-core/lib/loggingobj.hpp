#ifndef __LOGGING_OBJ_H__
#define __LOGGING_OBJ_H__

#include "util/logging/ilogger.hpp" 
#include "ioc.hpp"
#include "util/logging/iloggerfactory.hpp" 
#include <string> 

using namespace minacoin::util::logging;

namespace minacoin {
    class LoggingObj {
        private: 
            ILogger* _logger; 
            std::string _logTag;
            
        public: 
            LoggingObj() {
                this->_logger = nullptr;
            }
            
            ~LoggingObj() { 
                delete _logger; 
            }
            
        public: 
            std::string logTag() {
                return this->_logTag;
            }
            
            void logTag(const std::string& value) {
                this->_logTag = value;
            }
            
            ILogger* logger() {
                if (!_logger) {
                    _logger = IOC::instance()->_resolve<ILoggerFactory>()->createLogger(this->logTag());
                }
                return this->_logger;
            }
    }; 
}

#endif 