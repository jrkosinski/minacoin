#ifndef __LOGGING_OBJ_H__
#define __LOGGING_OBJ_H__

#include "inc.h"
#include "util/logging/ilogger.hpp" 
#include "ioc.hpp"
#include "util/logging/iloggerfactory.hpp" 

using namespace minacoin::util::logging;

namespace minacoin {
    
	/**
	 * Defines basic functionality for an object which contains a logger and can write information 
     * about itself and its actions to the log. 
	 */ 
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
            
            void initLogger(const std::string& value) {
                this->_logTag = value;
                if (!_logger) {
                    _logger = IOC::resolve<ILoggerFactory>()->createLogger(this->logTag());
                }
            }
            
            shared_ptr<ILogger> logger() const {
                return this->_logger;
            }
    }; 
}

#endif 